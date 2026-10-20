/**
 * TYPING CONTENT — word banks, passages, code and data-entry generators.
 *
 * Every passage here is original writing for the Academy. Nothing is quoted
 * from books or other typing sites, so it can be shipped and reused freely.
 *
 * Generators take a seeded random source so a drill can be reproduced in the
 * self-test, while a fresh seed per attempt keeps replays from being memorised.
 * Memorising a drill is the opposite of learning to type it.
 */

/* ── Seeded random ───────────────────────────────────────────────────────── */

export function rng(seed = Date.now()) {
  let s = seed >>> 0 || 1;
  return () => {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];

function shuffle(rand, list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ── Word banks ──────────────────────────────────────────────────────────── */

/** The most common English words, which make up most of real-world text. */
export const COMMON_WORDS = `the be to of and a in that have it for not on with he as you do at this but his by
from they we say her she or an will my one all would there their what so up out if about who get which go me
when make can like time no just him know take people into year your good some could them see other than then
now look only come its over think also back after use two how our work first well way even new want because
any these give day most us is was are been has had were said did made find long down side been call water oil
word number sound place where help through much before line right too mean old same tell boy follow came show
form three small set put end does another large must big high such turn here why ask went men read need land
different home move try kind hand picture again change off play spell air away animal house point page letter
mother answer found study still learn should world near add food between own below country plant last school
father keep tree never start city earth eye light thought head under story saw left few while along might close
something seem next hard open example begin life always those both paper together got group often run important
until children feet car mile night walk white sea began grow took river four carry state once book hear stop
without second later miss idea enough eat face watch far real almost let above girl sometimes mountain cut young
talk soon list song being leave family body music color stand sun question fish area mark dog horse birds problem
complete room knew since ever piece told usually friends easy heard order red door sure become top ship across
today during short better best however low hours black products happened whole measure remember early waves
reached listen wind rock space covered fast several hold himself toward five step morning passed vowel true
hundred against pattern table north slowly money map farm pulled draw voice seen cold cried plan notice south
sing war ground fall king town unit figure certain field travel wood fire upon done english road half ten fly
gave box finally wait correct oh quickly person became shown minutes strong verb stars front feel fact inches
street decided contain course surface produce building ocean class note nothing rest carefully scientists inside
wheels stay green known island week less machine base ago stood plane system behind ran round boat game force
brought understand warm common bring explain dry though language shape deep thousands yes clear equation yet
government filled heat full hot check object rule among noun power cannot able six size dark ball material
special heavy fine pair circle include built market data report client office design team skill project budget
career growth value future simple online email phone digital lesson course student teacher practice focus`
  .split(/\s+/)
  .filter(Boolean);

/**
 * Extra words dense in the early keys. With only the home row (a s d f g h j
 * k l) real English is scarce, and nonsense strings teach less than words.
 */
const EARLY_WORDS = `a ad add ads all alas ask asks dad dads fad fads fall falls flag flags flask glad gal gals
gas hash had has half hall halls jag jags lad lads lag lass sad salad salsa sash shall shad flash dash gash slag
kas skald jak hag hags alfalfa jade led sled fed feed seed sea seal see seek deal deals heal heals lead leads
leaf lake lakes jell gel feel feels fleas glee shed she shell sheds keel keeled ledge hedge desk desks fake fakes
sake leak leaks deed deeds dash idea idle aid aids slid kids skid said laid hide hides slide life fill fills
kill hill dial dials sail jail field fields lid lids lie lies die dies skill skills ideal ideas fish dish
ride rides fire fired hire hires dire red rid sir stir fair hair reads dear fear gear hear jars star stars
far fur rug jug rush user users sure lure true tree tries treat start street trust treats juried`
  .split(/\s+/)
  .filter(Boolean);

const ALL_WORDS = [...new Set([...COMMON_WORDS, ...EARLY_WORDS])];

/** Words that use only `allowed` characters. */
export function wordsFrom(allowed) {
  const set = new Set(allowed);
  return ALL_WORDS.filter((w) => [...w].every((c) => set.has(c)));
}

/* ── Passages (original) ─────────────────────────────────────────────────── */

export const PASSAGES = [
  "Typing well is not about moving your fingers faster. It is about never having to think about where the keys are, so your attention stays on the words.",
  "Keep your eyes on the screen and your fingers on the home row. When you feel the small bumps on F and J, you know exactly where every other key is.",
  "A careful typist who makes no mistakes will finish before a fast typist who stops to fix every second word. Accuracy first; speed follows.",
  "The best way to improve is a little practice every day. Fifteen focused minutes beat two hours of tired, careless typing at the end of the week.",
  "Small businesses across Lagos, Accra and Nairobi now run on email, spreadsheets and chat. The person who types quickly answers customers first.",
  "Before you send a report, read it once from top to bottom. A missing comma or a wrong number can change what a sentence means to your manager.",
  "Data entry clerks are often tested at forty words per minute with ninety five percent accuracy. Many offices expect closer to sixty for senior roles.",
  "Programmers type brackets, quotes and semicolons all day. Learning where those symbols live saves thousands of small pauses over a working year.",
  "When you make a mistake, do not look down. Find the error on the screen, correct it with the right pinky on Backspace, and carry on calmly.",
  "Rhythm matters more than raw speed. Try to press each key at an even pace, like the steady beat of a song, instead of rushing the easy words.",
  "Good posture keeps you typing longer. Sit with your feet flat, your wrists floating just above the keys, and your shoulders relaxed and low.",
  "A clear message has one idea per sentence. Write it, read it, then remove every word that does not help the reader understand what you need.",
  "The internet rewards people who can write. A short, well typed proposal can win a contract before a competitor has finished their first draft.",
  "Every expert was once a beginner who pressed the wrong key. The only difference is that the expert kept practising after the tenth mistake.",
  "Cloud tools let a whole team edit the same document at once. Fast, accurate typing means your ideas reach the page while the meeting is still on.",
  "Customer support agents often handle several chats at the same time. Typing without looking lets them read the next question while they answer.",
  "Your hands remember patterns. Common pairs like th, er, in and an will soon flow as single movements rather than two separate key presses.",
  "Take a short break every half hour. Stretch your fingers, roll your wrists and look at something far away to rest your eyes from the screen.",
  "Numbers deserve the same care as words. An invoice with one wrong digit can cost far more than the minute it takes to check it twice.",
  "Learning to type is like learning to ride a bicycle. It feels slow and clumsy at first, and then one day you realise you are not thinking about it.",
  "A strong password mixes upper and lower case letters, numbers and symbols. Typing it confidently is easier when you know where every symbol is.",
  "Interview tasks are increasingly done on a laptop. Being able to type your answer quickly leaves more time for thinking about what to say.",
  "The quick brown fox jumps over the lazy dog, and the five boxing wizards jump quickly. Both sentences use every letter of the alphabet.",
  "Spreadsheets turn raw numbers into decisions. Enter the data cleanly once, and every chart and formula built on top of it will be right.",
];

/* ── Code snippets (original, idiomatic) ─────────────────────────────────── */

export const CODE_SNIPPETS = {
  javascript: [
    "const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);",
    "function greet(name = \"friend\") {\n  return `Hello, ${name}!`;\n}",
    "const res = await fetch(\"/api/users?page=2\");\nconst { data } = await res.json();",
    "if (user && user.isActive) {\n  console.log(\"Welcome back:\", user.name);\n} else {\n  redirect(\"/login\");\n}",
    "const evens = [1, 2, 3, 4, 5, 6].filter((n) => n % 2 === 0);",
    "button.addEventListener(\"click\", (e) => {\n  e.preventDefault();\n  setCount((c) => c + 1);\n});",
  ],
  python: [
    "def average(values):\n    return sum(values) / len(values) if values else 0",
    "for i, name in enumerate(names, start=1):\n    print(f\"{i}. {name.title()}\")",
    "squares = {n: n ** 2 for n in range(10) if n % 2 == 0}",
    "with open(\"sales.csv\") as f:\n    rows = [line.strip().split(\",\") for line in f]",
    "class Account:\n    def __init__(self, owner, balance=0.0):\n        self.owner = owner\n        self.balance = balance",
  ],
  html: [
    "<a href=\"https://example.com/docs\" target=\"_blank\" rel=\"noopener\">Read the docs</a>",
    "<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\" required />",
    "<ul class=\"menu\">\n  <li><a href=\"#home\">Home</a></li>\n  <li><a href=\"#about\">About</a></li>\n</ul>",
  ],
  css: [
    ".card {\n  display: grid;\n  gap: 1rem;\n  padding: 16px 24px;\n  border-radius: 12px;\n}",
    "@media (max-width: 600px) {\n  .nav { flex-direction: column; }\n}",
    "button:hover:not([disabled]) {\n  background: #3b52f0;\n  transform: translateY(-1px);\n}",
  ],
  sql: [
    "SELECT name, SUM(amount) AS total\nFROM orders\nWHERE status = 'paid'\nGROUP BY name\nORDER BY total DESC;",
    "UPDATE users SET last_login = NOW() WHERE id = 42;",
    "SELECT c.name, COUNT(o.id)\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name;",
  ],
  cpp: [
    "#include <iostream>\nint main() {\n  std::cout << \"Hello, world!\" << std::endl;\n  return 0;\n}",
    "for (int i = 0; i < n; ++i) {\n  if (a[i] > max) max = a[i];\n}",
    "std::vector<int> v = {3, 1, 4, 1, 5};\nstd::sort(v.begin(), v.end());",
  ],
  shell: [
    "git add -A && git commit -m \"fix: header layout\" && git push origin main",
    "mkdir -p ~/projects/app && cd ~/projects/app && npm init -y",
    "grep -rn \"TODO\" ./src | wc -l",
  ],
};

export const CODE_LANGS = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "sql", label: "SQL" },
  { id: "cpp", label: "C++" },
  { id: "shell", label: "Terminal" },
];

