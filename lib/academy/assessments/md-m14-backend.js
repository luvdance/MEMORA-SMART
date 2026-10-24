/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 14 · BACKEND AND DATABASE INTEGRATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l84-backend-basics", [
    q({ id: "mdq84-1", atom: "a-md-backend-responsibilities", d: 2, prompt: "Where must an order's total be calculated?", options: ["On the server, from its own prices", "In the app, then sent to the server", "In both, trusting the app's", "Nowhere: the payment provider does it"], correct: "a",
      explanation: "Anything from the app can be faked.",
      wrong: { b: "Anyone could send ₦1.", c: "Never trust the client's value.", d: "The provider charges what you tell it." } }),
    q({ id: "mdq84-2", atom: "a-md-backend-responsibilities", d: 2, prompt: "Why validate input in the app at all, if the server validates it?", options: ["Instant feedback for the user", "It replaces server checks", "Stores require it", "It is more secure"], correct: "a",
      explanation: "Convenience on the phone, correctness on the server.",
      wrong: { b: "Never.", c: "No.", d: "Client checks can be bypassed." } }),
    q({ id: "mdq84-3", atom: "a-md-server-architecture", d: 2, prompt: "In a layered backend, where do business rules such as discounts live?", options: ["In services", "In routes", "In the database driver", "In the app"], correct: "a",
      explanation: "Routes handle HTTP; services hold rules; data access talks to the database.",
      wrong: { b: "Routes only translate HTTP.", c: "Too low.", d: "Not trusted." } }),
    q({ id: "mdq84-4", atom: "a-md-server-architecture", d: 3, prompt: "Why should servers be stateless?", options: ["So several copies can run behind a load balancer and restarts lose nothing", "To use less code", "Databases require it", "To avoid tokens"], correct: "a",
      explanation: "State belongs in the database.",
      wrong: { b: "No.", c: "No.", d: "Tokens make statelessness possible." } }),
  ]),

  ...check("md-l85-sql", [
    q({ id: "mdq85-1", atom: "a-md-tables-relationships", d: 2, prompt: "How is \"a user has many notices\" stored?", options: ["A user_id foreign key on notices", "A list of notice ids in users", "A copy of the user in each notice", "A separate database"], correct: "a",
      explanation: "The foreign key goes on the \"many\" side.",
      wrong: { b: "Not relational.", c: "Duplicated data drifts.", d: "No." } }),
    q({ id: "mdq85-2", atom: "a-md-tables-relationships", d: 3, prompt: "Why LEFT JOIN comments when counting comments per notice?", options: ["So notices with no comments still appear, with 0", "It's faster", "JOIN can't count", "To delete comments"], correct: "a",
      explanation: "An inner JOIN drops unmatched rows.",
      wrong: { b: "Not the reason.", c: "It can, but loses rows.", d: "No." } }),
    q({ id: "mdq85-3", atom: "a-md-sql", d: 2, prompt: "A sort column comes from the request. How do you use it safely?", options: ["Look it up in a fixed allow-list of column names", "Put it in a ? parameter", "Paste it into the SQL", "Lower-case it"], correct: "a",
      explanation: "Column names can't be parameters.",
      wrong: { b: "Parameters are for values only.", c: "SQL injection.", d: "Still injectable." } }),
    q({ id: "mdq85-4", atom: "a-md-sql", d: 2, prompt: "UPDATE … WHERE id = ? reports 0 changes. What does it usually mean?", options: ["There is no such row: answer 404", "The update failed silently", "The database is down", "It worked"], correct: "a",
      explanation: "Nothing matched.",
      wrong: { b: "It ran, matching nothing.", c: "That would throw.", d: "Nothing changed." } }),
    q({ id: "mdq85-5", atom: "a-md-sql", d: 1, prompt: "Which clause gives one result per category?", options: ["GROUP BY category", "ORDER BY category", "WHERE category", "LIMIT category"], correct: "a",
      explanation: "With SUM or COUNT.",
      wrong: { b: "Sorts.", c: "Filters.", d: "Not valid." } }),
  ]),

  ...check("md-l86-baas-accounts", [
    q({ id: "mdq86-1", atom: "a-md-baas", d: 2, prompt: "With Firebase or Supabase, what protects users' data?", options: ["Security rules or Row Level Security policies you write", "The anon key being secret", "The app's code", "Nothing is needed"], correct: "a",
      explanation: "The app talks to the database directly.",
      wrong: { b: "The anon key is public.", c: "Apps can be bypassed.", d: "Open rules leak everything." } }),
    q({ id: "mdq86-2", atom: "a-md-baas", d: 2, prompt: "Which of these keys must never be in the app?", options: ["A service-role or admin key", "The Supabase anon key", "The Firebase web config", "The project URL"], correct: "a",
      explanation: "It bypasses all rules.",
      wrong: { b: "Public by design.", c: "Public.", d: "Public." } }),
    q({ id: "mdq86-3", atom: "a-md-accounts", d: 2, prompt: "How should passwords be stored?", options: ["As hashes from a slow algorithm such as bcrypt or argon2", "Encrypted with a key", "In plain text", "In SecureStore on the server"], correct: "a",
      explanation: "Hashes can't be reversed.",
      wrong: { b: "Keys can leak.", c: "Never.", d: "Not a server feature." } }),
    q({ id: "mdq86-4", atom: "a-md-accounts", d: 3, prompt: "Why does login say \"Wrong email or password\" in both cases?", options: ["So nobody can find out which e-mails have accounts", "It's shorter", "It's required by law", "To confuse users"], correct: "a",
      explanation: "Account enumeration.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq86-5", atom: "a-md-accounts", d: 2, prompt: "What do Apple and Google require of apps that let people create accounts?", options: ["A way to delete the account from inside the app", "Sign in with Google", "Two-factor authentication", "A website"], correct: "a",
      explanation: "And its data.",
      wrong: { b: "Not required.", c: "Not required.", d: "Not required." } }),
  ]),

  ...check("md-l87-crud-storage", [
    q({ id: "mdq87-1", atom: "a-md-crud", d: 2, prompt: "After a mutation creates a notice, how does the list update?", options: ["invalidateQueries refetches it", "It updates itself", "Restart the app", "Call setState in the server"], correct: "a",
      explanation: "Invalidate what the write changed.",
      wrong: { b: "Not automatically.", c: "No.", d: "No." } }),
    q({ id: "mdq87-2", atom: "a-md-crud", d: 3, prompt: "An optimistic delete is refused by the server. What should happen?", options: ["Put the item back and show the reason", "Leave it hidden", "Retry forever", "Crash"], correct: "a",
      explanation: "Roll back in onError.",
      wrong: { b: "The screen would lie.", c: "It will keep failing.", d: "No." } }),
    q({ id: "mdq87-3", atom: "a-md-cloud-storage", d: 2, prompt: "Where should uploaded photos be kept?", options: ["Object storage, with their URL in the database", "In a database column as bytes", "In AsyncStorage", "In the app bundle"], correct: "a",
      explanation: "Databases store the address.",
      wrong: { b: "Bloats the database.", c: "Local only.", d: "Fixed at build time." } }),
    q({ id: "mdq87-4", atom: "a-md-cloud-storage", d: 3, prompt: "How should a private receipt image be shown to its owner?", options: ["Through a short-lived signed URL from a private bucket", "A public link", "Emailed to everyone", "In the app's logs"], correct: "a",
      explanation: "Public links can be shared and guessed.",
      wrong: { b: "Anyone with it could see it.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l88-realtime-rules", [
    q({ id: "mdq88-1", atom: "a-md-realtime", d: 2, prompt: "Why reload the list after a WebSocket reconnects?", options: ["Events sent while disconnected were missed", "WebSockets require it", "To save battery", "To clear the cache"], correct: "a",
      explanation: "Catch up, then apply new events.",
      wrong: { b: "No.", c: "Costs a request.", d: "No." } }),
    q({ id: "mdq88-2", atom: "a-md-realtime", d: 2, prompt: "Which feature most needs realtime updates?", options: ["A chat conversation", "A settings screen", "An about page", "A terms page"], correct: "a",
      explanation: "Others change it while you watch.",
      wrong: { b: "Only you change it.", c: "Static.", d: "Static." } }),
    q({ id: "mdq88-3", atom: "a-md-access-rules", d: 3, prompt: "A user changes the id in PATCH /notices/2 to someone else's notice, and it works. What is the bug?", options: ["The server doesn't check the notice belongs to the user", "The URL isn't encoded", "The token expired", "Nothing"], correct: "a",
      explanation: "Broken object level authorization.",
      wrong: { b: "Unrelated.", c: "It would be 401.", d: "A serious hole." } }),
    q({ id: "mdq88-4", atom: "a-md-access-rules", d: 2, prompt: "What is mass assignment?", options: ["Copying the whole request body into a record, so users set fields such as authorId or role", "Sending many requests", "Assigning tasks to many users", "Bulk inserts"], correct: "a",
      explanation: "Copy only allowed fields.",
      wrong: { b: "That's rate limiting.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l89-performance-models", [
    q({ id: "mdq89-1", atom: "a-md-indexes", d: 2, prompt: "EXPLAIN QUERY PLAN says SCAN notices. What does it mean?", options: ["Every row is read: an index is missing", "The query is optimal", "The table is empty", "The query failed"], correct: "a",
      explanation: "You want SEARCH … USING INDEX.",
      wrong: { b: "Opposite.", c: "No.", d: "It ran." } }),
    q({ id: "mdq89-2", atom: "a-md-indexes", d: 3, prompt: "What is the N + 1 problem?", options: ["One query for a list, then one more for each row", "A list one item too long", "Too many indexes", "An off-by-one error"], correct: "a",
      explanation: "Use a JOIN or one IN (…) query.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq89-3", atom: "a-md-indexes", d: 2, prompt: "Which index serves WHERE category = ? ORDER BY created_at?", options: ["(category, created_at)", "(created_at, category)", "(title)", "(id)"], correct: "a",
      explanation: "Equality first, then the sort.",
      wrong: { b: "Wrong order.", c: "Unused.", d: "Already the primary key." } }),
    q({ id: "mdq89-4", atom: "a-md-relational-vs-document", d: 2, prompt: "When does a document database fit well?", options: ["Self-contained records read whole, such as chat messages or settings", "Orders, stock and payments", "Data with many relationships", "Anything with reports"], correct: "a",
      explanation: "Relational is the safe default otherwise.",
      wrong: { b: "Needs transactions.", c: "Relational.", d: "JOINs and GROUP BY." } }),
  ]),

  ...check("md-l90-m14-project", [
    q({ id: "mdq90-1", atom: "a-md-m14-project", d: 2, prompt: "Why does the app hide the Remove button on others' notices if the server refuses anyway?", options: ["Usability: don't offer what will fail; the server stays the real check", "It's the only check", "To save bandwidth", "Stores require it"], correct: "a",
      explanation: "UI for convenience, server for security.",
      wrong: { b: "Never rely on the UI.", c: "No.", d: "No." } }),
    q({ id: "mdq90-2", atom: "a-md-m14-project", d: 2, prompt: "How does a new notice from another user reach the screen?", options: ["A \"created\" event on the WebSocket", "Polling every second", "A push notification", "Restarting the app"], correct: "a",
      explanation: "The server publishes it.",
      wrong: { b: "Wasteful.", c: "For closed apps.", d: "No." } }),
    q({ id: "mdq90-3", atom: "a-md-m14-project", d: 2, prompt: "How is a notice with a photo sent?", options: ["multipart/form-data with a title field and a photo file", "JSON with the photo as base64", "Two separate apps", "A WebSocket message"], correct: "a",
      explanation: "One FormData.",
      wrong: { b: "Big and slow.", c: "No.", d: "Not for uploads." } }),
    q({ id: "mdq90-4", atom: "a-md-m14-project", d: 3, prompt: "Where does the server get a new notice's author from?", options: ["The verified token", "The request body", "The app's state", "The photo's file name"], correct: "a",
      explanation: "Never from the body.",
      wrong: { b: "Could be faked.", c: "Not sent.", d: "No." } }),
  ]),
};
