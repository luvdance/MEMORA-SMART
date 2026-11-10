/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 11 · USABILITY TESTING AND UX EVALUATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l45-usability", [
    q({
      id: "uxq45-1", atom: "a-ux-usability", d: 2,
      prompt: "Which is one of Nielsen's five components of usability?",
      options: ["Learnability", "Profitability", "Colourfulness", "Popularity"],
      correct: "a",
      explanation: "Learnability, efficiency, memorability, errors and satisfaction.",
      wrong: { b: "A business measure.", c: "Not a usability component.", d: "Not a usability component." },
    }),
    q({
      id: "uxq45-2", atom: "a-ux-testing-fundamentals", d: 2,
      prompt: "About how many participants typically reveal most serious usability problems in one round?",
      options: ["About five", "About fifty", "One", "Two hundred"],
      correct: "a",
      explanation: "Several small rounds beat one large one.",
      wrong: { b: "Diminishing returns after about five.", c: "One person misses many problems.", d: "Far more than qualitative testing needs." },
    }),
    q({
      id: "uxq45-3", atom: "a-ux-moderated-remote", d: 2,
      prompt: "What is the main weakness of unmoderated testing?",
      options: ["You cannot ask follow-up questions to learn why", "It is very expensive", "It needs a lab", "It cannot be recorded"],
      correct: "a",
      explanation: "Nobody is there to probe behaviour.",
      wrong: { b: "Usually cheaper.", c: "It happens anywhere.", d: "Tools record sessions." },
    }),
    q({
      id: "uxq45-4", atom: "a-ux-scenarios-objectives", d: 3,
      prompt: "Which is the best usability test scenario?",
      options: ["\"Your cousin needs ₦5,000 for transport today. Send it to his GTBank account.\"", "\"Click Transfer, then tap Add beneficiary.\"", "\"Find the blue button at the bottom.\"", "\"Do you like the transfer screen?\""],
      correct: "a",
      explanation: "A realistic goal with context, in the user's words.",
      wrong: { b: "Gives away the path and labels.", c: "Gives away the answer.", d: "An opinion question, not a task." },
    }),
  ]),

  ...check("ux-l46-metrics", [
    q({
      id: "uxq46-1", atom: "a-ux-completion-rate", d: 2,
      prompt: "7 of 10 participants complete a task. What is the completion rate?",
      options: ["70%", "7%", "30%", "17%"],
      correct: "a",
      explanation: "7 ÷ 10 × 100 = 70%.",
      wrong: { b: "That is the count, not a percentage.", c: "That is the failure rate.", d: "Not a valid calculation." },
    }),
    q({
      id: "uxq46-2", atom: "a-ux-time-on-task", d: 3,
      prompt: "Why report the median time on task alongside the mean?",
      options: ["A few slow participants pull the mean up, while the median resists them", "The median is always larger", "The mean cannot be calculated", "Stakeholders prefer odd numbers"],
      correct: "a",
      explanation: "Task times are skewed.",
      wrong: { b: "Usually smaller with skewed data.", c: "It can.", d: "Irrelevant." },
    }),
    q({
      id: "uxq46-3", atom: "a-ux-satisfaction", d: 3,
      prompt: "How is a SUS score calculated?",
      options: ["Odd items: answer − 1; even items: 5 − answer; add them and multiply by 2.5", "Add all ten answers", "Average the answers and multiply by 20", "Count the 5s"],
      correct: "a",
      explanation: "This gives a score from 0 to 100.",
      wrong: { b: "Ignores the alternating wording.", c: "Not the SUS formula.", d: "Not the formula." },
    }),
    q({
      id: "uxq46-4", atom: "a-ux-think-aloud", d: 2,
      prompt: "In think-aloud testing, what should the facilitator say when a participant goes quiet?",
      options: ["\"What are you thinking now?\"", "\"The button is at the bottom.\"", "\"You're doing it wrong.\"", "Nothing, ever"],
      correct: "a",
      explanation: "Neutral prompts keep people talking without leading.",
      wrong: { b: "Leading; spoils the result.", c: "Blames the participant.", d: "A gentle prompt is appropriate." },
    }),
    q({
      id: "uxq46-5", atom: "a-ux-ab-testing", d: 3, type: "scenario",
      prompt: "Version A converts 10% of visitors and version B converts 12%. What is B's relative improvement?",
      options: ["20%", "2%", "12%", "120%"],
      correct: "a",
      explanation: "(12 − 10) ÷ 10 × 100 = 20%.",
      wrong: { b: "That is the difference in percentage points.", c: "That is B's rate.", d: "That is B as a percentage of A." },
    }),
  ]),

  ...check("ux-l47-heuristics", [
    q({
      id: "uxq47-1", atom: "a-ux-heuristic-evaluation", d: 2,
      prompt: "What does a severity rating of 4 mean in a heuristic evaluation?",
      options: ["A usability catastrophe that must be fixed before release", "A cosmetic issue", "Not a problem", "A minor, low-priority issue"],
      correct: "a",
      explanation: "0 none, 1 cosmetic, 2 minor, 3 major, 4 catastrophe.",
      wrong: { b: "That is 1.", c: "That is 0.", d: "That is 2." },
    }),
    q({
      id: "uxq47-2", atom: "a-ux-nielsen-heuristics", d: 3,
      prompt: "A button labelled \"Initiate TRX\" breaks which heuristic?",
      options: ["2: Match between system and the real world", "1: Visibility of system status", "7: Flexibility and efficiency", "10: Help and documentation"],
      correct: "a",
      explanation: "It uses system jargon instead of the user's words.",
      wrong: { b: "That is about feedback.", c: "That is about shortcuts.", d: "That is about help content." },
    }),
    q({
      id: "uxq47-3", atom: "a-ux-nielsen-heuristics", d: 3,
      prompt: "Making users re-type a meter number from the previous screen breaks which heuristic?",
      options: ["6: Recognition rather than recall", "8: Aesthetic and minimalist design", "4: Consistency and standards", "3: User control and freedom"],
      correct: "a",
      explanation: "Show the information instead of making people remember it.",
      wrong: { b: "About irrelevant content.", c: "About sameness and conventions.", d: "About exits and undo." },
    }),
    q({
      id: "uxq47-4", atom: "a-ux-accessibility-evaluation", d: 2,
      prompt: "Which manual check belongs in an accessibility evaluation?",
      options: ["Using the product with the keyboard only", "Checking the logo colour", "Counting the pages", "Measuring server speed"],
      correct: "a",
      explanation: "Keyboard access and visible focus need human checking.",
      wrong: { b: "Not an accessibility check.", c: "Unrelated.", d: "Performance, not accessibility." },
    }),
  ]),

  ...check("ux-l48-analysis", [
    q({
      id: "uxq48-1", atom: "a-ux-analysing-results", d: 2,
      prompt: "What does a \"rainbow spreadsheet\" help you see?",
      options: ["Which participants hit which issues, so patterns stand out", "The colour palette", "The project budget", "The release dates"],
      correct: "a",
      explanation: "One colour per participant reveals shared issues.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." },
    }),
    q({
      id: "uxq48-2", atom: "a-ux-prioritising-issues", d: 3, type: "scenario",
      prompt: "An issue was hit by 3 of 5 participants and has severity 4. Another was hit by 4 and has severity 3. Using frequency × severity with ties broken by severity, which comes first?",
      options: ["The severity-4 issue: both score 12, and its severity is higher", "The frequency-4 issue, because more people hit it", "They are equal, so neither", "Whichever was found first"],
      correct: "a",
      explanation: "3 × 4 = 12 and 4 × 3 = 12; the tie goes to severity.",
      wrong: { b: "The tie rule favours severity.", c: "Ties are broken, not ignored.", d: "Order found is irrelevant." },
    }),
    q({
      id: "uxq48-3", atom: "a-ux-iterative-improvements", d: 2,
      prompt: "Why retest with new participants after fixing issues?",
      options: ["To confirm the fixes work and catch new problems, with people who do not already know the tasks", "Because old participants refuse", "To make the report longer", "Because the law requires it"],
      correct: "a",
      explanation: "Fresh participants give a fair test of the new design.",
      wrong: { b: "Not the reason.", c: "Not the purpose.", d: "No such law." },
    }),
    q({
      id: "uxq48-4", atom: "a-ux-iterative-improvements", d: 2,
      prompt: "Why keep a log of every test round?",
      options: ["To show improvement over time and support case studies", "To slow the project down", "Because Figma requires it", "To replace the design files"],
      correct: "a",
      explanation: "Before-and-after metrics prove design impact.",
      wrong: { b: "Not the purpose.", c: "It does not.", d: "It complements them." },
    }),
  ]),
};