/* ── Data entry: the text office work is actually made of ────────────────── */

const FIRST = ["ada", "chidi", "kofi", "amara", "tunde", "zainab", "musa", "ngozi", "kwame", "fatima", "emeka", "aisha", "daniel", "grace"];
const LAST = ["okafor", "mensah", "bello", "adeyemi", "otieno", "nwankwo", "diallo", "banda", "asante", "obi"];
const DOMAINS = ["gmail.com", "outlook.com", "memora.ng", "company.co", "school.edu.ng", "mail.africa"];
const PRODUCTS = ["Laptop bag", "USB-C cable", "Desk lamp", "Notebook (A5)", "Wireless mouse", "Printer ink", "Office chair"];

const pad = (n, w = 2) => String(n).padStart(w, "0");
const int = (rand, a, b) => a + Math.floor(rand() * (b - a + 1));

export function dataEntryLine(rand) {
  const first = pick(rand, FIRST);
  const last = pick(rand, LAST);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const kinds = [
    () => `${first}.${last}@${pick(rand, DOMAINS)}`,
    () => `${cap(first)} ${cap(last)}, +234 ${int(rand, 701, 909)} ${int(rand, 100, 999)} ${pad(int(rand, 0, 9999), 4)}`,
    () => `INV-${int(rand, 1000, 9999)} | ${pick(rand, PRODUCTS)} x${int(rand, 1, 12)} @ $${int(rand, 2, 499)}.${pad(int(rand, 0, 99))}`,
    () => `${int(rand, 2024, 2027)}-${pad(int(rand, 1, 12))}-${pad(int(rand, 1, 28))} ${pad(int(rand, 8, 18))}:${pad(int(rand, 0, 59))}`,
    () => `https://www.${last}${pick(rand, ["shop", "labs", "media", "tech"])}.com/${pick(rand, ["about", "careers", "blog", "pricing"])}?ref=${first}`,
    () => `Q${int(rand, 1, 4)} revenue: ${int(rand, 2, 98)}.${int(rand, 0, 9)}% (+${int(rand, 1, 30)}%) vs. target #${int(rand, 1, 9)}`,
    () => `${int(rand, 1, 99)} ${cap(pick(rand, LAST))} Street, Apt. ${int(rand, 1, 40)}B; ${pick(rand, ["Lagos", "Abuja", "Accra", "Nairobi", "Kigali"])} ${int(rand, 10000, 99999)}`,
    () => `Password: ${cap(first)}${pick(rand, ["!", "@", "#", "$", "&", "*"])}${int(rand, 10, 99)}${pick(rand, ["_", "-", "+", "="])}${last.slice(0, 3)}`,
  ];
  return pick(rand, kinds)();
}

