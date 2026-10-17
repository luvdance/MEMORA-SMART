import { item, trap, num, byTier } from "./kit.js";

/**
 * GENERATORS · LEVEL 1 · SOLID SHAPES AND DATA HANDLING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-G2.1, L1-G2.2 and L1-S1.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

/* ── L1-G2.1 · Faces, edges and vertices ────────────────────────────── */

const SOLIDS = [
  { name: "cube", f: 6, e: 12, v: 8 },
  { name: "cuboid", f: 6, e: 12, v: 8 },
  { name: "triangular prism", f: 5, e: 9, v: 6 },
  { name: "square-based pyramid", f: 5, e: 8, v: 5 },
  { name: "triangular-based pyramid (tetrahedron)", f: 4, e: 6, v: 4 },
  { name: "pentagonal prism", f: 7, e: 15, v: 10 },
  { name: "hexagonal prism", f: 8, e: 18, v: 12 },
];

generators["L1-G2.1"] = (r, tier) => {
  if (tier === "exam" || (tier === "stretch" && r.chance(0.5))) {
    const s = r.pick(SOLIDS.slice(2));
    const ask = r.pick(["e", "v", "f"]);
    const given = { f: "faces", e: "edges", v: "vertices" };
    const others = ["f", "e", "v"].filter((k) => k !== ask);
    const answer = s[ask];
    const formula = { e: `E = F + V − 2 = ${s.f} + ${s.v} − 2`, v: `V = E − F + 2 = ${s.e} − ${s.f} + 2`, f: `F = E − V + 2 = ${s.e} − ${s.v} + 2` }[ask];
    return item({
      skill: "Euler's formula for solids",
      prompt: `A solid with flat faces has ${s[others[0]]} ${given[others[0]]} and ${s[others[1]]} ${given[others[1]]}.\n\nUse F + V − E = 2 to find the number of ${given[ask]}.`,
      input: num(),
      answer,
      hints: ["Euler's formula: Faces + Vertices − Edges = 2.", "Put in the two numbers you know.", formula],
      solution: [`F + V − E = 2`, `${formula} = ${answer}`],
      traps: [trap("forgot-two", answer + (ask === "e" ? 2 : -2), "Close: you dropped the 2 in F + V − E = 2. Put it back in.")],
    });
  }

  const s = r.pick(tier === "build" ? SOLIDS.slice(0, 5) : SOLIDS);
  const ask = r.pick(["f", "e", "v"]);
  const label = { f: "faces", e: "edges", v: "vertices (corners)" }[ask];
  const answer = s[ask];
  return item({
    skill: "Counting faces, edges and vertices",
    prompt: `How many ${label} does a ${s.name} have?`,
    input: num(),
    answer,
    hints: ["A FACE is a flat surface, an EDGE is where two faces meet, a VERTEX is a corner.", "Count the top and bottom faces first, then the sides.", "Check with Euler: F + V − E = 2."],
    solution: [`A ${s.name} has ${s.f} faces, ${s.e} edges and ${s.v} vertices.`, `Check: ${s.f} + ${s.v} − ${s.e} = 2 ✓`],
    traps: [trap("mixed-up", ask === "e" ? s.v : s.e, `That is the number of ${ask === "e" ? "vertices" : "edges"}. Edges are the lines where faces meet; vertices are the corners.`)],
  });
};

/* ── L1-G2.2 · Nets ─────────────────────────────────────────────────── */

const NETS = [
  ["six squares", "cube"],
  ["six rectangles, in three matching pairs", "cuboid"],
  ["two triangles and three rectangles", "triangular prism"],
  ["one square and four triangles", "square-based pyramid"],
  ["four triangles", "tetrahedron"],
  ["two circles and one rectangle", "cylinder"],
  ["a circle and a sector of a larger circle", "cone"],
];
const NET_OPTIONS = ["cube", "cuboid", "triangular prism", "square-based pyramid", "tetrahedron", "cylinder", "cone"];

