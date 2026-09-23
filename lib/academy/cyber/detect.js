/**
 * DETECTION ENGINE — the SIEM rule, reduced to what a beginner has to get right.
 *
 * Pure. Shared by src/academy/components/LogHunt.jsx and the content validator.
 *
 * A SOC analyst's real job is not "watching alerts". It is the trade-off in
 * every detection rule: loosen it and you drown in false positives, tighten it
 * and the attack walks past. That trade-off cannot be taught with a slide. It
 * can be taught by making someone write a rule, run it against a log that
 * contains both an attack and a lot of ordinary Monday morning, and see what
 * their rule did to both.
 *
 * So a rule here is built from parts a learner picks — field, operator, value,
 * and optionally "count by X, alert at N" — and is run against real event rows.
 * Every event is labelled `attack: true` or not, and grading is by detection
 * quality: catch every attack event, with no more than the allowed number of
 * false positives.
 *
 * EVENT  { id, time, ...fields, attack?: boolean }
 * RULE   { conditions: [{ field, op, value }], groupBy?, threshold? }
 */

export const OPERATORS = [
  { id: "equals", label: "is", symbol: "==" },
  { id: "notEquals", label: "is not", symbol: "!=" },
  { id: "contains", label: "contains", symbol: "~" },
  { id: "gte", label: "is at least", symbol: ">=" },
  { id: "lte", label: "is at most", symbol: "<=" },
];

function testOne(event, condition) {
  const raw = event?.[condition.field];
  if (raw === undefined || raw === null) return false;
  const left = String(raw).toLowerCase();
  const right = String(condition.value ?? "").toLowerCase();

  switch (condition.op) {
    case "equals":
      return left === right;
    case "notEquals":
      return left !== right;
    case "contains":
      return left.includes(right);
    case "gte":
      return Number(raw) >= Number(condition.value);
    case "lte":
      return Number(raw) <= Number(condition.value);
    default:
      return false;
  }
}

/** Every condition has to hold. An OR is written as a second rule in real life too. */
export function matchEvent(event, conditions = []) {
  if (!conditions.length) return false;
  return conditions.every((c) => testOne(event, c));
}

/**
 * Run a rule over a log.
 *
 * Without a threshold every matching event is an alert. With one, matching
 * events are counted per `groupBy` value and only the groups that reach the
 * threshold alert — which is how you tell one failed login from a brute force
 * without alerting on every typo in the company.
 */
export function runDetection(events = [], rule = {}) {
  const conditions = rule.conditions || [];
  const matched = events.filter((e) => matchEvent(e, conditions));

  if (!rule.threshold || !rule.groupBy) {
    return {
      matched,
      alerts: matched.map((e) => ({ key: e.id, count: 1, events: [e] })),
      alerting: matched,
      grouped: false,
    };
  }

  const buckets = new Map();
  for (const event of matched) {
    const key = String(event[rule.groupBy] ?? "(none)");
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(event);
  }

  const alerts = [];
  const alerting = [];
  for (const [key, group] of buckets) {
    if (group.length >= Number(rule.threshold)) {
      alerts.push({ key, count: group.length, events: group });
      alerting.push(...group);
    }
  }

  return { matched, alerts, alerting, grouped: true };
}

/**
 * Mark a detection rule on the only measure that matters in a SOC: did it
 * catch the attack, and how much noise did it make doing it?
 *
 * `maxFalsePositives` is set by the content. Zero is not always the right
 * target — a rule that alerts on two ordinary logins to catch a real intrusion
 * is a good rule, and pretending otherwise teaches people to miss attacks.
 */
export function scoreDetection(events = [], rule = {}, expect = {}) {
  const maxFalse = expect.maxFalsePositives ?? 0;
  const run = runDetection(events, rule);

  const alertingIds = new Set(run.alerting.map((e) => e.id));
  const attacks = events.filter((e) => e.attack);
  const caught = attacks.filter((e) => alertingIds.has(e.id));
  const missed = attacks.filter((e) => !alertingIds.has(e.id));
  const falsePositives = run.alerting.filter((e) => !e.attack);

  if (!(rule.conditions || []).length) {
    return { ok: false, run, caught, missed, falsePositives, message: "Build a condition first. Pick a field, an operator and a value." };
  }

  if (missed.length) {
    return {
      ok: false,
      run,
      caught,
      missed,
      falsePositives,
      message:
        caught.length === 0
          ? "Your rule fires on nothing that matters. None of the attack events matched it, so this detection would have let the whole thing through."
          : `Your rule catches part of the attack and misses ${missed.length} of its events. A detection that catches half an intrusion still lets the intruder finish.`,
    };
  }

  if (falsePositives.length > maxFalse) {
    return {
      ok: false,
      run,
      caught,
      missed,
      falsePositives,
      message: `You caught the attack, but the rule also alerts on ${falsePositives.length} ordinary events and the brief allows at most ${maxFalse}. A rule this noisy gets muted within a week, and then it catches nothing at all.`,
    };
  }

  return {
    ok: true,
    run,
    caught,
    missed,
    falsePositives,
    message: `Caught all ${attacks.length} attack events with ${falsePositives.length} false positive${falsePositives.length === 1 ? "" : "s"}. That is a rule an analyst would keep switched on.`,
  };
}

/** The rule, written out the way a SIEM would display it. */
export function ruleText(rule = {}) {
  const conditions = (rule.conditions || [])
    .map((c) => {
      const op = OPERATORS.find((o) => o.id === c.op)?.symbol || "==";
      return `${c.field} ${op} "${c.value}"`;
    })
    .join(" AND ");
  if (!conditions) return "(no condition yet)";
  if (rule.threshold && rule.groupBy) {
    return `${conditions}\n| count by ${rule.groupBy}\n| where count >= ${rule.threshold}`;
  }
  return conditions;
}
