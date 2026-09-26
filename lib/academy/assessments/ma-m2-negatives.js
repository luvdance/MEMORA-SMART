/**
 * ASSESSMENTS · MATHEMATICS · MONTH 2 · MODULE 3 · DIRECTED NUMBERS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * There is one error this module exists to prevent, and it is tested three
 * times from three directions: applying the multiplying sign rule to an
 * addition. A student who believes two minuses make a plus will answer
 * −5 + −3 as 8 for years, and will never be told, because the wrong answer
 * looks like an arithmetic slip rather than a rule misfiring.
 *
 * Ordering negatives is tested separately, because −18 being smaller than −3
 * fails for a different reason: it is a misreading of size, not of sign.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l25-position": {
    lessonId: "ma-l25-position",
    passMark: 70,
    questions: [
      {
        id: "maq25-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dn-ordering",
        prompt: "Which of these is the SMALLEST number?",
        options: [
          { id: "a", text: "−3" },
          { id: "b", text: "−18" },
          { id: "c", text: "0" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation:
          "Further left on the line means smaller, and −18 is eighteen steps left of zero while −3 is only three. The digits grow while the number shrinks, which is why this question catches people.",
        whyWrong: {
          a: "−3 is negative and it is only three steps below zero, so it sits to the RIGHT of −18 and is therefore larger.",
          c: "Zero is larger than every negative number, because everything negative lies to its left.",
          d: "2 is the largest of the four, not the smallest.",
        },
      },
      {
        id: "maq25-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-dn-distance",
        prompt:
          "A debt of ₦18,000 and a debt of ₦3,000. Which is the larger NUMBER, and which is the larger DEBT?",
        options: [
          { id: "a", text: "−18,000 is both the larger number and the larger debt" },
          {
            id: "b",
            text: "−3,000 is the larger number, and −18,000 is the larger debt",
          },
          { id: "c", text: "−3,000 is both the larger number and the larger debt" },
          { id: "d", text: "The question is meaningless, since debts are not numbers" },
        ],
        correct: "b",
        explanation:
          "Two different questions are being asked. Position on the line says −3,000 is further right and so larger. Distance from zero says −18,000 is further away and so the bigger debt. Both answers are correct because they answer different questions.",
        whyWrong: {
          a: "The debt is larger and the number is not. −18,000 lies further left, which makes it the smaller number.",
          c: "The number part is right and the debt part is not. Owing ₦18,000 is worse than owing ₦3,000.",
          d: "Debts are exactly what negative numbers were invented to record, and both questions have clear answers.",
        },
      },
      {
        id: "maq25-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dn-opposites",
        prompt: "What is the opposite of −7?",
        options: [
          { id: "a", text: "−7" },
          { id: "b", text: "7" },
          { id: "c", text: "0" },
          { id: "d", text: "−14" },
        ],
        correct: "b",
        explanation:
          "The opposite of a number is the one the same distance from zero on the other side. −7 is seven steps left, so its opposite is seven steps right, which is 7.",
        whyWrong: {
          a: "A number is its own opposite only in the case of zero, which sits on both sides at once because it sits on neither.",
          c: "Zero is what a number and its opposite ADD UP TO. It is not the opposite itself.",
          d: "That doubles the distance from zero rather than reflecting it across. The opposite keeps the distance and changes the side.",
        },
      },
      {
        id: "maq25-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-dn-contexts",
        prompt:
          "A lift is on level −2 and goes up 5 floors. Which calculation matches, and what floor does it reach?",
        options: [
          { id: "a", text: "−2 − 5, reaching level −7" },
          { id: "b", text: "−2 + 5, reaching level 3" },
          { id: "c", text: "2 + 5, reaching level 7" },
          { id: "d", text: "5 − 2, reaching level 3 by a different route that is also correct" },
        ],
        correct: "b",
        explanation:
          "Going up is movement to the right, so it is an addition. Starting at −2 and moving 5 right passes through zero and lands on 3, which is the third floor.",
        whyWrong: {
          a: "Subtracting would mean going down, and the lift went up. This answer describes a lift heading for level −7.",
          c: "The starting floor was −2, not 2. Dropping the sign loses the two floors below ground the lift had to climb through.",
          d: "The arithmetic reaches the right answer and the reasoning is backwards. It reads as starting at floor 5 and descending 2, which is a different journey that happens to end in the same place. Month 2 wants the movement described correctly, because in the next lesson the two stop agreeing.",
        },
      },
      {
        id: "maq25-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-line",
        prompt:
          "On the number line, what does the SIGN of a number tell you?",
        options: [
          { id: "a", text: "How far the number is from zero" },
          { id: "b", text: "Which side of zero the number sits on" },
          { id: "c", text: "Whether the number is large or small in size" },
          { id: "d", text: "Whether the number is a whole number" },
        ],
        correct: "b",
        explanation:
          "A number carries two separate pieces of information: a side and a distance. The sign is the side, and the digits are the distance. Keeping those apart is what makes the rest of this module straightforward.",
        whyWrong: {
          a: "That is what the digits tell you. −9 and 9 are the same distance from zero and have different signs.",
          c: "Size in the sense of distance from zero is carried by the digits. The sign says nothing about it.",
          d: "Both −3.5 and −4 are negative, so the sign says nothing about whether a number is whole.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l26-add-subtract": {
    lessonId: "ma-l26-add-subtract",
    passMark: 70,
    questions: [
      {
        id: "maq26-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-two-signs",
        prompt: "What is −5 + (−3)?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "−8" },
          { id: "c", text: "−2" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation:
          "The plus and the minus next to each other are different signs, so they combine into a minus: the calculation is −5 − 3. Starting at −5 and moving 3 further left lands on −8.",
        whyWrong: {
          a: "This is the multiplying rule applied to an addition, and it is the single commonest error in this module. Two minuses make a plus when you MULTIPLY. Adding two debts has never once produced a credit.",
          c: "This has treated the 3 as positive and subtracted it from 5. Both numbers here are on the negative side.",
          d: "Same error as the first option, with the arithmetic also going the wrong way.",
        },
      },
      {
        id: "maq26-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-subtract",
        prompt: "What is 4 − (−6)?",
        options: [
          { id: "a", text: "−2" },
          { id: "b", text: "10" },
          { id: "c", text: "−10" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation:
          "Two minuses next to each other are the same sign, so they combine into a plus: the calculation is 4 + 6 = 10. Subtracting a negative moves you to the right, because you are removing something that was pulling left.",
        whyWrong: {
          a: "This has treated the calculation as 4 − 6. The bracket holds a negative number, and subtracting it reverses that direction.",
          c: "This has added the two distances and then made the result negative. The movement here is rightward, so the answer is above 4, not below zero.",
          d: "This looks like 6 − 4. Neither number has been used in the position it was written in.",
        },
      },
      {
        id: "maq26-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dn-strategy",
        prompt:
          "Faced with 7 + (−2) − (−5), what is the first thing to do?",
        options: [
          { id: "a", text: "Work left to right immediately, one number at a time" },
          {
            id: "b",
            text: "Deal with the adjacent signs first, turning it into 7 − 2 + 5",
          },
          { id: "c", text: "Add all three numbers and then decide the sign at the end" },
          { id: "d", text: "Apply the rule that two minuses make a plus to every sign in the line" },
        ],
        correct: "b",
        explanation:
          "Simplify the signs before moving anything. Plus next to minus becomes minus, and minus next to minus becomes plus, so the line becomes 7 − 2 + 5 = 10, which is an ordinary calculation with no signed numbers left in it.",
        whyWrong: {
          a: "Going straight into the arithmetic while the double signs are still there is exactly where sign errors happen. Tidying first costs a few seconds and removes the risk.",
          c: "The sign is not something decided at the end in an addition. Each movement has its own direction and they have to be followed in order.",
          d: "The rule applies only where two signs are actually side by side. Applied everywhere it changes signs that were never doubled, which is a different calculation.",
        },
      },
      {
        id: "maq26-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dn-context-arith",
        prompt:
          "The temperature was −4 °C at dawn and rose by 11 degrees by midday, then fell 6 degrees by evening. What was the evening temperature?",
        options: [
          { id: "a", text: "1 °C" },
          { id: "b", text: "−21 °C" },
          { id: "c", text: "21 °C" },
          { id: "d", text: "13 °C" },
        ],
        correct: "a",
        explanation:
          "Start at −4, move 11 right to reach 7, then move 6 left to reach 1. Written as one line it is −4 + 11 − 6 = 1, and every step is a start and a movement.",
        whyWrong: {
          b: "Everything has been added together as though all three were falls. Only the last change was a fall.",
          c: "The starting temperature has been treated as 4 rather than −4, and the fall has been added as a rise.",
          d: "The rise has been handled correctly and the fall has been ignored or added. 7 − 6 is 1, not 13.",
        },
      },
      {
        id: "maq26-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-movement",
        prompt:
          "Adding a negative number moves you in which direction along the line?",
        options: [
          { id: "a", text: "Right, because adding always increases a number" },
          { id: "b", text: "Left, because the number being added points that way" },
          { id: "c", text: "It depends on whether the starting number is positive" },
          { id: "d", text: "Nowhere, since you cannot add a negative number" },
        ],
        correct: "b",
        explanation:
          "Adding means take the movement this number describes. A negative number describes a leftward movement, so adding it moves you left whatever you started from.",
        whyWrong: {
          a: "Adding increases a number only when the number added is positive. That is the assumption this lesson exists to break.",
          c: "The starting point decides where you end up and not which way you travel. The direction comes from the number being added.",
          d: "You can, and it happens constantly: a payment out of an account, a fall in temperature, a loss in a business.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l27-multiply-divide": {
    lessonId: "ma-l27-multiply-divide",
    passMark: 70,
    questions: [
      {
        id: "maq27-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dn-sign-first",
        prompt: "What is (−6) × (−7)?",
        options: [
          { id: "a", text: "−42" },
          { id: "b", text: "42" },
          { id: "c", text: "−13" },
          { id: "d", text: "13" },
        ],
        correct: "b",
        explanation:
          "Take the sign first: both are negative, and the same signs multiplied give a positive. Then the digits: 6 × 7 = 42. So the answer is 42.",
        whyWrong: {
          a: "The digits are right and the sign is wrong. Two negatives multiplied give a positive, which is the rule this lesson argues for rather than asserts.",
          c: "This has added the digits instead of multiplying them. The operation here is a multiplication.",
          d: "Same addition error, and with the sign happening to come out right for the wrong reason.",
        },
      },
      {
        id: "maq27-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dn-neg-times-neg",
        prompt:
          "Why must a negative multiplied by a negative give a positive? What forces it?",
        options: [
          { id: "a", text: "Nothing forces it. It is a convention that was agreed on for convenience" },
          {
            id: "b",
            text: "Any other answer would break the distributive law, so it is the only value that lets the rest of arithmetic stay consistent",
          },
          { id: "c", text: "Because two wrongs make a right" },
          { id: "d", text: "Because negative numbers are not really numbers, so the usual rules do not apply" },
        ],
        correct: "b",
        explanation:
          "This is the honest answer and it is worth more than the memory aid. Once negatives are allowed in, the laws from the previous module force the value: if a negative times a negative were anything but positive, the distributive law would give two different answers for the same expression.",
        whyWrong: {
          a: "Mathematicians genuinely did argue about it for centuries, and the argument ended because the value turned out not to be free. Choosing anything else breaks arithmetic elsewhere.",
          c: "This is a phrase people repeat and it explains nothing. It also does not survive contact with addition, where two negatives certainly do not make a positive.",
          d: "They are numbers in exactly the same sense as any others, and the usual rules are precisely what pins this answer down.",
        },
      },
      {
        id: "maq27-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-two-rule-sets",
        prompt:
          "A student says: two minuses make a plus. Applied to which of these calculations does that give the WRONG answer?",
        options: [
          { id: "a", text: "(−4) × (−5)" },
          { id: "b", text: "−4 + (−5)" },
          { id: "c", text: "(−20) ÷ (−5)" },
          { id: "d", text: "6 − (−5)" },
        ],
        correct: "b",
        explanation:
          "Here the two negatives are being ADDED, and adding two negatives gives a more negative answer: −9. The same signs rule belongs to multiplying and dividing, and applying it to an addition gives 9, which is wrong by eighteen.",
        whyWrong: {
          a: "Two negatives multiplied do give a positive, so the rule works here: the answer is 20.",
          c: "Division follows the same sign rules as multiplication, so this gives 4 and the rule holds.",
          d: "Here the two signs really are adjacent, so they do combine: 6 + 5 = 11. The rule is being used correctly.",
        },
      },
      {
        id: "maq27-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-dn-powers",
        prompt:
          "Using the raised number notation from Month 1, which statement is true?",
        options: [
          { id: "a", text: "(−2)² and −2² are the same thing, both equal to 4" },
          {
            id: "b",
            text: "(−2)² is 4, because the whole of −2 is multiplied by itself, while −2² is −4, because only the 2 is",
          },
          { id: "c", text: "Both are −4" },
          { id: "d", text: "Brackets never change the value of an expression" },
        ],
        correct: "b",
        explanation:
          "The bracket decides what the raised number applies to. In (−2)² the whole signed number is multiplied by itself, giving 4. In −2² only the 2 is, giving 4, and then the minus is applied, giving −4.",
        whyWrong: {
          a: "They differ, and a calculator will show you: typing one gets 4 and typing the other gets −4.",
          c: "(−2)² is two negatives multiplied together, and two negatives multiplied give a positive.",
          d: "Brackets change values constantly, which is why they are the first rank in BODMAS. Here they are the whole difference between the two expressions.",
        },
      },
      {
        id: "maq27-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-dn-neg-times-pos",
        prompt:
          "What does (−3) × 4 mean, read as repeated addition, and what does it come to?",
        options: [
          { id: "a", text: "Three lots of −4, which is 12" },
          { id: "b", text: "Four lots of −3, which is −12" },
          { id: "c", text: "−3 added to 4, which is 1" },
          { id: "d", text: "Three taken away four times, which is 12" },
        ],
        correct: "b",
        explanation:
          "Multiplying by 4 means four of them, and the thing there are four of is −3. Four leftward steps of 3 each land on −12, which is why a negative times a positive is negative without needing a rule.",
        whyWrong: {
          a: "The count and the thing counted have been swapped, and the sign has then been dropped. Four lots of −3 and three lots of −4 both come to −12, not 12.",
          c: "That is an addition. The operation written here is a multiplication.",
          d: "The direction of travel is right and the sign of the answer is not. Four steps down from zero is below zero.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l28-in-use": {
    lessonId: "ma-l28-in-use",
    passMark: 70,
    questions: [
      {
        id: "maq28-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-dn-brackets",
        prompt:
          "Why write brackets round a negative value as you substitute it into an expression?",
        options: [
          { id: "a", text: "Because the marker expects to see them, though they make no difference" },
          {
            id: "b",
            text: "Because without them the minus sign detaches from its number and ends up applying to the wrong thing",
          },
          { id: "c", text: "Because brackets make the working look longer and earn more marks" },
          { id: "d", text: "There is no reason; it is a habit some teachers have" },
        ],
        correct: "b",
        explanation:
          "A minus sign written loose in the middle of an expression is ambiguous, and the order of operations will resolve that ambiguity against you. The brackets keep the sign attached to the number it belongs to, which costs a second and prevents the commonest error in the module.",
        whyWrong: {
          a: "They make a real difference to the value, not only to the presentation. Without them the arithmetic genuinely changes.",
          c: "Length earns nothing. Correct working earns marks, and the brackets are there to keep the working correct.",
          d: "It is a habit, and it is a habit with a reason. Every experienced solver has it because they have all been caught without it.",
        },
      },
      {
        id: "maq28-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dn-checking",
        prompt:
          "A question says a temperature of −3 °C fell by 8 degrees. A student answers 5 °C. What is the fastest way to know this is wrong without redoing the arithmetic?",
        options: [
          { id: "a", text: "Check the subtraction digit by digit" },
          {
            id: "b",
            text: "Notice that a temperature which fell cannot end up higher than it started",
          },
          { id: "c", text: "Look up the answer" },
          { id: "d", text: "There is no way to know without redoing it" },
        ],
        correct: "b",
        explanation:
          "Decide which side of the start the answer must be on before you calculate. It fell, so it must be below −3, and 5 is above it. That check takes a second, needs no arithmetic, and catches sign errors which are otherwise invisible.",
        whyWrong: {
          a: "That works and it is slower, and it will not help if the error was in the sign rather than the digits. The digits here are perfectly correct: 3 and 8 do make 5.",
          c: "In an exam there is nothing to look up. The point of the check is that it is available while you are working.",
          d: "The direction of the answer was knowable before any calculating began, which is exactly what makes this check worth having.",
        },
      },
      {
        id: "maq28-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-dn-common-errors",
        prompt:
          "Which of these four is the error MOST likely to survive unnoticed for years?",
        options: [
          { id: "a", text: "Dropping a minus sign while copying a line" },
          {
            id: "b",
            text: "Using the multiplying sign rule on an addition, because the answer looks like a slip rather than a wrong rule",
          },
          { id: "c", text: "Writing the answer without a unit" },
          { id: "d", text: "Forgetting to show working" },
        ],
        correct: "b",
        explanation:
          "A misapplied rule is worse than a slip, because a slip is random and a rule is consistent. A student who believes two minuses make a plus in an addition will get −5 + (−3) wrong every single time, and will be told only that the answer was wrong, never that the rule was.",
        whyWrong: {
          a: "A real error and a random one, so it shows up as scattered wrong answers rather than a systematic pattern, and it is usually spotted on checking.",
          c: "Costly in marks and easy to notice, because a marker or a teacher points at the missing unit directly.",
          d: "Visible to anyone reading the script, so it gets corrected early rather than lasting for years.",
        },
      },
      {
        id: "maq28-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dn-where-next",
        prompt:
          "Where do directed numbers appear again after this module?",
        options: [
          { id: "a", text: "Nowhere. The topic finishes here" },
          {
            id: "b",
            text: "Throughout: in coordinates, in gradients, in solving equations, and in every later topic where a quantity can go either way",
          },
          { id: "c", text: "Only in Month 9" },
          { id: "d", text: "Only when a question specifically says the numbers are negative" },
        ],
        correct: "b",
        explanation:
          "Negatives stop being a topic and become part of the background. Coordinates need all four quadrants, gradients can slope either way, and equations produce negative solutions constantly, so a sign error made here reappears in every one of those places.",
        whyWrong: {
          a: "It is one of the few topics in the course that genuinely never finishes.",
          c: "Month 9 uses them heavily and so does every month between here and there, starting with the coordinate work in Month 5.",
          d: "A question does not have to warn you. Negatives show up in the middle of the working of questions that began entirely positive.",
        },
      },
      {
        id: "maq28-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dn-foundation-review",
        prompt:
          "At the end of two months of foundation work, which of these is the best evidence that the foundation is actually secure?",
        options: [
          { id: "a", text: "Having read every lesson in Months 1 and 2" },
          {
            id: "b",
            text: "Being able to answer mixed questions from any of it, with no warning about which topic a question belongs to",
          },
          { id: "c", text: "Having scored well on each module assessment on the day you finished it" },
          { id: "d", text: "Being able to recite the definitions of the six properties" },
        ],
        correct: "b",
        explanation:
          "Reading, and a good score on the day, both measure what is available immediately after studying. What matters is what is still there weeks later when nothing tells you which method a question wants, and only mixed work with a gap in front of it tests that.",
        whyWrong: {
          a: "Reading is necessary and it is the weakest of the four as evidence. Recognising an explanation is not the same as being able to produce the work.",
          c: "A score on the day is inflated by everything being fresh. The same assessment three weeks later is a much better measurement, which is why this course keeps returning to old skills.",
          d: "Reciting the definitions is the part of this module that matters least. What matters is knowing which move each property permits.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
