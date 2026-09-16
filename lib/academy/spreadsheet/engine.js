/**
 * A SMALL SPREADSHEET FORMULA ENGINE
 *
 * Parses and evaluates real Excel-style formulas so a learner can type
 * =SUM(B2:B6) into a grid and see the answer, exactly as they would in Excel.
 *
 * ── WHY NOT eval() ───────────────────────────────────────────────────────
 * The obvious shortcut is to rewrite the formula into JavaScript and call
 * eval(). That would execute arbitrary code typed by a user, in their own
 * browser session, with access to everything on the page. It is a textbook
 * injection hole. This is a hand-written recursive-descent parser instead: it
 * only ever produces numbers, strings and booleans, and an unknown token is an
 * error rather than an instruction.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Supported, matching what the curriculum teaches in Module 3:
 *   arithmetic        + - * / ^ %  with correct precedence and parentheses
 *   comparison        = <> < <= > >=
 *   text join         &
 *   references        A1, $A$1, and ranges A1:B10
 *   functions         SUM AVERAGE MIN MAX COUNT COUNTA COUNTIF SUMIF IF
 *                     ROUND ROUNDUP ROUNDDOWN ABS SQRT LEN UPPER LOWER TRIM
 *                     CONCAT CONCATENATE TODAY NOT AND OR
 *
 * Errors mirror Excel: #DIV/0!, #NAME?, #VALUE!, #REF!
 */

export class FormulaError extends Error {
  constructor(code, detail) {
    super(detail || code);
    this.code = code; // "#DIV/0!" etc
    this.isFormulaError = true;
  }
}

/* ── Cell addressing ────────────────────────────────────────────────── */

/** "B12" -> { col: 1, row: 11 } (both zero-based). Null if not an address. */
export function parseRef(ref) {
  const m = /^\$?([A-Z]+)\$?(\d+)$/i.exec(ref.trim());
  if (!m) return null;

  let col = 0;
  for (const ch of m[1].toUpperCase()) col = col * 26 + (ch.charCodeAt(0) - 64);

  return { col: col - 1, row: Number(m[2]) - 1 };
}

/** { col: 1, row: 11 } -> "B12" */
export function toRef({ col, row }) {
  let letters = "";
  let n = col + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return `${letters}${row + 1}`;
}

/** Every address in "A1:B3", reading left to right, top to bottom. */
export function expandRange(from, to) {
  const a = parseRef(from);
  const b = parseRef(to);
  if (!a || !b) throw new FormulaError("#REF!", `Bad range ${from}:${to}`);

  const cells = [];
  for (let row = Math.min(a.row, b.row); row <= Math.max(a.row, b.row); row += 1) {
    for (let col = Math.min(a.col, b.col); col <= Math.max(a.col, b.col); col += 1) {
      cells.push(toRef({ col, row }));
    }
  }
  return cells;
}

/* ── Tokenizer ──────────────────────────────────────────────────────── */

const TOKEN = [
  ["ws", /^\s+/],
  ["number", /^\d+(\.\d+)?/],
  ["string", /^"([^"]*)"/],
  ["range", /^\$?[A-Z]+\$?\d+\s*:\s*\$?[A-Z]+\$?\d+/i],
  ["ref", /^\$?[A-Z]+\$?\d+(?![\w(])/i],
  ["func", /^[A-Z][A-Z0-9_.]*(?=\s*\()/i],
  ["op", /^(<=|>=|<>|[+\-*/^&<>=%])/],
  ["lparen", /^\(/],
  ["rparen", /^\)/],
  ["comma", /^[,;]/],
];

function tokenize(input) {
  const tokens = [];
  let rest = input;

  while (rest.length) {
    let matched = false;
    for (const [type, re] of TOKEN) {
      const m = re.exec(rest);
      if (!m) continue;
      if (type !== "ws") {
        tokens.push({ type, value: type === "string" ? m[1] : m[0].replace(/\s+/g, "") });
      }
      rest = rest.slice(m[0].length);
      matched = true;
      break;
    }
    if (!matched) {
      throw new FormulaError("#NAME?", `Cannot read "${rest[0]}"`);
    }
  }
  return tokens;
}

/* ── Values ─────────────────────────────────────────────────────────── */

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;

  // Excel accepts a numeric string; anything else is #VALUE!
  const trimmed = String(value).trim().replace(/,/g, "");
  if (trimmed === "") return 0;
  const n = Number(trimmed);
  if (Number.isNaN(n)) throw new FormulaError("#VALUE!", `"${value}" is not a number`);
  return n;
}

