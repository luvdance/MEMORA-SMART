import { item, trap, num, ratio, byTier } from "./kit.js";
import { grouped, naira, NAMES, GOODS, gcd, tidy } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · RATIO, PROPORTION AND RATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-N3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * These are the first Level 2 generators, and ratio is the right place to start
 * because it is where the fraction work of Month 3 either pays off or does not.
 *
 * The traps here are unusually worth reading, because ratio errors are almost
 * never arithmetic. They are one of three specific misreadings:
 *
 *   PART FOR WHOLE. Sharing 480 in the ratio 3:5 means eight parts, not three
 *   and not five. A student who divides by 3 has read the first number as the
 *   number of shares. This is the single commonest ratio error there is, and it
 *   produces an answer larger than the amount being shared, which is why the
 *   trap message points at that rather than at the arithmetic.
 *
 *   RATIO FOR FRACTION. In 3:5 the first share is three eighths, not three
 *   fifths. The 5 is the OTHER part, not the whole, and the confusion comes
 *   from fraction notation where the bottom number IS the whole.
 *
 *   PROPORTION DIRECTION. More workers means less time, not more. Inverse
 *   proportion is the one place where multiplying by the obvious scale factor
 *   gives an answer that is wrong in a way the student can see, if they are
 *   asked whether it should go up or down BEFORE they calculate. Every inverse
 *   item here says so in its first hint, because that question is the skill.
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L2-N3.1 · SIMPLIFYING AND SHARING IN A RATIO
   ═══════════════════════════════════════════════════════════════════════ */

