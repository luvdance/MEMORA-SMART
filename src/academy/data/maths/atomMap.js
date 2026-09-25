import L0 from "./levels/l0.js";
import L1 from "./levels/l1.js";
import L2 from "./levels/l2.js";
import L3 from "./levels/l3.js";
import L4 from "./levels/l4.js";
import L5 from "./levels/l5.js";
import L6 from "./levels/l6.js";

/**
 * THE MATHS SKILL MAP
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CLIENT-SAFE. Skill names and prerequisites only. Not one answer lives in
 * this file or in any file it imports. The drill questions and their answers
 * are generated server-side in lib/academy/maths/ and never reach the bundle.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── THIS IS NOT THE CURRICULUM ───────────────────────────────────────────
 * The curriculum is mathematicsCourse.js: months, modules, lessons, atoms,
 * exactly like Data Analysis and Cybersecurity. Read that to know what the
 * course teaches and in what order.
 *
 * THIS file is the index of the DRILL BANK. Every generated practice question
 * belongs to a skill, every skill has a code, and the codes are what a lesson
 * points at when it embeds a drill:
 *
 *     { id: "a-ma-add-unlike", title: "Adding unlike fractions",
 *       explain: "…",
 *       drill: { skill: "L1-N3.1", count: 3 } }
 *
 * The codes are internal. A learner never sees one.
 *
 * ── WHY IT CARRIES PREREQUISITES ─────────────────────────────────────────
 * Because of what happens when a drill is failed repeatedly. A student who
 * keeps missing "adding algebraic fractions" has usually not failed algebra;
 * they failed LCM, two years earlier. With a prerequisite edge recorded here,
 * the drill can say "this one keeps coming back to lowest common multiple"
 * instead of "wrong, try again". Without it, it cannot.
 *
 * ── THE CODES ────────────────────────────────────────────────────────────
 *   L0–L6    roughly pre-JSS1 to SS3, the rough school level of the skill
 *   N A G T S C   number, algebra, geometry, trigonometry, statistics, calculus
 *   L2-N3.2  the second skill in the third number group at level 2
 *
 * These levels are a property of the SKILL, not of the course timetable. A
 * Month 6 lesson on algebraic fractions legitimately drills an L1 skill,
 * because that is what algebraic fractions are made of.
 *
 * ── HOW PREREQUISITES ARE DECLARED ───────────────────────────────────────
 * Writing every edge by hand for ~300 skills produces a file nobody
 * proof-reads and a graph with silent holes in it. Two rules generate most:
 *
 *   1. CHAIN. Inside a group, skill n requires skill n-1. Groups are written
 *      in teaching order, so this is true by construction. A group that is
 *      genuinely a bag of independent skills sets `chain: false`.
 *   2. GROUP NEEDS. `needs` on a group applies to its FIRST skill, and the
 *      chain carries it to the rest.
 *
 * A skill may add its own `needs` for a cross-strand dependency the chain
 * cannot express. `buildGraph()` expands all three into the real edge list and
 * `validateMap()` proves the result is acyclic and that every edge points at a
 * skill that exists. `npm run test:maths` fails the build if it does not.
 */

/* ── Strands ─────────────────────────────────────────────────────────── */

export const STRANDS = {
  N: { id: "N", title: "Number", accent: "#1d4ed8", icon: "fas fa-hashtag" },
  A: { id: "A", title: "Algebra", accent: "#7c3aed", icon: "fas fa-superscript" },
  G: {
    id: "G",
    title: "Geometry & Mensuration",
    accent: "#0f766e",
    icon: "fas fa-draw-polygon",
  },
  T: { id: "T", title: "Trigonometry", accent: "#c2410c", icon: "fas fa-wave-square" },
  S: {
    id: "S",
    title: "Statistics & Probability",
    accent: "#a16207",
    icon: "fas fa-chart-column",
  },
  C: { id: "C", title: "Calculus & Matrices", accent: "#be123c", icon: "fas fa-infinity" },
};

/* ── Levels ──────────────────────────────────────────────────────────── */

