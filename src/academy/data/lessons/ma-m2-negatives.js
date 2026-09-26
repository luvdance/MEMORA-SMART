/**
 * MATHEMATICS · MONTH 2 · MODULE 3 · DIRECTED NUMBERS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Sign errors are the single largest source of lost marks in school algebra,
 * and they are almost never caused by not knowing the rules. They are caused
 * by knowing the rules as four memorised lines that look interchangeable, and
 * then reaching for the multiplying rules in the middle of an addition.
 *
 * So this module does not begin with the rules. It begins with the number
 * line, treats every operation as a movement along it, and only then writes
 * down the rules, at which point they describe something the student has
 * already seen rather than replacing it.
 *
 * Month 1 Module 3 introduced what a negative number IS. This module is about
 * calculating with them.
 */

export const SECTION_ID = "ma-s2-negatives";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l25-position",
    moduleId: "ma-m2-negatives",
    sectionId: SECTION_ID,
    order: 1,
    title: "Negatives as Position",
    subtitle: "The line, the order, and distance from zero",
    estimatedMinutes: 13,
    intro:
      "Before any arithmetic, the picture. Every rule in this module is a statement about a movement along a line, and a student who can see the line rarely gets a sign wrong.",

    atoms: [
      {
        id: "a-ma-dn-line",
        title: "The line, in both directions",
        explain:
          "Zero sits in the middle. Positive numbers run to the right and negative numbers run to the left, and the line continues forever both ways. A number's sign says which side of zero it is on.",
        origin:
          "Drawing the numbers as a line running both ways, with the negatives to the left, is due to the Englishman John Wallis, in his Treatise of Algebra of 1685. That is remarkably late. Negative numbers had existed for centuries by then and were still widely distrusted, and part of Wallis' purpose was to make them believable by giving them somewhere to live. Once you can point at a negative number, it is much harder to argue that it is not there. The picture did more to settle the argument than any amount of algebra.",
        why: "Almost every question about directed numbers becomes easy once it is placed on a line. The line is not a teaching aid to be discarded later; it is the definition, and professionals sketch it when a sign gets confusing.",
        example:
          "   <--+----+----+----+----+----+----+----+-->\n     -3   -2   -1    0    1    2    3\n\n     negative        zero        positive\n\n  Zero is neither positive nor negative. It is the point the\n  two directions are measured from.",
        analogy:
          "A lift in a tall building. Ground is zero, the offices above are positive, the car parks below are negative. Nobody is confused by floor minus two.",
      },
      {
        id: "a-ma-dn-ordering",
        title: "Further right is larger, always",
        explain:
          "One rule decides every comparison: the number further right on the line is the larger one. That makes every negative smaller than every positive, and it makes −18 smaller than −3.",
        why: "This is the first place where reading the digits gives the wrong answer, and the habit of reading digits instead of position is what produces sign errors for years afterwards. Fixing it here is cheap.",
        example:
          "   <--+-----+-----+-----+-----+-----+-->\n    -18   -10    -3     0     3    10\n\n  Smallest first:  -18,  -10,  -3,  0,  3,  10\n\n  Debt makes it concrete. Owing ₦18,000 is a worse position\n  than owing ₦3,000, so it is the smaller balance.",
        mistake:
          "Ordering by the size of the digits. It gives the right answer for positives and exactly the wrong answer for negatives, which is why it survives so long before being noticed.",
        drill: {
          skill: "L1-N6.1",
          count: 3,
          intro:
            "Three ordering questions. Read whether the question asks for ascending or descending before you start, and picture the line rather than the digits.",
        },
      },
      {
        id: "a-ma-dn-distance",
        title: "Distance from zero is a different question from size",
        explain:
          "The distance of a number from zero, ignoring direction, is called its absolute value. The absolute value of −9 is 9, and so is the absolute value of 9. Distance is never negative.",
        why: "Size and distance come apart for negatives, and questions exploit it. −9 is further from zero than 4, and 4 is still the larger number. Keeping the two questions separate prevents a specific and common confusion.",
        table: {
          caption: "Two questions about the same numbers.",
          headers: ["Number", "Distance from zero", "Larger of the pair?"],
          rows: [
            ["−9", "9", "No"],
            ["4", "4", "Yes"],
            ["−2", "2", "Yes"],
            ["−7", "7", "No"],
          ],
          note: "Rows one and two are one pair; rows three and four are another. In both, the further number from zero is the smaller one, because both are negative.",
        },
        practice: {
          prompt: "Which is further from zero, −11 or 6? Which is the larger number?",
          answer:
            "−11 is further from zero, at a distance of 11 against 6. But 6 is the larger number, because it sits further right on the line. Distance and size are different questions and negatives are where they separate.",
        },
      },
      {
        id: "a-ma-dn-opposites",
        title: "Opposites",
        explain:
          "Every number has an opposite: the number the same distance from zero on the other side. The opposite of 7 is −7, the opposite of −7 is 7, and the opposite of 0 is 0.",
        origin:
          "You met the Nine Chapters on the Mathematical Art in Month 1, where Chinese mathematicians were calculating with negatives two thousand years ago. Here is how they wrote them: with counting rods of two colours on a board, one colour for a gain and the other for a debt, so the sign was a physical property of the piece rather than a mark on the page. Adding a red rod and a black rod of the same size means removing both, which is exactly what it means to say a number and its opposite add to zero. The idea we are calling opposite was, for them, something you could pick up.",
        why: "The opposite is the additive inverse from Lesson 23, met again in a picture. Adding a number to its opposite always gives zero, and that single fact is what makes subtraction of directed numbers work in the next lesson.",
        example:
          "   <--+-----+-----+-----+-----+-----+-->\n     -7          0           7\n      |<--- 7 --->|<--- 7 --->|\n\n  Same distance, opposite directions.\n\n    7 + (−7) = 0        the additive inverse, from Lesson 23\n\n  Two minus signs in front of a number cancel for the same\n  reason: the opposite of the opposite is where you started.\n\n    −(−7) = 7",
      },
      {
        id: "a-ma-dn-contexts",
        title: "Where the sign carries meaning",
        explain:
          "In a real situation the minus sign is not a mistake, it is a direction. Below freezing, below sea level, overdrawn, a loss, a fall. Reading the sign as direction makes the arithmetic follow.",
        origin:
          "Negative numbers reached ordinary life through instruments and accounts rather than through mathematics. Double entry bookkeeping, set out in print by Luca Pacioli in Venice in 1494, needed a systematic way to record what was owed as against what was held, and merchants were comfortable with debts long before mathematicians were comfortable with negatives. Temperature scales came later: Anders Celsius set his zero at the freezing point of water in 1742, which immediately created everyday readings below zero in most of the world, and made the negative side of the line something people simply read off a thermometer.",
        why: "Word problems with negatives are usually easy once the context is translated. The trouble comes from students treating the minus sign as something to be removed rather than as part of the quantity.",
        table: {
          caption: "The same sign, five meanings.",
          headers: ["Situation", "Positive means", "Negative means"],
          rows: [
            ["Temperature", "Above freezing", "Below freezing"],
            ["Altitude", "Above sea level", "Below sea level"],
            ["Bank balance", "In credit", "Overdrawn"],
            ["Business", "Profit", "Loss"],
            ["Change over time", "A rise", "A fall"],
          ],
          note: "In every row, the sign is doing the same job: naming which of two opposite directions the quantity runs in.",
        },
        mistake:
          "Dropping the sign because the answer looks wrong with it. A temperature of −4 degrees is a correct and ordinary answer, and so is a balance of −12,500.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l26-add-subtract",
    moduleId: "ma-m2-negatives",
    sectionId: SECTION_ID,
    order: 2,
    title: "Adding and Subtracting Directed Numbers",
    subtitle: "Every calculation is a start and a movement",
    estimatedMinutes: 15,
    intro:
      "There is one idea in this lesson and it covers every case: start somewhere on the line, then move. Adding moves you one way, subtracting moves you the other, and a negative number reverses whichever direction you were about to go.",

    atoms: [
      {
        id: "a-ma-dn-movement",
        title: "Adding is a movement",
        explain:
          "To work out 3 + 4, start at 3 and move 4 to the right. To work out 3 + (−4), start at 3 and move 4 to the left, because the number being added is negative and points the other way.",
        why: "Treating addition as movement handles every case with one idea, including the ones that feel like exceptions. There is no separate rule for adding a negative; the negative simply reverses the direction of the move.",
        example:
          "  3 + 4:  start at 3, move 4 right\n\n   <--+----+----+----+----+----+----+----+-->\n      1    2    3    4    5    6    7\n                ●------------------>●\n                3                   7\n\n  3 + (−4):  start at 3, move 4 LEFT\n\n   <--+----+----+----+----+----+----+----+-->\n     -2   -1    0    1    2    3    4\n           ●<--------------------●\n          -1                     3",
        analogy:
          "Walking along a road with a kilometre marker at zero. Adding a positive walks you forward; adding a negative walks you back. You are still walking.",
      },
      {
        id: "a-ma-dn-subtract",
        title: "Subtracting is the movement reversed",
        explain:
          "Subtracting a number means moving the opposite way to the way adding it would move you. So 3 − 4 moves 4 to the left, and 3 − (−4) moves 4 to the right.",
        why: "This is the honest reason subtracting a negative adds, and it is worth having rather than the rhyme about two minuses. The subtraction reverses the direction, and the negative reverses it again, so you end up going forwards.",
        example:
          "  3 − 4:      start at 3, move 4 left       →  −1\n  3 − (−4):   start at 3, reverse twice      →   7\n\n   <--+----+----+----+----+----+----+----+-->\n      1    2    3    4    5    6    7\n                ●------------------>●\n                3                   7\n\n  Two reversals put you back facing forwards, which is why\n  3 − (−4) is 3 + 4.",
        mistake:
          "Learning two minuses make a plus as a rule with no picture behind it. Students then apply it to −3 − 4, get +7, and cannot see why that is wrong. Here the two signs are not together: it is start at −3 and move 4 further left, giving −7.",
      },
      {
        id: "a-ma-dn-two-signs",
        title: "When two signs meet",
        explain:
          "When a plus or minus sits directly in front of a signed number, the two combine. Same signs give a plus, different signs give a minus. This applies only when the two signs are next to each other.",
        origin:
          "The rules for combining signs were written down by Brahmagupta in India in 628, and he explained them in terms of money, which is still the clearest way to hold them. In his wording a positive is a fortune and a negative is a debt, and he states plainly that a debt subtracted from zero is a fortune, and that the product of two debts is a fortune. That last one is the rule students find hardest to believe, and it was stated as a rule of business arithmetic thirteen hundred years ago.",
        why: "The condition matters more than the rule. In −3 − 4 the signs are not adjacent; the first belongs to the 3 and the second is the operation. In 3 − (−4) they are adjacent, separated only by a bracket, and they do combine.",
        table: {
          caption: "Only adjacent signs combine.",
          headers: ["Written", "Signs adjacent?", "Becomes", "Answer"],
          rows: [
            ["3 + (+4)", "Yes", "3 + 4", "7"],
            ["3 + (−4)", "Yes", "3 − 4", "−1"],
            ["3 − (+4)", "Yes", "3 − 4", "−1"],
            ["3 − (−4)", "Yes", "3 + 4", "7"],
            ["−3 − 4", "No", "unchanged", "−7"],
          ],
          note: "The last row is the one that catches people. There is no bracket, so nothing combines.",
        },
        drill: {
          skill: "L1-N6.2",
          count: 4,
          intro:
            "Four calculations. For each one, say where you start and which way you move before you write anything down.",
        },
      },
      {
        id: "a-ma-dn-strategy",
        title: "A reliable order of work",
        explain:
          "Deal with adjacent signs first, so every calculation becomes a plain addition or subtraction. Then find your starting point, then move. Three steps, in that order, every time.",
        why: "Most sign errors happen because two decisions are being made at once. Separating the sign work from the movement work removes the step where they interfere with each other, and it costs about two seconds.",
        example:
          "  Work out  −5 − (−8) + (−2)\n\n  Step 1, combine adjacent signs:\n\n    −5 + 8 − 2\n\n  Step 2, start at −5.\n\n  Step 3, move 8 right, then 2 left:\n\n    −5 + 8 = 3\n     3 − 2 = 1\n\n  Answer: 1",
        practice: {
          prompt: "Work out −7 − (−3) − 6, showing the two steps separately.",
          answer:
            "Combine the adjacent signs first: −7 + 3 − 6. Then start at −7, move 3 right to −4, then 6 left to −10. The answer is −10. Doing the signs and the movement at the same time is where the errors come from.",
        },
      },
      {
        id: "a-ma-dn-context-arith",
        title: "The same arithmetic, in context",
        explain:
          "Temperature falling, a balance being paid into, an aircraft descending. Each of these is a start and a movement, and translating the words into those two things is the whole of the work.",
        why: "Word problems with negatives are rarely hard arithmetic. They are reading problems, and this is the module where the reading habit from Month 1 gets its first real workout.",
        example:
          "  \"At midnight the temperature was −6 °C. By dawn it had\n   fallen a further 9 degrees. What was it at dawn?\"\n\n  Start:     −6\n  Movement:  fallen means left, by 9\n\n    −6 − 9 = −15\n\n  Answer: −15 °C\n\n\n  \"An account is overdrawn by ₦8,400. ₦12,000 is paid in.\"\n\n  Start:     −8,400\n  Movement:  paid in means right, by 12,000\n\n    −8,400 + 12,000 = 3,600\n\n  Answer: ₦3,600 in credit.",
        mistake:
          "Ignoring the starting sign and answering with the movement. Paying ₦12,000 into an overdrawn account does not leave ₦12,000 in it.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l27-multiply-divide",
    moduleId: "ma-m2-negatives",
    sectionId: SECTION_ID,
    order: 3,
    title: "Multiplying and Dividing Directed Numbers",
    subtitle: "Why two negatives really do make a positive",
    estimatedMinutes: 15,
    intro:
      "The rule is short: same signs give a positive, different signs give a negative. Almost everybody knows it and almost nobody can say why. The why is worth ten minutes, because a rule you can justify is a rule you do not misapply.",

    atoms: [
      {
        id: "a-ma-dn-sign-first",
        title: "Sign first, digits second",
        explain:
          "Work out the sign of the answer before touching the numbers, then multiply or divide the digits as usual. Two separate decisions, taken one at a time.",
        why: "Doing both at once is where errors come from, exactly as in the previous lesson. Deciding the sign first also means that if the digits go wrong the sign is still right, and partial credit in an exam is usually awarded on that basis.",
        example:
          "  (−6) × 7\n\n  Sign:    different signs   →  negative\n  Digits:  6 × 7 = 42\n  Answer:  −42\n\n\n  (−48) ÷ (−6)\n\n  Sign:    same signs        →  positive\n  Digits:  48 ÷ 6 = 8\n  Answer:  8",
        table: {
          caption: "The four cases, for both operations.",
          headers: ["Signs", "Result", "Multiplication", "Division"],
          rows: [
            ["+ and +", "positive", "3 × 4 = 12", "12 ÷ 3 = 4"],
            ["+ and −", "negative", "3 × (−4) = −12", "12 ÷ (−3) = −4"],
            ["− and +", "negative", "(−3) × 4 = −12", "(−12) ÷ 3 = −4"],
            ["− and −", "positive", "(−3) × (−4) = 12", "(−12) ÷ (−3) = 4"],
          ],
          note: "Division follows the same rules as multiplication, because dividing is multiplying by a reciprocal.",
        },
      },
      {
        id: "a-ma-dn-neg-times-pos",
        title: "Why a negative times a positive is negative",
        explain:
          "Multiplication is repeated addition. (−3) × 4 means four lots of −3, which is −3 added to itself four times, and that lands you at −12.",
        why: "This half of the rule needs no special argument, and getting it from repeated addition means the other half can be argued from a pattern rather than asserted.",
        example:
          "  (−3) × 4  =  (−3) + (−3) + (−3) + (−3)\n\n   <--+-----+-----+-----+-----+-->\n    -12    -9    -6    -3     0\n      ●<----●<----●<----●<----●\n\n  Four moves of 3 to the left, starting from zero.\n  You land on −12.",
      },
      {
        id: "a-ma-dn-neg-times-neg",
        title: "Why a negative times a negative is positive",
        explain:
          "Look at what happens to the answers as the multiplier drops by one each time. The answers rise by 3 each time, and the pattern does not stop when the multiplier crosses zero.",
        origin:
          "Europe fought this rule for centuries. Negatives were called absurd numbers and fictitious numbers, Descartes called negative solutions false roots, and as late as the 1800s serious British mathematicians were still publishing objections to them. What finally settled it was not a better picture but an argument from the rules you learned in the previous module. If we want the distributive law to keep working when negatives are allowed in, then a negative multiplied by a negative is FORCED to be positive. There is no choice about it. That is the answer to the question students always ask here: it is not a convention somebody picked, it is the only value that lets the rest of arithmetic stay consistent.",
        why: "This is the argument worth carrying, because it is the one that makes the rule feel inevitable rather than arbitrary. The pattern is forced: if the answers are to keep rising by 3, then (−3) × (−1) has to be 3.",
        example:
          "  Watch the right hand column as the multiplier falls:\n\n    (−3) ×  3  =  −9\n    (−3) ×  2  =  −6      +3\n    (−3) ×  1  =  −3      +3\n    (−3) ×  0  =   0      +3\n    (−3) × −1  =   3      +3     ← the pattern continues\n    (−3) × −2  =   6      +3\n    (−3) × −3  =   9      +3\n\n  Nothing special happens at zero. For arithmetic to stay\n  consistent, the answers must keep rising, so the products\n  below the line have to be positive.",
        analogy:
          "Taking away a debt. If someone cancels three debts of ₦4,000 each, you are ₦12,000 better off. Removing something negative three times leaves you positive.",
        drill: {
          skill: "L1-N6.3",
          count: 4,
          intro:
            "Four calculations. Decide the sign before you touch the digits, and say to yourself which of the four cases it is.",
        },
      },
      {
        id: "a-ma-dn-powers",
        title: "Powers of negative numbers",
        explain:
          "A negative number raised to an even power is positive, and raised to an odd power is negative. The signs cancel in pairs, so an even number of them leaves none.",
        why: "This becomes important in Month 6 with quadratics and in Month 9 with curve sketching. It also explains why (−2)² and −2² are different, which is one of the most common calculator errors there is.",
        example:
          "  (−2)¹ = −2\n  (−2)² = (−2) × (−2) = 4           two signs cancel\n  (−2)³ = 4 × (−2) = −8             one left over\n  (−2)⁴ = −8 × (−2) = 16            they cancel again\n\n  Even power → positive.  Odd power → negative.\n\n\n  And the one that catches everybody:\n\n    (−2)²  =  4        the whole of −2 is squared\n    −2²    =  −4       only the 2 is squared, then negated\n\n  The brackets are not decoration. They decide the answer.",
        mistake:
          "Typing −2² into a calculator expecting 4. Most calculators apply the power before the minus sign and return −4, which is correct. If you mean the square of negative two, the brackets are compulsory.",
      },
      {
        id: "a-ma-dn-two-rule-sets",
        title: "The adding rules are not the multiplying rules",
        explain:
          "Same signs give a positive is a rule about MULTIPLYING. It is not a rule about adding. Adding two negatives gives a negative, every time.",
        why: "This is the single most damaging confusion in the topic. A student who has compressed everything into two minuses make a plus will write −3 − 4 = 7, and will do it consistently. The fix is to know which rule belongs to which operation.",
        table: {
          caption: "The two sets, side by side, so they stop being mixed up.",
          headers: ["Calculation", "Operation", "Answer", "Why"],
          rows: [
            ["−3 − 4", "Adding a negative", "−7", "Start at −3, move 4 further left"],
            ["(−3) × (−4)", "Multiplying", "12", "Same signs, so positive"],
            ["−3 + (−4)", "Adding a negative", "−7", "Same as the first row"],
            ["(−3) ÷ (−4)", "Dividing", "0.75", "Same signs, so positive"],
          ],
          note: "Rows one and three are identical calculations written two ways. Rows two and four use a completely different rule.",
        },
        practice: {
          prompt: "Work out (i) −5 − 3, (ii) (−5) × (−3), (iii) −5 + (−3), and say which rule each one uses.",
          answer:
            "(i) −8, using movement: start at −5 and go 3 further left. (ii) 15, using the sign rule for multiplying: same signs give positive. (iii) −8, which is the same calculation as (i) written differently. Two of the three are additions and only one is a multiplication, which is why the answers split two to one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l28-in-use",
    moduleId: "ma-m2-negatives",
    sectionId: SECTION_ID,
    order: 4,
    title: "Directed Numbers in Use",
    subtitle: "Substituting, checking, and the brackets that save you",
    estimatedMinutes: 14,
    intro:
      "The rules are in place. This lesson is about using them without losing signs: where negatives turn up in the rest of the course, the bracket habit that prevents most errors, and a mixed review of the whole foundation.",

    atoms: [
      {
        id: "a-ma-dn-brackets",
        title: "Always substitute in brackets",
        explain:
          "When you put a negative value into an expression, write it inside brackets as you substitute. To substitute means simply to put a number in place of a letter, and nothing more. It takes a second and it prevents the commonest sign error there is.",
        why: "Without the brackets, 3x² with x = −2 gets written as 3 × −2², and the square then attaches only to the 2. With the brackets it is 3 × (−2)², which is what was meant. The habit costs nothing and removes an entire category of mistake.",
        example:
          "  Evaluate 3x² − 4x when x = −2\n\n  Substitute WITH brackets:\n\n    3(−2)² − 4(−2)\n  = 3(4) − (−8)\n  = 12 + 8\n  = 20\n\n  Substitute without them, and watch it go wrong:\n\n    3 × −2² − 4 × −2\n  = 3 × −4 + 8              ← the square hit only the 2\n  = −12 + 8\n  = −4                       wrong",
        mistake:
          "Substituting a negative without brackets. It is the largest single cause of sign errors in Month 4 and Month 6, and the bracket habit removes it entirely.",
      },
      {
        id: "a-ma-dn-checking",
        title: "Checking a sign without redoing the work",
        explain:
          "Ask whether the answer should be above or below zero before you calculate, then check the answer against that. A temperature that fell cannot end up higher. An overdrawn account paid into by less than the debt cannot end up in credit.",
        why: "Sign errors produce answers that are numerically right and directionally wrong, so checking the arithmetic will not find them. Only a check against the situation will, and it takes about three seconds.",
        table: {
          caption: "Answers that announce their own sign error.",
          headers: ["The situation", "An answer that must be wrong"],
          rows: [
            ["A temperature falls from −4", "Anything above −4"],
            ["₦5,000 paid into an account overdrawn by ₦9,000", "A positive balance"],
            ["A quantity decreases by more than it started with", "A positive result"],
            ["A negative number squared", "A negative answer"],
            ["A negative divided by a negative", "A negative answer"],
          ],
        },
        drill: {
          skill: "L1-N6.4",
          count: 3,
          intro:
            "Three problems in context. For each one, decide before calculating whether the answer should be above or below zero.",
        },
      },
      {
        id: "a-ma-dn-where-next",
        title: "Where negatives are waiting for you",
        explain:
          "Directed numbers are not a topic that finishes. They run through coordinates, gradients, solving equations, quadratic roots, vectors and rates of change.",
        why: "Every one of those topics is harder for a student who is still uncertain about signs, and the difficulty will appear to belong to the new topic rather than to this one. That is the compounding described in Month 1, and this module is one of the places to stop it.",
        table: {
          caption: "The same skill, later.",
          headers: ["Topic", "How negatives appear", "Month"],
          rows: [
            ["Algebraic expressions", "Negative coefficients and substitution", "4"],
            ["Coordinates", "The other three quadrants", "5"],
            ["Gradient", "A line sloping downwards", "5"],
            ["Simultaneous equations", "Subtracting a negative during elimination", "6"],
            ["Quadratic roots", "Roots below zero, and the discriminant", "7"],
            ["Rates of change", "A quantity falling rather than rising", "9"],
          ],
        },
      },
      {
        id: "a-ma-dn-common-errors",
        title: "The four errors worth watching for",
        explain:
          "Almost every sign mistake is one of four things: using the multiplying rule on an addition, dropping a minus while copying, substituting without brackets, or misreading which of two negatives is larger.",
        why: "Naming your own commonest error is more useful than trying to be careful in general. Most students make one of these four far more often than the others, and knowing which one turns vague carefulness into a specific check.",
        table: {
          caption: "Four errors, and the check that catches each.",
          headers: ["The error", "What it looks like", "The check"],
          rows: [
            ["Wrong rule set", "−3 − 4 = 7", "Is this adding or multiplying?"],
            ["Dropped sign", "−7 copied as 7 on the next line", "Compare each line with the one above"],
            ["No brackets", "3 × −2² giving −12", "Did I bracket every substituted value?"],
            ["Misread order", "−18 called larger than −3", "Which is further right on the line?"],
          ],
        },
        practice: {
          prompt:
            "Look back at any marked work you have with sign errors in it. Which of the four is yours?",
          answer:
            "Most people find that one of the four accounts for the great majority of their sign mistakes. Once you know which, the check becomes specific rather than a general instruction to be careful, and specific checks are the ones people actually carry out.",
        },
      },
      {
        id: "a-ma-dn-foundation-review",
        title: "The whole foundation, mixed",
        explain:
          "A drill across everything in Months 1 and 2: place value, rounding, the four operations, BODMAS, factors, and directed numbers, in no particular order.",
        why: "This is the last review before Month 3 begins on fractions, and fractions lean on almost all of it. Meeting the material mixed, after a gap, is the test of whether it is actually there.",
        drill: {
          review: [
            "L1-N6.2",
            "L0-N2.4",
            "L1-N6.3",
            "L0-N3.1",
            "L0-N1.4",
            "L0-N2.3",
          ],
          count: 6,
          intro:
            "Six questions from across both foundation months. Identify what each one is asking before you begin, because nothing here tells you which topic it belongs to.",
        },
      },
    ],

    task: {
      title: "Before you start Month 3",
      intro:
        "Month 3 is fractions, and fractions use almost everything from these two months at once. Check you are ready, with a pen:",
      prompts: [
        "Work out −8 − (−5) + (−4), showing the sign step separately from the movement step.",
        "Evaluate 2x² − 5x when x = −3, substituting in brackets.",
        "Find the HCF and the LCM of 24 and 36, then use the HCF to simplify 24/36 in one step.",
        "Evaluate 40 ÷ 8 × 2 + 3² − 11, naming the BODMAS rank at each stage.",
      ],
      closing:
        "The third one is the direct bridge. A common denominator is an LCM and a simplified fraction is a division by the HCF, so if that question was comfortable, Month 3 will be too.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