/* ── Generators ──────────────────────────────────────────────────────────── */

/** Repetition patterns for brand-new keys: "fff jjj fjf jfj". */
function keyPatterns(rand, keys, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const len = int(rand, 2, 4);
    let w = "";
    for (let j = 0; j < len; j++) w += pick(rand, keys);
    out.push(w);
  }
  return out;
}

/**
 * A drill built from a key set, with the NEW keys over-represented.
 * Uses real words wherever the key set allows, and repetition patterns
 * otherwise.
 */
export function keyDrill(rand, { newKeys, allowed, length = 140 }) {
  const letters = newKeys.filter((k) => /[a-z;,./']/.test(k));
  const words = wordsFrom(allowed);
  const focus = words.filter((w) => newKeys.some((k) => w.includes(k)));
  const parts = [];
  let size = 0;
  // Warm-up: patterns of the new keys alone, then mixed with known keys.
  for (const p of keyPatterns(rand, letters.length ? letters : newKeys, 6)) {
    parts.push(p);
    size += p.length + 1;
  }
  const knownLetters = allowed.filter((c) => /[a-z]/.test(c));
  while (size < length) {
    const r = rand();
    let w;
    if (focus.length && r < 0.55) w = pick(rand, focus);
    else if (words.length > 6 && r < 0.85) w = pick(rand, words);
    else w = keyPatterns(rand, [...(letters.length ? letters : newKeys), ...knownLetters.slice(0, 6)], 1)[0];
    parts.push(w);
    size += w.length + 1;
  }
  return parts.join(" ");
}

/** Plain lower-case words, for speed tests and the word games. */
export function wordStream(rand, count = 60, list = COMMON_WORDS.slice(0, 260)) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(pick(rand, list));
  return out.join(" ");
}

/** Capitalise the first word of sentences and add punctuation. */
export function punctuatedStream(rand, count = 50) {
  const words = wordStream(rand, count).split(" ");
  const out = [];
  let cap = true;
  for (let i = 0; i < words.length; i++) {
    let w = words[i];
    if (cap) w = w[0].toUpperCase() + w.slice(1);
    cap = false;
    const r = rand();
    if (i === words.length - 1) w += ".";
    else if (r < 0.08) { w += "."; cap = true; }
    else if (r < 0.14) w += ",";
    else if (r < 0.16) { w += "?"; cap = true; }
    else if (r < 0.18) { w += "!"; cap = true; }
    else if (r < 0.2) w += ";";
    else if (r < 0.22) w = `"${w}"`;
    else if (r < 0.24) w = `(${w})`;
    else if (r < 0.26) w = `${w}'s`;
    out.push(w);
  }
  return out.join(" ");
}

export function numberStream(rand, count = 30) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    if (r < 0.4) out.push(String(int(rand, 0, 999)));
    else if (r < 0.6) out.push(`${int(rand, 1, 99)}.${pad(int(rand, 0, 99))}`);
    else if (r < 0.75) out.push(`${int(rand, 1, 100)}%`);
    else if (r < 0.9) out.push(`$${int(rand, 1, 9999)}`);
    else out.push(`${int(rand, 1, 12)}/${int(rand, 1, 28)}/${int(rand, 2024, 2027)}`);
  }
  return out.join(" ");
}

