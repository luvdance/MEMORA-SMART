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
        id: "a-ma-lang-evaluate",
        title: "Evaluate: find the numerical value",
        explain:
          "Evaluate means: work it out until you have a NUMBER. Nothing should be left unresolved. If the question gives you values for the letters, put them in first, then calculate.",
        why: "Evaluate is the instruction that permits no algebra in the answer. If your answer still contains an x, or a bracket you have not multiplied out, or an unresolved fraction where a decimal was asked for, you have not evaluated. You have simplified, which was not the instruction.",
        example:
          "Evaluate 3x + 5 when x = 4\n\n  3x + 5\n= 3(4) + 5        ← substitute, in brackets\n= 12 + 5\n= 17               ← a number. Done.\n\n\nEvaluate 2 + 3 × 4\n\n= 2 + 12           ← multiplication first (see Lesson 20)\n= 14",
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
          "Simplify means: write the same thing in its neatest form. The value does not change; the appearance does. You are not looking for a number. You are looking for the shortest correct way to write what is already there.",
        why: "Simplify is the instruction most often confused with solve. Simplify has no equals sign to work across and produces an EXPRESSION. Solve has an equation and produces a VALUE. A student who 'solves' 3x + 4x by writing x = 0 has misread the instruction badly enough to lose every mark.",
        table: {
          caption: "What counts as simplified, by topic.",
          headers: ["Kind of thing", "Simplified means"],
          rows: [
            ["A fraction", "Lowest terms, nothing but 1 divides top and bottom"],
            ["Like terms", "Collected, so 3x + 4x becomes 7x"],
            ["A ratio", "Whole numbers with no common factor, so 4:6 becomes 2:3"],
            ["A surd", "No square factor left inside the root, so √12 becomes 2√3"],
            ["An index", "One power of each base, so a³ × a² becomes a⁵"],
          ],
        },
        example:
          "Simplify 6x + 2 − 4x + 9\n\n  x terms:      6x − 4x = 2x\n  plain numbers: 2 + 9   = 11\n\n= 2x + 11          ← an EXPRESSION. There is no x = anything.",
        mistake:
          "Adding an equals sign and a zero to an expression to make it look finished. 2x + 11 is a complete answer to 'simplify'. 2x + 11 = 0 is a different question that nobody asked.",
      },
      {
        id: "a-ma-lang-solve",
        title: "Solve: find the unknown that makes it true",
        explain:
          "Solve means: there is an equation, there is a letter in it, and exactly one thing (sometimes two) will make the two sides equal. Find it. Your answer is written as 'x = …'.",
        why: "You can only solve an EQUATION, meaning something with an equals sign in it. If there is no equals sign, there is nothing to solve, and the instruction will have been something else. That single test tells you instantly which of the two instructions you are looking at.",
        example:
          "Solve 3x + 5 = 20\n\n  3x + 5 = 20\n  3x     = 15        ← subtract 5 from BOTH sides\n   x     = 5          ← divide BOTH sides by 3\n\nCheck: 3(5) + 5 = 20. ✓\n\nThe answer is x = 5, not 5 on its own, and not 3x = 15.",
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
        why: "'Write in the form …' is the strictest instruction in the paper, because it shows you the shape of the answer it wants. If a question says 'in the form a + b√2', an answer of 4.83 is wrong no matter how accurate it is, the question told you what the answer should look like.",
        table: {
          caption: "Common 'express' instructions and what they demand.",
          headers: ["Instruction", "Demands"],
          rows: [
            ["Express as a fraction in its lowest terms", "A fraction, fully simplified"],
            ["Express in standard form", "A × 10ⁿ, with A between 1 and 10"],
            ["Express y in terms of x", "y = something containing x and no y"],
            ["Leave your answer in surd form", "An exact root, not a decimal"],
            ["Give your answer in terms of π", "π kept as a symbol, not 3.142"],
          ],
        },
        mistake:
          "Reaching for the calculator when the question says 'in terms of π' or 'in surd form'. Those phrases exist to tell you NOT to. An exact answer turned into a decimal has thrown away the accuracy the question was testing.",
        practice: {
          prompt:
            "A question says: 'The area of a circle of radius 5 cm. Give your answer in terms of π.' A student writes 78.5 cm². What is wrong?",
          answer:
            "The value is right but the form is wrong. In terms of π means the answer is 25π cm². The student did the extra step the question specifically asked them not to do, and lost the mark for it.",
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
          "(a) Factorise x² − 9.                              [2 marks]\n      x² − 9 = (x − 3)(x + 3)\n\n(b) Hence solve x² − 9 = 0.                        [2 marks]\n\n  Using (a):   (x − 3)(x + 3) = 0\n  So           x − 3 = 0   or   x + 3 = 0\n               x = 3      or   x = −3\n\nTwo lines. Without 'hence', a candidate might reach for the\nquadratic formula and spend five minutes getting the same answer.",
        mistake:
          "Treating the parts of a question as unrelated. If a question has parts (a), (b), (c), assume each one is a step toward the next until the wording tells you otherwise.",
      },
      {
        id: "a-ma-lang-showthat",
        title: "Show that, prove, deduce",
        explain:
          "'Show that' gives you the answer and asks for the working. The mark is entirely in the journey, because the destination was printed in the question. 'Prove' is stronger: it asks you to establish something for ALL cases, not to check one. 'Deduce' means draw a conclusion from what is already established.",
        why: "'Show that' is the most generous instruction on the paper and the most commonly thrown away. Candidates see that the answer is given, assume there is nothing to do, and write one line. Every mark in a 'show that' is a working mark, so one line scores one mark out of four.",
        example:
          "Show that (n + 1)² − n² = 2n + 1.\n\n  (n + 1)² − n²\n= (n² + 2n + 1) − n²        ← expand the bracket\n= n² + 2n + 1 − n²          ← remove the bracket\n= 2n + 1                    ← the n² terms cancel\n\nAs required.\n\nEvery line is a mark. Writing only '= 2n + 1' is worth one of them.",
        mistake:
          "Starting from the answer and working backwards to the question. It sometimes works and it is not what was asked; begin with the left hand side and arrive at the right hand side.",
        practice: {
          prompt:
            "Why is checking that 2 + 2 = 4 not a PROOF that adding two even numbers gives an even number?",
          answer:
            "Because it checks one case. A proof must cover every case. The proof is: any even number can be written 2a and any other 2b, so their sum is 2a + 2b = 2(a + b), which is 2 times a whole number, and therefore even, for all of them, not just for 2 and 2.",
        },
      },
      {
        id: "a-ma-lang-accuracy",
        title: "Correct to, and the degree of accuracy",
        explain:
          "'Correct to 2 decimal places', 'to 3 significant figures', 'to the nearest whole number' are all instructions about the FORM of the final answer. They are marked, and they are marked separately from the mathematics.",
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
            ["In surd form", "Leave the root; do not use a calculator"],
            ["In terms of π", "Keep π as a symbol"],
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
          "If a question is about a length, an area, a volume, money or time, the answer has a unit, and the unit is part of the answer. Area is measured in square units, cm², m², because you multiplied two lengths together.",
        why: "Units also catch errors. If a question asks for an area and your answer is in cm, you have added when you should have multiplied. If a volume comes out in cm², you have missed a dimension. The unit is a free check on the method as well as a mark.",
        example:
          "A rectangle is 8 cm by 5 cm.\n\n  Perimeter = 2(8 + 5)  = 26 cm        ← a length: cm\n  Area      = 8 × 5     = 40 cm²      ← length × length: cm²\n\nA cuboid 8 cm by 5 cm by 3 cm:\n\n  Volume    = 8 × 5 × 3 = 120 cm³     ← three lengths: cm³",
        mistake:
          "Writing 40 cm for an area. It is the commonest unit error there is, and it tells a marker you are following a formula without knowing what it produces.",
        practice: {
          prompt:
            "A student calculates the area of a circle with radius 7 cm and writes '154 cm'. Two things are wrong with the answer as written. What are they?",
          answer:
            "The unit should be cm², because area is a square measure. And unless the question said to use 22/7 or gave a degree of accuracy, 154 is a rounded value of 49π, if the question said 'in terms of π' the answer should be 49π cm².",
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
        why: "When a question says 'write down the coefficient of x²', it wants one number, with its sign. When the quadratic formula asks for a, b and c, it is asking for coefficients and a constant, and getting the sign of b wrong is the single commonest error in using that formula.",
        table: {
          caption: "Reading 3x² − 5x + 8.",
          headers: ["Part", "Value", "Note"],
          rows: [
            ["Coefficient of x²", "3", "The number attached to x²"],
            ["Coefficient of x", "−5", "The sign comes with it"],
            ["Constant term", "8", "No letter"],
            ["Number of terms", "3", "Separated by − and +"],
          ],
        },
        mistake:
          "Giving the coefficient of x in 3x² − 5x + 8 as 5. It is −5. Dropping that minus sign will later put the wrong number into the quadratic formula and produce two wrong roots from perfect arithmetic.",
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
        why: "This is the test that tells you whether 'solve' is even possible. No equals sign means nothing to solve, the instruction must be simplify, expand, factorise or evaluate instead. Knowing which object is in front of you rules out three quarters of the possible instructions immediately.",
        table: {
          caption: "Four objects, four sets of instructions.",
          headers: ["Object", "Example", "What you can be asked"],
          rows: [
            ["Expression", "3x + 5", "Simplify, expand, factorise, evaluate"],
            ["Equation", "3x + 5 = 20", "Solve"],
            ["Identity", "(a+b)² = a² + 2ab + b²", "Prove, show that, use"],
            ["Formula", "A = πr²", "Substitute, change the subject, evaluate"],
          ],
        },
        mistake:
          "Trying to solve an expression. If a student writes '3x + 5, so x = −5/3' they have invented an equals sign that was never there.",
        practice: {
          prompt:
            "Which of these can be solved: (i) 2x + 7, (ii) 2x + 7 = 15, (iii) A = πr²?",
          answer:
            "Only (ii). (i) is an expression, it can be simplified or evaluated, but there is nothing to solve. (iii) is a formula, you can substitute into it or change its subject, and you could solve it for r if you were given A, but on its own it is a rule rather than a question.",
        },
      },
      {
        id: "a-ma-lang-equals",
        title: "The equals sign, and what it does not mean",
        explain:
          "The equals sign means 'the thing on the left has the same value as the thing on the right'. It does not mean 'and then' or 'the answer is next'. Using it as a running commentary produces lines that are simply false.",
        why: "Markers read your working as mathematics, not as notes. A line that says 12 + 3 = 15 × 2 = 30 is claiming that 15 equals 30, and a candidate who writes that routinely will eventually be penalised for it, and, more importantly, will eventually be confused by their own working.",
        example:
          "WRONG, a running equals:\n\n  12 + 3 = 15 × 2 = 30 − 4 = 26\n\n  This line claims 15 = 30 and 30 = 26. Both are false.\n\n\nRIGHT, one statement per line:\n\n  12 + 3 = 15\n  15 × 2 = 30\n  30 − 4 = 26",
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
          "Any question involving shape, distance, direction, sharing or comparison can be drawn, and drawing it turns a paragraph of words into something you can read at a glance.",
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
          "Before writing a final answer, ask whether it is roughly the size it should be. A discount that makes something more expensive, a percentage above 100 for a part of a whole, a triangle side longer than the hypotenuse, each of these is visible without checking any working.",
        why: "A size check catches the errors that arithmetic checking misses, because it tests the METHOD rather than the calculation. Dividing when you should have multiplied gives an answer that is wrong by a factor of hundreds, and that is obvious the moment you look at it.",
        table: {
          caption: "Answers that announce their own errors.",
          headers: ["Question asked for", "Answer that must be wrong", "What went wrong"],
          rows: [
            ["A part of a whole, as a %", "Over 100%", "Divided the wrong way round"],
            ["Change from ₦1,000", "More than ₦1,000", "Added instead of subtracting"],
            ["A length in metres", "0.000004", "Converted the wrong way"],
            ["The hypotenuse", "Shorter than a shorter side", "Subtracted in Pythagoras"],
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
        "Note any question that specifies units, accuracy, or a form such as 'in terms of π'.",
        "Note any part (b) that begins with 'hence'.",
      ],
      closing:
        "Five minutes on this will do more for your next paper than an hour of practice questions, because it fixes the errors that have nothing to do with whether you can do the mathematics.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
