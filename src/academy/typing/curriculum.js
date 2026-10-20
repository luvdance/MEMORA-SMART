import {
  keyDrill,
  wordStream,
  punctuatedStream,
  numberStream,
  symbolDrill,
  digitDrill,
  punctDrill,
  passage,
  codeSnippet,
  codeSnippets,
  dataEntryLine,
  wordsFrom,
} from "./text.js";

/**
 * THE TOUCH-TYPING PATH
 *
 * Keys are introduced in the order the fingers reach them from the home row,
 * two at a time and mirrored across the hands, which is how every serious
 * typing programme teaches. Each lesson only ever contains keys already
 * taught plus the new pair, so a learner is never asked to find a key they
 * have not been shown.
 *
 * KEYBOARD GUIDANCE FADES. A learner who can always see a highlighted key
 * never builds the memory of where it is. So:
 *   guide "full"  the next key and its finger are shown (first contact)
 *   guide "hint"  the keyboard is only highlighted after a hesitation
 *   guide "blind" no keyboard at all — the goal state
 * The learner can still override this in settings, but the default walks
 * them toward not looking.
 *
 * PASSING is about accuracy before speed: a lesson is passed at 90% accuracy
 * regardless of speed. Stars reward hitting the speed target on top of that.
 */

const HOME = [..."asdfjkl;"];
const HOME_G = [...HOME, "g", "h"];
const TOP_STEPS = [["e", "i"], ["r", "u"], ["t", "y"], ["w", "o"], ["q", "p"]];
const BOTTOM_STEPS = [["c", ","], ["v", "m"], ["x", "."], ["z", "/"], ["b", "n"]];

const upto = (sets) => [...new Set([" ", ...sets.flat()])];

function keysLesson(id, title, newKeys, allowed, extra = {}) {
  return {
    id,
    title,
    newKeys,
    kind: "keys",
    make: (rand) => keyDrill(rand, { newKeys, allowed, length: extra.length || 130 }),
    ...extra,
  };
}

function letterWordsLesson(id, title, allowed, extra = {}) {
  return {
    id,
    title,
    newKeys: [],
    kind: "words",
    make: (rand) => {
      const words = wordsFrom(allowed);
      const out = [];
      let size = 0;
      while (size < (extra.length || 170)) {
        const w = words[Math.floor(rand() * words.length)];
        out.push(w);
        size += w.length + 1;
      }
      return out.join(" ");
    },
    ...extra,
  };
}

