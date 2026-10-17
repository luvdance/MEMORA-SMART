import { item, trap, num, byTier } from "./kit.js";
import { naira } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · GRAPHS, ANGLE RULES AND CONSTRUCTION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-A3, L2-G1 and L2-G2.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Constructions cannot be drawn in a browser drill, so L2-G2 items test the
 * construction knowledge that IS examined: which arcs to draw, which angles a
 * construction produces, how they combine, and whether a triangle can exist.
 */

export const generators = {};

const coords = (extra = {}) => ({ kind: "coordinates", placeholder: "e.g. (3, -5)", ...extra });
const choice = (options) => ({ kind: "choice", options });
const sn = (n) => String(n).replace("-", "−");
const line = (m, c) => `y = ${m === 1 ? "" : m === -1 ? "−" : sn(m)}x${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`}`;

/* ── L2-A3.1 · Plotting points ──────────────────────────────────────── */

generators["L2-A3.1"] = (r, tier) => {
  const x = r.intExcept(-8, 8, [0]);
  const y = r.intExcept(-8, 8, [0]);
  if (r.chance(0.5)) {
    const quadrant = x > 0 && y > 0 ? "first" : x < 0 && y > 0 ? "second" : x < 0 ? "third" : "fourth";
    return item({
      skill: "The four quadrants",
      prompt: `In which quadrant does the point (${sn(x)}, ${sn(y)}) lie?`,
      input: choice(["first", "second", "third", "fourth"]),
      answer: quadrant,
      hints: ["The quadrants are numbered anticlockwise, starting top right.", "First (+, +), second (−, +), third (−, −), fourth (+, −).", `x is ${x > 0 ? "positive" : "negative"} and y is ${y > 0 ? "positive" : "negative"}.`],
      solution: [`x = ${sn(x)} is ${x > 0 ? "right of" : "left of"} the origin, y = ${sn(y)} is ${y > 0 ? "above" : "below"} it.`, `So the point is in the ${quadrant} quadrant.`],
      traps: [trap("swapped", x > 0 && y < 0 ? "second" : x < 0 && y > 0 ? "fourth" : quadrant === "first" ? "third" : "first", "Check the signs again: x first (across), y second (up or down).")],
    });
  }
  return item({
    skill: "Writing coordinates: across first, then up",
    prompt: `From the origin, a point is ${Math.abs(x)} units to the ${x > 0 ? "right" : "left"} and ${Math.abs(y)} units ${y > 0 ? "up" : "down"}. Write its coordinates.`,
    input: coords(),
    answer: `(${x}, ${y})`,
    hints: ["Coordinates are (x, y): across first, then up or down.", "Left and down are negative.", `x = ${sn(x)}`],
    solution: [`Across: ${sn(x)}.  Up/down: ${sn(y)}.`, `(${sn(x)}, ${sn(y)})`],
    traps: [trap("ignored-signs", `(${Math.abs(x)}, ${Math.abs(y)})`, "Left and down are NEGATIVE directions.")],
  });
};

/* ── L2-A3.2 · Tables of values ─────────────────────────────────────── */

generators["L2-A3.2"] = (r, tier) => {
  const m = r.intExcept(-4, 5, [0]);
  const c = r.int(-6, 6);
  const xs = tier === "build" ? [0, 1, 2, 3] : [-2, -1, 0, 1, 2];
  const ys = xs.map((x) => m * x + c);
  if (tier === "exam" && r.chance(0.5)) {
    // quadratic-free: y = mx + c at a negative x is where marks are lost
    const x = r.int(-5, -2);
    return item({
      skill: "Substituting a negative x into a line",
      prompt: `For ${line(m, c)}, find y when x = ${sn(x)}.`,
      input: num(),
      answer: m * x + c,
      hints: ["Put the value in brackets: replace x with (" + sn(x) + ").", `${sn(m)} × (${sn(x)}) = ${sn(m * x)}`, `Then ${c >= 0 ? "add" : "subtract"} ${Math.abs(c)}.`],
      solution: [`y = ${sn(m)}(${sn(x)}) ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${sn(m * x)} ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${sn(m * x + c)}`],
      traps: [trap("sign-slip", -m * x + c, "A negative times a negative is positive, a negative times a positive is negative. Check the sign of the first term.")],
    });
  }
  return item({
    skill: "Completing a table of values",
    prompt: `Complete the table of values for ${line(m, c)}.\n\nx:  ${xs.map(sn).join(",  ")}\n\nType the y values in order, separated by commas.`,
    input: { kind: "list", placeholder: "e.g. -3, -1, 1, 3, 5" },
    ordered: true,
    answer: ys.map(String),
    hints: ["Substitute each x value into the equation in turn.", `When x = ${sn(xs[0])}: y = ${sn(m)} × ${xs[0] < 0 ? `(${sn(xs[0])})` : xs[0]} ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${sn(ys[0])}`, `The y values go up by ${sn(m)} each time x goes up by 1.`],
    solution: xs.map((x, i) => `x = ${sn(x)}: y = ${sn(ys[i])}`),
    traps: [],
  });
};

/* ── L2-A3.3 · Drawing straight-line graphs ─────────────────────────── */

generators["L2-A3.3"] = (r, tier) => {
  const m = r.intExcept(-4, 5, [0]);
  const c = r.intExcept(-9, 9, [0]);
  const kind = r.pick(byTier(tier, { build: ["y-intercept", "on-line"], stretch: ["y-intercept", "x-intercept", "on-line"], exam: ["x-intercept", "on-line", "meet"] }));

  if (kind === "y-intercept") {
    return item({
      skill: "Where a line crosses the y-axis",
      prompt: `Where does the line ${line(m, c)} cross the y-axis? Give the coordinates.`,
      input: coords(),
      answer: `(0, ${c})`,
      hints: ["Every point on the y-axis has x = 0.", "Put x = 0 into the equation.", `y = ${sn(m)} × 0 ${c >= 0 ? "+" : "−"} ${Math.abs(c)}`],
      solution: [`x = 0: y = ${sn(c)}`, `The line crosses the y-axis at (0, ${sn(c)}).`],
      traps: [trap("swapped", `(${c}, 0)`, "On the y-axis x is 0, so the point is (0, y), not (y, 0).")],
    });
  }
  if (kind === "x-intercept") {
    const x0 = r.intExcept(-6, 6, [0]);
    const cc = -m * x0;
    return item({
      skill: "Where a line crosses the x-axis",
      prompt: `Where does the line ${line(m, cc)} cross the x-axis? Give the coordinates.`,
      input: coords(),
      answer: `(${x0}, 0)`,
      hints: ["Every point on the x-axis has y = 0.", `Solve 0 = ${line(m, cc).slice(4)}.`, `${sn(m)}x = ${sn(-cc)}`],
      solution: [`y = 0: ${sn(m)}x ${cc >= 0 ? "+" : "−"} ${Math.abs(cc)} = 0`, `x = ${sn(x0)}`, `(${sn(x0)}, 0)`],
      traps: [trap("gave-y-intercept", `(0, ${cc})`, "That is where the line crosses the y-AXIS. On the x-axis, y = 0.")],
    });
  }
  if (kind === "meet") {
    // y = m1 x + c1 and y = m2 x + c2 meeting at an integer point
    const X = r.int(-4, 4);
    const Y = r.int(-6, 6);
    const m1 = r.intExcept(-3, 3, [0]);
    let m2;
    do m2 = r.intExcept(-3, 3, [0]);
    while (m2 === m1);
    const c1 = Y - m1 * X;
    const c2 = Y - m2 * X;
    return item({
      skill: "Where two straight lines meet",
      prompt: `The lines ${line(m1, c1)} and ${line(m2, c2)} are drawn on the same axes. At what point do they meet?`,
      input: coords(),
      answer: `(${X}, ${Y})`,
      hints: ["Where the lines meet, both equations give the same y for the same x.", `${line(m1, c1).slice(4)} = ${line(m2, c2).slice(4)}`, "Solve for x, then put it into either equation to find y."],
      solution: [`${line(m1, c1).slice(4)} = ${line(m2, c2).slice(4)}`, `x = ${sn(X)}`, `y = ${sn(Y)}`, `They meet at (${sn(X)}, ${sn(Y)}).`],
      traps: [trap("swapped", `(${Y}, ${X})`, "Coordinates are (x, y): x first.")],
    });
  }
  const points = [];
  const good = r.int(-3, 4);
  const options = [];
  for (let i = 0; i < 4; i += 1) {
    const x = good + i - 1;
    const onLine = i === 1;
    const y = m * x + c + (onLine ? 0 : r.pick([1, -1, 2]));
    options.push(`(${x}, ${y})`);
    if (onLine) points.push(`(${x}, ${y})`);
  }
  return item({
    skill: "Testing whether a point lies on a line",
    prompt: `Which of these points lies on the line ${line(m, c)}?`,
    input: choice(options.map((o) => o.replace(/-/g, "−"))),
    answer: points[0].replace(/-/g, "−"),
    hints: ["Put the x of each point into the equation.", "If it gives the point's y, the point is on the line.", `Try each one: y = ${sn(m)}x ${c >= 0 ? "+" : "−"} ${Math.abs(c)}.`],
    solution: options.map((o) => {
      const [x, y] = o.replace(/[()]/g, "").split(", ").map(Number);
      return `${o.replace(/-/g, "−")}: ${sn(m)} × ${x < 0 ? `(${sn(x)})` : x} ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${sn(m * x + c)} ${m * x + c === y ? "✓ on the line" : `≠ ${sn(y)}`}`;
    }),
    traps: [],
  });
};

/* ── L2-A3.4 · Reading real-life graphs ─────────────────────────────── */

generators["L2-A3.4"] = (r, tier) => {
  if (r.chance(0.5)) {
    const rate = r.pick([1500, 1600, 1550, 1450]);
    const dollars = r.int(2, 9) * (tier === "build" ? 10 : 5);
    return item({
      skill: "Reading a conversion graph",
      prompt: `A conversion graph is a straight line through (0, 0) and ($10, ${naira(rate * 10)}). Use it to convert $${dollars} to naira.`,
      input: num(),
      answer: rate * dollars,
      hints: ["A straight line through the origin means direct proportion.", `$10 = ${naira(rate * 10)}, so $1 = ${naira(rate)}.`, `$${dollars} = ${dollars} × ${rate}`],
      solution: [`$1 = ${naira(rate * 10)} ÷ 10 = ${naira(rate)}`, `$${dollars} = ${dollars} × ${rate} = ${naira(rate * dollars)}`],
      traps: [trap("used-ten", rate * 10 * dollars, `The point is for $10, not $1. Divide by 10 first: $1 = ${naira(rate)}.`)],
    });
  }
  const t1 = r.int(1, 3);
  const d1 = r.int(4, 12) * 10;
  const rest = r.int(1, 2);
  const t2 = r.int(1, 2);
  const d2 = r.int(3, 9) * 10;
  const ask = r.pick(byTier(tier, { build: ["speed1", "rest"], stretch: ["speed1", "speed2", "rest"], exam: ["average", "speed2"] }));
  const describe = `A distance–time graph for a journey has three straight parts:\n  • from (0 h, 0 km) to (${t1} h, ${d1} km)\n  • flat from (${t1} h, ${d1} km) to (${t1 + rest} h, ${d1} km)\n  • from (${t1 + rest} h, ${d1} km) to (${t1 + rest + t2} h, ${d1 + d2} km)`;
  const spec = {
    speed1: { q: "What was the speed on the first part, in km/h?", a: d1 / t1, s: [`Speed = distance ÷ time = ${d1} ÷ ${t1} = ${d1 / t1} km/h`], tr: [trap("gave-distance", d1, "That is the distance. Speed = distance ÷ time.")] },
    speed2: { q: "What was the speed on the last part, in km/h?", a: d2 / t2, s: [`Distance = ${d1 + d2} − ${d1} = ${d2} km in ${t2} h`, `Speed = ${d2} ÷ ${t2} = ${d2 / t2} km/h`], tr: [trap("used-total", (d1 + d2) / t2, `On the last part the distance covered is ${d2} km, not ${d1 + d2} km.`)] },
    rest: { q: "For how many hours was the traveller stopped?", a: rest, s: ["A flat (horizontal) part means the distance is not changing: stopped.", `From ${t1} h to ${t1 + rest} h: ${rest} h`], tr: [trap("gave-end-time", t1 + rest, "That is the time the stop ENDED. The length of the stop is the difference.")] },
    average: { q: "What was the average speed for the whole journey, in km/h? Give your answer to 1 decimal place if needed.", a: Math.round(((d1 + d2) / (t1 + rest + t2)) * 10) / 10, s: [`Total distance ${d1 + d2} km, total time ${t1 + rest + t2} h (including the stop)`, `Average speed = ${d1 + d2} ÷ ${t1 + rest + t2} = ${Math.round(((d1 + d2) / (t1 + rest + t2)) * 10) / 10} km/h`], tr: [trap("left-out-stop", Math.round(((d1 + d2) / (t1 + t2)) * 10) / 10, "Average speed uses the TOTAL time, including the time spent stopped.")] },
  }[ask];
  return item({
    skill: "Reading a distance–time graph",
    prompt: `${describe}\n\n${spec.q}`,
    input: num(),
    answer: spec.a,
    tolerance: 0.05,
    hints: ["On a distance–time graph the steepness of a part is the speed.", "A flat part means no movement.", spec.s[0]],
    solution: spec.s,
    traps: spec.tr,
  });
};

/* ── L2-G1 · Angles on parallel lines, in triangles, in polygons ────── */

generators["L2-G1.1"] = (r, tier) => {
  const a = r.int(35, 145);
  const kind = r.pick(["alternate", "corresponding", "co-interior"]);
  if (tier === "exam") {
    const x = r.int(10, 30);
    const k = r.int(2, 4);
    if (kind === "co-interior") {
      const other = 180 - (k * x + 0);
      return item({
        skill: "Co-interior angles in an equation",
        prompt: `Two angles between a pair of parallel lines, on the same side of the transversal (co-interior angles), are ${k}x° and ${other}°. Find x.`,
        input: num(),
        answer: x,
        hints: ["Co-interior angles add up to 180°.", `${k}x + ${other} = 180`, `${k}x = ${180 - other}`],
        solution: [`${k}x + ${other} = 180`, `${k}x = ${180 - other}`, `x = ${x}`],
        traps: [trap("treated-as-equal", Math.round((other / k) * 100) / 100, "Co-interior angles are not equal: they add up to 180°.")],
      });
    }
    const shift = r.int(5, 30);
    const value = k * x + shift;
    return item({
      skill: `${kind[0].toUpperCase()}${kind.slice(1)} angles in an equation`,
      prompt: `A transversal crosses two parallel lines. Two ${kind} angles are (${k}x + ${shift})° and ${value}°. Find x.`,
      input: num(),
      answer: x,
      hints: [`${kind[0].toUpperCase()}${kind.slice(1)} angles are equal.`, `${k}x + ${shift} = ${value}`, `${k}x = ${value - shift}`],
      solution: [`${k}x + ${shift} = ${value}`, `${k}x = ${value - shift}`, `x = ${x}`],
      traps: [trap("used-180", Math.round(((180 - value - shift) / k) * 100) / 100, `${kind[0].toUpperCase()}${kind.slice(1)} angles are EQUAL, they do not add to 180°.`)],
    });
  }
  const answer = kind === "co-interior" ? 180 - a : a;
  return item({
    skill: "Alternate, corresponding and co-interior angles",
    prompt: `A transversal crosses two parallel lines. One angle is ${a}°. What is the ${kind} angle to it?`,
    input: num({ unit: "°" }),
    answer,
    hints: ["Alternate angles (a Z shape) are equal.", "Corresponding angles (an F shape) are equal.", "Co-interior angles (a C or U shape) add up to 180°."],
    solution: [kind === "co-interior" ? `Co-interior angles add up to 180°: 180 − ${a} = ${answer}°` : `${kind[0].toUpperCase()}${kind.slice(1)} angles are equal: ${a}°`],
    traps: [trap(kind === "co-interior" ? "said-equal" : "said-supplementary", kind === "co-interior" ? a : 180 - a, kind === "co-interior" ? "Co-interior angles are not equal; they add up to 180°." : `${kind} angles are EQUAL.`)],
  });
};

generators["L2-G1.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["third", "isosceles"], stretch: ["third", "isosceles", "exterior"], exam: ["exterior", "isosceles-apex", "algebra"] }));
  if (kind === "third") {
    const a = r.int(30, 90);
    const b = r.int(20, 160 - a - 10);
    return item({
      skill: "The angles of a triangle add up to 180°",
      prompt: `Two angles of a triangle are ${a}° and ${b}°. Find the third angle.`,
      input: num({ unit: "°" }),
      answer: 180 - a - b,
      hints: ["The three angles of a triangle add up to 180°.", `${a} + ${b} = ${a + b}`, `180 − ${a + b}`],
      solution: [`180 − ${a} − ${b} = ${180 - a - b}°`],
      traps: [trap("used-360", 360 - a - b, "The angles of a TRIANGLE add up to 180°, not 360°.")],
    });
  }
  if (kind === "isosceles" || kind === "isosceles-apex") {
    const base = r.int(25, 80);
    const apex = 180 - 2 * base;
    if (kind === "isosceles") {
      return item({
        skill: "Base angles of an isosceles triangle are equal",
        prompt: `An isosceles triangle has a top (apex) angle of ${apex}°. Find each of the two equal base angles.`,
        input: num({ unit: "°" }),
        answer: base,
        hints: ["The two base angles are equal.", `They share 180 − ${apex} = ${180 - apex}°.`, `${180 - apex} ÷ 2`],
        solution: [`180 − ${apex} = ${180 - apex}`, `${180 - apex} ÷ 2 = ${base}°`],
        traps: [trap("forgot-halve", 180 - apex, "The two base angles SHARE that amount: divide by 2.")],
      });
    }
    return item({
      skill: "The apex angle of an isosceles triangle",
      prompt: `Each base angle of an isosceles triangle is ${base}°. Find the apex angle.`,
      input: num({ unit: "°" }),
      answer: apex,
      hints: ["There are TWO equal base angles.", `2 × ${base} = ${2 * base}`, `180 − ${2 * base}`],
      solution: [`180 − 2 × ${base} = ${apex}°`],
      traps: [trap("one-base-angle", 180 - base, "There are two base angles of that size. Subtract both.")],
    });
  }
  if (kind === "exterior") {
    const a = r.int(30, 80);
    const b = r.int(30, 80);
    return item({
      skill: "The exterior angle of a triangle",
      prompt: `In a triangle, the two interior angles opposite an exterior angle are ${a}° and ${b}°. Find the exterior angle.`,
      input: num({ unit: "°" }),
      answer: a + b,
      hints: ["The exterior angle of a triangle equals the sum of the two interior opposite angles.", "Why: it and the third interior angle make 180°, and so do all three interior angles.", `${a} + ${b}`],
      solution: [`Exterior angle = ${a} + ${b} = ${a + b}°`],
      traps: [trap("gave-interior", 180 - a - b, "That is the third INTERIOR angle. The exterior angle is next to it on the straight line.")],
    });
  }
  const x = r.int(10, 25);
  const p = r.int(2, 3);
  const q = r.int(1, 3);
  const c = 180 - (p + q) * x;
  return item({
    skill: "Angles in a triangle with algebra",
    prompt: `The angles of a triangle are ${p}x°, ${q === 1 ? "" : q}x° and ${c}°. Find x.`,
    input: num(),
    answer: x,
    hints: ["The angles add up to 180°.", `${p}x + ${q}x + ${c} = 180`, `${p + q}x = ${180 - c}`],
    solution: [`${p + q}x + ${c} = 180`, `${p + q}x = ${180 - c}`, `x = ${x}`],
    traps: [trap("gave-angle", p * x, `That is the size of the ${p}x angle. The question asks for x.`)],
  });
};

const POLY_NAMES = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "12-sided polygon", 15: "15-sided polygon", 18: "18-sided polygon", 20: "20-sided polygon" };

generators["L2-G1.3"] = (r, tier) => {
  const n = r.pick(byTier(tier, { build: [5, 6, 8], stretch: [6, 8, 9, 10, 12], exam: [9, 10, 12, 15, 18, 20] }));
  const kind = r.pick(byTier(tier, { build: ["sum", "interior"], stretch: ["sum", "interior", "exterior"], exam: ["find-n", "interior", "find-n-interior"] }));
  const sum = (n - 2) * 180;
  const ext = 360 / n;
  if (kind === "sum") {
    return item({
      skill: "The sum of the interior angles of a polygon",
      prompt: `Find the sum of the interior angles of a ${POLY_NAMES[n]}.`,
      input: num({ unit: "°" }),
      answer: sum,
      hints: ["A polygon with n sides splits into (n − 2) triangles from one corner.", "Sum of interior angles = (n − 2) × 180°.", `n = ${n}`],
      solution: [`(${n} − 2) × 180 = ${n - 2} × 180 = ${sum}°`],
      traps: [trap("n-times-180", n * 180, "It splits into n − 2 triangles, not n."), trap("used-360", 360, "360° is the sum of the EXTERIOR angles of any polygon.")],
    });
  }
  if (kind === "interior" || kind === "exterior") {
    const asked = kind === "interior" ? 180 - ext : ext;
    return item({
      skill: kind === "interior" ? "Each interior angle of a regular polygon" : "Each exterior angle of a regular polygon",
      prompt: `Find each ${kind} angle of a regular ${POLY_NAMES[n]}.`,
      input: num({ unit: "°" }),
      answer: asked,
      hints: ["The exterior angles of any polygon add up to 360°.", `So each exterior angle of a regular ${n}-gon is 360 ÷ ${n} = ${ext}°.`, "Interior + exterior = 180° at each corner."],
      solution: [`Exterior = 360 ÷ ${n} = ${ext}°`, kind === "interior" ? `Interior = 180 − ${ext} = ${180 - ext}°` : null].filter(Boolean),
      traps: [trap("swapped", kind === "interior" ? ext : 180 - ext, kind === "interior" ? "That is the EXTERIOR angle. Interior = 180° − exterior." : "That is the INTERIOR angle. Exterior = 360° ÷ n.")],
    });
  }
  if (kind === "find-n") {
    return item({
      skill: "Finding the number of sides from an exterior angle",
      prompt: `Each exterior angle of a regular polygon is ${ext}°. How many sides does it have?`,
      input: num(),
      answer: n,
      hints: ["The exterior angles add up to 360°.", `n × ${ext} = 360`, `n = 360 ÷ ${ext}`],
      solution: [`n = 360 ÷ ${ext} = ${n}`],
      traps: [trap("used-180", Math.round((180 / ext) * 100) / 100, "The exterior angles add up to 360°, not 180°.")],
    });
  }
  const interior = 180 - ext;
  return item({
    skill: "Finding the number of sides from an interior angle",
    prompt: `Each interior angle of a regular polygon is ${interior}°. How many sides does it have?`,
    input: num(),
    answer: n,
    hints: ["Find the exterior angle first: 180° − interior.", `180 − ${interior} = ${ext}°`, `n = 360 ÷ ${ext}`],
    solution: [`Exterior = 180 − ${interior} = ${ext}°`, `n = 360 ÷ ${ext} = ${n}`],
    traps: [trap("used-interior", Math.round((360 / interior) * 100) / 100, "Divide 360° by the EXTERIOR angle, not the interior one.")],
  });
};

/* ── L2-G2 · Construction ───────────────────────────────────────────── */

generators["L2-G2.1"] = (r, tier) => {
  const len = r.int(6, 14);
  const [q, a, why, wrong] = r.pick([
    [`To bisect a line AB of length ${len} cm, the compass radius must be ...`, "more than half of AB", "With a radius of half AB or less, the arcs from A and B do not cross twice.", "exactly half of AB"],
    ["The perpendicular bisector of AB is the line through ...", "the two points where the arcs from A and B cross", "Both crossing points are the same distance from A as from B, so the line through them is the bisector.", "A and the midpoint only"],
    [`After bisecting a ${len} cm line, how far is the midpoint from each end?`, `${len / 2} cm`, `Bisect means cut into two equal halves: ${len} ÷ 2.`, `${len} cm`],
    ["Every point on the perpendicular bisector of AB is ...", "the same distance from A and from B", "That is exactly what the perpendicular bisector is: the set of points equidistant from A and B.", "closer to A than to B"],
  ]);
  return item({
    skill: "Bisecting a line segment",
    prompt: q,
    input: choice([a, wrong].sort()),
    answer: a,
    hints: ["Bisecting a line means cutting it into two equal parts at right angles.", "Draw equal arcs from both ends, above and below the line.", "The line through the two crossing points is the perpendicular bisector."],
    solution: [why],
    traps: [trap("misconception", wrong, why)],
  });
};

generators["L2-G2.2"] = (r, tier) => {
  const angle = r.pick([50, 60, 70, 80, 90, 100, 120, 130, 140]);
  if (r.chance(0.5)) {
    return item({
      skill: "What bisecting an angle produces",
      prompt: `An angle of ${angle}° is bisected. What is the size of each of the two angles formed?`,
      input: num({ unit: "°" }),
      answer: angle / 2,
      hints: ["Bisect means cut into two equal parts.", `${angle} ÷ 2`, "Each part is half the original angle."],
      solution: [`${angle} ÷ 2 = ${angle / 2}°`],
      traps: [trap("doubled", angle * 2, "Bisecting halves the angle.")],
    });
  }
  const [q, a, wrong] = r.pick([
    ["To bisect angle ABC, the first arc is drawn with the compass point on ...", "B, the vertex", "A"],
    ["After the first arc crosses BA at P and BC at Q, the next two arcs are drawn from ...", "P and Q, with the same radius", "B and P"],
    ["Every point on the bisector of angle ABC is ...", "the same distance from BA and from BC", "the same distance from A and from C"],
  ]);
  return item({
    skill: "Bisecting an angle",
    prompt: q,
    input: choice([a, wrong].sort()),
    answer: a,
    hints: ["Start with an arc centred on the vertex, cutting both arms.", "From those two points, draw equal arcs that cross inside the angle.", "Join the vertex to that crossing point."],
    solution: ["Arc from the vertex cuts both arms. Equal arcs from those points cross. The line from the vertex through the crossing point bisects the angle; every point on it is equidistant from the two ARMS."],
    traps: [trap("misconception", wrong, `The correct step is: ${a}.`)],
  });
};

generators["L2-G2.3"] = (r, tier) => {
  if (tier === "build" || r.chance(0.5)) {
    // Ruler-and-compasses angles: 60 and 90, and everything got by bisecting
    // and adding them. 50, 70, 80, 100 and 40 are not among them.
    const can = r.sample(tier === "build" ? [30, 45, 60, 90, 120] : [15, 75, 105, 135, 150, 22.5], 3);
    const cannot = r.pick([40, 50, 70, 80, 100, 110]);
    const options = [...can, cannot].sort((x, y) => x - y).map((v) => `${v}°`);
    return item({
      skill: "Which angles can be constructed with ruler and compasses",
      prompt: "Which of these angles can NOT be constructed using only a ruler and a pair of compasses?",
      input: choice(options),
      answer: `${cannot}°`,
      hints: ["The two starting angles are 60° (equilateral triangle) and 90° (perpendicular).", "Bisecting gives 30°, 15°, 45°, 22.5° ... and adding gives 75°, 105°, 120°, 135°, 150° ...", "Every constructible angle here is built from 60° and 90° by halving and adding."],
      solution: [`${can.join("°, ")}° can all be made from 60° and 90° by bisecting and adding.`, `${cannot}° cannot: it must be measured with a protractor.`],
      traps: [trap("picked-constructible", `${can[0]}°`, `${can[0]}° CAN be constructed from 60° and 90° by bisecting and adding.`)],
    });
  }
  const [target, right, wrong] = r.pick([
    [75, "60° and half of the 30° between 60° and 90°", "45° and 30° measured with a protractor"],
    [105, "90° and half of the 30° between 90° and 120°", "60° and 45°, both measured"],
    [135, "90° and half of a right angle (45°)", "120° and 15°, measured"],
    [150, "180° with 30° taken away", "90° and 60° measured from the same arm"],
    [22.5, "bisect 90° to get 45°, then bisect again", "divide 60° into three parts"],
    [15, "bisect 60° to get 30°, then bisect again", "divide 45° into three parts"],
  ]);
  return item({
    skill: "Building an angle from 60° and 90°",
    prompt: `How is an angle of ${target}° constructed with ruler and compasses?`,
    input: choice([right, wrong].sort()),
    answer: right,
    hints: ["Constructions can only bisect (halve) and add angles you have built.", "You cannot divide an angle into three equal parts with ruler and compasses.", `${target}° = a combination of 60°, 90° and their halves.`],
    solution: [`${target}°: ${right}.`],
    traps: [trap("not-constructible-method", wrong, "Ruler and compasses can only bisect and add constructed angles; they cannot trisect, and nothing may be measured.")],
  });
};

generators["L2-G2.4"] = (r, tier) => {
  const a = r.int(3, 9);
  const b = r.int(3, 9);
  const possible = r.chance(0.5);
  const c = possible ? r.int(Math.abs(a - b) + 1, a + b - 1) : a + b + r.int(0, 3);
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "Whether a triangle can be constructed",
      prompt: `Can a triangle be constructed with sides of ${a} cm, ${b} cm and ${c} cm?`,
      input: choice(["yes", "no"]),
      answer: possible ? "yes" : "no",
      hints: ["The two shorter sides must add up to MORE than the longest side.", `The longest side is ${Math.max(a, b, c)} cm.`, "If they only equal it or are less, the arcs cannot meet."],
      solution: [`The two shorter sides: ${[a, b, c].sort((x, y) => x - y).slice(0, 2).join(" + ")} = ${[a, b, c].sort((x, y) => x - y).slice(0, 2).reduce((s, v) => s + v, 0)}`, `Longest: ${Math.max(a, b, c)}`, possible ? "Their sum is bigger, so the triangle can be drawn." : "Their sum is not bigger, so the arcs never meet: no triangle."],
      traps: [trap("ignored-inequality", possible ? "no" : "yes", "Check the triangle inequality: the two shorter sides together must be longer than the longest side.")],
    });
  }
  const [given, order, wrong] = r.pick([
    ["three sides (SSS)", "draw one side, then arcs of the other two lengths from its ends", "draw all three sides from one point"],
    ["two sides and the angle between them (SAS)", "draw one side, construct the angle at one end, then measure the second side along it", "construct the angle first, then guess the sides"],
    ["two angles and the side between them (ASA)", "draw the side, then construct one angle at each end", "draw two angles at the same end"],
  ]);
  return item({
    skill: "Constructing a triangle from given information",
    prompt: `To construct a triangle given ${given}, you should first ...`,
    input: choice([order, wrong].sort()),
    answer: order,
    hints: ["Every construction starts by drawing one known side as a base line.", "Then use arcs (for lengths) or constructed angles at its ends.", "The third corner is where the arcs or arms meet."],
    solution: [`Given ${given}: ${order}.`],
    traps: [trap("wrong-order", wrong, `The method is: ${order}.`)],
  });
};

export default generators;
