/**
 * MATHEMATICS · MONTH 10 · MODULE 39 · CALCULUS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s39-calculus";

export const LESSONS = [
  {
    id: "ma-l6-c2",
    moduleId: "ma-39-calculus",
    sectionId: SECTION_ID,
    skillGroup: "L6-C2",
    order: 1,
    title: "Differentiation",
    subtitle: "The gradient of a curve",
    estimatedMinutes: 60,
    intro: "A straight line has one gradient. A curve's gradient changes from point to point. DIFFERENTIATION finds a formula for it, the DERIVATIVE dy/dx, and that formula finds speeds, maxima and minima.",

    atoms: [
      {
        id: "a-ma-l6-c2-1",
        title: "Limits",
        explain: "The LIMIT of an expression as x → a is the value it approaches as x gets closer and closer to a. If substituting gives 0/0, factorise and cancel first, then substitute.",
        example: "  limit as x → 3 of (x² − 9)/(x − 3)\n    = limit of (x − 3)(x + 3)/(x − 3)\n    = limit of (x + 3) = 6",
        mistake: "Writing 0/0 = 0. 0/0 has no value; it is a signal to simplify.",
        drill: { skill: "L6-C2.1", count: 3 },
      },
      {
        id: "a-ma-l6-c2-2",
        title: "First principles",
        explain: "The gradient between x and x + h is [f(x + h) − f(x)]/h. Let h → 0: the result is the DERIVATIVE f'(x) = dy/dx.",
        example: "  y = x²\n    f(x + h) − f(x) = 2xh + h²\n    ÷ h: 2x + h\n    h → 0: dy/dx = 2x",
        mistake: "Letting h = 0 before dividing. That gives 0/0 again.",
        drill: { skill: "L6-C2.2", count: 3 },
      },
      {
        id: "a-ma-l6-c2-3",
        title: "The power rule",
        explain: "d/dx (axⁿ) = naxⁿ⁻¹: bring the power down, reduce it by one. Differentiate term by term. A constant gives 0. The gradient at a point: differentiate, then substitute.",
        table: [
          ["y", "dy/dx"],
          ["x³", "3x²"],
          ["5x²", "10x"],
          ["7x", "7"],
          ["4", "0"],
          ["x⁻¹", "−x⁻²"],
        ],
        example: "  y = 2x³ − 5x² + 3x − 8\n    dy/dx = 6x² − 10x + 3\n    at x = 2: 24 − 20 + 3 = 7",
        mistake: "Substituting into y instead of dy/dx when asked for a gradient.",
        drill: { skill: "L6-C2.3", count: 4 },
      },
      {
        id: "a-ma-l6-c2-4",
        title: "Sine, cosine and tangent",
        explain: "Calculus measures angles in RADIANS, where π radians = 180° (so π/2 = 90°); Module 41 covers them fully. With x in radians: d/dx sin x = cos x; d/dx cos x = −sin x; d/dx tan x = sec² x. For sin kx, multiply by k: d/dx sin kx = k cos kx.",
        example: "  y = 3 sin x − 2 cos x\n    dy/dx = 3 cos x + 2 sin x",
        mistake: "Dropping the minus: cos differentiates to MINUS sin.",
        drill: { skill: "L6-C2.4", count: 3 },
      },
      {
        id: "a-ma-l6-c2-5",
        title: "Rates of change",
        explain: "dy/dx is the rate of change of y with x. For motion: velocity v = ds/dt, acceleration a = dv/dt. The particle is momentarily at rest when v = 0.",
        example: "  s = t³ − 6t² + 9t\n    v = 3t² − 12t + 9, at t = 4: v = 9 m/s\n    a = 6t − 12, at t = 4: a = 12 m/s²",
        mistake: "Giving s when v is asked. Differentiate once for velocity, twice for acceleration.",
        drill: { skill: "L6-C2.5", count: 3 },
      },
      {
        id: "a-ma-l6-c2-6",
        title: "Maxima and minima",
        explain: "At a TURNING POINT, dy/dx = 0. Use the second derivative d²y/dx² to decide: negative → MAXIMUM, positive → MINIMUM. For an optimisation problem, write the quantity in one variable, differentiate, and set it to 0.",
        example: "  y = x³ − 3x\n    dy/dx = 3x² − 3 = 0  →  x = ±1\n    d²y/dx² = 6x: at x = −1 it is −6, a maximum, y = 2\n                  at x = 1 it is 6, a minimum, y = −2",
        mistake: "Stopping at x. A question about the maximum VALUE wants y.",
        drill: { skill: "L6-C2.6", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-c3",
    moduleId: "ma-39-calculus",
    sectionId: SECTION_ID,
    skillGroup: "L6-C3",
    order: 2,
    title: "Integration",
    subtitle: "Differentiation backwards, and area",
    estimatedMinutes: 50,
    intro: "INTEGRATION reverses differentiation. If dy/dx = 2x, then y = x² + c, where c is any constant, because every constant differentiates to 0.",

    atoms: [
      {
        id: "a-ma-l6-c3-1",
        title: "Integrating polynomials",
        explain: "∫ xⁿ dx = xⁿ⁺¹/(n + 1) + c, for n ≠ −1: raise the power by one, divide by the new power. Integrate term by term. Always add + c, the CONSTANT OF INTEGRATION.",
        example: "  ∫ (6x² − 4x + 5) dx = 2x³ − 2x² + 5x + c\n  Check: differentiate back to 6x² − 4x + 5 ✓",
        mistake: "Leaving out + c. Without it, the answer is only one of infinitely many.",
        drill: { skill: "L6-C3.1", count: 3 },
      },
      {
        id: "a-ma-l6-c3-2",
        title: "Definite integrals",
        explain: "∫ from a to b of f(x) dx = F(b) − F(a), where F is the integral of f. Write F in square brackets with the limits, then substitute top minus bottom. No + c: it cancels.",
        example: "  ∫ from 1 to 3 of 3x² dx = [x³] from 1 to 3 = 27 − 1 = 26",
        mistake: "Subtracting the wrong way round: it is top limit minus bottom limit.",
        drill: { skill: "L6-C3.2", count: 3 },
      },
      {
        id: "a-ma-l6-c3-3",
        title: "Area under a curve",
        explain: "The area between y = f(x), the x-axis, and x = a to x = b is ∫ from a to b of f(x) dx when the curve is ABOVE the axis. Below the axis the integral is negative: take its size. If the curve crosses the axis, split the integral at the crossing.",
        example: "  y = x² − 4 between its roots −2 and 2:\n    ∫ = [x³/3 − 4x] from −2 to 2 = −32/3\n    area = 32/3",
        mistake: "Integrating straight across a crossing point. The positive and negative parts cancel.",
        drill: { skill: "L6-C3.3", count: 3 },
      },
      {
        id: "a-ma-l6-c3-4",
        title: "Integrating sine and cosine",
        explain: "∫ cos x dx = sin x + c. ∫ sin x dx = −cos x + c. Check by differentiating.",
        example: "  ∫ from 0 to π/2 of cos x dx = [sin x] = 1 − 0 = 1",
        mistake: "Writing ∫ sin x dx = cos x. Differentiating cos x gives −sin x, so the integral needs the minus.",
        drill: { skill: "L6-C3.4", count: 3 },
      },
      {
        id: "a-ma-review-39",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L6-A1.2", "L6-A1.3", "L6-S1.2", "L6-S1.3", "L6-G2.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