const capitalise = (s) =>
  s
    .split(" ")
    .map((w, i) => (i % 2 === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

const ALL_LETTERS = upto([HOME_G, ...TOP_STEPS, ...BOTTOM_STEPS]);

export const STAGES = [
  {
    id: "ready",
    title: "Get Ready",
    icon: "fas fa-hands",
    blurb: "Posture and finger placement: where each finger rests before you type a single drill.",
    guide: "full",
    target: 8,
    lessons: [
      {
        id: "place-1",
        title: "Finger placement",
        newKeys: [..."asdfjkl;"],
        kind: "placement",
        // The eyes-up check at the end of the walkthrough.
        make: () => "asdf jkl; asdf jkl; fdsa ;lkj fj dk sl a; asdf jkl;",
      },
    ],
  },
  {
    id: "home",
    title: "Home Row",
    icon: "fas fa-house",
    blurb: "Anchor your fingers on A S D F and J K L ; — feel the bumps on F and J.",
    guide: "full",
    target: 12,
    lessons: [
      keysLesson("home-1", "F and J — your anchors", ["f", "j"], upto([["f", "j"]])),
      keysLesson("home-2", "D and K", ["d", "k"], upto([[..."fjdk"]])),
      keysLesson("home-3", "S and L", ["s", "l"], upto([[..."fjdksl"]])),
      keysLesson("home-4", "A and ;", ["a", ";"], upto([HOME])),
      keysLesson("home-5", "G and H — index reach", ["g", "h"], upto([HOME_G])),
      letterWordsLesson("home-6", "Home row words", upto([HOME_G])),
    ],
  },
  {
    id: "top",
    title: "Top Row",
    icon: "fas fa-arrow-up",
    blurb: "Reach up and come straight back home after every key.",
    guide: "full",
    target: 16,
    lessons: [
      ...TOP_STEPS.map((pair, i) =>
        keysLesson(
          `top-${i + 1}`,
          `${pair[0].toUpperCase()} and ${pair[1].toUpperCase()}`,
          pair,
          upto([HOME_G, ...TOP_STEPS.slice(0, i + 1)])
        )
      ),
      letterWordsLesson("top-6", "Top row words", upto([HOME_G, ...TOP_STEPS])),
    ],
  },
  {
    id: "bottom",
    title: "Bottom Row",
    icon: "fas fa-arrow-down",
    blurb: "Curl down for the bottom row. After this you know every letter.",
    guide: "hint",
    target: 20,
    lessons: [
      ...BOTTOM_STEPS.map((pair, i) =>
        keysLesson(
          `bottom-${i + 1}`,
          `${pair[0].toUpperCase()} and ${pair[1] === "," ? "comma" : pair[1] === "." ? "period" : pair[1] === "/" ? "slash" : pair[1].toUpperCase()}`,
          pair,
          upto([HOME_G, ...TOP_STEPS, ...BOTTOM_STEPS.slice(0, i + 1)])
        )
      ),
      letterWordsLesson("bottom-6", "The whole alphabet", ALL_LETTERS, { length: 200 }),
    ],
  },
  {
    id: "shift",
    title: "Capitals & Shift",
    icon: "fas fa-up-long",
    blurb: "Shift with the OPPOSITE pinky: left Shift for right-hand letters, right Shift for left-hand ones.",
    guide: "hint",
    target: 22,
    lessons: [
      {
        id: "shift-1",
        title: "Left Shift — capitals on the right hand",
        newKeys: ["ShiftLeft"],
        kind: "keys",
        make: (rand) =>
          wordStream(rand, 26, wordsFrom(ALL_LETTERS).filter((w) => /^[yuiophjklnm]/.test(w)))
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" "),
      },
      {
        id: "shift-2",
        title: "Right Shift — capitals on the left hand",
        newKeys: ["ShiftRight"],
        kind: "keys",
        make: (rand) =>
          wordStream(rand, 26, wordsFrom(ALL_LETTERS).filter((w) => /^[qwertasdfgzxcvb]/.test(w)))
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" "),
      },
      {
        id: "shift-3",
        title: "Mixed capitals",
        newKeys: [],
        kind: "words",
        make: (rand) => capitalise(wordStream(rand, 30, wordsFrom(ALL_LETTERS))),
      },
      {
        id: "shift-4",
        title: "Sentences",
        newKeys: [],
        kind: "text",
        make: (rand) => passage(rand, 1),
      },
    ],
  },
  {
    id: "punct",
    title: "Punctuation",
    icon: "fas fa-quote-left",
    blurb: "Apostrophes, quotes, colons, question marks and dashes — the right pinky's territory.",
    guide: "hint",
    target: 24,
    lessons: [
      {
        id: "punct-1",
        title: "Apostrophe and quotes",
        newKeys: ["'", '"'],
        kind: "keys",
        make: (rand) => punctDrill(rand, "quotes"),
      },
      {
        id: "punct-2",
        title: "Colon, question and exclamation",
        newKeys: [":", "?", "!"],
        kind: "keys",
        make: (rand) => punctDrill(rand, "stops"),
      },
      {
        id: "punct-3",
        title: "Dash, hyphen and brackets",
        newKeys: ["-", "(", ")"],
        kind: "keys",
        make: (rand) => punctDrill(rand, "dashes"),
      },
      {
        id: "punct-4",
        title: "Real punctuated text",
        newKeys: [],
        kind: "text",
        make: (rand) => punctuatedStream(rand, 34),
      },
    ],
  },
  {
    id: "numbers",
    title: "Number Row",
    icon: "fas fa-hashtag",
    blurb: "Reach up two rows from home, keeping the same finger for each column.",
    guide: "hint",
    target: 22,
    lessons: [
      keysLesson("num-1", "1 2 3 4 5 — left hand", [..."12345"], [" ", ..."12345", ..."asdfg"], {
        make: (rand) => digitDrill(rand, [..."12345"]),
      }),
      keysLesson("num-2", "6 7 8 9 0 — right hand", [..."67890"], [" ", ..."67890"], {
        make: (rand) => digitDrill(rand, [..."67890"]),
      }),
      {
        id: "num-3",
        title: "Numbers, prices and percentages",
        newKeys: ["$", "%"],
        kind: "text",
        make: (rand) => numberStream(rand, 26),
      },
      {
        id: "num-4",
        title: "Data entry: dates, phones and invoices",
        newKeys: [],
        kind: "text",
        make: (rand) => Array.from({ length: 4 }, () => dataEntryLine(rand)).join(" "),
      },
    ],
  },
  {
    id: "symbols",
    title: "Symbols",
    icon: "fas fa-at",
    blurb: "The shifted number row and the brackets — what email, passwords and code are built from.",
    guide: "hint",
    target: 20,
    lessons: [
      { id: "sym-1", title: "! @ # $ %", newKeys: [..."!@#$%"], kind: "keys", make: (r) => symbolDrill(r, [..."!@#$%"], 130) },
      { id: "sym-2", title: "^ & * ( )", newKeys: [..."^&*()"], kind: "keys", make: (r) => symbolDrill(r, [..."^&*()"], 130) },
      { id: "sym-3", title: "- _ = +", newKeys: [..."-_=+"], kind: "keys", make: (r) => symbolDrill(r, [..."-_=+"], 130) },
      { id: "sym-4", title: "[ ] { } \\ |", newKeys: [..."[]{}\\|"], kind: "keys", make: (r) => symbolDrill(r, [..."[]{}\\|"], 130) },
      { id: "sym-5", title: "` ~ < > /", newKeys: [..."`~<>/"], kind: "keys", make: (r) => symbolDrill(r, [..."`~<>/"], 130) },
      {
        id: "sym-6",
        title: "Emails, links and passwords",
        newKeys: [],
        kind: "text",
        make: (rand) => Array.from({ length: 5 }, () => dataEntryLine(rand)).join(" "),
      },
    ],
  },
  {
    id: "code",
    title: "Code",
    icon: "fas fa-code",
    blurb: "Real snippets in the languages the Academy teaches. Indentation is filled in for you.",
    guide: "blind",
    target: 22,
    lessons: [
      { id: "code-1", title: "JavaScript", newKeys: [], kind: "code", make: (r) => codeSnippets(r, "javascript") },
      { id: "code-2", title: "Python", newKeys: [], kind: "code", make: (r) => codeSnippets(r, "python") },
      { id: "code-3", title: "HTML & CSS", newKeys: [], kind: "code", make: (r) => codeSnippet(r, "html") + "\n" + codeSnippet(r, "css") },
      { id: "code-4", title: "SQL", newKeys: [], kind: "code", make: (r) => codeSnippet(r, "sql") },
      { id: "code-5", title: "C++ and the terminal", newKeys: [], kind: "code", make: (r) => codeSnippet(r, "cpp") + "\n" + codeSnippet(r, "shell") },
    ],
  },
  {
    id: "fluency",
    title: "Blind Fluency",
    icon: "fas fa-eye-slash",
    blurb: "No keyboard on screen. Longer texts, higher targets — this is touch typing.",
    guide: "blind",
    target: 40,
    lessons: [
      { id: "flu-1", title: "Common words sprint", newKeys: [], kind: "words", make: (r) => wordStream(r, 50), target: 35 },
      { id: "flu-2", title: "Paragraph", newKeys: [], kind: "text", make: (r) => passage(r, 2), target: 35 },
      { id: "flu-3", title: "Punctuated paragraph", newKeys: [], kind: "text", make: (r) => punctuatedStream(r, 55), target: 38 },
      { id: "flu-4", title: "Office day: mixed data", newKeys: [], kind: "text", make: (r) => `${passage(r, 1)} ${dataEntryLine(r)} ${dataEntryLine(r)}`, target: 38 },
      { id: "flu-5", title: "Final: three paragraphs", newKeys: [], kind: "text", make: (r) => passage(r, 3), target: 45 },
    ],
  },
];

