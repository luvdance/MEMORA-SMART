/**
 * ASSESSMENTS · MATHEMATICS · MONTH 1 · MODULE 1 · STARTING MATHEMATICS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * A module with no calculations in it still needs a check, and the check has
 * to test something real. These questions test whether a student can now
 * diagnose: given a situation, can they name what is actually going wrong and
 * what would fix it.
 *
 * Every question here is answerable with counting and simple whole number
 * arithmetic. Nothing in this module or its check uses an idea the course has
 * not yet taught, which is the rule the module itself is built on.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l1-what-is-maths": {
    lessonId: "ma-l1-what-is-maths",
    passMark: 70,
    questions: [
      {
        id: "maq1-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-w-you-already-know",
        prompt:
          "Somebody answers 1 + 1, 2 × 2, 10 ÷ 2 and 20 − 5 correctly in their head, then says 'but I am bad at mathematics'. What is the accurate thing to say back?",
        options: [
          { id: "a", text: "They are right, because those sums are too easy to count" },
          {
            id: "b",
            text: "They can do arithmetic, which is the foundation of the whole subject, so whatever stopped them was a particular topic rather than mathematics itself",
          },
          { id: "c", text: "They are only good at small numbers" },
          { id: "d", text: "Mathematics has nothing to do with those four operations" },
        ],
        correct: "b",
        explanation:
          "Adding, subtracting, multiplying and dividing are arithmetic, and arithmetic is the floor everything else in the subject stands on. Somebody who has all four has the foundation, and the thing that stopped them is a specific topic they were not taught.",
        whyWrong: {
          a: "Being able to do something easily is not a reason to discount it. Those four operations are used inside every topic in this course, including the ones that look frightening.",
          c: "The size of the numbers is not what makes a topic hard. Month 2 handles large numbers with exactly the same four operations.",
          d: "Every topic in the course runs on those four operations. Algebra, fractions and percentages are all built out of them.",
        },
      },
      {
        id: "maq1-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-where-it-stops",
        prompt:
          "A student is fine with 20 − 5 but freezes at 2x + 6 = 12. What does that tell you?",
        options: [
          { id: "a", text: "Their arithmetic is weak" },
          {
            id: "b",
            text: "They have not been taught algebra yet, which is a separate topic with its own rules",
          },
          { id: "c", text: "They are not a mathematics person" },
          { id: "d", text: "The second question is much harder arithmetic than the first" },
        ],
        correct: "b",
        explanation:
          "Solving that equation needs 12 − 6 and 6 ÷ 2, which the same student can already do. What is missing is one rule: that you may take 6 off both sides, and why that is allowed. That rule belongs to algebra, and nobody knows it until somebody tells them.",
        whyWrong: {
          a: "Their arithmetic is demonstrably fine, since they handled 20 − 5 without trouble. The arithmetic inside the algebra question is easier than that.",
          c: "There is no such thing. Being stopped by a topic you were never taught is a fact about your timetable, not about you.",
          d: "The arithmetic involved is 12 − 6 and 6 ÷ 2. What is new is the rule about doing the same thing to both sides, not the sums.",
        },
      },
      {
        id: "maq1-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-not-arithmetic",
        prompt:
          "Which of these four is a topic with its own rules, rather than just harder arithmetic?",
        options: [
          { id: "a", text: "Adding 4,182 and 9,507" },
          { id: "b", text: "Working out −5 + 3" },
          { id: "c", text: "Multiplying 24 by 7" },
          { id: "d", text: "Dividing 96 by 8" },
        ],
        correct: "b",
        explanation:
          "Negative numbers are a topic called directed numbers, with rules about what happens when signs meet. The other three are ordinary arithmetic with bigger numbers, using operations you already have.",
        whyWrong: {
          a: "Larger numbers, same operation. Month 2 makes this automatic and nothing new has to be believed.",
          c: "Still multiplication. The numbers are bigger and the idea is the one you already use.",
          d: "Still division. Nothing about it needs a rule you have not met.",
        },
      },
      {
        id: "maq1-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-many-topics",
        prompt:
          "Why do different topics in mathematics have different rules?",
        options: [
          { id: "a", text: "To make the subject harder to learn" },
          {
            id: "b",
            text: "Because each topic was built to answer a different kind of everyday question, so the rules fit the job",
          },
          { id: "c", text: "Because different countries invented different rules" },
          { id: "d", text: "There is really only one set of rules and the rest is presentation" },
        ],
        correct: "b",
        explanation:
          "Fractions exist because things do not always divide evenly. Directed numbers exist because quantities can go below zero. Algebra exists because you often know a total and need a missing part. Different questions, so different rules.",
        whyWrong: {
          a: "Nothing in the subject was designed to be difficult. Every topic here exists because somebody needed a question answered.",
          c: "Notation varies between countries and the mathematics does not. A half is a half everywhere.",
          d: "The rules for adding fractions and the rules for multiplying negatives are genuinely different, because they are answering different questions.",
        },
      },
      {
        id: "maq1-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-what-this-course-does",
        prompt:
          "Your first x is in Month 4 rather than Month 1. Why is it placed that late?",
        options: [
          { id: "a", text: "Because algebra is the hardest topic and is best avoided" },
          {
            id: "b",
            text: "Because algebra uses fractions, negative numbers and the operations, so those are built first",
          },
          { id: "c", text: "To keep the early months short" },
          { id: "d", text: "Because x is only needed for university" },
        ],
        correct: "b",
        explanation:
          "Every algebra question has arithmetic inside it, often with fractions or negative numbers. Building those first is what makes algebra feel like a continuation rather than a new subject, and it is why the order of this course is the order it is.",
        whyWrong: {
          a: "It is not avoided; it is prepared for. Month 4 teaches it and Month 6 goes much further.",
          c: "The early months are the longest part of the foundation. They are there to carry the weight of what follows.",
          d: "Letters turn up in ordinary life constantly, in any situation where you know a total and need the missing piece.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l2-why-it-matters": {
    lessonId: "ma-l2-why-it-matters",
    passMark: 70,
    questions: [
      {
        id: "maq2-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-money",
        prompt:
          "Three exercise books cost ₦450 each and you hand over ₦2,000. How much change should you get?",
        options: [
          { id: "a", text: "₦1,350" },
          { id: "b", text: "₦650" },
          { id: "c", text: "₦550" },
          { id: "d", text: "₦1,550" },
        ],
        correct: "b",
        explanation:
          "Three lots of ₦450 is ₦1,350. Taking that from ₦2,000 leaves ₦650. Two steps, and the second one is the one people skip.",
        whyWrong: {
          a: "That is what the books COST. The question asks for the change, which is what is left from the money handed over.",
          c: "This takes only two books into account. There are three.",
          d: "This subtracts the price of one book rather than the cost of all three.",
        },
      },
      {
        id: "maq2-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-time",
        prompt:
          "A bus leaves at 6:40 and the journey takes 3 hours 50 minutes. Why is adding these as though they were ordinary numbers unsafe?",
        options: [
          { id: "a", text: "It is safe, and gives 9:90" },
          {
            id: "b",
            text: "Time counts in sixties rather than hundreds, so 40 and 50 minutes make 1 hour 30 rather than 90 past the hour",
          },
          { id: "c", text: "Because buses are never on time" },
          { id: "d", text: "Because you should always use a 24 hour clock" },
        ],
        correct: "b",
        explanation:
          "6:40 plus 3 hours is 9:40, and 9:40 plus 50 minutes is 10:30. The habit of counting in hundreds comes from money, where one hundred kobo make a naira, and it does not transfer.",
        whyWrong: {
          a: "9:90 is not a time. Sixty minutes make an hour, so the minutes carry over.",
          c: "Punctuality is not the issue. The arithmetic is wrong before the bus has left.",
          d: "The 24 hour clock changes how the hour is written, not how the minutes carry.",
        },
      },
      {
        id: "maq2-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-judgement",
        prompt:
          "Nine workers each earn ₦80,000 and the owner takes ₦2,000,000. Sharing the total equally between all ten gives ₦272,000. Lining all ten up and taking the middle gives ₦80,000. A recruitment advert quotes ₦272,000. What is happening?",
        options: [
          { id: "a", text: "The advert is lying, since ₦272,000 is not a real figure" },
          {
            id: "b",
            text: "Both figures are honest, and the one that describes what a worker actually earns is ₦80,000",
          },
          { id: "c", text: "The middle value is the only honest average in every situation" },
          { id: "d", text: "The two figures should be added together and halved" },
        ],
        correct: "b",
        explanation:
          "Sharing the total equally is pulled a long way up by one very large salary. The middle value describes the typical worker. Knowing which is being quoted, and why, is the whole skill.",
        whyWrong: {
          a: "It is not a lie. The figure is exactly what it claims to be, which is what makes the choice between the two so effective.",
          c: "The middle value is better here because of the one extreme salary. Where there is no extreme, sharing the total equally is usually the more informative figure.",
          d: "Combining two averages produces a third number that describes nothing at all.",
        },
      },
      {
        id: "maq2-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-careers",
        prompt:
          "In the Nigerian system, which statement about mathematics and university admission is accurate?",
        options: [
          { id: "a", text: "It is required only for science and engineering courses" },
          {
            id: "b",
            text: "A credit is required for admission to almost every course, not only the sciences",
          },
          { id: "c", text: "It is optional for all courses if other subjects are strong" },
          { id: "d", text: "It is required only for medicine" },
        ],
        correct: "b",
        explanation:
          "Mathematics is the single subject that most often decides which doors a student can walk through, and a failure in it closes more of them than a failure in anything else.",
        whyWrong: {
          a: "Accounting, business, architecture, surveying and many arts and social science courses require it too.",
          c: "Strength elsewhere does not substitute for the requirement.",
          d: "Medicine requires it, and so do a great many courses with no obvious connection to the subject.",
        },
      },
      {
        id: "maq2-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-measure",
        prompt:
          "A room is 5 m by 4 m and one box of tiles covers 2 square metres. How many boxes should be ordered?",
        options: [
          { id: "a", text: "10, since the floor is 20 square metres and 20 divided by 2 is 10" },
          { id: "b", text: "11, because an exact order leaves nothing for cuts and breakages" },
          { id: "c", text: "9, rounding down to be economical" },
          { id: "d", text: "20, one box for each square metre" },
        ],
        correct: "b",
        explanation:
          "The arithmetic gives exactly 10, and 10 assumes no tile is ever cut or broken. Any real job adds an allowance, which is judgement rather than calculation and is the part a textbook usually leaves out.",
        whyWrong: {
          a: "The arithmetic is right and the ordering decision is not. Ten boxes means a second trip the moment one tile breaks.",
          c: "Rounding down leaves the floor unfinished, which is the one outcome that definitely costs money.",
          d: "That counts square metres rather than boxes, and one box covers two square metres.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l3-why-it-feels-hard": {
    lessonId: "ma-l3-why-it-feels-hard",
    passMark: 70,
    questions: [
      {
        id: "maq3-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-gaps",
        prompt:
          "Why do so many people say mathematics suddenly became hard in a particular year?",
        options: [
          { id: "a", text: "Because the syllabus genuinely jumps in difficulty that year" },
          {
            id: "b",
            text: "Because a gap opened years earlier and that was the year the topics depending on it became unavoidable",
          },
          { id: "c", text: "Because teachers change" },
          { id: "d", text: "Because mathematical ability develops late in some people" },
        ],
        correct: "b",
        explanation:
          "The subject compounds, so a gap does not stay where it started. It travels, and it surfaces at the point where the topics that need it can no longer be avoided.",
        whyWrong: {
          a: "The syllabus does get harder, and that alone does not explain students who were comfortable and then were not.",
          c: "A teacher can make the difference visible. The gap was usually already there.",
          d: "There is no evidence for a fixed ability that switches on late. There is very good evidence for accumulated gaps.",
        },
      },
      {
        id: "maq3-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-procedures",
        prompt:
          "A student cannot remember the detail of a rule they were taught as a recipe. What is the fix?",
        options: [
          { id: "a", text: "A saying or rhyme to remember the recipe by" },
          {
            id: "b",
            text: "The reason behind the rule, since a rule with a reason can be rebuilt when the detail goes",
          },
          { id: "c", text: "Practising the recipe fifty more times" },
          { id: "d", text: "Avoiding that kind of question in the exam" },
        ],
        correct: "b",
        explanation:
          "A rule with no meaning cannot be checked or recovered. A rule with a reason can be reconstructed in seconds, which is why this course teaches the reason and the history alongside every procedure.",
        whyWrong: {
          a: "A saying is a second rule layered on the first, and it can be misremembered in exactly the same way.",
          c: "Repetition strengthens a rule that is remembered. It does nothing for one that is not.",
          d: "Most of these rules appear in several topics, so avoiding them is not available.",
        },
      },
      {
        id: "maq3-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-anxiety",
        prompt:
          "Why does mathematics anxiety cause people to go blank on questions they can do calmly at home?",
        options: [
          { id: "a", text: "Because they never really knew the method" },
          {
            id: "b",
            text: "Because the anxiety takes up the same limited room in memory that the steps of the problem need",
          },
          { id: "c", text: "Because exam questions are deliberately worded differently" },
          { id: "d", text: "Because of a lack of sleep" },
        ],
        correct: "b",
        explanation:
          "It is a space problem rather than a knowledge problem, which is why writing the steps down helps: it moves the load out of your head and onto paper.",
        whyWrong: {
          a: "The evidence against this is that the same person can do the same question calmly an hour later.",
          c: "Wording does vary, and it does not explain going blank on a question whose wording is familiar.",
          d: "Tiredness makes it worse and is not the mechanism.",
        },
      },
      {
        id: "maq3-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-w-myth",
        prompt:
          "Why is the belief that some people simply are not mathematics people described as self fulfilling?",
        options: [
          { id: "a", text: "Because it is true, and the belief simply reflects reality" },
          {
            id: "b",
            text: "Because if ability is fixed then effort is pointless, so difficulty becomes a reason to stop rather than information about what to practise",
          },
          { id: "c", text: "Because teachers repeat it" },
          { id: "d", text: "Because it appears in textbooks" },
        ],
        correct: "b",
        explanation:
          "Two students meet the same hard question. One reads it as proof of a fixed limit and stops. The other reads it as a specific missing piece and goes looking. The question was identical and the next twenty minutes were not.",
        whyWrong: {
          a: "Countries that do not hold this belief get better results across their whole population, which is hard to explain if the belief were simply accurate.",
          c: "Repetition spreads it. The self fulfilling part is what it does to a student's response to difficulty.",
          d: "Textbooks rarely state it. It is passed on in offhand remarks, which is part of why it goes unchallenged.",
        },
      },
      {
        id: "maq3-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-questions",
        prompt:
          "A student did not understand a step in Week 2, wrote it down anyway, and by Week 6 is lost. What is the correct move in Week 6?",
        options: [
          { id: "a", text: "Work harder on the Week 6 material" },
          { id: "b", text: "Go back to the Week 2 step, which is where the confusion started" },
          { id: "c", text: "Start the whole course again from the beginning" },
          { id: "d", text: "Ask for easier questions" },
        ],
        correct: "b",
        explanation:
          "The Week 6 material is built on the Week 2 step. Repairing that specific step is ten minutes of work and it usually makes the weeks in between make sense as well.",
        whyWrong: {
          a: "Working harder on material that rests on a missing piece only rehearses the confusion.",
          c: "Restarting everything is far more work than necessary and skips the diagnosis, which is the useful part.",
          d: "Easier questions on the same topic still depend on the same missing step.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l4-rules-for-learning": {
    lessonId: "ma-l4-rules-for-learning",
    passMark: 70,
    questions: [
      {
        id: "maq4-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-rule-pen",
        prompt:
          "Student A reads twelve worked examples in an hour, understanding each. Student B works through four with a pen, getting stuck twice. Who has learned more?",
        options: [
          { id: "a", text: "Student A, having covered three times as much" },
          {
            id: "b",
            text: "Student B, because recognising a method and producing it from a blank page are different abilities",
          },
          { id: "c", text: "The same, since they spent the same hour" },
          { id: "d", text: "Impossible to say without a test" },
        ],
        correct: "b",
        explanation:
          "Reading a solution and following it feels like learning because everything makes sense as you read. Only the second student found out what they could actually produce, and producing it is what is tested.",
        whyWrong: {
          a: "Coverage is the wrong measure. A page worked through with a pen is worth more than ten pages read.",
          c: "Equal time, very unequal effect. The activity matters more than the duration.",
          d: "The difference between recognition and production is well established, and it points one way.",
        },
      },
      {
        id: "maq4-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-rule-struggle",
        prompt:
          "Why does this course refuse to show an answer before you have attempted the question?",
        options: [
          { id: "a", text: "To make the course harder" },
          {
            id: "b",
            text: "Because trying and failing to recall something prepares the mind to take it in, and looking too early produces recognition instead",
          },
          { id: "c", text: "To stop students cheating" },
          { id: "d", text: "Because showing answers is technically difficult" },
        ],
        correct: "b",
        explanation:
          "Five minutes of honest struggle before a hint is worth more than the hint on its own. Looking early feels efficient and mostly produces the feeling of understanding rather than the thing itself.",
        whyWrong: {
          a: "Difficulty for its own sake would be pointless. This difficulty has a specific effect on how much stays.",
          c: "There is nobody to cheat. The only person affected by looking early is the person doing it.",
          d: "It would be trivial to add such a button. It is absent by choice.",
        },
      },
      {
        id: "maq4-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-rule-mixing",
        prompt:
          "Why is doing twenty questions on one topic in a row less useful than twenty mixed questions?",
        options: [
          { id: "a", text: "It is more useful, because it builds fluency in one topic" },
          {
            id: "b",
            text: "Because choosing the method is half the skill, and a block of one topic removes that half entirely",
          },
          { id: "c", text: "Because the topic is easy" },
          { id: "d", text: "Because twenty questions is too many for one topic" },
        ],
        correct: "b",
        explanation:
          "In an exam, nothing tells you which topic a question belongs to. Blocked practice trains the procedure while skipping the identification, and identification is the part that fails under pressure.",
        whyWrong: {
          a: "It does build fluency, and fluency in a procedure you cannot recognise the need for is of limited use.",
          c: "The topic is irrelevant to the argument. The same applies to a block of any one topic.",
          d: "The number is not the issue. Twenty mixed questions would be fine.",
        },
      },
      {
        id: "maq4-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-rule-errors",
        prompt:
          "A student works out 62 take away 27 and writes 45. Which response teaches more, and why?",
        options: [
          { id: "a", text: "Wrong, the answer is 35" },
          {
            id: "b",
            text: "In the units column you did 7 take away 2 instead of borrowing to do 12 take away 7",
          },
          { id: "c", text: "Try again" },
          { id: "d", text: "Check your working" },
        ],
        correct: "b",
        explanation:
          "The second names a specific, repeatable habit, which is a thing that can be stopped. The others name a mark, which teaches nothing about what happened.",
        whyWrong: {
          a: "Giving the correct answer tells the student they were wrong and not what they did, so they will do it again.",
          c: "A second attempt with no new information usually reproduces the first.",
          d: "The student believes the working is correct, so an instruction to check it gives them nothing to look for.",
        },
      },
      {
        id: "maq4-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-rule-spacing",
        prompt:
          "Forty minutes a day for five days, or a single four hour session at the weekend. Which leaves you with more, and why?",
        options: [
          { id: "a", text: "The single session, because concentration builds over time" },
          {
            id: "b",
            text: "The daily sessions, because coming back to something after a gap is what strengthens memory",
          },
          { id: "c", text: "They are equivalent, since the total time is similar" },
          { id: "d", text: "Neither, only the number of questions matters" },
        ],
        correct: "b",
        explanation:
          "Each time you bring something back to mind after forgetting a little of it, it returns stronger. A single long session never gives you the gap, so it never gets that benefit.",
        whyWrong: {
          a: "Concentration does build, and it also fades within a long session, and neither effect outweighs the benefit of spacing.",
          c: "The total time is similar and the effect is not. How study is spread out matters as much as how much of it there is.",
          d: "The number of questions matters and so does when they are done.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
