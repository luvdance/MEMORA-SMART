/**
 * MOBILE APP DEVELOPMENT · MODULE 21 · CAPSTONE PROJECT AND PROFESSIONAL READINESS
 *
 * Curriculum 21.1 – 21.P (Phase 12, weeks 21–24): choosing and scoping a
 * capstone, requirements, technical design, planning, building, a quality
 * pass, beta testing on both platforms, launch, the portfolio, and
 * professional readiness. The capstone itself is built on the learner's
 * own computer and phones; the labs check the documents that guide it.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s21-capstone";
const MODULE = "md-m21-capstone";

const docLayout = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Capstone" }} />
    </Stack>
  );
}
`;
const docHome = (file) => `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>This lab is a document: see ${file}.</Text>;
}
`;
const doc = (file) => `const d = code('${file}'); const section = (h) => { const i = d.indexOf(h); if (i < 0) return ''; const rest = d.slice(i + h.length); const j = rest.search(/\\n## /); return j < 0 ? rest : rest.slice(0, j); };`;

/* ── 21.2 · Requirements ─────────────────────────────────────────────── */
const REQ_START = `# Requirements: Kobo Tailor

A booking app for tailors in Lagos and their customers: customers find a tailor, book a fitting, send measurements and track their order; tailors manage bookings.

## Users

## User stories (MVP)

## Later (not in the MVP)
`;
const REQ_MODEL = `# Requirements: Kobo Tailor

A booking app for tailors in Lagos and their customers: customers find a tailor, book a fitting, send measurements and track their order; tailors manage bookings.

## Users

- Customers: people in Lagos who want clothes made, mostly on mid-range Android phones.
- Tailors: small workshops with one to five staff, managing bookings on one phone.

## User stories (MVP)

1. As a customer, I want to find tailors near me, so that I don't travel across Lagos for a fitting.
   - Given location is allowed, when I open the app, then I see tailors sorted by distance with their rating.
   - Given location is refused, when I type my area, then I see tailors in that area.
2. As a customer, I want to book a fitting time, so that I don't wait at the shop.
   - Given a tailor has free slots, when I choose one and confirm, then the booking appears in My bookings and the tailor is notified.
   - Given the slot was just taken, when I confirm, then I'm told and shown the next free slots.
3. As a customer, I want to send my measurements, so that the tailor can start before I arrive.
   - Given I'm on a booking, when I enter measurements and save, then the tailor sees them on the booking.
4. As a customer, I want to be notified when my order is ready, so that I collect it on time.
   - Given notifications are allowed, when the tailor marks the order ready, then I get a push notification that opens the order.
5. As a tailor, I want to see today's bookings, so that I can plan the day.
   - Given I'm signed in as a tailor, when I open the app, then I see today's bookings in time order, also offline.

## Later (not in the MVP)

- Payments for deposits.
- Chat between customers and tailors.
- Reviews and ratings written in the app.
`;

/* ── 21.3 · Technical design ─────────────────────────────────────────── */
const DESIGN_START = `# Technical design: Kobo Tailor

## Architecture

## Data model

## API

## Risks
`;
const DESIGN_MODEL = `# Technical design: Kobo Tailor

## Architecture

- App: Expo SDK 58, Expo Router (tabs: Find, Bookings, Profile), TanStack Query for server data, a session context, SecureStore for tokens, expo-notifications, expo-location.
- Backend: Supabase (Postgres, Auth, Storage for measurement photos, Row Level Security), plus one Edge Function that sends push notifications through Expo's push service.
- Builds and releases: EAS Build (development, preview, production), EAS Submit, EAS Update on the production channel.

## Data model

| Table | Columns | Notes |
| --- | --- | --- |
| profiles | id (= auth user), role (customer or tailor), name, phone | One per user |
| tailors | id, owner_id → profiles, name, area, latitude, longitude, rating | Indexed by area |
| slots | id, tailor_id → tailors, starts_at, booked | Unique (tailor_id, starts_at) |
| bookings | id, slot_id → slots, customer_id → profiles, status, measurements (json) | status: booked, ready, collected |
| devices | id, user_id → profiles, expo_push_token | For notifications |

## API

| Method | Path | Who | Purpose |
| --- | --- | --- | --- |
| GET | /tailors?near=lat,lng | anyone signed in | Tailors sorted by distance |
| GET | /tailors/:id/slots | anyone signed in | Free slots for the next 14 days |
| POST | /bookings | customer | Book a slot (fails with 409 if taken) |
| PATCH | /bookings/:id | owner tailor, or the customer for measurements | Update status or measurements |
| GET | /bookings?mine | signed-in user | The user's bookings |
| POST | /devices | signed-in user | Register a push token |

## Risks

- Double booking: a unique constraint on slots and a transaction in POST /bookings.
- Privacy: measurements are personal; RLS limits them to the customer and the booking's tailor.
- Push on iOS needs Apple credentials: set up through EAS early.
`;

