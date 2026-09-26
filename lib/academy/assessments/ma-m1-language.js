/**
 * ASSESSMENTS · MATHEMATICS · MONTH 1 · MODULE 1 · THE LANGUAGE OF MATHEMATICS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * These questions test READING rather than calculating, so almost none of
 * them require arithmetic. That is deliberate: the module is about what an
 * instruction is asking for, and a question that also demands a calculation
 * would stop measuring the thing it is supposed to measure.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l5-instructions": {
    lessonId: "ma-l5-instructions",
    passMark: 70,
    questions: [
      {
        id: "maq5-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-evaluate",
        prompt:
          "A question says: 'Evaluate 4x − 3 when x = 5.' A student writes 4(5) − 3 and stops. What is missing?",
        options: [
          { id: "a", text: "Nothing — that is a complete answer" },
          { id: "b", text: "The numerical value: 20 − 3 = 17" },
          { id: "c", text: "An equals sign and x = at the front" },
          { id: "d", text: "The expression should be factorised first" },
        ],
        correct: "b",
        explanation:
          "Evaluate means work it out until you have a single number. 4(5) − 3 is the substitution — the correct first step — but the evaluation is 17.",
        whyWrong: {
          a: "It is not complete. 'Evaluate' permits nothing unresolved in the answer, and 4(5) − 3 still has a calculation waiting in it.",
          c: "x = 5 was given, not asked for. Writing x = anything would answer 'solve', which is a different instruction.",
          d: "Factorising is a different instruction, and 4x − 3 has no common factor to take out anyway.",
        },
      },
      {
        id: "maq5-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-simplify",
        prompt: "Which instruction produces an answer that still contains a letter?",
        options: [
          { id: "a", text: "Evaluate 3x + 2 when x = 4" },
          { id: "b", text: "Solve 3x + 2 = 14" },
          { id: "c", text: "Simplify 3x + 2 + 5x" },
          { id: "d", text: "All three of them" },
        ],
        correct: "c",
        explanation:
          "Simplify produces an EXPRESSION — here 8x + 2 — which still contains x. Evaluate produces a number and solve produces a value of x.",
        whyWrong: {
          a: "Evaluate asks for a number. With x = 4 the answer is 14, and no letter survives.",
          b: "Solve asks for the value of the unknown. The answer is x = 4 — the letter appears as a label, but the answer itself is a number.",
          d: "Only one of the three keeps a letter in the body of the answer. That difference is the whole point of the lesson.",
        },
      },
      {
        id: "maq5-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-lang-solve",
        prompt:
          "A student is asked to 'Simplify 5x + 3x' and writes '8x = 0, so x = 0'. What has gone wrong?",
        options: [
          { id: "a", text: "The arithmetic — 5x + 3x is not 8x" },
          {
            id: "b",
            text: "They answered 'solve' instead of 'simplify', inventing an equals sign that was never in the question",
          },
          { id: "c", text: "They should have written 8, because the x is cancelled out" },
          { id: "d", text: "Nothing is wrong; 8x = 0 is a tidier form" },
        ],
        correct: "b",
        explanation:
          "5x + 3x = 8x is correct and is the complete answer. Adding '= 0' turns an expression into an equation nobody wrote, and then solves it. You can only solve something that already has an equals sign.",
        whyWrong: {
          a: "The arithmetic is right. 5 lots of x plus 3 lots of x is 8 lots of x.",
          c: "The x does not disappear. Five of something added to three of something is eight of that something, and saying WHAT there are eight of is part of the answer.",
          d: "8x and 8x = 0 are different objects. The first is an expression with any value; the second is a claim that is only true when x is zero.",
        },
      },
      {
        id: "maq5-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-express",
        prompt:
          "A question says: 'Express 4,072 in words.' Which answer does the instruction accept?",
        options: [
          { id: "a", text: "4,072" },
          { id: "b", text: "Four thousand, seventy two" },
          { id: "c", text: "Four thousand and seventy two" },
          { id: "d", text: "Four zero seven two" },
        ],
        correct: "c",
        explanation:
          "The instruction names the form the answer must take, and the form here is words. Four thousand and seventy two is the number written as English, with the and placed before the part below a hundred.",
        whyWrong: {
          a: "That is the number in figures, which is the form the question gave you. Copying the question back is not answering it.",
          b: "Close, and it has dropped the and. Standard written form places an and before the tens and units.",
          d: "Those are the names of the four digits read one at a time, which is a way of reading a phone number rather than a quantity.",
        },
      },
      {
        id: "maq5-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-lang-why",
        prompt:
          "Why do examiners describe answering the wrong instruction as the cheapest source of lost marks?",
        options: [
          {
            id: "a",
            text: "Because it happens to candidates who do not know the mathematics",
          },
          {
            id: "b",
            text: "Because the mathematics is often entirely correct, and the mark is lost purely on the form of the answer",
          },
          { id: "c", text: "Because instructions are deliberately made ambiguous" },
          { id: "d", text: "Because it only affects the final answer mark, which is worth little" },
        ],
        correct: "b",
        explanation:
          "A candidate who simplifies correctly when asked to solve has done real mathematics and still scores nothing, because the mark scheme is written against the instruction. Nothing about their ability caused the loss.",
        whyWrong: {
          a: "It happens most often to candidates who DO know the mathematics — they recognise the content, start working, and never look at the instruction.",
          c: "Instructions are standardised precisely so they are not ambiguous. That is why they can be learned.",
          d: "It can cost every mark on a question, not just the final one, because working towards the wrong kind of answer earns no method marks either.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l6-marks-words": {
    lessonId: "ma-l6-marks-words",
    passMark: 70,
    questions: [
      {
        id: "maq6-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-hence",
        prompt:
          "Part (a) asks you to work out 36 × 8, and you get 288. Part (b) says 'Hence work out 36 × 16.' What does 'hence' instruct you to do?",
        options: [
          { id: "a", text: "Set out the whole multiplication again with 16" },
          { id: "b", text: "Double the answer to part (a), because 16 is twice 8" },
          { id: "c", text: "Add 36 to the answer to part (a)" },
          { id: "d", text: "Check that part (a) was correct" },
        ],
        correct: "b",
        explanation:
          "Sixteen is two eights, so 36 lots of 16 is twice 36 lots of 8. Double 288 to get 576. One line, using work that is already on the page and already marked.",
        whyWrong: {
          a: "That is exactly what hence exists to stop you doing. It reaches the same answer and takes several times as long, on a part worth fewer marks.",
          c: "Adding 36 once would answer 36 × 9. The jump from 8 to 16 is a doubling, not a step of one.",
          d: "Checking is sensible and it is not what the word instructs. Hence is about using the result, not verifying it.",
        },
      },
      {
        id: "maq6-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-showthat",
        prompt:
          "A 4-mark question says 'Show that 8 crates of eggs at ₦4,500 each cost ₦36,000.' A candidate writes only '= ₦36,000'. Roughly what will they score?",
        options: [
          { id: "a", text: "Full marks — the answer is correct" },
          { id: "b", text: "Nothing or almost nothing, because every mark is a working mark" },
          { id: "c", text: "Half marks, as a compromise" },
          { id: "d", text: "Full marks if they write 'as required' afterwards" },
        ],
        correct: "b",
        explanation:
          "In a show that, the answer is printed in the question, so the answer cannot possibly be what is being marked. The marks are for the working: splitting the ₦4,500 into ₦4,000 and ₦500, multiplying each by 8, and adding the two results. Those are the steps the candidate left out.",
        whyWrong: {
          a: "Copying the given answer back demonstrates nothing. The examiner already knows the total is ₦36,000, which is exactly why they printed it.",
          c: "Mark schemes award specific steps. A script with no steps matches none of them.",
          d: "'As required' is a convention for ending the working, not a substitute for having any.",
        },
      },
      {
        id: "maq6-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-lang-accuracy",
        prompt:
          "A calculation gives 4.6666… at an intermediate stage. The final answer is wanted to 2 decimal places. What should the candidate do with the 4.6666…?",
        options: [
          { id: "a", text: "Round it to 4.67 immediately and carry that forward" },
          { id: "b", text: "Round it to 4.7 to keep the numbers manageable" },
          {
            id: "c",
            text: "Carry the full value forward and round only the final answer",
          },
          { id: "d", text: "Round it to the nearest whole number, 5" },
        ],
        correct: "c",
        explanation:
          "Rounding once, at the end, is the rule. Rounding an intermediate value pushes a small error into every later step, and by the final answer it can be large enough to change the second decimal place — which is exactly the place being marked.",
        whyWrong: {
          a: "Even rounding to the required accuracy mid-calculation introduces error. The instruction is about the FINAL answer.",
          b: "This is worse: it rounds further than required and then carries the error through the rest of the working.",
          d: "Rounding to a whole number mid-calculation discards most of the accuracy the question is asking for.",
        },
      },
      {
        id: "maq6-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-form-words",
        prompt:
          "A construction question says 'using a ruler and a pair of compasses only'. A candidate constructs the angle correctly, then rubs out the arcs to make the diagram neat. What happens?",
        options: [
          { id: "a", text: "Nothing — the construction is correct" },
          { id: "b", text: "They gain marks for presentation" },
          {
            id: "c",
            text: "They lose method marks, because the arcs were the evidence that it was constructed rather than measured",
          },
          { id: "d", text: "The answer is invalid and must be redone" },
        ],
        correct: "c",
        explanation:
          "In a construction, the arcs are the working. Without them the diagram is indistinguishable from one drawn with a protractor, which the instruction forbade, so the method marks cannot be awarded.",
        whyWrong: {
          a: "The construction may well be correct, but correctness that cannot be evidenced cannot be marked.",
          b: "There are no presentation marks in a mathematics paper. There are accuracy marks and method marks.",
          d: "It is not invalid — the accuracy mark for a correctly drawn angle may still stand. It is the method marks that are lost.",
        },
      },
      {
        id: "maq6-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-units",
        prompt: "A rectangle measures 9 m by 4 m. Which answer is written correctly?",
        options: [
          { id: "a", text: "Area = 36 m" },
          { id: "b", text: "Area = 36 m²" },
          { id: "c", text: "Area = 26 m²" },
          { id: "d", text: "Area = 36 m³" },
        ],
        correct: "b",
        explanation:
          "Area is length × width = 9 × 4 = 36, and multiplying metres by metres gives square metres.",
        whyWrong: {
          a: "The value is right but m is a unit of length. An area written in metres tells a marker you do not know what the formula produced.",
          c: "26 is the perimeter, 2(9 + 4). That is a length, and it would be written in m.",
          d: "Cubic metres are for volume, which needs three lengths multiplied together. A rectangle is flat.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l7-parts": {
    lessonId: "ma-l7-parts",
    passMark: 70,
    questions: [
      {
        id: "maq7-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-term",
        prompt: "How many terms are there in 7a − 4b + 2ab − 9?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "6" },
        ],
        correct: "b",
        explanation:
          "Terms are separated by + and − signs: 7a, −4b, +2ab, −9. Four terms. Note that 2ab is one term, not two, because a and b are multiplied.",
        whyWrong: {
          a: "This counts 2ab as part of another term, or misses the constant. Every piece between the signs counts, including the number at the end.",
          c: "This counts the letters rather than the terms. 2ab contains two letters but is a single term.",
          d: "This counts every symbol. Terms are separated by + and − only.",
        },
      },
      {
        id: "maq7-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-coefficient",
        prompt: "In the expression 6x − 7, what is the constant term?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "−7" },
          { id: "c", text: "6" },
          { id: "d", text: "6x" },
        ],
        correct: "b",
        explanation:
          "The constant term is the one with no letter in it, and the sign sitting in front of a term belongs to that term. The expression is 6x plus negative 7, so the constant term is −7.",
        whyWrong: {
          a: "The digits are right and the sign has been dropped. A minus in front of a term is part of the term, not punctuation between terms, and dropping it is the commonest slip there is with this word.",
          c: "6 is the coefficient of x, because it is the number multiplying the letter. The constant is the term standing alone.",
          d: "6x is a whole term rather than a constant, and it has a letter in it, which is exactly what a constant does not have.",
        },
      },
      {
        id: "maq7-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-factor",
        prompt: "What does the instruction 'factorise' ask you to turn an expression into?",
        options: [
          { id: "a", text: "A sum of terms" },
          { id: "b", text: "A product of factors" },
          { id: "c", text: "A single number" },
          { id: "d", text: "An equation with x on one side" },
        ],
        correct: "b",
        explanation:
          "Terms add; factors multiply. Factorising rewrites something built by adding as something built by multiplying: 3x + 6 becomes 3(x + 2).",
        whyWrong: {
          a: "That is what EXPANDING produces. Expanding and factorising are exact opposites, which is why they are so easy to confuse.",
          c: "A single number is what 'evaluate' produces, and factorising usually leaves letters in place.",
          d: "That is 'solve', or 'make x the subject'. Factorising does not need an equals sign at all.",
        },
      },
      {
        id: "maq7-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-lang-kinds",
        prompt: "Which of these can be SOLVED, and why?",
        options: [
          { id: "a", text: "5y − 2, because it contains a letter" },
          { id: "b", text: "5y − 2 = 13, because it is an equation" },
          { id: "c", text: "distance = speed × time, because it contains an equals sign" },
          { id: "d", text: "All three, since all three contain letters" },
        ],
        correct: "b",
        explanation:
          "Solving means finding the value of the unknown that makes an equation true. That needs an equals sign and a particular unknown to find. 5y − 2 = 13 gives y = 3.",
        whyWrong: {
          a: "5y − 2 is an expression. With no equals sign there is nothing to make true, so there is nothing to solve — it can only be simplified or evaluated.",
          c: "That is a formula: a general rule relating quantities, true for every journey there has ever been. You can put numbers into it, or rearrange it to make speed the subject, and on its own there is no particular unknown waiting to be found.",
          d: "Containing a letter is not the test. The test is whether there is an equation with an unknown in it.",
        },
      },
      {
        id: "maq7-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-equals",
        prompt: "What is wrong with the line of working: 8 + 5 = 13 × 3 = 39 − 9 = 30?",
        options: [
          { id: "a", text: "Nothing — it shows the order of the calculation" },
          { id: "b", text: "The arithmetic is wrong somewhere in it" },
          {
            id: "c",
            text: "It claims 13 = 39 and 39 = 30, because the equals sign means 'has the same value as'",
          },
          { id: "d", text: "It should use arrows instead of the first equals sign only" },
        ],
        correct: "c",
        explanation:
          "Each individual calculation is right, but strung together with equals signs the line makes two false claims. Write one equality per line: 8 + 5 = 13, then 13 × 3 = 39, then 39 − 9 = 30.",
        whyWrong: {
          a: "The equals sign is not a way of writing 'and then'. Using it as one produces statements that are simply untrue.",
          b: "Every individual step is arithmetically correct. The fault is in what the line as a whole asserts.",
          d: "Arrows would be better than false equals signs, but the standard fix is one statement per line.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l8-reading": {
    lessonId: "ma-l8-reading",
    passMark: 70,
    questions: [
      {
        id: "maq8-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-lang-method",
        prompt:
          "A question reads: 'A trader buys 24 cartons of eggs at ₦4,500 each and sells them at a profit of 15%. Find the selling price of ONE carton.' Which number is not needed?",
        options: [
          { id: "a", text: "24" },
          { id: "b", text: "4,500" },
          { id: "c", text: "15" },
          { id: "d", text: "All three are needed" },
        ],
        correct: "a",
        explanation:
          "The question asks about one carton. Its selling price is ₦4,500 + 15% = ₦5,175. The 24 is there to see whether you notice that the question narrowed to a single carton.",
        whyWrong: {
          b: "₦4,500 is the cost price of one carton — the figure the profit is calculated on.",
          c: "15% is the profit rate. Without it there is no selling price to find.",
          d: "Questions routinely include quantities you do not need, specifically to test whether you read which ones the question asks about.",
        },
      },
      {
        id: "maq8-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-lang-answering-asked",
        prompt:
          "'Ada is 5 years older than Bola. Together they are 31. How old is Ada?' A student lets Bola be x, solves correctly to get x = 13, and writes 13. What mark should this get?",
        options: [
          { id: "a", text: "Full marks — the algebra is perfect" },
          {
            id: "b",
            text: "Method marks but not the answer mark, because 13 is Bola's age and Ada's was asked for",
          },
          { id: "c", text: "No marks at all, since the answer is wrong" },
          { id: "d", text: "Full marks, because the examiner can see what was meant" },
        ],
        correct: "b",
        explanation:
          "The working is right and would earn the method marks. But x was defined as Bola, so 13 is Bola. Ada is 13 + 5 = 18, and that is the answer the question named.",
        whyWrong: {
          a: "Perfect algebra that answers a different question does not earn the answer mark. This is the commonest way a correct solution scores less than it should.",
          c: "The method is sound and mark schemes award method separately, so some marks survive.",
          d: "Examiners mark what is written. A number with no sentence around it cannot be assumed to mean something other than what it says.",
        },
      },
      {
        id: "maq8-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-lang-diagram",
        prompt:
          "'Two thirds of a tank is full. 240 litres are added and it becomes full. Find the capacity.' A student answers 160 litres. What did they most likely do?",
        options: [
          { id: "a", text: "They divided 240 by 1.5" },
          {
            id: "b",
            text: "They took 2/3 of 240, instead of seeing that 240 litres is the EMPTY third",
          },
          { id: "c", text: "They added 240 to two thirds" },
          { id: "d", text: "They made an arithmetic slip; the method was right" },
        ],
        correct: "b",
        explanation:
          "2/3 of 240 is 160. The 240 litres fills the part that was empty, which is one third, so the capacity is 3 × 240 = 720 litres. A bar drawn in three parts makes this visible immediately.",
        whyWrong: {
          a: "240 ÷ 1.5 is also 160, so the arithmetic is indistinguishable — but either route treats 240 as a fraction OF the tank rather than as the missing part.",
          c: "That would not produce 160, and adding a volume to a fraction is not a meaningful operation.",
          d: "The method is exactly what is wrong. The arithmetic is faultless.",
        },
      },
      {
        id: "maq8-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-lang-checking",
        prompt:
          "A student calculates what percentage 18 is of 45 and gets 250%. Without redoing the calculation, what does the answer tell you?",
        options: [
          { id: "a", text: "Nothing — percentages above 100 are perfectly normal" },
          {
            id: "b",
            text: "The division was done the wrong way round, since a part of a whole cannot exceed 100%",
          },
          { id: "c", text: "They forgot to multiply by 100" },
          { id: "d", text: "They should have used a fraction instead" },
        ],
        correct: "b",
        explanation:
          "18 is smaller than 45, so it must be less than 100% of it. 250% is 45 ÷ 18 × 100 — the two numbers the wrong way up. The correct answer is 18 ÷ 45 × 100 = 40%.",
        whyWrong: {
          a: "Percentages above 100 are normal for increases and comparisons, but not when one quantity is being expressed as a part of a larger one.",
          c: "Forgetting the 100 would give 0.4, not 250. The error is in the order of the division.",
          d: "A fraction would have the same problem if written upside down. The fix is noticing which quantity is the whole.",
        },
      },
      {
        id: "maq8-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-lang-recap",
        prompt:
          "Three questions use the same numbers: (i) Simplify 12/18 (ii) Evaluate 12/18 as a decimal (iii) Solve 12/x = 18. What does this show?",
        options: [
          { id: "a", text: "That all three have the same answer" },
          {
            id: "b",
            text: "That the instruction, not the numbers, decides what kind of answer is wanted",
          },
          { id: "c", text: "That fractions and decimals are interchangeable" },
          { id: "d", text: "That (iii) cannot be answered without more information" },
        ],
        correct: "b",
        explanation:
          "The answers are 2/3, 0.666… and x = 2/3 respectively — a simplified fraction, a number, and a value of an unknown. Identical content, three different instructions, three different kinds of complete answer.",
        whyWrong: {
          a: "Two of them happen to have the same VALUE, but they are different kinds of answer and the third is a different value altogether.",
          c: "They can be converted between, but a question that names one form is asking for that form. That is the lesson, not the opposite of it.",
          d: "(iii) is a complete equation: 12/x = 18 gives 12 = 18x, so x = 2/3.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
