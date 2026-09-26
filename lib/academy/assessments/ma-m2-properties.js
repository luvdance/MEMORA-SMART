/**
 * ASSESSMENTS · MATHEMATICS · MONTH 2 · MODULE 2 · HOW THE OPERATIONS BEHAVE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * This module is the one students dismiss as vocabulary, so almost none of
 * these questions ask for a definition. They ask what a property PERMITS.
 * The difference between knowing the word distributive and knowing that it is
 * what makes 3x + 5x into 8x is the whole point of the module, and a bank full
 * of naming questions would test the wrong half.
 *
 * The distributive law is tested in both directions on purpose. Students who
 * only ever meet it forwards learn expanding as a procedure and then meet
 * factorising in Month 6 as an unrelated mystery.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l21-order-grouping": {
    lessonId: "ma-l21-order-grouping",
    passMark: 70,
    questions: [
      {
        id: "maq21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pr-commutative",
        prompt: "Which of these four statements is FALSE?",
        options: [
          { id: "a", text: "8 + 5 = 5 + 8" },
          { id: "b", text: "8 × 5 = 5 × 8" },
          { id: "c", text: "8 − 5 = 5 − 8" },
          { id: "d", text: "8 + 5 + 2 = 2 + 8 + 5" },
        ],
        correct: "c",
        explanation:
          "8 − 5 is 3 and 5 − 8 is −3. They are not the same number, which is exactly what it means to say subtraction is not commutative. Addition and multiplication may be reordered freely, and subtraction may not.",
        whyWrong: {
          a: "True. Addition is commutative, so the two orders give the same total.",
          b: "True. Multiplication is commutative, which is why the times table has a matching pair for almost every fact in it.",
          d: "True, and it shows that the freedom extends to any number of terms, not just two.",
        },
      },
      {
        id: "maq21-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-associative",
        prompt:
          "A student works out 17 + 25 + 75 by doing 25 + 75 first, getting 100, then adding 17. Which property allows this?",
        options: [
          { id: "a", text: "None, and they have been lucky that it worked" },
          { id: "b", text: "The associative property of addition, which lets them choose which pair to add first" },
          { id: "c", text: "The distributive property" },
          { id: "d", text: "Closure, because the answer is still a whole number" },
        ],
        correct: "b",
        explanation:
          "Associativity says the grouping does not affect the total, so 17 + (25 + 75) equals (17 + 25) + 75. Choosing the pair that makes 100 is that property being used deliberately rather than by accident.",
        whyWrong: {
          a: "It is not luck. The rearrangement is licensed by a property that holds for every addition there is.",
          c: "The distributive law is about multiplying across a sum. There is no multiplication in this calculation.",
          d: "Closure says the answer stays a whole number, which is true and is not what permitted the regrouping.",
        },
      },
      {
        id: "maq21-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pr-why-fail",
        prompt:
          "Why is it not merely inconvenient but meaningless to swap the numbers in 12 ÷ 4?",
        options: [
          { id: "a", text: "Because 4 ÷ 12 does not come out as a whole number" },
          {
            id: "b",
            text: "Because the two positions ask different questions: how many 4s fit into 12, against how many 12s fit into 4",
          },
          { id: "c", text: "Because division is always harder than multiplication" },
          { id: "d", text: "Because you are only allowed to divide a larger number by a smaller one" },
        ],
        correct: "b",
        explanation:
          "Division is directional. The two numbers play different roles, so swapping them does not rearrange one question, it asks a different one. That is why no amount of care makes division commutative.",
        whyWrong: {
          a: "That is a symptom rather than the reason, and it is not always true: 12 ÷ 4 and 4 ÷ 2 both come out whole while still being directional.",
          c: "Difficulty has nothing to do with it. The issue is that the two positions mean different things.",
          d: "You are perfectly well allowed to. 4 ÷ 12 is a real calculation with a real answer, and Month 3 works with answers of exactly that kind.",
        },
      },
      {
        id: "maq21-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pr-mental",
        prompt:
          "Which rearrangement of 4 × 17 × 25 is both legal and easiest to do in your head?",
        options: [
          { id: "a", text: "It cannot be rearranged, because the numbers must stay in the order written" },
          { id: "b", text: "(4 × 25) × 17, which is 100 × 17 = 1,700" },
          { id: "c", text: "4 × (17 × 25), which is 4 × 425" },
          { id: "d", text: "(4 + 25) × 17, because reordering lets you change the operation too" },
        ],
        correct: "b",
        explanation:
          "Commutativity lets you move the 25 next to the 4, and associativity lets you multiply that pair first. The result is 100 × 17, which needs no working at all.",
        whyWrong: {
          a: "A product may be reordered and regrouped freely. That is precisely what the two properties of this lesson say.",
          c: "This is legal and it is the hard route. 17 × 25 is not a fact most people hold, so it leaves you with real work to do.",
          d: "Not legal. The properties let you move numbers around within one operation. They never let you change a multiplication into an addition.",
        },
      },
      {
        id: "maq21-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-in-algebra",
        prompt:
          "A student writes 5x + 3 as 3 + 5x and is told by a classmate that this is wrong. Who is right?",
        options: [
          { id: "a", text: "The classmate, because the term with the letter must come first" },
          {
            id: "b",
            text: "The student, because addition is commutative and the two expressions have the same value for every x",
          },
          { id: "c", text: "The classmate, because moving a term changes its sign" },
          { id: "d", text: "Neither, because an expression with a letter in it cannot be rearranged at all" },
        ],
        correct: "b",
        explanation:
          "There is a convention of writing the letter term first, and a convention is not a rule about value. Commutativity holds for every number, so it holds for whatever number x stands for, and both forms are correct.",
        whyWrong: {
          a: "That is a habit of presentation, not mathematics. Nothing is wrong with the value and nothing would be marked wrong.",
          c: "Signs change when a term crosses an equals sign, not when two added terms swap places. There is no equals sign here.",
          d: "The opposite is true, and it is the reason algebra works: the properties hold for every number, so they hold for a letter standing in for one.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l22-distributive": {
    lessonId: "ma-l22-distributive",
    passMark: 70,
    questions: [
      {
        id: "maq22-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pr-distributive",
        prompt: "Which of these is equal to 6 × (10 + 3)?",
        options: [
          { id: "a", text: "6 × 10 + 3" },
          { id: "b", text: "6 × 10 + 6 × 3" },
          { id: "c", text: "6 + 10 × 6 + 3" },
          { id: "d", text: "6 × 13 × 6" },
        ],
        correct: "b",
        explanation:
          "The 6 multiplies the whole bracket, so it has to reach both parts of it. That gives 60 + 18 = 78, which is 6 × 13.",
        whyWrong: {
          a: "Here the 6 has multiplied only the 10, leaving the 3 to be added on its own. That gives 63 instead of 78, and it is the commonest error in the whole module.",
          c: "This has scattered the numbers rather than distributing one across the other two. It gives 69.",
          d: "This multiplies by 6 twice, giving 468. The 6 appears once in the original, so it appears once in each product and no more.",
        },
      },
      {
        id: "maq22-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-why-true",
        prompt:
          "The area picture for the distributive law cuts one rectangle into two pieces. What does the picture actually prove?",
        options: [
          { id: "a", text: "That rectangles are easier to work with than other shapes" },
          {
            id: "b",
            text: "That cutting a rectangle up cannot change how much area it holds, so the two ways of counting it must agree",
          },
          { id: "c", text: "That the law works only for whole numbers" },
          { id: "d", text: "That area and multiplication are unrelated ideas that happen to look alike" },
        ],
        correct: "b",
        explanation:
          "The whole argument is that the same region is being measured twice. Once as one rectangle of width 4 + 5, once as two rectangles of width 4 and width 5. The area did not move, so the two expressions are equal.",
        whyWrong: {
          a: "True and beside the point. The picture is an argument about why the law holds, not a remark about convenient shapes.",
          c: "The picture happens to be drawn with whole numbers and the argument never uses that. A rectangle can be cut anywhere at all.",
          d: "They are the same idea. Area is what multiplication does when both quantities are lengths, which is why the picture is a proof rather than an illustration.",
        },
      },
      {
        id: "maq22-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-mental-distributive",
        prompt: "The quickest mental route to 8 × 99 is:",
        options: [
          { id: "a", text: "Set out the long multiplication" },
          { id: "b", text: "8 × 100 minus 8, which is 800 − 8 = 792" },
          { id: "c", text: "8 × 100 minus 1, which is 799" },
          { id: "d", text: "8 × 90 plus 9, which is 729" },
        ],
        correct: "b",
        explanation:
          "99 is 100 − 1, so 8 × 99 is 8 × 100 minus 8 × 1. The 8 has to multiply both parts, which is why what comes off is 8 and not 1.",
        whyWrong: {
          a: "It works and it is slower, and it is more likely to go wrong under time pressure than a subtraction you can do in your head.",
          c: "Only the 1 has been multiplied by nothing. The 8 must reach both parts of 100 − 1, so 8 × 1 = 8 comes off.",
          d: "The 9 added at the end has not been multiplied by 8 either. 8 × 90 plus 8 × 9 would be right, and it is a longer route than using 100.",
        },
      },
      {
        id: "maq22-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-both-directions",
        prompt:
          "In Month 6 you will be asked to factorise 12y + 18. What is that instruction asking for, in terms of this lesson?",
        options: [
          { id: "a", text: "Something new, which has to wait until Month 6" },
          {
            id: "b",
            text: "The distributive law read backwards: find what both terms are multiples of and take it outside, giving 6(2y + 3)",
          },
          { id: "c", text: "The two terms added together, giving 30y" },
          { id: "d", text: "The distributive law read forwards, giving 12y + 18 with no change" },
        ],
        correct: "b",
        explanation:
          "Both terms are multiples of 6, so 12y + 18 is 6 × 2y plus 6 × 3, which the law lets you write as 6(2y + 3). Expanding and factorising are one law used in opposite directions.",
        whyWrong: {
          a: "The notation is new in Month 6 and the move is not. It is this law, run right to left, which is why it is taught here rather than there.",
          c: "12y and 18 are not like terms, so they cannot be combined into one. One counts ys and the other counts units.",
          d: "Forwards is expanding, which takes a bracket apart. Factorising is the other direction, which builds one.",
        },
      },
      {
        id: "maq22-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pr-like-terms",
        prompt: "Why is 3x + 5x equal to 8x rather than 8x²?",
        options: [
          { id: "a", text: "Because you only multiply the letters when the numbers are equal" },
          {
            id: "b",
            text: "Because the terms were added, and adding 3 of something to 5 of something gives 8 of that same something",
          },
          { id: "c", text: "Because x is always 1" },
          { id: "d", text: "Because 8x² would need the terms to be larger" },
        ],
        correct: "b",
        explanation:
          "3x + 5x is (3 + 5)x, which is the distributive law read backwards. Adding counts how many xs there are, and the thing being counted does not change when you count more of it.",
        whyWrong: {
          a: "Nothing here multiplies the letters at all. The operation between the two terms is an addition.",
          c: "x stands for any number. If x happened to be 1 the answer would be 8, and the expression 8x is what is true for every x.",
          d: "Size is not the issue. 8x² would be the answer to a multiplication, and this is an addition.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l23-identity-inverse": {
    lessonId: "ma-l23-identity-inverse",
    passMark: 70,
    questions: [
      {
        id: "maq23-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pr-identity",
        prompt:
          "Which number leaves any number unchanged when you MULTIPLY by it?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "1" },
          { id: "c", text: "10" },
          { id: "d", text: "Both 0 and 1" },
        ],
        correct: "b",
        explanation:
          "Multiplying by 1 gives back what you started with, so 1 is the identity element for multiplication. Zero does the same job for addition.",
        whyWrong: {
          a: "Multiplying by 0 destroys the number rather than leaving it alone. Zero is the identity for ADDING.",
          c: "Multiplying by 10 shifts every digit one column left, which is a real change.",
          d: "They are the identities for two different operations, and swapping them over is the error this question is looking for.",
        },
      },
      {
        id: "maq23-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-inverse-elements",
        prompt: "What must be added to −13 to give zero?",
        options: [
          { id: "a", text: "−13" },
          { id: "b", text: "13" },
          { id: "c", text: "0" },
          { id: "d", text: "Nothing can be added to a negative number to reach zero" },
        ],
        correct: "b",
        explanation:
          "The additive inverse is the same distance from zero on the other side, so the inverse of −13 is 13. Finding it always means changing the sign, never changing the digits.",
        whyWrong: {
          a: "That gives −26, which is further from zero rather than back at it. The sign has to change.",
          c: "Adding 0 leaves −13 exactly as it was. That is what makes 0 the identity, and it is the opposite of what is wanted here.",
          d: "Every number has an additive inverse, negatives included. Moving 13 to the right from −13 lands on zero.",
        },
      },
      {
        id: "maq23-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pr-inverse-operations",
        prompt:
          "A number was multiplied by 6 and then 4 was added, giving 34. Which sequence recovers the number?",
        options: [
          { id: "a", text: "Add 4, then divide by 6" },
          { id: "b", text: "Subtract 4, then divide by 6, giving 5" },
          { id: "c", text: "Divide by 6, then subtract 4" },
          { id: "d", text: "Multiply by 6, then subtract 4" },
        ],
        correct: "b",
        explanation:
          "Undoing means applying the inverse of each step, and doing it in reverse order. The adding happened last, so it is undone first: 34 − 4 = 30, then 30 ÷ 6 = 5. Checking forwards, 5 × 6 + 4 = 34.",
        whyWrong: {
          a: "Adding 4 repeats the step instead of undoing it. The inverse of adding is subtracting.",
          c: "The operations are inverted correctly and the order is wrong. Undoing the first step first leaves the second step still applied, and 34 ÷ 6 is not even whole.",
          d: "Both operations have been repeated rather than reversed, which takes you further from the original number, not back to it.",
        },
      },
      {
        id: "maq23-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-balance",
        prompt:
          "A student solving 3x + 5 = 20 subtracts 5 from the left side only, and writes 3x = 20. What is wrong with that line?",
        options: [
          { id: "a", text: "Nothing, as long as they remember to subtract it later" },
          {
            id: "b",
            text: "The line is simply false, because the two sides are no longer equal, and everything after it is built on a false statement",
          },
          { id: "c", text: "They should have subtracted 5 from the right side only" },
          { id: "d", text: "They should have divided by 3 first" },
        ],
        correct: "b",
        explanation:
          "An equation is a claim that two things have the same value. Take 5 off one side and the claim stops being true, so the new line says something false and no correct answer can follow from it. The line should read 3x = 15.",
        whyWrong: {
          a: "There is no later. The written line already claims 3x = 20, and a marker reads what is written rather than what was intended.",
          c: "That breaks the balance the other way, giving 3x + 5 = 15, which is also false. Whatever you do, you do to both sides.",
          d: "Dividing first is legal if done to both sides, and it is not what went wrong here. The error is doing something to one side alone.",
        },
      },
      {
        id: "maq23-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pr-zero-again",
        prompt: "Why is dividing by zero undefined rather than just difficult?",
        options: [
          { id: "a", text: "Because the answer is infinity, which is too large to write down" },
          {
            id: "b",
            text: "Because dividing by a number means multiplying by whatever reaches 1 with it, and nothing multiplied by zero ever reaches 1",
          },
          { id: "c", text: "Because the answer is zero" },
          { id: "d", text: "Because calculators are not built to do it" },
        ],
        correct: "b",
        explanation:
          "Every other number has a partner that multiplies with it to give 1, and that partner is what dividing by it really uses. Zero times anything is zero, so no such partner exists and there is nothing for the division to mean.",
        whyWrong: {
          a: "Infinity is not a number you can land on, and the problem is not the size of the answer. There is no answer to be large.",
          c: "Zero divided by something is zero. Something divided by zero is a different question, and it has no answer at all.",
          d: "The calculator refuses because the operation is undefined, not the other way round. The reason is in the arithmetic.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l24-closure": {
    lessonId: "ma-l24-closure",
    passMark: 70,
    questions: [
      {
        id: "maq24-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-closure",
        prompt:
          "The counting numbers 1, 2, 3, … are NOT closed under one of these. Which one?",
        options: [
          { id: "a", text: "Addition" },
          { id: "b", text: "Multiplication" },
          { id: "c", text: "Subtraction" },
          { id: "d", text: "They are closed under all three" },
        ],
        correct: "c",
        explanation:
          "Add or multiply two counting numbers and you always get another counting number. Subtract and you can leave the set entirely: 4 − 9 is −5, which is not a counting number. That gap is the reason negatives had to be invented.",
        whyWrong: {
          a: "Two counting numbers added together are always a counting number, so addition is closed.",
          b: "Multiplication is repeated addition, so it cannot escape the set either.",
          d: "One of the three does escape, and the whole of Month 1 Lesson 10 exists because of it.",
        },
      },
      {
        id: "maq24-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-closure-examples",
        prompt:
          "How much work does it take to show that a set is NOT closed under an operation?",
        options: [
          { id: "a", text: "You must check every possible pair" },
          { id: "b", text: "One example where the answer falls outside the set is enough" },
          { id: "c", text: "You must check at least ten pairs" },
          { id: "d", text: "It cannot be shown, only assumed" },
        ],
        correct: "b",
        explanation:
          "Closed means it holds every time, so a single failure destroys the claim. Showing a set IS closed is the harder direction, because it needs an argument covering every case rather than an example.",
        whyWrong: {
          a: "That is what showing closure requires, and even then you argue rather than check, since there are infinitely many pairs.",
          c: "There is no quota. One genuine counterexample settles it and a hundred agreeing examples never settle the other direction.",
          d: "It is shown all the time, and by exactly one example. 4 − 9 is enough to settle subtraction on the counting numbers.",
        },
      },
      {
        id: "maq24-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-why-algebra",
        prompt:
          "Algebra rearranges expressions without knowing what number the letter stands for. What makes that legal?",
        options: [
          { id: "a", text: "Nothing does, and that is why algebra sometimes gives wrong answers" },
          {
            id: "b",
            text: "The properties in this module hold for every number, so a move that relies only on them is valid whichever number the letter turns out to be",
          },
          { id: "c", text: "Letters follow their own rules, separate from numbers" },
          { id: "d", text: "It is legal only when the letter stands for a whole number" },
        ],
        correct: "b",
        explanation:
          "This is the answer to why any of this was worth a module. Commutativity, associativity and the rest are true for every number without exception, so a rearrangement resting on them cannot be wrong for the particular number you do not yet know.",
        whyWrong: {
          a: "Algebra done correctly does not give wrong answers. Each legal move is one of these properties, and each property is true for all numbers.",
          c: "Letters follow exactly the same rules as numbers, which is the entire reason the notation is useful.",
          d: "The properties hold for negatives, fractions and irrationals too, so the letter is not restricted to whole numbers.",
        },
      },
      {
        id: "maq24-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pr-summary",
        prompt:
          "Which property is being used when 2 + 3 + x is written with no brackets at all?",
        options: [
          { id: "a", text: "Closure" },
          { id: "b", text: "Associativity, because the grouping makes no difference to the result" },
          { id: "c", text: "The identity property" },
          { id: "d", text: "Distributivity" },
        ],
        correct: "b",
        explanation:
          "Leaving out the brackets is a claim that it does not matter which pair you add first. That claim is associativity, and it is why nobody writes brackets in a chain of additions.",
        whyWrong: {
          a: "Closure says the answer stays in the same set of numbers. It says nothing about how the terms are grouped.",
          c: "The identity property is about 0 and 1 leaving a number unchanged. Neither appears here.",
          d: "Distributivity is about multiplying across a sum, and there is no multiplication in this expression.",
        },
      },
      {
        id: "maq24-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pr-review",
        prompt:
          "Why does this course keep sending you back to earlier skills in mixed drills instead of moving steadily forward?",
        options: [
          { id: "a", text: "To fill time, since the topics themselves are short" },
          {
            id: "b",
            text: "Because a skill practised once and then left alone fades, and because choosing the right method is itself a skill that only mixed questions train",
          },
          { id: "c", text: "Because the later topics do not really depend on the earlier ones" },
          { id: "d", text: "Because revisiting a topic makes it easier the second time" },
        ],
        correct: "b",
        explanation:
          "Two things are being trained at once. Returning to a skill after a gap is what makes it stick, and meeting questions with no label on them is what trains you to work out which method a question wants, which is what an exam actually asks.",
        whyWrong: {
          a: "The topics are not short and the drills are not padding. Spacing and mixing are the two best evidenced study methods there are.",
          c: "They depend on them completely. Month 6 algebra is this module applied to letters, and Month 3 fractions rest on the factors work.",
          d: "It does feel easier, and feeling easier is not the goal. The goal is that it is still there in nine months, which is a different thing.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
