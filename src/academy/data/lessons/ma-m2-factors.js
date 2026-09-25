/**
 * MATHEMATICS · MONTH 2 · MODULE 4 · FACTORS, MULTIPLES AND PRIMES
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * How numbers are built out of other numbers. This is the last module of
 * Month 2 and the one with the longest reach: simplifying fractions in Month
 * 2, common denominators in Month 3, algebraic fractions in Month 6, surds in
 * Month 7 and factorising throughout are all this module wearing different
 * clothes.
 *
 * The final lesson ends with a mixed review drawing on every skill in the
 * month, which is the course's interleaving: returning to earlier material
 * after a gap is what turns it from something you have seen into something
 * you know.
 */

export const SECTION_ID = "ma-s2-factors";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l21-factors-multiples",
    moduleId: "ma-m2-factors",
    sectionId: SECTION_ID,
    order: 1,
    title: "Factors and Multiples",
    subtitle: "Two words that get swapped, and how to stop swapping them",
    estimatedMinutes: 14,
    intro:
      "Twenty-four chairs are to be set out in equal rows with none left over. There are exactly eight ways to do it, and that list of ways IS the list of factors of 24. This lesson is those two words and the difference between them.",

    atoms: [
      {
        id: "a-ma-fa-factor",
        title: "A factor divides exactly",
        explain:
          "A factor of a number divides into it with nothing left over. 3 is a factor of 12 because 12 ÷ 3 = 4 exactly. 5 is not, because 12 ÷ 5 leaves a remainder.",
        why: "Factors are the building blocks. Simplifying a fraction means dividing top and bottom by a common factor; factorising an expression means pulling out a common factor. Both of those are Month 3 and Month 6, and both are this idea.",
        example:
          "  24 chairs in equal rows:\n\n    1 row of 24      ●●●●●●●●●●●●●●●●●●●●●●●●\n    2 rows of 12\n    3 rows of 8\n    4 rows of 6\n    6 rows of 4\n    8 rows of 3\n   12 rows of 2\n   24 rows of 1\n\n  Factors of 24:  1, 2, 3, 4, 6, 8, 12, 24\n\n  5 is missing because 24 chairs will not make equal rows of 5.",
        analogy:
          "Factors are the ways a crate of goods can be packed into equal boxes with none left over. 5 is not an option for 24, and no amount of rearranging makes it one.",
      },
      {
        id: "a-ma-fa-pairs",
        title: "Factors come in pairs, and that is when to stop",
        explain:
          "Every factor has a partner: 3 pairs with 8 because 3 × 8 = 24. Work upwards from 1, writing each pair as you find it, and stop when the two numbers in a pair meet or cross over.",
        why: "Without a stopping rule, students either give up early and miss factors, or keep testing numbers long past the point where anything new can appear. The crossover point is where the list becomes a mirror of itself.",
        example:
          "  Factors of 36, in pairs:\n\n    1 × 36\n    2 × 18\n    3 × 12\n    4 × 9\n    6 × 6      ← the pair has met. Stop.\n\n  Factors: 1, 2, 3, 4, 6, 9, 12, 18, 36\n\n  Testing 7 and 8 is unnecessary: anything above 6 has already\n  appeared as the partner of something below it.",
        mistake:
          "Forgetting 1 and the number itself. Both are always factors of every number, and it is having ONLY those two that makes a number prime.",
        drill: {
          skill: "L0-N3.1",
          count: 3,
          intro:
            "Three numbers to factorise completely. Work in pairs from 1 upwards and stop at the crossover, the pairing is what tells you the list is finished.",
        },
      },
      {
        id: "a-ma-fa-multiple",
        title: "A multiple is built by multiplying",
        explain:
          "The multiples of a number are what you get by multiplying it by 1, 2, 3 and so on. The multiples of 6 are 6, 12, 18, 24, 30, and they go on forever. The first multiple of any number is the number itself.",
        why: "Multiples are where common denominators come from in Month 3 and where the LCM comes from in Lesson 24. The going-on-forever part matters: factors are a short finite list, multiples are an endless one, and that asymmetry is what makes the two words hard to confuse once you have noticed it.",
        example:
          "  Factors of 12:    1, 2, 3, 4, 6, 12          ← a finite list\n  Multiples of 12:  12, 24, 36, 48, 60, …       ← never ends\n\n  Factors are never BIGGER than the number.\n  Multiples are never SMALLER than it.\n\n  12 appears in both lists, and it is the only number that does.",
        mistake:
          "Swapping the two words. If your answer to 'list the factors' contains numbers bigger than the number itself, you have listed multiples.",
        drill: {
          skill: "L0-N3.2",
          count: 3,
          intro:
            "Three multiples questions. Remember that the first multiple of a number is the number itself, not double it.",
        },
      },
      {
        id: "a-ma-fa-common",
        title: "Common factors and common multiples",
        explain:
          "A COMMON factor divides into two numbers. A COMMON multiple is in both of their times tables. 4 is a common factor of 12 and 20; 24 is a common multiple of 6 and 8.",
        why: "Everything in Lesson 24 is here in miniature. The HCF is the biggest of the common factors and the LCM is the smallest of the common multiples, and the two words in front tell you which list to build.",
        example:
          "  Factors of 12:  1, 2, 3, 4, 6, 12\n  Factors of 20:  1, 2, 4, 5, 10, 20\n\n  Common factors: 1, 2, 4          → the highest is 4\n\n\n  Multiples of 6:  6, 12, 18, 24, 30, 36, …\n  Multiples of 8:  8, 16, 24, 32, 40, …\n\n  Common multiples: 24, 48, …      → the lowest is 24",
        practice: {
          prompt: "Find all the common factors of 18 and 30, and then the highest of them.",
          answer:
            "Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30. Common: 1, 2, 3, 6. The highest common factor is 6.",
        },
      },
      {
        id: "a-ma-fa-square",
        title: "Squares, cubes and their roots",
        explain:
          "A square number is a whole number multiplied by itself: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. A cube number is one multiplied by itself three times: 1, 8, 27, 64, 125. The square root undoes the squaring.",
        why: "Square numbers are worth knowing on sight to 15², because they are what make surds simplify in Month 7, what make the difference of two squares factorise in Month 6, and what Pythagoras' theorem is entirely made of in Month 8.",
        table: {
          caption: "The ones worth knowing without thinking.",
          headers: ["n", "n²", "n³"],
          rows: [
            ["1", "1", "1"],
            ["2", "4", "8"],
            ["3", "9", "27"],
            ["4", "16", "64"],
            ["5", "25", "125"],
            ["6", "36", "216"],
            ["7", "49", "343"],
            ["8", "64", "512"],
            ["9", "81", "729"],
            ["10", "100", "1000"],
          ],
          note: "64 appears in both columns: it is 8² and also 4³. It is the smallest number above 1 that is both.",
        },
        mistake:
          "Reading 3² as 3 × 2. The small 2 says how many THREES are multiplied together, not what to multiply by. 3² = 3 × 3 = 9, and 3 × 2 = 6.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l22-divisibility",
    moduleId: "ma-m2-factors",
    sectionId: SECTION_ID,
    order: 2,
    title: "Divisibility Rules",
    subtitle: "Finding factors without doing the division",
    estimatedMinutes: 12,
    intro:
      "A trader needs to know whether 4,713 items can be shared into 3 equal lots. She adds the digits, 4 + 7 + 1 + 3 = 15, and knows the answer in two seconds. This lesson is why that works and which rules are worth knowing.",

    atoms: [
      {
        id: "a-ma-fa-end-rules",
        title: "The rules that look at the end of a number",
        explain:
          "Divisibility by 2, 5 and 10 is decided entirely by the last digit. Divisibility by 4 is decided by the last two digits, and by 8 by the last three.",
        why: "These follow from place value. Every column from the tens upwards is a multiple of 10, and 10 is divisible by 2 and by 5, so only the units column can upset those tests. Similarly every column from the hundreds upwards is a multiple of 100, which is divisible by 4.",
        table: {
          caption: "The end-of-number tests.",
          headers: ["Divisible by", "Test", "Example"],
          rows: [
            ["2", "Last digit is even", "4,718 ✓"],
            ["5", "Last digit is 0 or 5", "4,715 ✓"],
            ["10", "Last digit is 0", "4,710 ✓"],
            ["4", "Last TWO digits make a multiple of 4", "4,716 ✓ (16 ÷ 4 = 4)"],
            ["8", "Last THREE digits make a multiple of 8", "4,712 ✓ (712 ÷ 8 = 89)"],
          ],
        },
        mistake:
          "Using the digit-sum test for 4 or 8. Digit sums work for 3 and 9 only; the powers of two are decided by the end of the number.",
      },
      {
        id: "a-ma-fa-digit-sum",
        title: "The rules that add the digits",
        explain:
          "A number is divisible by 3 if its digits add to a multiple of 3, and by 9 if its digits add to a multiple of 9. If the sum is still large, add its digits again.",
        why: "It works because every power of ten is one more than a multiple of nine, 10 = 9 + 1, 100 = 99 + 1, 1000 = 999 + 1. So each digit contributes its own value plus a pile of nines, and the nines never affect divisibility by 3 or 9.",
        example:
          "  Is 4,713 divisible by 3?\n\n    4 + 7 + 1 + 3 = 15\n    15 is a multiple of 3   →  yes\n\n  Is it divisible by 9?\n\n    15 is not a multiple of 9  →  no\n\n\n  Is 61,794 divisible by 9?\n\n    6 + 1 + 7 + 9 + 4 = 27\n    27 is a multiple of 9   →  yes",
        analogy:
          "Each digit brings its own value plus a bundle of nines. The bundles are invisible to the 3 and 9 tests, so only what the digits themselves add up to can decide.",
      },
      {
        id: "a-ma-fa-combined",
        title: "Combining tests for 6, 12 and 15",
        explain:
          "A number is divisible by 6 if it passes BOTH the 2 test and the 3 test. By 12 if it passes the 4 test and the 3 test. By 15 if it passes the 5 test and the 3 test.",
        why: "It works because 2 and 3 share no factors, and neither do 4 and 3, or 5 and 3. Combining tests for numbers that DO share a factor fails: passing the 2 test and the 4 test does not make a number divisible by 8, because 2 is already inside 4.",
        example:
          "  Is 4,716 divisible by 6?\n\n    Even?           6 is even        ✓\n    Digits sum?     4+7+1+6 = 18, a multiple of 3   ✓\n\n    Both pass  →  yes, divisible by 6\n\n\n  A warning about combining badly:\n\n    12 passes the 2 test and the 4 test.\n    12 is NOT divisible by 8.\n    2 and 4 share a factor, so the tests overlap.",
        mistake:
          "Assuming any two tests can be multiplied together. They can only be combined when the two divisors share no common factor.",
        drill: {
          skill: "L0-N3.4",
          count: 3,
          intro:
            "Three divisibility questions. Use the rule rather than the division, that is the skill being practised, and it is much faster once it is automatic.",
        },
      },
      {
        id: "a-ma-fa-why-useful",
        title: "What the rules are actually for",
        explain:
          "Divisibility rules are how you find factors quickly, and finding factors quickly is how you simplify a fraction, spot a common factor in an algebraic expression, or decide whether a quadratic will factorise neatly.",
        why: "In an exam with no calculator, being able to see that 4,713 is a multiple of 3 in two seconds is the difference between simplifying a fraction and abandoning it. The rules pay for themselves many times over in Months 2 and 5.",
        example:
          "  Simplify  actually 258/369.\n\n  Both are odd, so 2 is out.\n  2 + 5 + 8 = 15  →  258 is divisible by 3\n  3 + 6 + 9 = 18  →  369 is divisible by 3\n\n  258 ÷ 3 = 86,  369 ÷ 3 = 123   →   86/123\n\n  8 + 6 = 14, not a multiple of 3. 86 is even, 123 is not.\n  Try 41:  86 = 2 × 43,  123 = 3 × 41. No common factor.\n\n  So 86/123 is in its lowest terms.",
        practice: {
          prompt: "Without dividing, decide whether 5,832 is divisible by 2, 3, 4, 6 and 9.",
          answer:
            "By 2: last digit 2 is even ✓. By 3: 5+8+3+2 = 18, a multiple of 3 ✓. By 4: last two digits 32, and 32 ÷ 4 = 8 ✓. By 6: passes both 2 and 3 ✓. By 9: 18 is a multiple of 9 ✓. It is divisible by all five.",
        },
      },
      {
        id: "a-ma-fa-no-rule-seven",
        title: "The gap: 7, and knowing when to just divide",
        explain:
          "There is a divisibility rule for 7, and it is more work than the division. For 7, and for most larger primes, the honest method is to divide and see.",
        why: "Knowing which shortcuts exist also means knowing where they stop. A student who believes there must be a trick for everything wastes time hunting for one; the professional move is to recognise a case that has no shortcut and get on with it.",
        table: {
          caption: "Which rules are worth knowing.",
          headers: ["Divisor", "Rule worth using?"],
          rows: [
            ["2, 5, 10", "Yes, instant"],
            ["3, 9", "Yes, digit sum"],
            ["4, 8", "Yes, last two or three digits"],
            ["6, 12, 15", "Yes, combine two tests"],
            ["7", "No, just divide"],
            ["11", "Alternating digit sum, if you like it"],
          ],
        },
        mistake:
          "Assuming a number is prime because none of the easy rules apply. 91 passes none of them and is 7 × 13, which is exactly why it catches almost everybody in the next lesson.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l23-primes",
    moduleId: "ma-m2-factors",
    sectionId: SECTION_ID,
    order: 3,
    title: "Primes and Prime Factorisation",
    subtitle: "The atoms that every number is built from",
    estimatedMinutes: 15,
    intro:
      "Twelve sweets can be shared equally among 2, 3, 4 or 6 children. Thirteen can be shared only among 1 or 13. That is the whole idea of a prime, and it turns out to be the idea that every other number is built on.",

    atoms: [
      {
        id: "a-ma-fa-prime",
        title: "A prime has exactly two factors",
        explain:
          "A prime number has exactly two different factors: 1 and itself. 13 is prime. 12 is not, because it has six. A number with more than two factors is called COMPOSITE.",
        why: "The definition says 'exactly two', and that phrasing is doing real work. It is what rules out 1, which has only one factor, and it is what makes prime factorisation unique, which is the property the rest of the topic depends on.",
        table: {
          caption: "The primes below 100, which are worth recognising on sight.",
          headers: ["Range", "Primes"],
          rows: [
            ["1–20", "2, 3, 5, 7, 11, 13, 17, 19"],
            ["21–40", "23, 29, 31, 37"],
            ["41–60", "41, 43, 47, 53, 59"],
            ["61–80", "61, 67, 71, 73, 79"],
            ["81–100", "83, 89, 97"],
          ],
          note: "Twenty-five of them. 2 is the only even one, every other even number has 2 as a third factor.",
        },
        mistake:
          "Thinking odd means prime. 9, 15, 21, 25, 27, 33, 35 and 49 are all odd and all composite. 91 is the one that catches people: it looks prime and it is 7 × 13.",
      },
      {
        id: "a-ma-fa-not-one",
        title: "Why 1 is not prime",
        explain:
          "1 has only one factor, itself. The definition requires exactly two, so 1 is neither prime nor composite. It sits on its own.",
        why: "This is not a technicality. If 1 counted as prime, then 12 could be written as 2 × 2 × 3, or 1 × 2 × 2 × 3, or 1 × 1 × 2 × 2 × 3, and prime factorisation would stop being unique. Excluding 1 is what makes every number have exactly ONE prime factorisation.",
        example:
          "  12 = 2 × 2 × 3     ← the only way, if 1 is excluded\n\n  If 1 were prime:\n\n  12 = 1 × 2 × 2 × 3\n     = 1 × 1 × 2 × 2 × 3\n     = 1 × 1 × 1 × 2 × 2 × 3   …and so on forever\n\n  Uniqueness is worth more than tidiness, so 1 is excluded.",
        drill: {
          skill: "L0-N3.3",
          count: 3,
          intro:
            "Three sets of numbers to sift for primes. Test each one against 2, 3, 5 and 7, for numbers under 100 that is enough, and watch for 91.",
        },
      },
      {
        id: "a-ma-fa-testing",
        title: "Testing a number for primeness",
        explain:
          "To test a number under 100, try dividing by 2, 3, 5 and 7. If none of them divides it, it is prime. For larger numbers, test the primes up to the square root.",
        why: "You stop at the square root for the same reason factor pairs stop there: if a number has a factor above its square root, it must also have the partner below it, and you would have found that one first.",
        example:
          "  Is 97 prime?\n\n    √97 ≈ 9.8, so test the primes up to 9: 2, 3, 5, 7\n\n    2?  97 is odd              no\n    3?  9 + 7 = 16             no\n    5?  does not end 0 or 5    no\n    7?  7 × 13 = 91, 7 × 14 = 98   no\n\n    97 is prime.\n\n  There is no need to try 11, 13 or anything larger.",
        mistake:
          "Testing every number up to the number itself. For 97 that is 95 unnecessary divisions, and under exam time pressure it is the difference between finishing the question and not.",
      },
      {
        id: "a-ma-fa-factor-tree",
        title: "Prime factorisation with a factor tree",
        explain:
          "Every whole number above 1 can be written as a product of primes, in exactly one way. A factor tree finds it: split the number into any two factors, then keep splitting anything that is not yet prime.",
        why: "This is the tool the next lesson runs on, and it is the tool that simplifies surds in Month 7. It is also a striking fact in its own right: it does not matter which split you start with, the primes at the bottom always come out the same.",
        example:
          "        360\n       /   \\\n      4     90\n     / \\   /  \\\n    2   2 9    10\n         / \\   / \\\n        3   3 2   5\n\n  360 = 2 × 2 × 3 × 3 × 2 × 5\n      = 2 × 2 × 2 × 3 × 3 × 5\n\n  In index form:  360 = 2³ × 3² × 5\n\n  Starting with 360 = 36 × 10 instead gives the same primes.\n  It always does.",
        mistake:
          "Stopping while a composite number is still at the bottom of the tree. 12 = 2 × 6 is not finished; the 6 splits into 2 × 3.",
        drill: {
          skill: "L1-N2.1",
          count: 3,
          intro:
            "Three numbers to break into primes. List every prime in the product, repeating any that appear more than once, 12 is 2, 2, 3 and not 2, 3.",
        },
      },
      {
        id: "a-ma-fa-index-form",
        title: "Index form, and where it leads",
        explain:
          "Writing 2 × 2 × 2 × 3 × 3 × 5 as 2³ × 3² × 5 is index form. The small raised number counts how many of that prime there are.",
        why: "Index form is what makes the HCF and LCM methods in the next lesson quick, and it is the first appearance of indices, which become a whole module in Month 5 and then logarithms in Month 7. The notation is worth becoming comfortable with here, where the numbers are small.",
        example:
          "  360 = 2 × 2 × 2 × 3 × 3 × 5\n      = 2³ × 3² × 5¹\n      = 2³ × 3² × 5\n\n  The 1 is not usually written, exactly as the 1 in 1x is not.\n\n  Reading it back:\n    2³  means  2 × 2 × 2 = 8\n    3²  means  3 × 3 = 9\n    8 × 9 × 5 = 360   ✓",
        practice: {
          prompt: "Write 504 as a product of primes in index form.",
          answer:
            "504 = 8 × 63 = (2 × 2 × 2) × (7 × 9) = 2 × 2 × 2 × 3 × 3 × 7, so 504 = 2³ × 3² × 7. Check: 8 × 9 × 7 = 504.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l24-hcf-lcm",
    moduleId: "ma-m2-factors",
    sectionId: SECTION_ID,
    order: 4,
    title: "HCF, LCM and Which One the Question Wants",
    subtitle: "Two numbers, and the one decision that separates them",
    estimatedMinutes: 16,
    intro:
      "Two church bells ring together at six o'clock. One rings every 6 minutes and the other every 8. When do they next ring together? And separately: 36 oranges and 48 mangoes are to go into identical bags. How many bags? Both questions are about the same two numbers and they have completely different answers.",

    atoms: [
      {
        id: "a-ma-fa-hcf",
        title: "The highest common factor",
        explain:
          "The HCF of two numbers is the largest number that divides into both of them exactly. Write each number as a product of primes, take the primes they share, each to the LOWEST power it appears to, and multiply.",
        why: "The HCF is what fully simplifies a fraction in one step, and it is what you pull out when factorising in Month 6. Dividing 36/48 by their HCF of 12 gives 3/4 immediately, rather than by two or three rounds of halving.",
        example:
          "  HCF of 36 and 48\n\n    36 = 2² × 3²\n    48 = 2⁴ × 3\n\n    Shared primes: 2 and 3\n    Lowest power of 2:  2²  (from 36)\n    Lowest power of 3:  3¹  (from 48)\n\n    HCF = 2² × 3 = 12\n\n  Check: 36 ÷ 12 = 3 and 48 ÷ 12 = 4, both whole.  ✓\n\n  And 36/48 = 3/4 in one step.",
        mistake:
          "Taking the highest power instead of the lowest. That gives a number that does not divide into both, the quickest check is that the HCF can never be bigger than the smaller of the two numbers.",
        drill: {
          skill: "L1-N2.2",
          count: 3,
          intro:
            "Three HCFs. Write each number in prime factors first, it is slower for the first one and much faster by the third.",
        },
      },
      {
        id: "a-ma-fa-lcm",
        title: "The lowest common multiple",
        explain:
          "The LCM of two numbers is the smallest number that both of them divide into. Take every prime that appears in either factorisation, each to the HIGHEST power it appears to, and multiply.",
        why: "The LCM is the common denominator when adding fractions in Month 3, and it is what 'when do these two cycles coincide' questions are asking for. Using the LCM rather than just multiplying the denominators keeps the numbers small and the simplifying short.",
        example:
          "  LCM of 6 and 8\n\n    6 = 2 × 3\n    8 = 2³\n\n    Highest power of 2:  2³\n    Highest power of 3:  3\n\n    LCM = 2³ × 3 = 24\n\n  Check: 24 ÷ 6 = 4 and 24 ÷ 8 = 3, both whole.  ✓\n\n  Note that 6 × 8 = 48 is ALSO a common multiple, just not\n  the lowest one. It counts the shared factor of 2 twice.",
        mistake:
          "Multiplying the two numbers together. That always gives a common multiple and gives the LOWEST one only when the two share no factors at all.",
        drill: {
          skill: "L1-N2.3",
          count: 3,
          intro:
            "Three LCMs. Check each answer by dividing: the LCM must divide exactly by both of the original numbers.",
        },
      },
      {
        id: "a-ma-fa-relationship",
        title: "HCF × LCM = the product of the numbers",
        explain:
          "For any two numbers, the HCF multiplied by the LCM equals the two numbers multiplied together. So the LCM can always be found as (a × b) ÷ HCF.",
        why: "It gives a second route and, more usefully, a check. It also explains why multiplying two numbers overshoots the LCM by exactly their HCF, the shared factor gets counted twice in the product and once in the LCM.",
        example:
          "  a = 36,  b = 48\n\n    HCF = 12\n    LCM = (36 × 48) ÷ 12 = 1,728 ÷ 12 = 144\n\n  Check with prime factors:\n    36 = 2² × 3²,  48 = 2⁴ × 3\n    Highest powers: 2⁴ × 3² = 16 × 9 = 144   ✓\n\n  And 12 × 144 = 1,728 = 36 × 48   ✓",
        practice: {
          prompt: "The HCF of two numbers is 6 and their LCM is 72. One of the numbers is 24. What is the other?",
          answer:
            "HCF × LCM = product, so 6 × 72 = 432 is the product of the two numbers. 432 ÷ 24 = 18. The other number is 18. Check: HCF of 24 and 18 is 6 ✓, LCM is 72 ✓.",
        },
      },
      {
        id: "a-ma-fa-which-one",
        title: "Which one does the question want?",
        explain:
          "Ask what SIZE the answer should be. If it must divide INTO the numbers given, sharing, cutting, grouping into equal parts, it is the HCF, and it will be no bigger than the smaller number. If the numbers must divide into IT, events coinciding, cycles repeating, a common denominator, it is the LCM, and it will be at least as big as the larger number.",
        why: "This single size check catches almost every wrong choice. A student who answers 'the bells ring together after 2 minutes' has given an HCF where an LCM was wanted, and the answer is visibly absurd, the bells cannot coincide sooner than either of them rings at all.",
        table: {
          caption: "The decision, in one table.",
          headers: ["The situation", "Answer must be", "So it is"],
          rows: [
            ["Largest equal groups, nothing left over", "Smaller than both", "HCF"],
            ["Biggest tile that fits a floor exactly", "Smaller than both", "HCF"],
            ["Simplifying a fraction fully", "Divides both", "HCF"],
            ["When two repeating events coincide", "Bigger than both", "LCM"],
            ["Common denominator for two fractions", "Divides by both", "LCM"],
            ["Shortest length made of whole rods of two sizes", "Bigger than both", "LCM"],
          ],
        },
        mistake:
          "Choosing by which word appeared in the last lesson you did. Check the expected size of the answer before you calculate anything.",
        drill: {
          skill: "L1-N2.4",
          count: 3,
          intro:
            "Three word problems. For each one, decide whether the answer should be bigger or smaller than the numbers in the question BEFORE you work anything out.",
        },
      },
      {
        id: "a-ma-fa-month-review",
        title: "Months 1 and 2, mixed",
        explain:
          "The last drill of the foundation deliberately mixes everything from both months: place value, rounding, ordering, the four operations, BODMAS, factors and primes, with no warning about which is which.",
        why: "Practising one topic at a time makes you good at knowing what to do when you already know what topic you are in. An exam never tells you. Mixed practice, interleaving, feels harder and produces far better retention, because choosing the method is half the skill and blocked practice skips it entirely.",
        analogy:
          "A footballer who only ever practises penalties with the goalkeeper told which corner is coming is not practising penalties. The uncertainty is the thing being trained.",
        drill: {
          review: [
            "L0-N1.4",
            "L0-N2.4",
            "L0-N3.1",
            "L1-N2.3",
            "L0-N1.2",
            "L0-N3.4",
          ],
          count: 6,
          intro:
            "Six questions from across both foundation months, in no particular order. Expect them to feel harder than they did inside their own lessons, that feeling is the point, and it is what makes the material stay.",
        },
      },
    ],

    task: {
      title: "Before you move on to Month 3",
      intro:
        "Month 3 is fractions, and fractions are where this month's work gets used immediately. Check you are ready:",
      prompts: [
        "Write 84 and 126 as products of primes, then find their HCF and LCM.",
        "Use that HCF to simplify 84/126 in a single step.",
        "Without a calculator, decide whether 2,592 is divisible by 2, 3, 4, 6, 8 and 9.",
        "Evaluate 48 ÷ 8 × 3 + 5² − 10, naming the BODMAS rank at each step.",
      ],
      closing:
        "If the first two felt slow, that is normal and it is worth repeating the prime factorisation drill before starting Month 3, common denominators are the LCM wearing a different hat, and they arrive in the second lesson.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
