/**
 * ASSESSMENTS · MATHEMATICS · MONTH 1 · MODULE 1 · STARTING MATHEMATICS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * A module that is mostly about the learner still needs a check, and the
 * check has to test something real. Each lesson's check tests the lesson's
 * one job:
 *
 *   Lesson 1  Can they tell arithmetic from a topic they were never taught,
 *             and read a slip as one step to tighten rather than a verdict?
 *   Lesson 2  Can they do the everyday arithmetic the lesson showed, and
 *             spot where judgement has to be added to it?
 *   Lesson 3  Given a struggling student, can they name the real cause?
 *   Lesson 4  Given a study choice, can they pick the habit that works, and
 *             do they know why the course is ordered the way it is?
 *
 * ── HOW THESE ARE WRITTEN ────────────────────────────────────────────────
 *
 * NO NEW SITUATIONS WITHOUT NEW NUMBERS. Where a lesson worked an example,
 * the check uses a different one, so the question cannot be answered by
 * remembering a line from the page.
 *
 * NO LONGEST-ANSWER GIVEAWAY. The correct option is not the longest or the
 * most carefully worded one, and wrong options are the mistakes people
 * actually make (9:80 for a time, comparing totals for a price, fixing the
 * topic where the mark was lost). Options are shuffled when served, and the
 * correct id is varied here as well so the bank reads honestly.
 *
 * WHOLE NUMBERS ONLY. Every calculation is adding, subtracting, multiplying
 * or dividing whole numbers, which is the rule the module itself is built on.
 * No floor areas, no percentages.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · WHERE YOU ARE
  ═══════════════════════════════════════════════════════════════════ */
  "ma-l1-what-is-maths": {
    lessonId: "ma-l1-what-is-maths",
    passMark: 70,
    questions: [
      {
        id: "maq1-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-you-already-know",
        prompt:
          "Amaka works out 24 + 38 = 62, 7 × 6 = 42 and 96 ÷ 8 = 12 correctly on paper, but writes 105 − 47 = 68. What is the most useful conclusion?",
        options: [
          { id: "a", text: "She is not really a mathematics person" },
          { id: "b", text: "One step in her subtraction needs tightening" },
          { id: "c", text: "She should skip subtraction and move on" },
          { id: "d", text: "None of her four answers can be trusted now" },
        ],
        correct: "b",
        explanation:
          "Three of the four are right, and the fourth is 58, not 68. That slip comes from taking 7 from 5 the wrong way round in the ones. It is one particular step to tighten, which is very different from a verdict on her ability.",
        whyWrong: {
          a: "Three correct answers out of four, across all four operations, is somebody who can do arithmetic. One slip is information about one step.",
          c: "Subtraction is used inside almost every later topic. A shaky step is fixed by going back to it, not by avoiding it.",
          d: "The other three are checked and correct. A single slip in one subtraction says nothing about her addition, multiplication or division.",
        },
      },
      {
        id: "maq1-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-where-it-stops",
        prompt:
          "Which of these is a separate topic with its own rules, rather than ordinary arithmetic with bigger numbers?",
        options: [
          { id: "a", text: "4,182 + 9,507" },
          { id: "b", text: "24 × 7" },
          { id: "c", text: "1/2 + 1/4" },
          { id: "d", text: "960 ÷ 8" },
        ],
        correct: "c",
        explanation:
          "Adding two fractions is its own topic, with rules about the parts that somebody has to be told. The other three are the four operations you already have, just with larger numbers.",
        whyWrong: {
          a: "Larger numbers, same addition. Nothing new has to be learned to do it, only care.",
          b: "Still multiplication. The numbers are bigger and the idea is one you already use.",
          d: "Still division. It needs no rule you have not met.",
        },
      },
      {
        id: "maq1-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-not-arithmetic",
        prompt:
          "To solve 2x + 6 = 12 you take 6 off both sides, then halve both sides. Which arithmetic does that actually use?",
        options: [
          { id: "a", text: "12 − 6, then 6 ÷ 2" },
          { id: "b", text: "12 + 6, then 18 ÷ 2" },
          { id: "c", text: "12 × 2, then 24 − 6" },
          { id: "d", text: "None; algebra has its own kind of arithmetic" },
        ],
        correct: "a",
        explanation:
          "Taking 6 off both sides of 12 is 12 − 6 = 6, and halving 6 is 6 ÷ 2 = 3, so x = 3. Check: 2 lots of 3 is 6, and 6 more is 12. The arithmetic is ordinary; the only new thing is the rule that you may do the same to both sides.",
        whyWrong: {
          b: "That adds 6 instead of taking it off, and gives 9. Check it: 2 lots of 9 is 18, and 18 + 6 is 24, not 12.",
          c: "That doubles where the working halves. It does not follow the two steps described and does not lead to the missing number.",
          d: "Algebra uses exactly the same four operations. What it adds is a rule about doing the same thing to both sides, not new arithmetic.",
        },
      },
      {
        id: "maq1-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-not-arithmetic",
        prompt:
          "Tobi answers 20 − 5 instantly but freezes at −5 + 3. What does that tell you?",
        options: [
          { id: "a", text: "His subtraction is weaker than it looks" },
          { id: "b", text: "−5 + 3 is just a harder subtraction" },
          { id: "c", text: "He is not a mathematics person" },
          { id: "d", text: "He has not been taught directed numbers yet" },
        ],
        correct: "d",
        explanation:
          "Numbers below zero are a topic of their own, called directed numbers, with their own rules. Being stopped by a topic nobody has taught you is a fact about your timetable, not about you.",
        whyWrong: {
          a: "He handled 20 − 5 without trouble. The arithmetic is not the problem.",
          b: "It is not a harder version of the same thing. Starting below zero is a different idea, and that is why it needs its own rules.",
          c: "There is no such thing. Freezing at an untaught topic is exactly what anybody would do.",
        },
      },
      {
        id: "maq1-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-many-topics",
        prompt:
          "Ngozi has 3 loaves of bread to share equally between 4 children. Which topic was invented for exactly this kind of question?",
        options: [
          { id: "a", text: "Directed numbers" },
          { id: "b", text: "Fractions" },
          { id: "c", text: "Algebra" },
          { id: "d", text: "Statistics" },
        ],
        correct: "b",
        explanation:
          "3 does not divide evenly by 4, so each child gets part of a loaf. Fractions exist to answer exactly that question: what if it does not divide evenly?",
        whyWrong: {
          a: "Directed numbers answer questions about going below zero, or owing. Nothing here goes below zero.",
          c: "Algebra is for finding a missing part when you know the total. Here nothing is missing; the trouble is that the sharing is not even.",
          d: "Statistics is about what a collection of information is telling you. This is one sharing question.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · WHY IT IS WORTH IT
  ═══════════════════════════════════════════════════════════════════ */
  "ma-l2-why-it-matters": {
    lessonId: "ma-l2-why-it-matters",
    passMark: 70,
    questions: [
      {
        id: "maq2-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-beginning",
        prompt:
          "The Lebombo and Ishango bones, found in Africa, carry rows of cut notches. Why are they counted as mathematics?",
        options: [
          { id: "a", text: "Each notch records one thing, so together they keep a count" },
          { id: "b", text: "The notches spell out somebody's name" },
          { id: "c", text: "They show the earliest times tables" },
          { id: "d", text: "They are the oldest known written numbers, like 1, 2 and 3" },
        ],
        correct: "a",
        explanation:
          "One mark for one thing, cut in deliberate groups, is a record of how many, kept even when the things themselves were out of sight. That is counting, and it is where the whole subject starts.",
        whyWrong: {
          b: "Writing did not exist yet. These bones are tens of thousands of years older than the oldest known writing.",
          c: "Multiplying came very much later. These are one mark for one thing, which is counting.",
          d: "They are marks, not written figures. Written numbers came thousands of years later, from keeping accounts.",
        },
      },
      {
        id: "maq2-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-money",
        prompt:
          "Shop A sells 5 tins of milk for ₦2,000. Shop B sells 3 of the same tins for ₦1,260. Which is cheaper, and by how much per tin?",
        options: [
          { id: "a", text: "Shop B, because ₦1,260 is less than ₦2,000" },
          { id: "b", text: "Shop B, by ₦20 a tin" },
          { id: "c", text: "Shop A, by ₦740" },
          { id: "d", text: "Shop A, by ₦20 a tin" },
        ],
        correct: "d",
        explanation:
          "Find the price of one tin at each shop. Shop A: 2,000 ÷ 5 = ₦400. Shop B: 1,260 ÷ 3 = ₦420. Shop A is cheaper, by ₦20 a tin.",
        whyWrong: {
          a: "That compares totals for different numbers of tins. ₦1,260 buys only 3 tins; ₦2,000 buys 5. Prices can only be compared for the same amount.",
          b: "The difference of ₦20 is right, but it is the other way round. Shop B charges ₦420 a tin and Shop A charges ₦400.",
          c: "₦740 is the difference between the two totals, 2,000 − 1,260, which again compares different numbers of tins.",
        },
      },
      {
        id: "maq2-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-time",
        prompt:
          "A bus leaves Enugu at 7:35 and the journey takes 2 hours 45 minutes. What time does it arrive?",
        options: [
          { id: "a", text: "9:80" },
          { id: "b", text: "9:20" },
          { id: "c", text: "10:20" },
          { id: "d", text: "11:20" },
        ],
        correct: "c",
        explanation:
          "7:35 plus 2 hours is 9:35. Add 25 minutes to reach 10:00, which leaves 20 of the 45 minutes, so it arrives at 10:20.",
        whyWrong: {
          a: "That treats minutes as if they counted in hundreds: 35 + 45 = 80. There is no 9:80. Sixty minutes make an hour, so 80 minutes is 1 hour and 20 minutes.",
          b: "The 80 minutes were turned into 20 correctly, but the hour they made was dropped. 80 minutes is 1 hour and 20 minutes, so the hour goes up to 10.",
          d: "One hour too many. 7:35 plus 2 hours is 9:35, and the extra 45 minutes take it only one hour further, to 10:20.",
        },
      },
      {
        id: "maq2-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-measure",
        prompt:
          "A tailor has orders for 5 dresses, and each dress needs 3 metres of cloth. What should she buy?",
        options: [
          { id: "a", text: "Exactly 15 metres, because 5 × 3 = 15" },
          { id: "b", text: "A little more than 15 metres" },
          { id: "c", text: "5 metres, one for each dress" },
          { id: "d", text: "8 metres, because 5 + 3 = 8" },
        ],
        correct: "b",
        explanation:
          "The arithmetic gives exactly 15 metres, and 15 metres assumes nothing is ever cut wrong. An experienced tailor buys a little extra. That last step is judgement rather than calculation, and it is the part a textbook usually leaves out.",
        whyWrong: {
          a: "The arithmetic is right and the buying decision is not. With exactly 15 metres, a single cutting mistake leaves a dress unfinished.",
          c: "Each dress needs 3 metres, not 1. Five dresses need 5 lots of 3.",
          d: "5 dresses of 3 metres each is 5 lots of 3, which is multiplying, not adding.",
        },
      },
      {
        id: "maq2-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-careers",
        prompt:
          "Kemi wants to study a course with no obvious mathematics in it and thinks she can let the subject go. In the Nigerian system, what is accurate?",
        options: [
          { id: "a", text: "Mathematics is only required for science and engineering" },
          { id: "b", text: "A strong grade in English can replace it" },
          { id: "c", text: "Most courses, of every kind, require a credit in it" },
          { id: "d", text: "Only medicine and pharmacy require it" },
        ],
        correct: "c",
        explanation:
          "A credit in mathematics is required for admission to almost every university course, including a great many with no obvious connection to the subject. That is why it decides more doors than any other subject.",
        whyWrong: {
          a: "Accounting, business, law, architecture and many arts and social science courses require it too.",
          b: "Strength in another subject does not stand in for the requirement. It is asked for alongside English, not instead of it.",
          d: "Medicine and pharmacy require it, and so do most other courses.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · WHAT GOT IN THE WAY
  ═══════════════════════════════════════════════════════════════════ */
  "ma-l3-why-it-feels-hard": {
    lessonId: "ma-l3-why-it-feels-hard",
    passMark: 70,
    questions: [
      {
        id: "maq3-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-gaps",
        prompt:
          "Chidi loses marks in ratio questions and in chance questions. His working shows he goes wrong every time something has to be shared into equal parts. What should he repair first?",
        options: [
          { id: "a", text: "Ratio, since that is where most marks go" },
          { id: "b", text: "More past papers on both topics" },
          { id: "c", text: "Sharing into equal parts" },
          { id: "d", text: "Chance questions, since they come later" },
        ],
        correct: "c",
        explanation:
          "The low marks appear in ratio and chance, but the problem is underneath both of them. Repairing the sharing step fixes every topic that uses it at once.",
        whyWrong: {
          a: "That fixes where the mark was lost rather than where the problem is. The same gap would keep turning up in chance questions and everywhere else sharing is used.",
          b: "More papers repeat the same mistake on new questions. Practice helps once the step underneath works.",
          d: "That is the same mistake as fixing ratio first: working on the topic where the gap shows up, not on the gap.",
        },
      },
      {
        id: "maq3-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-procedures",
        prompt:
          "Ade learned 'to multiply by ten, add a zero'. It gives 7 × 10 = 70 every time. What is the weakness of knowing it only that way?",
        options: [
          { id: "a", text: "There is none; it always gives the right answer" },
          { id: "b", text: "With no reason behind it, he cannot rebuild or check it" },
          { id: "c", text: "It is too slow to use in an exam" },
          { id: "d", text: "It gives the wrong answer for whole numbers" },
        ],
        correct: "b",
        explanation:
          "A rule with no reason cannot be checked or rebuilt. If he misremembers it, or meets a number it does not fit, he has nothing to fall back on. The reason, that every figure moves one place to the left, never stops working.",
        whyWrong: {
          a: "It works for whole numbers. It quietly stops working later in the course, and without the reason he will not see why.",
          c: "It is very fast. Speed is not the problem; having no reason behind it is.",
          d: "For whole numbers it gives the right answer every time, as the question says. The weakness is what happens when it is forgotten or stretched.",
        },
      },
      {
        id: "maq3-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-speed",
        prompt:
          "In Primary 4, Emeka was always last to finish the timed tables test, and he decided he was bad at mathematics. What did that test actually measure?",
        options: [
          { id: "a", text: "His ability at mathematics in general" },
          { id: "b", text: "How quickly he recalled one set of facts" },
          { id: "c", text: "Whether he understood multiplying" },
          { id: "d", text: "How intelligent he is" },
        ],
        correct: "b",
        explanation:
          "A timed tables test measures recall speed on one narrow skill. That skill is worth training, because it frees attention for the real problem, but it was never evidence about anything else.",
        whyWrong: {
          a: "Mathematics is far more than recall speed. Some of the most capable mathematicians alive are unremarkable at mental arithmetic.",
          c: "Somebody can understand multiplying perfectly well and still recall the facts slowly. Careful is not the same as unable.",
          d: "A test of speed on one set of facts says nothing about general intelligence.",
        },
      },
      {
        id: "maq3-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-anxiety",
        prompt:
          "Bisi does a page of questions calmly at home, then goes blank on the same kind in a test. Which response fits how the blankness works?",
        options: [
          { id: "a", text: "Accept that she never really understood them" },
          { id: "b", text: "Skip writing working in tests, to save time" },
          { id: "c", text: "Study everything the night before the test" },
          { id: "d", text: "Write every step down so less is held in her head" },
        ],
        correct: "d",
        explanation:
          "Anxiety takes up the same limited room in memory that the steps of a problem need. Writing the steps down moves that load out of her head and onto the paper, which leaves room to think.",
        whyWrong: {
          a: "She did them calmly at home, so she does understand them. The blankness is a space problem, not a knowledge problem.",
          b: "That does the opposite: it forces her to hold every step in her head at once, which is exactly what the anxiety is crowding out.",
          c: "One long session the night before gives no gaps for memory to strengthen, and does nothing about the space the anxiety takes up.",
        },
      },
      {
        id: "maq3-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-understanding",
        prompt:
          "28 oranges are packed as 7 bags of 4. They are emptied out and repacked as 4 bags of 7. Without counting again, how many oranges are there now?",
        options: [
          { id: "a", text: "28, since repacking cannot change how many there are" },
          { id: "b", text: "28, but only because the tables say so" },
          { id: "c", text: "You cannot tell without counting them again" },
          { id: "d", text: "More, because the bags are fuller now" },
        ],
        correct: "a",
        explanation:
          "Nothing was added and nothing was taken away, so the count cannot have changed. That is why 7 fours and 4 sevens must be the same number, and it is a reason you can rebuild the fact from if it ever slips.",
        whyWrong: {
          b: "The number is right, but the reason is borrowed. Knowing why it must be 28 is what lets you get it back when the table fact is forgotten.",
          c: "You can tell, without counting, because packing the same oranges differently cannot change how many there are.",
          d: "Each bag holds more, and there are fewer bags. The total stays exactly the same.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · HOW TO DO IT THIS TIME
  ═══════════════════════════════════════════════════════════════════ */
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
          "You have one hour and twelve worked examples. Which plan will leave you able to do the most of them next week?",
        options: [
          { id: "a", text: "Read all twelve carefully, making sure each one makes sense" },
          { id: "b", text: "Copy all twelve out neatly into your notebook" },
          { id: "c", text: "Read one, cover it, try it yourself, then check" },
          { id: "d", text: "Underline the important step in each of the twelve" },
        ],
        correct: "c",
        explanation:
          "Only trying it yourself finds out what you can actually produce, and producing it from a blank page is what is tested. You may only get through four, and you will keep more of those four than of twelve you read.",
        whyWrong: {
          a: "Following a solution feels like learning because each step makes sense as you read. It trains recognising a method, not producing one.",
          b: "Copying is still following someone else's working. Your hand moves, but nothing is being produced from your own head.",
          d: "Picking out the key step is still reading. You have not found out whether you could take that step yourself.",
        },
      },
      {
        id: "maq4-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-w-rule-explain",
        prompt:
          "In the working for 47 + 38 = 85, a small 1 is written above the 4. What is that 1?",
        options: [
          { id: "a", text: "One ten, made when 7 + 8 gave 15 ones" },
          { id: "b", text: "One hundred, carried to the next place" },
          { id: "c", text: "A mark that reminds you to add 1 to the answer" },
          { id: "d", text: "A rule to follow; it does not stand for anything" },
        ],
        correct: "a",
        explanation:
          "7 and 8 make 15, which is one ten and five ones. The 5 stays in the ones place, and the ten moves across to join the tens: 4 tens + 3 tens + that 1 ten makes 8 tens. That reason covers every carry you will ever do.",
        whyWrong: {
          b: "It sits above the tens, and it came from 15 ones, which is one ten and five ones, not a hundred.",
          c: "It is not added to the answer at the end. It is one ten, and it joins the other tens.",
          d: "That is exactly the kind of step this habit asks you never to accept. The 1 stands for a ten, and knowing that is what makes every carry make sense.",
        },
      },
      {
        id: "maq4-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-ma-w-rule-spacing",
        prompt:
          "You have about four hours a week to study. Which way of using them will leave you remembering the most?",
        options: [
          { id: "a", text: "All four hours on Saturday, without a break" },
          { id: "b", text: "Two long sessions of two hours each" },
          { id: "c", text: "It makes no difference, if the total is the same" },
          { id: "d", text: "Forty to fifty minutes on most days of the week" },
        ],
        correct: "d",
        explanation:
          "Coming back to something after a gap, when you have forgotten a little of it, is what makes it stronger. Short sessions on most days give you that gap again and again.",
        whyWrong: {
          a: "One long session never gives the gap that strengthens memory, and attention fades well before four hours are up.",
          b: "Better than one session, and still far fewer chances to come back after a gap than short, frequent sessions.",
          c: "The total is the same and the effect is not. How study is spread out matters as much as how much there is.",
        },
      },
      {
        id: "maq4-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-w-rule-back",
        prompt:
          "Halfway through Month 4 you realise your division is shaky and it is slowing everything down. What is the sensible move?",
        options: [
          { id: "a", text: "Push on, because going back means falling behind" },
          { id: "b", text: "Go back and repair division, then carry on" },
          { id: "c", text: "Start the whole course again from Lesson 1" },
          { id: "d", text: "Avoid the questions that need division" },
        ],
        correct: "b",
        explanation:
          "Repairing one skill is quick, and it speeds up everything built on it. Going back in this subject is not a punishment or a delay; it is the shortest way forward.",
        whyWrong: {
          a: "Pushing on with a shaky skill makes every later topic slower and more error-prone. That is what falling behind actually looks like.",
          c: "Nothing is wrong with the rest of it. Repair the one skill rather than repeating four months of work.",
          d: "Division is inside fractions, ratio, sharing and solving for x. There is nowhere in the course it can be avoided.",
        },
      },
      {
        id: "maq4-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-w-what-this-course-does",
        prompt:
          "This course teaches fractions and negative numbers before it teaches you to solve for x properly. Why?",
        options: [
          { id: "a", text: "Because algebra is the hardest topic and is best left late" },
          { id: "b", text: "Because the exams test fractions before algebra" },
          { id: "c", text: "Because solving for x uses them, so they are built first" },
          { id: "d", text: "So the early months are easier and shorter" },
        ],
        correct: "c",
        explanation:
          "Solving for x is full of arithmetic, often with fractions and negative numbers in it. The course never uses an idea before it has been taught, so the ideas algebra rests on come first, and algebra then feels like a continuation rather than a new subject.",
        whyWrong: {
          a: "It is not put off; it is prepared for. Month 4 teaches it and Month 6 goes much further.",
          b: "Exam papers mix every topic together. The order comes from what each topic depends on, not from the order of an exam.",
          d: "The early months are not there to be easy. They carry the weight of everything that follows.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