export const LEVELS = [
  {
    id: "L0",
    order: 0,
    title: "Foundations Bridge",
    school: "Pre-JSS1",
    summary:
      "Number sense repair. Most secondary students who say they hate maths are missing primary-level fluency, and every level above this one assumes it.",
  },
  {
    id: "L1",
    order: 1,
    title: "Number Confidence and First Algebra",
    school: "JSS1",
    summary:
      "Arithmetic becomes reasoning. Fractions, factors and percentages turn into tools, and letters start standing for numbers.",
  },
  {
    id: "L2",
    order: 2,
    title: "Money, Graphs and Geometry Rules",
    school: "JSS2",
    summary:
      "The maths of everyday money, the Cartesian plane, and the angle rules every later geometry topic is built on.",
  },
  {
    id: "L3",
    order: 3,
    title: "Algebra Power and BECE Readiness",
    school: "JSS3",
    summary:
      "Factorising and simultaneous equations — the two algebra skills almost every senior topic depends on — taken to fluency.",
  },
  {
    id: "L4",
    order: 4,
    title: "The Senior Number System and Quadratics",
    school: "SS1",
    summary:
      "The heaviest-weighted exam strand, almost completely: bases, logarithms, surds, sets, and the quadratic.",
  },
  {
    id: "L5",
    order: 5,
    title: "Circles, Trigonometry and Data",
    school: "SS2",
    summary:
      "Most of Paper 2 Section B: circle theorems, the sine and cosine rules, bearings, cumulative frequency and probability.",
  },
  {
    id: "L6",
    order: 6,
    title: "Final Topics and Exam Mastery",
    school: "SS3",
    summary:
      "Finish the syllabus, then train for the paper itself: translation drills, speed drills, technique, and full timed mocks.",
  },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]));

/* ── The modules, in teaching order ──────────────────────────────────── */

export const MODULES = [...L0, ...L1, ...L2, ...L3, ...L4, ...L5, ...L6];

/**
 * ═══════════════════════════════════════════════════════════════════════
 * THE GRAPH
 *
 * Expands the three prerequisite rules into a flat atom table with a real
 * edge list. Built once at module load; the result is frozen, because half
 * the platform holds references into it.
 * ═══════════════════════════════════════════════════════════════════════
 */
function buildGraph() {
  /** code → atom */
  const atoms = new Map();
  /** module code → module, with its atom codes attached */
  const modules = new Map();

  for (const module of MODULES) {
    const chain = module.chain !== false;
    const codes = [];

    module.atoms.forEach((atom, i) => {
      const code = `${module.code}.${i + 1}`;
      const previous = i > 0 ? `${module.code}.${i}` : null;

      // Rule 1 (chain) and rule 2 (module needs) are mutually exclusive by
      // position: the first atom inherits the module's needs, the rest
      // inherit their predecessor. A non-chained module gives every atom the
      // module's needs instead, because none of them depends on the others.
      const inherited = chain
        ? previous
          ? [previous]
          : module.needs || []
        : module.needs || [];

      const prereqs = [...new Set([...inherited, ...(atom.needs || [])])];

      atoms.set(code, {
        code,
        moduleCode: module.code,
        moduleTitle: module.title,
        level: module.level,
        strand: module.strand,
        index: i + 1,
        title: atom.title,
        iCan: atom.iCan,
        exams: atom.exams || [],
        drill: Boolean(atom.drill),
        examMastery: Boolean(module.examMastery),
        // Time on task for one pass through Anchor, Trace and Operate. Atoms
        // are deliberately sized to fit one sitting; anything that will not
        // fit is two atoms, not one long one.
        minutes: atom.minutes || (module.examMastery ? 40 : 30),
        prereqs,
      });
      codes.push(code);
    });

    modules.set(module.code, { ...module, atomCodes: codes });
  }

  // Reverse edges. "What does this unlock?" is asked on every atom screen and
  // computing it by scanning 300 atoms each time is silly.
  const dependents = new Map();
  for (const [code] of atoms) dependents.set(code, []);
  for (const [code, atom] of atoms) {
    for (const need of atom.prereqs) {
      if (dependents.has(need)) dependents.get(need).push(code);
    }
  }

  return { atoms, modules, dependents };
}

const GRAPH = buildGraph();

/** Every atom, in teaching order. */
export const ATOM_LIST = Object.freeze([...GRAPH.atoms.values()]);

/** code → atom. The lookup used everywhere. */
export const ATOMS = GRAPH.atoms;

export function getAtom(code) {
  return GRAPH.atoms.get(code) || null;
}

export function getModule(code) {
  return GRAPH.modules.get(code) || null;
}

export function getModules(levelId) {
  return MODULES.filter((m) => m.level === levelId);
}

export function getLevelAtoms(levelId) {
  return ATOM_LIST.filter((atom) => atom.level === levelId);
}

