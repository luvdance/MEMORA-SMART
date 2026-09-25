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
 * what would fix it. That is the skill the module is for, and it is the skill
 * they will use on themselves for the next nine months.
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
        difficulty: 2,
        atomId: "a-ma-w-not-arithmetic",
        prompt:
          "Someone says they are bad at mathematics because they are slow at working out 7 times 8 in their head. What is the most accurate response?",
        options: [
          { id: "a", text: "They are right, since mental arithmetic is the core of the subject" },
          {
            id: "b",
            text: "Recall speed is one skill in one branch, and it is the branch machines took over first",
          },
          { id: "c", text: "Mental arithmetic does not matter at all and should be ignored" },
          { id: "d", text: "They should use a calculator and stop worrying about the subject" },
        ],
        correct: "b",
        explanation:
          "Arithmetic is one branch of mathematics, and recall speed is one skill inside it. The other branches are mostly reasoning. Plenty of strong mathematicians are unremarkable at mental arithmetic.",
        whyWrong: {
          a: "Arithmetic is to mathematics roughly what spelling is to writing: necessary, and nowhere near the whole of it.",
          c: "It does matter, and this course drills it, for a specific reason: it frees up attention for the problem the fact sits inside.",
          d: "A calculator helps with the calculating and does nothing for the reasoning, which is where most of the subject lives.",
        },
      },
      {
        id: "maq1-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-patterns",
        prompt:
          "A student notices that 1, 1 + 3, 1 + 3 + 5 give 1, 4 and 9. What turns that observation into mathematics?",
        options: [
          { id: "a", text: "Writing down more examples until it feels certain" },
          {
            id: "b",
            text: "Asking whether it always happens, and being able to say why",
          },
          { id: "c", text: "Memorising the first ten results" },
          { id: "d", text: "Nothing, the observation is already the mathematics" },
        ],
        correct: "b",
        explanation:
          "Anyone can spot a pattern. The mathematics is in establishing that it holds for every case and being able to explain the reason, because a pattern that fails at the twentieth case is dangerous if you trusted it at the fourth.",
        whyWrong: {
          a: "More examples raise confidence and never establish certainty. A pattern can hold for the first forty cases and fail at the forty first.",
          c: "Memorising results gives you those results and no way of handling a case you have not memorised.",
          d: "Spotting it is the start. It is a good start and it is not yet an argument.",
        },
      },
      {
        id: "maq1-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-cumulative",
        prompt:
          "A student keeps losing marks on probability questions, always at the step where the fraction has to be simplified. Where is the problem?",
        options: [
          { id: "a", text: "In probability, so they should do more probability questions" },
          { id: "b", text: "In fractions, and repairing fractions will fix several topics at once" },
          { id: "c", text: "In their exam technique" },
          { id: "d", text: "Nowhere in particular, some questions are simply hard" },
        ],
        correct: "b",
        explanation:
          "The low mark appears in probability and the gap is in fractions. Because the subject compounds, one repaired gap usually unlocks several topics: ratio, algebraic fractions and calculus all lean on the same skill.",
        whyWrong: {
          a: "More probability practice rehearses the same failure. The step going wrong is not a probability step.",
          c: "Technique matters and it is not the issue here. The specific step failing has been identified.",
          d: "The pattern is too consistent for that. Failing at the same step every time is a diagnosis, not bad luck.",
        },
      },
      {
        id: "maq1-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-understanding",
        prompt:
          "Why does understanding why a fraction bar means divide beat memorising the rule for converting a fraction to a decimal?",
        options: [
          { id: "a", text: "It does not, the rule is faster" },
          {
            id: "b",
            text: "A rule can be forgotten with nothing to fall back on, and an understanding can be rebuilt",
          },
          { id: "c", text: "Because examiners ask you to explain it" },
          { id: "d", text: "Because rules are always wrong" },
        ],
        correct: "b",
        explanation:
          "Under exam pressure, procedures go. A student who knows the fraction bar is a division sign can reconstruct the method in seconds. A student who learned the rule has nothing left when the rule goes.",
        whyWrong: {
          a: "They are the same speed in practice, and only one of them survives being forgotten.",
          c: "Examiners rarely ask for the explanation directly. The benefit is that you can rebuild the method, not that you get marks for reciting it.",
          d: "Rules are usually correct. The problem is that a rule without its reason cannot be checked or recovered.",
        },
      },
      {
        id: "maq1-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-language",
        prompt: "Why does mathematics use symbols such as A = πr² rather than plain English?",
        options: [
          { id: "a", text: "To keep the subject difficult and exclusive" },
          {
            id: "b",
            text: "Because a symbolic statement has exactly one reading, in any language and any century",
          },
          { id: "c", text: "Because English cannot express mathematical ideas at all" },
          { id: "d", text: "Purely to save paper" },
        ],
        correct: "b",
        explanation:
          "Ordinary language is usefully vague. Notation is built so a statement cannot be read two ways, which is why a formula written in Lagos means the same thing when it is read in Lisbon.",
        whyWrong: {
          a: "The notation is an aid to precision. It looks exclusive only while it is unfamiliar, which is why it gets taught.",
          c: "English can express them, and it takes several lines and can still be misread. That is the trade.",
          d: "Brevity is a side effect. Unambiguity is the purpose.",
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
        difficulty: 3,
        atomId: "a-ma-w-money",
        prompt:
          "Shop A offers 20% off a ₦40,000 item then adds 7.5% VAT at the till. Shop B offers 15% off with VAT already included. Which is cheaper?",
        options: [
          { id: "a", text: "Shop A, because 20% is a bigger discount" },
          { id: "b", text: "Shop B, at ₦34,000 against ₦34,400" },
          { id: "c", text: "They cost exactly the same" },
          { id: "d", text: "It cannot be decided without knowing the VAT rate at Shop B" },
        ],
        correct: "b",
        explanation:
          "Shop A: 40,000 less 20% is 32,000, then plus 7.5% is 34,400. Shop B: 40,000 less 15% is 34,000. The larger advertised discount is the more expensive shop.",
        whyWrong: {
          a: "Percentages of different amounts are not comparable until you work them out, and the VAT is applied after the discount.",
          c: "They differ by ₦400, which is the entire point of doing the calculation.",
          d: "Shop B states that VAT is included, so its price is final at ₦34,000.",
        },
      },
      {
        id: "maq2-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-time",
        prompt:
          "A bus leaves at 06:40 and the journey takes 3 hours 50 minutes. Why is subtracting or adding these as ordinary numbers unsafe?",
        options: [
          { id: "a", text: "It is safe, and gives 09:90" },
          {
            id: "b",
            text: "Clock time counts in sixties rather than hundreds, so 40 plus 50 minutes is 1 hour 30, not 90 past the hour",
          },
          { id: "c", text: "Because buses are never on time" },
          { id: "d", text: "Because you should always use a 24 hour clock" },
        ],
        correct: "b",
        explanation:
          "06:40 plus 3 hours is 09:40, and 09:40 plus 50 minutes is 10:30. Treating minutes as decimals produces 09:90, which is not a time.",
        whyWrong: {
          a: "09:90 is not a time. Sixty minutes make an hour, so the minutes carry.",
          c: "Punctuality is not the issue. The arithmetic is wrong before the bus leaves.",
          d: "The 24 hour clock changes how the hour is written and not how the minutes carry.",
        },
      },
      {
        id: "maq2-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-w-judgement",
        prompt:
          "Nine workers earn ₦80,000 each and the owner earns ₦2,000,000. The mean is ₦272,000 and the median is ₦80,000. A recruitment advert quotes the mean. What is happening?",
        options: [
          { id: "a", text: "The advert is lying, since ₦272,000 is not a real figure" },
          {
            id: "b",
            text: "Both figures are true, and the one that describes what a worker actually earns is the median",
          },
          { id: "c", text: "The median is the only honest average in every situation" },
          { id: "d", text: "The two averages should be added and halved" },
        ],
        correct: "b",
        explanation:
          "The mean is arithmetically correct and is pulled far up by one extreme value. The median describes the typical worker. Knowing which is being quoted, and why, is the whole skill.",
        whyWrong: {
          a: "It is not a lie. The mean is exactly what it claims to be, which is what makes the choice of average the interesting part.",
          c: "The median is better here because of the outlier. In a set with no extreme values the mean is usually the more informative figure.",
          d: "Averaging two averages produces a third number that describes nothing.",
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
          "A room is 4.5 m by 3.2 m and tiles come in boxes covering 1.44 m² each. How many boxes should be ordered, allowing for waste?",
        options: [
          { id: "a", text: "10, since 14.4 divided by 1.44 is exactly 10" },
          { id: "b", text: "11, because an exact fit leaves nothing for cuts and breakages" },
          { id: "c", text: "8, rounding down to be economical" },
          { id: "d", text: "15, one for each square metre" },
        ],
        correct: "b",
        explanation:
          "The area is 14.4 m² and 14.4 divided by 1.44 is 10 exactly. An exact order assumes no tile is ever cut or broken, which is why any real job adds an allowance.",
        whyWrong: {
          a: "The arithmetic is right and the ordering decision is not. Ten boxes means a second trip the moment a tile breaks.",
          c: "Rounding down leaves the floor unfinished, which is the one outcome that definitely costs money.",
          d: "That counts square metres rather than boxes, and each box covers more than one square metre.",
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
          "A student cannot remember whether you flip the first or the second fraction when dividing. What is the fix?",
        options: [
          { id: "a", text: "A mnemonic to remember which one to flip" },
          {
            id: "b",
            text: "The reason behind the rule, since dividing asks how many of these fit into that",
          },
          { id: "c", text: "Practising the rule fifty more times" },
          { id: "d", text: "Avoiding division of fractions in the exam" },
        ],
        correct: "b",
        explanation:
          "A rule with no meaning cannot be checked or rebuilt. Once you know that 3 divided by a half asks how many halves fit into 3, the answer of 6 is obvious and the rule becomes recoverable.",
        whyWrong: {
          a: "A mnemonic is a second rule layered on the first, and it can be misremembered in exactly the same way.",
          c: "Repetition strengthens a rule that is remembered. It does nothing for one that is not.",
          d: "It appears in probability, ratio and algebra, so avoiding it is not available.",
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
            text: "Because the anxiety occupies working memory, which is the same limited space the steps of the problem need",
          },
          { id: "c", text: "Because exam questions are deliberately worded differently" },
          { id: "d", text: "Because of a lack of sleep" },
        ],
        correct: "b",
        explanation:
          "It is a resource problem rather than a knowledge problem. The attention that should be holding the problem is busy holding the fear, which is why writing the steps down helps: it moves the load onto paper.",
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
          a: "Countries that do not hold this belief get better results across their whole population, which is difficult to explain if the belief were simply accurate.",
          c: "Repetition spreads it. The self fulfilling part is what it does to the student's response to difficulty.",
          d: "Textbooks rarely state it. It is transmitted in offhand remarks, which is part of why it goes unchallenged.",
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
          "The Week 6 material is built on the Week 2 step. Repairing the specific step is ten minutes of work and it usually makes the intervening weeks make sense as well.",
        whyWrong: {
          a: "Working harder on material that rests on a missing piece rehearses the confusion.",
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
            text: "Because trying and failing to retrieve something prepares the mind to absorb it, and looking too early produces recognition instead",
          },
          { id: "c", text: "To stop students cheating" },
          { id: "d", text: "Because showing answers is technically difficult" },
        ],
        correct: "b",
        explanation:
          "Five minutes of honest struggle before a hint is worth more than the hint on its own. Looking early feels efficient and mostly produces the feeling of understanding rather than the thing itself.",
        whyWrong: {
          a: "Difficulty for its own sake would be pointless. This difficulty has a specific effect on retention.",
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
          "Why is doing twenty fraction questions in a row less useful than twenty mixed questions?",
        options: [
          { id: "a", text: "It is more useful, because it builds fluency in one topic" },
          {
            id: "b",
            text: "Because choosing the method is half the skill, and a block of one topic removes that half entirely",
          },
          { id: "c", text: "Because fractions are easy" },
          { id: "d", text: "Because twenty questions is too many for one topic" },
        ],
        correct: "b",
        explanation:
          "In an exam, nothing tells you which topic a question belongs to. Blocked practice trains the procedure while skipping the identification, and identification is the part that fails under pressure.",
        whyWrong: {
          a: "It does build fluency, and fluency in a procedure you cannot recognise the need for is of limited use.",
          c: "The topic is irrelevant to the argument. The same applies to any block of one topic.",
          d: "The number is not the issue. Twenty mixed questions would be fine.",
        },
      },
      {
        id: "maq4-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-rule-errors",
        prompt:
          "A student writes 1/2 + 1/3 = 2/5. Which response teaches more, and why?",
        options: [
          { id: "a", text: "Wrong, the answer is 5/6" },
          {
            id: "b",
            text: "You added the tops and the bottoms, and the bottom says how big each piece is rather than how many you have",
          },
          { id: "c", text: "Try again" },
          { id: "d", text: "Check your working" },
        ],
        correct: "b",
        explanation:
          "The second names a specific, repeatable habit, which is a thing that can be stopped. The others name a mark, which teaches nothing about what happened.",
        whyWrong: {
          a: "Giving the correct answer tells the student they were wrong and not what they did. They will do it again.",
          c: "A second attempt with no new information usually reproduces the first.",
          d: "The working is not where the fault is. The method is, and the student believes the method is correct.",
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
            text: "The daily sessions, because returning to something after a gap is what strengthens memory",
          },
          { id: "c", text: "They are equivalent, since the total time is similar" },
          { id: "d", text: "Neither, only the number of questions matters" },
        ],
        correct: "b",
        explanation:
          "Each time you retrieve something after forgetting a little of it, it comes back stronger. A single long session never gives you the gap, so it never gets that benefit.",
        whyWrong: {
          a: "Concentration does build, and it also decays within a long session, and neither effect outweighs the spacing benefit.",
          c: "The total time is similar and the effect is not. How study is distributed matters as much as how much there is.",
          d: "The number of questions matters and so does when they are done.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