/* ── 21.9 · Portfolio README ─────────────────────────────────────────── */
const README_START = `# Kobo Tailor
`;
const README_MODEL = `# Kobo Tailor

Book a fitting with a tailor near you in Lagos, send your measurements, and get told when your clothes are ready. Built with Expo (React Native) for Android and iOS.

[Google Play](https://play.google.com/store/apps/details?id=ng.kobo.tailor) · [TestFlight](https://testflight.apple.com/join/Kb7T41lr) · [Demo video](https://youtu.be/kobo-tailor-demo)

## Screenshots

![Find a tailor](docs/screens/find.png) ![Book a fitting](docs/screens/book.png) ![Order ready](docs/screens/ready.png)

## Features

- Find tailors by distance, or by typing an area when location is off.
- Book fitting slots, with double-booking prevented on the server.
- Send measurements; get a push notification when the order is ready.
- Works offline for a tailor's day of bookings.

## Tech stack

Expo SDK 58, React Native 0.88, TypeScript, Expo Router, TanStack Query, Supabase (Postgres, Auth, Storage, RLS), expo-notifications, expo-location, Jest and React Native Testing Library, Maestro, EAS Build, Submit and Update, Sentry.

## Architecture

The app talks to Supabase directly, protected by Row Level Security on every table; one Edge Function sends push notifications. See docs/design.md for the data model and API.

## Getting started

1. npm install
2. Copy .env.example to .env.local and add your Supabase URL and anon key.
3. npx expo start, then open a development build (npx eas-cli build --profile development).

## Testing

npm test runs unit, component and integration tests; maestro test .maestro/ runs the end-to-end booking flow. CI runs both on every pull request.

## What I learned

Designing Row Level Security policies before writing screens saved me from two data-leak bugs; and testing on a ₦90,000 Android phone changed how I built the lists.
`;

/* ── 21.P · Case study ───────────────────────────────────────────────── */
const CASE_START = `# Case study: Kobo Tailor

## The problem

## Who it's for

## What I built

## Key decisions

## Challenges

## Results

## Links

## What I'd do next
`;
const CASE_MODEL = `# Case study: Kobo Tailor

## The problem

Tailors in Lagos take bookings by phone and WhatsApp, so fittings clash, customers wait, and measurements get lost in chats. I interviewed 4 tailors and 10 customers: all of them had missed or double-booked appointments in the last month.

## Who it's for

Customers who want clothes made, mostly on mid-range Android phones, and small tailoring workshops that manage bookings on one shared phone.

## What I built

An Expo app for Android and iOS: find tailors by distance, book fitting slots, send measurements, and get a push notification when the order is ready. Tailors see the day's bookings, even offline. Supabase stores the data, protected by Row Level Security.

## Key decisions

- Supabase instead of my own server, so I could spend the four weeks on the product; RLS policies written and tested before any screen.
- Android first: most users are on Android, so I tested every build on a budget phone.
- A unique constraint and a transaction to make double booking impossible, not just unlikely.

## Challenges

- Push notifications on iOS needed Apple credentials; setting them up with EAS in week one avoided a launch delay.
- The tailors' list was slow on the budget phone; switching to FlatList with fixed row heights and smaller images fixed it.

## Results

- 14 testers in the Google Play closed test for 14 days, and 9 on TestFlight.
- 63 bookings made during the test, with no double bookings; crash-free sessions 99.6%.
- Three tailors said they'd keep using it; their top request was deposits.

## Links

- Google Play: https://play.google.com/store/apps/details?id=ng.kobo.tailor
- TestFlight: https://testflight.apple.com/join/Kb7T41lr
- Code: https://github.com/ada-obi/kobo-tailor
- Demo video: https://youtu.be/kobo-tailor-demo

## What I'd do next

Deposits with a hosted checkout and webhooks, chat between customers and tailors, and Yoruba and Pidgin translations written with native speakers.
`;

