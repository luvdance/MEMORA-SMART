/**
 * READING A THREAD THAT IS PARTLY UNREADABLE
 *
 * Pure. No React, no Firebase, no WebCrypto — just the decision about what a
 * learner is shown when messages cannot be decrypted.
 *
 * ── THE PROBLEM ──────────────────────────────────────────────────────────
 * Every message that failed to decrypt rendered its own line:
 *
 *     Encrypted with a key this browser does not have.
 *     Encrypted with a key this browser does not have.
 *     Encrypted with a key this browser does not have.
 *     … once per message, for the whole history
 *
 * Three things wrong with that, in increasing order of seriousness.
 *
 *   It repeats. Nine identical alarming lines say nothing nine times, and
 *   fill the thread so the messages that ARE readable cannot be found.
 *
 *   It leaks the mechanism. "Encrypted with a key this browser does not have"
 *   describes our storage to somebody who cannot act on it. It reads like a
 *   fault report, and learners reasonably conclude the product is broken.
 *
 *   It is not even the usual cause. Most of the time the browser's key is
 *   fine and it is the OTHER person's device key that changed. The line
 *   blames the wrong side, so a learner checks their own setup and finds
 *   nothing wrong with it.
 *
 * ── WHAT THIS DOES INSTEAD ───────────────────────────────────────────────
 * A run of consecutive unreadable messages collapses to ONE entry that says
 * how many there were and why, in the learner's terms. The reason is worked
 * out from evidence rather than assumed, and where the evidence does not
 * support a cause, it says less rather than something wrong.
 *
 * Losing history when a key changes is not a bug. It is what end-to-end
 * encryption means: nobody holds a copy that can be re-encrypted for the new
 * key, including us. The copy says so plainly instead of apologising for a
 * failure or implying something can be recovered.
 */

/** Why a run of messages cannot be read. Codes, not sentences. */
export const UNREADABLE = {
  /** This browser generated a new key, replacing a previously published one. */
  KEY_REPLACED: "key-replaced",
  /** These predate this browser's key: a new device, or cleared storage. */
  BEFORE_THIS_DEVICE: "before-this-device",
  /** Our key is intact and older than these, so the other side's changed. */
  THEIR_KEY_CHANGED: "their-key-changed",
  /** Not enough evidence to name a cause. Say the fact, not a guess. */
  UNKNOWN: "unknown",
};

/**
 * What the learner reads, per cause.
 *
 * None of these names a key store, an algorithm or a browser API. Each says
 * what happened, whose side it happened on, and whether anything can be done —
 * and each is explicit that going forward messages work, because the thing a
 * learner most needs to know is whether the product is broken. It is not.
 */
export const UNREADABLE_COPY = {
  [UNREADABLE.KEY_REPLACED]: {
    title: "Earlier messages cannot be opened on this device",
    detail:
      "This device was set up for messaging again, so it can only open messages sent after that point. The older ones cannot be recovered — not by you and not by us, which is the point of end-to-end encryption. Everything from here works normally.",
  },
  [UNREADABLE.BEFORE_THIS_DEVICE]: {
    title: "These were sent before you used this device",
    detail:
      "Messages are locked to the device they were sent to, so a new browser or a cleared one cannot open the older ones. Nothing is wrong with your account. Anything sent from now on will open here.",
  },
  [UNREADABLE.THEIR_KEY_CHANGED]: {
    title: "These cannot be opened since the other person changed device",
    detail:
      "They signed in somewhere new, or cleared their browser, so the older messages stay locked to the device they were sent to. Nothing is wrong on your side, and new messages between you work normally.",
  },
  [UNREADABLE.UNKNOWN]: {
    title: "Some earlier messages cannot be opened",
    detail:
      "Messages are locked to the devices in the conversation, and one of them has changed since these were sent. New messages are unaffected.",
  },
};

/**
 * Work out why a run of messages cannot be read.
 *
 * @param {object}  arg
 * @param {boolean} arg.rotated         this device replaced a published key
 * @param {number?} arg.identityCreatedAt when this device's key was created
 * @param {Date?}   arg.sentAt          when the run's LAST message was sent
 */
export function unreadableReason({ rotated, identityCreatedAt, sentAt }) {
  if (rotated) return UNREADABLE.KEY_REPLACED;

  // Without both timestamps there is nothing to compare, and a guess here
  // would blame the wrong side — which is exactly what the old copy did.
  if (!identityCreatedAt || !sentAt) return UNREADABLE.UNKNOWN;

  const sent = sentAt instanceof Date ? sentAt.getTime() : Number(sentAt);
  if (!Number.isFinite(sent)) return UNREADABLE.UNKNOWN;

  return sent < identityCreatedAt
    ? UNREADABLE.BEFORE_THIS_DEVICE
    : UNREADABLE.THEIR_KEY_CHANGED;
}

/**
 * Collapse a thread into renderable entries, runs of unreadable messages
 * folded into one.
 *
 * A message is unreadable when its text is null, which is what decryptMessage
 * returns rather than throwing. Readable messages pass through untouched and
 * in order, so nothing about the working case changes.
 *
 * Returns entries of either shape:
 *   { kind: "message",    message }
 *   { kind: "unreadable", count, ids, sentAt }   sentAt = the run's last
 */
export function groupThread(messages = []) {
  const out = [];

  for (const message of messages) {
    const unreadable = message?.text === null;

    if (!unreadable) {
      out.push({ kind: "message", message });
      continue;
    }

    const last = out[out.length - 1];
    if (last?.kind === "unreadable") {
      last.count += 1;
      last.ids.push(message.id);
      // Keep the LATEST timestamp in the run. Comparing the newest against
      // this device's key age is what distinguishes "sent before I had a key"
      // from "their key changed after I had one"; using the oldest would
      // classify a run that straddles the boundary as entirely historic.
      if (message.sentAt) last.sentAt = message.sentAt;
      continue;
    }

    out.push({
      kind: "unreadable",
      count: 1,
      ids: [message.id],
      sentAt: message.sentAt || null,
    });
  }

  return out;
}

export default { groupThread, unreadableReason, UNREADABLE, UNREADABLE_COPY };
