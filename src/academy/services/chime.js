/**
 * MESSAGE CHIMES
 *
 * Two short tones: one when a message goes out, one when a message arrives.
 *
 * WHY THERE IS NO AUDIO FILE
 * A chime is a fraction of a second of a sine wave. Shipping an .mp3 for that
 * would add a network request and a few kilobytes to every lesson page for
 * something WebAudio synthesises exactly. It also means the sound cannot fail
 * to load, which matters on the connections this audience uses.
 *
 * WHY IT CAN BE TURNED OFF, AND IS REMEMBERED
 * A sound you cannot silence is hostile — people study in libraries, in
 * shared rooms, at night. The preference lives in localStorage so it survives
 * a reload, and every access is wrapped because localStorage throws in a
 * private window.
 *
 * WHY IT IS QUIET AND SHORT
 * 0.12 seconds at a tenth of full gain, with a fade rather than a hard stop —
 * an abrupt end to a tone produces an audible click. This should read as a
 * soft tick, not a notification from an app demanding attention.
 *
 * AUTOPLAY
 * Browsers refuse to start audio before the user has interacted with the
 * page. Sending a message IS an interaction, so the outgoing chime always
 * works; the incoming one is silent until the learner has clicked something,
 * which by then they have. Nothing here throws if the context is blocked.
 */

const MUTE_KEY = "ac-chat-muted";

let ctx = null;

/** Lazily created: constructing an AudioContext before it is needed leaves a
 *  suspended audio pipeline open on every lesson page. */
function context() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    // Cannot read the preference, so assume sound is wanted — the toggle is
    // visible either way and a silent chime is a smaller problem than one
    // that cannot be turned on.
    return false;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* The toggle still works for this session. */
  }
  return muted;
}

/**
 * One note.
 *
 * `when` is an offset in seconds, so a two-note chime schedules both at once
 * rather than relying on a timer that a busy main thread would smear.
 */
function note(frequency, { when = 0, duration = 0.12, gain = 0.1 } = {}) {
  const audio = context();
  if (!audio) return;

  // A context can be suspended by the autoplay policy; resuming is a no-op
  // when it is already running.
  if (audio.state === "suspended") audio.resume?.().catch(() => {});

  const start = audio.currentTime + when;

  const osc = audio.createOscillator();
  const amp = audio.createGain();

  osc.type = "sine";
  osc.frequency.value = frequency;

  // Fade in and out. Without the ramps the tone starts and stops on a
  // discontinuity, which is heard as a click rather than a note.
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(amp).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function play(notes) {
  if (isMuted()) return;
  try {
    for (const n of notes) note(n.hz, n);
  } catch {
    // Audio is a courtesy. It must never interrupt a conversation.
  }
}

/** Outgoing: a single soft tick, so it does not compete with typing. */
export function playSent() {
  play([{ hz: 660, duration: 0.09, gain: 0.07 }]);
}

/**
 * Incoming: two rising notes, so it is distinguishable from your own send
 * without looking at the screen. Deliberately different in shape, not just
 * pitch — that is what makes it recognisable.
 */
export function playReceived() {
  play([
    { hz: 587, duration: 0.11, gain: 0.09 },
    { hz: 880, when: 0.1, duration: 0.14, gain: 0.09 },
  ]);
}

export default { playSent, playReceived, isMuted, setMuted };
