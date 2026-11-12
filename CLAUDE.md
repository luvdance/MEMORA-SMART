# Project notes for Claude

## Writing academy course content

The readers are adults in Nigeria and West Africa. Most read English as a second or third language, often on a phone, and read every word literally. Write every lesson, lab task, question and feedback message for them.

### Plain English

- One idea per sentence. 25 words at most; a sentence over 35 words fails the clarity lint.
- No semicolon chains ("you will do A; B; and C"). Write short sentences instead. Explanations render as one plain paragraph: no Markdown, no bullets.
- Subject, then verb, then object. Prefer the active voice: say who does what.
- Name the thing. Do not start an explanation with "It", "This" or "That" unless the noun is in the sentence before.
- Everyday words. No idioms or figures of speech ("runs on", "the whole road", "earn its place"). Say what you mean.
- No filler: "just", "simply", "basically", "obviously", "of course".
- No AI clichés: delve, tapestry, realm, seamless, game-changer, "it is important to note", and the rest of `AI_TELLS` in `src/academy/writing/textkit.js`.
- British spelling: organise, colour, centre.

### Step by step

- Define every term the first time it appears, in one plain sentence: "A brief is the set of instructions and facts for a piece of writing."
- Spell out every abbreviation on first use: "search engine optimisation (SEO)".
- Never use a term, command or skill before the lesson that teaches it. Write modules in order.
- Teach, then show a finished example, then practise. A lab never comes before the teaching and a worked example.
- A lab task names every heading and limit exactly as the template and checks use them.

### The clarity gate (`scripts/clarity/`)

A module is not finished until `npm run clarity:lint -- <course> --module <module-id>` passes. It checks grammar (LanguageTool, run locally), plain English and progression, and costs nothing. Fix every error by editing the text, then run the course's own check script.

Do not call the Claude API (ANTHROPIC_API_KEY) to rewrite course text. The user removed that step on 2026-11-12 because of its cost.

Rules for the gate:
- A new course is added to `scripts/clarity/courses.mjs` with `enforced: true` before its first module is written.
- The term ledger (`scripts/clarity/ledger/<course>.json`) holds specialist terms only, never everyday words.
- False alarms go in `scripts/clarity/allow/<course>.json`. Keep that file short: every entry switches a check off.
- LanguageTool is installed once with `npm run clarity:setup` (needs Java 17+). `--no-grammar` skips it for a fast check.
