/**
 * MATHEMATICS · MONTH 7 · MODULE 27 · SETS AND LOGICAL REASONING
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s27-sets-logic";

export const LESSONS = [
  {
    id: "ma-l4-n5",
    moduleId: "ma-27-sets-logic",
    sectionId: SECTION_ID,
    skillGroup: "L4-N5",
    order: 1,
    title: "Sets",
    subtitle: "Notation, operations and Venn diagrams",
    estimatedMinutes: 45,
    intro: "A set is a well-defined collection of objects. Venn diagrams turn worded 'how many' problems into a picture where each region is one simple number.",

    atoms: [
      {
        id: "a-ma-l4-n5-1",
        title: "Set notation and types of sets",
        explain:
          "A SET is a collection of distinct objects, its ELEMENTS. x ∈ A means x is an element of A. n(A) is the number of elements. The UNIVERSAL set U contains everything under discussion. The EMPTY set ∅ has no elements. A ⊂ B means A is a SUBSET of B: every element of A is in B. A set with n elements has 2ⁿ subsets.",
        table: {
          caption: "The symbols.",
          headers: ["Symbol", "Meaning"],
          rows: [
            ["∈, ∉", "is / is not an element of"],
            ["n(A)", "number of elements of A"],
            ["U (or ℰ)", "universal set"],
            ["∅ or { }", "empty set"],
            ["A ⊂ B", "A is a subset of B"],
          ],
        },
        example: "  A = {x : x is a prime number less than 12} = {2, 3, 5, 7, 11},  n(A) = 5\n  Subsets of {a, b}: ∅, {a}, {b}, {a, b}   →  2² = 4",
        mistake: "Forgetting ∅ and the set itself when listing subsets. Both always count.",
        drill: { skill: "L4-N5.1", count: 4 },
      },
      {
        id: "a-ma-l4-n5-2",
        title: "Union, intersection and complement",
        explain:
          "A ∪ B (UNION): every element in A or B or both. A ∩ B (INTERSECTION): only the elements in BOTH. A′ (COMPLEMENT): every element of U that is NOT in A. Sets with no common elements are DISJOINT: A ∩ B = ∅.",
        example: "  U = {1, ..., 10}, A = {2, 4, 6, 8}, B = {1, 2, 3, 4}\n    A ∪ B = {1, 2, 3, 4, 6, 8}\n    A ∩ B = {2, 4}\n    A′ = {1, 3, 5, 7, 9, 10}\n    A ∩ B′ = {6, 8}",
        mistake: "Swapping ∪ and ∩. ∪ (cup) collects everything; ∩ (cap) keeps only what is shared.",
        drill: { skill: "L4-N5.2", count: 4 },
      },
      {
        id: "a-ma-l4-n5-3",
        title: "Two-set Venn problems",
        explain:
          "Draw two overlapping circles inside a rectangle for U. Fill the overlap first, then each 'only' region, then the outside. The key formula: n(A ∪ B) = n(A) + n(B) − n(A ∩ B), because the overlap is counted twice.",
        example:
          "  40 students: 25 play football, 18 basketball, 7 neither.\n    play at least one: 40 − 7 = 33\n    both: 25 + 18 − 33 = 10\n    football only: 25 − 10 = 15,  basketball only: 18 − 10 = 8\n    Check: 15 + 10 + 8 + 7 = 40 ✓",
        mistake: "Writing 25 in the football circle and 18 in the basketball circle without first subtracting the overlap.",
        drill: { skill: "L4-N5.3", count: 4 },
      },
      {
        id: "a-ma-l4-n5-4",
        title: "Three-set Venn problems",
        explain:
          "With three circles there are eight regions. Fill from the centre outward: all three first, then each pair-only region (pair total minus the centre), then each single-only region, then outside. Or use n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(A∩C) − n(B∩C) + n(A∩B∩C).",
        example: "  M = 20, P = 18, C = 15; M∩P = 8, M∩C = 6, P∩C = 5; all three = 3\n    M∩P only = 5, M∩C only = 3, P∩C only = 2\n    M only = 20 − 5 − 3 − 3 = 9\n    At least one = 20 + 18 + 15 − 8 − 6 − 5 + 3 = 37",
        mistake: "Subtracting the 'all three' number more than once from a single circle.",
        drill: { skill: "L4-N5.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-n6",
    moduleId: "ma-27-sets-logic",
    sectionId: SECTION_ID,
    skillGroup: "L4-N6",
    order: 2,
    title: "Logical Reasoning",
    subtitle: "Statements, negation, implication and valid arguments",
    estimatedMinutes: 35,
    intro: "Logic is the mathematics of correct reasoning. It decides whether a conclusion really follows from what you were told, or only seems to.",

    atoms: [
      {
        id: "a-ma-l4-n6-1",
        title: "Statements",
        explain: "A STATEMENT (proposition) is a sentence that is either true or false, but not both. Questions, commands and exclamations are not statements. Statements are often named with letters: p, q.",
        example: "  'Abuja is the capital of Nigeria.'  statement, true\n  '5 is an even number.'             statement, false\n  'Shut the door.'                   not a statement",
        mistake: "Calling a false sentence 'not a statement'. A false statement is still a statement.",
        drill: { skill: "L4-N6.1", count: 3 },
      },
      {
        id: "a-ma-l4-n6-2",
        title: "Negation",
        explain: "The NEGATION of p, written ~p, is true exactly when p is false. Negating 'all' gives 'some ... not'; negating 'some' gives 'no'.",
        table: {
          caption: "Negating quantified statements.",
          headers: ["p", "~p"],
          rows: [
            ["All boys are tall.", "Some boys are not tall."],
            ["Some boys are tall.", "No boy is tall."],
            ["No boy is tall.", "Some boys are tall."],
          ],
        },
        mistake: "Negating 'All boys are tall' as 'No boy is tall'. One short boy is enough to make the original false.",
        drill: { skill: "L4-N6.2", count: 3 },
      },
      {
        id: "a-ma-l4-n6-3",
        title: "Implication, converse and contrapositive",
        explain:
          "p ⇒ q means 'if p then q'. Its CONVERSE is q ⇒ p; its INVERSE is ~p ⇒ ~q; its CONTRAPOSITIVE is ~q ⇒ ~p. Only the contrapositive is always equivalent to the original. p ⇔ q means both p ⇒ q and q ⇒ p.",
        example:
          "  p ⇒ q:          If it rains, the ground is wet.\n  converse:       If the ground is wet, it rained.        (not always true)\n  contrapositive: If the ground is not wet, it did not rain. (always true)",
        mistake: "Assuming the converse is true. Wet ground could come from a burst pipe.",
        drill: { skill: "L4-N6.3", count: 3 },
      },
      {
        id: "a-ma-l4-n6-4",
        title: "Testing arguments with Venn diagrams",
        explain: "Draw each premise as circles: 'All A are B' puts circle A inside B; 'No A are B' keeps them apart; 'Some A are B' overlaps them. An argument is VALID only if every diagram that fits the premises also forces the conclusion.",
        example:
          "  All doctors are graduates. Ada is a doctor.  →  Ada is a graduate.   VALID\n  All doctors are graduates. Ada is a graduate. →  Ada is a doctor.     NOT VALID\n  (Ada can sit in the graduates circle outside the doctors circle.)",
        mistake: "Accepting a conclusion because it might be true. Valid means it MUST be true.",
        drill: { skill: "L4-N6.4", count: 3 },
      },
      {
        id: "a-ma-review-27",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L4-N3.2", "L4-N3.5", "L4-N4.1", "L4-N4.4", "L4-N2.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
