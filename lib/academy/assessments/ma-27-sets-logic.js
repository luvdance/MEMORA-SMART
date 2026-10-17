/**
 * ASSESSMENTS · MATHEMATICS · MODULE 27 · SETS AND LOGICAL REASONING
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-n5": {
    lessonId: "ma-l4-n5",
    passMark: 70,
    questions: [
      {
        id: "ma27-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-n5-1",
        prompt: "How many subsets does the set {p, q, r, s} have?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "16" },
          { id: "c", text: "4" },
          { id: "d", text: "15" },
        ],
        correct: "b",
        explanation: "A set with n elements has 2ⁿ subsets: 2⁴ = 16.",
        whyWrong: {
          a: "That is 2 × 4. It is 2 to the POWER 4.",
          c: "That counts the one-element subsets only.",
          d: "That is the number of PROPER subsets, 2⁴ − 1.",
        },
      },
      {
        id: "ma27-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n5-2",
        prompt: "U = {1, 2, ..., 9}, A = {1, 3, 5, 7, 9} and B = {3, 6, 9}. Find A′ ∩ B.",
        options: [
          { id: "a", text: "{6}" },
          { id: "b", text: "{3, 9}" },
          { id: "c", text: "{2, 4, 6, 8}" },
          { id: "d", text: "{1, 5, 7}" },
        ],
        correct: "a",
        explanation: "A′ = {2, 4, 6, 8}. The only element of that also in B is 6.",
        whyWrong: {
          b: "That is A ∩ B. The question uses A′, the complement of A.",
          c: "That is A′ alone. Intersect it with B.",
          d: "That is A ∩ B′.",
        },
      },
      {
        id: "ma27-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n5-3",
        prompt: "In a class of 50, 30 take French and 26 take Hausa. 8 take neither. How many take both?",
        options: [
          { id: "a", text: "14" },
          { id: "b", text: "6" },
          { id: "c", text: "22" },
          { id: "d", text: "12" },
        ],
        correct: "a",
        explanation: "Take at least one: 50 − 8 = 42. Both = 30 + 26 − 42 = 14.",
        whyWrong: {
          b: "That forgets the 8 who take neither: 30 + 26 − 50 = 6.",
          c: "That is 30 − 8. Use n(F ∪ H) = n(F) + n(H) − n(F ∩ H).",
          d: "12 take Hausa ONLY (26 − 14). The question asks for those taking both.",
        },
      },
      {
        id: "ma27-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-n5-4",
        prompt: "n(A) = 15, n(B) = 12, n(C) = 10, n(A∩B) = 5, n(A∩C) = 4, n(B∩C) = 3, n(A∩B∩C) = 2. Find n(A ∪ B ∪ C).",
        options: [
          { id: "a", text: "27" },
          { id: "b", text: "25" },
          { id: "c", text: "37" },
          { id: "d", text: "29" },
        ],
        correct: "a",
        explanation: "15 + 12 + 10 − 5 − 4 − 3 + 2 = 27.",
        whyWrong: {
          b: "That forgets to add back the 2 in all three sets.",
          c: "That just adds the three sets, counting overlaps several times.",
          d: "That adds the triple overlap twice.",
        },
      },
    ],
  },

  "ma-l4-n6": {
    lessonId: "ma-l4-n6",
    passMark: 70,
    questions: [
      {
        id: "ma27-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-n6-1",
        prompt: "Which of these is a statement?",
        options: [
          { id: "a", text: "Please sit down." },
          { id: "b", text: "Is 9 a square number?" },
          { id: "c", text: "9 is a prime number." },
          { id: "d", text: "What a lovely day!" },
        ],
        correct: "c",
        explanation: "'9 is a prime number' is either true or false (it is false), so it is a statement.",
        whyWrong: {
          a: "A command cannot be true or false.",
          b: "A question cannot be true or false.",
          d: "An exclamation cannot be true or false.",
        },
      },
      {
        id: "ma27-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n6-2",
        prompt: "What is the negation of 'All the students passed'?",
        options: [
          { id: "a", text: "No student passed." },
          { id: "b", text: "Some students did not pass." },
          { id: "c", text: "All the students failed." },
          { id: "d", text: "Some students passed." },
        ],
        correct: "b",
        explanation: "The negation is true exactly when 'all passed' is false, which needs only one student to fail.",
        whyWrong: {
          a: "That goes too far. One failure is enough to make 'all passed' false.",
          c: "That is a much stronger claim than the negation.",
          d: "That can be true at the same time as 'all passed', so it is not the negation.",
        },
      },
      {
        id: "ma27-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n6-3",
        prompt: "Which statement is equivalent to 'If a shape is a square, then it has four sides'?",
        options: [
          { id: "a", text: "If a shape has four sides, then it is a square." },
          { id: "b", text: "If a shape is not a square, then it does not have four sides." },
          { id: "c", text: "If a shape does not have four sides, then it is not a square." },
          { id: "d", text: "A shape has four sides only if it is a square." },
        ],
        correct: "c",
        explanation: "The contrapositive ~q ⇒ ~p is always equivalent to p ⇒ q.",
        whyWrong: {
          a: "That is the converse. A rectangle has four sides but is not a square.",
          b: "That is the inverse. A rectangle is not a square but has four sides.",
          d: "That says 'four sides ⇒ square', the converse again.",
        },
      },
      {
        id: "ma27-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-n6-4",
        prompt: "All mechanics are skilled. Musa is skilled. Therefore Musa is a mechanic. Is this argument valid?",
        options: [
          { id: "a", text: "Valid, because Musa is skilled" },
          { id: "b", text: "Not valid, because Musa could be skilled without being a mechanic" },
          { id: "c", text: "Valid, because all mechanics are skilled" },
          { id: "d", text: "Not valid, because some mechanics are not skilled" },
        ],
        correct: "b",
        explanation: "In the Venn diagram, Musa can sit in the 'skilled' circle but outside the 'mechanics' circle. The conclusion is not forced.",
        whyWrong: {
          a: "Being skilled does not place Musa inside the mechanics circle.",
          c: "That premise tells you about mechanics, not about every skilled person.",
          d: "The premise says ALL mechanics are skilled. The argument fails for a different reason.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
