/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 15 · ADVANCED PRODUCT DESIGN AND REAL-WORLD APPLICATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l61-product", [
    q({
      id: "uxq61-1", atom: "a-ux-product-design", d: 2,
      prompt: "A good product sits where three things overlap. Which three?",
      options: ["Desirable, viable and feasible", "Cheap, fast and pretty", "New, big and complex", "Popular, trendy and free"],
      correct: "a",
      explanation: "People want it, the business can sustain it, and it can be built.",
      wrong: { b: "Not the framework.", c: "Not the framework.", d: "Not the framework." },
    }),
    q({
      id: "uxq61-2", atom: "a-ux-ux-strategy", d: 2,
      prompt: "What question does product discovery answer?",
      options: ["Should we build this at all?", "Which font should we use?", "How fast is the server?", "Who designed the logo?"],
      correct: "a",
      explanation: "Discovery decides what is worth building before delivery builds it well.",
      wrong: { b: "A visual detail.", c: "Engineering.", d: "Irrelevant." },
    }),
    q({
      id: "uxq61-3", atom: "a-ux-requirements", d: 3,
      prompt: "Which is a non-functional requirement?",
      options: ["The home screen loads in under 3 seconds on 3G", "Users can save a beneficiary", "Users can download a statement", "Users can reset their PIN"],
      correct: "a",
      explanation: "Non-functional requirements describe how well the product works.",
      wrong: { b: "Functional: what it does.", c: "Functional.", d: "Functional." },
    }),
    q({
      id: "uxq61-4", atom: "a-ux-prioritisation", d: 3, type: "scenario",
      prompt: "A feature reaches 2,000 users, has impact 2, confidence 50% and effort 4. What is its RICE score?",
      options: ["500", "2,000", "8,000", "250"],
      correct: "a",
      explanation: "2,000 × 2 × 0.5 ÷ 4 = 500.",
      wrong: { b: "That is reach alone.", c: "Forgot confidence and effort.", d: "Divided by effort twice." },
    }),
    q({
      id: "uxq61-5", atom: "a-ux-prioritisation", d: 2,
      prompt: "What is a minimum viable product?",
      options: ["The smallest complete version that delivers real value and lets you learn", "A product with every feature", "A broken prototype", "A marketing website only"],
      correct: "a",
      explanation: "Minimal, but genuinely usable.",
      wrong: { b: "The opposite of minimal.", c: "Not viable.", d: "Not a product." },
    }),
  ]),

  ...check("ux-l62-domains", [
    q({
      id: "uxq62-1", atom: "a-ux-complex-dashboards", d: 2,
      prompt: "How should a complex dashboard present information?",
      options: ["Overview first, then drill down into detail", "Every number at once, at the same size", "Only charts, no numbers", "Detail first, overview hidden"],
      correct: "a",
      explanation: "Progressive disclosure keeps experts efficient.",
      wrong: { b: "Overwhelming.", c: "People need exact values too.", d: "Backwards." },
    }),
    q({
      id: "uxq62-2", atom: "a-ux-saas", d: 2,
      prompt: "What should SaaS onboarding aim for?",
      options: ["Getting people to their first moment of value quickly", "Showing every feature in a long tour", "Collecting as much data as possible", "Delaying use until training is complete"],
      correct: "a",
      explanation: "Early value drives retention.",
      wrong: { b: "Long tours are skipped and forgotten.", c: "Data collection delays value.", d: "Most people never come back." },
    }),
    q({
      id: "uxq62-3", atom: "a-ux-fintech", d: 3,
      prompt: "Which button label builds most trust on a transfer confirmation?",
      options: ["\"Send ₦5,010\"", "\"Continue\"", "\"Submit\"", "\"OK\""],
      correct: "a",
      explanation: "It says exactly what will happen, including the total.",
      wrong: { b: "Vague about what happens.", c: "Says nothing.", d: "Says nothing." },
    }),
    q({
      id: "uxq62-4", atom: "a-ux-ecommerce-experiences", d: 2,
      prompt: "Which trust signal matters especially for Nigerian online shoppers?",
      options: ["Pay on delivery and verified seller ratings", "An animated logo", "A long About page", "Dark mode"],
      correct: "a",
      explanation: "They reduce the risk shoppers feel.",
      wrong: { b: "Decorative.", c: "Rarely read.", d: "Not a trust signal." },
    }),
    q({
      id: "uxq62-5", atom: "a-ux-healthcare", d: 3,
      prompt: "What is alarm fatigue?",
      options: ["Too many low-value warnings training people to ignore all warnings", "Alarms that break", "Loud sounds in hospitals", "A medical condition"],
      correct: "a",
      explanation: "Reserve interruptions for critical risks.",
      wrong: { b: "Not the meaning.", c: "Not the meaning.", d: "Not the meaning." },
    }),
  ]),

  ...check("ux-l63-data", [
    q({
      id: "uxq63-1", atom: "a-ux-dataviz", d: 2,
      prompt: "Which chart best shows change over time?",
      options: ["A line chart", "A pie chart", "A scatter plot", "A table of categories"],
      correct: "a",
      explanation: "Lines show trends across time.",
      wrong: { b: "For parts of a whole.", c: "For relationships between two measures.", d: "Not a chart." },
    }),
    q({
      id: "uxq63-2", atom: "a-ux-dataviz", d: 3,
      prompt: "Why must a bar chart's axis start at zero?",
      options: ["Otherwise differences look much larger than they are", "Browsers require it", "It looks more modern", "It saves space"],
      correct: "a",
      explanation: "Bar length encodes the value; a cut axis exaggerates.",
      wrong: { b: "No such requirement.", c: "Honesty, not style.", d: "Not the reason." },
    }),
    q({
      id: "uxq63-3", atom: "a-ux-complex-forms", d: 2,
      prompt: "What helps most with a 48-field loan application?",
      options: ["Required documents listed at the start, short steps with progress, and saved progress", "Smaller fields", "One long page", "Removing the submit button"],
      correct: "a",
      explanation: "Preparation, structure and saved work prevent abandonment.",
      wrong: { b: "Harder to use.", c: "The cause of abandonment.", d: "Nonsense." },
    }),
    q({
      id: "uxq63-4", atom: "a-ux-large-datasets", d: 2,
      prompt: "What should a list of 3,204 transactions show near its top?",
      options: ["The total and current range, such as \"1–50 of 3,204\", with filters and search", "Nothing; people will scroll", "Only the first record", "A spinner"],
      correct: "a",
      explanation: "Orientation plus tools to narrow the list.",
      wrong: { b: "Thousands of rows need tools.", c: "Not useful.", d: "Not a list." },
    }),
  ]),

  ...check("ux-l64-ai", [
    q({
      id: "uxq64-1", atom: "a-ux-ai-interfaces", d: 3,
      prompt: "What should an AI feature never do without explicit human confirmation?",
      options: ["Take irreversible actions such as sending money", "Suggest a category", "Show a summary", "Offer a recommendation"],
      correct: "a",
      explanation: "AI can be wrong; irreversible actions need a human decision.",
      wrong: { b: "Low risk and correctable.", c: "Low risk.", d: "Low risk." },
    }),
    q({
      id: "uxq64-2", atom: "a-ux-conversational", d: 2,
      prompt: "What must every chatbot provide?",
      options: ["A way to reach a human when it cannot help", "A cartoon avatar", "Long, detailed answers", "A new name every day"],
      correct: "a",
      explanation: "Dead ends are dangerous, especially for urgent issues.",
      wrong: { b: "Optional.", c: "Short answers are better.", d: "Unhelpful." },
    }),
    q({
      id: "uxq64-3", atom: "a-ux-ai-states", d: 2,
      prompt: "Why show sources or citations with AI answers?",
      options: ["So people can check answers that might be wrong", "To make answers longer", "Because AI is always right", "To hide the AI"],
      correct: "a",
      explanation: "Verification supports appropriate trust.",
      wrong: { b: "Not the purpose.", c: "AI can be wrong.", d: "The opposite." },
    }),
    q({
      id: "uxq64-4", atom: "a-ux-ai-suggestions", d: 3, type: "scenario",
      prompt: "An AI tool generates a persona for your product. How should you treat it?",
      options: ["As a draft or hypothesis, not evidence; validate it against real research", "As evidence about your users", "As the final persona", "As useless"],
      correct: "a",
      explanation: "The AI has not met your users.",
      wrong: { b: "It is not based on your users.", c: "Untested.", d: "It can help you think, if validated." },
    }),
  ]),

  ...check("ux-l65-saas-dashboard", [
    q({
      id: "uxq65-1", atom: "a-ux-saas-anatomy", d: 2,
      prompt: "Where should destructive actions such as deleting a workspace live in SaaS settings?",
      options: ["In a separated danger zone, with confirmation", "Next to the Save button", "In the main navigation", "On the login screen"],
      correct: "a",
      explanation: "Separation and confirmation prevent disasters.",
      wrong: { b: "Invites accidents.", c: "Far too prominent.", d: "Wrong context." },
    }),
    q({
      id: "uxq65-2", atom: "a-ux-saas-anatomy", d: 2,
      prompt: "Which is part of a SaaS dashboard's navigation?",
      options: ["A sidebar with the current section highlighted", "A password reset form", "A billing invoice", "A KPI card"],
      correct: "a",
      explanation: "Navigation shows where you are and where you can go.",
      wrong: { b: "Authentication.", c: "Settings.", d: "Analytics." },
    }),
    q({
      id: "uxq65-3", atom: "a-ux-kpi-lab", d: 3,
      prompt: "Which KPI comparison works for everyone, including colour-blind users?",
      options: ["\"▲ 12% vs February\" in green", "A green number with no text", "A red dot", "A colour gradient"],
      correct: "a",
      explanation: "Arrow and words carry the meaning; colour emphasises.",
      wrong: { b: "Colour only.", c: "Colour only, and no number.", d: "Ambiguous." },
    }),
    q({
      id: "uxq65-4", atom: "a-ux-kpi-lab", d: 2,
      prompt: "What three things should a KPI card answer at a glance?",
      options: ["What is measured, the value, and whether it is better or worse than a comparison", "Who built it, when and why", "The colour, font and size", "The server, database and API"],
      correct: "a",
      explanation: "Label, value and change with context.",
      wrong: { b: "Irrelevant to users.", c: "Styling, not meaning.", d: "Engineering." },
    }),
  ]),
};
