/**
 * TYPING DOJO SOUND — procedural music and effects, synthesised in WebAudio.
 *
 * WHY NO AUDIO FILES. Same reasoning as services/chime.js: nothing to
 * download, nothing to fail to load, and — the real reason here — the music
 * can REACT. Tempo rises with the game's waves, layers come in as the
 * learner's combo grows, and every correct key can play a note from the
 * chord that is sounding, so a clean run of typing literally makes music
 * and a mistake breaks the melody. That feedback loop is the point.
 *
 * Architecture: a look-ahead step sequencer (setInterval wakes every 25ms
 * and schedules the next ~120ms of sixteenth notes on the audio clock), so
 * timing stays tight even when React is busy rendering keystrokes.
 *
 * Everything is optional and remembered: music, effects, key sound style and
 * both volumes persist in localStorage. Audio starts only after a click —
 * browsers require that, and a tutor that blares on page load is hostile.
 */

const SETTINGS_KEY = "ac-typing-sound";

const DEFAULTS = {
  music: true,
  sfx: true,
  musicVolume: 0.55,
  sfxVolume: 0.7,
  keySound: "musical", // musical | click | off
};

const CHORDS = {
  m: [0, 3, 7],
  M: [0, 4, 7],
  m7: [0, 3, 7, 10],
  M7: [0, 4, 7, 11],
  d7: [0, 4, 7, 10],
  sus: [0, 5, 7],
};

/**
 * Themes. `prog` is [semitones from root, chord quality] per chord; each chord
 * lasts `barsPerChord` bars. Patterns are 16 steps; 1 = hit.
 */
