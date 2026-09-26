/**
 * ASSESSMENTS · MATHEMATICS · MONTH 4 · MODULE 4 · FIRST ALGEBRA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Three questions here carry the module.
 *
 * The substitution question offers −4 as a distractor, which is exactly what
 * 3x² − 4x gives when x = −2 is substituted without brackets. It is the single
 * most expensive error in the module and it is invisible: the working looks
 * orderly all the way down.
 *
 * The "five less than x" question is a reading test disguised as algebra. The
 * distractor 5 − x is what most students write, and the whyWrong does not argue
 * about word order, it substitutes a number, because that settles it in
 * seconds and the student can do it themselves next time.
 *
 * The simplify question offers "8x = 0, so x = 0" as a distractor, because
 * inventing an equals sign that nobody wrote is a specific and common error and
 * it shows the candidate cannot tell an expression from an equation.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l61-letters": {
    lessonId: "ma-l61-letters",
    passMark: 70,
    questions: [
      {
        id: "maq61-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-al-notation",
        prompt: "What does 3x mean?",
        options: [
          { id: "a", text: "A two digit number starting with 3" },
          { id: "b", text: "3 × x" },
          { id: "c", text: "3 + x" },
          { id: "d", text: "x × x × x" },
        ],
        correct: "b",
        explanation:
          "Algebra leaves out the multiplication sign, so a number written in front of a letter multiplies it. That omitted sign is always multiplication and never anything else.",
        whyWrong: {
          a: "x is a letter standing for a number, not a digit. 3x with x = 4 is 12, not 34.",
          c: "Addition is always written with its sign. If the expression meant 3 plus x it would say 3 + x.",
          d: "That is x cubed, written x³. The 3 in 3x is a multiplier, not a count of how many xs are multiplied.",
        },
      },
      {
        id: "maq61-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-terms",
        prompt: "In the expression 5x − 3y + 8, what is the coefficient of y?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "−3" },
          { id: "c", text: "5" },
          { id: "d", text: "8" },
        ],
        correct: "b",
        explanation:
          "The sign in front of a term belongs to that term, so the y term is −3y and its coefficient is −3. The expression is 5x plus −3y plus 8.",
        whyWrong: {
          a: "The digits are right and the sign has been dropped. A minus in front of a term is part of the term, not punctuation between terms.",
          c: "That is the coefficient of x. Read which letter the question asked about.",
          d: "That is the constant term, the one with no letter attached.",
        },
      },
      {
        id: "maq61-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-like-terms",
        prompt: "Simplify 5x + 3x.",
        options: [
          { id: "a", text: "8x" },
          { id: "b", text: "8x² " },
          { id: "c", text: "8" },
          { id: "d", text: "8x = 0, so x = 0" },
        ],
        correct: "a",
        explanation:
          "Five of something plus three of that something is eight of it, and the x names what there are eight of. It is also the distributive law read backwards: (5 + 3)x.",
        whyWrong: {
          b: "Multiplying the terms would involve the letters. This is an addition, so the x is counted rather than multiplied.",
          c: "The x does not disappear. Saying what there are eight of is part of the answer.",
          d: "8x was the complete answer. Adding an equals sign invents an equation nobody wrote and then solves it, which is the difference between an expression and an equation.",
        },
      },
      {
        id: "maq61-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-substitution",
        prompt: "Evaluate 3x² − 4x when x = −2.",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "−4" },
          { id: "c", text: "4" },
          { id: "d", text: "−20" },
        ],
        correct: "a",
        explanation:
          "With brackets: 3(−2)² − 4(−2) = 3 × 4 − (−8) = 12 + 8 = 20. The bracket makes the whole of −2 get squared, and the two minus signs in the second term meet and become a plus.",
        whyWrong: {
          b: "This is what you get without brackets: 3 × −2² applies the square to only the 2, giving −12, and then + 8 gives −4. It is the most expensive error in the module, and the working looks orderly all the way down.",
          c: "The 3 has been lost, or only part of the expression evaluated. Both terms have to be worked out and combined.",
          d: "The sign of the whole answer has been reversed. Since x is negative, −4x is positive, so both terms here are positive.",
        },
      },
      {
        id: "maq61-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-al-collecting",
        prompt: "Simplify 5x + 3y − 2x + 7 − y + 4.",
        options: [
          { id: "a", text: "7x + 4y + 11" },
          { id: "b", text: "3x + 2y + 11" },
          { id: "c", text: "3x + 3y + 11" },
          { id: "d", text: "16xy" },
        ],
        correct: "b",
        explanation:
          "x terms: 5x − 2x = 3x. y terms: 3y − y = 2y. Constants: 7 + 4 = 11. Check with x = 2 and y = 1: the original gives 19 and so does 3x + 2y + 11.",
        whyWrong: {
          a: "The minus signs have been left behind: −2x has been added rather than subtracted, and so has the −y. Take each sign with its term as you move it.",
          c: "The lone y has been treated as though it were nothing. A letter on its own has a coefficient of 1, so 3y − y is 2y.",
          d: "Unlike terms cannot be combined into one, and nothing here is multiplied. Three different kinds of term remain.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l62-expressions-from-words": {
    lessonId: "ma-l62-expressions-from-words",
    passMark: 70,
    questions: [
      {
        id: "maq62-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-words-to-operations",
        prompt: "Write an expression for 'five less than a number x'.",
        options: [
          { id: "a", text: "5 − x" },
          { id: "b", text: "x − 5" },
          { id: "c", text: "5x" },
          { id: "d", text: "x + 5" },
        ],
        correct: "b",
        explanation:
          "Test it with a number rather than arguing about word order. Five less than 12 is 7, and 12 − 5 = 7 while 5 − 12 = −7. So the number comes first and the 5 is taken off it.",
        whyWrong: {
          a: "This is the order the words appear in, and the phrase reverses it. Substituting 12 for x gives −7, which is not five less than twelve.",
          c: "That is five times x. Less than signals a subtraction.",
          d: "That is five MORE than x. The words less than mean the 5 comes off.",
        },
      },
      {
        id: "maq62-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-building-expressions",
        prompt:
          "Ada has n oranges. Bola has 5 more than Ada. Chidi has twice as many as Bola. How many do they have altogether?",
        options: [
          { id: "a", text: "4n + 15" },
          { id: "b", text: "4n + 10" },
          { id: "c", text: "3n + 5" },
          { id: "d", text: "2n + 5" },
        ],
        correct: "a",
        explanation:
          "Ada has n, Bola has n + 5, and Chidi has 2(n + 5) = 2n + 10. Total: n + n + 5 + 2n + 10 = 4n + 15. Check with n = 3: 3 + 8 + 16 = 27, and 4(3) + 15 = 27.",
        whyWrong: {
          b: "Chidi's bracket has been handled and Bola's own 5 has been dropped from the total. All three amounts are added, not just Ada's and Chidi's.",
          c: "This writes Chidi's amount as 2n + 5 instead of 2(n + 5), so Chidi's share is short by 5. Twice as many as Bola means twice the WHOLE of n + 5.",
          d: "This is Ada's and Bola's only. Chidi has been left out entirely.",
        },
      },
      {
        id: "maq62-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-al-choose-the-letter",
        prompt:
          "Why is 'Let x = money' a bad first line, and what would be better?",
        options: [
          { id: "a", text: "It is fine as long as the algebra that follows is correct" },
          {
            id: "b",
            text: "It names nothing measurable. 'Let c be the cost of one book in naira' says which quantity and in what unit",
          },
          { id: "c", text: "Because x should never be used for money" },
          { id: "d", text: "Because money must always be called m" },
        ],
        correct: "b",
        explanation:
          "Money is not a quantity; a cost in naira is. Naming the letter with its unit makes every later line meaningful and lets you read the final answer back into the situation.",
        whyWrong: {
          a: "The algebra can be perfect and still answer the wrong question, which is exactly what an unnamed letter allows to happen.",
          c: "Any letter may be used. The problem is the description, not the choice of symbol.",
          d: "There is no such rule. Choosing a letter that reminds you of the quantity is helpful and not required.",
        },
      },
      {
        id: "maq62-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-perimeter-area-algebra",
        prompt:
          "A rectangle is x cm long and 3 cm narrower than it is long. What is its perimeter?",
        options: [
          { id: "a", text: "4x − 6 cm" },
          { id: "b", text: "2x − 3 cm" },
          { id: "c", text: "x(x − 3) cm" },
          { id: "d", text: "4x − 3 cm" },
        ],
        correct: "a",
        explanation:
          "The sides are x and x − 3, so the perimeter is 2(x + x − 3) = 2(2x − 3) = 4x − 6 cm. Check with x = 10: a 10 by 7 rectangle has perimeter 34, and 4(10) − 6 = 34.",
        whyWrong: {
          b: "That is one length plus one width, which is half the perimeter. A rectangle has two of each side.",
          c: "That is the AREA, and it would be in cm². The perimeter adds the sides rather than multiplying them.",
          d: "The 3 has only been subtracted once. There are two widths of x − 3, so 6 comes off in total.",
        },
      },
      {
        id: "maq62-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-expression-vs-equation",
        prompt:
          "A student asked to simplify 5x + 3x writes '8x = 0, so x = 0'. What has gone wrong?",
        options: [
          { id: "a", text: "The arithmetic; 5x + 3x is not 8x" },
          {
            id: "b",
            text: "8x was the complete answer. An equals sign has been invented that nobody wrote, and then solved",
          },
          { id: "c", text: "They should have written 8x²" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correct: "b",
        explanation:
          "Simplify means write the expression as shortly as possible, and 8x is that. There is no equals sign in the question, so there is nothing to make true and nothing to solve.",
        whyWrong: {
          a: "5x + 3x = 8x is correct. The error is everything after it.",
          c: "8x² would come from multiplying the two terms. The question adds them.",
          d: "The extra lines answer a question that was never asked, and they assert that x is 0, which the question said nothing about.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l63-balance-method": {
    lessonId: "ma-l63-balance-method",
    passMark: 70,
    questions: [
      {
        id: "maq63-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-al-one-step",
        prompt: "Solve x + 9 = 4.",
        options: [
          { id: "a", text: "x = 13" },
          { id: "b", text: "x = −5" },
          { id: "c", text: "x = 5" },
          { id: "d", text: "There is no solution, since 4 is smaller than 9" },
        ],
        correct: "b",
        explanation:
          "Subtract 9 from both sides: x = 4 − 9 = −5. Check: −5 + 9 = 4. Correct. A negative solution is a perfectly ordinary answer.",
        whyWrong: {
          a: "This adds 9 instead of subtracting it. Adding repeats the operation rather than undoing it, and the inverse of adding is subtracting.",
          c: "The digits are right and the sign is wrong. Starting at 4 and moving 9 to the left crosses zero.",
          d: "There is a solution and it is below zero, which the directed numbers of Month 2 make perfectly readable.",
        },
      },
      {
        id: "maq63-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-al-balance-rule",
        prompt:
          "A student solving 3x + 5 = 20 writes '3x = 20' on the next line. What is wrong?",
        options: [
          { id: "a", text: "Nothing, as long as they subtract the 5 later" },
          {
            id: "b",
            text: "The line is false: 5 was taken off the left only, so the two sides are no longer equal and nothing after it can be trusted",
          },
          { id: "c", text: "They should have divided by 3 first" },
          { id: "d", text: "The 5 should have been taken off the right only" },
        ],
        correct: "b",
        explanation:
          "An equation claims the two sides have the same value. Change one side only and the claim stops being true, so the written line says something false. It should read 3x = 15.",
        whyWrong: {
          a: "There is no later. The line as written claims 3x = 20, and a marker reads what is written rather than what was intended.",
          c: "Dividing first is legal if done to both sides and is not what went wrong. The error is doing something to one side alone.",
          d: "That breaks the balance the other way, giving 3x + 5 = 15, which is also false.",
        },
      },
      {
        id: "maq63-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-two-step",
        prompt: "Solve 4x − 7 = 21.",
        options: [
          { id: "a", text: "x = 3.5" },
          { id: "b", text: "x = 7" },
          { id: "c", text: "x = 14" },
          { id: "d", text: "x = 5.25" },
        ],
        correct: "b",
        explanation:
          "Undo in reverse order: add 7 to both sides to get 4x = 28, then divide both by 4 to get x = 7. Check: 4(7) − 7 = 21.",
        whyWrong: {
          a: "This subtracts 7 instead of adding it, giving 4x = 14. The 7 was taken away from x, so adding it back is the inverse.",
          c: "This adds 7 correctly and then does not divide, or divides by 2. 4x = 28 needs dividing by 4.",
          d: "This divides 21 by 4 first while dividing only the 4x, leaving the 7 untouched. Dividing a side means dividing every term on it.",
        },
      },
      {
        id: "maq63-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-checking",
        prompt:
          "Why should a solution be checked in the ORIGINAL equation rather than in a line from your own working?",
        options: [
          { id: "a", text: "It makes no difference which line you use" },
          {
            id: "b",
            text: "Because a line from your working might already contain the error, so checking against it would confirm your own mistake",
          },
          { id: "c", text: "Because the original equation is shorter" },
          { id: "d", text: "Because markers only read the first line" },
        ],
        correct: "b",
        explanation:
          "The original equation is the only line you know is correct. Substituting into it either balances or does not, which makes it a conclusive test rather than a reassurance.",
        whyWrong: {
          a: "It makes all the difference. An answer derived from a wrong line will satisfy that wrong line perfectly.",
          c: "It is often longer. Being correct rather than short is why it is the right line to use.",
          d: "Markers read the whole solution. The reason concerns which line can be trusted, not which gets read.",
        },
      },
      {
        id: "maq63-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-al-equation-errors",
        prompt:
          "Which error would the substitution check FAIL to catch?",
        options: [
          { id: "a", text: "Taking a quantity off one side only" },
          { id: "b", text: "Using the wrong inverse operation" },
          { id: "c", text: "Dividing only one term on a side" },
          { id: "d", text: "None of them; substituting back catches all three" },
        ],
        correct: "d",
        explanation:
          "Each of those produces a value of the letter that does not satisfy the original equation, so all three fail the check. That is what makes substituting back worth more than the list of errors.",
        whyWrong: {
          a: "This gives a wrong value, which will not balance the original equation.",
          b: "Also gives a wrong value, and also fails the check.",
          c: "Also gives a wrong value. The check is complete rather than partial, which is unusual among checks.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l64-equations-from-problems": {
    lessonId: "ma-l64-equations-from-problems",
    passMark: 70,
    questions: [
      {
        id: "maq64-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-al-five-steps",
        prompt:
          "A taxi charges ₦500 plus ₦120 per km. A journey costs ₦2,300. How far was it?",
        options: [
          { id: "a", text: "15 km" },
          { id: "b", text: "19 km" },
          { id: "c", text: "23 km" },
          { id: "d", text: "1,800 km" },
        ],
        correct: "a",
        explanation:
          "Let d be the distance in km. Then 500 + 120d = 2,300, so 120d = 1,800 and d = 15. Check: 500 + 120(15) = 2,300.",
        whyWrong: {
          b: "This divides 2,300 by 120 without removing the fixed 500 charge first. The 500 is not part of the per-kilometre cost.",
          c: "This looks like 2,300 divided by 100, or the fixed charge subtracted from the wrong quantity.",
          d: "That is the amount charged for the distance, in naira, rather than the distance itself. Read what the question asked for.",
        },
      },
      {
        id: "maq64-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-does-it-make-sense",
        prompt:
          "Chairs cost ₦4,500 each. A school has ₦20,000. The equation gives 4.44 chairs. What is the answer to the question?",
        options: [
          { id: "a", text: "4.44 chairs" },
          { id: "b", text: "4 chairs, with ₦2,000 left over" },
          { id: "c", text: "5 chairs" },
          { id: "d", text: "The question cannot be answered" },
        ],
        correct: "b",
        explanation:
          "The algebra is correct and the situation decides the answer: you cannot buy part of a chair. Four chairs cost 18,000, leaving 2,000. Reading the answer back into the situation is the step that catches this.",
        whyWrong: {
          a: "Algebraically exact and impossible in the world. A count of chairs is a whole number.",
          c: "Five chairs would cost 22,500, which is more than the school has. Rounding up spends money that is not there.",
          d: "It can be answered, and the answer needs one more step after the arithmetic rather than fewer.",
        },
      },
      {
        id: "maq64-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-al-both-sides",
        prompt: "Solve 7x − 4 = 3x + 12.",
        options: [
          { id: "a", text: "x = 4" },
          { id: "b", text: "x = 1.6" },
          { id: "c", text: "x = 8" },
          { id: "d", text: "x = 2" },
        ],
        correct: "a",
        explanation:
          "Subtract 3x from both sides to get 4x − 4 = 12, add 4 to both to get 4x = 16, then divide by 4 to get x = 4. Check: 7(4) − 4 = 24 and 3(4) + 12 = 24. Both sides are 24.",
        whyWrong: {
          b: "This adds the 3x to the 7x instead of subtracting it, giving 10x = 16. Moving a term across the equals sign means subtracting it from both sides.",
          c: "This gathers the numbers but not the letters, or divides 16 by 2. The coefficient after gathering is 4.",
          d: "This looks like 4x = 8 somewhere, which would mean the 4 and the 12 were combined wrongly.",
        },
      },
      {
        id: "maq64-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-consecutive-problems",
        prompt:
          "Ada is 3 times as old as Bola. In 5 years she will be twice as old as Bola. How old is Bola now?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "10" },
          { id: "c", text: "15" },
          { id: "d", text: "3" },
        ],
        correct: "a",
        explanation:
          "Let b be Bola's age now, so Ada is 3b. In 5 years: 3b + 5 = 2(b + 5), giving 3b + 5 = 2b + 10 and b = 5. Check: Bola 5 and Ada 15 now; in five years Bola is 10 and Ada is 20, which is twice.",
        whyWrong: {
          b: "That is Bola's age in five years rather than now. The question asked for now.",
          c: "That is Ada's age now. Read which person the question asked about.",
          d: "This looks like the 3 from 'three times as old' copied across as an age.",
        },
      },
      {
        id: "maq64-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-al-where-next",
        prompt:
          "Plan A charges ₦2,000 plus ₦150 per unit. Plan B charges ₦3,500 plus ₦100 per unit. At how many units do they cost the same?",
        options: [
          { id: "a", text: "10 units" },
          { id: "b", text: "30 units" },
          { id: "c", text: "50 units" },
          { id: "d", text: "They never cost the same" },
        ],
        correct: "b",
        explanation:
          "Set them equal: 2,000 + 150u = 3,500 + 100u, so 50u = 1,500 and u = 30. Check: A gives 6,500 and B gives 6,500. Below 30 units Plan A is cheaper, and above it Plan B is.",
        whyWrong: {
          a: "This divides 1,500 by 150 rather than by the difference of 50. Both the fixed charges and both rates have to be accounted for.",
          c: "This looks like 2,000 subtracted from 3,500 and divided by 30, or a slip in gathering the terms.",
          d: "Plan B has the higher fixed charge and the lower rate, so it must overtake Plan A eventually. The equation finds where.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