/* Flatten, numbering lessons and giving each its stage defaults. */
export const LESSONS = STAGES.flatMap((stage, s) =>
  stage.lessons.map((lesson, i) => ({
    ...lesson,
    stageId: stage.id,
    stageTitle: stage.title,
    stageIndex: s,
    index: i,
    guide: lesson.guide || stage.guide,
    target: lesson.target || stage.target,
  }))
);

export const LESSON_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));

export const PASS_ACCURACY = 90;

/**
 * Stars for a finished lesson.
 *   1★ passed — 90%+ accuracy
 *   2★ 94%+ accuracy at three quarters of the speed target
 *   3★ 97%+ accuracy at the full speed target
 */
export function starsFor({ wpm, accuracy }, target) {
  if (accuracy < PASS_ACCURACY) return 0;
  if (accuracy >= 97 && wpm >= target) return 3;
  if (accuracy >= 94 && wpm >= target * 0.75) return 2;
  return 1;
}

/** A lesson is open once the one before it has been passed. */
export function isUnlocked(lessonId, lessonRecords = {}) {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  if (i <= 0) return true;
  // Anything already attempted stays open, so adding a lesson earlier in the
  // path never locks a learner out of work they have done.
  if (lessonRecords[lessonId]) return true;
  return (lessonRecords[LESSONS[i - 1].id]?.stars || 0) >= 1;
}

export function nextLesson(lessonRecords = {}) {
  return LESSONS.find((l) => !(lessonRecords[l.id]?.stars >= 1)) || null;
}

export function stageProgress(stage, lessonRecords = {}) {
  const stars = stage.lessons.reduce((n, l) => n + (lessonRecords[l.id]?.stars || 0), 0);
  const passed = stage.lessons.filter((l) => (lessonRecords[l.id]?.stars || 0) >= 1).length;
  return { stars, maxStars: stage.lessons.length * 3, passed, total: stage.lessons.length };
}
