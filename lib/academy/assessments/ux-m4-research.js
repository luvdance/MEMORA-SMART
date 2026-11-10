/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 4 · USER RESEARCH AND ANALYSIS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l15-research-intro", [
    q({
      id: "uxq15-1", atom: "a-ux-research-intro", d: 2,
      prompt: "What does evaluative research answer?",
      options: ["Whether a design works for the people using it", "What product the company should build", "How much the product will earn", "Which colours are fashionable"],
      correct: "a",
      explanation: "Evaluative research tests designs; exploratory research decides what to build.",
      wrong: { b: "That is exploratory research.", c: "That is a business forecast.", d: "Not a research question about users." },
    }),
    q({
      id: "uxq15-2", atom: "a-ux-research-matters", d: 2,
      prompt: "What is the main risk of skipping user research?",
      options: ["Building the wrong thing and discovering it only after development", "The design will look old-fashioned", "Developers will refuse to work", "The app will load slowly"],
      correct: "a",
      explanation: "Research cheaply reduces the risk of costly rework.",
      wrong: { b: "Research is not about style.", c: "Unrelated.", d: "Performance is a separate matter." },
    }),
    q({
      id: "uxq15-3", atom: "a-ux-qual-quant", d: 2,
      prompt: "Which is a quantitative method?",
      options: ["A survey with fixed answers sent to 300 people", "An hour-long interview", "Watching a trader at her stall", "A diary study with written entries"],
      correct: "a",
      explanation: "Fixed answers from many people produce numbers.",
      wrong: { b: "Interviews are qualitative.", c: "Observation is qualitative.", d: "Diary entries are qualitative." },
    }),
    q({
      id: "uxq15-4", atom: "a-ux-primary-secondary", d: 2,
      prompt: "Reading a published report on mobile money use in Nigeria is which kind of research?",
      options: ["Secondary research", "Primary research", "Usability testing", "A/B testing"],
      correct: "a",
      explanation: "Someone else gathered the data; you are reusing it.",
      wrong: { b: "Primary research is gathered by you.", c: "No users are tested.", d: "No variants are compared." },
    }),
  ]),

  ...check("ux-l16-interviews", [
    q({
      id: "uxq16-1", atom: "a-ux-interviews", d: 3,
      prompt: "Which is the best interview question?",
      options: ["Tell me about the last time you paid a bill online.", "Would you use an app that pays bills?", "Don't you find bill payment frustrating?", "Do you pay bills online?"],
      correct: "a",
      explanation: "Open and about real past behaviour.",
      wrong: { b: "Hypothetical: people predict their behaviour poorly.", c: "Leading: it suggests the answer.", d: "Closed: yes or no." },
    }),
    q({
      id: "uxq16-2", atom: "a-ux-interviews", d: 2,
      prompt: "During an interview, who should do most of the talking?",
      options: ["The participant", "The interviewer", "Both equally", "A note-taker"],
      correct: "a",
      explanation: "Listen far more than you talk; follow up with why and examples.",
      wrong: { b: "Talking more leads and biases the participant.", c: "The point is to hear their experience.", d: "Note-takers observe; they do not lead." },
    }),
    q({
      id: "uxq16-3", atom: "a-ux-surveys", d: 3,
      prompt: "What is wrong with the question \"How fast and reliable is our app?\"",
      options: ["It asks two things at once and assumes they are positive", "It is too short", "Surveys cannot ask about apps", "Nothing"],
      correct: "a",
      explanation: "Ask one neutral thing per question.",
      wrong: { b: "Length is not the issue.", c: "They can.", d: "It is double-barrelled and leading." },
    }),
    q({
      id: "uxq16-4", atom: "a-ux-observation", d: 2,
      prompt: "Why observe people instead of only asking them?",
      options: ["What people say they do and what they actually do often differ", "Observation is faster to analyse", "People refuse interviews", "Observation needs no permission"],
      correct: "a",
      explanation: "Watching reveals hesitations and workarounds people do not report.",
      wrong: { b: "Not necessarily faster.", c: "Most people agree to interviews.", d: "Permission is always required." },
    }),
  ]),

  ...check("ux-l17-market-feedback", [
    q({
      id: "uxq17-1", atom: "a-ux-competitor-analysis", d: 2,
      prompt: "For a school-fees app, paying cash at the bursary is which kind of competitor?",
      options: ["An indirect competitor", "A direct competitor", "Not a competitor", "A supplier"],
      correct: "a",
      explanation: "It solves the same need in a different way.",
      wrong: { b: "Direct competitors are similar products.", c: "Users choose it instead of your product, so it competes.", d: "It supplies nothing to you." },
    }),
    q({
      id: "uxq17-2", atom: "a-ux-market-research", d: 2,
      prompt: "Which market research finding most directly changes a design?",
      options: ["Most target users have mid-range Android phones and intermittent data", "The company's competitors raised money", "The market is growing", "The office has new furniture"],
      correct: "a",
      explanation: "Devices and connectivity shape screen sizes, performance and fallbacks.",
      wrong: { b: "Interesting, but not a design constraint.", c: "Context, not a design decision.", d: "Irrelevant." },
    }),
    q({
      id: "uxq17-3", atom: "a-ux-pain-points", d: 3,
      prompt: "How should pain points be prioritised?",
      options: ["By frequency and severity together", "By frequency alone", "By whichever is easiest to fix", "Alphabetically"],
      correct: "a",
      explanation: "A rare blocker can outrank a common annoyance.",
      wrong: { b: "Ignores how much each one hurts.", c: "Ease matters but does not decide importance alone.", d: "Meaningless." },
    }),
    q({
      id: "uxq17-4", atom: "a-ux-feedback", d: 3, type: "scenario",
      prompt: "5 of 12 respondents pay by bank transfer. What percentage is that, to one decimal place?",
      options: ["41.7%", "5.0%", "58.3%", "12.0%"],
      correct: "a",
      explanation: "5 ÷ 12 × 100 = 41.67, so 41.7%.",
      wrong: { b: "That is the count, not a percentage.", c: "That is the share NOT paying by transfer.", d: "That is the total number of respondents." },
    }),
  ]),

  ...check("ux-l18-findings", [
    q({
      id: "uxq18-1", atom: "a-ux-research-documentation", d: 2,
      prompt: "How should participants be described in a research report?",
      options: ["Anonymised, by what matters to the research, such as \"P3, final-year student who drives\"", "By full name and phone number", "Not at all", "By how much they liked the idea"],
      correct: "a",
      explanation: "Anonymous IDs protect privacy while showing who was represented.",
      wrong: { b: "That breaks privacy.", c: "Readers need to know who was asked.", d: "Liking is not a description." },
    }),
    q({
      id: "uxq18-2", atom: "a-ux-research-bias", d: 3,
      prompt: "A designer only notices interview quotes that support their idea. Which bias is this?",
      options: ["Confirmation bias", "Sampling bias", "Recency bias", "Social desirability bias"],
      correct: "a",
      explanation: "Seeing only the evidence that confirms what you believe.",
      wrong: { b: "That concerns who was recruited.", c: "That overweights the latest data.", d: "That is participants giving nice answers." },
    }),
    q({
      id: "uxq18-3", atom: "a-ux-findings-decisions", d: 2,
      prompt: "Which is a design decision rather than a finding?",
      options: ["Show the driver's verified student ID before the ride", "Safety at night is the main worry (P2, P4, P5)", "Students care about cost", "Most participants travel daily"],
      correct: "a",
      explanation: "A decision says what the design will do.",
      wrong: { b: "That is a finding with evidence.", c: "A finding.", d: "A finding." },
    }),
    q({
      id: "uxq18-4", atom: "a-ux-research-tools", d: 2,
      prompt: "Which tool is best for clustering interview notes into themes with your team?",
      options: ["FigJam", "Google Forms", "A calculator", "A code editor"],
      correct: "a",
      explanation: "FigJam's sticky notes make affinity mapping easy and collaborative.",
      wrong: { b: "Forms collect survey data.", c: "Not for qualitative synthesis.", d: "Not a research tool." },
    }),
    q({
      id: "uxq18-5", atom: "a-ux-report-lab", d: 2,
      prompt: "Why should a research report include limitations?",
      options: ["So readers know how far to trust the findings and what to research next", "To make the report longer", "Because the client asked for bad news", "To excuse poor work"],
      correct: "a",
      explanation: "Honest limits make findings more credible, not less.",
      wrong: { b: "Length is not the purpose.", c: "It is about accuracy.", d: "It shows rigour, not excuses." },
    }),
  ]),
};