const PAIRS = { "(": ")", "[": "]", "{": "}", "<": ">", '"': '"', "'": "'", "`": "`" };
const OPENER_OF = { ")": "(", "]": "[", "}": "{", ">": "<" };
const SHORT = COMMON_WORDS.filter((w) => w.length >= 2 && w.length <= 5);

/**
 * Symbol practice in the shapes symbols actually take: brackets closed,
 * quotes paired, operators between operands — plus short bare repetitions
 * to drill the reach itself.
 */
export function symbolDrill(rand, symbols, length = 140) {
  const parts = [];
  let size = 0;
  while (size < length) {
    const r = rand();
    const s = pick(rand, symbols);
    let w;
    if (r < 0.3) w = keyPatterns(rand, symbols, 1)[0];
    else if (r < 0.6) {
      // A closing bracket is practised closing something.
      const open = OPENER_OF[s] || s;
      w = `${open}${pick(rand, SHORT)}${PAIRS[open] || open}`;
    }
    else if (r < 0.8) w = `${pick(rand, SHORT)}${s}${pick(rand, SHORT)}`;
    else w = `${pick(rand, SHORT)}${s}${int(rand, 1, 99)}`;
    parts.push(w);
    size += w.length + 1;
  }
  return parts.join(" ");
}

/** Digits in groups and in context: "4512", "34 days". */
export function digitDrill(rand, digits, length = 130) {
  const parts = [];
  let size = 0;
  while (size < length) {
    const n = keyPatterns(rand, digits, 1)[0];
    const w = rand() < 0.5 ? n : `${n} ${pick(rand, SHORT)}`;
    parts.push(w);
    size += w.length + 1;
  }
  return parts.join(" ");
}

const CONTRACTIONS = ["don't", "it's", "isn't", "we're", "you'll", "I'd", "she's", "they've", "can't", "won't", "I'm", "let's", "that's", "o'clock"];
const DASHED = ["well-known", "follow-up", "e-mail", "long-term", "up-to-date", "self-made", "snake_case", "user_id", "first_name", "x-ray"];