export const THEMES = {
  focus: {
    name: "Focus Lo-fi",
    root: 220, // A3
    bpm: 82,
    swing: 0.12,
    barsPerChord: 1,
    prog: [[0, "m7"], [-4, "M7"], [3, "M7"], [-2, "d7"]],
    kick: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    bass: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    arp: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    pad: "triangle",
    lead: "sine",
    maxIntensity: 3,
  },
  arcade: {
    name: "Neon Arcade",
    root: 146.83, // D3
    bpm: 112,
    swing: 0,
    barsPerChord: 1,
    prog: [[0, "m"], [-4, "M"], [3, "M"], [-2, "M"]],
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    bass: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    arp: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    pad: "sawtooth",
    lead: "square",
    maxIntensity: 3,
  },
  race: {
    name: "Turbo Drive",
    root: 164.81, // E3
    bpm: 138,
    swing: 0,
    barsPerChord: 2,
    prog: [[0, "m"], [-4, "M"], [3, "M"], [-2, "M"]],
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    hat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bass: [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    arp: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
    pad: "sawtooth",
    lead: "sawtooth",
    maxIntensity: 3,
  },
};

const hz = (root, semi) => root * Math.pow(2, semi / 12);

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.settings = { ...DEFAULTS, ...this.readSettings() };
    this.theme = null;
    this.timer = null;
    this.step = 0;
    this.bar = 0;
    this.nextTime = 0;
    this.bpm = 100;
    this.intensity = 1;
    this.keyIndex = 0;
    this.listeners = new Set();
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (!this.ctx) return;
        if (document.hidden) this.ctx.suspend?.().catch(() => {});
        else if (this.theme || this.settings.sfx) this.ctx.resume?.().catch(() => {});
      });
    }
  }

  /* ── settings ── */

  readSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  set(patch) {
    this.settings = { ...this.settings, ...patch };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      /* still applies for this session */
    }
    this.applyVolumes();
    if (patch.music === false) this.silenceMusic();
    if (patch.music === true && this.theme && !this.timer) this.startSequencer();
    this.listeners.forEach((fn) => fn(this.settings));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /* ── graph ── */

  ensure() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      try {
        this.ctx = new Ctor();
      } catch {
        return null;
      }
      const c = this.ctx;
      this.comp = c.createDynamicsCompressor();
      this.comp.threshold.value = -14;
      this.comp.ratio.value = 4;
      this.master = c.createGain();
      this.master.gain.value = 0.9;
      this.musicBus = c.createGain();
      this.sfxBus = c.createGain();
      this.musicBus.connect(this.comp);
      this.sfxBus.connect(this.comp);
      this.comp.connect(this.master).connect(c.destination);

      // A feedback delay for the lead, so the arcade themes have space.
      this.delay = c.createDelay(1);
      this.delayFb = c.createGain();
      this.delayWet = c.createGain();
      this.delay.delayTime.value = 0.27;
      this.delayFb.gain.value = 0.32;
      this.delayWet.gain.value = 0.22;
      this.delay.connect(this.delayFb).connect(this.delay);
      this.delay.connect(this.delayWet).connect(this.musicBus);

      // One second of white noise, reused by every drum and click.
      const len = c.sampleRate;
      this.noise = c.createBuffer(1, len, c.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.applyVolumes();
    }
    if (this.ctx.state === "suspended") this.ctx.resume?.().catch(() => {});
    return this.ctx;
  }

  applyVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const m = this.settings.music ? this.settings.musicVolume * 0.32 : 0;
    const s = this.settings.sfx ? this.settings.sfxVolume * 0.55 : 0;
    this.musicBus.gain.setTargetAtTime(m, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(s, t, 0.02);
  }

  /* ── voices ── */

  tone(freq, { when = 0, dur = 0.2, type = "sine", gain = 0.2, attack = 0.005, bus, cutoff, q = 1, detune = 0, send = 0, glideTo } = {}) {
    const c = this.ctx;
    if (!c) return;
    const t = when || c.currentTime;
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    osc.detune.value = detune;
    let node = osc;
    if (cutoff) {
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(cutoff, t);
      f.Q.value = q;
      osc.connect(f);
      node = f;
    }
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.linearRampToValueAtTime(gain, t + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    node.connect(amp).connect(bus || this.sfxBus);
    if (send) {
      const s = c.createGain();
      s.gain.value = send;
      amp.connect(s).connect(this.delay);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  noiseHit({ when = 0, dur = 0.05, gain = 0.2, type = "highpass", freq = 7000, q = 0.8, bus } = {}) {
    const c = this.ctx;
    if (!c) return;
    const t = when || c.currentTime;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const amp = c.createGain();
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(amp).connect(bus || this.sfxBus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  }

  kick(t) {
    this.tone(150, { when: t, dur: 0.32, gain: 0.9, glideTo: 42, bus: this.musicBus });
  }
  snare(t) {
    this.noiseHit({ when: t, dur: 0.16, gain: 0.35, type: "bandpass", freq: 1800, q: 0.7, bus: this.musicBus });
    this.tone(190, { when: t, dur: 0.09, gain: 0.25, type: "triangle", bus: this.musicBus });
  }
  hat(t, open = false) {
    this.noiseHit({ when: t, dur: open ? 0.14 : 0.035, gain: 0.16, freq: 8000, bus: this.musicBus });
  }

  /* ── music ── */

  playTheme(id, { intensity = 1, bpm } = {}) {
    if (!this.ensure()) return;
    const theme = THEMES[id] || THEMES.focus;
    this.theme = theme;
    this.bpm = bpm || theme.bpm;
    this.intensity = Math.min(theme.maxIntensity, intensity);
    if (this.settings.music) this.startSequencer();
  }

  startSequencer() {
    if (!this.ctx || this.timer) return;
    this.step = 0;
    this.bar = 0;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.tick(), 25);
  }

  silenceMusic() {
    clearInterval(this.timer);
    this.timer = null;
  }

  stopMusic() {
    this.silenceMusic();
    this.theme = null;
  }

  setTempo(bpm) {
    this.bpm = Math.max(50, Math.min(190, bpm));
  }

  setIntensity(level) {
    if (!this.theme) return;
    this.intensity = Math.max(0, Math.min(this.theme.maxIntensity, level));
  }

  chordNow() {
    const th = this.theme || THEMES.focus;
    const idx = Math.floor(this.bar / th.barsPerChord) % th.prog.length;
    const [off, quality] = th.prog[idx];
    return { root: th.root, off, tones: CHORDS[quality] };
  }

  tick() {
    const c = this.ctx;
    if (!c || !this.theme) return;
    const sixteenth = 60 / this.bpm / 4;
    while (this.nextTime < c.currentTime + 0.12) {
      const swing = this.step % 2 === 1 ? this.theme.swing * sixteenth : 0;
      this.scheduleStep(this.step, this.nextTime + swing);
      this.nextTime += sixteenth;
      this.step++;
      if (this.step === 16) {
        this.step = 0;
        this.bar++;
      }
    }
  }

  scheduleStep(s, t) {
    const th = this.theme;
    const lvl = this.intensity;
    const { root, off, tones } = this.chordNow();
    const beat = 60 / this.bpm;

    // Pad: the whole chord, once per chord change, always on.
    if (s === 0 && this.bar % th.barsPerChord === 0) {
      const len = beat * 4 * th.barsPerChord;
      for (const semi of tones) {
        this.tone(hz(root, off + semi + 12), {
          when: t, dur: len * 0.98, type: th.pad, gain: 0.07, attack: len * 0.25,
          bus: this.musicBus, cutoff: 1100 + lvl * 500, detune: -6,
        });
        this.tone(hz(root, off + semi + 12), {
          when: t, dur: len * 0.98, type: th.pad, gain: 0.05, attack: len * 0.25,
          bus: this.musicBus, cutoff: 1100 + lvl * 500, detune: 7,
        });
      }
    }

    if (th.bass[s]) {
      this.tone(hz(root, off - 12), {
        when: t, dur: beat * 0.45, type: "sawtooth", gain: 0.22, bus: this.musicBus, cutoff: 380 + lvl * 120, q: 4,
      });
    }

    if (lvl >= 1 && th.hat[s]) this.hat(t, s === 14 && th === THEMES.focus);
    if (lvl >= 2 && th.kick[s]) this.kick(t);
    if (lvl >= 2 && th.snare[s]) this.snare(t);

    if (lvl >= 3 && th.arp[s]) {
      const seq = [...tones, tones[1] + 12, tones[0] + 12, tones[2]];
      const semi = seq[(s + this.bar) % seq.length];
      this.tone(hz(root, off + semi + 24), {
        when: t, dur: beat * 0.3, type: th.lead, gain: 0.05, bus: this.musicBus, cutoff: 2600, send: 0.6,
      });
    }
  }

  /* ── effects ── */

  /** A correct keystroke. */
  key(combo = 0) {
    if (!this.settings.sfx || !this.ensure()) return;
    const style = this.settings.keySound;
    if (style === "off") return;
    if (style === "click") {
      this.noiseHit({ dur: 0.025, gain: 0.25, type: "bandpass", freq: 3200 + Math.random() * 600, q: 1.2 });
      this.tone(1800, { dur: 0.015, gain: 0.04, type: "square" });
      return;
    }
    // Musical: walk up through the sounding chord as the combo grows.
    const { root, off, tones } = this.chordNow();
    const octave = Math.min(2, Math.floor(combo / 25));
    const semi = tones[this.keyIndex++ % tones.length] + 12 * (1 + octave);
    this.tone(hz(root, off + semi + 12), { dur: 0.16, gain: 0.09, type: "triangle", attack: 0.003 });
    this.noiseHit({ dur: 0.012, gain: 0.05, type: "bandpass", freq: 4200, q: 1 });
  }

  error() {
    if (!this.settings.sfx || !this.ensure()) return;
    this.keyIndex = 0;
    this.tone(110, { dur: 0.16, gain: 0.16, type: "square", cutoff: 600, glideTo: 82 });
  }

  word(combo = 0) {
    if (!this.settings.sfx || !this.ensure()) return;
    const { root, off, tones } = this.chordNow();
    const step = Math.min(6, Math.floor(combo / 5));
    this.tone(hz(root, off + tones[step % tones.length] + 24 + (step >= 3 ? 12 : 0)), {
      dur: 0.22, gain: 0.08, type: "sine",
    });
  }

  explode() {
    if (!this.settings.sfx || !this.ensure()) return;
    this.noiseHit({ dur: 0.35, gain: 0.35, type: "lowpass", freq: 900, q: 0.5 });
    this.tone(180, { dur: 0.25, gain: 0.2, type: "triangle", glideTo: 50 });
  }

  combo(level = 1) {
    if (!this.settings.sfx || !this.ensure()) return;
    const t = this.ctx.currentTime;
    const notes = [0, 4, 7, 12, 16].slice(0, 2 + Math.min(3, level));
    notes.forEach((n, i) => this.tone(hz(523.25, n), { when: t + i * 0.06, dur: 0.2, gain: 0.09, type: "square", cutoff: 3000 }));
  }

  levelUp() {
    if (!this.settings.sfx || !this.ensure()) return;
    const t = this.ctx.currentTime;
    [0, 4, 7, 12, 7, 12, 16, 19].forEach((n, i) =>
      this.tone(hz(392, n), { when: t + i * 0.085, dur: 0.3, gain: 0.1, type: i < 4 ? "square" : "triangle", cutoff: 3500 })
    );
  }

  star(n = 1) {
    if (!this.settings.sfx || !this.ensure()) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < n; i++) {
      this.tone(hz(659.25, i * 5), { when: t + 0.25 + i * 0.28, dur: 0.5, gain: 0.12, type: "triangle" });
      this.tone(hz(659.25, i * 5 + 12), { when: t + 0.25 + i * 0.28, dur: 0.3, gain: 0.05, type: "sine" });
    }
  }

  lifeLost() {
    if (!this.settings.sfx || !this.ensure()) return;
    this.tone(330, { dur: 0.5, gain: 0.18, type: "sawtooth", glideTo: 90, cutoff: 1200 });
    this.noiseHit({ dur: 0.3, gain: 0.2, type: "lowpass", freq: 500 });
  }

  powerup() {
    if (!this.settings.sfx || !this.ensure()) return;
    this.tone(400, { dur: 0.35, gain: 0.12, type: "square", glideTo: 1600, cutoff: 4000 });
  }

  countdown(final = false) {
    if (!this.settings.sfx || !this.ensure()) return;
    this.tone(final ? 880 : 440, { dur: final ? 0.5 : 0.2, gain: 0.16, type: "square", cutoff: 2500 });
  }

  win() {
    if (!this.settings.sfx || !this.ensure()) return;
    const t = this.ctx.currentTime;
    [[0, 4, 7], [5, 9, 12], [7, 11, 14], [12, 16, 19]].forEach((ch, i) =>
      ch.forEach((n) => this.tone(hz(261.63, n), { when: t + i * 0.18, dur: i === 3 ? 0.9 : 0.25, gain: 0.07, type: "square", cutoff: 3000 }))
    );
  }

  lose() {
    if (!this.settings.sfx || !this.ensure()) return;
    const t = this.ctx.currentTime;
    [7, 6, 5, 0].forEach((n, i) => this.tone(hz(220, n), { when: t + i * 0.22, dur: 0.4, gain: 0.12, type: "triangle" }));
  }
}

let engine = null;
export function sound() {
  if (!engine) engine = new SoundEngine();
  return engine;
}
