/**
 * MATHEMATICS · MONTH 4 · MODULE 3 · NUMBER PATTERNS AND SEQUENCES
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This module is the hinge of the whole course, and it is usually taught as
 * though it were a puzzle page.
 *
 * Everything up to here has been arithmetic: given these numbers, produce that
 * number. Here the question changes. Given a run of numbers, produce the RULE.
 * That is the first act of generalisation a student performs, and it is the
 * reason algebra exists. A letter imposed from outside is something to put up
 * with. A letter that arrives because you needed a way to say 'whichever
 * position I am asked about' has earned its place, and the reader who meets it
 * that way meets Month 6 as a continuation rather than as a new subject.
 *
 * So the order matters here. The position-to-term rule is motivated by a
 * question the term-to-term rule cannot answer without ninety nine steps of
 * arithmetic, and only then is n introduced, as the answer to a problem the
 * reader already has.
 *
 * One misconception carries nearly every lost mark: using the first term as the
 * constant in the nth term. For 5, 8, 11, 14 the rule is 3n + 2, and students
 * write 3n + 5 because 5 is the number they can see. The cure is a habit rather
 * than a rule: test every rule you write at n = 1.
 */

export const SECTION_ID = "ma-s4-patterns";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l57-seeing-patterns",
    moduleId: "ma-m4-patterns",
    sectionId: SECTION_ID,
    order: 1,
    title: "Seeing a Pattern and Saying What It Is",
    subtitle: "Spotting it is not the skill. Describing it is",
    estimatedMinutes: 14,
    intro:
      "Anybody can see that 3, 6, 9, 12 is going up by three. The mathematics starts when you have to say exactly what the rule is, in words precise enough that somebody else could continue the sequence without seeing your numbers. That precision is the whole lesson.",

    atoms: [
      {
        id: "a-ma-pt-what-is-a-sequence",
        title: "A sequence is an ordered list with a rule",
        explain:
          "A sequence is a list of numbers in a definite order, each one called a term. The first term, the second term and so on. Order matters, because a term's position is part of what identifies it.",
        why: "Position is the idea the whole module turns on. Later in this module you will find a rule that takes a position and gives you the term at it, and that rule is only possible because each term has one definite place in the list.",
        example:
          "  The sequence 5, 8, 11, 14, 17, ...\n\n    position:   1    2    3    4    5\n    term:       5    8   11   14   17\n\n  Read it as a pairing. Position 1 goes with 5,\n  position 2 goes with 8, and so on.\n\n  The dots at the end mean the sequence continues\n  by the same rule. Without them it is a finite\n  list rather than a sequence.\n\n\n  WHY ORDER MATTERS:\n\n    5, 8, 11, 14    has a clear rule\n    11, 5, 14, 8    has the same four numbers and\n                    no obvious rule at all\n\n  A sequence is not just a set of numbers. It is\n  numbers with positions attached.",
      },
      {
        id: "a-ma-pt-describing",
        title: "Describing a rule precisely",
        explain:
          "A description is good enough when somebody who cannot see your numbers could continue the sequence from your words alone. That means saying where to start and what to do to get from each term to the next.",
        why: "Vague descriptions are where marks go. It goes up is not a rule, and it goes up by three is only a rule once the starting point is also given. Being asked to write the rule in words is preparation for writing it in symbols, which is the next lesson.",
        example:
          "  The sequence 5, 8, 11, 14, ...\n\n  NOT GOOD ENOUGH:\n    'It goes up.'            By how much?\n    'Add three.'             Starting from where?\n    'The threes table.'       It is not: 3, 6, 9 is.\n\n  GOOD ENOUGH:\n    'Start at 5 and add 3 each time.'\n\n  Two pieces of information, and now anybody can\n  continue it.\n\n\n  A HARDER ONE:\n\n    1, 4, 9, 16, 25, ...\n\n  NOT GOOD ENOUGH:\n    'Add 3, then 5, then 7.'   True, and it only\n                               describes what you\n                               can already see.\n\n  BETTER:\n    'The gaps go up by 2 each time.'\n\n  BEST:\n    'Each term is its position multiplied by itself.'\n\n  The last one is the only version that answers\n  'what is the 50th term' without any counting, and\n  that is what makes it the best of the three.",
        mistake:
          "Describing the gaps between the terms you were shown, and stopping there. That is a true observation about four numbers rather than a rule for the sequence, and it will not answer a question about the fiftieth term.",
      },
      {
        id: "a-ma-pt-justifying",
        title: "Justifying the next term",
        explain:
          "More than one rule can fit the same few numbers, so a sequence question expects the simplest rule that fits all the terms you were given. If a rule fits three terms and fails on the fourth, it is the wrong rule.",
        why: "This is the honest version of a pattern question and it is worth saying out loud. Spotting a pattern is a guess, and the guess has to be tested against every term you were given, including the ones you did not use to make it.",
        example:
          "  What comes next: 1, 2, 4, ...\n\n  RULE A: double each time  →  8\n  RULE B: add 1, then 2, then 3  →  7\n\n  Both fit 1, 2, 4. With only three terms the\n  question genuinely does not have one answer, and\n  an exam question will give you enough terms to\n  settle it.\n\n    1, 2, 4, 8, 16     Rule A\n    1, 2, 4, 7, 11     Rule B\n\n  Four terms distinguish them. Three do not.\n\n\n  THE TEST YOU SHOULD ALWAYS RUN:\n\n  Build your rule from the first two or three terms,\n  then check it against a term you did NOT use. If\n  it fails there, the rule is wrong, and you have\n  found that out for free.\n\n  This is the same habit as checking an equation by\n  substituting back, and it is the single most\n  useful check in the module.",
      },
      {
        id: "a-ma-pt-shape-patterns",
        title: "Patterns made of shapes",
        explain:
          "A pattern can be made of matchsticks, tiles or dots rather than numbers. Count the objects in each picture to turn it into a sequence, then work on the numbers. The nth term mentioned below is a rule that takes the POSITION of a term and hands you the term sitting at it. Lesson 58 explains it in full, and nothing here depends on already knowing it.",
        why: "Shape patterns are a standard exam form and they carry an advantage: the picture often shows WHY the rule is what it is, which a bare list of numbers never does. Seeing the structure in the picture is what lets you write the rule with confidence rather than by guessing.",
        example:
          "  Squares made of matchsticks:\n\n    Pattern 1     Pattern 2        Pattern 3\n    +---+         +---+---+        +---+---+---+\n    |   |         |   |   |        |   |   |   |\n    +---+         +---+---+        +---+---+---+\n\n    4 sticks      7 sticks         10 sticks\n\n  The sequence is 4, 7, 10, ...   adding 3.\n\n  BUT THE PICTURE SAYS WHY:\n\n  The first square needs 4 sticks. Every square\n  after it needs only 3 more, because it shares one\n  side with the square before it.\n\n  So the rule is not a coincidence. It is 4 for the\n  first, then 3 for each extra one, and anybody who\n  has seen that can write the nth term without\n  hunting for it: 3n + 1.\n\n  Check at n = 1: 3 + 1 = 4. Correct.\n\n  This is what a picture gives you that a list of\n  numbers does not.",
        mistake:
          "Counting the shapes rather than the sticks, or the other way round. Read what the question is counting, and write the numbers down as a sequence before doing anything else.",
      },
      {
        id: "a-ma-pt-continuing",
        title: "Continuing a sequence reliably",
        explain:
          "Find the gaps between consecutive terms first. If the gaps are all the same, the rule is adding or subtracting that number. If the gaps grow, look for a multiplying rule or for gaps that themselves form a pattern. Consecutive means next to each other in the list, with nothing in between.",
        why: "Checking all the gaps rather than just the first is what separates a reliable answer from a guess. A single gap tells you nothing, because any two numbers have a gap between them.",
        example:
          "  THE FIRST THING TO DO, EVERY TIME:\n\n    7, 11, 15, 19, ...\n    gaps:  4    4    4     equal, so add 4\n\n    3, 6, 12, 24, ...\n    gaps:  3    6   12     growing, so not adding\n           try dividing: 6÷3 = 2, 12÷6 = 2\n           so the rule is multiply by 2\n\n    1, 3, 6, 10, 15, ...\n    gaps:  2   3   4   5   growing by 1 each time\n           these are the triangular numbers\n\n    40, 33, 26, 19, ...\n    gaps: −7  −7  −7      equal, so subtract 7\n\n\n  A CHECKLIST:\n\n    1. Work out every gap, not just the first.\n    2. All equal?  The rule adds or subtracts.\n    3. Growing?    Try dividing consecutive terms.\n    4. Still not?  Look at the gaps between the gaps.\n\n  Nearly every sequence at this level is settled by\n  one of those four steps.",
        drill: {
          skill: "L1-A3.1",
          count: 3,
          intro:
            "Three sequences to continue. Work out every gap before you decide what the rule is.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l58-two-kinds-of-rule",
    moduleId: "ma-m4-patterns",
    sectionId: SECTION_ID,
    order: 2,
    title: "Two Kinds of Rule",
    subtitle: "Why one of them cannot answer the question you most want to ask",
    estimatedMinutes: 15,
    intro:
      "There are two completely different ways to describe a sequence, and they are not equally useful. One tells you how to get from each term to the next. The other tells you how to get from a POSITION straight to its term. This lesson is about why the second one is worth the trouble of finding.",

    atoms: [
      {
        id: "a-ma-pt-term-to-term",
        title: "Term to term: what to do next",
        explain:
          "A term to term rule says what to do to one term to get the following one. For 5, 8, 11, 14 it is: start at 5, add 3 each time. It needs both parts, the starting value and the operation.",
        why: "This is the rule most people find first, and it is a genuine description. It is enough to continue a sequence, to fill in a missing term and to check whether a given sequence follows a stated pattern.",
        example:
          "  5, 8, 11, 14, ...\n\n    Term to term rule:  start at 5, add 3\n\n  Using it to reach the 7th term:\n\n    1st  5\n    2nd  8      (+3)\n    3rd  11     (+3)\n    4th  14     (+3)\n    5th  17     (+3)\n    6th  20     (+3)\n    7th  23     (+3)\n\n  Six additions to reach the 7th term. Note that it\n  is six rather than seven, because the 1st term is\n  already there before any adding happens. That off\n  by one is the commonest slip in the topic.\n\n\n  WITHOUT THE STARTING VALUE THE RULE IS USELESS:\n\n    'Add 3 each time' fits 5, 8, 11, 14\n    and it also fits   1, 4, 7, 10\n    and it also fits  100, 103, 106, 109\n\n  So a term to term rule always has two parts.",
        mistake:
          "Counting terms instead of gaps. Going from the 1st term to the 7th is six steps, not seven, because the first term is where you start rather than somewhere you step to.",
        drill: {
          skill: "L1-A3.2",
          count: 3,
          intro:
            "Three term to term questions. Count the GAPS between the term you have and the term you want, not the terms themselves.",
        },
      },
      {
        id: "a-ma-pt-the-problem",
        title: "The question term to term cannot answer",
        explain:
          "Find the hundredth term of 5, 8, 11, 14. With a term to term rule you have to add 3 ninety nine times. It works, it takes several minutes, and any one of those ninety nine additions could go wrong.",
        why: "This is the atom that motivates everything after it. The position to term rule is not a more sophisticated way of saying the same thing: it answers a question the term to term rule cannot answer in reasonable time, and that is why it is worth learning.",
        example:
          "  THE 100TH TERM OF 5, 8, 11, 14, ...\n\n  TERM TO TERM, the long way:\n\n    5 + 3 + 3 + 3 + ... + 3\n\n    Ninety nine threes. You could do it as\n    5 + 99 × 3, which is already halfway to the\n    better method, or you could genuinely step\n    through a hundred lines, which some students do.\n\n  WHAT YOU ACTUALLY WANT:\n\n    A rule that takes 100 and hands back the answer\n    in one calculation, without visiting any of the\n    other ninety nine terms at all.\n\n  That rule exists, it is the subject of the next\n  lesson, and for this sequence it is 3n + 2:\n\n    3 × 100 + 2 = 302\n\n  One multiplication and one addition, for any\n  position you are ever asked about.\n\n\n  AND NOTE WHAT HAS JUST HAPPENED:\n\n  You needed a way to write 'whichever position I am\n  asked about'. There is no number that means that,\n  so a letter is required. The letter has not been\n  imposed on you; you have run into the situation\n  that letters were invented for.",
      },
      {
        id: "a-ma-pt-position-to-term",
        title: "Position to term: straight to any term",
        explain:
          "A position to term rule takes the position number and produces the term at that position. Because it uses the position directly, it answers a question about the hundredth term as easily as one about the second.",
        origin:
          "The move from describing what happens next to describing the rule itself is one of the great changes in the history of mathematics, and it is exactly the change algebra made possible. Before letters were used systematically, a rule like this had to be written as a sentence, and sentences do not rearrange. Once Viete and then Descartes fixed the convention of letters standing for quantities, a rule became an object you could manipulate, test and rearrange. It is worth knowing that the distinction has a modern life too: in computing, stepping through every term is called an iterative method and going straight to the answer is called a closed form, and finding a closed form is still worth real money when a calculation has to be done billions of times.",
        why: "Every formula you will meet for the rest of the course is a position to term rule of some kind: a rule that takes what you know and produces what you want in one step. The habit of preferring one is worth as much as the technique of finding one.",
        example:
          "  The sequence 5, 8, 11, 14, ...\n\n    TERM TO TERM:      start at 5, add 3 each time\n    POSITION TO TERM:  term = 3 × position + 2\n\n  Test the second one on what you already know:\n\n    position 1:  3 × 1 + 2 = 5    correct\n    position 2:  3 × 2 + 2 = 8    correct\n    position 3:  3 × 3 + 2 = 11   correct\n    position 4:  3 × 4 + 2 = 14   correct\n\n  Now it can be trusted, and used:\n\n    position 100:  3 × 100 + 2 = 302\n    position 500:  3 × 500 + 2 = 1,502\n\n  No stepping at all.\n\n\n  WRITING IT SHORTER:\n\n  Rather than writing position every time, use a\n  letter for it. The usual letter is n, for the\n  position number:\n\n    nth term = 3n + 2\n\n  That is all the notation means. The n is a\n  position waiting to have a number put into it.",
      },
      {
        id: "a-ma-pt-comparing",
        title: "The two rules side by side",
        explain:
          "Both rules describe the same sequence and each is better at different jobs. Term to term is easier to find and is enough for continuing a list. Position to term takes a little work to find and then answers everything.",
        why: "Knowing which to reach for saves time. A question asking for the next two terms does not need an nth term, and a question asking for the fortieth term should not be answered by stepping.",
        table: {
          caption: "Which rule for which job.",
          headers: ["The job", "Term to term", "Position to term"],
          rows: [
            ["Continue the list", "Easy", "Works, and is more effort than needed"],
            ["Find the 100th term", "Ninety nine steps", "One calculation"],
            ["Fill a gap in the middle", "Easy", "Easy"],
            ["Decide whether 302 is in the sequence", "Step until you pass it", "Solve 3n + 2 = 302"],
            ["Describe the sequence to someone", "Needs a starting value too", "Complete on its own"],
            ["Prove something about every term", "Not possible", "Possible"],
          ],
          note: "Look at the last two rows. A position to term rule is a single self contained statement about every term at once, which is what makes it the one that later mathematics is built on.",
        },
        mistake:
          "Giving a term to term rule when the question asked for the nth term. If the question uses the word n, or asks for the rule for the nth term, a starting value and an operation will not score, however correct they are.",
      },
      {
        id: "a-ma-pt-why-algebra",
        title: "This is what algebra is for",
        explain:
          "The letter n in 3n + 2 is not decoration and it is not a mystery. It stands for whichever position you are asked about, and it exists because there is no ordinary number that means that.",
        why: "This is the honest answer to the question students ask in Month 6, which is why do we use letters. The letter appeared here because a genuine need for it appeared, and everything in the algebra module ahead is the same move applied to other situations.",
        example:
          "  READ THE RULE IN WORDS FIRST:\n\n    'Multiply the position by 3, then add 2.'\n\n  Now write the position as n, because writing the\n  word every time is tiring and because a symbol can\n  be rearranged while a sentence cannot:\n\n    3n + 2\n\n  That is the entire step. There is nothing hidden.\n\n\n  WHAT THE LETTER BUYS YOU:\n\n  (a) One statement covers every term at once.\n\n  (b) The rule can be REARRANGED. Asking whether\n      302 is in the sequence becomes the equation\n      3n + 2 = 302, which Lesson 59 solves, and\n      which a sentence could never have become.\n\n  (c) The rule can be compared with other rules.\n      3n + 2 and 5n − 1 can be examined together in\n      a way that two paragraphs of description\n      cannot.\n\n  Everything in Month 6 is (b) and (c) being used\n  harder. Nothing new about the letter is coming.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l59-nth-term",
    moduleId: "ma-m4-patterns",
    sectionId: SECTION_ID,
    order: 3,
    title: "Finding the nth Term",
    subtitle: "Two steps, and one test that catches the usual mistake",
    estimatedMinutes: 16,
    intro:
      "For a sequence with a constant difference, the nth term takes two steps to find and one step to check. The check is the important part, because the commonest error in this whole topic produces a rule that looks entirely reasonable and fails immediately at n equals 1.",

    atoms: [
      {
        id: "a-ma-pt-finding-nth",
        title: "The two steps",
        explain:
          "First, the common difference is the number that multiplies n. Second, work out what has to be added to make it fit: put n equal to 1 and see how far your answer is from the first term.",
        why: "This is the most examined skill in the module. The first step is easy and almost nobody gets it wrong. The second step is where every mark is lost, and the reason is that the obvious constant to reach for is the first term, which is the wrong one.",
        example:
          "  Find the nth term of 5, 8, 11, 14, ...\n\n  STEP 1  The common difference.\n\n            gaps: 3, 3, 3\n            so the rule contains 3n\n\n  STEP 2  Find the constant.\n\n            At n = 1, 3n gives 3.\n            The first term is 5.\n            5 − 3 = 2\n\n            So the rule is 3n + 2.\n\n  STEP 3  Test it, on a term you did not use.\n\n            n = 4:  3 × 4 + 2 = 14\n            The 4th term is 14. Correct.\n\n\n  A DECREASING SEQUENCE:\n\n  Find the nth term of 20, 17, 14, 11, ...\n\n    gaps: −3, so the rule contains −3n\n    At n = 1, −3n gives −3.\n    First term is 20, and 20 − (−3) = 23\n\n    nth term = −3n + 23, usually written 23 − 3n\n\n    Test at n = 4: 23 − 12 = 11. Correct.\n\n  Note that a decreasing sequence has a negative\n  number in front of n, which is the directed number\n  work of Month 2 turning up.",
        mistake:
          "Using the first term as the constant, giving 3n + 5 for the sequence above. Test it at n = 1: 3 + 5 = 8, and the sequence starts at 5. The constant must be the number BEFORE the first term, because 3n has already contributed 3 by the time n reaches 1.",
        drill: {
          skill: "L1-A3.3",
          count: 3,
          intro:
            "Three nth term questions. Find the difference, find the constant, then test your rule at n = 1 before submitting it.",
        },
      },
      {
        id: "a-ma-pt-the-zeroth-term",
        title: "Why the constant is the term before the first",
        explain:
          "The constant in the rule is the value the sequence would have had at position zero. For 5, 8, 11, 14, stepping back one gives 2, and 2 is the constant. It is not the first term because the multiple of n has already been added by the time n reaches 1.",
        why: "This is the explanation that makes the rule stick, and without it the constant has to be found by trial every time. Stepping backwards one term from the first is also the fastest way to find it in an exam.",
        example:
          "  Line the positions up, including a position 0:\n\n    position:   0    1    2    3    4\n    term:      (2)   5    8   11   14\n              \\_/  \\_/  \\_/  \\_/\n               +3   +3   +3   +3\n\n  The bracketed 2 is not part of the sequence. It is\n  where the sequence would have started if it had a\n  position zero, and it is exactly the constant in\n  the rule.\n\n    nth term = 3n + 2\n\n  At n = 0 the rule gives 2, which is that term.\n\n\n  THE FAST METHOD:\n\n    1. Find the common difference.\n    2. Step BACK one term from the first term.\n    3. That is the constant.\n\n  For 7, 12, 17, 22:\n    difference 5, step back from 7 gives 2,\n    so the nth term is 5n + 2.\n    Test: n = 1 gives 7. Correct.\n\n  For 20, 17, 14, 11:\n    difference −3, step back from 20 gives 23,\n    so the nth term is 23 − 3n.\n    Test: n = 1 gives 20. Correct.",
      },
      {
        id: "a-ma-pt-testing",
        title: "Always test at n equals 1",
        explain:
          "Substituting n equal to 1 into any rule you write takes five seconds and catches the commonest mistake in the topic. If the rule does not give the first term, it is wrong, and you know before the marker does.",
        why: "Every wrong nth term produced by the usual misconception fails this test immediately. That makes it the highest value check in the module, and it is free, because you already know what the first term is.",
        example:
          "  A student writes 4n + 6 for 6, 10, 14, 18.\n\n  TEST AT n = 1:\n\n    4 × 1 + 6 = 10\n\n  The first term is 6, not 10. So the rule is wrong,\n  and the student now knows it without being told.\n\n  FIX IT:\n\n    Difference is 4, so 4n is right.\n    At n = 1, 4n gives 4.\n    6 − 4 = 2\n    nth term = 4n + 2\n\n  Test again: 4 × 1 + 2 = 6. Correct.\n  And at n = 3: 12 + 2 = 14. Correct.\n\n\n  TEST TWICE IF YOU HAVE TIME:\n\n  Test at n = 1 to catch the constant, and at the\n  LAST term you were given to catch the difference.\n  A rule that fits both ends fits everything between\n  them, for a linear sequence.\n\n  This is the same habit as substituting a solution\n  back into an equation, which Lesson 64 will ask\n  for. Checking your own work is a method, not a\n  personality trait.",
      },
      {
        id: "a-ma-pt-using-nth",
        title: "Using the rule: any term, instantly",
        explain:
          "Once you have the nth term, finding any particular term is one substitution. The hundredth term of 5, 8, 11, 14 is 3 times 100 plus 2, which is 302, with no stepping at all.",
        why: "This is the payoff the whole module was building towards, and it is worth doing once on a large number so the saving is visible. It is also how the exam asks the question: find the nth term, then use it.",
        example:
          "  nth term of 5, 8, 11, 14 is 3n + 2.\n\n    10th term:   3 × 10 + 2 = 32\n    50th term:   3 × 50 + 2 = 152\n    100th term:  3 × 100 + 2 = 302\n    1000th term: 3 × 1000 + 2 = 3,002\n\n  Each one is a single calculation, and the size of\n  the position makes no difference to the effort.\n\n\n  A SHAPE PATTERN, ALL THE WAY THROUGH:\n\n  Squares in a row, made of matchsticks:\n  4, 7, 10, 13, ...\n\n    Difference 3, so 3n.\n    Step back from 4: 4 − 3 = 1.\n    nth term = 3n + 1\n    Test at n = 1: 4. Correct.\n\n  How many sticks for 20 squares?\n\n    3 × 20 + 1 = 61 sticks\n\n  And the picture confirms it makes sense: one\n  square needs 4, and each of the other 19 needs 3\n  more, so 4 + 19 × 3 = 61. Two routes, one answer.",
      },
      {
        id: "a-ma-pt-is-it-in-there",
        title: "Working backwards: is this number in the sequence?",
        explain:
          "To decide whether a given number appears in a sequence, set the nth term equal to it and solve for n. If n comes out as a whole number, the number is in the sequence at that position. If not, it is not in the sequence at all.",
        why: "This is the question that shows why a rule you can rearrange is worth having, and it is examined directly. It is also the first place in the course where forming and solving an equation is the natural thing to do, which is exactly what the next module is about.",
        example:
          "  Is 302 in the sequence 5, 8, 11, 14, ... ?\n\n    nth term = 3n + 2\n\n    Set it equal to 302:\n\n      3n + 2 = 302\n      3n = 300\n      n = 100\n\n    n is a whole number, so YES: 302 is the 100th\n    term.\n\n\n  Is 200 in the same sequence?\n\n      3n + 2 = 200\n      3n = 198\n      n = 66\n\n    Yes, the 66th term.\n\n\n  Is 100 in the same sequence?\n\n      3n + 2 = 100\n      3n = 98\n      n = 32.67\n\n    NOT a whole number, so NO. There is no 32.67th\n    term, because positions are whole numbers. 100\n    falls between the 32nd term, 98, and the 33rd,\n    101.\n\n\n  THE POINT WORTH NOTICING:\n\n  That answer was impossible to get from a term to\n  term rule without stepping through thirty terms.\n  The rule could be REARRANGED because it was\n  written in symbols, and that is the advantage the\n  letter bought.",
        practice: {
          prompt:
            "A sequence starts 7, 12, 17, 22. Find its nth term, then decide whether 201 and 202 are in the sequence.",
          answer:
            "The difference is 5 so the rule contains 5n, and stepping back from 7 gives 2, so the nth term is 5n + 2. Test at n = 1: 7. Correct. For 201: 5n + 2 = 201 gives 5n = 199 and n = 39.8, not a whole number, so 201 is not in the sequence. For 202: 5n = 200 and n = 40, so yes, 202 is the 40th term. Note that consecutive numbers can differ in this way, because the sequence only visits one number in every five.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l60-special-sequences",
    moduleId: "ma-m4-patterns",
    sectionId: SECTION_ID,
    order: 4,
    title: "Sequences Worth Recognising",
    subtitle: "Squares, cubes, triangles, and the one that grows in plants",
    estimatedMinutes: 15,
    intro:
      "A handful of sequences turn up so often that recognising them on sight is worth real time in an exam. None of them has a constant difference, so the method of the last lesson does not apply, and they have to be known rather than derived.",

    atoms: [
      {
        id: "a-ma-pt-squares-cubes",
        title: "Square and cube numbers",
        explain:
          "The square numbers are 1, 4, 9, 16, 25, each one a position multiplied by itself. The cube numbers are 1, 8, 27, 64, 125, each a position multiplied by itself three times. Their nth terms are n squared and n cubed.",
        origin:
          "The names are literal, and they come from arranging pebbles. The Pythagoreans studied numbers by laying out counters in shapes, and the numbers that could be laid out as a perfect square were called square numbers, while those that could be built into a cube were cube numbers. Nine counters really do make a three by three square, and eight really do stack into a two by two by two cube. So the word square in square number is not a metaphor borrowed from geometry: the geometry came first and the name records it. This is also why the notation is read as squared and cubed rather than as to the power two and to the power three.",
        why: "These appear inside other questions constantly, in areas, in the difference of two squares in Month 6, and in Pythagoras in Month 8. Recognising 144 as a square number on sight saves the time that would go into looking for a pattern that is not linear.",
        example:
          "  SQUARE NUMBERS, and why the name:\n\n    1      4        9          16\n    o     o o     o o o     o o o o\n          o o     o o o     o o o o\n                  o o o     o o o o\n                            o o o o\n\n    nth term = n × n, written n²\n\n    1, 4, 9, 16, 25, 36, 49, 64, 81, 100,\n    121, 144, 169, 196, 225\n\n  Worth knowing to 15 × 15 on sight.\n\n\n  CUBE NUMBERS:\n\n    nth term = n × n × n, written n³\n\n    1, 8, 27, 64, 125, 216, 343, 512, 729, 1000\n\n  Worth knowing to 10.\n\n\n  THE GAPS ARE THE GIVEAWAY:\n\n    squares:  1,  4,  9, 16, 25\n    gaps:       3,  5,  7,  9\n\n  The gaps are the odd numbers, growing by 2 each\n  time. So if you see gaps growing by a constant\n  amount, suspect squares.",
        drill: {
          skill: "L1-A3.4",
          count: 3,
          intro:
            "Three special sequences. Check the gaps first, and if they are growing, ask which of the special sequences it could be.",
        },
      },
      {
        id: "a-ma-pt-triangular",
        title: "Triangular numbers",
        explain:
          "The triangular numbers are 1, 3, 6, 10, 15, 21. Each one is the count of objects in a triangle, and each is made from the one before it by adding the next whole number: add 2, then 3, then 4.",
        why: "Triangular numbers appear in counting problems, in handshake questions and in the sum of a run of whole numbers, and they are the standard example of a sequence whose gaps form a sequence of their own. They are also the sequence you already met in Month 1.",
        example:
          "  THE TRIANGLES:\n\n     1        3         6          10\n     o        o        o          o\n             o o      o o        o o\n                     o o o      o o o\n                               o o o o\n\n    1, 3, 6, 10, 15, 21, 28, 36, 45, 55\n\n    gaps:  2  3  4   5   6   7   8   9  10\n\n  The gaps are the counting numbers, which is what\n  makes this sequence build so simply.\n\n\n  YOU HAVE SEEN THIS BEFORE:\n\n  A triangular number is the sum of the whole numbers\n  up to its position. The 10th one is\n  1 + 2 + 3 + ... + 10, which comes to 55.\n\n  Lesson 1 of this course told the story of Gauss,\n  who was asked to add up 1 to 100 as a boy and did\n  it in moments by pairing the numbers off. It said\n  Month 4 would work his method out in full.\n\n  Here it is, and you now have the tools for it.\n\n\n  THE SAME PAIRING, ON 1 TO 100:\n\n  Write the first half along the top, then the second\n  half underneath it, backwards:\n\n      1    2    3   ...   50\n    100   99   98   ...   51\n\n  Every column adds to 101. Check a few of them:\n    1 + 100 = 101,   2 + 99 = 101,   50 + 51 = 101\n\n  How many columns are there? A hundred numbers, two\n  in each column, so 100 ÷ 2 = 50 columns.\n\n    50 lots of 101  =  50 × 101  =  5,050\n\n  That is the number Gauss wrote down as a boy.\n\n  And notice that nothing in it was difficult. The\n  only idea was to look at how the numbers were\n  arranged before adding any of them up, which is the\n  habit Lesson 1 was about.\n\n\n  NOW WRITE IT WITH A LETTER:\n\n  Suppose you are adding 1 up to n, for whatever\n  number n happens to be.\n\n    What does each pair add to?\n        the first plus the last, which is 1 + n\n\n    How many pairs are there?\n        n numbers, two in each pair, so n ÷ 2\n\n    Total = how many pairs × what each pair is worth\n          = (n ÷ 2) × (n + 1)\n\n  Which is normally written:\n\n    nth triangular number = n(n + 1) ÷ 2\n\n  Test it on the ones you already know:\n\n    n = 4:    4 × 5 ÷ 2   = 20 ÷ 2    = 10     correct\n    n = 10:  10 × 11 ÷ 2  = 110 ÷ 2   = 55     correct\n    n = 100: 100 × 101 ÷ 2 = 10,100 ÷ 2 = 5,050  correct\n\n  So this formula is not a new fact to learn. It is\n  the pairing above, written once with a letter\n  instead of separately for every case. That is the\n  whole of what the letter is doing here.\n\n\n  WHERE IT TURNS UP:\n\n  If everybody in a room of 10 people shakes hands\n  with everybody else, the number of handshakes is\n  the 9th triangular number, 45. That is a genuinely\n  useful thing to be able to work out, and it is the\n  same sequence.",
      },
      {
        id: "a-ma-pt-fibonacci",
        title: "The sequence that adds the two before it",
        explain:
          "1, 1, 2, 3, 5, 8, 13, 21 is the Fibonacci sequence. Each term is the sum of the two before it, which makes it a term to term rule that needs TWO starting values rather than one.",
        origin:
          "The sequence is named after Leonardo of Pisa, known as Fibonacci, who put it in his book of 1202 as a puzzle about breeding rabbits. That book matters far more than the puzzle: it is the book that brought Hindu and Arabic numerals into European commerce, along with the fraction bar you met in Month 3. So the man who gave Europe the digits also left it this sequence as a footnote. The sequence was already known in India centuries earlier, where it appears in work on the rhythms of Sanskrit poetry, which is a much better reason to have found it than rabbits. And it does turn up in plants: the spirals of a sunflower head and a pine cone tend to come in Fibonacci numbers, because that arrangement packs seeds more tightly than any other.",
        why: "It is the standard example of a sequence that cannot be described by the methods of this module, and it is examined as a recognise-and-continue question. It also shows that a term to term rule can need more than one starting value, which the earlier lessons did not mention.",
        example:
          "    1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...\n\n    1 + 1 = 2\n    1 + 2 = 3\n    2 + 3 = 5\n    3 + 5 = 8\n    5 + 8 = 13\n\n  The gaps are 0, 1, 1, 2, 3, 5, which is the same\n  sequence again, so checking the gaps will not help\n  here. This one has to be recognised.\n\n\n  NO SIMPLE nth TERM:\n\n  There is a position to term formula for this\n  sequence and it is genuinely complicated, and it\n  involves an irrational number. That is worth\n  knowing as a limit on the methods of this module:\n  not every sequence has a tidy nth term, and a\n  question asking for one will always be a sequence\n  that does.\n\n\n  IN PLANTS:\n\n  Count the spirals on a pine cone or a sunflower\n  head in each direction. They are very often\n  consecutive Fibonacci numbers, 21 and 34 or 34 and\n  55, because that packing fits the most seeds into\n  the space.",
      },
      {
        id: "a-ma-pt-recognising",
        title: "Which sequence is this?",
        explain:
          "Work through the possibilities in order: equal gaps means a linear sequence, gaps growing by a constant amount suggests squares, dividing gives a constant means a multiplying sequence, and gaps that repeat the sequence itself means Fibonacci.",
        why: "An exam gives you four or five terms and no name, so the identification is part of the work. Having an order to check in means you are never stuck staring at the numbers hoping something occurs to you.",
        table: {
          caption: "The checklist, in the order worth using.",
          headers: ["What you see", "Likely sequence", "nth term"],
          rows: [
            ["Equal gaps", "Linear", "difference × n + constant"],
            ["Gaps growing by a constant", "Square based", "involves n²"],
            ["Each term ÷ the one before is constant", "Multiplying", "involves powers, Month 5"],
            ["Gaps are 1, 2, 3, 4, …", "Triangular", "n(n + 1) ÷ 2"],
            ["1, 4, 9, 16, 25", "Squares", "n²"],
            ["1, 8, 27, 64", "Cubes", "n³"],
            ["Each term is the two before it added", "Fibonacci", "no simple form"],
          ],
          note: "Check in that order. Equal gaps is the commonest case by a long way, and it is also the only one this module asks you to find a formula for, so establishing it or ruling it out first is the efficient move.",
        },
        mistake:
          "Deciding a sequence is linear after checking only the first gap. Two terms always have a gap between them, so one gap tells you nothing at all. Work out every gap you can before choosing a method.",
      },
      {
        id: "a-ma-pt-review",
        title: "Four months, mixed",
        explain:
          "A drill across sequences, ratio, measurement, fractions, decimals, percentages and the number work of Months 1 and 2, with nothing to say which is which.",
        why: "The next module is algebra, where a letter stands for an unknown rather than for a position, and it uses the fraction and directed number work constantly. Mixed practice after a gap is the only honest test of what is available.",
        drill: {
          review: [
            "L1-A3.3",
            "L1-A3.1",
            "L2-N3.1",
            "L1-G1.3",
            "L1-N3.1",
            "L0-G1.1",
            "L1-A3.2",
          ],
          count: 7,
          intro:
            "Seven questions from across four months. Decide what each one is asking before you calculate, because identifying the method is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start algebra",
      intro:
        "The letter n in this module stood for a position. In the next module a letter stands for an unknown, and it is the same idea used for a different job. Check this one holds first, with a pen:",
      prompts: [
        "Find the nth term of 7, 12, 17, 22, then test it at n = 1 and at n = 4.",
        "Find the nth term of 20, 17, 14, 11, and say why there is a minus sign in front of n.",
        "Matchstick squares in a row use 4, 7, 10, 13 sticks. Find the nth term, then say how many sticks 20 squares need, and check the answer a second way from the picture.",
        "Is 201 in the sequence 7, 12, 17, 22? Is 202? Show the working.",
        "Continue 3, 6, 12, 24 and say why checking only the first gap would have misled you.",
        "Write down the first six triangular numbers, and say what the 10th one has to do with the Gauss story from Lesson 1.",
      ],
      close:
        "If the first one came out as 5n + 7, the first term was used as the constant. Test at n = 1: that gives 12, and the sequence starts at 7. The constant is the term BEFORE the first, which is 2, so the rule is 5n + 2. That single test catches the commonest error in this module every time it is made.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
