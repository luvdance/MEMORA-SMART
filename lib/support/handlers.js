/**
 * Support inbox: /api/support/* route handlers. SERVER ONLY.
 *
 * Served by api/cv.js (vercel.json rewrites /api/support/:action to
 * /api/cv?action=support-:action) so the inbox doesn't use one of the Hobby
 * plan's 12 function slots. Tickets live in Firestore `supportTickets`, which
 * only the Admin SDK touches: the browser goes through these routes, so a
 * signed-out visitor can write in and nobody can read another person's thread.
 *
 * Ticket: { subject, category, app, page, status, uid, email, name,
 *   messages: [{ from: "user"|"admin", text, at, by? }],
 *   unreadByAdmin, unreadByUser, createdAt, updatedAt }
 */
import { FieldValue } from "firebase-admin/firestore";
import { db, verifyCaller } from "../cv/admin.js";

const COLLECTION = "supportTickets";
const STATUSES = ["open", "pending", "resolved"];
const CATEGORIES = ["question", "problem", "billing", "request", "other"];
const MAX = { subject: 140, message: 5000, name: 80, email: 120, page: 300, app: 40, messages: 60 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function send(res, status, body) {
  return res.status(status).json(body);
}

function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

// Per-instance throttle on new tickets and replies (spam guard, not billing).
const hits = new Map();
function throttled(key, limit, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

function clientIp(req) {
  return String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

/** Signed-in caller or null; a bad token is treated as signed out. */
async function optionalCaller(req) {
  if (!req.headers?.authorization) return null;
  const who = await verifyCaller(req);
  return who.uid ? who : null;
}

async function requireCaller(req, res, { admin = false } = {}) {
  const who = await verifyCaller(req);
  if (!who.uid) {
    send(res, who.error === "not_configured" ? 503 : 401, { success: false, error: "Please sign in to continue." });
    return null;
  }
  if (admin && !who.admin) {
    send(res, 403, { success: false, error: "Admins only." });
    return null;
  }
  return who;
}

const toMs = (t) => (t?.toMillis ? t.toMillis() : Number(t) || 0);

/** What the browser gets: timestamps as millis, internal fields kept server-side. */
function view(doc, { forAdmin = false } = {}) {
  const t = doc.data();
  const out = {
    id: doc.id,
    subject: t.subject,
    category: t.category,
    app: t.app,
    status: t.status,
    createdAt: toMs(t.createdAt),
    updatedAt: toMs(t.updatedAt),
    messages: (t.messages || []).map((m) => ({ from: m.from, text: m.text, at: m.at })),
    unread: forAdmin ? Boolean(t.unreadByAdmin) : Boolean(t.unreadByUser),
  };
  if (forAdmin) Object.assign(out, { name: t.name, email: t.email, uid: t.uid, page: t.page, userAgent: t.userAgent });
  return out;
}

// ── POST /api/support/send { name, email, category, subject, message, app, page, website } ──
// Open to everyone. `website` is a honeypot: people never see or fill it.
async function sendMessage(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const b = body(req);
  if (b.website) return send(res, 200, { success: true });

  const who = await optionalCaller(req);
  if (throttled(`send:${who?.uid || clientIp(req)}`, who ? 10 : 4)) {
    return send(res, 429, { success: false, error: "You've sent several messages already. We'll get back to you soon." });
  }

  const email = clip(who?.email || b.email, MAX.email).toLowerCase();
  const message = clip(b.message, MAX.message);
  if (!EMAIL_RE.test(email)) return send(res, 400, { success: false, error: "Please enter a valid email so we can reply." });
  if (message.length < 10) return send(res, 400, { success: false, error: "Please tell us a little more (at least 10 characters)." });

  const now = Date.now();
  const ticket = {
    subject: clip(b.subject, MAX.subject) || message.slice(0, 60),
    category: CATEGORIES.includes(b.category) ? b.category : "other",
    app: clip(b.app, MAX.app) || "site",
    page: clip(b.page, MAX.page),
    userAgent: clip(req.headers?.["user-agent"], 200),
    status: "open",
    uid: who?.uid || null,
    email,
    name: clip(who?.name || b.name, MAX.name),
    messages: [{ from: "user", text: message, at: now }],
    unreadByAdmin: true,
    unreadByUser: false,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await db().collection(COLLECTION).add(ticket);
  return send(res, 200, { success: true, id: ref.id });
}

// ── GET /api/support/mine ── the caller's threads, newest first
async function mine(req, res) {
  const who = await requireCaller(req, res);
  if (!who) return;
  // uid-only filter needs no composite index; sort here instead.
  const snap = await db().collection(COLLECTION).where("uid", "==", who.uid).limit(50).get();
  const tickets = snap.docs.map((d) => view(d)).sort((a, b) => b.updatedAt - a.updatedAt);
  return send(res, 200, { success: true, tickets });
}

// ── POST /api/support/reply { id, message } ── user follow-up on their own thread
async function reply(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireCaller(req, res);
  if (!who) return;
  if (throttled(`reply:${who.uid}`, 30)) return send(res, 429, { success: false, error: "Please wait a little before sending more." });
  const { id } = body(req);
  const message = clip(body(req).message, MAX.message);
  if (!message) return send(res, 400, { success: false, error: "Write a message first." });

  const ref = db().collection(COLLECTION).doc(String(id || "x"));
  const result = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || snap.data().uid !== who.uid) return { status: 404, error: "Conversation not found." };
    const messages = snap.data().messages || [];
    if (messages.length >= MAX.messages) return { status: 400, error: "This conversation is full. Please start a new message." };
    const now = Date.now();
    tx.update(ref, {
      messages: [...messages, { from: "user", text: message, at: now }],
      status: "open",
      unreadByAdmin: true,
      unreadByUser: false,
      updatedAt: now,
    });
    return null;
  });
  if (result) return send(res, result.status, { success: false, error: result.error });
  return send(res, 200, { success: true });
}

// ── POST /api/support/seen { id } ── user opened a thread with an unread reply
async function seen(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireCaller(req, res);
  if (!who) return;
  const ref = db().collection(COLLECTION).doc(String(body(req).id || "x"));
  const snap = await ref.get();
  if (snap.exists && snap.data().uid === who.uid && snap.data().unreadByUser) await ref.update({ unreadByUser: false });
  return send(res, 200, { success: true });
}

// ── GET /api/support/admin-list ── newest 300 threads; the inbox filters locally
async function adminList(req, res) {
  const who = await requireCaller(req, res, { admin: true });
  if (!who) return;
  const snap = await db().collection(COLLECTION).orderBy("updatedAt", "desc").limit(300).get();
  return send(res, 200, { success: true, tickets: snap.docs.map((d) => view(d, { forAdmin: true })) });
}

// ── POST /api/support/admin-update { id, message?, status?, read? } ──
async function adminUpdate(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireCaller(req, res, { admin: true });
  if (!who) return;
  const b = body(req);
  const ref = db().collection(COLLECTION).doc(String(b.id || "x"));
  const snap = await ref.get();
  if (!snap.exists) return send(res, 404, { success: false, error: "Conversation not found." });

  const update = { unreadByAdmin: false };
  const message = clip(b.message, MAX.message);
  if (message) {
    const now = Date.now();
    update.messages = FieldValue.arrayUnion({ from: "admin", text: message, at: now, by: who.email || who.uid });
    update.unreadByUser = true;
    update.updatedAt = now;
    // Replying means we're waiting on them, unless the admin picked a status.
    update.status = "pending";
  }
  if (STATUSES.includes(b.status)) update.status = b.status;
  if (b.read === false) update.unreadByAdmin = true;
  await ref.update(update);
  const fresh = await ref.get();
  return send(res, 200, { success: true, ticket: view(fresh, { forAdmin: true }) });
}

export const supportRoutes = {
  "support-send": sendMessage,
  "support-mine": mine,
  "support-reply": reply,
  "support-seen": seen,
  "support-admin-list": adminList,
  "support-admin-update": adminUpdate,
};
