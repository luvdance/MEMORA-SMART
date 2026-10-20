import { useCallback, useEffect, useRef, useState } from "react";
import useKeyCapture from "./useKeyCapture";
import { sound } from "./music.js";
import { BOSS_PHRASES, gameWords } from "./text.js";

/**
 * WORD RAIN — the arcade game.
 *
 * Meteors carrying words fall toward the city. Typing a word's first letter
 * locks the cannon onto it; finishing the word fires. It teaches the thing
 * drills cannot: reading AHEAD while your fingers finish the current word,
 * under time pressure, without glancing down — look down and a meteor lands.
 *
 * Mechanics
 *   waves      each wave is longer and faster; the music speeds up with it
 *   combo      clean words build a multiplier up to ×5; a mistake resets it
 *   gold words power-ups: freeze time, bomb the sky, +1 life, a shield
 *   boss       every fifth wave ends with a long phrase that takes hits
 *   targeting  no two meteors on screen start with the same letter, so the
 *              first key always picks exactly one target
 *
 * The simulation runs in a ref on requestAnimationFrame and draws to a
 * canvas; React only renders the HUD, and only when a number changes.
 */

const MODES = [
  { id: "home", label: "Home Row", desc: "Words from A S D F G H J K L only.", icon: "fas fa-house" },
  { id: "letters", label: "Words", desc: "Common English words.", icon: "fas fa-font" },
  { id: "capitals", label: "Capitals", desc: "Capitals and punctuation.", icon: "fas fa-up-long" },
  { id: "symbols", label: "Symbols", desc: "@ # $ % & * ( ) [ ] { } and friends.", icon: "fas fa-at" },
  { id: "code", label: "Code", desc: "Keywords and syntax from real languages.", icon: "fas fa-code" },
];

const POWERS = {
  freeze: { label: "FREEZE", color: "#38bdf8", glyph: "❄" },
  bomb: { label: "BOMB", color: "#f97316", glyph: "✸" },
  heal: { label: "+1 LIFE", color: "#22c55e", glyph: "♥" },
  shield: { label: "SHIELD", color: "#a78bfa", glyph: "◆" },
};

const START_LIVES = 5;
const MAX_LIVES = 7;
const FONT = "600 17px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const BOSS_FONT = "700 19px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function newGame(mode) {
  return {
    mode,
    pool: gameWords(mode),
    words: [],
    particles: [],
    lasers: [],
    stars: Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, tw: Math.random() * 6 })),
    target: null,
    nextId: 1,
    score: 0,
    lives: START_LIVES,
    shield: 0,
    wave: 1,
    waveSize: 8,
    spawned: 0,
    spawnIn: 0.6,
    bossDue: false,
    combo: 0,
    bestCombo: 0,
    mult: 1,
    freezeUntil: 0,
    shakeUntil: 0,
    banner: { text: "WAVE 1", until: 2.2 },
    time: 0,
    keystrokes: 0,
    correct: 0,
    errors: 0,
    chars: 0,
    keys: {},
    destroyed: 0,
    angle: -Math.PI / 2,
  };
}

const rand = (a, b) => a + Math.random() * (b - a);

