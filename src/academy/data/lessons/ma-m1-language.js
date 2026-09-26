/**
 * MATHEMATICS · MONTH 1 · MODULE 2 · THE LANGUAGE OF MATHEMATICS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Why a whole module on words, before a single sum.
 *
 * Every year, WAEC's Chief Examiners report the same thing in different
 * language: candidates answer a question other than the one asked. They
 * simplify when told to solve. They give a decimal when the question said
 * "in its lowest terms". They restart from scratch on part (b) when the word
 * "hence" was an instruction to use part (a). None of that is a gap in their
 * mathematics. It is a gap in their reading, and it costs whole questions.
 *
 * So this module comes first and teaches the instructions as instructions:
 * what each one is asking for, what a complete answer to it looks like, and
 * what it costs to answer a different one. Nothing here is hard. Almost
 * nobody is taught it.
 */

export const SECTION_ID = "ma-s1-language";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l5-instructions",
    moduleId: "ma-m1-language",
    sectionId: SECTION_ID,
    order: 1,
    title: "What the Question Is Actually Asking",
    subtitle: "Evaluate, simplify, solve, express",
    estimatedMinutes: 14,
    intro:
      "Four words do most of the work in mathematics papers, and they are not interchangeable. Each one asks for a different kind of answer, and giving the right mathematics in the wrong form still scores zero. This lesson is those four words.",

    atoms: [
      {
        id: "a-ma-lang-why",
        title: "The wording is not decoration",
        explain:
          "A mathematics question has two parts: the instruction and the content. Most students read only the content, the numbers and the symbols, and guess the instruction from habit. The instruction is the part that decides what a complete answer looks like.",
        origin:
          "Being examined in writing is a recent way to be tested. For most of history mathematics was examined out loud: a candidate at Cambridge in the 1600s defended propositions in spoken argument, and the first written mathematics examination there was set in the 1700s. The exam you are preparing for has a specific birthday. The West African Examinations Council was founded in 1952 to run one common set of papers for Nigeria, Ghana, Sierra Leone and the Gambia, so that a certificate earned in one country meant the same thing in the others. That is why the wording is so careful. A paper marked by thousands of examiners across several countries has to mean exactly one thing, and the instruction words are how it does that.",
        why: "Examiners mark against the instruction. A candidate who works out the right value but presents it in the wrong form has not answered the question, and the mark scheme has no box to put that in. This is the cheapest source of lost marks in the whole subject, and it is entirely avoidable.",
        table: {
          caption: "The same numbers, four different questions.",
          headers: ["Instruction", "What is wanted", "A complete answer"],
          rows: [
            ["Evaluate 3 + 4 × 2", "A single number", "11"],
            ["Simplify 3x + 4x", "A tidier expression", "7x"],
            ["Solve 3x = 12", "The value of the unknown", "x = 4"],
            ["Express 0.75 as a fraction", "The same value, different notation", "3/4"],
          ],
          note: "Notice that only one of those four answers is a plain number.",
        },
        mistake:
          "Reading the numbers first and the instruction last, or not at all. Read the instruction first. It tells you what kind of thing you are looking for before you start looking.",
      },
      {
        id: "a-ma-lang-what-is-a-letter",
        title: "What a letter is doing in a sum",
        explain:
          "A letter in mathematics is an empty box. It is waiting for a number to be put into it, and nothing more mysterious than that is going on. When you see 2 + x = 7, the sum is asking you: two plus what makes seven?",
        origin:
          "People have been leaving a gap for the unknown amount for as long as they have been doing arithmetic, and they used ordinary words for it. The Egyptians called it aha, which means heap: a heap and a seventh of it make nineteen, what is the heap? Arab mathematicians a thousand years ago called it the thing. Italian merchants called it cosa, also the thing, and English books of the 1500s translated that as coss. So the unknown has been a heap, a thing and a box long before it was a letter, and every one of those names is telling you the same thing: something is missing and we are going to find it.",
        why: "This is the question people ask about mathematics more than any other, and it deserves a straight answer: what is x, and what has it ever done for anybody? A letter is a box with a number missing, and the sum is asking which number goes in. Asked that way, most people answer instantly a question they had believed was beyond them. And the use is everywhere: any time you know a total and need the missing piece, that is a box waiting to be filled. What change should I get. How many can I afford. What was the price before the discount.",
        example:
          "  Here is a sum with a box in it:\n\n      2  +  [    ]  =  7\n\n  Read it out loud:\n\n      two plus WHAT makes seven?\n\n  You already know the answer. Five.\n\n      2  +  [ 5  ]  =  7\n\n\n  THAT IS ALL ALGEBRA IS DOING.\n\n  The only change is that drawing a box is\n  awkward, so a letter is written instead:\n\n      2  +  x  =  7\n\n  Exactly the same question. Two plus what\n  makes seven. And the same answer: x = 5.\n\n  Nothing was hidden from you. A letter is a\n  box with a number missing.\n\n\n  IT IS STILL A BOX WHEN THE SUM IS LONGER:\n\n      3  ×  [    ]  +  5  =  20\n\n  Three times WHAT, then add five, makes\n  twenty?\n\n      Try 5:  3 × 5 = 15, and 15 + 5 = 20.\n\n  It fits. So the box holds 5, and that is\n  written x = 5.\n\n  Guessing works here and gets slow with\n  bigger numbers, and that is the ONLY reason\n  a method exists. Month 4 teaches it. The\n  question it answers does not change.\n\n\n  WHY A LETTER AND NOT A BOX?\n\n  Boxes are awkward to write and to print,\n  and a sum with two different missing\n  numbers would need two different boxes.\n\n  Letters are easy. x and y, or p for a pack\n  and c for a cost. That is the whole reason.",
        mistake:
          "Believing that x is a special kind of object with rules of its own. It is a number you have not been told yet. Every rule that works for numbers works for it, which is the only reason the notation is any use.",
        practice: {
          prompt:
            "Read each of these as a question with the word WHAT in it, then answer it in your head: (a) 4 + x = 10, (b) x − 3 = 8, (c) 5 × x = 35.",
          answer:
            "(a) Four plus what makes ten? Six, so x = 6. (b) What take away three leaves eight? Eleven, so x = 11. (c) Five times what makes thirty five? Seven, so x = 7. Notice that you did not use a method for any of them. You read the sum as a question and answered it, and that is exactly what the methods later in the course are for: doing the same thing when the numbers are too awkward to see at a glance.",
        },
      },
      {
        id: "a-ma-lang-evaluate",
        title: "Evaluate: find the numerical value",
        explain:
          "Evaluate means: work it out until you have a NUMBER. Nothing should be left unresolved. If the question gives you values for the letters, put them in first, then calculate.",
        origin:
          "Evaluate comes from the Latin valere, to be worth, which also gives us value, valid and valour. So evaluate is not a technical coinage at all: it literally means find the worth of. When a question says evaluate, it is asking what this thing is worth once every letter has been replaced by a number.",
        why: "Evaluate is the instruction that permits no algebra in the answer. If your answer still contains an x, or a bracket you have not multiplied out, or an unresolved fraction where a decimal was asked for, you have not evaluated. You have simplified, which was not the instruction.",
        example:
          "  You met this rule in Lesson 1:\n\n    total  =  price × number\n\n  Evaluate the total when a sachet costs ₦50\n  and you are buying 4.\n\n    total = price × number\n          = 50 × 4\n          = ₦200          a number. Done.\n\n  That is all evaluate means: put the numbers\n  in and work it out until one number is left.\n\n\n  It also applies to a plain sum:\n\n    Evaluate 2 + 3 × 4\n\n  = 2 + 12      multiplication first\n  = 14\n\n  Why multiplication comes first is Lesson 20.",
        mistake:
          "Stopping at 3(4) + 5 and calling it an answer. That is the substitution, not the evaluation. Keep going until there is one number left.",
        practice: {
          prompt:
            "A question says 'Evaluate 5a − 2 when a = 3'. A student writes 5(3) − 2. Have they answered the question?",
          answer:
            "No. They have substituted correctly, which is the right first step, but 'evaluate' asks for the numerical value. The answer is 15 − 2 = 13. In an exam, 5(3) − 2 might earn a method mark but not the answer mark.",
        },
      },
      {
        id: "a-ma-lang-simplify",
        title: "Simplify: same value, tidier form",
        explain:
          "Simplify means: write the same thing in its neatest form. The value does not change; the appearance does. You are not looking for a number. You are looking for the shortest correct way to write what is already there. An equation is a piece of mathematics WITH an equals sign, claiming that the two sides are worth the same. An expression has no equals sign. That single difference decides which instruction can be used on it.",
        why: "Simplify is the instruction most often confused with solve. Simplify has no equals sign to work across and produces an EXPRESSION, which is the name for a piece of mathematics with no equals sign in it. Solve has an equation and produces a VALUE. A student who 'solves' 3x + 4x by writing x = 0 has misread the instruction badly enough to lose every mark.",
        table: {
          caption: "What counts as simplified, by topic.",
          headers: ["Kind of thing", "Simplified means"],
          rows: [
            ["A fraction", "Lowest terms, nothing but 1 divides top and bottom"],
            ["Like terms", "Collected, so 3x + 4x becomes 7x"],
            ["A ratio", "Whole numbers with no common factor, so 4:6 becomes 2:3"],
            ["A list of items to buy", "Grouped, so 2 pens and 3 pens becomes 5 pens"],
            ["Anything else", "As short as it can be written without changing its value"],
          ],
        },
        example:
          "  Simplify means: same value, fewer words.\n\n  You take 6 packs of sachet water to a stall,\n  ₦2 in change, bring 4 packs back, and are\n  given ₦9 more.\n\n  Written out as it happened:\n\n    6 packs + ₦2 − 4 packs + ₦9\n\n  Now gather what belongs together:\n\n    packs:  6 packs − 4 packs  =  2 packs\n    money:  ₦2 + ₦9            =  ₦11\n\n    So: 2 packs and ₦11\n\n  The packs could not be added to the money,\n  because they are different things. That is\n  the whole rule.\n\n\n  In the notation you will meet in Month 4,\n  with p standing for a pack:\n\n    6p + 2 − 4p + 9   =   2p + 11\n\n  Notice there is no 'p equals' anything here.\n  Nothing was solved. It was only tidied.",
        mistake:
          "Adding an equals sign and a zero to an expression to make it look finished. 2x + 11 is a complete answer to 'simplify'. 2x + 11 = 0 is a different question that nobody asked.",
      },
      {
        id: "a-ma-lang-solve",
        title: "Solve: find the unknown that makes it true",
        explain:
          "Solve means: there is an equation, there is a letter in it, and exactly one thing (sometimes two) will make the two sides equal. Find it. Your answer is written as 'x = …'.",
        origin:
          "The word algebra is the name of part of a book title. Around the year 820, in Baghdad, a scholar called Muhammad ibn Musa al-Khwarizmi wrote a book whose title contains the phrase al-jabr, meaning restoring or putting back together, because that is what he did to equations: he moved a quantity from one side and restored the balance on the other. Europe took the word and kept it. His own name, passed through Latin, became the word algorithm. And he was not doing this for fun. The book's problems are about dividing inheritances, measuring land and settling trade, all of which Islamic law required to be worked out exactly.",
        why: "You can only solve an EQUATION, meaning something with an equals sign in it. If there is no equals sign, there is nothing to solve, and the instruction will have been something else. That single test tells you instantly which of the two instructions you are looking at.",
        example:
          "  Solve means: find the number that fits.\n\n  3 sachets and a ₦5 nylon bag cost ₦20\n  altogether. What does one sachet cost?\n\n  Call the price of a sachet x.\n\n    3 sachets plus the bag  =  ₦20\n\n         3x + 5 = 20\n         3x     = 15    take ₦5 off BOTH sides\n          x     = 5     divide BOTH sides by 3\n\n  So a sachet costs ₦5.\n\n  CHECK IT, always:\n\n    3 sachets at ₦5  =  ₦15\n    plus the ₦5 bag  =  ₦20   ✓\n\n  The answer is x = 5, not 5 on its own and not\n  3x = 15. Say what the number IS.",
        analogy:
          "An equation is a pair of scales that balance. Solving is working out what weight is hidden in the covered pan. Whatever you do to one pan you must do to the other, or the scales stop telling you the truth.",
        mistake:
          "Writing just '5'. Write x = 5. In a question with two unknowns, an unlabelled number is genuinely ambiguous, and examiners will not guess in your favour.",
      },
      {
        id: "a-ma-lang-express",
        title: "Express, and write in the form",
        explain:
          "Express means: rewrite this in the notation I am naming. 'Express 0.75 as a fraction', 'express 45,000 in standard form', 'express y in terms of x'. The value is unchanged; the form is specified, and the form is the mark.",
        why: "'Write in the form …' is the strictest instruction on the paper, because it shows you the shape the answer must take. An answer that is the right value in the wrong shape is marked wrong, because the shape was the thing being tested.",
        table: {
          caption: "Common 'express' instructions and what they demand.",
          headers: ["Instruction", "Demands", "You meet it in"],
          rows: [
            ["Express in figures", "Digits, not words", "Month 1"],
            ["Express in words", "Words, not digits", "Month 1"],
            ["Express as a fraction in its lowest terms", "A fraction, fully cancelled", "Month 3"],
            ["Express as a percentage", "A number out of a hundred", "Month 3"],
            ["Express in standard form", "A short form for very large or very small numbers", "Month 5"],
            ["Give your answer in terms of pi", "Pi kept as a symbol rather than worked out", "Month 5"],
          ],
          note: "You are not expected to recognise the last three yet. They are here so that when one appears in a past paper you know it is an instruction about the FORM of the answer and not a new topic.",
        },
        mistake:
          "Reaching for the calculator when the question has told you to leave the answer exact. Some instructions exist specifically to tell you NOT to work something out, and turning an exact answer into a rounded decimal throws away the accuracy the question was testing.",
        practice: {
          prompt:
            "A question says: 'Express 2,450 in words.' A student writes 2,450. Have they answered it?",
          answer:
            "No. The value is right and the form is wrong, which is the whole point of an express instruction. The answer is two thousand, four hundred and fifty. Writing the figures back is not an answer to a question that asked for words.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l6-marks-words",
    moduleId: "ma-m1-language",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Instructions That Carry the Marks",
    subtitle: "Hence, show that, correct to, and the rest",
    estimatedMinutes: 14,
    intro:
      "The second group of words is where the heavier marks sit, because these ones tell you HOW to answer, not just what to find. 'Hence' is worth four marks and most candidates never notice it is there.",

    atoms: [
      {
        id: "a-ma-lang-hence",
        title: "Hence, and hence or otherwise",
        explain:
          "'Hence' means: use what you have just done. It is not a linking word; it is an instruction. Part (b) is meant to be answered using the result of part (a), and usually in one or two lines.",
        origin:
          "A question built in parts, where each part is allowed to use the ones before it, is a habit inherited from Euclid's Elements. Euclid numbered his propositions and each one may use only the results already proved, so the whole book is one long chain in which nothing is assumed out of order. Examination papers copy that structure deliberately. When part (b) says hence, it is telling you that part (a) is now a result you own and may use.",
        why: "Questions are built in parts on purpose. Part (a) is the hard bit, and the examiner has effectively given it to you. A candidate who ignores 'hence' and starts part (b) from scratch is choosing to do the hard work twice, usually runs out of time, and often gets it wrong, having already earned the piece they needed.",
        table: {
          caption: "The difference one word makes.",
          headers: ["Phrase", "What it permits"],
          rows: [
            ["Hence", "You MUST use the previous result. Another method may score nothing."],
            [
              "Hence or otherwise",
              "The previous result is the intended route, but any correct method scores.",
            ],
            ["(no linking word)", "The parts are independent. Start fresh."],
          ],
        },
        example:
          "(a) Work out 24 × 7.                               [2 marks]\n\n      24 × 7 = 168\n\n(b) Hence work out 24 × 70.                        [1 mark]\n\n  Using (a):   24 × 70 is ten times 24 × 7\n               so it is 1,680\n\nOne line. A candidate who ignores 'hence' sets out the whole\nmultiplication again and spends four times as long on a\nquestion worth half as many marks.\n\nThe same thing happens in every later paper, with harder\nparts (a). The word is doing the same job each time: it is\ntelling you that the work is already on the page.",
        mistake:
          "Treating the parts of a question as unrelated. If a question has parts (a), (b), (c), assume each one is a step toward the next until the wording tells you otherwise.",
      },
      {
        id: "a-ma-lang-showthat",
        title: "Show that, prove, deduce",
        explain:
          "'Show that' gives you the answer and asks for the working. The mark is entirely in the journey, because the destination was printed in the question. 'Prove' is stronger: it asks you to establish something for ALL cases, not to check one. 'Deduce' means draw a conclusion from what is already established.",
        origin:
          "The demand that a claim be proved, rather than merely checked in a few cases, is a Greek invention, and tradition credits it to Thales of Miletus around 600 before the common era. The Egyptians and the Babylonians had excellent mathematics long before that: correct methods for areas, volumes and the sides of right angled triangles, written as recipes to follow. What they did not write down is why any of it worked. The Greek move was to insist on the reason, and every show that question on a modern paper is a small descendant of that insistence.",
        why: "'Show that' is the most generous instruction on the paper and the most commonly thrown away. Candidates see that the answer is given, assume there is nothing to do, and write one line. Every mark in a 'show that' is a working mark, so one line scores one mark out of four.",
        example:
          "Show that 8 crates of eggs at ₦4,500 each\ncost ₦36,000.\n\n  8 × ₦4,500\n\n= 8 × ₦4,000  plus  8 × ₦500\n\n= ₦32,000  plus  ₦4,000\n\n= ₦36,000\n\n  As required.\n\n\nThe answer, ₦36,000, was printed in the\nquestion. So the answer cannot be what is\nbeing marked. Every mark here is for a line\nof the working, and a candidate who writes\nonly '= ₦36,000' has shown nothing.",
        mistake:
          "Starting from the answer and working backwards to the question. It sometimes works and it is not what was asked; begin with the left hand side and arrive at the right hand side.",
        practice: {
          prompt:
            "Why is checking that 2 + 2 = 4 not a PROOF that adding two even numbers gives an even number?",
          answer:
            "Because it checks one case, and a proof has to cover every case. The reason it is always true is this: an even number is a whole number of twos. Put two of them together and you still have a whole number of twos, so the total is still even. That argument does not mention 2 and 2 at all, which is exactly why it settles every pair at once. Month 4 shows how to write it with letters, and the letters do not make it more true, only shorter.",
        },
      },
      {
        id: "a-ma-lang-accuracy",
        title: "Correct to, and the degree of accuracy",
        explain:
          "'Correct to 2 decimal places', 'to 3 significant figures', 'to the nearest whole number' are all instructions about the FORM of the final answer. They are marked, and they are marked separately from the mathematics. Decimal places are the digits written after the point, so 3.14 has two of them. Significant figures count the digits that carry information, starting from the first one that is not zero. Both are taught properly in Month 3; what matters here is that they are instructions about the form of the answer and are marked separately from the mathematics.",
        why: "Two things go wrong. The first is ignoring the instruction and giving a long decimal. The second is worse and costs more: rounding in the middle of the working, so the final answer is wrong before it is rounded. Keep full accuracy all the way through and round once, at the end.",
        table: {
          caption: "The same number, four instructions.",
          headers: ["Instruction", "3.14159… becomes"],
          rows: [
            ["To 2 decimal places", "3.14"],
            ["To 3 significant figures", "3.14"],
            ["To the nearest whole number", "3"],
            ["To 1 decimal place", "3.1"],
          ],
          note: "Decimal places and significant figures agree here by coincidence. For 0.004621 they do not: 0.00 to 2 d.p., but 0.00462 to 3 s.f.",
        },
        mistake:
          "Premature rounding. If an intermediate value is 4.6666… and you write 4.7 and carry that forward, your final answer can be wrong in the second figure, and the accuracy mark goes with it. This is named explicitly in the Chief Examiners' reports.",
      },
      {
        id: "a-ma-lang-form-words",
        title: "The small phrases that change the answer",
        explain:
          "A handful of short phrases each change what a complete answer looks like. They are easy to skim past, and each one is a mark.",
        why: "These are not stylistic preferences. Each of them is testing something specific: whether you can simplify, whether you know an exact value from an approximate one, whether you can read an instruction at all.",
        table: {
          caption: "Read these as instructions, not as flourishes.",
          headers: ["Phrase", "What it means you must do"],
          rows: [
            ["In its lowest terms", "Cancel the fraction fully"],
            ["Leave your answer exact", "Do not round it, and do not reach for a calculator"],
            ["In terms of pi", "Keep pi as a symbol rather than working it out"],
            ["Giving your answer in metres", "Convert, the working may be in centimetres"],
            ["Correct to the nearest naira", "Round; do not leave kobo"],
            ["Using a ruler and a pair of compasses only", "No protractor. Leave the arcs visible."],
            ["Show all working", "Method marks are available and they are being offered to you"],
          ],
        },
        mistake:
          "Rubbing out construction arcs to make the diagram look neat. In a construction question the arcs ARE the evidence of method, and a clean diagram with no arcs looks exactly like one that was measured with a protractor.",
      },
      {
        id: "a-ma-lang-units",
        title: "Units, and the mark they carry",
        explain:
          "If a question is about a length, an area, a volume, money or time, the answer has a unit, and the unit is part of the answer. Area means how much surface something covers, such as a floor, and volume means how much space something fills, such as a tank. Area is measured in square units, written cm² and read 'square centimetres', because two lengths were multiplied together. The small raised 2 is shorthand for that, and Month 5 teaches the notation properly. For now, treat it as the label that says 'this is an area'.",
        origin:
          "Units used to be local and inconsistent, which made trade and taxation a running argument, so revolutionary France set out in the 1790s to define a unit from nature rather than from a king's forearm. The metre was fixed as one ten millionth of the distance from the North Pole to the equator, and the gram and the litre were built from it. That family of units, now called SI, is what the metric system is, and Nigeria adopted it in the 1970s. This is why the units in your papers convert by tens and hundreds while older units like feet and gallons do not.",
        why: "Units also catch errors. If a question asks for an area and your answer is in cm, you have added when you should have multiplied. If a volume comes out in cm², you have missed a dimension. The unit is a free check on the method as well as a mark.",
        example:
          "  A room is 4 m long and 3 m wide.\n\n  SKIRTING BOARD round the walls is a LENGTH:\n\n    2 × (4 + 3)  =  14 m of board\n\n    Unit: m. You only added lengths.\n\n\n  TILES for the floor are an AREA:\n\n    4 × 3  =  12 m² of tiles\n\n    Unit: m², read 'square metres', because\n    two lengths were multiplied together.\n\n\n  Both answers are 'the room'. They are not\n  the same quantity and they do not share a\n  unit, and writing 12 m for the tiles tells\n  a marker you do not know which you found.\n\n  The small raised 2 is shorthand for that,\n  and Month 5 teaches the notation properly.",
        mistake:
          "Writing 40 cm for an area. It is the commonest unit error there is, and it tells a marker you are following a formula without knowing what it produces.",
        practice: {
          prompt:
            "A student works out the area of a rectangle 8 cm by 6 cm and writes '48 cm'. What is wrong with the answer as written?",
          answer:
            "The number is right and the unit is not. Two lengths were multiplied together, so the answer is an area and the unit is square centimetres: 48 cm². Writing cm says a length, and it tells a marker you do not know what the calculation produced.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l7-parts",
    moduleId: "ma-m1-language",
    sectionId: SECTION_ID,
    order: 3,
    title: "The Parts of an Expression",
    subtitle: "Terms, factors, coefficients, and the words for them",
    estimatedMinutes: 13,
    intro:
      "You cannot follow an instruction like 'collect like terms' if you are not sure what a term is. This lesson names the pieces. It is short, it is vocabulary, and every later module assumes you have it.",

    atoms: [
      {
        id: "a-ma-lang-term",
        title: "Terms are separated by + and −",
        explain:
          "A TERM is a piece of an expression, and the pieces are separated by plus and minus signs. The sign in front of a term belongs to that term and travels with it.",
        origin:
          "Using letters for quantities was not obvious and it arrived late. The French lawyer Francois Viete, writing in 1591, was the first to do it systematically: he used vowels for the quantities he did not know and consonants for those he did. Before him, problems were written out as sentences, and a page of algebra read like a paragraph of prose.",
        why: "Almost every algebra instruction is about terms: collect like terms, how many terms, the constant term, the coefficient of the x term. Getting the boundaries wrong means the instruction cannot be followed even when the arithmetic is fine.",
        example:
          "5x + 3y − 7\n\n  Term 1:   5x\n  Term 2:  +3y\n  Term 3:  −7        ← the minus belongs to the 7\n\nThree terms.\n\n\n5x × 3y\n\n  ONE term. There is no + or − to separate anything.\n  Multiplication does not create a new term.",
        mistake:
          "Counting 5x × 3y as two terms because there are two letters. Terms are separated by + and − only; everything joined by × or ÷ is a single term.",
      },
      {
        id: "a-ma-lang-coefficient",
        title: "Coefficient and constant",
        explain:
          "The COEFFICIENT is the number multiplying the letter. The CONSTANT is the term with no letter in it, called constant because it does not change when the letter does.",
        origin:
          "The unknown is called x because Rene Descartes decided so. In his book of 1637 he used the letters at the start of the alphabet, a, b, c, for quantities taken as known, and the letters at the end, x, y, z, for the ones being looked for, and the convention stuck so hard that four centuries later x means the unknown even in ordinary speech. The word coefficient is Viete's, from the Latin for working together: the number and the letter act together to make one term.",
        why: "When a question says 'write down the coefficient of x', it wants one number, and it wants the sign that came with it. The sign is the part people drop. From Month 4 onwards you will be asked for coefficients constantly, and a coefficient read as 5 when it was really minus 5 turns perfect arithmetic into a wrong answer.",
        table: {
          caption: "Reading 4x − 9.",
          headers: ["Part", "Value", "Note"],
          rows: [
            ["Coefficient of x", "4", "The number multiplying the letter"],
            ["Constant term", "−9", "No letter, and the sign belongs to it"],
            ["Number of terms", "2", "Separated by the minus"],
          ],
          note: "Later you will meet longer expressions with more kinds of term in them. The words do not change: the number attached to a letter is its coefficient, and the number standing alone is the constant.",
        },
        mistake:
          "Giving the constant term of 4x − 9 as 9. It is −9. A sign sitting in front of a number is part of that number, not a piece of punctuation between terms.",
      },
      {
        id: "a-ma-lang-factor",
        title: "Factors are what multiply together",
        explain:
          "A FACTOR is something that multiplies. In 6 = 2 × 3, the factors are 2 and 3. In 5xy, the factors are 5, x and y. Terms add; factors multiply. Those are the two ways a mathematical object can be built.",
        why: "'Factorise' means: rewrite this sum as a product. That is the whole instruction, turn something made by adding into something made by multiplying. Knowing that terms add and factors multiply is what makes 'factorise' mean something rather than being a procedure you copy.",
        example:
          "Expanding turns factors into terms:\n\n  3(x + 2)   =   3x + 6\n  └ factors ┘     └ terms ┘\n\nFactorising turns terms back into factors:\n\n  3x + 6     =   3(x + 2)\n  └ terms ┘      └ factors ┘\n\nThe two instructions are exact opposites, which is why they are\ntaught together and why confusing them is so easy.",
        analogy:
          "Terms are the separate items on a market list. Factors are the things multiplied to get one item's cost: 3 tubers × ₦1,200. Adding up the list is one operation; working out one line is another.",
      },
      {
        id: "a-ma-lang-kinds",
        title: "Expression, equation, identity, formula",
        explain:
          "Four different objects, and the instruction you can apply depends on which one you have. An EXPRESSION has no equals sign. An EQUATION has one and is true for particular values. An IDENTITY has one and is true for all values. A FORMULA is a rule linking quantities.",
        origin:
          "Telling these four objects apart mattered enough that a separate symbol was invented for the identity. The three barred sign, which you will meet later, was introduced in the 1800s precisely because an equation true for one value of x and a statement true for every value of x are different kinds of claim and were being written the same way. When notation grows a new symbol, it is almost always because two genuinely different ideas had been sharing one.",
        why: "This is the test that tells you whether 'solve' is even possible. No equals sign means nothing to solve, the instruction must be simplify, expand, factorise or evaluate instead. Knowing which object is in front of you rules out three quarters of the possible instructions immediately.",
        table: {
          caption: "Four objects, four sets of instructions.",
          headers: ["Object", "Example", "What you can be asked"],
          rows: [
            ["Expression", "3x + 5", "Simplify, expand, factorise, evaluate"],
            ["Equation", "3x + 5 = 20", "Solve"],
            ["Identity", "a + b = b + a, true for every a and b", "Prove, show that, use"],
            ["Formula", "distance = speed × time", "Substitute, change the subject, evaluate"],
          ],
        },
        mistake:
          "Trying to solve an expression. If a student writes '3x + 5, so x = −5/3' they have invented an equals sign that was never there.",
        practice: {
          prompt:
            "Which of these can be solved: (i) 2x + 7, (ii) 2x + 7 = 15, (iii) distance = speed × time?",
          answer:
            "Only (ii). (i) is an expression: it can be simplified or evaluated, and there is nothing in it to solve. (iii) is a formula, which is a general rule true for every journey. You can put numbers into it, or rearrange it to make speed the subject, and on its own it is a rule rather than a question.",
        },
      },
      {
        id: "a-ma-lang-equals",
        title: "The equals sign, and what it does not mean",
        explain:
          "The equals sign means 'the thing on the left has the same value as the thing on the right'. It does not mean 'and then' or 'the answer is next'. Using it as a running commentary produces lines that are simply false.",
        origin:
          "You met Robert Recorde in Module 1, inventing the equals sign in 1557 because he was tired of writing the words is equal to. What is worth adding here is how long it took to win. For more than a century afterwards many writers kept using the abbreviation ae, from the Latin aequalis, and Descartes used a different symbol of his own. The two parallel lines only became standard once enough printers and writers found them clearer. Notation spreads the way a road does: not by being decreed, but by being used.",
        why: "Markers read your working as mathematics, not as notes. A line that says 12 + 3 = 15 × 2 = 30 is claiming that 15 equals 30, and a candidate who writes that routinely will eventually be penalised for it, and, more importantly, will eventually be confused by their own working.",
        example:
          "  You are keeping a running total at a stall.\n\n  WRONG, everything on one line:\n\n    12 + 3 = 15 × 2 = 30 − 4 = 26\n\n  Read what that line actually claims:\n  that 15 = 30, and that 30 = 26. Both false.\n\n  The equals sign does not mean 'and then'.\n  It means the two sides are the same amount.\n\n\n  RIGHT, one statement per line:\n\n    12 + 3  = 15\n    15 × 2  = 30\n    30 − 4  = 26\n\n  Every line is true on its own, and a marker\n  can follow it. So can you, tomorrow.",
        mistake:
          "Chaining an entire calculation across one line with equals signs. Write one equality per line. It is easier to check, easier to mark, and it is true.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l8-reading",
    moduleId: "ma-m1-language",
    sectionId: SECTION_ID,
    order: 4,
    title: "Reading a Question Properly",
    subtitle: "The habit that is worth more than any formula",
    estimatedMinutes: 12,
    intro:
      "The last lesson of the module is a method rather than a topic: how to read a question so that you answer the one in front of you. It takes about thirty seconds and it is the most valuable thirty seconds in any paper.",

    atoms: [
      {
        id: "a-ma-lang-method",
        title: "Read it twice, and underline three things",
        explain:
          "Read the question once to see what it is about. Read it again with a pen, underlining three things: the INSTRUCTION, the QUANTITIES you are given, and what is being ASKED for, including its form and units.",
        why: "Most misread questions are misread on the first pass and never looked at again. The second read costs seconds and catches the expensive mistakes: the wrong instruction, the quantity you skipped, the units you did not notice, the part (b) that said 'hence'.",
        example:
          "\"A trader buys 24 cartons of eggs at ₦4,500 each and sells them at\n a profit of 15%. Calculate, correct to the nearest naira, the\n selling price of one carton.\"\n\n  Instruction : Calculate\n  Given       : 24 cartons · ₦4,500 each · 15% profit\n  Asked for   : selling price of ONE carton, nearest naira\n\nThe 24 is not needed. The word ONE is the whole question.",
        mistake:
          "Using every number in the question because it is there. Questions include quantities you do not need, deliberately, to test whether you know which ones matter.",
      },
      {
        id: "a-ma-lang-answering-asked",
        title: "Answer the question that was asked",
        explain:
          "After solving, go back to the wording and check that your answer is the thing it named. In word problems the letter you solved for is often not the quantity asked about.",
        why: "This is the most common way a completely correct solution scores zero. A student lets x be the younger sister's age, solves perfectly, and then writes x when the question asked for the older brother's. Every line of the mathematics was right.",
        example:
          "\"Ada is 5 years older than Bola. Together they are 31.\n How old is ADA?\"\n\n  Let Bola be x.\n  Ada is x + 5.\n  x + (x + 5) = 31\n  2x = 26\n  x = 13\n\n  x = 13 is BOLA.\n  Ada is 13 + 5 = 18.        ← this is the answer\n\nStopping at x = 13 is a complete solution to a question\nnobody asked.",
        mistake:
          "Writing down x. Write down the sentence: 'Ada is 18 years old.' A sentence forces you to check that it answers the question.",
        practice: {
          prompt:
            "A student lets x be the number of exercise books bought, solves and gets x = 14, and the question asked 'how much did the books cost altogether at ₦250 each?'. What still has to be done?",
          answer:
            "One more step: 14 × ₦250 = ₦3,500. The question asked for the cost, not the quantity. x was only the route to it.",
        },
      },
      {
        id: "a-ma-lang-diagram",
        title: "If it can be drawn, draw it",
        explain:
          "Any question involving shape, distance, direction, sharing or comparison can be drawn, and drawing it turns a paragraph of words into something you can read at a glance. Capacity means how much a container can hold, measured in litres or millilitres.",
        why: "WAEC's Chief Examiners name this failure directly and repeatedly: candidates cannot translate a worded problem into a mathematical statement or a diagram. The whole of Month 4 and beyond depends on the habit, so it starts here.",
        example:
          "\"Two thirds of a tank is full. 240 litres are added and it becomes\n full. Find the capacity.\"\n\n  Draw the tank as a bar in 3 equal parts:\n\n    |███████|███████|       |     ← 2 parts full, 1 part empty\n\n  The empty part is 240 litres.\n  The empty part is 1/3 of the tank.\n  So the tank is 3 × 240 = 720 litres.\n\nThe drawing does the thinking. Without it, most students\nmultiply 240 by 2/3 and get 160.",
        mistake:
          "Deciding a diagram is a waste of time under exam pressure. A wrong answer arrived at quickly is slower than a right answer arrived at with a sketch.",
      },
      {
        id: "a-ma-lang-checking",
        title: "Is the answer a sensible size?",
        explain:
          "Before writing a final answer, ask whether it is roughly the size it should be. A discount that makes something more expensive, a percentage above 100 for a part of a whole, a piece cut off a plank coming out longer than the plank: each of these is visibly wrong without checking any of the working.",
        why: "A size check catches the errors that arithmetic checking misses, because it tests the METHOD rather than the calculation. Dividing when you should have multiplied gives an answer that is wrong by a factor of hundreds, and that is obvious the moment you look at it.",
        table: {
          caption: "Answers that announce their own errors.",
          headers: ["Question asked for", "Answer that must be wrong", "What went wrong"],
          rows: [
            ["A part of a whole, as a %", "Over 100%", "Divided the wrong way round"],
            ["Change from ₦1,000", "More than ₦1,000", "Added instead of subtracting"],
            ["A length in metres", "0.000004", "Converted the wrong way"],
            ["The total of several items", "Less than one of them", "Subtracted instead of adding"],
            ["An average of the set 4, 7, 9", "12", "Outside the data entirely"],
          ],
        },
        mistake:
          "Trusting a calculator over common sense. The calculator did exactly what it was told; the question is whether it was told the right thing.",
      },
      {
        id: "a-ma-lang-recap",
        title: "The whole module in six lines",
        explain:
          "Evaluate gives a number. Simplify gives a tidier form. Solve gives x = something. Express gives a named form. Hence means use the last part. Show that means the marks are in the working.",
        why: "Everything from Month 3 onwards assumes you can read an instruction and know what a complete answer looks like. This is the list to come back to whenever a question feels like it is asking something you have not been taught, usually it is asking something you have, in words you have not slowed down for.",
        table: {
          caption: "The reference card for the rest of the course.",
          headers: ["Word", "Produces", "Test"],
          rows: [
            ["Evaluate", "A number", "Is there still a letter? Then keep going."],
            ["Simplify", "An expression", "Is it as short as it can be?"],
            ["Solve", "x = a value", "Was there an equals sign to start with?"],
            ["Express / in the form", "A named notation", "Does it look like the shape they showed?"],
            ["Hence", "A short answer using the last part", "Did I use part (a)?"],
            ["Show that", "Working ending at a given answer", "Is every line written down?"],
          ],
        },
        practice: {
          prompt:
            "Without doing any mathematics: what kind of answer does each of these want? (i) Simplify 12/18 (ii) Evaluate 12/18 as a decimal (iii) Solve 12/x = 18",
          answer:
            "(i) a fraction in its lowest terms, 2/3. (ii) a number, 0.666… to whatever accuracy is stated. (iii) a value of the unknown, x = 2/3. Same two numbers, three different kinds of answer, decided entirely by the instruction.",
        },
      },
    ],

    task: {
      title: "Before you move on",
      intro:
        "Find any past mathematics paper you have, WAEC, NECO, JAMB, or a school test, and do this with the first five questions, without solving any of them:",
      prompts: [
        "Underline the instruction word in each question.",
        "Write beside each one what kind of answer it wants: a number, an expression, a value of x, or a named form.",
        "Note any question that specifies units, accuracy, or the form the answer must take.",
        "Note any part (b) that begins with 'hence'.",
      ],
      closing:
        "Five minutes on this will do more for your next paper than an hour of practice questions, because it fixes the errors that have nothing to do with whether you can do the mathematics.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
