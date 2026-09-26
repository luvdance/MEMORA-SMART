/**
 * ASSESSMENTS · MATHEMATICS · MONTH 2 · MODULE 4 · FACTORS, MULTIPLES, PRIMES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The HCF-or-LCM decision is tested twice, in both directions, because it is
 * the one thing in this module that students get wrong for years. The size
 * check — should the answer be bigger or smaller than the numbers given? —
 * is the intended route through both of them.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l29-factors-multiples": {
    lessonId: "ma-l29-factors-multiples",
    passMark: 70,
    questions: [
      {
        id: "maq29-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fa-multiple",
        prompt: "Which statement is true about factors and multiples of 12?",
        options: [
          { id: "a", text: "Factors of 12 can be larger than 12" },
          { id: "b", text: "Multiples of 12 can be smaller than 12" },
          {
            id: "c",
            text: "Factors are never larger than 12; multiples are never smaller than 12",
          },
          { id: "d", text: "There are infinitely many factors of 12" },
        ],
        correct: "c",
        explanation:
          "A factor divides into 12, so it cannot exceed it. A multiple is built by multiplying 12, so it cannot be less. 12 itself appears in both lists — the only number that does.",
        whyWrong: {
          a: "Nothing larger than 12 divides into 12 exactly.",
          b: "The smallest multiple of 12 is 12 × 1 = 12.",
          d: "There are exactly six: 1, 2, 3, 4, 6, 12. It is the MULTIPLES that go on forever.",
        },
      },
      {
        id: "maq29-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-pairs",
        prompt:
          "Listing the factors of 36 in pairs, you reach 6 × 6. Why can you stop there?",
        options: [
          { id: "a", text: "Because 36 is a square number" },
          {
            id: "b",
            text: "The pair has met, so every factor above 6 has already appeared as the partner of one below it",
          },
          { id: "c", text: "Because 6 is the largest factor" },
          { id: "d", text: "You cannot stop; you must test up to 36" },
        ],
        correct: "b",
        explanation:
          "Factors come in pairs that multiply to 36. Once the two numbers in a pair meet, the list starts mirroring itself — 9 has already appeared as the partner of 4, and 12 as the partner of 3.",
        whyWrong: {
          a: "Being square is why the meeting point is a repeated factor rather than a crossover, but the stopping rule works for every number.",
          c: "36 is the largest factor of 36. 6 is simply where the pairs meet.",
          d: "Testing to 36 means 30 unnecessary divisions, and under exam time pressure that matters.",
        },
      },
      {
        id: "maq29-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fa-square",
        prompt: "What does 3² mean?",
        options: [
          { id: "a", text: "3 × 2 = 6" },
          { id: "b", text: "3 × 3 = 9" },
          { id: "c", text: "3 + 3 = 6" },
          { id: "d", text: "2 × 2 × 2 = 8" },
        ],
        correct: "b",
        explanation:
          "The raised 2 counts how many threes are multiplied together, so 3² is 3 × 3 = 9.",
        whyWrong: {
          a: "This multiplies the base by the index. It happens to give the right answer for 2² and is wrong everywhere else.",
          c: "That is 3 × 2 written as repeated addition, which is what an index is not.",
          d: "That is 2³ — the base and the index have been swapped.",
        },
      },
      {
        id: "maq29-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-common",
        prompt: "What is the highest common factor of 18 and 30?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "3" },
          { id: "c", text: "6" },
          { id: "d", text: "90" },
        ],
        correct: "c",
        explanation:
          "Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30. The common ones are 1, 2, 3 and 6, and the highest is 6.",
        whyWrong: {
          a: "2 does divide both, but it is not the HIGHEST one that does.",
          b: "Same problem — 3 is common but 6 is larger and still divides both.",
          d: "90 is the lowest common MULTIPLE. An HCF can never be larger than the smaller of the two numbers.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l30-divisibility": {
    lessonId: "ma-l30-divisibility",
    passMark: 70,
    questions: [
      {
        id: "maq30-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fa-digit-sum",
        prompt: "Is 4,713 divisible by 3, and how can you tell without dividing?",
        options: [
          { id: "a", text: "No — it is odd" },
          { id: "b", text: "Yes — its digits add to 15, which is a multiple of 3" },
          { id: "c", text: "No — it does not end in 3, 6 or 9" },
          { id: "d", text: "You cannot tell without dividing" },
        ],
        correct: "b",
        explanation:
          "4 + 7 + 1 + 3 = 15, and 15 is a multiple of 3, so 4,713 is too. The rule works because every power of ten is one more than a multiple of nine.",
        whyWrong: {
          a: "Odd and even decide divisibility by 2, not by 3. 9 is odd and divisible by 3.",
          c: "There is no last-digit rule for 3. 12 ends in 2 and is divisible by 3.",
          d: "That is exactly what the digit-sum rule is for, and it takes about two seconds.",
        },
      },
      {
        id: "maq30-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-combined",
        prompt: "How do you test whether a number is divisible by 6?",
        options: [
          { id: "a", text: "Check that it ends in 6" },
          { id: "b", text: "Add the digits and see if the total is a multiple of 6" },
          { id: "c", text: "Check that it passes both the 2 test and the 3 test" },
          { id: "d", text: "Check that it passes the 2 test and the 4 test" },
        ],
        correct: "c",
        explanation:
          "6 = 2 × 3, and 2 and 3 share no factors, so a number divisible by both is divisible by 6. 4,716 is even and its digits sum to 18, so it passes.",
        whyWrong: {
          a: "26 ends in 6 and is not divisible by 6. Last-digit rules exist for 2, 5 and 10 only.",
          b: "Digit sums work for 3 and 9 and for nothing else. 24 has a digit sum of 6 and 42 has a digit sum of 6; both happen to work here, but 15 has a digit sum of 6 and is not divisible by 6.",
          d: "2 and 4 share a factor, so the tests overlap and prove less than they appear to. 12 passes both and is not divisible by 8.",
        },
      },
      {
        id: "maq30-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-end-rules",
        prompt: "Why is divisibility by 4 decided by the last two digits only?",
        options: [
          { id: "a", text: "It is a convention with no reason behind it" },
          {
            id: "b",
            text: "Because every column from the hundreds upwards is a multiple of 100, and 100 is divisible by 4",
          },
          { id: "c", text: "Because 4 is an even number" },
          { id: "d", text: "Because two digits is half of four" },
        ],
        correct: "b",
        explanation:
          "Any number is (some multiple of 100) + (its last two digits). The first part is always divisible by 4, so only the last two digits can decide the question.",
        whyWrong: {
          a: "It follows directly from place value, which is why the same reasoning gives the rule for 8 with three digits.",
          c: "Being even gives the rule for 2. The rule for 4 needs 100 to be divisible by 4, which it is.",
          d: "A coincidence of numbers, not a reason. The rule for 8 uses three digits, and 8 is not six.",
        },
      },
      {
        id: "maq30-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fa-no-rule-seven",
        prompt:
          "A student checks 91 against the rules for 2, 3, 4, 5, 6, 9 and 10, finds none applies, and concludes that 91 is prime. What went wrong?",
        options: [
          { id: "a", text: "Nothing — 91 is prime" },
          { id: "b", text: "They should have checked 11 as well" },
          {
            id: "c",
            text: "There is no easy rule for 7, and 91 = 7 × 13 — the absence of a shortcut is not evidence",
          },
          { id: "d", text: "They forgot that 91 is even" },
        ],
        correct: "c",
        explanation:
          "The easy divisibility rules cover 2, 3, 4, 5, 6, 8, 9 and 10. 7 has no practical shortcut, so it has to be divided — and 91 ÷ 7 = 13 exactly.",
        whyWrong: {
          a: "91 is 7 × 13, so it has four factors and is composite.",
          b: "11 does not divide 91, and checking it would not have found the problem.",
          d: "91 is odd. That is part of why it looks prime at a glance.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l31-primes": {
    lessonId: "ma-l31-primes",
    passMark: 70,
    questions: [
      {
        id: "maq31-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-not-one",
        prompt: "Why is 1 not counted as a prime number?",
        options: [
          { id: "a", text: "Because it is too small" },
          {
            id: "b",
            text: "A prime has exactly two different factors, and 1 has only one — and excluding it is what makes prime factorisation unique",
          },
          { id: "c", text: "Because 1 is odd" },
          { id: "d", text: "It is prime; the definition has changed" },
        ],
        correct: "b",
        explanation:
          "1 has a single factor, itself, so it fails the definition. And if it counted, 12 could be written as 2 × 2 × 3 or 1 × 2 × 2 × 3 or 1 × 1 × 2 × 2 × 3, and every number would have infinitely many factorisations.",
        whyWrong: {
          a: "2 is smaller than most numbers and is prime. Size is not the test.",
          c: "3, 5 and 7 are odd and prime. Oddness is not the test either.",
          d: "It is not prime and the definition has not changed. The exclusion is deliberate and it protects uniqueness.",
        },
      },
      {
        id: "maq31-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-testing",
        prompt: "To test whether 97 is prime, which numbers do you need to divide by?",
        options: [
          { id: "a", text: "Every number from 2 to 96" },
          { id: "b", text: "2, 3, 5 and 7, stopping there because 11 × 11 is already past 97" },
          { id: "c", text: "Only 2 and 3" },
          { id: "d", text: "Every odd number up to 97" },
        ],
        correct: "b",
        explanation:
          "Factors come in pairs, so a large factor always has a small partner you would have met first. Once the primes whose square is below 97 have all failed, there is nothing left that could divide it. Four tests settle the question.",
        whyWrong: {
          a: "That is 95 divisions where four will do, and it is the difference between finishing a question and not.",
          c: "Not enough. 91 passes the 2 and 3 tests and is 7 × 13, which is exactly the case this misses.",
          d: "Still far too many, and testing composites like 9 is wasted work — anything 9 divides, 3 divides first.",
        },
      },
      {
        id: "maq31-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-factor-tree",
        prompt: "Which is 360 written as a product of primes?",
        options: [
          { id: "a", text: "2 × 2 × 2 × 3 × 3 × 5" },
          { id: "b", text: "4 × 9 × 10" },
          { id: "c", text: "2 × 3 × 5" },
          { id: "d", text: "36 × 10" },
        ],
        correct: "a",
        explanation:
          "360 = 8 × 45 = (2 × 2 × 2) × (3 × 3 × 5). Every number in the product is prime, which is what makes the factorisation complete.",
        whyWrong: {
          b: "4, 9 and 10 are all composite, so the tree is unfinished. Each of them splits further.",
          c: "2 × 3 × 5 = 30, not 360. Each prime has to be repeated as many times as it divides in.",
          d: "Both numbers are composite, so this is one split rather than a factorisation.",
        },
      },
      {
        id: "maq31-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fa-index-form",
        prompt: "Write 504 as a product of primes in index form.",
        options: [
          { id: "a", text: "2³ × 3² × 7" },
          { id: "b", text: "2² × 3³ × 7" },
          { id: "c", text: "2³ × 3 × 7²" },
          { id: "d", text: "8 × 9 × 7" },
        ],
        correct: "a",
        explanation:
          "504 = 8 × 63 = (2 × 2 × 2) × (7 × 9) = 2 × 2 × 2 × 3 × 3 × 7, which is 2³ × 3² × 7. Check: 8 × 9 × 7 = 504.",
        whyWrong: {
          b: "2² × 3³ × 7 = 4 × 27 × 7 = 756, not 504. The indices have been swapped.",
          c: "2³ × 3 × 7² = 8 × 3 × 49 = 1,176. There is only one 7 in 504.",
          d: "The value is right but 8 and 9 are not prime, so this is not index form of a PRIME factorisation.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l32-hcf-lcm": {
    lessonId: "ma-l32-hcf-lcm",
    passMark: 70,
    questions: [
      {
        id: "maq32-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-fa-which-one",
        prompt:
          "Two bells ring together, then every 6 and every 8 minutes. When do they next ring together?",
        options: [
          { id: "a", text: "After 2 minutes" },
          { id: "b", text: "After 14 minutes" },
          { id: "c", text: "After 24 minutes" },
          { id: "d", text: "After 48 minutes" },
        ],
        correct: "c",
        explanation:
          "Each bell rings at its own multiples, so they coincide at a common multiple — and 'next' means the lowest one. The LCM of 6 and 8 is 24.",
        whyWrong: {
          a: "2 is the HCF. The size check rules it out instantly: the bells cannot coincide sooner than either of them rings at all.",
          b: "14 is 6 + 8. Adding the intervals has no meaning here — neither bell rings at 14 minutes.",
          d: "48 is 6 × 8, which IS a common multiple but not the lowest. Multiplying counts the shared factor of 2 twice.",
        },
      },
      {
        id: "maq32-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-fa-which-one",
        prompt:
          "36 oranges and 48 mangoes go into identical bags with nothing left over. What is the largest number of bags?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "144" },
          { id: "c", text: "84" },
          { id: "d", text: "6" },
        ],
        correct: "a",
        explanation:
          "The number of bags must divide both 36 and 48 exactly, so it is a common factor, and 'largest' makes it the HCF: 12. Each bag holds 3 oranges and 4 mangoes.",
        whyWrong: {
          b: "144 is the LCM. You cannot have more bags than fruit — the size check catches this immediately.",
          c: "84 is 36 + 48, the total number of fruits, not a number of bags.",
          d: "6 divides both, so it is a common factor, but 12 is larger and also divides both.",
        },
      },
      {
        id: "maq32-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-fa-relationship",
        prompt:
          "Two numbers have an HCF of 6 and an LCM of 72. One of them is 24. What is the other?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "18" },
          { id: "c", text: "48" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation:
          "HCF × LCM equals the product of the two numbers, so the product is 6 × 72 = 432. Then 432 ÷ 24 = 18. Check: the HCF of 24 and 18 is 6 and their LCM is 72.",
        whyWrong: {
          a: "The HCF of 24 and 12 is 12, not 6, and their LCM is 24.",
          c: "The HCF of 24 and 48 is 24 and their LCM is 48. Neither matches.",
          d: "The HCF of 24 and 3 is 3. The product would also be far too small.",
        },
      },
      {
        id: "maq32-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-fa-lcm",
        prompt:
          "Why is multiplying two numbers together not a reliable way to find their LCM?",
        options: [
          { id: "a", text: "It always gives an answer that is too small" },
          {
            id: "b",
            text: "The product counts any shared factor twice, so it overshoots by exactly the HCF unless the two share nothing",
          },
          { id: "c", text: "It only works for prime numbers" },
          { id: "d", text: "It is reliable; there is no problem with it" },
        ],
        correct: "b",
        explanation:
          "6 × 8 = 48, but the LCM is 24. The shared factor of 2 has been counted in both numbers. Dividing the product by the HCF corrects it: 48 ÷ 2 = 24.",
        whyWrong: {
          a: "It gives an answer that is too LARGE, or exactly right when the numbers share no factors.",
          c: "It works whenever the two numbers are coprime, which includes many pairs that are not themselves prime — 8 and 9, for instance.",
          d: "It gives 48 where the answer is 24, which is wrong by a factor of two.",
        },
      },
      {
        id: "maq32-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-fa-month-review",
        prompt:
          "Why does mixed practice — questions from several topics with no warning which is which — produce better retention than practising one topic at a time?",
        options: [
          { id: "a", text: "It does not; blocked practice is better because it feels easier" },
          {
            id: "b",
            text: "Because choosing the method is half the skill, and practising one topic at a time removes that choice entirely",
          },
          { id: "c", text: "Because it covers more topics in the same time" },
          { id: "d", text: "Because it makes the questions harder" },
        ],
        correct: "b",
        explanation:
          "In an exam nothing tells you which topic a question belongs to. Blocked practice trains the procedure while skipping the decision; mixed practice trains both, which is why it feels harder and works better.",
        whyWrong: {
          a: "Blocked practice does feel easier and produces measurably worse retention. The feeling of fluency during practice is not a good guide to what will be there a week later.",
          c: "Coverage is a side effect. The benefit is in having to identify the method.",
          d: "The questions are the same questions. What changes is that you have to work out what kind they are.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
