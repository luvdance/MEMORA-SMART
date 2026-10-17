/**
 * MATHEMATICS · MONTH 8 · MODULE 31 · SEQUENCES, SERIES AND FINANCIAL ARITHMETIC
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s31-sequences-finance";

export const LESSONS = [
  {
    id: "ma-l5-n1",
    moduleId: "ma-31-sequences-finance",
    sectionId: SECTION_ID,
    skillGroup: "L5-N1",
    order: 1,
    title: "Sequences and Series",
    subtitle: "Arithmetic and geometric progressions, their sums, and sum to infinity",
    estimatedMinutes: 50,
    intro: "A PROGRESSION is a sequence with a fixed rule: add the same number each time (arithmetic), or multiply by the same number (geometric). A SERIES is the sum of its terms.",

    atoms: [
      {
        id: "a-ma-l5-n1-1",
        title: "Finding a pattern",
        explain: "In an ARITHMETIC PROGRESSION (AP) the difference between consecutive terms is constant: the COMMON DIFFERENCE d. In a GEOMETRIC PROGRESSION (GP) the ratio is constant: the COMMON RATIO r = any term ÷ the one before.",
        example: "  3, 7, 11, 15, ...     differences 4, 4, 4      AP, d = 4\n  2, 6, 18, 54, ...     ratios 3, 3, 3           GP, r = 3\n  1, 2, 4, 7, ...       neither",
        mistake: "Checking only the first pair. Check every consecutive pair before naming the type.",
        drill: { skill: "L5-N1.1", count: 3 },
      },
      {
        id: "a-ma-l5-n1-2",
        title: "Arithmetic progressions",
        explain: "The nth term of an AP with first term a and common difference d is Tₙ = a + (n − 1)d. Use it to find any term, to find which term has a given value, or, with two known terms, to find a and d.",
        example: "  5, 8, 11, ...:  T₂₀ = 5 + 19 × 3 = 62\n  Which term is 95?  5 + (n − 1)3 = 95 → n − 1 = 30 → n = 31\n  T₃ = 10 and T₇ = 22:  4d = 12 → d = 3, a = 4",
        mistake: "Using nd instead of (n − 1)d. The first term has no difference added.",
        drill: { skill: "L5-N1.2", count: 4 },
      },
      {
        id: "a-ma-l5-n1-3",
        title: "Sum of an AP",
        explain: "Sₙ = n/2 [2a + (n − 1)d], or, if the last term l is known, Sₙ = n/2 (a + l). Gauss found the idea at school: pair the first and last terms; every pair has the same sum.",
        example: "  1 + 2 + ... + 100 = 100/2 × (1 + 100) = 5 050\n  First 20 terms of 3, 7, 11, ...:  S = 10 × [6 + 19 × 4] = 820",
        mistake: "Giving the nth TERM when asked for the SUM.",
        drill: { skill: "L5-N1.3", count: 4 },
      },
      {
        id: "a-ma-l5-n1-4",
        title: "Geometric progressions",
        explain: "The nth term of a GP is Tₙ = arⁿ⁻¹. The sum of the first n terms is Sₙ = a(rⁿ − 1)/(r − 1), or a(1 − rⁿ)/(1 − r) when r < 1.",
        example: "  3, 6, 12, ...:  T₈ = 3 × 2⁷ = 384\n  S₈ = 3(2⁸ − 1)/(2 − 1) = 765",
        mistake: "Using rⁿ in the nth term. It is r to the power n − 1.",
        drill: { skill: "L5-N1.4", count: 4 },
      },
      {
        id: "a-ma-l5-n1-5",
        title: "Sum to infinity and word problems",
        explain: "When −1 < r < 1, the terms of a GP shrink towards 0 and the sum settles to a limit: S∞ = a/(1 − r). Word problems about yearly increases by a fixed amount are APs; increases by a fixed percentage are GPs.",
        example: "  8 + 4 + 2 + 1 + ...:  S∞ = 8/(1 − ½) = 16\n  Salary ₦50 000, rising ₦5 000 a year: an AP with a = 50 000, d = 5 000",
        mistake: "Using S∞ when r is 2 or −3. The sum to infinity exists only if −1 < r < 1.",
        drill: { skill: "L5-N1.5", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-n2",
    moduleId: "ma-31-sequences-finance",
    sectionId: SECTION_ID,
    skillGroup: "L5-N2",
    order: 2,
    title: "Financial Arithmetic",
    subtitle: "Compound interest, depreciation, annuities, shares and bonds",
    estimatedMinutes: 45,
    intro: "Money that grows or shrinks by a fixed percentage each period is a geometric progression. That one idea gives compound interest, depreciation and annuities.",

    atoms: [
      {
        id: "a-ma-l5-n2-1",
        title: "Compound interest by formula",
        explain: "After n years at R% compound interest, the amount is A = P(1 + R/100)ⁿ. Compound interest = A − P.",
        example: "  ₦200 000 at 10% for 3 years:\n    A = 200 000 × 1.1³ = 266 200\n    CI = ₦66 200",
        mistake: "Using simple interest, P × R × n/100. Compound interest earns interest on interest.",
        drill: { skill: "L5-N2.1", count: 3 },
      },
      {
        id: "a-ma-l5-n2-2",
        title: "Depreciation",
        explain: "DEPRECIATION is loss of value over time. With reducing balance at R% a year, the value after n years is V = P(1 − R/100)ⁿ.",
        example: "  A car bought for ₦4 000 000 loses 20% a year.\n    After 3 years: 4 000 000 × 0.8³ = ₦2 048 000",
        mistake: "Taking 20% of the ORIGINAL price every year. Each year's loss is a percentage of the current value.",
        drill: { skill: "L5-N2.2", count: 3 },
      },
      {
        id: "a-ma-l5-n2-3",
        title: "Amortisation and annuities",
        explain:
          "An ANNUITY is a series of equal payments at regular intervals. If P is paid at the end of each year for n years at rate i (as a decimal), the amount is P[(1 + i)ⁿ − 1]/i. AMORTISATION repays a loan L by equal instalments: each instalment = L × i/(1 − (1 + i)⁻ⁿ).",
        example: "  ₦100 000 a year for 3 years at 10%:\n    100 000 × (1.1³ − 1)/0.1 = ₦331 000\n    (100 000 × 1.21 + 100 000 × 1.1 + 100 000)",
        mistake: "Adding the payments without interest. Each earlier payment has been earning interest.",
        drill: { skill: "L5-N2.3", count: 3 },
      },
      {
        id: "a-ma-l5-n2-4",
        title: "Shares, bonds and the capital market",
        explain:
          "A SHARE is a part-ownership of a company, with a NOMINAL (face) value. A DIVIDEND is a percentage of the nominal value paid to shareholders. The YIELD is the dividend as a percentage of the price actually paid. A BOND is a loan to a government or company that pays fixed interest on its face value.",
        example: "  500 ₦2 shares, 10% dividend: 10% of ₦1 000 = ₦100\n  Bought at ₦4 each: yield = 0.20 ÷ 4 × 100 = 5%",
        mistake: "Working the dividend on the market price. The dividend rate applies to the NOMINAL value.",
        drill: { skill: "L5-N2.4", count: 3 },
      },
      {
        id: "a-ma-l5-n2-5",
        title: "Dividends, tax and VAT",
        explain: "Real payments have deductions: WITHHOLDING TAX is taken off dividends before they are paid, and VAT at 7.5% is added to the price of goods and services.",
        example: "  Gross dividend ₦5 000, withholding tax 10%: net ₦4 500\n  Price ₦80 000 + 7.5% VAT: VAT ₦6 000, total ₦86 000",
        mistake: "Forgetting the deduction and quoting the gross dividend as what the investor receives.",
        drill: { skill: "L5-N2.5", count: 3 },
      },
      {
        id: "a-ma-review-31",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L4-T1.1", "L4-S1.2", "L4-G3.1", "L3-N2.1", "L2-N2.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
