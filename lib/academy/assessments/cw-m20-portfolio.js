/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 20 · PORTFOLIO AND CAPSTONE
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l76-portfolio", [
    q({
      id: "cw-q76-01", atom: "a-cw-portfolio-defined", d: 1,
      prompt: "What is a professional writing portfolio?",
      options: ["A curated collection of your best, most relevant work, presented for a specific reader", "Everything you have ever written", "Your CV", "A list of courses"],
      correct: "a",
      explanation: "Curated, focused and easy to navigate.",
      wrong: { b: "Not curated.", c: "A CV describes; a portfolio proves.", d: "Not work samples." },
    }),
    q({
      id: "cw-q76-02", atom: "a-cw-portfolio-defined", d: 2,
      prompt: "Can practice pieces for fictional businesses go in a beginner's portfolio?",
      options: ["Yes, if they are clearly labelled as practice projects", "No, never", "Yes, presented as real client work", "Only if they are poems"],
      correct: "a",
      explanation: "Honest labelling keeps your credibility.",
      wrong: { b: "They are acceptable when starting.", c: "Dishonest.", d: "Irrelevant." },
    }),
    q({
      id: "cw-q76-03", atom: "a-cw-selecting-samples", d: 2,
      prompt: "Why include only your best work?",
      options: ["One weak piece lowers the reader's opinion of the rest", "Portfolios have a legal page limit", "Clients only read one piece", "Good work is rare"],
      correct: "a",
      explanation: "Quality over quantity.",
      wrong: { b: "No such limit.", c: "They may read several.", d: "Not the reason." },
    }),
    q({
      id: "cw-q76-04", atom: "a-cw-portfolio-categories", d: 2,
      prompt: "How should you choose your portfolio's categories?",
      options: ["By how your target reader thinks: discipline, format or industry", "Alphabetically by title", "By the date you wrote them only", "By word count"],
      correct: "a",
      explanation: "Make it easy for your reader to find what they need.",
      wrong: { b: "Unhelpful.", c: "Relevance matters more.", d: "Unhelpful." },
    }),
    q({
      id: "cw-q76-05", atom: "a-cw-presenting-projects", d: 2,
      prompt: "Which detail belongs with each portfolio piece?",
      options: ["Its category, client or \"practice project\", a short description and the date", "Your full life story", "Every certificate you hold", "Your salary expectation"],
      correct: "a",
      explanation: "Context helps a busy reader understand the piece.",
      wrong: { b: "Irrelevant.", c: "Irrelevant here.", d: "Not for a portfolio." },
    }),
  ]),

  ...check("cw-l77-showcase", [
    q({
      id: "cw-q77-01", atom: "a-cw-project-descriptions", d: 2,
      prompt: "What structure works best for a project description?",
      options: ["Challenge, approach, result", "Introduction, body, conclusion only", "Price, date, signature", "Keywords only"],
      correct: "a",
      explanation: "It shows how you think, not just what you wrote.",
      wrong: { b: "Too generic.", c: "Not a description.", d: "Not a description." },
    }),
    q({
      id: "cw-q77-02", atom: "a-cw-writing-range", d: 2,
      prompt: "How can you check that your portfolio shows range?",
      options: ["Read the first lines of each piece in sequence: they should not all sound the same", "Count the pages", "Check the fonts", "Use only one format"],
      correct: "a",
      explanation: "Different registers, formats and voices should be visible.",
      wrong: { b: "Not range.", c: "Not range.", d: "The opposite of range." },
    }),
    q({
      id: "cw-q77-03", atom: "a-cw-show-content", d: 2,
      prompt: "What context makes an SEO article sample more impressive?",
      options: ["The target keyword, its ranking or traffic, and the sources used", "The font size", "How long it took to type", "The writer's star sign"],
      correct: "a",
      explanation: "Show what it achieved and how it was built.",
      wrong: { b: "Irrelevant.", c: "Irrelevant.", d: "Irrelevant." },
    }),
    q({
      id: "cw-q77-04", atom: "a-cw-show-copy", d: 3,
      prompt: "A client asked you not to share their campaign figures. How do you showcase the copy?",
      options: ["Show the copy with permission and explain your approach without the figures", "Share the figures anyway", "Invent new figures", "Claim a competitor's results"],
      correct: "a",
      explanation: "Confidentiality first; your approach is still evidence.",
      wrong: { b: "Breaks trust.", c: "Dishonest.", d: "Dishonest." },
    }),
    q({
      id: "cw-q77-05", atom: "a-cw-show-professional", d: 2,
      prompt: "How can you show a confidential business report in your portfolio?",
      options: ["Anonymise it with permission, or use a clearly labelled practice document", "Post it as it is", "Describe it without any sample", "Change only the date"],
      correct: "a",
      explanation: "Protect clients while proving your skill.",
      wrong: { b: "Breaches confidentiality.", c: "Readers need to see writing.", d: "Still identifiable." },
    }),
  ]),

  ...check("cw-l78-online", [
    q({
      id: "cw-q78-01", atom: "a-cw-online-portfolio", d: 2,
      prompt: "What should the home page of an online portfolio say first?",
      options: ["Who you are and who you help, in one line", "Your full biography", "A welcome message", "Your date of birth"],
      correct: "a",
      explanation: "Visitors decide in seconds whether you fit their need.",
      wrong: { b: "Too long for the first line.", c: "Says nothing.", d: "Irrelevant." },
    }),
    q({
      id: "cw-q78-02", atom: "a-cw-presenting-work", d: 2,
      prompt: "In an interview, how many portfolio pieces should you prepare to discuss in depth?",
      options: ["About three, chosen for that employer", "Every piece you have", "None", "Only one, always the longest"],
      correct: "a",
      explanation: "Select the most relevant and tell their stories well.",
      wrong: { b: "Too many.", c: "Unprepared.", d: "Relevance matters more than length." },
    }),
    q({
      id: "cw-q78-03", atom: "a-cw-tests-interviews", d: 2,
      prompt: "What does STAR stand for in interview answers?",
      options: ["Situation, Task, Action, Result", "Story, Talent, Ambition, Reward", "Start, Talk, Answer, Repeat", "Skill, Training, Attitude, Role"],
      correct: "a",
      explanation: "A structure for clear, evidence-based answers.",
      wrong: { b: "Not STAR.", c: "Not STAR.", d: "Not STAR." },
    }),
    q({
      id: "cw-q78-04", atom: "a-cw-tests-interviews", d: 3,
      prompt: "What most often causes candidates to fail writing tests?",
      options: ["Not following the brief: wrong length, tone or format", "Using paragraphs", "Writing in English", "Submitting on time"],
      correct: "a",
      explanation: "Tests check whether you can follow a brief under time pressure.",
      wrong: { b: "Expected.", c: "Expected.", d: "A good thing." },
    }),
  ]),

  ...check("cw-l79-capstone", [
    q({
      id: "cw-q79-01", atom: "a-cw-capstone-brief", d: 2,
      prompt: "Why write all ten capstone pieces for one business?",
      options: ["It shows range in one consistent voice with consistent facts, like real client work", "It is quicker", "Businesses only need one piece", "So the pieces can be identical"],
      correct: "a",
      explanation: "Real clients need many kinds of writing in one voice.",
      wrong: { b: "Not the purpose.", c: "They need many.", d: "Each piece has its own job." },
    }),
    q({
      id: "cw-q79-02", atom: "a-cw-capstone-content", d: 3,
      prompt: "In the capstone SEO article, where must the target keyword appear?",
      options: ["In the headline, the meta title and the first 100 words, then naturally", "In every sentence", "Only in the sources", "Nowhere"],
      correct: "a",
      explanation: "Key places, then natural writing (Module 6).",
      wrong: { b: "Stuffing.", c: "Wrong place.", d: "Then it cannot rank." },
    }),
    q({
      id: "cw-q79-03", atom: "a-cw-capstone-copy", d: 3,
      prompt: "Your ad, landing page and emails all promote one offer. What must stay consistent across them?",
      options: ["The offer, its deadline and the call to action", "The exact wording of every sentence", "The length", "The number of emojis"],
      correct: "a",
      explanation: "Message match and one consistent offer.",
      wrong: { b: "Each channel needs its own words.", c: "Channels differ.", d: "Irrelevant." },
    }),
    q({
      id: "cw-q79-04", atom: "a-cw-capstone-professional", d: 3,
      prompt: "A report shows installations above target but installation time above target too. How should the summary present this?",
      options: ["State both results honestly, then recommend how to fix the delay", "Mention only the good news", "Mention only the bad news", "Leave out the numbers"],
      correct: "a",
      explanation: "Reports are objective and actionable.",
      wrong: { b: "Hides a problem.", c: "Unbalanced.", d: "Numbers are the evidence." },
    }),
    q({
      id: "cw-q79-05", atom: "a-cw-capstone-portfolio", d: 2,
      prompt: "What should your capstone portfolio page end with?",
      options: ["A clear way to contact you and when you will reply", "A list of your hobbies", "Nothing", "Your full CV pasted in"],
      correct: "a",
      explanation: "Every portfolio needs a call to action.",
      wrong: { b: "Irrelevant.", c: "Missed opportunity.", d: "Link it instead." },
    }),
  ]),
};

export default ASSESSMENTS;