/** Numbers only, the way SUM and AVERAGE ignore text cells. */
function numericOnly(values) {
  return values.filter((v) => {
    if (typeof v === "number") return true;
    if (v === null || v === undefined || v === "") return false;
    return !Number.isNaN(Number(String(v).trim().replace(/,/g, "")));
  }).map(toNumber);
}

/* ── Functions ──────────────────────────────────────────────────────── */

function matchesCriterion(value, criterion) {
  const raw = String(criterion).trim();
  const cmp = /^(<=|>=|<>|<|>|=)?\s*(.*)$/.exec(raw);
  const operator = cmp[1] || "=";
  const target = cmp[2];

  const asNumber = Number(target);
  const numeric = !Number.isNaN(asNumber) && target !== "";

  if (numeric) {
    const v = Number(value);
    if (Number.isNaN(v)) return false;
    switch (operator) {
      case "=": return v === asNumber;
      case "<>": return v !== asNumber;
      case "<": return v < asNumber;
      case "<=": return v <= asNumber;
      case ">": return v > asNumber;
      case ">=": return v >= asNumber;
      default: return false;
    }
  }

  const a = String(value ?? "").toLowerCase();
  const b = target.toLowerCase();
  return operator === "<>" ? a !== b : a === b;
}

/**
 * Shared by RANK.EQ and RANK.AVG.
 * order 0 or omitted ranks largest first; any other value ranks smallest first.
 */
function rank(args, mode) {
  const value = toNumber(args[0]);
  const pool = numericOnly(Array.isArray(args[1]) ? args[1] : [args[1]]);
  const descending = !args[2] || toNumber(args[2]) === 0;

  if (!pool.includes(value)) throw new FormulaError("#N/A", "Value is not in the range");

  const better = pool.filter((v) => (descending ? v > value : v < value)).length;
  const ties = pool.filter((v) => v === value).length;

  const top = better + 1;
  return mode === "avg" ? top + (ties - 1) / 2 : top;
}

