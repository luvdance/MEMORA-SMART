/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 1
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l1-what-a-program-is": {
    lessonId: "js-l1-what-a-program-is",
    passMark: 70,
    questions: [
      {
        id: "jsq1-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-what-is-programming",
        prompt: "Which statement best describes a program?",
        options: [
          { id: "a", text: "Any file stored on a computer" },
          { id: "b", text: "A precise set of instructions that turns input into a useful result" },
          { id: "c", text: "The screen and keyboard used to type code" },
          { id: "d", text: "A website" },
        ],
        correct: "b",
        explanation:
          "A program is a list of exact instructions a computer can carry out, taking some information in and producing a result. Programming is the activity of designing and writing it.",
        whyWrong: {
          a: "Photos and documents are files but not programs. A program is specifically a set of instructions to be carried out.",
          c: "Those are hardware for writing code. The program is the instructions themselves, not the device.",
          d: "A website can contain programs, but most programs are not websites: a calculator app, an ATM's software and a game are all programs.",
        },
      },
      {
        id: "jsq1-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-ipo",
        prompt:
          "A fitness app takes your weight and height, calculates your body mass index, and shows it with a short message. What is the PROCESSING?",
        options: [
          { id: "a", text: "Your weight and height" },
          { id: "b", text: "The calculation of body mass index from weight and height" },
          { id: "c", text: "The message shown on screen" },
          { id: "d", text: "The phone the app runs on" },
        ],
        correct: "b",
        explanation:
          "Processing happens inside the program, turning input into output. Calculating the index from the measurements is the processing step.",
        whyWrong: {
          a: "Weight and height come in from the user, so they are input.",
          c: "The message goes out to the user, so it is output.",
          d: "The phone is the hardware the program runs on. It is not one of the program's three parts.",
        },
      },
      {
        id: "jsq1-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-compilers-interpreters",
        prompt: "What does a modern JavaScript engine do with your code?",
        options: [
          { id: "a", text: "Nothing; the processor reads JavaScript directly" },
          { id: "b", text: "Compiles the whole program into a separate file you must run later" },
          {
            id: "c",
            text: "Starts running it straight away and compiles frequently used parts to machine code while it runs",
          },
          { id: "d", text: "Sends it to a server to be translated" },
        ],
        correct: "c",
        explanation:
          "Engines such as V8 begin interpreting immediately and compile hot code just in time. That is why JavaScript starts instantly and still runs fast.",
        whyWrong: {
          a: "Processors only understand machine code. Every language has to be translated, and the engine is what does it.",
          b: "That describes a traditional ahead-of-time compiler, as used for C or Rust. You run JavaScript source directly.",
          d: "Translation happens on your own machine, inside the browser or Node.js. No server is involved.",
        },
      },
      {
        id: "jsq1-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-program-precision",
        prompt:
          "Instructions say: \"If the order is over 10,000, delivery is free. If it is under 10,000, charge 1,500 for delivery.\" What is wrong?",
        options: [
          { id: "a", text: "Nothing, every order is covered" },
          { id: "b", text: "An order of exactly 10,000 has no instruction" },
          { id: "c", text: "The delivery charge should be a percentage" },
          { id: "d", text: "Free delivery should never be offered" },
        ],
        correct: "b",
        explanation:
          "\"Over\" and \"under\" both exclude 10,000 itself. A computer given these instructions has no rule for that exact value. This boundary gap is one of the most common bugs in software.",
        whyWrong: {
          a: "Over and under together leave out exactly one value, the boundary. A person would guess; a computer cannot.",
          c: "That is a business choice, not a logic error. The instructions could use a percentage and still miss the boundary.",
          d: "Again a business choice. The problem is the missing case, whatever the rule is.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l2-algorithms-pseudocode": {
    lessonId: "js-l2-algorithms-pseudocode",
    passMark: 70,
    questions: [
      {
        id: "jsq2-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-algorithm-def",
        prompt: "Which of these is NOT a required property of an algorithm?",
        options: [
          { id: "a", text: "Its steps are precise" },
          { id: "b", text: "It always finishes" },
          { id: "c", text: "It is written in a programming language" },
          { id: "d", text: "Its steps are in a definite order" },
        ],
        correct: "c",
        explanation:
          "An algorithm is a method, not code. A recipe or long division is an algorithm. It can be written in English, pseudocode, a flowchart or any programming language.",
        whyWrong: {
          a: "Precision is required. A step that could mean two things is not part of a proper algorithm.",
          b: "An algorithm must be finite. A method that never ends never produces its output.",
          d: "Order is required. The same steps in a different order can give a different result.",
        },
      },
      {
        id: "jsq2-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-algorithm-order",
        prompt:
          "An algorithm for sending a parcel says: 1. Print the label  2. Ask for the address  3. Stick the label on. What is the problem?",
        options: [
          { id: "a", text: "It has too few steps" },
          { id: "b", text: "Step 1 uses the address before step 2 has collected it" },
          { id: "c", text: "Labels should be handwritten" },
          { id: "d", text: "There is no problem" },
        ],
        correct: "b",
        explanation:
          "A step cannot use information that has not been collected yet. The address must be input before the label containing it can be printed.",
        whyWrong: {
          a: "Three steps is enough for this task. The fault is the order, not the count.",
          c: "That changes the method, not the logic. A handwritten label still needs the address first.",
          d: "Printing a label before knowing the address produces a blank or wrong label.",
        },
      },
      {
        id: "jsq2-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-pseudocode",
        prompt: "What is pseudocode for?",
        options: [
          { id: "a", text: "Running programs faster" },
          { id: "b", text: "Designing the logic of a program without worrying about a language's syntax" },
          { id: "c", text: "Hiding code from other people" },
          { id: "d", text: "Replacing programming languages" },
        ],
        correct: "b",
        explanation:
          "Pseudocode is a structured plain-English notation for thinking about logic. Nothing runs it; it translates almost line for line into real code once the logic is right.",
        whyWrong: {
          a: "Nothing runs pseudocode, so it cannot make anything faster.",
          c: "Pseudocode is meant to be read by people, which is the opposite of hiding anything.",
          d: "Pseudocode is a design step before writing real code, not a substitute for it.",
        },
      },
      {
        id: "jsq2-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-pseudo-total",
        prompt:
          "SET a TO 500\nSET b TO 250\nSET total TO a + b\nSET a TO 1000\nOUTPUT total\n\nWhat is output?",
        options: [
          { id: "a", text: "750" },
          { id: "b", text: "1250" },
          { id: "c", text: "1000" },
          { id: "d", text: "500" },
        ],
        correct: "a",
        explanation:
          "total was calculated on line 3, when a was still 500, so it holds 750. Changing a afterwards does not go back and recalculate total.",
        whyWrong: {
          b: "This assumes total updates itself when a changes. It does not: total was stored once, as a value, on line 3.",
          c: "1000 is the new value of a, but the output is total, not a.",
          d: "500 was the original value of a, not the total.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l3-flowcharts": {
    lessonId: "js-l3-flowcharts",
    passMark: 70,
    questions: [
      {
        id: "jsq3-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-flow-symbols",
        prompt: "Which flowchart shape is used for a yes/no question?",
        options: [
          { id: "a", text: "Rectangle" },
          { id: "b", text: "Parallelogram" },
          { id: "c", text: "Diamond" },
          { id: "d", text: "Oval" },
        ],
        correct: "c",
        explanation: "The diamond is the decision symbol. It asks one question and has exactly two exits, Yes and No.",
        whyWrong: {
          a: "The rectangle is a process step: calculating or storing a value.",
          b: "The parallelogram is for input and output.",
          d: "The oval marks Start and End.",
        },
      },
      {
        id: "jsq3-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-flow-decision",
        prompt:
          "A voting flowchart's diamond asks \"age > 18?\". Someone who is exactly 18 uses it. What happens?",
        options: [
          { id: "a", text: "They are told they can vote" },
          { id: "b", text: "They are told they cannot vote yet, which is wrong" },
          { id: "c", text: "The flowchart stops working" },
          { id: "d", text: "It asks the question again" },
        ],
        correct: "b",
        explanation:
          "18 > 18 is false, so they follow the No arrow. The condition should be age >= 18. Testing the exact boundary value is how this bug is found.",
        whyWrong: {
          a: "18 is not greater than 18, so the Yes arrow is not taken.",
          c: "A flowchart always follows one arrow or the other. It gives a wrong answer rather than stopping.",
          d: "There is no loop in a voting flowchart. The No path leads to the output and then End.",
        },
      },
      {
        id: "jsq3-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-flow-repetition",
        prompt: "In a flowchart, what shows that steps are repeated?",
        options: [
          { id: "a", text: "A second Start symbol" },
          { id: "b", text: "An arrow that leads back to an earlier step" },
          { id: "c", text: "A larger rectangle" },
          { id: "d", text: "Writing the steps twice" },
        ],
        correct: "b",
        explanation:
          "Repetition is drawn as a flow line that returns to an earlier point, controlled by a decision that eventually sends the flow onward to End.",
        whyWrong: {
          a: "A flowchart has exactly one Start.",
          c: "Shape size has no meaning in a flowchart.",
          d: "Writing steps twice only repeats them twice. A loop repeats as many times as the condition requires.",
        },
      },
      {
        id: "jsq3-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-flow-repetition",
        prompt:
          "A loop sets count to 1, then repeatedly asks \"count <= 5?\" and outputs count. Nothing inside the loop changes count. What happens?",
        options: [
          { id: "a", text: "It outputs 1 to 5 and ends" },
          { id: "b", text: "It outputs 1 once and ends" },
          { id: "c", text: "It outputs 1 forever and never ends" },
          { id: "d", text: "It outputs nothing" },
        ],
        correct: "c",
        explanation:
          "count stays 1, so the question is answered Yes every time and the loop never exits. Something inside a loop must move it towards its exit condition.",
        whyWrong: {
          a: "That needs a step that adds 1 to count each time round. Without it, count never reaches 6.",
          b: "After outputting, the arrow loops back to the question, which is still Yes.",
          d: "1 <= 5 is true on the first check, so the output step runs.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l4-decomposition-thinking": {
    lessonId: "js-l4-decomposition-thinking",
    passMark: 70,
    questions: [
      {
        id: "jsq4-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-decomposition",
        prompt: "What is decomposition?",
        options: [
          { id: "a", text: "Deleting code that is no longer needed" },
          { id: "b", text: "Breaking a large problem into smaller problems that can be solved one at a time" },
          { id: "c", text: "Converting pseudocode into a flowchart" },
          { id: "d", text: "Making a program run faster" },
        ],
        correct: "b",
        explanation:
          "Decomposition breaks a problem down until each piece is simple enough to solve directly. Solving the pieces solves the whole.",
        whyWrong: {
          a: "That is removing dead code. Decomposition is about planning a solution, not cleaning one up.",
          c: "That is translating between notations. The logic stays the same size.",
          d: "Decomposition makes a problem easier to solve, not the program faster to run.",
        },
      },
      {
        id: "jsq4-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-computational-thinking",
        prompt:
          "When designing a grade calculator you decide to ignore the student's height and the date. Which computational thinking habit is that?",
        options: [
          { id: "a", text: "Decomposition" },
          { id: "b", text: "Pattern recognition" },
          { id: "c", text: "Abstraction" },
          { id: "d", text: "Debugging" },
        ],
        correct: "c",
        explanation:
          "Abstraction is deciding which details matter to the problem and ignoring the rest. Height and date do not affect a grade.",
        whyWrong: {
          a: "Decomposition is breaking the problem into parts, not choosing what to leave out.",
          b: "Pattern recognition is noticing similarity to a problem you have solved before.",
          d: "Debugging is finding where a program goes wrong. Nothing has gone wrong here.",
        },
      },
      {
        id: "jsq4-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-debugging-intro",
        prompt:
          "A program gives the wrong total. Which is the best first debugging step?",
        options: [
          { id: "a", text: "Rewrite the whole program from scratch" },
          { id: "b", text: "Change numbers at random until the total looks right" },
          { id: "c", text: "Trace it step by step and find the first step where the value differs from what you expected" },
          { id: "d", text: "Ask the user to enter different numbers" },
        ],
        correct: "c",
        explanation:
          "The first step that produces a wrong value is where the bug is. Everything after it is a consequence. Tracing finds it systematically.",
        whyWrong: {
          a: "You would probably make the same mistake again, because you never found out what it was.",
          b: "Random changes may hide the bug for one input and leave it for others.",
          d: "That avoids the bug rather than fixing it. Other users will still hit it.",
        },
      },
      {
        id: "jsq4-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-grade-design",
        prompt:
          "A grade algorithm checks \"average >= 50 → C\" first, then \"average >= 60 → B\", then \"average >= 70 → A\", using IF … ELSE IF. A student averages 85. What grade do they get?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
          { id: "c", text: "C" },
          { id: "d", text: "No grade" },
        ],
        correct: "c",
        explanation:
          "85 >= 50 is true, so the first branch runs and every ELSE IF after it is skipped. Checks must go from the highest band down so the first true condition is the right one.",
        whyWrong: {
          a: "The A check is never reached, because an earlier condition was already true.",
          b: "The B check is skipped for the same reason: 85 >= 50 was true first.",
          d: "A condition was true, so a grade was set. It was just the wrong one.",
        },
      },
    ],
  },
};