generators["L2-N3.1"] = (r, tier) => {
  const simplifying = r.chance(0.4);

  /* ── Simplify a ratio to its lowest terms ─────────────────────────── */
  if (simplifying) {
    const a = r.pick(byTier(tier, { build: [2, 3, 4, 5], stretch: [3, 4, 5, 7], exam: [4, 5, 7, 8, 9] }));
    const b = r.pick(byTier(tier, { build: [3, 4, 5, 6], stretch: [5, 6, 7, 8], exam: [6, 7, 9, 11, 12] }).filter((x) => gcd(x, a) === 1)) || a + 1;
    const k = r.pick(byTier(tier, { build: [2, 3, 4], stretch: [4, 6, 8], exam: [6, 8, 12, 15] }));

    return item({
      skill: "Simplifying a ratio",
      prompt: `Simplify the ratio ${a * k} : ${b * k}.\n\nGive your answer in its lowest terms.`,
      input: ratio({ placeholder: "e.g. 3:4" }),
      answer: `${a}:${b}`,
      exact: "lowest-terms",
      hints: [
        "A ratio simplifies exactly as a fraction does: divide both sides by the same number.",
        `What is the highest number that divides into both ${a * k} and ${b * k}?`,
        `The HCF is ${k}. Divide both sides by ${k}.`,
      ],
      solution: [
        `HCF of ${a * k} and ${b * k} is ${k}.`,
        `${a * k} ÷ ${k} = ${a}`,
        `${b * k} ÷ ${k} = ${b}`,
        `So the ratio is ${a}:${b}.`,
      ],
      traps: [
        trap(
          "subtracted-not-divided",
          `${a * k - k}:${b * k - k}`,
          `You took ${k} off each side instead of dividing each side by ${k}. Subtracting changes the ratio: ${a * k}:${b * k} and ${a * k - k}:${b * k - k} are not the same comparison. A ratio is about how many times bigger one part is than the other, so only multiplying and dividing leave it alone.`,
          "L2-N3.1"
        ),
        trap(
          "half-simplified",
          k % 2 === 0 ? `${(a * k) / 2}:${(b * k) / 2}` : `${a * k}:${b * k}`,
          `That is the right ratio and it is not finished. Both sides still share a factor, so keep dividing until the only number that goes into both is 1. Here the full HCF is ${k}, giving ${a}:${b}.`,
          "L2-N3.1"
        ),
      ],
    });
  }

  /* ── Share a quantity in a given ratio ────────────────────────────── */
  const a = r.pick(byTier(tier, { build: [1, 2, 3], stretch: [2, 3, 4, 5], exam: [3, 4, 5, 7] }));
  const b = r.pick(byTier(tier, { build: [2, 3, 4], stretch: [3, 5, 6, 7], exam: [5, 6, 8, 9] }).filter((x) => x !== a)) || a + 1;
  const parts = a + b;
  const unit = r.pick(byTier(tier, { build: [10, 20, 50], stretch: [40, 60, 120], exam: [150, 250, 400] }));
  const total = parts * unit;
  const wantFirst = r.chance(0.5);
  const share = (wantFirst ? a : b) * unit;
  const other = (wantFirst ? b : a) * unit;
  const who = r.pick(NAMES);
  const mate = r.pick(NAMES.filter((n) => n !== who));

  return item({
    skill: "Sharing a quantity in a given ratio",
    prompt: `${naira(total)} is shared between ${who} and ${mate} in the ratio ${a} : ${b}.\n\nHow much does ${wantFirst ? who : mate} receive? Give your answer in naira.`,
    input: num({ placeholder: "naira, digits only" }),
    answer: String(share),
    accept: [naira(share), grouped(share)],
    visual: { kind: "ratioBar", parts: [a, b], total, labels: [who, mate] },
    hints: [
      `Count the parts FIRST. The ratio ${a}:${b} means the money is split into ${a} + ${b} parts altogether, not into ${a} parts.`,
      `There are ${parts} parts sharing ${naira(total)}, so find what one part is worth.`,
      `One part is ${naira(total)} ÷ ${parts} = ${naira(unit)}. ${wantFirst ? who : mate} gets ${wantFirst ? a : b} of them.`,
    ],
    solution: [
      `Total parts: ${a} + ${b} = ${parts}`,
      `One part: ${grouped(total)} ÷ ${parts} = ${grouped(unit)}`,
      `${wantFirst ? who : mate} gets ${wantFirst ? a : b} parts: ${wantFirst ? a : b} × ${grouped(unit)} = ${grouped(share)}`,
      `Check: ${grouped(share)} + ${grouped(other)} = ${grouped(total)}`,
    ],
    traps: [
      trap(
        "part-for-whole",
        String(Math.round(total / (wantFirst ? a : b))),
        `You divided by ${wantFirst ? a : b} alone. The ratio ${a}:${b} describes ${parts} parts in total, not ${wantFirst ? a : b}, so the money is cut into ${parts} pieces and ${wantFirst ? who : mate} takes ${wantFirst ? a : b} of them. Notice the size of what you got: it is far more than a fair split of ${grouped(total)} could be.`,
        "L2-N3.1"
      ),
      trap(
        "wrong-share",
        String(other),
        `That is the OTHER person's share. You found ${wantFirst ? mate : who}'s ${wantFirst ? b : a} parts rather than ${wantFirst ? who : mate}'s ${wantFirst ? a : b}. The arithmetic was right; underline whose share the question asked for before you start.`,
        "L2-N3.1"
      ),
      trap(
        "ratio-as-fraction",
        String(Math.round((total * (wantFirst ? a : b)) / (wantFirst ? b : a))),
        `You treated ${a}:${b} as the fraction ${wantFirst ? a : b}/${wantFirst ? b : a}. In a ratio the second number is the OTHER part, not the whole. As a fraction, ${wantFirst ? who : mate}'s share is ${wantFirst ? a : b}/${parts}, because the whole is all ${parts} parts together.`,
        "L2-N3.1"
      ),
      trap("one-part", String(unit), `That is what ONE part is worth, which is the right first step. ${wantFirst ? who : mate} gets ${wantFirst ? a : b} of them, so multiply by ${wantFirst ? a : b}.`, "L2-N3.1"),
    ],
    scaffold: [
      { ask: `How many parts altogether in the ratio ${a} : ${b}?`, answer: String(parts), input: num() },
      { ask: `So what is one part worth, in naira?`, answer: String(unit), input: num() },
      { ask: `${wantFirst ? who : mate} has ${wantFirst ? a : b} parts. How much is that?`, answer: String(share), input: num() },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L2-N3.2 · THE UNITARY METHOD
   ═══════════════════════════════════════════════════════════════════════ */

generators["L2-N3.2"] = (r, tier) => {
  const per = r.pick(byTier(tier, { build: [3, 4, 5], stretch: [6, 7, 8], exam: [7, 9, 12] }));
  const want = r.pick(byTier(tier, { build: [6, 8, 10], stretch: [11, 13, 15], exam: [17, 19, 23] }).filter((x) => x !== per)) || per + 3;

  // A price the good could really carry, rounded to something a market quotes.
  const good = r.pick(GOODS);
  const step = good.high > 10000 ? 500 : good.high > 1000 ? 50 : 5;
  const unitCost = r.int(Math.ceil(good.low / step), Math.floor(good.high / step)) * step;

  const known = per * unitCost;
  const answer = want * unitCost;

  return item({
    skill: "The unitary method",
    prompt: `${per} ${good.name} cost ${naira(known)}.\n\nAt the same rate, what do ${want} ${good.name} cost? Give your answer in naira.`,
    input: num({ placeholder: "naira, digits only" }),
    answer: String(answer),
    accept: [naira(answer), grouped(answer)],
    hints: [
      "Find what ONE costs first. That single number then answers any quantity the question asks for.",
      `${per} cost ${grouped(known)}, so divide to get the cost of one.`,
      `One costs ${grouped(known)} ÷ ${per} = ${grouped(unitCost)}. Now multiply by ${want}.`,
    ],
    solution: [
      `One ${good.unit}: ${grouped(known)} ÷ ${per} = ${grouped(unitCost)}`,
      `${want} of them: ${want} × ${grouped(unitCost)} = ${grouped(answer)}`,
      `Sense check: ${want} is ${want > per ? "more" : "fewer"} than ${per}, so the cost should be ${want > per ? "higher" : "lower"} than ${grouped(known)}. It is.`,
    ],
    traps: [
      trap(
        "added-the-difference",
        String(known + (want - per)),
        `You added the difference in quantity to the price. Going from ${per} to ${want} means ${want - per} more ${good}, and each one costs ${grouped(unitCost)}, not one naira. Find the cost of one first, then multiply.`,
        "L2-N3.2"
      ),
      trap(
        "divided-instead",
        String(Math.round(known / want)),
        `You divided the total by ${want} rather than by ${per}. The ${grouped(known)} is the cost of ${per}, so ${per} is the number that gets you to the cost of one.`,
        "L2-N3.2"
      ),
      trap("unit-only", String(unitCost), `That is the cost of one, which is the right first step. The question asks for ${want}, so multiply by ${want}.`, "L2-N3.2"),
    ],
    scaffold: [
      { ask: `What does ONE cost, in naira?`, answer: String(unitCost), input: num() },
      { ask: `So what do ${want} cost?`, answer: String(answer), input: num() },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L2-N3.3 · DIRECT AND INVERSE PROPORTION
   ═══════════════════════════════════════════════════════════════════════ */

generators["L2-N3.3"] = (r, tier) => {
  const inverse = r.chance(tier === "build" ? 0.45 : 0.55);

  /* ── Inverse: more workers, less time ─────────────────────────────── */
  if (inverse) {
    const workers = r.pick(byTier(tier, { build: [2, 3, 4], stretch: [4, 6, 8], exam: [6, 8, 9, 12] }));
    const days = r.pick(byTier(tier, { build: [6, 12, 24], stretch: [12, 18, 24, 36], exam: [24, 36, 48, 72] }));
    const workTotal = workers * days;
    const newWorkers = r.pick(
      [1, 2, 3, 4, 6, 8, 9, 12, 16, 18].filter((w) => w !== workers && workTotal % w === 0)
    ) || workers * 2;
    const newDays = workTotal / newWorkers;

    const wrongDirection = Math.round((days * newWorkers) / workers);

    return item({
      skill: "Inverse proportion",
      prompt: `${workers} workers can finish a job in ${days} days.\n\nWorking at the same rate, how many days would ${newWorkers} workers take?`,
      input: num({ placeholder: "days" }),
      answer: String(newDays),
      hints: [
        `Before calculating anything, decide the DIRECTION. There are ${newWorkers > workers ? "more" : "fewer"} workers, so the job should take ${newWorkers > workers ? "fewer" : "more"} days. Any answer going the other way is wrong before you check it.`,
        "This is inverse proportion: as one quantity goes up the other goes down, so the two multiplied together stay the same.",
        `${workers} × ${days} = ${workTotal} worker days of work. Divide that by ${newWorkers}.`,
      ],
      solution: [
        `The total work is fixed: ${workers} × ${days} = ${workTotal} worker days.`,
        `With ${newWorkers} workers: ${workTotal} ÷ ${newWorkers} = ${newDays} days.`,
        `Direction check: ${newWorkers > workers ? "more" : "fewer"} workers, ${newDays < days ? "fewer" : "more"} days. Correct.`,
      ],
      traps: [
        trap(
          "direct-not-inverse",
          String(wrongDirection),
          `You scaled in the same direction, as though more workers meant more days. Ask the direction question first: with ${newWorkers > workers ? "more" : "fewer"} workers the job must take ${newWorkers > workers ? "FEWER" : "MORE"} days, and your answer goes the other way. Inverse proportion means the two quantities multiply to a constant, so ${workers} × ${days} = ${newWorkers} × the answer.`,
          "L2-N3.3"
        ),
        trap(
          "kept-the-total",
          String(workTotal),
          `That is the total amount of work in worker days, which is the right middle step. Now divide it by the ${newWorkers} workers who are sharing it.`,
          "L2-N3.3"
        ),
      ],
      scaffold: [
        { ask: `With ${newWorkers > workers ? "more" : "fewer"} workers, will the job take more days or fewer? Type "more" or "fewer".`, answer: newWorkers > workers ? "fewer" : "more", input: { kind: "text" } },
        { ask: `How many worker days of work is the job? (${workers} × ${days})`, answer: String(workTotal), input: num() },
        { ask: `Shared between ${newWorkers} workers, how many days?`, answer: String(newDays), input: num() },
      ],
    });
  }

  /* ── Direct: more of one, more of the other ───────────────────────── */
  const qty = r.pick(byTier(tier, { build: [4, 5, 6], stretch: [6, 8, 9], exam: [8, 12, 15] }));
  const unitAmount = r.pick(byTier(tier, { build: [3, 5, 8], stretch: [7, 12, 15], exam: [14, 18, 25] }));
  const known = qty * unitAmount;
  const newQty = r.pick(byTier(tier, { build: [8, 10, 12], stretch: [15, 18, 24], exam: [20, 27, 36] }).filter((x) => x !== qty)) || qty * 2;
  const answer = newQty * unitAmount;

  return item({
    skill: "Direct proportion",
    prompt: `A recipe for ${qty} people needs ${known} cups of flour.\n\nHow many cups are needed for ${newQty} people, at the same rate?`,
    input: num({ placeholder: "cups" }),
    answer: String(answer),
    hints: [
      `Direction first: ${newQty > qty ? "more" : "fewer"} people means ${newQty > qty ? "more" : "less"} flour.`,
      "Find the amount for ONE person, then multiply up. That is the unitary method again.",
      `One person needs ${known} ÷ ${qty} = ${unitAmount} cups. Now multiply by ${newQty}.`,
    ],
    solution: [
      `One person: ${known} ÷ ${qty} = ${unitAmount} cups`,
      `${newQty} people: ${newQty} × ${unitAmount} = ${answer} cups`,
      `Direction check: ${newQty > qty ? "more" : "fewer"} people, ${answer > known ? "more" : "less"} flour. Correct.`,
    ],
    traps: [
      trap(
        "inverse-not-direct",
        String(Math.round((known * qty) / newQty)),
        `You scaled it the wrong way, as though more people needed less flour. Flour and people are in DIRECT proportion: double the people and you double the flour. Inverse proportion is for things like workers and time, where one going up pushes the other down.`,
        "L2-N3.3"
      ),
      trap(
        "added-the-difference",
        String(known + (newQty - qty)),
        `You added the extra number of people to the cups of flour. Each extra person needs ${unitAmount} cups, not one cup. Find the amount per person first.`,
        "L2-N3.3"
      ),
      trap("unit-only", String(unitAmount), `That is the flour for one person, which is the right first step. Multiply by ${newQty}.`, "L2-N3.3"),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L2-N3.4 · SPEED, DISTANCE AND TIME
   ═══════════════════════════════════════════════════════════════════════ */

generators["L2-N3.4"] = (r, tier) => {
  const speed = r.pick(byTier(tier, { build: [20, 40, 50, 60], stretch: [45, 65, 75, 80], exam: [35, 55, 85, 95] }));
  const hours = r.pick(byTier(tier, { build: [2, 3, 4], stretch: [3, 4, 5, 6], exam: [4, 6, 7, 8] }));
  const distance = speed * hours;
  const asked = r.pick(["speed", "distance", "time"]);
  const from = r.pick(["Lagos", "Ibadan", "Abuja", "Enugu", "Kano", "Benin City"]);

  if (asked === "speed") {
    return item({
      skill: "Finding speed from distance and time",
      prompt: `A bus travels ${distance} km from ${from} in ${hours} hours.\n\nFind its average speed in km/h.`,
      input: num({ placeholder: "km/h" }),
      answer: String(speed),
      hints: [
        "Speed is how far you go in one hour, so it is a distance divided by a time.",
        `Divide the ${distance} km by the ${hours} hours.`,
        `${distance} ÷ ${hours} = the speed in km per hour.`,
      ],
      solution: [
        `Speed = distance ÷ time`,
        `= ${distance} ÷ ${hours}`,
        `= ${speed} km/h`,
        `Check by going forwards: ${speed} × ${hours} = ${distance} km.`,
      ],
      traps: [
        trap(
          "multiplied",
          String(distance * hours),
          `You multiplied instead of dividing. Speed is a distance PER hour, and the word per is a division. Multiplying gives a number far larger than any bus travels, which is the check that catches this instantly.`,
          "L2-N3.4"
        ),
        trap(
          "divided-backwards",
          tidy(hours / distance, 4),
          `You divided the time by the distance. That gives hours per kilometre, which is a real quantity and not what was asked. Speed puts the distance on top.`,
          "L2-N3.4"
        ),
      ],
    });
  }

  if (asked === "distance") {
    return item({
      skill: "Finding distance from speed and time",
      prompt: `A car leaves ${from} at an average speed of ${speed} km/h and drives for ${hours} hours.\n\nHow far does it travel, in km?`,
      input: num({ placeholder: "km" }),
      answer: String(distance),
      hints: [
        `If it covers ${speed} km in one hour, how far in ${hours} hours?`,
        "Distance = speed × time.",
        `${speed} × ${hours} = the distance in km.`,
      ],
      solution: [
        `Distance = speed × time`,
        `= ${speed} × ${hours}`,
        `= ${distance} km`,
        `Check: ${distance} ÷ ${hours} = ${speed} km/h, the speed given.`,
      ],
      traps: [
        trap(
          "divided",
          tidy(speed / hours, 4),
          `You divided when this one multiplies. The car covers ${speed} km every hour for ${hours} hours, so the distances add up: ${hours} lots of ${speed}. Dividing gives an answer smaller than one hour's travel, which cannot be right.`,
          "L2-N3.4"
        ),
        trap("speed-copied", String(speed), `That is the distance covered in ONE hour. The journey lasted ${hours} hours.`, "L2-N3.4"),
      ],
    });
  }

  return item({
    skill: "Finding time from distance and speed",
    prompt: `A journey from ${from} is ${distance} km. A driver averages ${speed} km/h.\n\nHow long does the journey take, in hours?`,
    input: num({ placeholder: "hours" }),
    answer: String(hours),
    hints: [
      `Each hour uses up ${speed} km of the journey. How many hours to use up ${distance} km?`,
      "Time = distance ÷ speed.",
      `${distance} ÷ ${speed} = the time in hours.`,
    ],
    solution: [
      `Time = distance ÷ speed`,
      `= ${distance} ÷ ${speed}`,
      `= ${hours} hours`,
      `Check: ${speed} × ${hours} = ${distance} km.`,
    ],
    traps: [
      trap(
        "multiplied",
        String(distance * speed),
        `You multiplied instead of dividing. The question asks how many lots of ${speed} km fit into ${distance} km, and that is a division. The answer you got is more hours than there are in a year.`,
        "L2-N3.4"
      ),
      trap(
        "divided-backwards",
        tidy(speed / distance, 4),
        `You divided the speed by the distance. The distance is what is being used up, so it goes on top: distance ÷ speed.`,
        "L2-N3.4"
      ),
    ],
    scaffold: [
      { ask: `How many km does the driver cover in one hour?`, answer: String(speed), input: num() },
      { ask: `So how many hours to cover ${distance} km?`, answer: String(hours), input: num() },
    ],
  });
};

export default generators;
