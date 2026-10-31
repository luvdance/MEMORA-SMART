/**
 * Local development only, loaded by the dev plugin in vite.config.js.
 *
 * Lets all of Memotify run with `npm run dev` and no service account: data
 * lives in memory, and "dev:<uid>:<email>[:admin]" tokens stand in for Firebase
 * ID tokens. Job feeds are still the real ones. Vite's plugin only exists in
 * `serve` mode, so none of this reaches a build.
 *
 * The user "ada" starts with a saved CV, so the CV steps can be tried locally.
 */
import { fakeDb } from "./fakeDb.mjs";
import { useTestBackend } from "./store.js";

if (!globalThis.__memotifyDevDb) {
  globalThis.__memotifyDevDb = fakeDb();
  await globalThis.__memotifyDevDb.collection("cvs").doc("dev-cv").set({
    ownerId: "ada",
    title: "Ada's CV",
    data: {
      name: "Ada Obi",
      email: "ada@example.ng",
      phone: "0801 000 0000",
      summary: "Economics graduate who likes clean data.",
      skills: "Excel, SQL, Customer service, Copywriting",
      education: [{ school: "University of Nigeria", degree: "B.Sc.", field: "Economics" }],
    },
  });
}

export function install() {
  useTestBackend({
    db: globalThis.__memotifyDevDb,
    identify: async (req) => {
      const match = /^Bearer dev:([^:]+):([^:]+)(:admin)?$/.exec(String(req.headers?.authorization || ""));
      if (!match) return { error: "no_token", detail: "No sign-in token was sent." };
      return {
        uid: match[1],
        email: match[2],
        name: match[1],
        emailVerified: true,
        admin: Boolean(match[3]),
      };
    },
  });
}
