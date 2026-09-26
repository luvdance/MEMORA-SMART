/**
 * MATHEMATICS · MONTH 2 · MODULE 2 · HOW THE OPERATIONS BEHAVE
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This is the most quietly important module in the foundation, and it is the
 * one most often skipped.
 *
 * Commutative, associative and distributive look like vocabulary. They are
 * not. They are the rules that decide what you are ALLOWED to do to an
 * expression, and every algebraic move in the next seven months is one of
 * them being applied. Collecting like terms is the distributive law read
 * backwards. Expanding a bracket is the distributive law read forwards.
 * Solving an equation is inverse operations plus the identity element.
 *
 * A student who meets these as named facts about numbers, where they are
 * obvious, meets algebra later as the same facts about letters. A student who
 * skips them meets algebra as four hundred unrelated instructions.
 */

export const SECTION_ID = "ma-s2-properties";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l21-order-grouping",
    moduleId: "ma-m2-properties",
    sectionId: SECTION_ID,
    order: 1,
    title: "Does the Order Matter?",
    subtitle: "Commutative and associative, and the two operations that obey neither",
    estimatedMinutes: 14,
    intro:
      "3 + 5 and 5 + 3 both give 8. So do 3 × 5 and 5 × 3. But 3 − 5 and 5 − 3 are nowhere near each other. This lesson is about which operations you may reorder and regroup, and which will punish you for trying.",

    atoms: [
      {
        id: "a-ma-pr-commutative",
        title: "Commutative: order does not matter",
        explain:
          "An operation is commutative if swapping the two numbers leaves the answer unchanged. Addition is commutative and so is multiplication. Subtraction and division are not.",
        origin:
          "Here is the odd thing about these names: the facts are as old as counting, and the names are about two hundred years old. Nobody needed a word for 3 + 5 = 5 + 3 while it was the only kind of arithmetic there was. The words were coined in the early 1800s, commutative and distributive by the Frenchman Francois Servois in 1814, precisely because mathematicians had begun inventing systems where these rules FAIL, and you cannot discuss which rules a system obeys until the rules have names. So the naming is not bureaucracy. It is the moment the rules themselves became the subject rather than the numbers they applied to.",
        why: "This is the property that halves the times tables, because knowing 7 × 8 gives you 8 × 7 for free. It is also what lets you reorder a long sum into an easier order, which is most of mental arithmetic.",
        table: {
          caption: "Four operations, tested.",
          headers: ["Operation", "Commutative?", "Evidence"],
          rows: [
            ["Addition", "Yes", "3 + 5 = 8 and 5 + 3 = 8"],
            ["Multiplication", "Yes", "3 × 5 = 15 and 5 × 3 = 15"],
            ["Subtraction", "No", "3 − 5 = −2 but 5 − 3 = 2"],
            ["Division", "No", "12 ÷ 4 = 3 but 4 ÷ 12 = 1/3"],
          ],
          note: "One counterexample is enough to settle a No. That is a habit worth noticing now, because it is how Month 9 proves things.",
        },
        example:
          "  Why multiplication is commutative, as a picture:\n\n    3 rows of 5             5 rows of 3\n\n    ● ● ● ● ●               ● ● ●\n    ● ● ● ● ●               ● ● ●\n    ● ● ● ● ●               ● ● ●\n                            ● ● ●\n                            ● ● ●\n\n  Same dots. Turn the page and one becomes the other.\n  Nothing has been added or removed, so the count is the same.",
        mistake:
          "Assuming subtraction must be commutative because addition is. Related operations do not inherit each other's properties, and this is the source of a great many sign errors later.",
      },
      {
        id: "a-ma-pr-associative",
        title: "Associative: grouping does not matter",
        explain:
          "An operation is associative if it does not matter which pair you do first. (2 + 3) + 4 and 2 + (3 + 4) both give 9. Addition and multiplication are associative. Subtraction and division are not.",
        origin:
          "The word associative was introduced by the Irish mathematician William Rowan Hamilton in the 1840s, and he had a strong reason to need it. In 1843 he invented a system of numbers, now called quaternions, in which multiplying a by b does not give the same result as multiplying b by a. The story is that the idea came to him while walking along a Dublin canal and he scratched the rule into the stone of Broome Bridge so as not to lose it. Once a useful system existed where order mattered, the ordinary case needed a name too, so that you could say which one you were working in. Quaternions are not a curiosity either: they are what computer graphics and spacecraft use today to handle rotation.",
        why: "Associativity is why a long addition can be done in any convenient order, and why you can write 2 + 3 + 4 with no brackets at all. Without it, every sum with three numbers in it would need brackets to be unambiguous.",
        example:
          "  Addition is associative:\n\n    (2 + 3) + 4  =  5 + 4  =  9\n    2 + (3 + 4)  =  2 + 7  =  9     same\n\n  Subtraction is not:\n\n    (10 − 4) − 3  =  6 − 3  =  3\n    10 − (4 − 3)  =  10 − 1 =  9     different\n\n  That is exactly why BODMAS says to work subtraction from\n  left to right. Without a rule, 10 − 4 − 3 would be ambiguous.",
        mistake:
          "Confusing commutative with associative. Commutative is about the ORDER of two numbers. Associative is about which PAIR you group first. An operation can in principle have one without the other.",
      },
      {
        id: "a-ma-pr-mental",
        title: "Using both to calculate faster",
        explain:
          "Together, the two properties let you reorder and regroup any addition or any multiplication into whatever arrangement is easiest. That is not a trick; it is the properties being used deliberately.",
        why: "Most people who are quick at mental arithmetic are not calculating faster. They are rearranging first into something easier, and the rearranging is legal precisely because of these two properties.",
        example:
          "  You are totalling up a market list:\n\n    ₦170   ₦460   ₦30   ₦40\n\n  Straight down the list is hard work. So move\n  the friendly pairs next to each other first:\n\n    (₦170 + ₦30) + (₦460 + ₦40)\n  =      ₦200      +      ₦500\n  =  ₦700\n\n  Moving them is commutativity. Choosing which\n  pair to add first is associativity. You have\n  been doing both for years without the names.\n\n\n  THE SAME MOVE WHEN MULTIPLYING:\n\n  25 crates, 17 in each, in 4 stores.\n\n    25 × 17 × 4    in that order is unpleasant\n\n    (25 × 4) × 17\n  =    100    × 17\n  =  1,700\n\n  Nothing was skipped and nothing was rounded.\n  The 25 and the 4 were simply put together\n  first, because 100 is easy to multiply by.\n\n  Neither of these is a trick. Both are the two\n  properties of this lesson, used on purpose.",
        practice: {
          prompt: "Work out 8 × 37 × 125 in your head, by rearranging first.",
          answer:
            "Pair the 8 with the 125, since 8 × 125 = 1,000. Then 1,000 × 37 = 37,000. Done in one step. Taken left to right it is 8 × 37 = 296, then 296 × 125, which is far harder for no reason.",
        },
        drill: {
          skill: "L0-N2.1",
          count: 3,
          intro:
            "Three table facts. Commutativity is why you are not learning 144 of these: 7 x 8 and 8 x 7 are one fact wearing two hats, which cuts the table almost in half.",
        },
      },
      {
        id: "a-ma-pr-why-fail",
        title: "Why subtraction and division fail both tests",
        explain:
          "Subtraction and division are directional. Subtracting asks how far down from a starting point, and dividing asks how many of these fit into that. Swap the two numbers and you have asked a different question.",
        why: "Understanding why they fail is more useful than memorising that they do, because it tells you what to do instead: rewrite a subtraction as an addition of a negative, and a division as a multiplication by a reciprocal, which is that number turned upside down as a fraction and is explained properly in Lesson 23. Both of those turn a badly behaved operation into a well behaved one.",
        example:
          "  Rewriting to get the properties back:\n\n    10 − 4 − 3\n  = 10 + (−4) + (−3)        now it is all addition\n  = commutative and associative again\n  = (10 − 3) − 4 if you prefer\n  = 3                        same answer either way\n\n    12 ÷ 4\n  = 12 × 1/4                 now it is multiplication\n\n  This rewriting is what makes algebra manageable, and it is\n  used constantly from Month 4 onwards.",
        analogy:
          "Walking three streets north then two east gets you to the same place as two east then three north. Walking three streets north then reversing is not the same as reversing then walking north.",
      },
      {
        id: "a-ma-pr-in-algebra",
        title: "Where these two show up in algebra",
        explain:
          "When you collect like terms and write 3x + 5x as 5x + 3x without worrying, that is commutativity. When you write 2 + 3 + x with no brackets, that is associativity. They are used silently in almost every line of algebra you will write.",
        why: "Naming them now means that later, when a question asks why a step was allowed, you have an answer. In Month 9 that matters directly: university mathematics begins by stating these properties explicitly, because it studies systems where some of them fail.",
        table: {
          caption: "The same property, in arithmetic and in algebra.",
          headers: ["Property", "With numbers", "With letters"],
          rows: [
            ["Commutative addition", "3 + 5 = 5 + 3", "x + y = y + x"],
            ["Commutative multiplication", "3 × 5 = 5 × 3", "xy = yx"],
            ["Associative addition", "(2 + 3) + 4 = 2 + (3 + 4)", "(x + y) + z = x + (y + z)"],
            ["Associative multiplication", "(2 × 3) × 4 = 2 × (3 × 4)", "(xy)z = x(yz)"],
          ],
          note: "The right hand column is the reason the left hand column was worth naming.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l22-distributive",
    moduleId: "ma-m2-properties",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Distributive Law",
    subtitle: "The single most used rule in the whole of algebra",
    estimatedMinutes: 15,
    intro:
      "If there is one property worth knowing by name, it is this one. Expanding brackets is this law. Factorising is this law backwards. Long multiplication is this law in a layout. Collecting like terms is this law again. Learn it once here and four topics stop being separate.",

    atoms: [
      {
        id: "a-ma-pr-distributive",
        title: "What the law says",
        explain:
          "Multiplying a sum gives the same answer as multiplying each part and then adding. In symbols, a(b + c) = ab + ac. The multiplication is distributed across the addition.",
        origin:
          "This law is in Euclid, and it is stated there as a fact about rectangles rather than about numbers. Book two of the Elements says that if one of two lines is cut into pieces, the rectangle made by the two lines equals the sum of the rectangles made by the whole line and each piece. Read that slowly and it is exactly a(b + c) = ab + ac, with a as one side and the pieces b and c along the other. The Greeks had no algebraic notation, so they did their algebra in geometry, and the picture came first. The symbols came nearly two thousand years later and say the same thing more briefly.",
        why: "It is the only property that connects two different operations, and that is exactly why it is the useful one. Commutativity and associativity tell you what you may do within one operation; this one tells you how multiplication and addition interact.",
        example:
          "  3 × (4 + 5)\n\n  Doing the bracket first:   3 × 9  = 27\n  Distributing:              3×4 + 3×5  =  12 + 15  = 27\n\n  Same answer, and that is the claim.",
        mistake:
          "Multiplying only the first term inside the bracket. 3(x + 2) is 3x + 6, and never 3x + 2. The word distributive is the reminder: the 3 is distributed across everything in the bracket.",
      },
      {
        id: "a-ma-pr-why-true",
        title: "Why it is true, as a picture",
        explain:
          "Draw a rectangle 3 tall and (4 + 5) wide. Its area is 3 × 9. Now cut it down the middle into a 3 by 4 piece and a 3 by 5 piece. The two pieces together are the same rectangle, so the areas must be equal.",
        why: "Once you have seen this picture, the law stops being something to remember. It is obvious, and obvious things are not forgotten under exam pressure. The same picture reappears in Month 6 for expanding double brackets, where it becomes a rectangle cut both ways.",
        example:
          "        4           5\n     +-------+-----------+\n     |       |           |\n   3 | 3 × 4 |   3 × 5   |\n     |       |           |\n     +-------+-----------+\n\n  The whole rectangle:  3 × (4 + 5) = 3 × 9 = 27\n  The two pieces:       12 + 15 = 27\n\n  Same rectangle, counted two ways.",
        analogy:
          "Buying 3 crates that each hold 4 bottles of water and 5 bottles of malt. You can count 3 crates of 9 items, or count 12 waters and 15 malts. Nobody would expect those to differ.",
      },
      {
        id: "a-ma-pr-mental-distributive",
        title: "Using it in your head",
        explain:
          "Any awkward multiplication can be split into an easy one plus an easy one. 7 × 103 is 7 × 100 plus 7 × 3. 6 × 98 is 6 × 100 minus 6 × 2.",
        why: "This is the most immediately useful thing in the module. It turns multiplications that look like they need paper into ones that do not, and it is the same law you will use on brackets in Month 6.",
        example:
          "  Blocks cost ₦450 each. What do 12 cost?\n\n  Split the 12 into a friendly pair of numbers:\n\n    12 × ₦450\n  = (10 × 450)  +  (2 × 450)\n  =    4,500    +      900\n  =  ₦5,400\n\n\n  IT WORKS BY SUBTRACTING TOO:\n\n  A trader buys 98 sachets at ₦20 each.\n\n    98 × ₦20\n  = (100 × 20)  −  (2 × 20)\n  =    2,000    −     40\n  =  ₦1,960\n\n  Going up to the round 100 and taking the\n  extra back off is far easier than working\n  with 98 directly.\n\n\n  AND THIS IS WHAT LONG MULTIPLICATION IS:\n\n    348 × 24\n  = 348 × (20 + 4)\n  = 6,960 + 1,392\n  = 8,352\n\n  The two rows of the written layout are the\n  two halves of the distributive law. It was\n  never a separate procedure.",
        drill: {
          skill: "L0-N2.2",
          count: 3,
          intro:
            "Three long multiplications. This time, notice what the two rows actually are: the second number split into tens and units, distributed across the first.",
        },
      },
      {
        id: "a-ma-pr-both-directions",
        title: "Forwards it is expanding, backwards it is factorising",
        explain:
          "Read a(b + c) = ab + ac from left to right and you are expanding a bracket. Read it from right to left and you are factorising. They are one law, used in two directions.",
        why: "Expanding and factorising are usually taught as two separate topics with two sets of methods, and students routinely confuse which one a question wants. Seeing them as one law read two ways makes the pair far harder to mix up, and it makes factorising feel like undoing rather than like guessing.",
        example:
          "  Expanding, left to right:\n\n    3(x + 2)  =  3x + 6\n\n  Factorising, right to left:\n\n    3x + 6    =  3(x + 2)\n\n  Same statement. The instruction decides which way you read it,\n  which is exactly what Month 1 was about.",
        mistake:
          "Trying to factorise by inspection without asking what is common to every term. Factorising is not guessing: find what divides all of the terms, take it outside, and what remains goes inside.",
      },
      {
        id: "a-ma-pr-like-terms",
        title: "Collecting like terms is this law too",
        explain:
          "3x + 5x = 8x looks like a separate rule about letters. It is not. It is the distributive law read backwards: 3x + 5x = (3 + 5)x = 8x.",
        why: "This explains why you may add 3x and 5x and may not add 3x and 5y. The x can be taken outside as a common factor; there is nothing common to take out of 3x + 5y. The rule about like terms is not a rule at all, it is a consequence.",
        example:
          "  Why 3x + 5x = 8x:\n\n    3x + 5x\n  = (3 + 5)x       ← the distributive law, backwards\n  = 8x\n\n  Why 3x + 5y does not simplify:\n\n    3x + 5y\n    There is no common factor to take outside, so there is\n    nothing to collect. It is already finished.",
        practice: {
          prompt:
            "A student writes 4a + 3b = 7ab. Using the distributive law, explain in one sentence why that is wrong.",
          answer:
            "There is no common factor in 4a and 3b to take outside, so the law does not apply and nothing can be collected. 4a + 3b is already in its simplest form. The student has combined two terms that are not multiples of the same thing.",
        },
        drill: {
          skill: "L1-A1.2",
          count: 3,
          intro:
            "Three collections of like terms. Every one of them is the distributive law read backwards, whatever the letters look like.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l23-identity-inverse",
    moduleId: "ma-m2-properties",
    sectionId: SECTION_ID,
    order: 3,
    title: "Identity and Inverse",
    subtitle: "The two ideas that solving an equation is made of",
    estimatedMinutes: 14,
    intro:
      "Every equation you will ever solve is solved by the same two moves: undo what was done, and use the fact that adding zero or multiplying by one changes nothing. This lesson names those two moves.",

    atoms: [
      {
        id: "a-ma-pr-identity",
        title: "The identity elements: zero and one",
        explain:
          "Adding 0 leaves a number unchanged, so 0 is the identity element for addition. Multiplying by 1 leaves a number unchanged, so 1 is the identity element for multiplication.",
        origin:
          "Zero had to be argued into existence as a number rather than a gap. The Indian mathematician Brahmagupta, writing in 628, is the first we know of to set out rules for calculating with it: what happens when you add it, subtract it, multiply by it. He also tried to say what happens when you divide by it, and got that part wrong, which is a useful reminder that even the people who invent an idea do not get all of it at once. The word identity for a number that leaves things unchanged came much later, out of the study of the operations themselves in the 1800s.",
        why: "These look too obvious to name, and naming them is what makes solving equations explicable. When you cancel a term by subtracting it, what you have actually done is turn it into zero, and zero is the thing that can be ignored.",
        example:
          "  Adding the identity:        7 + 0 = 7\n  Multiplying by the identity: 7 × 1 = 7\n\n  And in disguise, all over the place:\n\n    x + 3 − 3  =  x + 0  =  x\n    5x ÷ 5     =  1x     =  x\n    3/4 × 4/3  =  1\n\n  Every one of those is a cancellation, and every cancellation\n  works by producing an identity element.",
        mistake:
          "Thinking that multiplying by zero is the same kind of move as multiplying by one. Multiplying by 1 preserves everything. Multiplying by 0 destroys everything, which is why you may never multiply both sides of an equation by zero.",
      },
      {
        id: "a-ma-pr-inverse-elements",
        title: "Inverse elements: opposites and reciprocals",
        explain:
          "The additive inverse of a number is the one that adds to it to give zero. For 7 it is −7, and for −4 it is 4. Every number has one, and finding it means changing the sign. There is a matching idea for multiplying: the number you multiply by to get 1. For 7 that is one seventh. It is called the multiplicative inverse, or the reciprocal, and Month 3 works with it properly once fractions are in place. What you need from it now is only that it exists, and that it is the multiplying twin of changing the sign.",
        why: "Every cancellation in algebra is one of these two being used. Subtracting 3 from both sides is really adding the additive inverse of 3, and dividing both sides by 5 is really multiplying by the reciprocal of 5. That is worth knowing early, because it means solving an equation has one method rather than four, and the method is always the same: undo with the inverse.",
        table: {
          caption: "The two inverses, side by side.",
          headers: ["Number", "Adds to zero with", "Multiplies to one with"],
          rows: [
            ["7", "−7", "one seventh"],
            ["−4", "4", "minus one quarter"],
            ["12", "−12", "one twelfth"],
            ["1", "−1", "1, which is its own"],
            ["0", "0", "nothing at all"],
          ],
          note: "Read the last row carefully, because it is the reason you cannot divide by zero. Every other number has something you can multiply it by to reach 1. Zero does not: zero times anything is zero, so there is nothing to reach 1 with. Month 3 states this as a rule. It is really this gap in the table.",
        },
      },
      {
        id: "a-ma-pr-inverse-operations",
        title: "Inverse operations: undoing",
        explain:
          "Addition and subtraction undo each other. Multiplication and division undo each other. Every operation you meet from here will arrive with a partner that undoes it, squaring and square rooting among them later this month. To get at a hidden number, apply the inverse of whatever was done to it.",
        origin:
          "Undoing an operation to find an unknown is the oldest technique in algebra and it has a name older than algebra: the rule of false position, used in Egypt in the Rhind papyrus around 1650 before the common era. You guess an answer, see how wrong it is, and scale your guess. Al-Khwarizmi's method in Baghdad, eight centuries later, replaced guessing with inverses: move the quantity across and restore the balance. That is the method you are learning, and it won because it does not depend on a lucky first guess.",
        why: "This is the whole method for solving equations, and it is also the whole method for checking arithmetic. You met it in Lesson 17 as a way of checking a subtraction, and it is the same idea scaled up.",
        example:
          "  Solving 3x + 5 = 20 is two inverse operations:\n\n    3x + 5 = 20\n    3x     = 15      ← add −5 to both sides, undoing the +5\n     x     = 5       ← multiply by 1/3, undoing the ×3\n\n  Written as most people say it:\n\n    subtract 5 from both sides, then divide both sides by 3.\n\n  Both descriptions are the same two moves.",
        analogy:
          "Getting dressed: socks then shoes. Getting undressed: shoes then socks. You undo in the reverse order, which is why the +5 comes off before the ×3.",
      },
      {
        id: "a-ma-pr-balance",
        title: "Why you must do it to both sides",
        explain:
          "An equation is a claim that two things are equal. Doing something to one side and not the other breaks the claim, so the new line is simply false and everything after it is worthless.",
        why: "Students who learn the phrase move it over and change the sign often cannot say why the sign changes. It changes because you added the additive inverse to both sides, and the term on the original side became zero. Nothing moved anywhere.",
        example:
          "  What 'moving it over' actually is:\n\n    x + 7 = 12\n    x + 7 − 7 = 12 − 7      ← the same thing done to both sides\n    x + 0 = 5               ← the additive inverse did its job\n    x = 5                   ← the identity element can be dropped\n\n  Nothing crossed the equals sign. A −7 was added to each side\n  and the left hand side collapsed to x.",
        mistake:
          "Changing one side only. It produces a line that is false, and because everything afterwards is built on it, the rest of the working cannot be saved even if it is done perfectly.",
      },
      {
        id: "a-ma-pr-zero-again",
        title: "Zero, one more time",
        explain:
          "Zero is the additive identity, it is its own additive inverse, and it is the only number with no reciprocal. That last fact is exactly why division by zero is undefined. The bottom number of a fraction has a name, the denominator, and Month 3 uses it constantly. Here it is enough to say the bottom.",
        why: "Dividing by a number means multiplying by its reciprocal. Zero has no reciprocal, so dividing by zero is not a hard calculation, it is an instruction that refers to something that does not exist. Lesson 19 said it in terms of how many zeros fit into 12; this is the same fact stated in terms of properties.",
        example:
          "  Dividing by n means multiplying by 1/n:\n\n    12 ÷ 4  =  12 × 1/4  =  3\n    12 ÷ 0  =  12 × 1/0  =  ?\n\n  1/0 does not name a number, because no number multiplies by\n  zero to give one. So the instruction cannot be carried out.\n\n  This is why an algebraic fraction is undefined wherever its\n  denominator is zero, which arrives in Month 6.",
        practice: {
          prompt:
            "Solve 5x − 8 = 12, naming the inverse operation used at each step.",
          answer:
            "Add 8 to both sides, which is the additive inverse of −8, giving 5x = 20. Then multiply both sides by 1/5, which is the multiplicative inverse of 5, giving x = 4. Check by substituting: 5(4) − 8 = 12.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l24-closure",
    moduleId: "ma-m2-properties",
    sectionId: SECTION_ID,
    order: 4,
    title: "Closure, and Why Algebra Is Allowed to Work",
    subtitle: "Staying inside a set, and what happens when you cannot",
    estimatedMinutes: 13,
    intro:
      "Module 3 of Month 1 told the story of the number system being extended in stages. This lesson is the property that explains why each extension was necessary, and then it says plainly what all six properties have been for.",

    atoms: [
      {
        id: "a-ma-pr-closure",
        title: "Closure: does the answer stay inside the set?",
        explain:
          "A set is closed under an operation if combining any two members always gives another member of that same set. The counting numbers are closed under addition, since adding two of them always gives another one.",
        origin:
          "Asking whether the answer stays inside the set sounds like a strange question until you notice it is the question that produced every number system you know. Counting numbers are not closed under subtraction, so negatives were invented. They are not closed under division, so fractions were invented. Fractions are not closed under taking the corner to corner length of a square, so the reals were invented. Each new kind of number in Month 1 came from someone asking exactly this and not liking the answer. The word closure and the habit of checking it deliberately came from the study of abstract structures in the late 1800s.",
        why: "Closure is the property that forced every extension of the number system. Each time an operation produced an answer that was outside the set, mathematics had to either forbid the question or widen the set, and it widened the set every time.",
        table: {
          caption: "Where each set runs out.",
          headers: ["Set", "Closed under", "Fails under", "Which forced"],
          rows: [
            ["Counting numbers", "+ and ×", "Subtraction: 3 − 5", "Integers"],
            ["Integers", "+, − and ×", "Division: 3 ÷ 5", "Rationals"],
            ["Rationals", "+, −, × and ÷ by non zero", "The corner to corner length of a square", "Reals"],
            ["Reals", "All four, and roots of positives", "Square roots of negatives", "A topic beyond this course"],
          ],
          note: "The whole family tree from Month 1 is this table read downwards.",
        },
        analogy:
          "A toolbox that can build anything except a door. You either stop building doors or you buy another tool, and mathematics has always bought the tool.",
      },
      {
        id: "a-ma-pr-closure-examples",
        title: "Testing closure with one counterexample",
        explain:
          "To show a set is closed you must argue it holds for every case. To show it is not closed you need one example where it fails. That asymmetry is worth noticing, because it is how mathematical claims work generally.",
        why: "This is the first appearance of an idea Month 9 makes central: an example never proves a general claim, and a single counterexample always disproves one. Meeting it here, with numbers, makes it far less strange when it returns as a formal method.",
        example:
          "  Claim: the odd numbers are closed under multiplication.\n\n    3 × 5 = 15   odd\n    7 × 9 = 63   odd\n    5 × 5 = 25   odd\n\n  Three examples. Not a proof, but it looks promising, and it\n  happens to be true. The argument is that odd × odd always\n  leaves a remainder of 1 when divided by 2.\n\n\n  Claim: the odd numbers are closed under addition.\n\n    3 + 5 = 8    even\n\n  One counterexample. The claim is dead. No further work needed.",
        mistake:
          "Testing a few cases and declaring a claim proved. Checking cases raises confidence and never establishes certainty, which is the difference between noticing and proving.",
      },
      {
        id: "a-ma-pr-why-algebra",
        title: "Why all of this is what lets letters work",
        explain:
          "Algebra writes x where a number will go, and then manipulates the expression without knowing which number it is. That is only legal because the properties hold for every number, so any move justified by a property is justified for all values of x at once.",
        why: "This is the answer to the question students ask most often and are rarely given: why are we allowed to do this to a letter? Because 3(x + 2) = 3x + 6 is not a fact about x. It is the distributive law, which holds for every real number, and x is standing in for a real number.",
        example:
          "  Why you may expand 3(x + 2) without knowing x:\n\n    The distributive law says a(b + c) = ab + ac for ALL\n    real numbers a, b and c.\n\n    x is standing for some real number.\n\n    So the law applies, whatever x turns out to be.\n\n  Test it with any value you like:\n\n    x = 4    3(6)  = 18    and   3(4) + 6 = 18   ✓\n    x = −1   3(1)  = 3     and   3(−1) + 6 = 3   ✓\n    x = 0.5  3(2.5)= 7.5   and   3(0.5) + 6 = 7.5 ✓",
        analogy:
          "A rule that applies to every citizen applies to a citizen whose name you do not know. You do not need the name to know the rule covers them.",
      },
      {
        id: "a-ma-pr-summary",
        title: "The six properties, in one place",
        explain:
          "Commutative, associative, distributive, identity, inverse and closure. Six words, and between them they account for essentially every legal move in school algebra.",
        why: "Keeping this list somewhere is worth more than it looks. When a step in a worked solution is unclear, the question to ask is which of these six permitted it, and the answer is almost always one of them.",
        table: {
          caption: "The reference card for the rest of the course.",
          headers: ["Property", "What it says", "Where you use it"],
          rows: [
            ["Commutative", "a + b = b + a, and ab = ba", "Reordering, collecting terms"],
            ["Associative", "(a + b) + c = a + (b + c)", "Regrouping, dropping brackets"],
            ["Distributive", "a(b + c) = ab + ac", "Expanding, factorising, like terms"],
            ["Identity", "a + 0 = a, and a × 1 = a", "Cancelling"],
            ["Inverse", "a + (−a) = 0, and a × 1/a = 1", "Solving equations"],
            ["Closure", "The answer stays in the set", "Knowing what kind of answer to expect"],
          ],
        },
      },
      {
        id: "a-ma-pr-review",
        title: "Month 2 so far, mixed",
        explain:
          "A mixed drill across the operations, the order of operations and the place value work they rest on, with no warning about which is which.",
        why: "Two modules of Month 2 are done and the temptation is to treat each as finished. Returning to them now, mixed and after a gap, is what turns them from material you have covered into material you have.",
        drill: {
          review: ["L0-N2.2", "L0-N2.4", "L0-N2.3", "L0-N1.4", "L0-N2.1"],
          count: 5,
          intro:
            "Five questions from across the operations and place value. Identify what each one is before you start, since that is the half of the skill a single topic drill never trains.",
        },
      },
    ],

    task: {
      title: "Before you move on",
      intro:
        "The distributive law is the one to have at your fingertips. Five minutes with a pen:",
      prompts: [
        "Work out 7 × 104, 6 × 99 and 12 × 25 in your head by splitting one factor. Write down the split you used.",
        "Expand 5(y + 3), then factorise 5y + 15, and note that you did the same law twice.",
        "Write 9a + 6a as a single term, and explain the step using the distributive law.",
        "Give one counterexample showing that division is not associative.",
      ],
      closing:
        "For the last one, (24 ÷ 4) ÷ 2 is 3 and 24 ÷ (4 ÷ 2) is 12. One counterexample settles it, and that pattern of argument is worth getting used to now.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
