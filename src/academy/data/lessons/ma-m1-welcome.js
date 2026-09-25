/**
 * MATHEMATICS · MONTH 1 · MODULE 1 · STARTING MATHEMATICS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * There is not a single sum in this module, and that is deliberate.
 *
 * A course that opens with a calculation is speaking only to the students who
 * were already doing fine. Everyone else arrives carrying something: a gap
 * from four years ago, a memory of being timed and found slow, a teacher who
 * moved on before they understood, or a sentence somebody once said to them
 * about not being a mathematics person. None of that is addressed by starting
 * with fractions, and all of it will still be there in Month 6.
 *
 * So this module says what the subject is, where it actually turns up in a
 * life, why it goes wrong for so many people, and how to study it so that it
 * works this time. Everything after it is mathematics. This part is the
 * ground you stand on while you do it.
 */

export const SECTION_ID = "ma-s1-welcome";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l1-what-is-maths",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 1,
    title: "What Mathematics Actually Is",
    subtitle: "And why what you were taught was only one room of it",
    estimatedMinutes: 14,
    intro:
      "Ask most people what mathematics is and they will describe arithmetic: adding, subtracting, times tables, long division. That is one room in a very large house, and it is not even the most interesting one. This lesson is about the house.",

    atoms: [
      {
        id: "a-ma-w-not-arithmetic",
        title: "Mathematics is not arithmetic",
        explain:
          "Arithmetic is calculating with numbers. Mathematics is the study of patterns, quantity, structure, space and change. Arithmetic is to mathematics roughly what spelling is to writing: necessary, useful, and nowhere near the whole of it.",
        why: "This matters because a great many people decide they are bad at mathematics when what they actually found difficult was fast mental arithmetic. Those are different skills. Plenty of excellent mathematicians are slow at mental arithmetic, and a calculator has been better than all of them at it since about 1970.",
        table: {
          caption: "Five branches, and the question each one asks.",
          headers: ["Branch", "The question it asks", "Where you meet it"],
          rows: [
            ["Number", "How much, and how many?", "Months 1 to 3"],
            ["Algebra", "What is true for every case, not just this one?", "Months 4 and 6"],
            ["Geometry", "What shape is it, and how big?", "Months 5 and 8"],
            ["Statistics", "What does this data actually show?", "Month 8"],
            ["Calculus", "How fast is it changing?", "Month 9"],
          ],
          note: "Only the first of these is mostly calculating. The other four are mostly reasoning.",
        },
        mistake:
          "Judging your ability at the whole subject by how quickly you can multiply in your head. That is one skill in one branch, and it is the one machines took over first.",
      },
      {
        id: "a-ma-w-patterns",
        title: "At its heart it is the study of patterns",
        explain:
          "Notice that 1 + 3 = 4, that 1 + 3 + 5 = 9, and that 1 + 3 + 5 + 7 = 16. Those answers are 2 squared, 3 squared and 4 squared. That is a pattern, and mathematics is what you do next: ask whether it always happens, and then find out why.",
        why: "Spotting a pattern is not the mathematics. Anyone can spot a pattern. The mathematics is in asking whether it holds for every case and being able to say why, because a pattern that holds for the first four numbers and then fails is worse than useless if you trusted it.",
        example:
          "  1                    = 1    = 1 x 1\n  1 + 3                = 4    = 2 x 2\n  1 + 3 + 5            = 9    = 3 x 3\n  1 + 3 + 5 + 7        = 16   = 4 x 4\n  1 + 3 + 5 + 7 + 9    = 25   = 5 x 5\n\n  The pattern: adding the first n odd numbers gives n squared.\n\n  Why it happens, as a picture. Each odd number is an L shaped\n  layer wrapped around a square, turning it into the next square:\n\n      *  |  * *  |  * * *\n         |  * *  |  * * *\n         |       |  * * *\n\n  1        4         9\n\n  Now you do not merely believe it. You can see that it must be so.",
        analogy:
          "A tailor who notices that a certain cut always hangs well has spotted a pattern. A tailor who can say exactly why it hangs well, and therefore predict what will happen with a heavier cloth, is doing something closer to mathematics.",
      },
      {
        id: "a-ma-w-language",
        title: "It is also a language for saying exactly what you mean",
        explain:
          "Ordinary language is full of useful vagueness. Mathematical notation is built so that a statement has exactly one meaning. When you write A = πr², there is no second reading of it, in any country, in any century.",
        why: "This is why the symbols exist. They are not there to make the subject look difficult. They are there because the English sentence describing the same fact takes four lines and can still be misread, and because a formula written in Lagos has to mean the same thing when it is read in Lisbon.",
        example:
          "  In English:\n\n    The area of a circle is found by multiplying the number pi\n    by the radius of the circle multiplied by itself.\n\n  In mathematical notation:\n\n    A = πr²\n\n  Same fact. One of them fits on a line and cannot be misread.",
        mistake:
          "Reading notation as decoration and skipping over it. Every symbol in a formula is a word in a sentence, and skipping a symbol is skipping a word.",
      },
      {
        id: "a-ma-w-cumulative",
        title: "It is the one subject where everything sits on what came before",
        explain:
          "In history you can miss the causes of the First World War and still do well on the Cold War. In mathematics, if you miss fractions you will later struggle with algebraic fractions, with probability, with ratio and with calculus, and the difficulty will look as though it belongs to those topics.",
        why: "This single property explains almost everything about why the subject feels different from the others, why it goes wrong quietly, and why going back is not a punishment but the fastest route forward. It is also why this course is ordered the way it is and why it will not let you past an idea until it is working.",
        table: {
          caption: "One gap, and where it surfaces later.",
          headers: ["The gap", "Where it shows up", "What it looks like"],
          rows: [
            ["Times tables", "Long division, factorising, fractions", "Slow, and tiring to do anything longer"],
            ["Fractions", "Algebraic fractions, probability, calculus", "Looks like failing at algebra"],
            ["Place value", "Decimals, standard form, rounding", "Answers a thousand times too big"],
            ["Negative numbers", "Solving equations, coordinates, gradients", "Sign errors that seem random"],
            ["Reading a question", "Every word problem, in every topic", "Right method, wrong question answered"],
          ],
          note: "In each row, the second column is where the student gets the low mark, and the first column is where the problem is.",
        },
        analogy:
          "Building a house. Nobody blames the roof when the foundation was rushed, but the roof is where the leak appears.",
      },
      {
        id: "a-ma-w-understanding",
        title: "Knowing a procedure and understanding an idea",
        explain:
          "You can be taught to turn 3/4 into 0.75 by a rule. You understand it when you know that the fraction bar means divide, so 3/4 is simply 3 ÷ 4 and there was never a separate rule to learn.",
        why: "A procedure is a thing you can forget, and under exam pressure you will. An understanding is a thing you can rebuild. The student who knows that a fraction bar means divide can reconstruct the method in five seconds; the student who learned the rule has nothing to fall back on when it goes.",
        example:
          "  Procedure:    To turn a fraction into a decimal, divide the\n                top by the bottom.\n\n  Understanding: A fraction bar IS a division sign. 3/4 and 3 ÷ 4\n                are two ways of writing the same instruction.\n\n  Both give 0.75. Only one of them still works in two years,\n  and only one of them explains why 3 ÷ 4 is less than 1.",
        practice: {
          prompt:
            "A student says: to divide by a fraction, turn it upside down and multiply. Is that a procedure or an understanding?",
          answer:
            "A procedure, as stated. It becomes an understanding when you can say why: dividing asks how many of these fit into that, and a half fits into 3 exactly 6 times. That is why 3 ÷ 1/2 = 6, and it is also why dividing by something smaller than 1 makes the answer bigger, which the rule alone never explains.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l2-why-it-matters",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 2,
    title: "Where Mathematics Lives in Your Day",
    subtitle: "Money, time, measurement and judgement",
    estimatedMinutes: 13,
    intro:
      "The honest answer to when will I ever use this is: you already are, several times a day, usually without noticing. This lesson is where it is hiding, and what it costs when it is missing.",

    atoms: [
      {
        id: "a-ma-w-money",
        title: "Money is mathematics with consequences",
        explain:
          "Every discount, every instalment plan, every loan, every data bundle and every market price is a calculation. The person who can do it is deciding. The person who cannot is being told.",
        why: "This is the most practical argument for the subject there is. A trader who can work out a true margin prices correctly. A borrower who can work out real interest knows what a loan actually costs. Neither of those is advanced mathematics; both are the percentage work in Month 3.",
        table: {
          caption: "Four ordinary decisions, and the topic each one needs.",
          headers: ["The decision", "The mathematics", "Taught in"],
          rows: [
            ["Is this discount actually a discount?", "Percentage of an amount", "Month 3"],
            ["Which data bundle is better value?", "Rate and unit cost", "Month 4"],
            ["What does this loan really cost?", "Simple and compound interest", "Month 5"],
            ["Is my business making money?", "Profit, loss, percentage margin", "Month 5"],
          ],
        },
        example:
          "  A shop advertises 20% off, then adds 7.5% VAT at the till.\n  Another shop advertises 15% off with VAT already included.\n  A ₦40,000 item:\n\n    Shop A:  40,000 - 20%  = 32,000\n             32,000 + 7.5% = 34,400\n\n    Shop B:  40,000 - 15%  = 34,000\n\n  The bigger discount is the more expensive shop. Nothing here\n  is harder than Month 3, and most people pay the difference.",
        mistake:
          "Assuming the larger advertised percentage is the better deal. Percentages of different amounts are not comparable until you work them out.",
      },
      {
        id: "a-ma-w-time",
        title: "Time, speed and getting there",
        explain:
          "Working out when to leave, how long a journey takes at a given speed, or whether two buses will meet is arithmetic with units attached. Time is the awkward one because it runs in sixties rather than tens.",
        why: "Journey and rate problems are among the most common word problems on every paper, and they are also among the most common calculations in an actual working day for a driver, a logistics clerk, a trader moving goods or anyone catching a flight.",
        example:
          "  A bus leaves Lagos at 06:40 and the journey takes 3 hours\n  and 50 minutes. When does it arrive?\n\n    06:40 + 3 hours          = 09:40\n    09:40 + 20 minutes       = 10:00\n    10:00 + 30 minutes       = 10:30\n\n  Arrives 10:30.\n\n  Subtracting the two as though they were ordinary numbers gives\n  nonsense, because clock time counts in sixties, not hundreds.",
        analogy:
          "Money in naira and kobo counts in hundreds. Time counts in sixties. Using the habits of one on the other is where most time errors come from.",
      },
      {
        id: "a-ma-w-measure",
        title: "Measurement, and the trades that run on it",
        explain:
          "A tailor cutting cloth, a builder ordering cement, a farmer spacing seedlings, a cook scaling a recipe and a carpenter mitring a corner are all doing mensuration, ratio and sometimes trigonometry.",
        why: "These are not made up examples for a textbook. Ordering 10% too little cement stops a job; cutting a metre of cloth short ruins it. In every one of these trades the person who is confident with measurement earns more, because they waste less and quote more accurately.",
        table: {
          caption: "The trade, and the topic it is quietly using.",
          headers: ["Trade", "The mathematics", "Taught in"],
          rows: [
            ["Tailoring", "Ratio, scaling, measurement", "Month 4"],
            ["Building", "Area, volume, percentage waste", "Months 4 and 8"],
            ["Carpentry", "Angles, Pythagoras, bearings", "Months 5 and 8"],
            ["Catering", "Ratio, proportion, unit cost", "Month 4"],
            ["Farming", "Area, rate, yield per hectare", "Months 4 and 8"],
          ],
        },
        practice: {
          prompt:
            "A builder is told a room is 4.5 m by 3.2 m and that tiles come in boxes covering 1.44 m². Roughly how many boxes, before waste?",
          answer:
            "Area is 4.5 × 3.2 = 14.4 m². 14.4 ÷ 1.44 = 10 boxes exactly, so with any waste allowance at all the order is 11. Every step of that is Month 4, and getting it wrong is either a second trip to the supplier or money left on the floor.",
        },
      },
      {
        id: "a-ma-w-judgement",
        title: "Judgement: statistics, risk and not being fooled",
        explain:
          "Percentages in a news report, averages quoted without a spread, a chart with a truncated axis, a claim that two things are connected because they moved together. Reading these properly is a mathematical skill and it is mostly Month 8.",
        why: "This is the part of the subject that protects you. A great deal of what people are asked to believe is presented as a number precisely because numbers feel unarguable. Knowing the difference between a mean and a median, or between correlation and cause, is the difference between reading a claim and being led by it.",
        example:
          "  Nine workers earn ₦80,000. The owner earns ₦2,000,000.\n\n    Mean   average = ₦272,000\n    Median average = ₦80,000\n\n  Both are true. If you want the company to sound generous you\n  quote the first. If you want to describe what a worker there\n  actually earns you quote the second.\n\n  Knowing which is being quoted, and why, is the whole skill.",
        mistake:
          "Treating a number as automatically objective. A number is a claim, and like any claim it can be chosen to mislead without being false.",
      },
      {
        id: "a-ma-w-careers",
        title: "The doors it opens, and the ones it closes",
        explain:
          "In Nigeria a credit in mathematics is a requirement for admission to almost every university course, not only the sciences. Beyond admission, it is the entry qualification for engineering, medicine, accounting, data work, finance, architecture, computing and the whole of the trades that quote and estimate.",
        why: "It is worth being plain about this rather than pretending the subject is only its own reward. Mathematics is the single subject that most often decides which doors a Nigerian student can walk through, and a failure in it closes more of them than a failure in anything else.",
        table: {
          caption: "What the subject is actually gatekeeping.",
          headers: ["Field", "What it needs"],
          rows: [
            ["Engineering, physics", "Algebra, trigonometry, calculus"],
            ["Medicine, pharmacy", "Statistics, ratio, dosage calculation"],
            ["Accounting, banking", "Percentage, interest, financial arithmetic"],
            ["Data and software", "Algebra, logic, statistics, probability"],
            ["Architecture, surveying", "Geometry, mensuration, bearings"],
            ["Business of any kind", "Margin, break even, cash flow"],
          ],
          note: "Every one of those topics appears in this course.",
        },
        practice: {
          prompt:
            "Name one thing you did in the last week that involved a calculation you did not think of as mathematics at the time.",
          answer:
            "There is no single right answer, and the point is the noticing. Common ones: checking change, comparing two prices per unit, working out how long until you had to leave, splitting a bill, deciding whether a data plan was worth it, estimating how much fuel a trip would take.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l3-why-it-feels-hard",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 3,
    title: "Why Mathematics Feels Hard",
    subtitle: "Six real reasons, none of which is a lack of ability",
    estimatedMinutes: 15,
    intro:
      "If you have found this subject difficult, there is a reason, and it is almost certainly one of the six in this lesson. Every one of them is fixable, which is the point of naming them.",

    atoms: [
      {
        id: "a-ma-w-gaps",
        title: "Reason one: gaps compound, quietly",
        explain:
          "Because every topic rests on earlier ones, a gap does not stay where it started. It travels. A student who never secured fractions in JSS1 meets it again in ratio, in probability, in algebraic fractions and in calculus, and each time it looks like a new failure.",
        why: "This is why people describe mathematics as suddenly getting hard in a particular year. It rarely does. What usually happened is that a gap opened two or three years earlier and the point was finally reached where the topics depending on it became unavoidable.",
        example:
          "  How one missed idea shows up four years later:\n\n    JSS1   Fractions not secured\n     ↓\n    JSS2   Ratio feels arbitrary\n     ↓\n    JSS3   Algebraic fractions look impossible\n     ↓\n    SS2    Probability answers never simplify\n     ↓\n    SS3    Calculus questions break at the last line\n\n  Five low marks, in five different topics, from one gap.",
        mistake:
          "Trying to fix the topic where the low mark appeared. If the marks are being lost on the fraction step of a probability question, the thing to repair is fractions, and repairing it fixes four topics at once.",
      },
      {
        id: "a-ma-w-procedures",
        title: "Reason two: procedures taught without meaning",
        explain:
          "Turn it upside down and multiply. Move it to the other side and change the sign. Add a zero. These are instructions with no explanation attached, and they work right up until you misremember one detail.",
        why: "A rule with no meaning behind it cannot be checked or rebuilt. A student who has forgotten whether you flip the first fraction or the second has no way of deciding; a student who knows the rule comes from how many of these fit into that can work it out in seconds.",
        table: {
          caption: "The rule, and the meaning it was hiding.",
          headers: ["What you were told", "What it actually is"],
          rows: [
            ["Turn it upside down and multiply", "How many of these fit into that"],
            ["Move it over and change the sign", "Do the same thing to both sides of a balance"],
            ["Add a zero when multiplying by ten", "Every digit moves one column left"],
            ["Two minuses make a plus", "Taking away a debt leaves you better off"],
            ["BODMAS", "Some parts of an expression are single quantities"],
          ],
          note: "The right hand column survives being forgotten. The left hand column does not.",
        },
        mistake:
          "Collecting more rules when a rule fails. The fix for a rule you cannot remember is not a second rule; it is the reason behind the first one.",
      },
      {
        id: "a-ma-w-speed",
        title: "Reason three: speed mistaken for ability",
        explain:
          "Somewhere in primary school, being fast became the measure of being good. Children who needed a few more seconds concluded they were not mathematics people, and many of them were simply being careful.",
        why: "Speed with table facts genuinely matters, and this course drills it, but for a specific and limited reason: it frees up attention for the actual problem. It is not a measure of mathematical ability. Some of the best mathematicians in the world are unremarkable at mental arithmetic.",
        analogy:
          "A fast typist is not therefore a good writer. Typing speed helps a writer because it stops the mechanics getting in the way of the thinking, and that is exactly the role of table facts.",
        mistake:
          "Concluding from a timed test in Primary 4 that you cannot do this subject. That test measured recall speed on one narrow skill, and it was never evidence about anything else.",
      },
      {
        id: "a-ma-w-questions",
        title: "Reason four: you stopped asking",
        explain:
          "In a class of sixty, asking a question costs something. So students learn to nod, write the steps down, and hope it makes sense later. It does not make sense later, and the next topic assumes it did.",
        why: "This turns one small confusion into a permanent one. The question you did not ask in Week 2 is the reason Week 6 makes no sense, and by then the question feels too basic to raise. That spiral is the single most common way a student quietly falls behind while appearing to keep up.",
        example:
          "  What it sounds like inside a lesson:\n\n    Week 2  I do not quite see why that step works.\n            Everyone else is writing. I will work it out later.\n\n    Week 4  This is building on Week 2. I still do not see it.\n            Too late to ask now.\n\n    Week 6  I am lost, and I cannot say where it started.\n\n  The honest sentence at Week 6 is: go back to Week 2.",
        mistake:
          "Waiting until you are lost to go back. Go back the moment a step stops making sense, when the repair is ten minutes rather than a month.",
      },
      {
        id: "a-ma-w-anxiety",
        title: "Reason five: mathematics anxiety is real, and it is physical",
        explain:
          "Anxiety about this subject occupies working memory, which is the same limited space you need for holding the steps of a problem. That is why people go blank in tests on questions they can do calmly at home.",
        why: "Knowing the mechanism helps, because it stops you reading the blankness as evidence about your ability. It is not. It is a resource problem: the attention that should be holding the problem is busy holding the fear.",
        table: {
          caption: "What actually reduces it, according to how it works.",
          headers: ["What helps", "Why it helps"],
          rows: [
            ["Writing the steps down", "Moves the load out of your head onto paper"],
            ["Practising to the point of automaticity", "Frees the space the steps were using"],
            ["Doing questions under mild time pressure", "Rehearses the conditions, not just the content"],
            ["Starting with a question you can do", "Breaks the blank at the start of a paper"],
            ["Knowing errors are expected", "Removes the thing being feared"],
          ],
        },
        analogy:
          "Trying to hold a phone conversation while someone reads numbers at you. You are not bad at conversation. Something else is using the channel.",
      },
      {
        id: "a-ma-w-myth",
        title: "Reason six: the myth of the mathematics person",
        explain:
          "The idea that some people simply have a mathematical brain and others do not is the most damaging belief in the subject. It is also not supported by the evidence, and countries that do not hold it get better results across the board.",
        why: "The belief is self fulfilling. If ability is fixed, effort is pointless, so a student who believes it stops trying at the first difficulty and interprets the resulting failure as confirmation. If ability is built, difficulty is information about what to practise next, which is a completely different response to the same experience.",
        example:
          "  The same moment, two beliefs:\n\n    A question is hard and you are stuck.\n\n    Fixed:  This is the proof. I am not a maths person.\n            → stop\n\n    Built:  I am missing something specific. What is it?\n            → find it, drill it, continue\n\n  The question was identical. The next twenty minutes were not.",
        mistake:
          "Repeating the sentence about yourself. Saying I am just not good at maths out loud, often enough, does most of the work of making it true.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l4-rules-for-learning",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 4,
    title: "The Rules for Learning Mathematics",
    subtitle: "Eight rules, and how this course applies each one",
    estimatedMinutes: 15,
    intro:
      "Studying this subject well is not a matter of effort alone. There are ways of working that produce results and ways that feel productive and do very little. These eight rules are the difference, and the course is built around them.",

    atoms: [
      {
        id: "a-ma-w-rule-pen",
        title: "Rule one: do it with a pen",
        explain:
          "Reading a worked solution and following it is not learning mathematics. It feels like learning, because everything makes sense as you read. Close the page and attempt it yourself and you find out what you actually have.",
        why: "This is the single biggest gap between how people study and what works. Recognising a method when you see it and producing it from a blank page are different abilities, and only the second one is tested. Everything else in this list is downstream of this rule.",
        example:
          "  Two students, one hour each, same worked examples.\n\n    Student A  reads all twelve, nodding, understanding each.\n    Student B  reads one, closes it, attempts it, gets stuck,\n               looks, finishes it, then does the next.\n\n  Student B covers four. Student B will get more of them right\n  next week than Student A gets right the same afternoon.",
        mistake:
          "Measuring study by how much you covered. A page you worked through with a pen is worth more than ten pages you read.",
      },
      {
        id: "a-ma-w-rule-struggle",
        title: "Rule two: struggle first, then look",
        explain:
          "When you are stuck, the productive thing is to stay stuck for a few minutes before looking at the answer. The looking teaches far more after you have tried than before.",
        why: "Trying to retrieve something, and failing, prepares the mind to absorb it. Looking too early feels efficient and mostly produces recognition rather than knowledge. Five minutes of honest struggle before the hint is worth more than the hint on its own.",
        table: {
          caption: "How this course paces help.",
          headers: ["What you get", "When"],
          rows: [
            ["No hint at all", "Your first attempt at any drill"],
            ["A nudge", "First rung of the hint ladder, on request"],
            ["The method", "Second rung"],
            ["The first worked step", "Third rung"],
            ["The full solution", "Only after you have submitted an answer"],
          ],
          note: "There is no button anywhere in this course that reveals an answer you have not attempted.",
        },
      },
      {
        id: "a-ma-w-rule-explain",
        title: "Rule three: never accept a step you cannot explain",
        explain:
          "If a line of working appears and you do not know why it is allowed, stop. Write the question down. A step you cannot explain is a rule you are borrowing, and it will not be there when you need it.",
        why: "This is the rule that prevents Reason two from the previous lesson. Every procedure in this subject has a reason, the reasons are usually short, and collecting them is what makes the whole thing hold together rather than being four hundred separate instructions.",
        example:
          "  Working you are given:\n\n      3x + 5 = 20\n      3x = 15\n\n  The question to ask: why was I allowed to do that?\n\n  The answer: both sides had 5 subtracted from them. An equation\n  is a balance, so anything done to one side must be done to the\n  other, and then it is still true.\n\n  That single reason covers every equation in the course.",
        practice: {
          prompt:
            "Find one thing in mathematics you can do but could not explain to someone else. Write down the question you would need answered.",
          answer:
            "Common ones: why you flip the second fraction when dividing, why a negative times a negative is positive, why the second row of a long multiplication ends in a zero, why you cannot divide by zero. Every one of those is answered in the first two months of this course, and the fact that you can name the question means you will notice when the answer arrives.",
        },
      },
      {
        id: "a-ma-w-rule-errors",
        title: "Rule four: an error is information, not a verdict",
        explain:
          "When an answer is wrong, the useful question is not was I wrong but what did I do. Almost every wrong answer in mathematics comes from a specific, repeatable, nameable action.",
        why: "This is why this course marks the way it does. Being told incorrect teaches nothing. Being told you added the denominators, and here is why that changes the size of the pieces, teaches the thing you got wrong. An error you can name is an error you can stop making.",
        example:
          "  A student writes 1/2 + 1/3 = 2/5.\n\n    Unhelpful:  Wrong. The answer is 5/6.\n\n    Useful:     You added the tops and the bottoms. The bottom\n                says how big each piece is, not how many you\n                have, so adding the bottoms changes the size of\n                the pieces halfway through the sum.\n\n  The second one names a habit. The first one names a mark.",
        mistake:
          "Rubbing out wrong working. It is the most useful thing on the page. Cross it out if you must, but keep it where you can see what you did.",
      },
      {
        id: "a-ma-w-rule-spacing",
        title: "Rule five: little and often beats long and rare",
        explain:
          "Forty minutes a day for five days will leave you with far more than a single four hour session at the weekend, even though the total time is similar. Memory is strengthened by returning to something after a gap.",
        why: "Each time you retrieve something after forgetting a little of it, it comes back stronger. A single long session never gives you the gap, so it never gets that benefit. This is also why this course returns to earlier skills in mixed reviews rather than finishing a topic and abandoning it.",
        analogy:
          "Watering a plant. The same amount of water delivered a little each day does far more than the whole month's worth poured on at once.",
      },
      {
        id: "a-ma-w-rule-mixing",
        title: "Rule six: mix your practice",
        explain:
          "Doing twenty fraction questions in a row is easier and less useful than doing twenty questions where you do not know in advance which topic each one is. Choosing the method is half the skill, and practising one topic at a time removes that half entirely.",
        why: "In an exam, nothing tells you which topic a question belongs to. Practice that skips the identifying step trains you for a test that does not exist. Mixed practice feels harder and produces better results, which is why the difficulty is worth accepting.",
        example:
          "  Blocked practice, one topic at a time:\n\n    20 fraction questions in a row. You know all twenty are\n    fractions. You never once decide what kind of question it is.\n\n  Mixed practice:\n\n    A fraction, then a rounding question, then a factor question,\n    then another fraction. Each one starts with: what is this?\n\n  The second is the one the exam looks like.",
        analogy:
          "A goalkeeper who only practises penalties after being told which corner is coming is not practising penalties. The uncertainty is the thing being trained.",
      },
      {
        id: "a-ma-w-rule-aloud",
        title: "Rule seven: say it out loud, or teach it",
        explain:
          "Explaining a method aloud, to another person or to an empty room, exposes the parts you do not actually have. Writing works too. The act of putting it into words is the test.",
        why: "Understanding feels complete until you try to express it. The moment you have to say why a step is allowed, any gap becomes obvious immediately, and it becomes obvious to you rather than to a marker three weeks later.",
        practice: {
          prompt:
            "Pick something you learned recently and explain it aloud, in full sentences, as though to someone who has never met it.",
          answer:
            "Almost everyone finds a hesitation somewhere in the first attempt. That hesitation is exactly where the gap is, and finding it is the whole exercise. The second attempt is usually noticeably better, which is the benefit.",
        },
      },
      {
        id: "a-ma-w-rule-back",
        title: "Rule eight: go back without shame",
        explain:
          "If the thing in front of you does not make sense, the problem is almost always one or two steps below it. Going back to that step is not a setback; it is the shortest path forward.",
        why: "Because of how this subject compounds, ten minutes spent repairing a foundation frequently unlocks four topics at once. Students avoid it because going back feels like an admission. It is the single most efficient move available, and this course is built to make it easy: when a drill keeps failing, it tells you which earlier idea it keeps coming back to.",
        table: {
          caption: "The eight rules, and where this course enforces each one.",
          headers: ["Rule", "How the course applies it"],
          rows: [
            ["Do it with a pen", "Every drill needs a typed answer, not a click"],
            ["Struggle first", "No answer is shown before an attempt"],
            ["Explain every step", "Every rule is taught with its reason"],
            ["Errors are information", "Wrong answers are named, not just marked"],
            ["Little and often", "Lessons are sized for one sitting"],
            ["Mix your practice", "Mixed reviews pull from earlier modules"],
            ["Say it out loud", "Practice prompts ask you to explain"],
            ["Go back without shame", "A failing drill names the earlier skill"],
          ],
        },
      },
    ],

    task: {
      title: "Before you start Lesson 5",
      intro:
        "Five minutes, honestly, with a pen. This is the only module in the course with no mathematics in it, so this is the only chance to do this properly:",
      prompts: [
        "Write down the year you think mathematics started going wrong for you, and what was happening in it.",
        "Write down one topic you have avoided for years. Name it plainly.",
        "Write down one thing from Lesson 3 that you recognised. Six reasons were given; note which one is yours.",
        "Write down when you will study, on which days, for how long. Little and often, and put it somewhere you will see it.",
      ],
      closing:
        "Keep that page. In Month 3, when fractions come round, look at it again. A surprising number of people find that the topic they had avoided for years took about two weeks once the thing underneath it was fixed.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
