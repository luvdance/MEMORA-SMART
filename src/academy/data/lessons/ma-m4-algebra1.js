/**
 * MATHEMATICS · MONTH 4 · MODULE 4 · ALGEBRAIC EXPRESSIONS AND SIMPLE EQUATIONS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The letter is not new here. The previous module used n for a position, and it
 * arrived because the reader needed a way to say 'whichever position I am asked
 * about'. This module uses a letter for a different job: a quantity that is
 * fixed but not yet known. Same notation, different work, and saying so
 * directly is what stops algebra feeling like a second subject.
 *
 * Everything in this module rests on two facts already established:
 *
 *   THE PROPERTIES FROM MONTH 2. Every legal move on an expression is one of
 *   commutativity, associativity, distributivity, an identity or an inverse.
 *   They hold for every number, which is precisely why they hold for a letter
 *   standing in for one. That is the answer to 'why is this allowed'.
 *
 *   THE FRACTION AND SIGN WORK FROM MONTHS 2 AND 3. Almost every lost mark in
 *   this module is an arithmetic slip with a minus sign or a fraction wearing
 *   algebraic clothing.
 *
 * And one specific error carries more marks than any other: substituting a
 * negative value without brackets. 3x² with x = −2 written as 3 × −2² gives
 * −12 instead of 12, and the habit of bracketing every substituted value is
 * the entire fix.
 */