export function getModuleAtoms(moduleCode) {
  return ATOM_LIST.filter((atom) => atom.moduleCode === moduleCode);
}

/** What this atom directly unlocks. */
export function getDependents(code) {
  return GRAPH.dependents.get(code) || [];
}

/**
 * Every atom this one transitively rests on, nearest first.
 *
 * This is the list the remediation loop walks when a student keeps failing an
 * atom: the cause is nearly always the nearest unmastered ancestor, not the
 * atom itself.
 */
export function getAncestors(code) {
  const out = [];
  const seen = new Set([code]);
  let frontier = getAtom(code)?.prereqs || [];

  while (frontier.length) {
    const next = [];
    for (const parent of frontier) {
      if (seen.has(parent)) continue;
      seen.add(parent);
      out.push(parent);
      next.push(...(getAtom(parent)?.prereqs || []));
    }
    frontier = next;
  }
  return out;
}

/** Atoms with no prerequisites at all. Where a brand-new student can begin. */
export function getRootAtoms() {
  return ATOM_LIST.filter((atom) => atom.prereqs.length === 0);
}

/** Atoms an exam does not test, so a student writing only that exam can skip them. */
export function isForExam(atom, exam) {
  if (!exam) return true;
  // Untagged atoms are junior groundwork. They are never "skippable", because
  // the atoms that ARE examined depend on them.
  if (!atom.exams.length) return true;
  return atom.exams.includes(exam);
}

/* ── Counts, derived rather than claimed ─────────────────────────────── */

export function getMapStats() {
  const byLevel = {};
  for (const level of LEVELS) {
    const atoms = getLevelAtoms(level.id);
    byLevel[level.id] = {
      atoms: atoms.length,
      modules: getModules(level.id).length,
      minutes: atoms.reduce((n, atom) => n + atom.minutes, 0),
    };
  }
  return {
    levels: LEVELS.length,
    modules: MODULES.length,
    atoms: ATOM_LIST.length,
    strands: Object.keys(STRANDS).length,
    byLevel,
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * VALIDATION
 *
 * Run by `npm run test:maths`. Four ways this map can be wrong, all of them
 * silent at runtime and all of them fatal to the point of the course:
 *
 *   duplicate    two atoms sharing a code — one overwrites the other
 *   dangling     a prerequisite pointing at an atom that does not exist,
 *                so the gate never opens and the student is stuck forever
 *   cycle        A needs B needs A — nothing in the loop is ever reachable
 *   forward      an atom depending on one taught LATER, which is a curriculum
 *                ordering bug even though the graph stays acyclic
 * ═══════════════════════════════════════════════════════════════════════
 */
export function validateMap() {
  const problems = [];
  const position = new Map(ATOM_LIST.map((atom, i) => [atom.code, i]));

  const seen = new Set();
  for (const atom of ATOM_LIST) {
    if (seen.has(atom.code)) problems.push(`duplicate atom code ${atom.code}`);
    seen.add(atom.code);
  }

  for (const atom of ATOM_LIST) {
    for (const need of atom.prereqs) {
      if (!GRAPH.atoms.has(need)) {
        problems.push(`${atom.code} needs ${need}, which does not exist`);
        continue;
      }
      if (position.get(need) > position.get(atom.code)) {
        problems.push(
          `${atom.code} needs ${need}, which is taught later in the map`
        );
      }
    }
  }

  // Cycle detection by colouring depth-first. Iterative, because a deep chain
  // of 300 atoms is enough to make a recursive walk uncomfortable.
  const WHITE = 0;
  const GREY = 1;
  const BLACK = 2;
  const colour = new Map([...GRAPH.atoms.keys()].map((c) => [c, WHITE]));

  for (const start of GRAPH.atoms.keys()) {
    if (colour.get(start) !== WHITE) continue;
    const stack = [[start, 0]];
    colour.set(start, GREY);

    while (stack.length) {
      const frame = stack[stack.length - 1];
      const [code, i] = frame;
      const needs = getAtom(code).prereqs;

      if (i >= needs.length) {
        colour.set(code, BLACK);
        stack.pop();
        continue;
      }
      frame[1] += 1;
      const need = needs[i];
      if (!GRAPH.atoms.has(need)) continue;
      if (colour.get(need) === GREY) {
        problems.push(`prerequisite cycle involving ${code} and ${need}`);
        continue;
      }
      if (colour.get(need) === WHITE) {
        colour.set(need, GREY);
        stack.push([need, 0]);
      }
    }
  }

  return { ok: problems.length === 0, problems };
}
