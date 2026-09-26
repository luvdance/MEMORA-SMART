/**
 * ASSESSMENTS · MATHEMATICS · MONTH 4 · MODULE 3 · PATTERNS AND SEQUENCES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One misconception dominates this module and it is tested three times from
 * three angles: using the first term as the constant in the nth term. The
 * distractor 3n + 5 for the sequence 5, 8, 11, 14 is what nearly every student
 * who gets this wrong actually writes, and the whyWrong does the one thing that
 * fixes it, which is to substitute n = 1 and show the failure rather than
 * restate the rule.
 *
 * The "is 100 in the sequence" question is here because it cannot be answered
 * from a term-to-term rule without stepping through thirty terms. A candidate
 * who can do it has understood why a rule written in symbols is worth having,
 * which is the point of the whole module.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l57-seeing-patterns": {
    lessonId: "ma-l57-seeing-patterns",
    passMark: 70,
    questions: [
      {
        id: "maq57-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pt-continuing",
        prompt: "What are the next two terms of 3, 6, 12, 24, ... ?",
        options: [
          { id: "a", text: "27, 30" },
          { id: "b", text: "48, 96" },
          { id: "c", text: "36, 48" },
          { id: "d", text: "48, 72" },
        ],
        correct: "b",
        explanation:
          "The gaps are 3, 6 and 12, which are not equal, so this is not an adding sequence. Dividing each term by the one before gives 2 every time, so the rule is multiply by 2: 48 then 96.",
        whyWrong: {
          a: "This adds the first gap of 3 each time. Checking the other gaps would have ruled it out immediately, which is why every gap has to be worked out rather than just the first.",
          c: "This adds 12 each time, using the last gap rather than finding the rule. The gaps are growing, so no single number is being added.",
          d: "This doubles once and then adds 24, mixing two rules together.",
        },
      },
      {
        id: "maq57-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pt-describing",
        prompt:
          "Which description of 5, 8, 11, 14 is good enough for somebody else to continue the sequence?",
        options: [
          { id: "a", text: "It goes up by 3" },
          { id: "b", text: "Start at 5 and add 3 each time" },
          { id: "c", text: "It is the 3 times table" },
          { id: "d", text: "Add 3, then 3, then 3" },
        ],
        correct: "b",
        explanation:
          "A term to term description needs both parts: where to start and what to do. Without the starting value, add 3 each time fits 1, 4, 7, 10 just as well.",
        whyWrong: {
          a: "True and incomplete. It does not say where the sequence begins, so it describes infinitely many different sequences.",
          c: "The 3 times table is 3, 6, 9, 12. This sequence is that table shifted up by 2, which is a different thing.",
          d: "This describes the gaps between the four terms shown and says nothing about where to start or how to continue past them.",
        },
      },
      {
        id: "maq57-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-justifying",
        prompt:
          "What comes after 1, 2, 4? A student says 8 and another says 7. Who is right?",
        options: [
          { id: "a", text: "8 is right, because doubling is the obvious rule" },
          {
            id: "b",
            text: "Both are defensible, because three terms are not enough to settle which rule is meant",
          },
          { id: "c", text: "7 is right, because the gaps should grow by 1" },
          { id: "d", text: "Neither, because the sequence has no rule" },
        ],
        correct: "b",
        explanation:
          "Doubling gives 1, 2, 4, 8 and adding 1 then 2 then 3 gives 1, 2, 4, 7. Both fit the three terms given. An exam question will always provide enough terms to distinguish the intended rule, which is why you check a rule against a term you did not use to build it.",
        whyWrong: {
          a: "Doubling is a reasonable guess and it is not the only rule that fits. Calling it obvious is what stops a student checking.",
          c: "Also a reasonable guess, and equally unproven on three terms.",
          d: "There are at least two rules that fit, so the problem is too many rules rather than none.",
        },
      },
      {
        id: "maq57-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-shape-patterns",
        prompt:
          "Squares in a row made of matchsticks use 4, 7, 10 sticks. What does the PICTURE tell you that the numbers alone do not?",
        options: [
          { id: "a", text: "Nothing; the numbers contain all the information" },
          {
            id: "b",
            text: "Why the rule adds 3: the first square needs 4 sticks and each one after shares a side with the one before, so needs only 3 more",
          },
          { id: "c", text: "That the pattern must eventually stop" },
          { id: "d", text: "That the squares are different sizes" },
        ],
        correct: "b",
        explanation:
          "The shared side is the reason for the 3, and seeing it means the nth term of 3n + 1 can be written with confidence rather than found by hunting. The 1 is the extra stick the very first square needed.",
        whyWrong: {
          a: "The numbers tell you the rule and not the reason. The reason is what lets you predict the rule before calculating it.",
          c: "Nothing about the picture suggests a limit. The pattern continues as far as you like.",
          d: "The squares are all the same size, which is why each new one costs the same 3 sticks.",
        },
      },
      {
        id: "maq57-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pt-what-is-a-sequence",
        prompt: "Why does the ORDER of the numbers matter in a sequence?",
        options: [
          { id: "a", text: "It does not; a sequence is just a collection of numbers" },
          {
            id: "b",
            text: "Because each term has a position, and the rules in this module take a position and produce the term at it",
          },
          { id: "c", text: "Because sequences must always increase" },
          { id: "d", text: "Because the first term is always the smallest" },
        ],
        correct: "b",
        explanation:
          "Position is the idea the module turns on. A position to term rule pairs each position with one term, and that pairing only exists because the terms are in a definite order.",
        whyWrong: {
          a: "The same four numbers in a scrambled order have no obvious rule, which shows that the order carries information.",
          c: "Plenty of sequences decrease, such as 20, 17, 14, 11, and they have perfectly good rules.",
          d: "In a decreasing sequence the first term is the largest. Order means definite position, not increasing size.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l58-two-kinds-of-rule": {
    lessonId: "ma-l58-two-kinds-of-rule",
    passMark: 70,
    questions: [
      {
        id: "maq58-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pt-term-to-term",
        prompt:
          "A sequence starts 5, 8, 11, 14 and continues with the same rule. What is the 7th term?",
        options: [
          { id: "a", text: "26" },
          { id: "b", text: "23" },
          { id: "c", text: "21" },
          { id: "d", text: "35" },
        ],
        correct: "b",
        explanation:
          "From the 4th term to the 7th is 3 steps of 3, so 14 + 9 = 23. Counting gaps rather than terms is what keeps this right.",
        whyWrong: {
          a: "One step too many. From the 1st term to the 7th there are six gaps, not seven, because the first term is where you start rather than somewhere you step to.",
          c: "That is the 6th term. One step short.",
          d: "This adds 3 a full seven times starting from 14, or multiplies 5 by 7. Either way the position has been counted from the wrong place.",
        },
      },
      {
        id: "maq58-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-the-problem",
        prompt:
          "Why is a term to term rule a poor way to find the 100th term of 5, 8, 11, 14?",
        options: [
          { id: "a", text: "Because term to term rules are always wrong" },
          {
            id: "b",
            text: "Because it needs 99 additions, any one of which could go wrong, when a position to term rule needs one calculation",
          },
          { id: "c", text: "Because the sequence has no 100th term" },
          { id: "d", text: "Because term to term rules only work for the first ten terms" },
        ],
        correct: "b",
        explanation:
          "The rule is correct and it is impractical. 3n + 2 gives 302 in one multiplication and one addition, whatever the position, and that is the whole reason the position to term rule is worth finding.",
        whyWrong: {
          a: "A term to term rule is a correct and complete description. The objection is about effort, not accuracy.",
          c: "It has a 100th term, and it is 302. Sequences continue as far as you ask.",
          d: "They work for any term. They just take a step for each one.",
        },
      },
      {
        id: "maq58-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-comparing",
        prompt:
          "Which job can ONLY be done with a position to term rule?",
        options: [
          { id: "a", text: "Finding the next two terms" },
          { id: "b", text: "Deciding whether 302 is in the sequence, without stepping through it" },
          { id: "c", text: "Filling in a missing term in the middle" },
          { id: "d", text: "Describing the sequence to somebody" },
        ],
        correct: "b",
        explanation:
          "That question becomes the equation 3n + 2 = 302, which can be solved directly. A term to term rule cannot be rearranged, so answering it that way means stepping until you reach or pass 302.",
        whyWrong: {
          a: "Term to term does this easily, and it is the job it is best at.",
          c: "Both rules manage this. With a constant difference the missing term is the average of its neighbours.",
          d: "Both describe the sequence completely, as long as a term to term rule includes its starting value.",
        },
      },
      {
        id: "maq58-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pt-position-to-term",
        prompt:
          "The rule for 5, 8, 11, 14 is written as 3n + 2. What does the n stand for?",
        options: [
          { id: "a", text: "Any number at all" },
          { id: "b", text: "The position of the term you want" },
          { id: "c", text: "The number being added each time" },
          { id: "d", text: "The first term" },
        ],
        correct: "b",
        explanation:
          "The n is a position waiting to have a number put into it. Putting 100 in gives the 100th term. That is all the notation means, and it is why a letter was needed: no ordinary number means whichever position I am asked about.",
        whyWrong: {
          a: "Positions are whole numbers, starting at 1. There is no 2.5th term of a sequence.",
          c: "That is the 3 in front of the n, the common difference. The n counts the steps rather than measuring them.",
          d: "The first term is 5, which is what the rule produces when n is 1. The n is the input, not the output.",
        },
      },
      {
        id: "maq58-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-why-algebra",
        prompt:
          "What does writing the rule with a letter buy you that a sentence does not?",
        options: [
          { id: "a", text: "Nothing; it is shorter and otherwise the same" },
          {
            id: "b",
            text: "It can be rearranged, so a question like 'is 302 a term' becomes an equation you can solve",
          },
          { id: "c", text: "It makes the sequence longer" },
          { id: "d", text: "It removes the need to know the common difference" },
        ],
        correct: "b",
        explanation:
          "A sentence cannot be turned into 3n + 2 = 302 and solved. A symbolic rule can, and that is most of what algebra is for. Everything in the next two modules is this advantage being used harder.",
        whyWrong: {
          a: "Being shorter is real and minor. Being rearrangeable is the part that makes new questions answerable.",
          c: "The notation describes the sequence and does not change it.",
          d: "The common difference is the number multiplying n, so the rule depends on knowing it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l59-nth-term": {
    lessonId: "ma-l59-nth-term",
    passMark: 70,
    questions: [
      {
        id: "maq59-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pt-finding-nth",
        prompt: "What is the nth term of 5, 8, 11, 14, ... ?",
        options: [
          { id: "a", text: "3n + 5" },
          { id: "b", text: "3n + 2" },
          { id: "c", text: "5n + 3" },
          { id: "d", text: "3n" },
        ],
        correct: "b",
        explanation:
          "The common difference is 3, so the rule contains 3n. At n = 1 that gives 3, and the first term is 5, so the constant is 5 − 3 = 2. Test at n = 4: 12 + 2 = 14, which matches.",
        whyWrong: {
          a: "This uses the first term as the constant, which is the commonest error in the module. Test it at n = 1: 3 + 5 = 8, and the sequence starts at 5. The constant must be the term BEFORE the first, because 3n has already contributed 3 by the time n reaches 1.",
          c: "The number multiplying n is the common difference, 3, not the first term. The difference is what the sequence goes up by for each step along it.",
          d: "The 3n part is right and unfinished. At n = 1 it gives 3 and the sequence starts at 5.",
        },
      },
      {
        id: "maq59-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pt-the-zeroth-term",
        prompt: "What is the nth term of 20, 17, 14, 11, ... ?",
        options: [
          { id: "a", text: "3n + 20" },
          { id: "b", text: "23 − 3n" },
          { id: "c", text: "20 − 3n" },
          { id: "d", text: "17 − 3n" },
        ],
        correct: "b",
        explanation:
          "The difference is −3, so the rule contains −3n. Stepping back one term from 20 gives 23, so that is the constant: 23 − 3n. Test at n = 1: 23 − 3 = 20, and at n = 4: 23 − 12 = 11.",
        whyWrong: {
          a: "The sequence is decreasing, so the number multiplying n must be negative. This rule increases.",
          c: "This uses the first term as the constant. Test at n = 1: 20 − 3 = 17, and the sequence starts at 20.",
          d: "This uses the second term as the constant. Test at n = 1: 17 − 3 = 14, which is the third term.",
        },
      },
      {
        id: "maq59-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pt-testing",
        prompt:
          "A student writes 4n + 6 as the nth term of 6, 10, 14, 18. What is the fastest way to see it is wrong?",
        options: [
          { id: "a", text: "Find the 100th term and see whether it looks sensible" },
          { id: "b", text: "Put n = 1 into the rule and compare with the first term" },
          { id: "c", text: "Check the common difference again" },
          { id: "d", text: "Nothing is wrong with it" },
        ],
        correct: "b",
        explanation:
          "At n = 1 the rule gives 10, and the first term is 6. That takes five seconds and catches the commonest error in the topic. The correct rule is 4n + 2, and every wrong answer produced by this misconception fails the same test.",
        whyWrong: {
          a: "The 100th term would be wrong too and there is nothing to compare it with, so the error would not show.",
          c: "The difference of 4 is correct, so this check passes and the error survives. The constant is what went wrong.",
          d: "It is wrong. It gives 10, 14, 18, 22, which is the same sequence shifted along by one place.",
        },
      },
      {
        id: "maq59-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pt-using-nth",
        prompt:
          "Matchstick squares in a row use 4, 7, 10, 13 sticks. How many sticks do 20 squares need?",
        options: [
          { id: "a", text: "61" },
          { id: "b", text: "80" },
          { id: "c", text: "64" },
          { id: "d", text: "60" },
        ],
        correct: "a",
        explanation:
          "The nth term is 3n + 1, so 3 × 20 + 1 = 61. Checking a second way from the picture: the first square needs 4 and each of the other 19 needs 3 more, so 4 + 57 = 61.",
        whyWrong: {
          b: "This multiplies 4 by 20, as though every square needed its own four sticks. Each square after the first shares a side with the one before.",
          c: "This uses 3n + 4, taking the first term as the constant. At n = 1 that would give 7 sticks for one square, and one square needs 4.",
          d: "This is 3n with the constant dropped. At n = 1 it gives 3 sticks, which is not enough to make a square.",
        },
      },
      {
        id: "maq59-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-is-it-in-there",
        prompt: "Is 100 in the sequence 5, 8, 11, 14, ... ?",
        options: [
          { id: "a", text: "Yes, it is the 33rd term" },
          {
            id: "b",
            text: "No. Solving 3n + 2 = 100 gives n = 32.67, which is not a whole number",
          },
          { id: "c", text: "Yes, because 100 is bigger than 5" },
          { id: "d", text: "It cannot be decided without writing out every term" },
        ],
        correct: "b",
        explanation:
          "Set the nth term equal to 100: 3n = 98, so n = 32.67. Positions are whole numbers, so 100 is not a term. It falls between the 32nd term, 98, and the 33rd, 101.",
        whyWrong: {
          a: "The 33rd term is 3 × 33 + 2 = 101, not 100. Checking the position you found is what catches this.",
          c: "Being large enough is not the test. The sequence only visits one number in every three.",
          d: "That is exactly what the symbolic rule saves you from. The rule can be rearranged into an equation and solved in two lines.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l60-special-sequences": {
    lessonId: "ma-l60-special-sequences",
    passMark: 70,
    questions: [
      {
        id: "maq60-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pt-squares-cubes",
        prompt: "What are the next two terms of 1, 4, 9, 16, 25, ... ?",
        options: [
          { id: "a", text: "34, 43" },
          { id: "b", text: "36, 49" },
          { id: "c", text: "30, 36" },
          { id: "d", text: "35, 48" },
        ],
        correct: "b",
        explanation:
          "These are the square numbers, so the next are 6 × 6 = 36 and 7 × 7 = 49. The gaps are 3, 5, 7, 9, which are the odd numbers, so the next gaps are 11 and 13, giving the same answer.",
        whyWrong: {
          a: "This adds the last gap of 9 twice. The gaps in this sequence grow by 2 each time rather than staying the same.",
          c: "This looks like adding 5 and then 6, which is neither the gap pattern nor the square rule.",
          d: "The first step adds 10 rather than 11. The gaps are the odd numbers: 3, 5, 7, 9, 11, 13.",
        },
      },
      {
        id: "maq60-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-triangular",
        prompt:
          "In a room of 10 people, everybody shakes hands with everybody else once. How many handshakes, and which sequence is this?",
        options: [
          { id: "a", text: "100 handshakes, the square numbers" },
          { id: "b", text: "45 handshakes, the 9th triangular number" },
          { id: "c", text: "10 handshakes, one each" },
          { id: "d", text: "90 handshakes, since each of 10 people shakes 9 hands" },
        ],
        correct: "b",
        explanation:
          "Person 1 shakes 9 hands, person 2 shakes 8 new ones, and so on down to 1, giving 9 + 8 + ... + 1 = 45. That is the 9th triangular number, and the pairing method from the Gauss story in Month 1 works it out in one line.",
        whyWrong: {
          a: "100 is 10 squared, which would count every person shaking every person including themselves, and counting each pair twice.",
          c: "A handshake involves two people, so ten people generate far more than ten of them.",
          d: "This counts each handshake twice, once from each side. Halving 90 gives the correct 45.",
        },
      },
      {
        id: "maq60-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pt-fibonacci",
        prompt: "What are the next two terms of 1, 1, 2, 3, 5, 8, ... ?",
        options: [
          { id: "a", text: "11, 14" },
          { id: "b", text: "13, 21" },
          { id: "c", text: "16, 32" },
          { id: "d", text: "12, 17" },
        ],
        correct: "b",
        explanation:
          "Each term is the sum of the two before it: 5 + 8 = 13, then 8 + 13 = 21. This is the Fibonacci sequence, and its gaps repeat the sequence itself, which is why checking the gaps does not help here.",
        whyWrong: {
          a: "This adds 3 each time, using one gap and ignoring the rest. The gaps here are 0, 1, 1, 2, 3, which are not constant.",
          c: "This doubles. Doubling 8 gives 16, and the rule here adds the two previous terms instead.",
          d: "This adds 4 then 5. The gaps in this sequence are themselves the sequence, not a simple run.",
        },
      },
      {
        id: "maq60-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-recognising",
        prompt:
          "You are given a sequence and the gaps between its terms are 3, 5, 7, 9. What should you suspect?",
        options: [
          { id: "a", text: "A linear sequence with a difference of 3" },
          { id: "b", text: "Something built on square numbers, because the gaps grow by a constant 2" },
          { id: "c", text: "A multiplying sequence" },
          { id: "d", text: "The Fibonacci sequence" },
        ],
        correct: "b",
        explanation:
          "The gaps between the square numbers are the odd numbers, growing by 2 each time. Gaps that grow by a constant amount are the signature of a rule involving n squared.",
        whyWrong: {
          a: "A linear sequence has EQUAL gaps. Here they are growing, so no single number is being added.",
          c: "In a multiplying sequence the gaps grow by multiplication rather than by a constant amount, and dividing consecutive terms gives a constant.",
          d: "Fibonacci gaps repeat the sequence itself, so they would be 1, 1, 2, 3, 5 rather than an even run of odd numbers.",
        },
      },
      {
        id: "maq60-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pt-review",
        prompt:
          "Why does this module say to check EVERY gap rather than just the first one?",
        options: [
          { id: "a", text: "To use up time carefully in the exam" },
          {
            id: "b",
            text: "Because any two numbers have a gap between them, so one gap tells you nothing about whether the sequence is linear",
          },
          { id: "c", text: "Because the first gap is usually printed wrongly" },
          { id: "d", text: "Because sequences always have equal gaps" },
        ],
        correct: "b",
        explanation:
          "A single gap is a fact about two terms rather than about the sequence. In 3, 6, 12, 24 the first gap is 3, and assuming that is the rule gives 27 and 30 instead of 48 and 96.",
        whyWrong: {
          a: "The check takes seconds and saves minutes, so it is the opposite of using up time.",
          c: "Nothing is printed wrongly. The problem is what one gap can and cannot tell you.",
          d: "Plenty do not, which is exactly why the check matters. Squares, triangles and Fibonacci all have growing gaps.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