export const LESSONS = [
  /* ═══════════════ LESSON 138 · 21.1 – 21.2 ═══════════════ */
  {
    id: "md-l138-scope-requirements",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["21.1", "21.2"],
    title: "Choosing a Capstone, and Writing Its Requirements",
    subtitle: "A real problem, real users, and a small first version",
    estimatedMinutes: 60,
    intro: "The last four weeks are yours: one complete app, built and released to testers on Android and iOS, that shows everything you can do.",
    atoms: [
      {
        id: "a-md-capstone-scope",
        title: "Choosing and scoping a capstone",
        explain:
          "Choose a REAL PROBLEM for people you can reach (a business you know, your community, your school, a club), because real users give you real feedback and a real story for interviews. Then cut it to a MINIMUM VIABLE PRODUCT: the smallest version that solves the core problem end to end, buildable in about three weeks: typically 3–5 core user stories, sign-in, one or two device features, a backend, and a release to testers on both platforms. Write down what is OUT of scope (payments, chat, admin dashboards are classic scope traps). Good capstones show the whole course: a clean structure, server data, accounts, a device feature, tests, accessibility, security and a store release. A small app that is finished and released beats a big one that isn't.",
        decision: {
          scenario: "You have four weeks for your capstone. Your three ideas: (1) a full social network with video, chat, stories and payments; (2) a booking app for tailors you know, with booking, measurements and ready-notifications; (3) a to-do list app from a tutorial.",
          question: "Which is the best capstone, and why?",
          options: [
            { id: "a", text: "(2): a real problem with reachable users and a clear MVP (booking, measurements, notifications) that fits in four weeks and uses the whole course", why: "It's small enough to finish, real enough to test with users, and covers backend, auth, a device feature, tests and a release." },
            { id: "b", text: "(1): it's the most impressive", whyWrong: "Far too big to finish in four weeks; an unfinished app shows less than a finished small one." },
            { id: "c", text: "(3): it's the safest", whyWrong: "A tutorial copy shows little of your own judgement and has no users or story." },
            { id: "d", text: "All three, in parallel", whyWrong: "Splits your time; none would be finished." },
          ],
          correct: "a",
          aftermath: "Real problem, real users, small enough to ship.",
        },
      },
      {
        id: "a-md-user-stories",
        title: "Product requirements: user stories and acceptance criteria",
        explain:
          "Write REQUIREMENTS before code, in a short document your future self (and testers, and interviewers) can read. Describe the USERS. Then USER STORIES in the form \"As a <user>, I want <something>, so that <benefit>\": the benefit keeps you honest about why. Give each story ACCEPTANCE CRITERIA in Given / When / Then form (Given a tailor has free slots, When I choose one and confirm, Then the booking appears in My bookings), including the unhappy paths (no permission, slot taken, offline): these become your tests. Mark which stories are in the MVP and list what's deliberately LATER. Keep it to a page or two; update it as you learn.",
        webLab: expoLab({
          name: "Capstone",
          layout: docLayout,
          task:
            "Complete docs/requirements.md for the Kobo Tailor capstone: a Users section describing at least two kinds of user; at least five user stories under \"## User stories (MVP)\", each written \"As a …, I want …, so that …\" with at least one Given / When / Then acceptance criterion (and at least two stories with an unhappy-path criterion, such as permission refused or the slot already taken); and at least two items under \"## Later (not in the MVP)\".",
          files: { "docs/requirements.md": REQ_START, "src/app/index.tsx": docHome("docs/requirements.md") },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "docs/requirements.md": REQ_MODEL },
          tests: [
            { label: "The users are described", check: `${doc("docs/requirements.md")} return (section('## Users').match(/^- /gm) || []).length >= 2;`, fail: "At least two kinds of user under ## Users." },
            { label: "Five user stories in the right form", check: `${doc("docs/requirements.md")} const s = section('## User stories (MVP)'); return (s.match(/As an? [^,]+, I want [^,]+, so that /g) || []).length >= 5;`, fail: "\"As a …, I want …, so that …\", five times." },
            { label: "Each story has acceptance criteria, including unhappy paths", check: `${doc("docs/requirements.md")} const s = section('## User stories (MVP)'); const stories = s.split(/\\n(?=\\d+\\. )/).filter((x) => /As an? /.test(x)); const gwt = stories.filter((x) => /Given [^,]+, when [^,]+, then /i.test(x)); const unhappy = stories.filter((x) => /(refused|denied|taken|offline|fails|error|no network)/i.test(x)); return stories.length >= 5 && gwt.length === stories.length && unhappy.length >= 2;`, fail: "\"Given …, when …, then …\" under every story; two stories with an unhappy path." },
            { label: "What's out of scope is written down", check: `${doc("docs/requirements.md")} return (section('## Later (not in the MVP)').match(/^- /gm) || []).length >= 2;`, fail: "At least two items under ## Later." },
          ],
          hint: "Number the stories (1., 2., …) and indent their criteria as bullet points.",
          successMessage: "Requirements you can build, test and explain.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 139 · 21.3 – 21.4 ═══════════════ */
  {
    id: "md-l139-design-plan",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["21.3", "21.4"],
    title: "Technical Design and Planning the Build",
    subtitle: "Decide the architecture, data and API first; then plan the weeks",
    estimatedMinutes: 55,
    intro: "An hour of design saves days of rework. Then turn the design into a plan you can follow and track.",
    atoms: [
      {
        id: "a-md-technical-design",
        title: "Technical design: architecture, data model and API contract",
        explain:
          "A short DESIGN DOCUMENT answers: ARCHITECTURE (the app's main parts and libraries; the backend: your own server or a BaaS; how builds and updates ship), the DATA MODEL (tables or collections, their columns, relationships and constraints), the API CONTRACT (each endpoint or query: method, path, who may call it, what it does and returns; written before both sides are built, so the app and the server agree), and RISKS with mitigations (double bookings, privacy, platform setup that takes time, like iOS push credentials). Use tables: they're quick to read and review. This is also what you'll walk an interviewer through.",
        webLab: expoLab({
          name: "Capstone",
          layout: docLayout,
          task:
            "Complete docs/design.md: an Architecture section (the app's stack, the backend, and how it's built and released, mentioning EAS); a Data model table with at least four tables, showing at least two relationships (→); an API table (Method, Path, Who, Purpose) with at least five endpoints including GET and POST; and at least two Risks, each with its mitigation.",
          files: { "docs/design.md": DESIGN_START, "src/app/index.tsx": docHome("docs/design.md") },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "docs/design.md": DESIGN_MODEL },
          tests: [
            { label: "The architecture covers the app, the backend and releases", check: `${doc("docs/design.md")} const a = section('## Architecture'); return /Expo/i.test(a) && /(Supabase|Firebase|server|backend|API)/i.test(a) && /EAS/.test(a) && (a.match(/^- /gm) || []).length >= 2;`, fail: "The app, the backend, and EAS builds and releases." },
            { label: "A data model with relationships", check: `${doc("docs/design.md")} const m = section('## Data model'); const rows = m.split('\\n').filter((l) => /^\\|/.test(l) && !/^\\|\\s*-/.test(l)); return rows.length - 1 >= 4 && (m.match(/→/g) || []).length >= 2;`, fail: "A table with a header and at least four tables, two of them referencing another (→)." },
            { label: "An API contract", check: `${doc("docs/design.md")} const p = section('## API'); const rows = p.split('\\n').filter((l) => /^\\|\\s*(GET|POST|PUT|PATCH|DELETE)\\s*\\|/.test(l)); return rows.length >= 5 && rows.some((r) => /GET/.test(r)) && rows.some((r) => /POST/.test(r)) && /\\|\\s*Who\\s*\\|/i.test(p);`, fail: "| Method | Path | Who | Purpose | with five endpoints." },
            { label: "Risks with mitigations", check: `${doc("docs/design.md")} const r = section('## Risks'); return (r.match(/^- [^:\\n]+:/gm) || []).length >= 2;`, fail: "- Risk: mitigation, at least twice." },
          ],
          hint: "Markdown tables: a header row, a | --- | row, then one row per item.",
          successMessage: "A design you can build from, review with others, and present.",
        }),
      },
      {
        id: "a-md-build-plan",
        title: "Planning the build: milestones, issues and a Git workflow",
        explain:
          "Turn the stories into a PLAN. MILESTONES by week, each ending with something working on a real phone: week 1 skeleton (navigation, sign-in, backend, a development build on both platforms, CI running tests), week 2 the core stories, week 3 the rest plus the quality pass, week 4 beta testing, fixes and launch. Break stories into ISSUES (GitHub Issues or a project board) small enough to finish in a day, each linked to its acceptance criteria. Work on a BRANCH per issue, open a PULL REQUEST, let CI run the tests, review it (yourself if solo, the next morning), and merge to main; tag releases. Track time honestly: if week 2 slips, cut scope (move a story to Later), don't cut quality or the release. And start the slow external steps on day one: the developer accounts, Apple credentials and Google's 14-day closed test.",
        decision: {
          scenario: "Day one of your four-week capstone. You can start on any of these.",
          question: "What should you do first?",
          options: [
            { id: "a", text: "Create the Google Play and Apple developer accounts, set up the project with a development build on both phones, CI and the backend, and plan the closed test so its 14 days end before launch", why: "The slowest steps are external and calendar-bound; a working skeleton on real devices de-risks everything after it." },
            { id: "b", text: "Design the perfect logo and splash screen", whyWrong: "Polish can come later; accounts and the closed test can't be hurried." },
            { id: "c", text: "Build all the screens, then look at publishing in week 4", whyWrong: "Google's 14-day closed test (and review times) would push launch past the deadline." },
            { id: "d", text: "Write the whole app on main without branches to save time", whyWrong: "Branches, PRs and CI catch breakage early and leave a history that shows how you work." },
          ],
          correct: "a",
          aftermath: "Start the slow external steps first, and keep something working on a real phone every week.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 140 · 21.5 – 21.6 ═══════════════ */
  {
    id: "md-l140-build-quality",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["21.5", "21.6"],
    title: "Building the Core Flows, and the Quality Pass",
    subtitle: "Thin slices that work end to end, then a deliberate check of everything",
    estimatedMinutes: 45,
    intro: "Build the app the way professionals do: one complete slice at a time, then a quality pass before anyone else sees it.",
    atoms: [
      {
        id: "a-md-core-flows",
        title: "Building the core flows of the app",
        explain:
          "Build VERTICAL SLICES: one user story at a time, all the way through: the screen, its states (loading, empty, error, offline), the API or query, the database rule, the tests, and a check on a real Android phone and iPhone. Start with the riskiest story (the one with the most unknowns), not the easiest. Reuse what this course built: the folder structure (Module 10), the API client with retries (Module 13), the session and refresh logic (Module 15), the permission patterns (Module 16). Commit at each working step, keep main always releasable, and demo each slice to a real user as soon as it works: their reaction will change your plan more than any document.",
        decision: {
          scenario: "Week two. The booking flow needs a screen, an API endpoint, a database constraint and push notifications. You could build all the screens first and connect them later, or finish booking completely first.",
          question: "Which approach is better, and why?",
          options: [
            { id: "a", text: "Finish the booking story end to end (screen with all its states, API, constraint, notification, tests, real phones) before starting the next", why: "A vertical slice proves the whole path works, surfaces integration problems early, and gives you something real to show users." },
            { id: "b", text: "Build every screen first with fake data, and connect them all in week four", whyWrong: "Integration problems all appear at the end, when there's no time left to fix them." },
            { id: "c", text: "Build the backend completely first, then all the screens", whyWrong: "You can't test the experience or get user feedback until late." },
            { id: "d", text: "Skip loading and error states to move faster", whyWrong: "They're part of the story: real networks fail, and testers will hit them on day one." },
          ],
          correct: "a",
          aftermath: "Slice by slice, each one working on real phones, starting with the riskiest.",
        },
      },
      {
        id: "a-md-quality-pass",
        title: "Quality pass: tests, accessibility, performance and a security review",
        explain:
          "Before beta, a deliberate QUALITY PASS against everything this course taught. TESTS: unit tests for rules, component tests for shared components, integration tests for sign-in and the core flow, one Maestro flow; all green in CI (Module 18). ACCESSIBILITY: VoiceOver and TalkBack through the main flows, the largest text size, contrast and touch targets (Module 17). PERFORMANCE: a release build on a mid-range Android phone: start-up time, smooth lists, image sizes (Modules 17–18). SECURITY: the Module 19 review: tokens in SecureStore, no secrets in the bundle, every endpoint or RLS policy checked with a second user, permissions trimmed, npm audit judged. PRIVACY AND STORE READINESS: privacy policy, data declarations, account deletion, demo account (Module 20). Write the findings in a short report and fix the high ones before beta.",
        decision: {
          scenario: "Your capstone works and the beta starts in two days. You can only do one more thing before it.",
          question: "Which is the most important?",
          options: [
            { id: "a", text: "Sign in as a second test user and try to read or change the first user's data through the API or database", why: "An authorization hole exposes real testers' personal data, the most serious and least visible defect; the other checks matter too, but this one can harm users." },
            { id: "b", text: "Add a dark-mode toggle", whyWrong: "Nice to have; not a beta blocker." },
            { id: "c", text: "Rewrite the folder structure", whyWrong: "Big change, no user value, high risk right before a release." },
            { id: "d", text: "Add more animations", whyWrong: "Polish, not safety." },
          ],
          correct: "a",
          aftermath: "Before real people use it, make sure nobody can see anyone else's data.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 141 · 21.7 – 21.8 ═══════════════ */
  {
    id: "md-l141-beta-launch",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["21.7", "21.8"],
    title: "Beta Testing and Launch",
    subtitle: "Real testers on Android and iOS, then the stores",
    estimatedMinutes: 50,
    intro: "Beta testing is where your app meets the world for the first time. Launch is where it stays.",
    atoms: [
      {
        id: "a-md-beta-testing",
        title: "Beta testing on Android and iOS",
        explain:
          "ANDROID: run a Google Play CLOSED TEST (invite testers by e-mail list or Google Group; they opt in through a link and install from Play), with at least 12 testers for 14 continuous days if you have a new personal account. iOS: TESTFLIGHT, with internal testers at once and external testers by e-mail or a public link after Beta App Review. Recruit testers who match your users (the tailors and customers, not just friends), give them a few TASKS to try and a simple way to report (TestFlight's built-in feedback with screenshots; a short form for Android), and watch crash reports and analytics. Ship fixes during the beta: EAS Update for JavaScript fixes (testers get them on the next launch), new builds for native ones. At the end, write down what changed because of feedback: it's the best part of your case study.",
        decision: {
          scenario: "Your closed test has 12 testers, but after a week only 3 have opened the app, and Google's 14-day requirement counts testers who stay opted in.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Recruit more testers who are real potential users, give everyone two or three concrete tasks with a deadline and an easy feedback form, and keep the count above 12 for the full 14 days", why: "Engaged, relevant testers give useful feedback and keep you eligible for production access; tasks make testing happen." },
            { id: "b", text: "Ask friends to opt in and never open the app", whyWrong: "It may tick the box but gives no feedback, and Google asks about your testing when you apply for production." },
            { id: "c", text: "Skip the closed test and publish to production directly", whyWrong: "New personal accounts can't get production access without it." },
            { id: "d", text: "Restart the test from day one every time a tester leaves", whyWrong: "Unnecessary; keep enough testers opted in throughout instead." },
          ],
          correct: "a",
          aftermath: "Real testers, real tasks, real feedback, for the full fourteen days.",
        },
      },
      {
        id: "a-md-launch",
        title: "Launch: store listings, release and monitoring",
        explain:
          "LAUNCH is a short checklist executed calmly: the release build that passed beta; store listings with real screenshots and honest text in both consoles (Module 20); every declaration complete (privacy, data safety, content rating, demo account); submit for review on both stores; release with a STAGED ROLLOUT on Google Play and a PHASED RELEASE on the App Store; then MONITOR for 48 hours (crash-free users, Android vitals, App Store Connect, reviews, support e-mail) with a fix path ready (EAS Update or a new build). Tell your testers and your users it's live, and ask early users for a review (in the app, with expo-store-review, after a successful moment, never with a reward). Launch on a weekday morning, not before a weekend.",
        decision: {
          scenario: "Both stores approved your capstone on Thursday evening. You're travelling on Friday and Saturday.",
          question: "When and how should you release it?",
          options: [
            { id: "a", text: "Hold it (manual release) and release on Monday morning with a staged rollout and phased release, when you can watch the crash reports and respond", why: "Approval and release are separate steps; releasing when you can monitor and fix keeps a launch problem small." },
            { id: "b", text: "Release to 100% immediately before you leave", whyWrong: "Problems would reach every user while nobody can respond." },
            { id: "c", text: "Release, and turn off crash reporting to avoid notifications while travelling", whyWrong: "You'd be blind exactly when you need to see." },
            { id: "d", text: "Withdraw the app and resubmit later", whyWrong: "Unnecessary; both stores let you choose when to release an approved version." },
          ],
          correct: "a",
          aftermath: "Release when you can watch, a little at a time, with a fix path ready.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 142 · 21.9 – 21.10 ═══════════════ */
  {
    id: "md-l142-portfolio-career",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["21.9", "21.10"],
    title: "Your Portfolio and Professional Readiness",
    subtitle: "Showing your work, and taking the next step",
    estimatedMinutes: 55,
    intro: "The app proves you can build. The portfolio proves you can explain. Both get you hired.",
    atoms: [
      {
        id: "a-md-portfolio",
        title: "Your portfolio: the README, a case study and a demo video",
        explain:
          "Reviewers spend about a minute on a portfolio project. Make that minute count. The README (your repository's front page): one sentence on what the app does and for whom; links to the store pages or TestFlight and a 1–2 minute DEMO VIDEO; three screenshots; the features; the tech stack; a short architecture summary (link the design document); how to run it (environment variables in .env.example, never real keys); how it's tested; and what you learned. Keep the repository clean: a clear history of pull requests, passing CI, no secrets. The CASE STUDY (21.P) tells the story behind it: problem, users, decisions, challenges, results. Record the demo on a real phone, narrating the main flow in under two minutes.",
        webLab: expoLab({
          name: "Capstone",
          layout: docLayout,
          task:
            "Write the capstone's README.md: a first paragraph saying what the app does, for whom, and that it runs on Android and iOS; links to Google Play (play.google.com), TestFlight or the App Store, and a demo video; sections ## Screenshots (at least three images), ## Features (at least three), ## Tech stack (mentioning Expo and TypeScript), ## Architecture, ## Getting started (with numbered steps, using .env.example rather than real keys), ## Testing and ## What I learned.",
          files: { "README.md": README_START, "src/app/index.tsx": docHome("README.md") },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "README.md": README_MODEL },
          tests: [
            { label: "The opening says what, for whom, and on which platforms", check: "const d = code('README.md'); const first = d.split('\\n').slice(1).join('\\n').trim().split('\\n\\n')[0] || ''; return first.length >= 60 && /Android/.test(first) && /iOS/.test(first);", fail: "One paragraph after the title: what it does, for whom, Android and iOS." },
            { label: "Links to try it and watch it", check: "const d = code('README.md'); return /https:\\/\\/play\\.google\\.com\\//.test(d) && /https:\\/\\/(testflight\\.apple\\.com|apps\\.apple\\.com)\\//.test(d) && /(youtu|vimeo|loom|video)/i.test(d);", fail: "Google Play, TestFlight (or App Store) and demo video links." },
            { label: "The sections a reviewer looks for", check: `${doc("README.md")} return ['## Screenshots', '## Features', '## Tech stack', '## Architecture', '## Getting started', '## Testing', '## What I learned'].every((h) => d.includes(h)) && (section('## Screenshots').match(/!\\[/g) || []).length >= 3 && (section('## Features').match(/^- /gm) || []).length >= 3 && /Expo/.test(section('## Tech stack')) && /TypeScript/.test(section('## Tech stack'));`, fail: "All seven sections, three screenshots, three features, Expo and TypeScript in the stack." },
            { label: "Setup without secrets", check: `${doc("README.md")} const g = section('## Getting started'); return /^1\\. /m.test(g) && /\\.env\\.example/.test(g) && !/(sk_live|service_role|eyJhbGci)/.test(d);`, fail: "Numbered steps, .env.example, and no real keys anywhere." },
          ],
          hint: "Write it for a reviewer with one minute: the most important things first.",
          successMessage: "A README that makes your project understandable, tryable and credible in a minute.",
        }),
      },
      {
        id: "a-md-professional-readiness",
        title: "Professional readiness: interviews, take-home tasks, freelancing and continued learning",
        explain:
          "JOBS: mobile roles ask you to build and explain. Prepare to walk through your capstone (design, trade-offs, one bug you fixed), to code live (a small component, a list with search, fetching with loading and error states), and to answer fundamentals (state and re-renders, navigation, async and networking, storage choices, security basics, how releases work). TAKE-HOME TASKS: read the brief twice, deliver a small, clean, tested solution with a README that explains decisions and what you'd do with more time; don't overbuild. FREELANCING: scope in writing (stories and acceptance criteria), price by milestone, put the client's developer accounts in THEIR name, deliver through their stores, and agree maintenance up front (SDK upgrades and target API deadlines every year). KEEP LEARNING: follow Expo's and React Native's release notes and changelogs, read the docs for each new SDK, contribute to open source, and build something every month.",
        decision: {
          scenario: "A shop owner asks you to build and publish their app. They suggest you publish it under your own Google Play and Apple developer accounts \"to keep things simple\".",
          question: "What's the professional arrangement?",
          options: [
            { id: "a", text: "Ask them to create their own developer accounts (you get access as a team member), agree the scope and milestones in writing, and include a maintenance plan for SDK upgrades and store deadlines", why: "The app belongs to the client; owning the accounts protects them if you part ways, and maintenance is a real, recurring cost they must expect." },
            { id: "b", text: "Agree, and publish under your account", whyWrong: "Moving an app between accounts later is slow or impossible, and ties the client's business to you." },
            { id: "c", text: "Skip a written scope to start faster", whyWrong: "Unwritten scope is the commonest cause of freelance disputes." },
            { id: "d", text: "Promise the app will never need updates", whyWrong: "Store requirements and SDKs change every year; apps need maintenance." },
          ],
          correct: "a",
          aftermath: "Client-owned accounts, written scope, and honest maintenance.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 143 · 21.P ═══════════════ */
  {
    id: "md-l143-capstone",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["21.P"],
    title: "Capstone: Your App, Released, With Its Case Study",
    subtitle: "A complete app on Android and iOS testers' phones, and the story of how you built it",
    estimatedMinutes: 240,
    intro: "This is the course's final piece: your own app, built over the past weeks, in testers' hands on both platforms, explained in a case study.",
    atoms: [
      {
        id: "a-md-capstone",
        title: "Write the capstone case study",
        explain:
          "The capstone app is built on your computer and phones (the practical below); this lab checks its CASE STUDY, the document that turns the project into a story: the problem (with evidence: who you asked, what they said), who it's for, what you built, your key decisions and why, the challenges and how you solved them, the RESULTS (testers, numbers, quotes), links to try it, and what you'd do next. Use the example app's case study as a model, or write your own capstone's.",
        webLab: expoLab({
          name: "Capstone",
          layout: docLayout,
          task:
            "Complete CASE_STUDY.md with every section filled in: The problem (with evidence, at least 150 characters), Who it's for, What I built (mentioning Android and iOS), Key decisions (at least two, each with its reason), Challenges (at least two), Results (at least two with numbers), Links (a Google Play link and a TestFlight or App Store link, plus the code), and What I'd do next.",
          files: { "CASE_STUDY.md": CASE_START, "src/app/index.tsx": docHome("CASE_STUDY.md") },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          revealSolution: false,
          solution: { "CASE_STUDY.md": CASE_MODEL },
          tests: [
            { label: "The problem is real, with evidence", check: `${doc("CASE_STUDY.md")} const p = section('## The problem').trim(); return p.length >= 150 && /\\d/.test(p);`, fail: "Describe the problem and how you know (interviews, numbers)." },
            { label: "Users and the app on both platforms", check: `${doc("CASE_STUDY.md")} return section('## Who it\\'s for').trim().length >= 40 && /Android/.test(section('## What I built')) && /iOS/.test(section('## What I built'));`, fail: "Who it's for; what you built, on Android and iOS." },
            { label: "Decisions and challenges, explained", check: `${doc("CASE_STUDY.md")} return (section('## Key decisions').match(/^- /gm) || []).length >= 2 && (section('## Challenges').match(/^- /gm) || []).length >= 2 && /(so|because|to )/i.test(section('## Key decisions'));`, fail: "At least two decisions with reasons, and two challenges." },
            { label: "Results with numbers", check: `${doc("CASE_STUDY.md")} const r = section('## Results'); return (r.match(/^- .*\\d/gm) || []).length >= 2;`, fail: "Two or more results with numbers (testers, bookings, crash-free rate…)." },
            { label: "Links to try it and see the code, and a next step", check: `${doc("CASE_STUDY.md")} const l = section('## Links'); return /https:\\/\\/play\\.google\\.com\\//.test(l) && /https:\\/\\/(testflight\\.apple\\.com|apps\\.apple\\.com)\\//.test(l) && /https:\\/\\/(github|gitlab)\\.com\\//.test(l) && section('## What I\\'d do next').trim().length >= 40;`, fail: "Google Play, TestFlight/App Store and code links; what you'd do next." },
          ],
          hint: "Write it for someone deciding whether to hire you: specific, honest and short.",
          successMessage: "Your capstone told as a story: problem, decisions, results. That is a portfolio.",
        }),
      },
    ],
    task: {
      title: "The capstone: a complete app released to Android and iOS testers",
      intro: "Weeks 21–24. Build your own app from your requirements and design, and release it to testers on both platforms.",
      prompts: [
        "Week 21: requirements and design written; developer accounts created; a development build running on a real Android phone and iPhone; CI running tests; the backend and sign-in working.",
        "Week 22: the core user stories built as vertical slices, each tested on both phones; the Google Play closed test started (12+ testers, 14 days) and TestFlight testers invited.",
        "Week 23: the remaining stories, the quality pass (tests, accessibility, performance, security review) and fixes from tester feedback (EAS Update for JavaScript fixes).",
        "Week 24: store listings and declarations complete, submitted to both stores, released with a staged rollout and phased release (or ready to release), and monitored.",
        "Publish the README, the case study and a demo video recorded on a real phone.",
        "Mastery checkpoint: present your capstone in 10 minutes: the problem, a live demo on Android and iOS, two decisions you'd defend, one bug you fixed, and what the testers taught you.",
      ],
      closing: "Congratulations: you can now design, build, test, secure and publish mobile apps for Android and iOS.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
