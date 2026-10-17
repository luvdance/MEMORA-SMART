/**
 * ASSESSMENTS · MATHEMATICS · MODULE 3 · FACTORS, PRIMES AND FRACTIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l0-n3": {
    lessonId: "ma-l0-n3",
    passMark: 70,
    questions: [
      {
        id: "ma03-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-n3-1",
        prompt: "Which list gives ALL the factors of 28?",
        options: [
          { id: "a", text: "1, 2, 4, 7, 14, 28" },
          { id: "b", text: "2, 4, 7, 14" },
          { id: "c", text: "1, 2, 4, 14, 28" },
          { id: "d", text: "28, 56, 84, 112" },
        ],
        correct: "a",
        explanation: "Pairs: 1 × 28, 2 × 14, 4 × 7. That is six factors: 1, 2, 4, 7, 14, 28.",
        whyWrong: {
          b: "1 and 28 are factors of 28 too. Every number has 1 and itself as factors.",
          c: "7 is missing. It is the partner of 4: 4 × 7 = 28.",
          d: "Those are multiples of 28, not factors.",
        },
      },
      {
        id: "ma03-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-n3-2",
        prompt: "Which of these is a multiple of 9?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "93" },
          { id: "c", text: "108" },
          { id: "d", text: "19" },
        ],
        correct: "c",
        explanation: "108 = 9 × 12. Its digit sum is 1 + 0 + 8 = 9, which confirms it.",
        whyWrong: {
          a: "3 is a factor of 9, not a multiple. Multiples of 9 are 9, 18, 27, ...",
          b: "93 has digit sum 12, which does not divide by 9. 93 = 9 × 10 + 3.",
          d: "19 ends in 9 but is not in the 9 times table: 9 × 2 = 18.",
        },
      },
      {
        id: "ma03-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n3-3",
        prompt: "Which of these numbers is prime?",
        options: [
          { id: "a", text: "51" },
          { id: "b", text: "57" },
          { id: "c", text: "1" },
          { id: "d", text: "59" },
        ],
        correct: "d",
        explanation: "59 is not divisible by 2, 3, 5 or 7, and 11 × 11 = 121 is bigger than 59, so there is nothing left to test. 59 is prime.",
        whyWrong: {
          a: "51 = 3 × 17. Its digit sum is 6, so 3 divides it.",
          b: "57 = 3 × 19. Its digit sum is 12, so 3 divides it.",
          c: "1 has only one factor. A prime must have exactly two.",
        },
      },
      {
        id: "ma03-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n3-4",
        prompt: "Is 4 734 divisible by 6?",
        options: [
          { id: "a", text: "Yes: it is even and its digit sum, 18, divides by 3" },
          { id: "b", text: "No: it does not end in 6" },
          { id: "c", text: "No: its last two digits, 34, do not divide by 6" },
          { id: "d", text: "Yes: it is even, and that is enough" },
        ],
        correct: "a",
        explanation: "Divisible by 6 means divisible by 2 AND by 3. 4 734 is even, and 4 + 7 + 3 + 4 = 18. So yes: 4 734 = 6 × 789.",
        whyWrong: {
          b: "There is no 'ends in 6' rule for 6. 12, 18 and 24 are all multiples of 6.",
          c: "The last-two-digits rule is for 4, not 6.",
          d: "Even only shows divisibility by 2. It must pass the test for 3 as well.",
        },
      },
      {
        id: "ma03-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n3-3",
        prompt: "How many prime numbers are there between 20 and 40?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "10" },
        ],
        correct: "b",
        explanation: "The primes between 20 and 40 are 23, 29, 31 and 37: 4 primes.",
        whyWrong: {
          a: "One is missing. Check each of 23, 29, 31 and 37.",
          c: "One of your five is not prime. 21 = 3 × 7, 27 = 3 × 9, 33 = 3 × 11, 39 = 3 × 13.",
          d: "That counts the odd numbers. Odd is not the same as prime.",
        },
      },
    ],
  },

  "ma-l0-n4": {
    lessonId: "ma-l0-n4",
    passMark: 70,
    questions: [
      {
        id: "ma03-11",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-n4-1",
        prompt: "A bar is cut into 8 equal parts and 3 are shaded. What fraction is NOT shaded?",
        options: [
          { id: "a", text: "3/8" },
          { id: "b", text: "5/8" },
          { id: "c", text: "5/3" },
          { id: "d", text: "3/5" },
        ],
        correct: "b",
        explanation: "8 equal parts, 3 shaded, so 8 − 3 = 5 are not shaded: 5/8.",
        whyWrong: {
          a: "That is the shaded part. The question asks for the part NOT shaded.",
          c: "The denominator is the number of equal parts in the whole: 8.",
          d: "That compares shaded to unshaded. A fraction of the bar is out of all 8 parts.",
        },
      },
      {
        id: "ma03-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n4-2",
        prompt: "Simplify 24/36 to its lowest terms.",
        options: [
          { id: "a", text: "12/18" },
          { id: "b", text: "2/3" },
          { id: "c", text: "4/6" },
          { id: "d", text: "3/2" },
        ],
        correct: "b",
        explanation: "The biggest number dividing 24 and 36 is 12. 24 ÷ 12 = 2 and 36 ÷ 12 = 3, giving 2/3.",
        whyWrong: {
          a: "Equivalent, but not lowest terms: 12 and 18 still share 6.",
          c: "Equivalent, but not lowest terms: 4 and 6 still share 2.",
          d: "That turned the fraction upside down. 24/36 is less than 1.",
        },
      },
      {
        id: "ma03-13",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n4-2",
        prompt: "Find the missing number:  3/5 = ?/40",
        options: [
          { id: "a", text: "38" },
          { id: "b", text: "8" },
          { id: "c", text: "24" },
          { id: "d", text: "15" },
        ],
        correct: "c",
        explanation: "5 × 8 = 40, so multiply the top by 8 too: 3 × 8 = 24.",
        whyWrong: {
          a: "That added 35 to the top because 5 + 35 = 40. You must multiply, not add.",
          b: "8 is what the denominator was multiplied by. Multiply the numerator by it too.",
          d: "That multiplies 3 by 5. The bottom was multiplied by 8, so the top must be too.",
        },
      },
      {
        id: "ma03-14",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n4-3",
        prompt: "Which fraction is the largest?",
        options: [
          { id: "a", text: "2/3" },
          { id: "b", text: "3/5" },
          { id: "c", text: "5/8" },
          { id: "d", text: "7/12" },
        ],
        correct: "a",
        explanation: "Over 120: 2/3 = 80/120, 3/5 = 72/120, 5/8 = 75/120, 7/12 = 70/120. The largest is 2/3.",
        whyWrong: {
          b: "3/5 = 72/120, less than 2/3 = 80/120.",
          c: "5/8 = 75/120, less than 2/3 = 80/120.",
          d: "7/12 has the biggest numbers, but 7/12 = 70/120 is actually the smallest.",
        },
      },
      {
        id: "ma03-15",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n4-4",
        prompt: "What is 3/4 of ₦3 600?",
        options: [
          { id: "a", text: "₦900" },
          { id: "b", text: "₦1 200" },
          { id: "c", text: "₦2 700" },
          { id: "d", text: "₦4 800" },
        ],
        correct: "c",
        explanation: "One quarter: 3 600 ÷ 4 = 900. Three quarters: 900 × 3 = ₦2 700.",
        whyWrong: {
          a: "That is 1/4. Multiply by the numerator, 3.",
          b: "That divides by 3, the numerator. Divide by the denominator, 4.",
          d: "That divides by 3 and multiplies by 4: the fraction was used upside down.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