export default function WordRain({ best = 0, onFinish, onExit }) {
  const [phase, setPhase] = useState("menu"); // menu | countdown | playing | paused | over
  const [mode, setMode] = useState("letters");
  const [count, setCount] = useState(3);
  const [hud, setHud] = useState(null);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  const sizeRef = useRef({ w: 800, h: 520 });
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const syncHud = () => {
    const g = gameRef.current;
    if (!g) return;
    setHud({
      score: g.score,
      lives: g.lives,
      shield: g.shield,
      wave: g.wave,
      mult: g.mult,
      combo: g.combo,
      frozen: g.freezeUntil > g.time,
    });
  };

  /* ── canvas sizing ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const resize = () => {
      const w = wrap.clientWidth;
      const h = Math.max(380, Math.min(600, Math.round(window.innerHeight * 0.62)));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.height = `${h}px`;
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    return () => ro.disconnect();
  }, []);

  /* ── spawning ── */
  const spawn = (g, boss = false) => {
    const { w } = sizeRef.current;
    const ctx = canvasRef.current.getContext("2d");
    const used = new Set(g.words.map((x) => x.text[0]));
    let text;
    let power = null;
    if (boss) {
      const list = BOSS_PHRASES[g.mode] || BOSS_PHRASES.letters;
      text = list[Math.floor(Math.random() * list.length)];
    } else {
      const maxLen = 3 + g.wave;
      const options = g.pool.filter((x) => x.length <= maxLen && !used.has(x[0]));
      const list = options.length ? options : g.pool.filter((x) => !used.has(x[0]));
      if (!list.length) return false;
      text = list[Math.floor(Math.random() * list.length)];
      if (Math.random() < 0.07 + Math.min(0.05, g.wave * 0.005)) {
        const keys = Object.keys(POWERS).filter((p) => p !== "heal" || g.lives < MAX_LIVES);
        power = keys[Math.floor(Math.random() * keys.length)];
      }
    }
    ctx.font = boss ? BOSS_FONT : FONT;
    const tw = ctx.measureText(text).width + 22;
    const speedBase = (24 + g.wave * 5.5) * (sizeRef.current.h / 520);
    g.words.push({
      id: g.nextId++,
      text,
      typed: 0,
      x: rand(tw / 2 + 8, Math.max(tw / 2 + 9, w - tw / 2 - 8)),
      y: -20,
      w: tw,
      speed: boss ? speedBase * 0.45 : speedBase * rand(0.8, 1.2),
      boss,
      power,
      born: g.time,
    });
    return true;
  };

  /* ── effects ── */
  const burst = (g, x, y, color, n = 22) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = rand(60, 260);
      g.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rand(0.4, 0.9), age: 0, color, s: rand(2, 4.5) });
    }
  };

  const destroy = (g, word, viaBomb = false) => {
    g.words = g.words.filter((x) => x !== word);
    if (g.target === word.id) g.target = null;
    const { w, h } = sizeRef.current;
    g.lasers.push({ x1: w / 2, y1: h - 38, x2: word.x, y2: word.y, age: 0 });
    burst(g, word.x, word.y, word.power ? POWERS[word.power].color : word.boss ? "#f43f5e" : "#67e8f9", word.boss ? 70 : 24);
    sound().explode();
    if (viaBomb) {
      g.score += word.text.length * 5;
      return;
    }
    g.destroyed++;
    g.combo++;
    g.bestCombo = Math.max(g.bestCombo, g.combo);
    const prevMult = g.mult;
    g.mult = Math.min(5, 1 + Math.floor(g.combo / 8));
    if (g.mult > prevMult) {
      sound().combo(g.mult);
      g.banner = { text: `COMBO ×${g.mult}`, until: g.time + 1.1, small: true };
    }
    sound().word(g.combo);
    g.score += word.text.length * 10 * g.mult + (word.boss ? 500 * g.wave : 0);
    if (word.boss) {
      g.banner = { text: "BOSS DOWN!", until: g.time + 1.8 };
      sound().levelUp();
    }
    if (word.power) {
      sound().powerup();
      const p = word.power;
      g.banner = { text: POWERS[p].label, until: g.time + 1.2, small: true, color: POWERS[p].color };
      if (p === "freeze") g.freezeUntil = g.time + 6;
      if (p === "heal") g.lives = Math.min(MAX_LIVES, g.lives + 1);
      if (p === "shield") g.shield++;
      if (p === "bomb") [...g.words].filter((x) => !x.boss).forEach((x) => destroy(g, x, true));
    }
  };

  const nextWave = (g) => {
    g.wave++;
    g.waveSize = 8 + g.wave * 2;
    g.spawned = 0;
    g.spawnIn = 2.2;
    g.bossDue = g.wave % 5 === 0;
    g.banner = { text: `WAVE ${g.wave}`, until: g.time + 2.2 };
    sound().setTempo(112 + g.wave * 4);
    sound().setIntensity(g.wave >= 3 ? 3 : g.wave >= 2 ? 2 : 1);
    sound().combo(2);
  };

  /* ── loop ── */
  const step = (dt) => {
    const g = gameRef.current;
    const { w, h } = sizeRef.current;
    g.time += dt;
    const frozen = g.freezeUntil > g.time;
    const ground = h - 56;

    // Spawning
    if (g.spawned < g.waveSize) {
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        if (spawn(g)) g.spawned++;
        g.spawnIn = Math.max(0.5, 2.1 - g.wave * 0.14) * rand(0.75, 1.25);
      }
    } else if (g.bossDue && !g.words.length) {
      spawn(g, true);
      g.bossDue = false;
      g.banner = { text: "BOSS INCOMING", until: g.time + 2, color: "#f43f5e" };
    } else if (!g.words.length && !g.bossDue) {
      nextWave(g);
      syncHud();
    }

    // Movement and landings
    for (const word of [...g.words]) {
      word.y += word.speed * dt * (frozen ? 0.3 : 1);
      if (word.y >= ground) {
        g.words = g.words.filter((x) => x !== word);
        if (g.target === word.id) g.target = null;
        burst(g, word.x, ground, "#fb7185", 30);
        g.combo = 0;
        g.mult = 1;
        if (g.shield > 0) {
          g.shield--;
          sound().powerup();
        } else {
          g.lives -= word.boss ? 2 : 1;
          g.shakeUntil = g.time + 0.35;
          sound().lifeLost();
        }
        syncHud();
        if (g.lives <= 0) {
          endGame();
          return;
        }
      }
    }

    for (const p of g.particles) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 300 * dt;
    }
    g.particles = g.particles.filter((p) => p.age < p.life);
    for (const l of g.lasers) l.age += dt;
    g.lasers = g.lasers.filter((l) => l.age < 0.16);

    const t = g.words.find((x) => x.id === g.target);
    const goal = t ? Math.atan2(t.y - (h - 38), t.x - w / 2) : -Math.PI / 2;
    g.angle += (goal - g.angle) * Math.min(1, dt * 14);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { w, h } = sizeRef.current;
    const g = gameRef.current;
    const time = g?.time || 0;

    ctx.save();
    if (g && g.shakeUntil > time) ctx.translate(rand(-6, 6), rand(-5, 5));

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#070a24");
    sky.addColorStop(0.6, "#1a1050");
    sky.addColorStop(1, "#3a1663");
    ctx.fillStyle = sky;
    ctx.fillRect(-10, -10, w + 20, h + 20);

    const stars = g?.stars || [];
    for (const s of stars) {
      ctx.globalAlpha = 0.45 + 0.4 * Math.sin(time * 1.6 + s.tw);
      ctx.fillStyle = "#fff";
      ctx.fillRect(s.x * w, s.y * (h - 80), s.r, s.r);
    }
    ctx.globalAlpha = 1;

    if (g && g.freezeUntil > time) {
      ctx.fillStyle = "rgba(56,189,248,0.10)";
      ctx.fillRect(0, 0, w, h);
    }

    // City skyline
    const ground = h - 56;
    ctx.fillStyle = "#120a2e";
    let x = 0;
    let i = 0;
    while (x < w) {
      const bw = 26 + ((i * 37) % 30);
      const bh = 18 + ((i * 53) % 46);
      ctx.fillRect(x, ground - bh + 30, bw - 3, bh + 30);
      ctx.fillStyle = "rgba(250,204,21,0.55)";
      for (let wy = ground - bh + 36; wy < ground + 20; wy += 9)
        for (let wx = x + 4; wx < x + bw - 8; wx += 7) if ((wx * 7 + wy * 3 + i) % 5 === 0) ctx.fillRect(wx, wy, 2.5, 3);
      ctx.fillStyle = "#120a2e";
      x += bw;
      i++;
    }
    ctx.fillStyle = "#0b0620";
    ctx.fillRect(0, ground + 30, w, h - ground);

    // Shield dome
    if (g?.shield > 0) {
      ctx.strokeStyle = "rgba(167,139,250,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w / 2, ground + 40, w * 0.6, 70, 0, Math.PI, 0);
      ctx.stroke();
    }

    // Cannon
    ctx.save();
    ctx.translate(w / 2, h - 38);
    ctx.rotate((g?.angle ?? -Math.PI / 2) + Math.PI / 2);
    ctx.fillStyle = "#67e8f9";
    ctx.fillRect(-4, -30, 8, 26);
    ctx.restore();
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    ctx.arc(w / 2, h - 34, 18, Math.PI, 0);
    ctx.fill();

    if (g) {
      // Lasers
      for (const l of g.lasers) {
        ctx.strokeStyle = `rgba(103,232,249,${1 - l.age / 0.16})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      }

      // Meteors
      for (const word of g.words) {
        const isTarget = word.id === g.target;
        const color = word.power ? POWERS[word.power].color : word.boss ? "#f43f5e" : "#f472b6";
        const tail = ctx.createLinearGradient(word.x, word.y - 70, word.x, word.y);
        tail.addColorStop(0, "rgba(255,255,255,0)");
        tail.addColorStop(1, color);
        ctx.strokeStyle = tail;
        ctx.lineWidth = word.boss ? 10 : 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(word.x, word.y - 70);
        ctx.lineTo(word.x, word.y - 14);
        ctx.stroke();

        ctx.font = word.boss ? BOSS_FONT : FONT;
        const bx = word.x - word.w / 2;
        const by = word.y - 14;
        const bh = word.boss ? 34 : 28;
        ctx.fillStyle = isTarget ? "rgba(8,47,73,0.95)" : "rgba(15,12,40,0.88)";
        ctx.strokeStyle = isTarget ? "#67e8f9" : color;
        ctx.lineWidth = isTarget ? 2.5 : 1.5;
        if (isTarget) {
          ctx.shadowColor = "#67e8f9";
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.roundRect(bx, by, word.w, bh, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        const tx = bx + 11;
        const ty = by + bh / 2 + 6;
        const done = word.text.slice(0, word.typed);
        const rest = word.text.slice(word.typed);
        ctx.fillStyle = "#4ade80";
        ctx.fillText(done, tx, ty);
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(rest, tx + ctx.measureText(done).width, ty);

        if (word.power) {
          ctx.font = "15px sans-serif";
          ctx.fillStyle = color;
          ctx.fillText(POWERS[word.power].glyph, bx + word.w - 4, by - 2);
        }
        if (word.boss) {
          ctx.fillStyle = "rgba(244,63,94,0.3)";
          ctx.fillRect(bx, by + bh + 4, word.w, 4);
          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(bx, by + bh + 4, word.w * (1 - word.typed / word.text.length), 4);
        }
      }

      // Particles
      for (const p of g.particles) {
        ctx.globalAlpha = 1 - p.age / p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalAlpha = 1;

      // Banner
      if (g.banner && g.banner.until > time) {
        const left = g.banner.until - time;
        ctx.globalAlpha = Math.min(1, left * 2);
        ctx.font = g.banner.small ? "800 26px system-ui, sans-serif" : "900 44px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = g.banner.color || "#fde047";
        ctx.shadowColor = g.banner.color || "#fde047";
        ctx.shadowBlur = 18;
        ctx.fillText(g.banner.text, w / 2, h * (g.banner.small ? 0.42 : 0.36));
        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  };

  // The animation loop runs only while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    let raf;
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (phaseRef.current !== "playing") return;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // step/draw read only refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ── lifecycle ── */
  const start = () => {
    gameRef.current = newGame(mode);
    setResult(null);
    syncHud();
    setCount(3);
    setPhase("countdown");
    sound().countdown();
    draw();
  };

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      sound().countdown(true);
      sound().playTheme("arcade", { intensity: 1, bpm: 116 });
      setPhase("playing");
      return;
    }
    const id = setTimeout(() => {
      setCount((c) => c - 1);
      if (count > 1) sound().countdown();
    }, 700);
    return () => clearTimeout(id);
  }, [phase, count]);

  const endGame = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.over) return;
    g.over = true;
    phaseRef.current = "over";
    setPhase("over");
    sound().stopMusic();
    sound().lose();
    const minutes = g.time / 60;
    const stats = {
      wpm: minutes ? Math.round((g.chars / 5 / minutes) * 10) / 10 : 0,
      raw: minutes ? Math.round((g.keystrokes / 5 / minutes) * 10) / 10 : 0,
      accuracy: g.keystrokes ? Math.round((g.correct / g.keystrokes) * 1000) / 10 : 100,
      correctChars: g.chars,
      keystrokes: g.keystrokes,
      errors: g.errors,
      ms: g.time * 1000,
      bestCombo: g.bestCombo,
      consistency: 100,
    };
    const res = { stats, score: g.score, wave: g.wave, destroyed: g.destroyed, keys: g.keys, mode: g.mode };
    const outcome = onFinish?.(res);
    setResult({ ...res, xp: outcome?.xp });
  }, [onFinish]);

  useEffect(() => () => sound().stopMusic(), []);

  // Pause if the tab is hidden: meteors should not land while you are away.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === "playing") setPhase("paused");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* ── input ── */
  const recordKey = (g, exp, ok) => {
    const k = (g.keys[exp] ||= { hits: 0, misses: 0, ms: 0 });
    if (ok) k.hits++;
    else k.misses++;
  };

  const onKey = (key) => {
    const g = gameRef.current;
    if (phaseRef.current === "paused") {
      if (key === "Escape" || key === " ") setPhase("playing");
      return;
    }
    if (phaseRef.current !== "playing" || !g) return;
    if (key === "Escape") {
      setPhase("paused");
      return;
    }
    if (key === "Backspace") {
      const t = g.words.find((x) => x.id === g.target);
      if (t) t.typed = 0;
      g.target = null;
      return;
    }
    if (key.length !== 1 || key === "\n") return;

    let target = g.words.find((x) => x.id === g.target);
    if (!target) {
      // Lowest meteor first: the most urgent one.
      const candidates = g.words.filter((x) => x.text[0] === key).sort((a, b) => b.y - a.y);
      if (!candidates.length) {
        if (key === " ") return; // a stray space between words is not a miss
        g.keystrokes++;
        g.errors++;
        g.combo = 0;
        g.mult = 1;
        sound().error();
        syncHud();
        return;
      }
      target = candidates[0];
      g.target = target.id;
    }
    const exp = target.text[target.typed];
    g.keystrokes++;
    if (key === exp) {
      g.correct++;
      g.chars++;
      recordKey(g, exp, true);
      target.typed++;
      sound().key(g.combo);
      if (target.typed >= target.text.length) {
        g.chars++; // the word boundary, as a space would count in a drill
        destroy(g, target);
      }
    } else {
      g.errors++;
      recordKey(g, exp, false);
      g.combo = 0;
      g.mult = 1;
      sound().error();
    }
    syncHud();
  };

  const { focused, focus, inputProps } = useKeyCapture(onKey, { active: phase === "playing" || phase === "paused" });

  /* ── render ── */
  return (
    <div className="ty-game">
      <div className="ty-game__bar">
        <button type="button" className="ty-link" onClick={onExit}>
          <i className="fas fa-arrow-left" aria-hidden="true" /> Arcade
        </button>
        <h2>
          <i className="fas fa-cloud-showers-heavy" aria-hidden="true" /> Word Rain
        </h2>
        <span className="ty-game__best">Best {Math.max(best, result?.score || 0).toLocaleString()}</span>
      </div>

      {hud && phase !== "menu" && (
        <div className="ty-game__hud">
          <span><small>Score</small><strong>{hud.score.toLocaleString()}</strong></span>
          <span><small>Wave</small><strong>{hud.wave}</strong></span>
          <span className="ty-game__lives" aria-label={`${hud.lives} lives`}>
            {Array.from({ length: Math.max(0, hud.lives) }, (_, i) => (
              <i key={i} className="fas fa-heart" aria-hidden="true" />
            ))}
            {hud.shield > 0 && <i className="fas fa-shield-halved is-shield" aria-hidden="true" title={`${hud.shield} shield`} />}
          </span>
          <span className={hud.mult > 1 ? "is-hot" : ""}><small>Multiplier</small><strong>×{hud.mult}</strong></span>
          {hud.frozen && <span className="is-frozen"><i className="fas fa-snowflake" aria-hidden="true" /> Frozen</span>}
        </div>
      )}

      <div className="ty-game__screen" ref={wrapRef} onClick={focus}>
        <input {...inputProps} />
        <canvas ref={canvasRef} className="ty-game__canvas" />

        {phase === "menu" && (
          <div className="ty-overlay">
            <h3>Defend the city</h3>
            <p>Type the word on a meteor to shoot it down. Keep your eyes up — if you look at your keyboard, they land.</p>
            <div className="ty-modes">
              {MODES.map((m) => (
                <button type="button" key={m.id} className={`ty-mode ${mode === m.id ? "is-on" : ""}`} onClick={() => setMode(m.id)}>
                  <i className={m.icon} aria-hidden="true" />
                  <strong>{m.label}</strong>
                  <span>{m.desc}</span>
                </button>
              ))}
            </div>
            <ul className="ty-overlay__tips">
              <li><span style={{ color: POWERS.freeze.color }}>❄</span> freeze · <span style={{ color: POWERS.bomb.color }}>✸</span> bomb · <span style={{ color: POWERS.heal.color }}>♥</span> life · <span style={{ color: POWERS.shield.color }}>◆</span> shield</li>
              <li><kbd>Backspace</kbd> switch target · <kbd>Esc</kbd> pause</li>
            </ul>
            <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={start}>
              <i className="fas fa-play" aria-hidden="true" /> Start game
            </button>
          </div>
        )}

        {phase === "countdown" && (
          <div className="ty-overlay ty-overlay--clear">
            <span className="ty-count" key={count}>{count || "GO!"}</span>
          </div>
        )}

        {phase === "paused" && (
          <div className="ty-overlay">
            <h3>Paused</h3>
            <p>Press <kbd>Esc</kbd> or <kbd>Space</kbd> to resume.</p>
            <div className="ty-overlay__row">
              <button type="button" className="ac-btn ac-btn--primary" onClick={() => { setPhase("playing"); focus(); }}>
                Resume
              </button>
              <button type="button" className="ac-btn ac-btn--ghost ty-btn-dark" onClick={endGame}>
                End game
              </button>
            </div>
          </div>
        )}

        {phase === "playing" && !focused && (
          <button type="button" className="ty-stage__focus" onClick={focus}>
            <i className="fas fa-keyboard" aria-hidden="true" /> Click to keep typing
          </button>
        )}

        {phase === "over" && result && (
          <div className="ty-overlay">
            <h3>{result.score > best ? "New high score!" : "City fallen"}</h3>
            <div className="ty-over__grid">
              <span><small>Score</small><strong>{result.score.toLocaleString()}</strong></span>
              <span><small>Wave</small><strong>{result.wave}</strong></span>
              <span><small>WPM</small><strong>{Math.round(result.stats.wpm)}</strong></span>
              <span><small>Accuracy</small><strong>{result.stats.accuracy}%</strong></span>
              <span><small>Meteors</small><strong>{result.destroyed}</strong></span>
              <span><small>Best combo</small><strong>{result.stats.bestCombo}</strong></span>
            </div>
            {result.xp != null && <p className="ty-over__xp"><i className="fas fa-bolt" aria-hidden="true" /> +{result.xp} typing XP</p>}
            <div className="ty-overlay__row">
              <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={start} autoFocus>
                <i className="fas fa-rotate-right" aria-hidden="true" /> Play again
              </button>
              <button type="button" className="ac-btn ac-btn--ghost ty-btn-dark" onClick={() => setPhase("menu")}>
                Change mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