/** Punctuation in real use: contractions, quoted words, asides, questions. */
export function punctDrill(rand, kind, length = 150) {
  const parts = [];
  let size = 0;
  const word = () => pick(rand, SHORT);
  const cap = (w) => w[0].toUpperCase() + w.slice(1);
  while (size < length) {
    let w;
    if (kind === "quotes") {
      const r = rand();
      if (r < 0.45) w = pick(rand, CONTRACTIONS);
      else if (r < 0.75) w = `"${word()}"`;
      else if (r < 0.9) w = `'${word()}'`;
      else w = `${cap(word())}'s`;
    } else if (kind === "stops") {
      const r = rand();
      if (r < 0.25) w = `${cap(word())}:`;
      else if (r < 0.5) w = `${word()}?`;
      else if (r < 0.7) w = `${cap(word())}!`;
      else if (r < 0.85) w = `${word()};`;
      else w = word();
    } else {
      const r = rand();
      if (r < 0.35) w = pick(rand, DASHED);
      else if (r < 0.6) w = `(${word()} ${word()})`;
      else if (r < 0.75) w = `${word()} - ${word()}`;
      else w = word();
    }
    parts.push(w);
    size += w.length + 1;
  }
  return parts.join(" ");
}

export function passage(rand, count = 1) {
  return shuffle(rand, PASSAGES).slice(0, count).join(" ");
}

export function codeSnippet(rand, lang) {
  const pool = lang ? CODE_SNIPPETS[lang] : Object.values(CODE_SNIPPETS).flat();
  return pick(rand, pool);
}

/** `count` different snippets from one language, joined by a newline. */
export function codeSnippets(rand, lang, count = 2) {
  return shuffle(rand, CODE_SNIPPETS[lang]).slice(0, count).join("\n");
}

/**
 * Adaptive weak-key practice: words rich in the keys the learner misses
 * most, interleaved with patterns of those keys.
 */
export function weakKeyDrill(rand, weakChars, length = 180) {
  const keys = weakChars.filter((c) => c !== " " && c !== "\n");
  if (!keys.length) return wordStream(rand, 35);
  const letters = keys.filter((c) => /[a-z]/.test(c));
  const others = keys.filter((c) => !/[a-z]/.test(c));
  const rich = ALL_WORDS.filter((w) => letters.some((k) => w.includes(k)));
  const parts = [];
  let size = 0;
  while (size < length) {
    const r = rand();
    let w;
    if (rich.length && r < 0.6) w = pick(rand, rich);
    else w = keyPatterns(rand, keys, 1)[0];
    if (others.length && rand() < 0.3) w = `${w}${pick(rand, others)}`;
    parts.push(w);
    size += w.length + 1;
  }
  return parts.join(" ");
}

/** Short word list for the arcade game, sorted into difficulty bands. */
export function gameWords(kind) {
  switch (kind) {
    case "home":
      return wordsFrom([..."asdfghjkl"]).filter((w) => w.length >= 2);
    case "letters":
      return COMMON_WORDS.filter((w) => w.length >= 2 && w.length <= 6);
    case "capitals":
      return COMMON_WORDS.filter((w) => w.length >= 3 && w.length <= 7).map((w, i) =>
        i % 3 === 0 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1) + (i % 4 === 0 ? "." : i % 5 === 0 ? "," : "")
      );
    case "symbols":
      return [
        "@home", "#tag", "$500", "50%", "a&b", "x*y", "(ok)", "[0]", "{id}", "a_b", "x+y", "a=b", "<br>", "1/2", "a|b", "~/", "key:val",
        "\"hi\"", "it's", "wow!", "why?", "a;b", "a-z", "^2", "#1", "$9.99", "100%", "@me", "&amp;", "(x)", "[]", "{}", "->", "=>", "!=",
        "==", "<=", ">=", "&&", "||", "++", "--", "**", "//", "/*", "*/", "::", "\\n", "`ls`",
      ];
    case "code":
      return [
        "let", "const", "=>", "map()", "filter()", "if (x)", "return;", "import", "export", "async", "await", "fetch()", "def", "self",
        "print()", "len(x)", "True", "None", "class", "for i", "<div>", "</p>", "SELECT", "FROM", "WHERE", "JOIN", "std::", "cout",
        "#include", "int main()", "i++", "x == y", "a != b", "{}", "[]", "obj.key", "arr[0]", "git push", "npm i", "cd ..", "ls -la",
      ];
    default:
      return COMMON_WORDS;
  }
}

export const BOSS_PHRASES = {
  home: ["a sad lad asks dad", "all fall flags flash", "glad gals had salad"],
  letters: ["practice makes progress", "keep your eyes on the screen", "every key has a home"],
  capitals: ["The Quick Brown Fox.", "Lagos, Accra, Nairobi.", "Keep Calm, Type On!"],
  symbols: ["user@mail.com #42", "(a + b) * c = $99", "{ key: [1, 2, 3] }"],
  code: ["const x = arr.map((n) => n * 2);", "if (a && b) { return true; }", "print(f\"{name}: {score}\")"],
};