export const SECTION_ID = "ma-s4-algebra1";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l61-letters",
    moduleId: "ma-m4-algebra1",
    sectionId: SECTION_ID,
    order: 1,
    title: "A Letter Is a Number You Do Not Know Yet",
    subtitle: "Nothing mysterious, and nothing new since last week",
    estimatedMinutes: 15,
    intro:
      "You have already used a letter for a number. In the last module n stood for a position, and it appeared because you needed a way to talk about a position you had not been told yet. Here a letter stands for a quantity you have not been told yet. That is the whole of the new idea.",

    atoms: [
      {
        id: "a-ma-al-what-is-a-letter",
        title: "What a letter actually stands for",
        explain:
          "You met this in Month 1: a letter is an empty box waiting for a number, and 2 + x = 7 is asking two plus what makes seven. Nothing about that changes here. What is new is that a letter does two different jobs, and telling them apart is the only thing to work out.",
        origin:
          "Algebra took about two thousand years to become symbolic, and historians describe it in three stages. The first is rhetorical: everything written out as sentences. Babylonian tablets and the whole of al-Khwarizmi's work are like this, with no symbols for the unknown at all, so a quadratic equation is a paragraph of prose. The second is syncopated, meaning abbreviated: Diophantus, working in Alexandria around the third century, used a shorthand mark for the unknown and for powers of it, which is the first step towards notation. The third is symbolic, and it is only four centuries old: Viete in 1591 and Descartes in 1637 between them produced the notation on this page. So when a student finds algebra hard, they are finding difficult a thing that took the best mathematicians in the world twenty centuries to invent. It is not a small thing being asked.",
        why: "Most difficulty with algebra starts with a belief that a letter is a special kind of object with its own rules. It is not. It is a number in a disguise, and every rule that applies to numbers applies to it, which is the whole reason the notation works.",
        example:
          "  A REMINDER OF WHAT A LETTER IS:\n\n      2  +  x  =  7\n\n  means   two plus WHAT makes seven,\n  and the box holds 5.\n\n  Everything below is that same idea with\n  more room in it.\n\n\n  THE SAME LETTER, TWO DIFFERENT JOBS:\n\n  (a)  3x + 5 = 20\n\n       Here x is ONE particular number. The\n       statement is true for that number and\n       false for every other, so there is\n       something to find. It is 5.\n\n       The box has one right filling.\n\n  (b)  a + b = b + a\n\n       Here a and b are ANY numbers at all,\n       and the statement stays true whatever\n       you put in. There is nothing to find.\n\n       The boxes can hold anything.\n\n  You met (b) in Month 2 as the commutative\n  property, without anybody calling it\n  algebra.\n\n\n  HOW TO TELL WHICH JOB IT IS:\n\n  Try putting two different numbers in.\n\n    In (a), x = 1 gives 8, not 20. False.\n            x = 5 gives 20. True.\n            So only one number works.\n\n    In (b), a = 2, b = 3 gives 5 = 5. True.\n            a = 9, b = 4 gives 13 = 13. True.\n            So every number works.\n\n  That test takes ten seconds and it always\n  settles it.",
        drill: {
          skill: "L1-A1.1",
          count: 3,
          intro:
            "Three questions on what a letter stands for and how a quantity is written with one.",
        },
      },
      {
        id: "a-ma-al-notation",
        title: "The shorthand conventions",
        explain:
          "Algebra leaves out multiplication signs: 3x means 3 times x, and ab means a times b. A number written in front of a letter multiplies it, a letter on its own means one of it, and division is written as a fraction rather than with a division sign.",
        why: "These conventions are not decoration and they are the source of several specific errors. Reading 3x as thirty something, or as 3 plus x, makes every later line wrong, and knowing that the omitted sign is always multiplication settles it.",
        table: {
          caption: "The conventions, and what each replaces.",
          headers: ["Written", "Means", "Not"],
          rows: [
            ["3x", "3 × x", "30-something, or 3 + x"],
            ["ab", "a × b", "A two letter word"],
            ["x", "1 × x", "Nothing, or an unknown number of x"],
            ["−x", "−1 × x", "Necessarily a negative number"],
            ["x/4", "x ÷ 4", "x over 4 as two separate things"],
            ["2(x + 3)", "2 × the whole bracket", "2x + 3"],
            ["x²", "x × x", "x × 2"],
          ],
          note: "Read the fourth row again. −x is negative one times x, and if x happens to be −5 then −x is 5, which is positive. A minus sign in front of a letter does not make the value negative; it reverses whatever the value was.",
        },
        example:
          "  READING EXPRESSIONS OUT LOUD:\n\n    5y        five times y\n    y + 5     y plus five\n    5 − y     five minus y\n    y/5       y divided by five\n    5/y       five divided by y\n    (y + 5)/2 y plus five, all divided by two\n\n  Note the last one. The bracket says the whole of\n  y + 5 is divided by 2, and without it y + 5/2\n  means y plus a half of five, which is a different\n  expression entirely.\n\n\n  THE ONE PLACE TWO THINGS SIDE BY SIDE\n  DO NOT MULTIPLY:\n\n    2½ means two and a half, an addition.\n\n  That mixed number notation from Month 3 is the\n  single exception in all of mathematics, and it is\n  an inconsistency in the notation rather than a\n  rule you failed to learn.",
        mistake:
          "Reading 3x as a two digit number, or reading 2(x + 3) as 2x + 3. The bracket means the 2 multiplies everything inside it, which is the distributive law from Month 2.",
      },
      {
        id: "a-ma-al-terms",
        title: "Terms, coefficients and constants",
        explain:
          "An expression is built of terms separated by plus and minus signs. In 4x − 7 there are two terms: 4x and −7. The 4 is the coefficient of x, and the −7 is the constant because it does not change when x does.",
        why: "You met these words in Month 1, in the language module, and here they start doing work. A question asking for the coefficient wants one number with its sign, and the sign is the part that gets dropped.",
        example:
          "  Reading 5x − 3y + 8\n\n    Terms:          5x, −3y, and 8\n    Number of terms: 3\n    Coefficient of x:  5\n    Coefficient of y: −3   (the sign comes with it)\n    Constant:          8\n\n  THE SIGN BELONGS TO THE TERM:\n\n  The expression is 5x plus −3y plus 8. A minus in\n  front of a term is part of that term rather than\n  punctuation between terms, which is the Month 2\n  directed number work again.\n\n\n  A TERM CAN HAVE MORE THAN ONE LETTER:\n\n    7xy   one term, coefficient 7, letters x and y\n    x²    one term, coefficient 1\n    −x    one term, coefficient −1\n\n  In the last two the coefficient is invisible and\n  it is there. Writing 1x and −1x would be correct\n  and nobody does it, so the 1 has to be remembered\n  when it matters, which is when collecting terms.",
        mistake:
          "Giving the coefficient of y in 5x − 3y + 8 as 3. It is −3. Dropping that sign will later put the wrong number into a formula and produce a wrong answer from perfect arithmetic.",
      },
      {
        id: "a-ma-al-like-terms",
        title: "Like terms, and why only they combine",
        explain:
          "Like terms have exactly the same letters, to the same powers. 3x and 5x are like terms and combine to 8x. 3x and 5y are not, and neither are 3x and 5x², so neither pair combines into a single term.",
        why: "This is the Month 3 fraction lesson again in different notation. Fifths could not be added to sevenths because they were different kinds of thing, and x cannot be added to y for exactly the same reason. It is one idea, not two.",
        example:
          "  WHY 3x + 5x = 8x:\n\n  Three of something plus five of that something is\n  eight of it, whatever it is. The x names what\n  there are eight of, so it stays.\n\n    3 apples + 5 apples = 8 apples\n    3x       + 5x       = 8x\n\n  And it is the distributive law read backwards:\n\n    3x + 5x = (3 + 5)x = 8x\n\n\n  WHY 3x + 5y STAYS AS IT IS:\n\n    3 apples + 5 oranges = ?\n\n  There is no single word for the total, so the\n  expression is already as short as it can be.\n  3x + 5y is a finished answer.\n\n\n  THE PAIRS THAT LOOK LIKE THEY SHOULD COMBINE:\n\n    3x  and  5x     LIKE, give 8x\n    3x  and  5y     unlike, stay separate\n    3x  and  5x²    unlike, different powers\n    3xy and  5yx    LIKE, since xy and yx are the\n                    same product, by commutativity\n    3x  and  5      unlike, one has a letter\n\n  Row four is worth noting: order inside a term does\n  not matter, because multiplication is commutative,\n  so xy and yx are the same thing written two ways.",
        drill: {
          skill: "L1-A1.2",
          count: 3,
          intro:
            "Three collections of like terms. Check the letters AND the powers match before combining anything.",
        },
      },
      {
        id: "a-ma-al-collecting",
        title: "Collecting like terms in a longer expression",
        explain:
          "Go through the expression one kind of term at a time, gathering the x terms, then the y terms, then the constants. Take each sign with its term as you move it, and cross out what you have used so nothing is counted twice.",
        why: "A longer expression is not harder, only longer, and the errors are bookkeeping errors rather than mathematical ones. A method that marks off what has been used is what prevents them.",
        example:
          "  Simplify 5x + 3y − 2x + 7 − y + 4\n\n  Gather one kind at a time, taking each sign along:\n\n    x terms:      5x − 2x        = 3x\n    y terms:      3y − y         = 2y\n    constants:    7 + 4          = 11\n\n    Answer: 3x + 2y + 11\n\n  Three terms, and it cannot be shortened further\n  because they are all unlike each other.\n\n\n  THE TWO THINGS THAT GO WRONG:\n\n  (a) Leaving a sign behind.\n      −2x moved without its minus becomes +2x, and\n      the x term comes out as 7x instead of 3x.\n\n  (b) The invisible 1.\n      3y − y is 2y, not 3y. The lone y is 1y, and\n      forgetting that is why this line is dropped\n      more often than any other.\n\n\n  A CHECK THAT COSTS NOTHING:\n\n  Put a number in. Let x = 2 and y = 1:\n\n    Original: 10 + 3 − 4 + 7 − 1 + 4 = 19\n    Answer:   6 + 2 + 11 = 19\n\n  Both give 19, so the simplification is almost\n  certainly right. This works for every simplifying\n  question in the course, and it takes ten seconds.",
        mistake:
          "Forgetting that a lone letter has a coefficient of 1, so that 3y − y is written as 3y. And moving a term without its sign, which is the commonest bookkeeping error in the module.",
      },
      {
        id: "a-ma-al-substitution",
        title: "Substitution, and the brackets that save you",
        explain:
          "To substitute is to replace each letter with a given number and work the expression out. Always write the number inside brackets as you put it in, especially when it is negative.",
        why: "This is the most error prone single operation in the module and the fix is mechanical. Writing brackets takes a second and it prevents the minus sign from detaching and applying to the wrong thing.",
        example:
          "  Evaluate 3x² − 4x when x = −2\n\n  WITH BRACKETS, correctly:\n\n    3(−2)² − 4(−2)\n  = 3 × 4 − (−8)         since (−2)² = 4\n  = 12 + 8\n  = 20\n\n  WITHOUT BRACKETS, wrongly:\n\n    3 × −2² − 4 × −2\n  = 3 × −4 + 8           the square hit only the 2\n  = −12 + 8\n  = −4\n\n  Twenty four apart, from two missing pairs of\n  brackets. The order of operations applies the\n  power before the minus sign, which is why the\n  bracket is compulsory and not a style choice.\n\n\n  A SECOND ONE, TWO LETTERS:\n\n  Evaluate 2a − 3b when a = 5 and b = −4\n\n    2(5) − 3(−4)\n  = 10 − (−12)\n  = 10 + 12\n  = 22\n\n  The minus in front of the 3b and the minus inside\n  the b met each other and became a plus, which is\n  the two-signs rule from Month 2.",
        mistake:
          "Substituting a negative value without brackets. If an answer to a substitution question is out by a sign or by a factor, this is the first thing to check.",
        drill: {
          skill: "L1-A1.3",
          count: 3,
          intro:
            "Three substitutions, some with negative values. Write every substituted value inside brackets before you calculate.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l62-expressions-from-words",
    moduleId: "ma-m4-algebra1",
    sectionId: SECTION_ID,
    order: 2,
    title: "Turning Words Into Algebra",
    subtitle: "The hard part of every word problem, done on its own",
    estimatedMinutes: 15,
    intro:
      "Most students who cannot do algebraic word problems can do the algebra perfectly well. What defeats them is the translation, so this lesson does the translation and nothing else. No equations are solved here.",

    atoms: [
      {
        id: "a-ma-al-choose-the-letter",
        title: "Start by saying what the letter stands for",
        explain:
          "Before writing anything else, write a sentence naming what your letter means, including its unit. Let n be the number of oranges. Let c be the cost of one book in naira. That line is part of the answer and it is marked.",
        origin:
          "Naming the unknown is the oldest move in algebra and the Egyptians had a word for it. The Rhind papyrus, from about 1650 before the common era, contains problems about a quantity it calls aha, usually translated as heap: a heap and a seventh of it make nineteen, what is the heap? That is precisely the modern move of letting x be the unknown, three and a half thousand years early, and the word heap is doing the job x does now. It is worth knowing that the difficult step was never the letter. It was deciding what the letter should stand for, which is why that decision is still the first line of a solution.",
        why: "A named letter prevents the commonest failure in word problems, which is solving for the wrong quantity. It also makes the algebra checkable: if you know x is a number of oranges, an answer of x = 2.5 tells you something has gone wrong.",
        example:
          "  A BAD START:\n\n    'Let x = oranges'\n\n  Oranges are fruit. Is x the number of them, their\n  cost, their weight? The line names nothing.\n\n  A GOOD START:\n\n    'Let n be the number of oranges Ada bought.'\n\n  Now every later line has a meaning, and the final\n  answer can be read back into the situation.\n\n\n  WHICH QUANTITY TO CHOOSE:\n\n  Pick the one everything else is described in terms\n  of. If Bola has 5 more than Ada, let Ada's amount\n  be the letter, because then Bola's is a + 5 and\n  only one letter is needed.\n\n    Let a be the number Ada has.\n    Then Bola has a + 5.\n    Together they have a + (a + 5) = 2a + 5.\n\n  Choosing Bola instead gives b and b − 5, which\n  works and leaves you subtracting, which is where\n  sign errors live.",
      },
      {
        id: "a-ma-al-words-to-operations",
        title: "The words and what they translate to",
        explain:
          "Each operation has a set of words that signal it. More than, sum and total mean addition. Less than, difference and fewer mean subtraction. Of, product and times mean multiplication. Per, shared and each mean division.",
        why: "Recognising the signal is most of the translation, and two of these words have an order that catches people. Five less than x is x − 5, not 5 − x, and the words come in the opposite order to the arithmetic.",
        table: {
          caption: "The signals, and the order to watch.",
          headers: ["Words", "Means", "Example"],
          rows: [
            ["more than, sum, total, increased by", "Add", "7 more than x is x + 7"],
            ["less than, fewer than, decreased by", "Subtract, REVERSED", "7 less than x is x − 7"],
            ["subtract from", "Subtract, REVERSED", "Subtract x from 7 is 7 − x"],
            ["of, times, product, double, twice", "Multiply", "twice x is 2x"],
            ["per, each, shared between, quotient", "Divide", "x shared among 4 is x/4"],
            ["consecutive", "Add 1 each time", "n, n + 1, n + 2"],
          ],
          note: "Rows two and three are the ones that cost marks. Both reverse the order the words appear in, so read them slowly and say the arithmetic out loud before writing it.",
        },
        example:
          "  TRANSLATING, ONE PHRASE AT A TIME:\n\n    five more than a number        x + 5\n    five less than a number        x − 5\n    subtract a number from five    5 − x\n    a number less five             x − 5\n    five times a number            5x\n    a number divided by five       x/5\n    five divided by a number       5/x\n    twice a number, plus five      2x + 5\n    twice the sum of a number\n      and five                     2(x + 5)\n\n  Compare the last two carefully. 'Twice a number,\n  plus five' doubles only the number. 'Twice the\n  sum' doubles everything, so it needs a bracket.\n  The word sum groups what follows it.",
        mistake:
          "Writing 5 − x for five less than x. Test it with a number: five less than 12 is 7, and 12 − 5 is 7 while 5 − 12 is −7. Checking with a number settles every one of these in seconds.",
        drill: {
          skill: "L1-A1.4",
          count: 3,
          intro:
            "Three expressions to write from words. Name what your letter stands for first, then translate one phrase at a time.",
        },
      },
      {
        id: "a-ma-al-building-expressions",
        title: "Building a longer expression",
        explain:
          "Take a worded situation one clause at a time, writing each piece in algebra as you go, then combine them. Do not try to write the whole thing in one movement.",
        why: "Long word problems are not harder algebra, they are more translation. Working clause by clause turns one difficult step into several easy ones, and it leaves working a marker can follow.",
        example:
          "  'Ada has n oranges. Bola has 5 more than Ada.\n   Chidi has twice as many as Bola. How many do\n   they have altogether?'\n\n  One clause at a time:\n\n    Ada:    n\n    Bola:   n + 5\n    Chidi:  2(n + 5)\n\n  Note Chidi's bracket. Twice as many as BOLA means\n  twice the whole of n + 5, and writing 2n + 5 would\n  say something else.\n\n  Altogether:\n\n    n + (n + 5) + 2(n + 5)\n  = n + n + 5 + 2n + 10\n  = 4n + 15\n\n  CHECK WITH A NUMBER. Let n = 3:\n\n    Ada 3, Bola 8, Chidi 16, total 27\n    Formula: 4(3) + 15 = 27\n\n  Agrees, so the expression is almost certainly\n  right. That check is available on every question\n  of this kind and it costs ten seconds.\n\n\n  A MONEY ONE:\n\n  'A pen costs p naira. A book costs 200 naira more.\n   What do 3 pens and 2 books cost?'\n\n    Pen:   p\n    Book:  p + 200\n    Cost:  3p + 2(p + 200)\n         = 3p + 2p + 400\n         = 5p + 400 naira\n\n  The unit belongs in the answer, as always.",
      },
      {
        id: "a-ma-al-perimeter-area-algebra",
        title: "Algebra in shapes",
        explain:
          "The perimeter and area work from the last module can be written with letters. A rectangle x long and 3 shorter has sides x and x − 3, a perimeter of 2(x + x − 3) and an area of x(x − 3).",
        why: "This is where the two modules meet and it is a standard exam form. It also shows that an algebraic expression can describe a whole family of shapes at once rather than one particular rectangle.",
        example:
          "  A rectangle is x cm long and 3 cm shorter than\n  it is long.\n\n    Length:  x\n    Width:   x − 3\n\n    Perimeter = 2 × (length + width)\n              = 2(x + x − 3)\n              = 2(2x − 3)\n              = 4x − 6 cm\n\n    Area      = length × width\n              = x(x − 3) cm²\n\n  The area keeps its bracket for now. Expanding it\n  is Month 6, and the unit is still cm² because two\n  lengths were multiplied.\n\n\n  CHECK WITH A NUMBER. Let x = 10:\n\n    A 10 by 7 rectangle.\n    Perimeter 2(10 + 7) = 34, and 4(10) − 6 = 34.\n    Area 10 × 7 = 70, and 10(10 − 3) = 70.\n\n  Both agree.\n\n\n  CONSECUTIVE NUMBERS, WHICH COMES UP CONSTANTLY:\n\n  Three consecutive whole numbers: n, n + 1, n + 2\n    Their sum: 3n + 3, which is 3(n + 1)\n\n  Notice what that says: the sum of three\n  consecutive numbers is always three times the\n  middle one. That is a small piece of proof, and\n  you could not have stated it without letters.",
      },
      {
        id: "a-ma-al-expression-vs-equation",
        title: "An expression is not an equation",
        explain:
          "An expression has no equals sign and cannot be solved, only simplified or evaluated. An equation has an equals sign and makes a claim that can be tested, so it can be solved.",
        why: "You met this in Month 1 and it matters most here, because the instruction depends on it. Trying to solve an expression means inventing an equals sign that was never written, and it is a specific and common error.",
        example:
          "    3x + 5          an EXPRESSION\n                    simplify it, evaluate it,\n                    nothing to solve\n\n    3x + 5 = 20     an EQUATION\n                    solve it: x = 5\n\n    3x + 5 > 20     an INEQUALITY\n                    solve it, and the answer is a\n                    range rather than one value.\n                    Month 6.\n\n\n  THE ERROR:\n\n  A student asked to simplify 5x + 3x writes\n\n    8x = 0, so x = 0\n\n  8x was the complete answer. Adding '= 0' invents\n  an equation nobody wrote and then solves it. The\n  instruction was simplify, and simplifying is\n  finished when the expression is as short as it\n  can be written.\n\n\n  THE TEST:\n\n  Look for an equals sign. If there is none, there\n  is nothing to solve, and the instruction must be\n  simplify, expand, factorise or evaluate instead.",
        mistake:
          "Adding an equals sign to an expression so that it can be solved. If the question says simplify, the answer is a shorter expression, and no value of x is being asked for.",
      },
      {
        id: "a-ma-al-translation-errors",
        title: "The four translation errors",
        explain:
          "Four mistakes account for nearly all lost marks in translating words to algebra, and each has a check that takes seconds.",
        why: "Every one of these is a reading error rather than an algebraic one, so checking the algebra will not find them. Substituting a number into both the words and your expression will.",
        table: {
          caption: "Four errors, and the check for each.",
          headers: ["Error", "Looks like", "The check"],
          rows: [
            ["Reversed subtraction", "5 less than x written as 5 − x", "Try it with a number: 5 less than 12"],
            ["Missing bracket", "Twice the sum written as 2x + 5", "Does the multiplier reach everything?"],
            ["Unnamed letter", "'Let x = money'", "Money how? Write the unit"],
            ["Wrong quantity solved for", "Finding Bola's when Ada's was asked", "Underline what the question wants"],
          ],
          note: "The first check is the strongest, because it turns an abstract question about word order into an arithmetic question you can answer instantly.",
        },
        practice: {
          prompt:
            "A pen costs p naira and a book costs 150 naira more than twice the pen. Write an expression for the cost of 4 pens and 3 books, then check it with p = 100.",
          answer:
            "The book costs 2p + 150, because it is 150 more than twice the pen. So four pens and three books cost 4p + 3(2p + 150) = 4p + 6p + 450 = 10p + 450 naira. Checking with p = 100: a pen is 100 and a book is 350, so four pens and three books cost 400 + 1,050 = 1,450, and the formula gives 1,000 + 450 = 1,450. Agrees. Note the bracket round the book's cost: without it the 3 would multiply only the 2p and the 150 would be counted once instead of three times.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l63-balance-method",
    moduleId: "ma-m4-algebra1",
    sectionId: SECTION_ID,
    order: 3,
    title: "The Balance Method",
    subtitle: "One method, and it solves every linear equation there is",
    estimatedMinutes: 16,
    intro:
      "There is exactly one method for solving a linear equation and you met its justification in Month 2. An equation says two things are equal, so anything done to one side must be done to the other, and undoing an operation means applying its inverse. Nothing else is needed.",

    atoms: [
      {
        id: "a-ma-al-what-equation-claims",
        title: "What an equation is claiming",
        explain:
          "An equation states that the two sides have the same value. Solving it means finding the value of the letter that makes that statement true, and for a linear equation there is exactly one such value.",
        origin:
          "The word algebra comes from al-Khwarizmi's book of about 820, and the phrase al-jabr in its title means restoring or putting back together. That is a description of this method: a quantity is taken from one side and the balance is restored on the other. What is striking is that al-Khwarizmi had none of the notation on this page. His equations are written out in words, and he verified his solutions with geometric diagrams, because a picture of a square and its parts was the most convincing proof available. The method in this lesson is his, and the symbols that make it quick are eight hundred years younger than the method itself.",
        why: "Starting from what the equation claims is what makes the balance rule obvious rather than arbitrary. If the two sides are equal and you change only one of them, they stop being equal, and every line after that is false.",
        example:
          "  3x + 5 = 20\n\n  This says: three of whatever x is, plus five,\n  comes to twenty. It is true for one value of x\n  and false for every other.\n\n    x = 1:  3 + 5 = 8     false\n    x = 4:  12 + 5 = 17   false\n    x = 5:  15 + 5 = 20   TRUE\n    x = 6:  18 + 5 = 23   false\n\n  So x = 5 is the solution, and it is the only one.\n\n  Guessing and checking works here and does not\n  scale, which is why a method is needed. But notice\n  that guessing is how you would CHECK an answer,\n  and checking is compulsory.\n\n\n  THE BALANCE PICTURE:\n\n      3x + 5  |  20\n     ---------+---------\n              ^\n         the equals sign is the pivot\n\n  Take 5 off the left and the scales tip. Take 5 off\n  BOTH and they stay level. That is the whole method.",
      },
      {
        id: "a-ma-al-balance-rule",
        title: "Whatever you do, do to both sides",
        explain:
          "You may add, subtract, multiply or divide by anything, as long as you do it to both sides. The equation stays true, and each operation is chosen to remove something from around the letter.",
        why: "This is the Month 2 balance atom being used for the first time on real equations. Doing something to one side only produces a line that is simply false, and everything derived from a false line is worthless however careful the later arithmetic.",
        example:
          "  Solve 3x + 5 = 20\n\n    3x + 5 = 20\n    3x + 5 − 5 = 20 − 5      subtract 5 from BOTH\n    3x = 15\n    3x ÷ 3 = 15 ÷ 3          divide BOTH by 3\n    x = 5\n\n  Written the way people actually write it:\n\n    3x + 5 = 20\n    3x = 15          (−5 from both sides)\n    x = 5            (÷3 both sides)\n\n  The note in brackets is worth writing. It tells\n  the marker what you did and it tells you, when\n  checking, whether you did it to both sides.\n\n\n  THE FALSE LINE:\n\n    3x + 5 = 20\n    3x = 20          WRONG\n\n  That line claims three x is twenty, which is not\n  what the first line said. Everything after it\n  answers a different question, and a marker reads\n  what is written rather than what was intended.",
        mistake:
          "Taking a quantity off one side only. The give-away is that the answer fails when substituted back, which is why the check at the end of this lesson is not optional.",
      },
      {
        id: "a-ma-al-one-step",
        title: "One step equations",
        explain:
          "If only one thing has been done to the letter, one inverse operation undoes it. Added becomes subtracted, multiplied becomes divided.",
        why: "Getting the inverse right on a single step is what makes two steps and then many steps manageable. The pairs are the ones from Month 2: add with subtract, multiply with divide.",
        example:
          "    x + 7 = 12          x − 4 = 9\n    x = 12 − 7          x = 9 + 4\n    x = 5               x = 13\n\n    5x = 40             x/3 = 6\n    x = 40 ÷ 5          x = 6 × 3\n    x = 8               x = 18\n\n  In each case the operation around the x was\n  undone by its inverse, applied to both sides.\n\n\n  A NEGATIVE ANSWER IS STILL AN ANSWER:\n\n    x + 9 = 4\n    x = 4 − 9\n    x = −5\n\n  Check: −5 + 9 = 4. Correct. Nothing is wrong with\n  a negative solution, and the directed number work\n  of Month 2 is what makes it readable.\n\n\n  AND AN EQUATION CAN HAVE THE LETTER ON THE RIGHT:\n\n    12 = x + 7\n    5 = x\n    so x = 5\n\n  The equals sign does not care which side it is on.\n  Write the answer as x = 5 at the end, because that\n  is the form the question asked for.",
        drill: {
          skill: "L1-A2.1",
          count: 3,
          intro:
            "Three one step equations. Name the operation around the letter, then apply its inverse to both sides.",
        },
      },
      {
        id: "a-ma-al-two-step",
        title: "Two step equations, and the order to undo them",
        explain:
          "When two things have been done to the letter, undo them in reverse order. The last thing done is undone first, which usually means dealing with the addition or subtraction before the multiplication or division.",
        why: "Undoing in the wrong order is the commonest error in the lesson. It is the same reverse ordering as the inverse operations atom in Month 2: a parcel is unwrapped in the opposite order to the way it was wrapped.",
        example:
          "  Solve 4x − 7 = 21\n\n  What was done to x?  Multiplied by 4, THEN 7 taken\n                       away.\n\n  So undo the subtraction first:\n\n    4x − 7 = 21\n    4x = 28          (+7 to both sides)\n    x = 7            (÷4 both sides)\n\n  Check: 4(7) − 7 = 28 − 7 = 21. Correct.\n\n\n  THE WRONG ORDER:\n\n    4x − 7 = 21\n    x − 7 = 21/4     dividing by 4 first, and only\n                     dividing the 4x\n\n  If you do divide first, you must divide EVERY\n  term: x − 7/4 = 21/4, which is correct and messy.\n  Dealing with the addition first keeps the numbers\n  whole, which is why it is the recommended order\n  rather than the only legal one.\n\n\n  WITH A BRACKET, which is Month 6's territory\n  and can be done now:\n\n    3(x + 2) = 18\n    x + 2 = 6        (÷3 both sides)\n    x = 4            (−2 both sides)\n\n  Here dividing first was easier, because 18 divides\n  by 3 tidily. Choose the order that keeps the\n  arithmetic clean.",
        mistake:
          "Dividing only one term when dividing a whole side. If you divide the left side by 4, every term on that side is divided by 4, not just the one with the letter in it.",
        drill: {
          skill: "L1-A2.2",
          count: 3,
          intro:
            "Three two step equations. Decide which operation to undo first, and say why, before you write anything.",
        },
      },
      {
        id: "a-ma-al-checking",
        title: "Checking by substituting back",
        explain:
          "Put your answer into the ORIGINAL equation and see whether the two sides come out equal. If they do, the answer is right. If they do not, it is wrong, and you know before the marker does.",
        why: "This is the only check in mathematics that is completely conclusive rather than merely reassuring. An equation either balances or it does not, and the check uses the original equation rather than any line you might have written incorrectly.",
        example:
          "  Solve and check 5x + 3 = 28\n\n    5x + 3 = 28\n    5x = 25\n    x = 5\n\n  CHECK in the ORIGINAL:\n\n    5(5) + 3 = 25 + 3 = 28\n    The right side is 28.\n    Balances, so x = 5 is correct.\n\n\n  A FAILED CHECK, AND WHAT IT FINDS:\n\n    2x + 9 = 25\n    2x = 34          (added 9 instead of subtracting)\n    x = 17\n\n  CHECK:  2(17) + 9 = 34 + 9 = 43, not 25.\n\n  The check has failed, so the answer is wrong, and\n  you now know to look for the error. Going back:\n  25 − 9 = 16, so 2x = 16 and x = 8.\n\n  CHECK AGAIN: 2(8) + 9 = 16 + 9 = 25. Correct.\n\n\n  USE THE ORIGINAL, NOT YOUR WORKING:\n\n  Checking against a line you wrote halfway down\n  will confirm your own mistake. The original\n  equation is the only line you know is right.",
      },
      {
        id: "a-ma-al-equation-errors",
        title: "The four errors in solving",
        explain:
          "Four mistakes account for nearly every lost mark in solving linear equations, and the substitution check catches all four.",
        why: "Naming your own error makes the check specific. And since substituting back catches every one of these, the habit is worth more than the list, which is why this atom ends with it.",
        table: {
          caption: "Four errors, what they look like, and the fix.",
          headers: ["Error", "Looks like", "The fix"],
          rows: [
            ["One side only", "3x + 5 = 20 becoming 3x = 20", "Write what you did beside each line"],
            ["Wrong inverse", "x + 9 = 4 becoming x = 13", "Added? Then subtract"],
            ["Wrong order", "4x − 7 = 21, dividing before adding", "Undo the last thing done first"],
            ["Partial division", "4x − 7 = 21 becoming x − 7 = 21/4", "Divide every term on that side"],
          ],
          note: "Every one of these produces an answer that fails when substituted back into the original equation. That is why the check is not a nicety: it is a complete test, and it is available on every equation you will ever solve.",
        },
        practice: {
          prompt:
            "Solve 7x − 4 = 3x + 12, then check your answer in the original equation.",
          answer:
            "Gather the x terms on one side and the numbers on the other, doing each move to both sides. Subtract 3x from both: 4x - 4 = 12. Add 4 to both: 4x = 16. Divide both by 4: x = 4. Check in the original: the left side is 7(4) - 4 = 24, and the right side is 3(4) + 12 = 24. Both sides are 24, so the equation balances and x = 4 is correct. Note that letters on both sides changes nothing about the method: the balance rule still decides every move.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l64-equations-from-problems",
    moduleId: "ma-m4-algebra1",
    sectionId: SECTION_ID,
    order: 4,
    title: "Equations From Word Problems",
    subtitle: "Putting the two halves together",
    estimatedMinutes: 16,
    intro:
      "Lesson 62 turned words into algebra. Lesson 63 solved equations. This lesson does both in one go, which is what every real question asks for, and it adds one step the other two did not need: reading the answer back into the situation to see whether it makes sense.",

    atoms: [
      {
        id: "a-ma-al-five-steps",
        title: "Five steps, in this order",
        explain:
          "Name the letter, write the equation, solve it, check it in the equation, then answer the question that was asked in the words of the question. The last step is the one people skip and it is where marks are lost.",
        why: "A word problem has a right answer in the situation, not just in the algebra. A solution of x = 8 is not an answer to how many oranges did Ada buy, and a marker looking for a sentence with a number in it will not find one.",
        example:
          "  'Ada buys some oranges at 50 naira each and\n   spends 400 naira. How many did she buy?'\n\n  STEP 1  Name the letter.\n            Let n be the number of oranges.\n\n  STEP 2  Write the equation.\n            50n = 400\n\n  STEP 3  Solve it.\n            n = 8\n\n  STEP 4  Check in the equation.\n            50 × 8 = 400. Correct.\n\n  STEP 5  Answer the question asked.\n            Ada bought 8 oranges.\n\n  Step 5 is one line and it is the line the question\n  actually asked for. Writing n = 8 and stopping\n  leaves the marker to finish the job.\n\n\n  A TWO STEP ONE:\n\n  'A taxi charges 500 naira plus 120 naira per km.\n   A journey costs 2,300 naira. How far was it?'\n\n    Let d be the distance in km.\n    500 + 120d = 2,300\n    120d = 1,800\n    d = 15\n    Check: 500 + 120(15) = 500 + 1,800 = 2,300. Yes.\n    The journey was 15 km.",
        drill: {
          skill: "L1-A2.3",
          count: 3,
          intro:
            "Three equations from word problems. Name the letter with its unit before you write anything else.",
        },
      },
      {
        id: "a-ma-al-does-it-make-sense",
        title: "Reading the answer back",
        explain:
          "An answer that is algebraically correct can still be impossible in the situation. A number of people cannot be 7.5, a length cannot be negative, and a count of oranges cannot be a fraction. Check the answer against what it describes.",
        why: "This catches errors that the substitution check cannot, because an equation formed from the wrong reading of the words will balance perfectly. Reading the answer back into the situation is the only check on the translation itself.",
        example:
          "  A CHECK THAT PASSES AND AN ANSWER THAT FAILS:\n\n  'Chairs cost 4,500 naira each. How many can be\n   bought with 20,000 naira?'\n\n    4,500c = 20,000\n    c = 4.44...\n\n  The algebra is right and you cannot buy 4.44\n  chairs. The answer is 4 chairs, with 2,000 naira\n  left over, and saying so is the answer to the\n  question that was asked.\n\n  The equation balanced. The SITUATION decided the\n  answer.\n\n\n  A NEGATIVE THAT SIGNALS A MISREADING:\n\n  'A number of students share 60 books equally,\n   getting 5 each. How many students?'\n\n  If your equation gives a negative number of\n  students, the equation was formed wrongly, not\n  solved wrongly. Go back to the words.\n\n\n  THE THREE QUESTIONS TO ASK:\n\n    Can this quantity be negative?\n    Can it be a fraction?\n    Is it a sensible size for what it describes?\n\n  A speed of 4,000 km/h, an age of 250, a price of\n  0.03 naira: each one is a signal to look again at\n  the translation rather than at the arithmetic.",
      },
      {
        id: "a-ma-al-both-sides",
        title: "When the letter is on both sides",
        explain:
          "Gather the letter terms on one side and the numbers on the other, using the balance rule for each move. It is usual to move the smaller letter term, because that keeps the coefficient positive.",
        why: "Word problems comparing two people or two plans almost always produce a letter on both sides, and the method does not change. Choosing which side to gather on is the only decision, and choosing well avoids negative coefficients.",
        example:
          "  Solve 7x − 4 = 3x + 12\n\n    7x − 4 = 3x + 12\n    4x − 4 = 12          (−3x from both sides)\n    4x = 16              (+4 to both sides)\n    x = 4                (÷4 both sides)\n\n  Check: 7(4) − 4 = 24, and 3(4) + 12 = 24. Yes.\n\n  Moving the 3x rather than the 7x kept the\n  coefficient positive. Moving the other way gives\n  −4x = −16, which is correct and one more place for\n  a sign error to live.\n\n\n  A COMPARISON PROBLEM, THE USUAL SOURCE:\n\n  'Plan A charges 2,000 naira plus 150 per unit.\n   Plan B charges 3,500 naira plus 100 per unit.\n   At how many units do they cost the same?'\n\n    Let u be the number of units.\n\n    Plan A: 2,000 + 150u\n    Plan B: 3,500 + 100u\n\n    Same cost:  2,000 + 150u = 3,500 + 100u\n                2,000 + 50u = 3,500    (−100u both)\n                50u = 1,500            (−2,000 both)\n                u = 30\n\n    Check: A gives 2,000 + 4,500 = 6,500\n           B gives 3,500 + 3,000 = 6,500. Equal.\n\n    They cost the same at 30 units.\n\n  And a useful extra: below 30 units Plan A is\n  cheaper, above 30 Plan B is. That is the kind of\n  question Month 6 asks, and the equation has\n  already done the work for it.",
      },
      {
        id: "a-ma-al-consecutive-problems",
        title: "The standard problem types",
        explain:
          "A few shapes of word problem come up again and again: consecutive numbers, ages, sharing in a comparison, and cost equals a fixed charge plus a rate. Recognising the shape gives you the equation almost immediately.",
        why: "These are not tricks, they are patterns worth recognising, and the recognition saves the time that would go into translating from scratch. Each one also has a standard way of naming the letter that keeps the algebra simple.",
        table: {
          caption: "The shapes, and how to set each one up.",
          headers: ["Problem type", "Let the letter be", "The equation looks like"],
          rows: [
            ["Consecutive numbers", "The smallest", "n + (n+1) + (n+2) = total"],
            ["Ages now and later", "The younger age now", "a + years = k(b + years)"],
            ["One has more than the other", "The smaller amount", "a + (a + d) = total"],
            ["Fixed charge plus a rate", "The number of units", "fixed + rate × u = total"],
            ["Two plans compared", "The number of units", "plan A = plan B"],
            ["Sharing in a ratio", "One part", "sum of parts × one part = total"],
          ],
          note: "In every row the letter is chosen to be the quantity everything else is described from. That choice is what keeps the problem to one letter, and one letter is what makes it solvable by the methods of this module.",
        },
        example:
          "  CONSECUTIVE NUMBERS:\n\n  'Three consecutive whole numbers add up to 72.\n   Find them.'\n\n    Let n be the smallest.\n    n + (n + 1) + (n + 2) = 72\n    3n + 3 = 72\n    3n = 69\n    n = 23\n\n    The numbers are 23, 24 and 25.\n    Check: 23 + 24 + 25 = 72. Correct.\n\n\n  AGES, which need care:\n\n  'Ada is 3 times as old as Bola. In 5 years she\n   will be twice as old. How old is Bola now?'\n\n    Let b be Bola's age now.\n    Then Ada is 3b now.\n    In 5 years: Bola is b + 5, Ada is 3b + 5.\n\n    3b + 5 = 2(b + 5)\n    3b + 5 = 2b + 10\n    b + 5 = 10\n    b = 5\n\n    Bola is 5 and Ada is 15.\n    Check in 5 years: Bola 10, Ada 20, and 20 is\n    twice 10. Correct.\n\n  Note that the 5 years is added to BOTH ages. That\n  is the step age problems turn on.",
      },
      {
        id: "a-ma-al-where-next",
        title: "Where this goes",
        explain:
          "Everything algebraic in the remaining five months is this module made harder. Brackets get expanded, fractions appear in equations, two equations get solved together, and the letter appears squared, and the balance rule governs all of it.",
        why: "Knowing that nothing fundamentally new is coming is worth saying. The methods in the next five months are extensions rather than replacements, and a student who is solid here has the foundation for all of them.",
        table: {
          caption: "This module, and what each part becomes.",
          headers: ["From here", "Becomes", "In"],
          rows: [
            ["Collecting like terms", "Expanding and factorising", "Month 6"],
            ["The balance method", "Equations with brackets and fractions", "Month 6"],
            ["Letters on both sides", "Simultaneous equations", "Month 6"],
            ["Substitution", "Changing the subject of a formula", "Month 6"],
            ["Writing an expression from words", "Forming and solving from any context", "Every month"],
            ["Linear equations", "Quadratic equations", "Month 7"],
            ["An expression in one letter", "A function and its graph", "Months 5 and 9"],
          ],
          note: "Read the last row. An expression like 3x + 2 becomes, in Month 5, a line on a graph, and every point on that line is a pair of numbers the expression pairs up. That is the same object seen a third way, after a rule and a table.",
        },
      },
      {
        id: "a-ma-al-review",
        title: "Four months, mixed",
        explain:
          "A drill across algebra, sequences, ratio, measurement, fractions, decimals, percentages and the number work of Months 1 and 2, with nothing to say which is which.",
        why: "This is the last review of the foundation. Month 5 begins the senior syllabus with indices, commercial arithmetic, graphs and geometry, and all of it rests on these four months. Mixed practice after a gap is the only honest test of what is still available.",
        drill: {
          review: [
            "L1-A2.2",
            "L1-A1.3",
            "L1-A3.3",
            "L2-N3.1",
            "L1-G1.3",
            "L1-N3.2",
            "L1-A1.2",
            "L0-N5.4",
          ],
          count: 8,
          intro:
            "Eight questions from across four months. Decide what each one is asking before you calculate, because identifying the method is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start Month 5",
      intro:
        "Four months of foundation end here. Month 5 begins the senior syllabus and assumes all of it. Check with a pen, no calculator:",
      prompts: [
        "Simplify 5x + 3y − 2x + 7 − y + 4, then check your answer by putting x = 2 and y = 1 into both forms.",
        "Evaluate 3x² − 4x when x = −2, substituting in brackets, and say what goes wrong without them.",
        "A pen costs p naira and a book costs 150 naira more than twice the pen. Write the cost of 4 pens and 3 books.",
        "Solve 7x − 4 = 3x + 12 and check it in the original equation.",
        "Three consecutive whole numbers add to 72. Find them, and answer in a sentence.",
        "Plan A charges 2,000 plus 150 per unit; Plan B charges 3,500 plus 100 per unit. At how many units do they cost the same, and which is cheaper below that?",
      ],
      close:
        "If the second one gave −4, the brackets were missing and the square hit only the 2 instead of the whole of −2. If the fourth failed its check, look for a line where something was done to one side only. Both of those errors are caught completely by substituting back, which is why that habit matters more than any single technique in this module.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