generators["L1-G2.2"] = (r, tier) => {
  if (tier === "exam" || (tier === "stretch" && r.chance(0.5))) {
    const s = r.int(2, 9);
    const cube = r.chance(0.5);
    if (cube) {
      return item({
        skill: "The area of a net",
        prompt: `A cube has edges of ${s} cm. What is the total area of its net?`,
        input: num({ unit: "cm²" }),
        answer: 6 * s * s,
        hints: ["The net of a cube is six squares.", `Each square is ${s} × ${s}.`, `6 × ${s * s}`],
        solution: [`One face: ${s} × ${s} = ${s * s} cm²`, `Six faces: 6 × ${s * s} = ${6 * s * s} cm²`],
        traps: [trap("one-face", s * s, "That is one face. The net has six."), trap("volume", s ** 3, "That is the volume. The net's area is six square faces.")],
      });
    }
    const [l, w, h] = [s + r.int(1, 4), s, r.int(2, 6)];
    const area = 2 * (l * w + l * h + w * h);
    return item({
      skill: "The area of a net",
      prompt: `A cuboid measures ${l} cm by ${w} cm by ${h} cm. What is the total area of its net?`,
      input: num({ unit: "cm²" }),
      answer: area,
      hints: ["The net is six rectangles in three matching pairs.", `The pairs: ${l} × ${w}, ${l} × ${h}, ${w} × ${h}.`, `2 × (${l * w} + ${l * h} + ${w * h})`],
      solution: [`${l} × ${w} = ${l * w},  ${l} × ${h} = ${l * h},  ${w} × ${h} = ${w * h}`, `Total: 2 × (${l * w} + ${l * h} + ${w * h}) = ${area} cm²`],
      traps: [trap("three-faces", area / 2, "That counts each pair once. Every face has a matching face opposite it, so double."), trap("volume", l * w * h, "That is the volume. The net's area is the six rectangles added.")],
    });
  }

  const [desc, answer] = r.pick(NETS);
  return item({
    skill: "Recognising a solid from its net",
    prompt: `A net is made of ${desc}. Which solid does it fold into?`,
    input: { kind: "choice", options: NET_OPTIONS },
    answer,
    hints: ["A net is the solid unfolded flat: one piece for every face.", "Prisms have two identical end faces joined by rectangles. Pyramids have one base and triangles meeting at a point.", "Count the pieces and their shapes."],
    solution: [`${desc[0].toUpperCase()}${desc.slice(1)} fold into a ${answer}.`],
    traps: [trap("prism-pyramid", answer === "triangular prism" ? "square-based pyramid" : answer === "square-based pyramid" ? "triangular prism" : answer === "cube" ? "cuboid" : "cube", `Count again. ${desc} fold into a ${answer}.`)],
  });
};

/* ── L1-S1 · Data handling ──────────────────────────────────────────── */

function dataset(r, size, lo, hi) {
  return Array.from({ length: size }, () => r.int(lo, hi));
}

generators["L1-S1.1"] = (r, tier) => {
  const size = byTier(tier, { build: 15, stretch: 20, exam: 25 });
  const data = dataset(r, size, 4, 9);
  const counts = {};
  for (const d of data) counts[d] = (counts[d] || 0) + 1;
  const kind = r.pick(byTier(tier, { build: ["count", "total"], stretch: ["count", "mode"], exam: ["mode", "more-than"] }));
  const listed = data.join(", ");

  if (kind === "count") {
    const v = r.pick(Object.keys(counts).map(Number));
    return item({
      skill: "Tallying raw data into a frequency table",
      prompt: `These are the shoe sizes of ${size} students:\n\n${listed}\n\nWhat is the frequency of size ${v}?`,
      input: num(),
      answer: counts[v],
      hints: ["The FREQUENCY of a value is how many times it appears.", "Go through the list once, making a tally mark each time you see it.", "Group the tally marks in fives to count them safely."],
      solution: [`Size ${v} appears ${counts[v]} times.`, `Frequency of ${v}: ${counts[v]}`],
      traps: [trap("gave-value", v, `${v} is the shoe size itself. The frequency is how many students wear it.`)],
    });
  }
  if (kind === "total") {
    return item({
      skill: "Total frequency",
      prompt: `These are the shoe sizes of some students:\n\n${listed}\n\nWhat is the TOTAL frequency?`,
      input: num(),
      answer: size,
      hints: ["The total frequency is the total number of pieces of data.", "It is NOT the sum of the shoe sizes.", "Count the entries."],
      solution: [`There are ${size} values in the list, so the total frequency is ${size}.`],
      traps: [trap("summed-values", data.reduce((a, b) => a + b, 0), "That adds the shoe sizes. Total frequency counts the students.")],
    });
  }
  const max = Math.max(...Object.values(counts));
  const modes = Object.keys(counts).filter((k) => counts[k] === max);
  if (kind === "mode") {
    if (modes.length > 1) return generators["L1-S1.1"](r, "build");
    return item({
      skill: "Reading the most common value from a frequency table",
      prompt: `These are the shoe sizes of ${size} students:\n\n${listed}\n\nWhich size is the most common?`,
      input: num(),
      answer: Number(modes[0]),
      hints: ["Make a frequency table first.", "The most common value has the highest frequency.", "Give the SIZE, not how many times it appears."],
      solution: [Object.keys(counts).sort((a, b) => a - b).map((k) => `size ${k}: ${counts[k]}`).join(",  "), `Most common: size ${modes[0]}`],
      traps: [trap("gave-frequency", max, `${max} is how many students wear it. The question asks which SIZE.`)],
    });
  }
  const cut = 6;
  const more = data.filter((d) => d > cut).length;
  return item({
    skill: "Answering a question from a frequency table",
    prompt: `These are the shoe sizes of ${size} students:\n\n${listed}\n\nHow many students wear a size BIGGER than ${cut}?`,
    input: num(),
    answer: more,
    hints: ["Make a frequency table.", `Add the frequencies of the sizes greater than ${cut}.`, `'Bigger than ${cut}' does not include ${cut} itself.`],
    solution: [`Sizes 7, 8 and 9: ${[7, 8, 9].map((k) => counts[k] || 0).join(" + ")} = ${more}`],
    traps: [trap("included-boundary", more + (counts[cut] || 0), `'Bigger than ${cut}' does not include size ${cut}.`)],
  });
};