const FUNCTIONS = {
  SUM: (args) => numericOnly(args.flat()).reduce((a, b) => a + b, 0),
  AVERAGE: (args) => {
    const nums = numericOnly(args.flat());
    if (!nums.length) throw new FormulaError("#DIV/0!", "AVERAGE of no numbers");
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  MIN: (args) => {
    const nums = numericOnly(args.flat());
    return nums.length ? Math.min(...nums) : 0;
  },
  MAX: (args) => {
    const nums = numericOnly(args.flat());
    return nums.length ? Math.max(...nums) : 0;
  },
  // COUNT counts numbers; COUNTA counts anything non-empty. A classic exam point.
  COUNT: (args) => numericOnly(args.flat()).length,
  COUNTA: (args) =>
    args.flat().filter((v) => v !== null && v !== undefined && v !== "").length,
  COUNTBLANK: (args) => {
    // A cell holding "" is empty as far as the sheet is concerned.
    const range = Array.isArray(args[0]) ? args[0] : [args[0]];
    return range.filter((v) => v === null || v === undefined || v === "").length;
  },
  // COUNTIFS takes range/criterion PAIRS and counts rows matching all of them.
  COUNTIFS: (args) => {
    if (args.length < 2 || args.length % 2 !== 0) {
      throw new FormulaError("#VALUE!", "COUNTIFS needs range and criteria in pairs");
    }
    const ranges = [];
    for (let i = 0; i < args.length; i += 2) {
      ranges.push([Array.isArray(args[i]) ? args[i] : [args[i]], args[i + 1]]);
    }
    const length = Math.max(...ranges.map(([r]) => r.length));
    let count = 0;
    for (let row = 0; row < length; row += 1) {
      if (ranges.every(([r, criterion]) => matchesCriterion(r[row], criterion))) {
        count += 1;
      }
    }
    return count;
  },
  // AVERAGEA differs from AVERAGE: text counts as 0 instead of being skipped,
  // so a blank-looking text cell drags the result down. That is the exam point.
  AVERAGEA: (args) => {
    const values = args.flat().filter((v) => v !== null && v !== undefined && v !== "");
    if (!values.length) throw new FormulaError("#DIV/0!", "AVERAGEA of no values");
    const total = values.reduce((sum, v) => {
      if (typeof v === "boolean") return sum + (v ? 1 : 0);
      const n = Number(String(v).trim().replace(/,/g, ""));
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
    return total / values.length;
  },
  AVERAGEIF: (args) => {
    const [range, criterion, averageRange] = args;
    const source = Array.isArray(range) ? range : [range];
    const target = averageRange
      ? (Array.isArray(averageRange) ? averageRange : [averageRange])
      : source;
    const picked = [];
    source.forEach((v, i) => {
      if (matchesCriterion(v, criterion)) picked.push(target[i]);
    });
    const nums = numericOnly(picked);
    if (!nums.length) throw new FormulaError("#DIV/0!", "Nothing matched the criterion");
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  // Note the argument order flips: AVERAGEIFS puts the range to average FIRST,
  // while AVERAGEIF puts it last. Getting this backwards is extremely common.
  AVERAGEIFS: (args) => {
    const [averageRange, ...rest] = args;
    if (rest.length < 2 || rest.length % 2 !== 0) {
      throw new FormulaError("#VALUE!", "AVERAGEIFS needs criteria in pairs");
    }
    const target = Array.isArray(averageRange) ? averageRange : [averageRange];
    const pairs = [];
    for (let i = 0; i < rest.length; i += 2) {
      pairs.push([Array.isArray(rest[i]) ? rest[i] : [rest[i]], rest[i + 1]]);
    }
    const picked = [];
    target.forEach((value, row) => {
      if (pairs.every(([r, criterion]) => matchesCriterion(r[row], criterion))) {
        picked.push(value);
      }
    });
    const nums = numericOnly(picked);
    if (!nums.length) throw new FormulaError("#DIV/0!", "Nothing matched the criteria");
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  // RANK.EQ gives tied values the SAME, highest rank: 1, 2, 2, 4.
  "RANK.EQ": (args) => rank(args, "eq"),
  // RANK.AVG averages the positions tied values would occupy: 1, 2.5, 2.5, 4.
  "RANK.AVG": (args) => rank(args, "avg"),
  RANK: (args) => rank(args, "eq"),
  COUNTIF: (args) => {
    const [range, criterion] = args;
    return (Array.isArray(range) ? range : [range]).filter((v) =>
      matchesCriterion(v, criterion)
    ).length;
  },
  SUMIF: (args) => {
    const [range, criterion, sumRange] = args;
    const source = Array.isArray(range) ? range : [range];
    const target = sumRange ? (Array.isArray(sumRange) ? sumRange : [sumRange]) : source;
    let total = 0;
    source.forEach((v, i) => {
      if (matchesCriterion(v, criterion)) total += toNumber(target[i] ?? 0);
    });
    return total;
  },
  // SUMIFS flips the order like AVERAGEIFS: the range to TOTAL comes first.
  SUMIFS: (args) => {
    if (args.length < 3 || args.length % 2 === 0) {
      throw new FormulaError("#VALUE!", "SUMIFS needs a sum range then criteria pairs");
    }
    const sumRange = Array.isArray(args[0]) ? args[0] : [args[0]];
    const ranges = [];
    for (let i = 1; i < args.length; i += 2) {
      ranges.push([Array.isArray(args[i]) ? args[i] : [args[i]], args[i + 1]]);
    }
    let total = 0;
    for (let row = 0; row < sumRange.length; row += 1) {
      if (ranges.every(([r, criterion]) => matchesCriterion(r[row], criterion))) {
        total += toNumber(sumRange[row] ?? 0);
      }
    }
    return total;
  },

  /* ── Descriptive statistics ───────────────────────────────────────────
   * The middle, the spread and the edges of a distribution. An analyst
   * reaches for these before building anything, which is why the Exploratory
   * Data Analysis module needs them to be real rather than described.
   */
  MEDIAN: (args) => {
    const nums = numericOnly(args.flat()).sort((a, b) => a - b);
    if (!nums.length) throw new FormulaError("#NUM!", "MEDIAN of no numbers");
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  "MODE.SNGL": (args) => {
    const nums = numericOnly(args.flat());
    const counts = new Map();
    for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
    let best = null;
    let bestCount = 1;
    for (const n of nums) {
      const c = counts.get(n);
      if (c > bestCount) { best = n; bestCount = c; }
    }
    if (best === null) throw new FormulaError("#N/A", "No value repeats");
    return best;
  },
  // Sample standard deviation divides by n-1; population divides by n.
  "STDEV.S": (args) => {
    const nums = numericOnly(args.flat());
    if (nums.length < 2) throw new FormulaError("#DIV/0!", "STDEV.S needs at least two numbers");
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (nums.length - 1);
    return Math.sqrt(variance);
  },
  "STDEV.P": (args) => {
    const nums = numericOnly(args.flat());
    if (!nums.length) throw new FormulaError("#DIV/0!", "STDEV.P of no numbers");
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
    return Math.sqrt(variance);
  },
  // LARGE(range,1) is MAX, LARGE(range,2) the runner-up, and so on.
  LARGE: (args) => {
    const nums = numericOnly(args[0] ?? []).sort((a, b) => b - a);
    const k = Math.trunc(toNumber(args[1]));
    if (!nums.length || k < 1 || k > nums.length) {
      throw new FormulaError("#NUM!", "LARGE: k is outside the range");
    }
    return nums[k - 1];
  },
  SMALL: (args) => {
    const nums = numericOnly(args[0] ?? []).sort((a, b) => a - b);
    const k = Math.trunc(toNumber(args[1]));
    if (!nums.length || k < 1 || k > nums.length) {
      throw new FormulaError("#NUM!", "SMALL: k is outside the range");
    }
    return nums[k - 1];
  },
  // Linear interpolation between ranks, which is what Excel's .INC does.
  "PERCENTILE.INC": (args) => {
    const nums = numericOnly(args[0] ?? []).sort((a, b) => a - b);
    const k = toNumber(args[1]);
    if (!nums.length) throw new FormulaError("#NUM!", "PERCENTILE of no numbers");
    if (k < 0 || k > 1) throw new FormulaError("#NUM!", "k must be between 0 and 1");
    const pos = (nums.length - 1) * k;
    const low = Math.floor(pos);
    const high = Math.ceil(pos);
    if (low === high) return nums[low];
    return nums[low] + (pos - low) * (nums[high] - nums[low]);
  },
  "QUARTILE.INC": (args) => {
    const q = Math.trunc(toNumber(args[1]));
    if (q < 0 || q > 4) throw new FormulaError("#NUM!", "quart must be 0 to 4");
    return FUNCTIONS["PERCENTILE.INC"]([args[0], q / 4]);
  },
  SUMPRODUCT: (args) => {
    const ranges = args.map((a) => (Array.isArray(a) ? a : [a]));
    const length = Math.max(...ranges.map((r) => r.length));
    let total = 0;
    for (let i = 0; i < length; i += 1) {
      total += ranges.reduce((acc, r) => acc * toNumber(r[i] ?? 0), 1);
    }
    return total;
  },
  // Legacy names. Excel still accepts them and so do we, so a learner
  // following an older tutorial is not told their correct formula is wrong.
  STDEV: (args) => FUNCTIONS["STDEV.S"](args),
  STDEVP: (args) => FUNCTIONS["STDEV.P"](args),
  MODE: (args) => FUNCTIONS["MODE.SNGL"](args),
  QUARTILE: (args) => FUNCTIONS["QUARTILE.INC"](args),
  PERCENTILE: (args) => FUNCTIONS["PERCENTILE.INC"](args),
  IF: (args) => {
    const [condition, whenTrue, whenFalse] = args;
    const truthy =
      typeof condition === "boolean" ? condition : toNumber(condition) !== 0;
    return truthy ? whenTrue ?? true : whenFalse ?? false;
  },
  NOT: (args) => !(typeof args[0] === "boolean" ? args[0] : toNumber(args[0]) !== 0),
  AND: (args) => args.flat().every((v) => (typeof v === "boolean" ? v : toNumber(v) !== 0)),
  OR: (args) => args.flat().some((v) => (typeof v === "boolean" ? v : toNumber(v) !== 0)),
  ROUND: (args) => {
    const factor = 10 ** toNumber(args[1] ?? 0);
    return Math.round(toNumber(args[0]) * factor) / factor;
  },
  ROUNDUP: (args) => {
    const factor = 10 ** toNumber(args[1] ?? 0);
    return Math.ceil(toNumber(args[0]) * factor) / factor;
  },
  ROUNDDOWN: (args) => {
    const factor = 10 ** toNumber(args[1] ?? 0);
    return Math.floor(toNumber(args[0]) * factor) / factor;
  },
  ABS: (args) => Math.abs(toNumber(args[0])),
  SQRT: (args) => Math.sqrt(toNumber(args[0])),
  LEN: (args) => String(args[0] ?? "").length,
  UPPER: (args) => String(args[0] ?? "").toUpperCase(),
  LOWER: (args) => String(args[0] ?? "").toLowerCase(),
  TRIM: (args) => String(args[0] ?? "").trim().replace(/\s+/g, " "),
  // CLEAN strips non-printable characters, the invisible junk that arrives
  // with data copied from a web page or exported from another system.
  //
  // Matching control characters IS the purpose of CLEAN. They are written
  // as unicode escapes, never as raw bytes: selfTest.mjs asserts this file
  // holds no literal control characters, because an earlier version did
  // and the whole file then read as binary.
  // eslint-disable-next-line no-control-regex
  CLEAN: (args) => String(args[0] ?? "").replace(/[\u0000-\u001F\u007F]/g, ""),
  PROPER: (args) =>
    String(args[0] ?? "")
      .toLowerCase()
      .replace(/(^|[^a-z'])([a-z])/g, (m, before, letter) => before + letter.toUpperCase()),
  SUBSTITUTE: (args) => {
    const [text, find, replace, instance] = args;
    const source = String(text ?? "");
    const needle = String(find ?? "");
    const swap = String(replace ?? "");
    if (needle === "") return source;

    if (instance === undefined) return source.split(needle).join(swap);

    // Replacing only the Nth occurrence, as Excel allows
    const nth = toNumber(instance);
    let count = 0;
    let index = source.indexOf(needle);
    while (index !== -1) {
      count += 1;
      if (count === nth) {
        return source.slice(0, index) + swap + source.slice(index + needle.length);
      }
      index = source.indexOf(needle, index + 1);
    }
    return source;
  },
  // FIND is case SENSITIVE, SEARCH is not. That single difference is the
  // reason one of them mysteriously fails on real data.
  FIND: (args) => {
    const at = String(args[1] ?? "").indexOf(String(args[0] ?? ""), toNumber(args[2] ?? 1) - 1);
    if (at === -1) throw new FormulaError("#VALUE!", "FIND could not locate that text");
    return at + 1;
  },
  SEARCH: (args) => {
    const at = String(args[1] ?? "")
      .toLowerCase()
      .indexOf(String(args[0] ?? "").toLowerCase(), toNumber(args[2] ?? 1) - 1);
    if (at === -1) throw new FormulaError("#VALUE!", "SEARCH could not locate that text");
    return at + 1;
  },
  LEFT: (args) => String(args[0] ?? "").slice(0, toNumber(args[1] ?? 1)),
  RIGHT: (args) => {
    const n = toNumber(args[1] ?? 1);
    return n <= 0 ? "" : String(args[0] ?? "").slice(-n);
  },
  MID: (args) => {
    const start = toNumber(args[1]) - 1;
    return String(args[0] ?? "").substr(start, toNumber(args[2]));
  },
  // IFERROR and IFNA are handled specially in the parser, because they must
  // catch an error raised while evaluating their FIRST argument. By the time a
  // normal function receives its arguments the error has already escaped.
  // These entries exist only so the names are recognised.
  IFERROR: (args) => args[0],
  IFNA: (args) => args[0],
  ISBLANK: (args) => args[0] === "" || args[0] === null || args[0] === undefined,
  ISNUMBER: (args) => typeof args[0] === "number",
  ISTEXT: (args) =>
    typeof args[0] === "string" && args[0] !== "" && !args[0].startsWith("#"),
  EXACT: (args) => String(args[0] ?? "") === String(args[1] ?? ""),
  CONCAT: (args) => args.flat().map((v) => (v ?? "")).join(""),
  CONCATENATE: (args) => args.flat().map((v) => (v ?? "")).join(""),
  TODAY: () => new Date().toISOString().slice(0, 10),
};

/* ── Parser ─────────────────────────────────────────────────────────── */

function createParser(tokens, resolve) {
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const expect = (type) => {
    const token = next();
    if (!token || token.type !== type) {
      throw new FormulaError("#NAME?", `Expected ${type}`);
    }
    return token;
  };

  // comparison  <-  concat  <-  additive  <-  multiplicative  <-  power  <- unary
  function parseExpression() {
    let left = parseConcat();
    while (peek()?.type === "op" && ["=", "<>", "<", "<=", ">", ">="].includes(peek().value)) {
      const op = next().value;
      const right = parseConcat();
      left = compare(op, left, right);
    }
    return left;
  }

  function parseConcat() {
    let left = parseAdditive();
    while (peek()?.type === "op" && peek().value === "&") {
      next();
      const right = parseAdditive();
      left = `${left ?? ""}${right ?? ""}`;
    }
    return left;
  }

  function parseAdditive() {
    let left = parseMultiplicative();
    while (peek()?.type === "op" && ["+", "-"].includes(peek().value)) {
      const op = next().value;
      const right = parseMultiplicative();
      left = op === "+" ? toNumber(left) + toNumber(right) : toNumber(left) - toNumber(right);
    }
    return left;
  }

  function parseMultiplicative() {
    let left = parsePower();
    while (peek()?.type === "op" && ["*", "/"].includes(peek().value)) {
      const op = next().value;
      const right = parsePower();
      if (op === "*") left = toNumber(left) * toNumber(right);
      else {
        const divisor = toNumber(right);
        if (divisor === 0) throw new FormulaError("#DIV/0!", "Division by zero");
        left = toNumber(left) / divisor;
      }
    }
    return left;
  }

  function parsePower() {
    // Excel evaluates equal-precedence operators LEFT to right, so
    // =2^3^2 is (2^3)^2 = 64. JavaScript's ** is right-associative and would
    // give 512. This loop is deliberately left-associative to match Excel.
    let left = parseUnary();
    while (peek()?.type === "op" && peek().value === "^") {
      next();
      left = toNumber(left) ** toNumber(parseUnary());
    }
    // Trailing % means "divide by 100", as in Excel
    while (peek()?.type === "op" && peek().value === "%") {
      next();
      left = toNumber(left) / 100;
    }
    return left;
  }

  function parseUnary() {
    if (peek()?.type === "op" && ["-", "+"].includes(peek().value)) {
      const op = next().value;
      const value = parseUnary();
      return op === "-" ? -toNumber(value) : toNumber(value);
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = next();
    if (!token) throw new FormulaError("#NAME?", "Formula ended unexpectedly");

    switch (token.type) {
      case "number":
        return Number(token.value);
      case "string":
        return token.value;
      case "range": {
        const [from, to] = token.value.split(":");
        return expandRange(from, to).map(resolve);
      }
      case "ref":
        return resolve(token.value.replace(/\$/g, "").toUpperCase());
      case "lparen": {
        const value = parseExpression();
        expect("rparen");
        return value;
      }
      case "func": {
        const name = token.value.toUpperCase();
        expect("lparen");

        // IFERROR(value, fallback): evaluate `value` inside a try so a
        // #DIV/0! or #VALUE! raised by it becomes the fallback rather than
        // propagating. This is the whole purpose of the function.
        if (name === "IFERROR" || name === "IFNA") {
          const startPos = pos;
          let primary;
          let failed = false;
          try {
            primary = parseExpression();
          } catch (err) {
            if (!err.isFormulaError) throw err;
            failed = true;
            // Skip past the failed argument to the comma
            pos = startPos;
            let depth = 0;
            while (pos < tokens.length) {
              const t = tokens[pos];
              if (t.type === "lparen") depth += 1;
              else if (t.type === "rparen") {
                if (depth === 0) break;
                depth -= 1;
              } else if (t.type === "comma" && depth === 0) break;
              pos += 1;
            }
          }

          let fallback = "";
          if (peek()?.type === "comma") {
            next();
            // Excel accepts an omitted fallback, as in =IFERROR(A1/B1,)
            if (peek()?.type !== "rparen") fallback = parseExpression();
          }
          expect("rparen");
          return failed ? fallback : primary;
        }

        const args = [];
        if (peek()?.type !== "rparen") {
          args.push(parseExpression());
          while (peek()?.type === "comma") {
            next();
            args.push(parseExpression());
          }
        }
        expect("rparen");

        const fn = FUNCTIONS[name];
        if (!fn) throw new FormulaError("#NAME?", `${name} is not a function we support yet`);
        return fn(args);
      }
      default:
        throw new FormulaError("#NAME?", `Unexpected "${token.value}"`);
    }
  }

  function compare(op, a, b) {
    const bothNumeric = !Number.isNaN(Number(a)) && !Number.isNaN(Number(b));
    const x = bothNumeric ? Number(a) : String(a ?? "").toLowerCase();
    const y = bothNumeric ? Number(b) : String(b ?? "").toLowerCase();
    switch (op) {
      case "=": return x === y;
      case "<>": return x !== y;
      case "<": return x < y;
      case "<=": return x <= y;
      case ">": return x > y;
      case ">=": return x >= y;
      default: throw new FormulaError("#NAME?", `Unknown operator ${op}`);
    }
  }

  return () => {
    const value = parseExpression();
    if (pos < tokens.length) {
      throw new FormulaError("#NAME?", `Unexpected "${tokens[pos].value}"`);
    }
    return value;
  };
}

/* ── Public API ─────────────────────────────────────────────────────── */

/**
 * Evaluate one formula against a sheet.
 *
 * @param {string} formula   with or without the leading "="
 * @param {object} cells     { A1: 1200, B2: "Rice", C1: "=A1*2" }
 * @returns {{ ok, value, error }}
 */
export function evaluateFormula(formula, cells = {}, depth = 0) {
  const text = String(formula ?? "").trim();
  if (!text) return { ok: true, value: "" };

  const body = text.startsWith("=") ? text.slice(1) : text;

  // A cell that refers to itself, directly or through a chain, would recurse
  // forever. Excel calls this a circular reference; we cap the depth.
  if (depth > 12) {
    return { ok: false, value: null, error: "#REF!", message: "Circular reference" };
  }

  const resolve = (ref) => {
    const raw = cells[ref.toUpperCase()];
    if (raw === undefined || raw === null || raw === "") return "";
    if (typeof raw === "string" && raw.trim().startsWith("=")) {
      const nested = evaluateFormula(raw, cells, depth + 1);
      if (!nested.ok) throw new FormulaError(nested.error, nested.message);
      return nested.value;
    }
    return raw;
  };

  try {
    const parse = createParser(tokenize(body), resolve);
    let value = parse();
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new FormulaError("#DIV/0!", "Result is not a finite number");
    }
    // Trim floating-point noise: 0.1 + 0.2 should read as 0.3
    if (typeof value === "number") value = Math.round(value * 1e10) / 1e10;
    return { ok: true, value };
  } catch (err) {
    if (err.isFormulaError) {
      return { ok: false, value: null, error: err.code, message: err.message };
    }
    return { ok: false, value: null, error: "#VALUE!", message: err.message };
  }
}

/* ── Number formats ─────────────────────────────────────────────────── */

/**
 * How a value is DISPLAYED, which is not what it holds.
 *
 * Excel stores 0.25 and shows 25% when the cell is formatted as a percentage.
 * That single fact causes more confusion than any other formatting rule: a
 * learner types 25 into a percent-formatted cell and Excel shows 2500%. The
 * simulator reproduces it exactly so the lesson can point at it.
 */
export const FORMATS = {
  general: (v) => (typeof v === "number" ? trimFloat(v) : v),
  number: (v) => fmtNumber(v, 0),
  decimal: (v) => fmtNumber(v, 2),
  currency: (v) =>
    typeof v === "number" ? `₦${fmtNumber(v, 0)}` : v,
  currency2: (v) =>
    typeof v === "number" ? `₦${fmtNumber(v, 2)}` : v,
  // 0.25 displays as 25%, exactly as Excel does
  percent: (v) => (typeof v === "number" ? `${fmtNumber(v * 100, 0)}%` : v),
  percent1: (v) => (typeof v === "number" ? `${fmtNumber(v * 100, 1)}%` : v),
  text: (v) => String(v ?? ""),
  date: (v) => v,
  time: (v) => v,
};

function trimFloat(n) {
  return Math.round(n * 1e10) / 1e10;
}

function fmtNumber(value, decimals) {
  if (typeof value !== "number") return value;
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Apply a named format for display. Unknown formats fall back to general. */
export function formatValue(value, format = "general") {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && value.startsWith("#")) return value; // an error
  const fn = FORMATS[format] || FORMATS.general;
  return String(fn(value));
}

/* ── Copying formulas ───────────────────────────────────────────────── */

/**
 * Shift the relative references in a formula, the way Excel does when you
 * fill a formula down a column.
 *
 * =B2*C2 filled from D2 to D3 becomes =B3*C3.
 * $B$2 stays put. $B2 keeps its column, B$2 keeps its row.
 *
 * This is the mechanic behind both the fill handle and absolute references,
 * so it has to be right or neither lesson can be taught honestly.
 */
export function translateFormula(formula, rowDelta = 0, colDelta = 0) {
  const text = String(formula ?? "");
  if (!text.startsWith("=")) return text;

  // Leave anything inside quotes alone: "B2" is text, not a reference
  return text.replace(
    /"[^"]*"|(\$?)([A-Z]{1,3})(\$?)(\d+)/gi,
    (match, colLock, colLetters, rowLock, rowDigits) => {
      if (match.startsWith('"')) return match;

      let col = 0;
      for (const ch of colLetters.toUpperCase()) col = col * 26 + (ch.charCodeAt(0) - 64);
      col -= 1;
      let row = Number(rowDigits) - 1;

      if (!colLock) col += colDelta;
      if (!rowLock) row += rowDelta;

      // Falling off the sheet is what produces #REF! in Excel
      if (col < 0 || row < 0) return "#REF!";

      const ref = toRef({ col, row });
      const letters = ref.replace(/\d+/, "");
      const digits = ref.replace(/[A-Z]+/, "");
      return `${colLock}${letters}${rowLock}${digits}`;
    }
  );
}

/**
 * Fill a formula down a column, as dragging the fill handle does.
 * Returns the cells to write, so the caller stays in charge of state.
 */
export function fillDown(cells, fromRef, toRef_) {
  const from = parseRef(fromRef);
  const to = parseRef(toRef_);
  if (!from || !to || from.col !== to.col) return {};

  const source = cells[fromRef.toUpperCase()];
  if (source === undefined || source === null || source === "") return {};

  const out = {};
  for (let row = from.row + 1; row <= to.row; row += 1) {
    const target = toRef({ col: from.col, row });
    out[target] =
      typeof source === "string" && source.startsWith("=")
        ? translateFormula(source, row - from.row, 0)
        : source;
  }
  return out;
}

/** Evaluate every cell in a sheet, so the grid can render all results at once. */
export function evaluateSheet(cells = {}) {
  const out = {};
  for (const [ref, raw] of Object.entries(cells)) {
    if (typeof raw === "string" && raw.trim().startsWith("=")) {
      const result = evaluateFormula(raw, cells);
      out[ref] = result.ok ? result.value : result.error;
    } else {
      out[ref] = raw;
    }
  }
  return out;
}