generators["L1-S1.2"] = (r, tier) => {
  if (r.chance(0.5)) {
    const key = r.pick(byTier(tier, { build: [2, 4, 5, 10], stretch: [4, 6, 8], exam: [6, 8, 12] }));
    const symbols = r.int(2, 6) + (tier === "build" ? 0 : 0.5);
    const count = key * symbols;
    return item({
      skill: "Using the key of a pictogram",
      prompt: `In a pictogram, one ★ stands for ${key} pupils. How many ★ symbols are needed to show ${count} pupils?`,
      input: num(),
      answer: symbols,
      hints: ["Each symbol stands for the number in the key.", `Divide the number of pupils by ${key}.`, symbols % 1 ? "A half symbol stands for half the key." : `${count} ÷ ${key}`],
      solution: [`${count} ÷ ${key} = ${symbols}`, symbols % 1 ? `So ${Math.floor(symbols)} whole symbols and a half.` : `So ${symbols} symbols.`],
      traps: [trap("one-each", count, `The key says one ★ = ${key} pupils, so you need far fewer symbols: ${count} ÷ ${key}.`)],
    });
  }
  const per = r.pick(byTier(tier, { build: [2, 5], stretch: [4, 5], exam: [4, 8] }));
  const value = per * r.int(3, 9) + (tier === "build" ? 0 : per / 2);
  const height = value / per;
  return item({
    skill: "Choosing the height of a bar on a scale",
    prompt: `A bar chart uses a scale of 1 cm to ${per} pupils. How tall, in cm, should the bar for ${value} pupils be?`,
    input: num({ unit: "cm" }),
    answer: height,
    hints: ["Each centimetre stands for the number in the scale.", `Divide ${value} by ${per}.`, `${value} ÷ ${per}`],
    solution: [`${value} ÷ ${per} = ${height} cm`],
    traps: [trap("multiplied", value * per, `That multiplies. Each cm stands for ${per} pupils, so divide: ${value} ÷ ${per}.`)],
  });
};

generators["L1-S1.3"] = (r, tier) => {
  const size = byTier(tier, { build: 5, stretch: 7, exam: r.pick([6, 8]) });
  let data;
  let mean;
  do {
    data = dataset(r, size, 2, tier === "exam" ? 40 : 20);
    mean = data.reduce((a, b) => a + b, 0) / size;
  } while (!Number.isInteger(mean * 2));
  const sorted = [...data].sort((a, b) => a - b);
  const mid = size / 2;
  const median = size % 2 ? sorted[Math.floor(mid)] : (sorted[mid - 1] + sorted[mid]) / 2;
  const range = sorted[size - 1] - sorted[0];
  const ask = r.pick(byTier(tier, { build: ["mean", "range", "median"], stretch: ["mean", "median", "range"], exam: ["median", "mean"] }));
  const listed = data.join(", ");
  const sum = data.reduce((a, b) => a + b, 0);
  const unsortedMiddle = size % 2 ? data[Math.floor(mid)] : (data[mid - 1] + data[mid]) / 2;

  const spec = {
    mean: {
      prompt: `Find the MEAN of:  ${listed}`,
      answer: mean,
      hints: ["Mean = total of the values ÷ how many values there are.", `Total: ${data.join(" + ")}`, `${sum} ÷ ${size}`],
      solution: [`Total = ${sum}`, `Mean = ${sum} ÷ ${size} = ${mean}`],
      traps: [trap("divided-wrong", Math.round((sum / (size - 1)) * 100) / 100, `Divide by how many values there are: ${size}.`)],
    },
    median: {
      prompt: `Find the MEDIAN of:  ${listed}`,
      answer: median,
      hints: ["Put the values in order first.", size % 2 ? "The median is the middle value." : "With an even number of values, the median is halfway between the middle two.", `In order: ${sorted.join(", ")}`],
      solution: [`In order: ${sorted.join(", ")}`, size % 2 ? `Middle value: ${median}` : `Middle two: ${sorted[mid - 1]} and ${sorted[mid]}, halfway is ${median}`],
      traps: unsortedMiddle !== median ? [trap("did-not-sort", unsortedMiddle, "You took the middle of the list as given. Sort the values first.")] : [],
    },
    range: {
      prompt: `Find the RANGE of:  ${listed}`,
      answer: range,
      hints: ["Range = largest value − smallest value.", `Largest: ${sorted[size - 1]}`, `Smallest: ${sorted[0]}`],
      solution: [`${sorted[size - 1]} − ${sorted[0]} = ${range}`],
      traps: [trap("gave-largest", sorted[size - 1], "That is the largest value. The range is largest − smallest.")],
    },
  }[ask];

  return item({ skill: `Finding the ${ask} of a small data set`, input: num(), ...spec });
};

export default generators;
