/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 5 · BLOGS, ARTICLES AND EDITORIAL
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l16-blogs", [
    q({
      id: "cw-q16-01", atom: "a-cw-blogs", d: 1,
      prompt: "Why do businesses run blogs?",
      options: [
        "To attract visitors, answer customers' questions and show expertise",
        "Because websites must have one by law",
        "To publish their legal terms",
        "To replace customer service entirely",
      ],
      correct: "a",
      explanation: "A blog draws search and social traffic and builds trust over time.",
      wrong: { b: "No such law.", c: "Legal terms have their own pages.", d: "It supports service; it does not replace it." },
    }),
    q({
      id: "cw-q16-02", atom: "a-cw-post-vs-article", d: 2,
      prompt: "Which is more typical of an article than a blog post?",
      options: ["Interviews, data and several viewpoints, edited by someone else", "First-person, casual tone", "Published on the company's own blog", "Written mainly for search traffic"],
      correct: "a",
      explanation: "Articles are usually researched to editorial standards and edited by a publication.",
      wrong: { b: "Typical of blog posts.", c: "Typical of blog posts.", d: "Typical of business blog posts." },
    }),
    q({
      id: "cw-q16-03", atom: "a-cw-topics", d: 2,
      prompt: "What makes a blog topic relevant?",
      options: [
        "It meets an audience need, uses the business's expertise and connects to what it offers",
        "It is trending on X today",
        "The writer finds it interesting",
        "It has never been written about anywhere",
      ],
      correct: "a",
      explanation: "Relevance sits where audience need, expertise and offer overlap.",
      wrong: { b: "Trends can help but are not enough.", c: "The reader's interest matters more.", d: "Covered topics can still be written better." },
    }),
    q({
      id: "cw-q16-04", atom: "a-cw-headlines", d: 2,
      prompt: "Why keep a headline under about 70 characters?",
      options: ["So it displays fully in search results", "Because long headlines are illegal", "So it fits on a business card", "Search engines reject longer ones"],
      correct: "a",
      explanation: "Longer titles are often cut off in search results.",
      wrong: { b: "No such rule.", c: "Not the reason.", d: "They are truncated, not rejected." },
    }),
    q({
      id: "cw-q16-05", atom: "a-cw-hooks-intro", d: 3,
      prompt: "Which opening line works best for a post for market traders about record keeping?",
      options: [
        "\"You sold well today. So why is there so little left in your purse?\"",
        "\"Since time immemorial, commerce has existed.\"",
        "\"This article will discuss bookkeeping.\"",
        "\"Bookkeeping is the systematic recording of financial transactions.\"",
      ],
      correct: "a",
      explanation: "A familiar scene in second person makes the reader feel the piece is about them.",
      wrong: { b: "A warm-up cliché.", c: "Announces instead of hooking.", d: "A textbook definition, not a hook." },
    }),
  ]),

  ...check("cw-l17-arguments", [
    q({
      id: "cw-q17-01", atom: "a-cw-arguments", d: 2,
      prompt: "What does PEEL stand for?",
      options: ["Point, Evidence, Explain, Link", "Problem, Example, End, List", "Persuade, Engage, Educate, Lead", "Plan, Edit, Edit, Launch"],
      correct: "a",
      explanation: "A paragraph structure for arguments.",
      wrong: { b: "Not PEEL.", c: "Not PEEL.", d: "Not PEEL." },
    }),
    q({
      id: "cw-q17-02", atom: "a-cw-arguments", d: 3,
      prompt: "\"Shops with POS terminals sell more, so installing a POS will increase your sales.\" What is the logical risk?",
      options: ["Treating correlation as cause", "Attacking the person", "A false choice", "There is no risk"],
      correct: "a",
      explanation: "Busier shops may install POS; the data shows association, not proof of cause.",
      wrong: { b: "No person is attacked.", c: "No either/or is presented.", d: "The causal leap is the risk." },
    }),
    q({
      id: "cw-q17-03", atom: "a-cw-headings", d: 2,
      prompt: "In Markdown, which line is an H2 section heading?",
      options: ["## Step 1: Find where your units go", "# Step 1", "### Step 1", "- Step 1"],
      correct: "a",
      explanation: "\"## \" is H2; \"# \" is the title; \"### \" is H3; \"- \" is a bullet.",
      wrong: { b: "That is the H1 title level.", c: "That is a subsection (H3).", d: "That is a bullet point." },
    }),
    q({
      id: "cw-q17-04", atom: "a-cw-long-short", d: 2,
      prompt: "What should decide an article's length?",
      options: ["The reader's need", "A fixed company rule of 2,000 words", "The writer's fee", "How many keywords you want"],
      correct: "a",
      explanation: "A short question deserves a short answer; a complex topic needs depth.",
      wrong: { b: "Rules that ignore the topic produce padding.", c: "Length should not be inflated for pay.", d: "Keywords do not justify padding." },
    }),
    q({
      id: "cw-q17-05", atom: "a-cw-evidence", d: 3,
      prompt: "Which presentation of a statistic is clearest for small shop owners?",
      options: [
        "\"18% higher sales: about ₦90,000 more a month for a shop selling ₦500,000\"",
        "\"Sales were significantly higher\"",
        "\"An 18 percentage-point differential in revenue metrics\"",
        "\"Sales went up a lot, according to research\"",
      ],
      correct: "a",
      explanation: "A sourced figure translated into the reader's own money is easiest to feel.",
      wrong: { b: "Vague.", c: "Jargon, and percentage points are not the same as percent.", d: "Vague and unsourced." },
    }),
  ]),

  ...check("cw-l18-formats", [
    q({
      id: "cw-q18-01", atom: "a-cw-opinion", d: 2,
      prompt: "What must an opinion piece still get right?",
      options: ["Its facts: only the conclusion is opinion", "Nothing: it is only opinion", "Its length must be exactly 500 words", "It must avoid taking a position"],
      correct: "a",
      explanation: "Opinions may differ; facts used to support them must be true.",
      wrong: { b: "False facts discredit the argument.", c: "Lengths vary by publication.", d: "Taking a position is the point." },
    }),
    q({
      id: "cw-q18-02", atom: "a-cw-how-to", d: 2,
      prompt: "Which is the best step in a how-to guide?",
      options: [
        "\"4. Enter your NIN and click Continue. You will receive a code by SMS.\"",
        "\"The NIN should be entered by the user at this stage.\"",
        "\"Next, various details are required.\"",
        "\"Enter everything and then do the rest.\"",
      ],
      correct: "a",
      explanation: "Numbered, one action, starts with a verb, and shows what success looks like.",
      wrong: { b: "Passive and slow.", c: "Vague.", d: "Not one clear action." },
    }),
    q({
      id: "cw-q18-03", atom: "a-cw-listicles-reviews", d: 2,
      prompt: "What makes a product review trustworthy?",
      options: [
        "A described test, specific results, pros and cons, and disclosure of any free product or payment",
        "Only positive adjectives",
        "A five-star rating every time",
        "Copying the manufacturer's description",
      ],
      correct: "a",
      explanation: "Readers trust evidence and honesty.",
      wrong: { b: "Adjectives are not evidence.", c: "A constant rating is meaningless.", d: "That is advertising, not a review." },
    }),
    q({
      id: "cw-q18-04", atom: "a-cw-listicles-reviews", d: 3,
      prompt: "You have five strong tips. The client wants \"10 tips\". What is best?",
      options: [
        "Explain that five strong tips beat ten padded ones, or research five more genuinely useful tips",
        "Add five weak tips to reach ten",
        "Repeat five tips in different words",
        "Call it 10 tips but list five",
      ],
      correct: "a",
      explanation: "The number must be honest and every item useful.",
      wrong: { b: "Weak items lower the whole piece.", c: "Readers notice repetition.", d: "That is a broken promise." },
    }),
  ]),

  ...check("cw-l19-editorial", [
    q({
      id: "cw-q19-01", atom: "a-cw-editorial-calendar", d: 1,
      prompt: "What is an editorial calendar?",
      options: ["The plan of what will be published, when, where and by whom", "A list of public holidays", "An invoice schedule", "A style guide"],
      correct: "a",
      explanation: "It turns content plans into dated, owned tasks.",
      wrong: { b: "Holidays are only one input.", c: "Unrelated.", d: "A style guide sets standards, not dates." },
    }),
    q({
      id: "cw-q19-02", atom: "a-cw-editorial-calendar", d: 2,
      prompt: "Why plan content around salary dates and holidays?",
      options: ["Readers' needs and attention change with their calendar", "Search engines require it", "It makes posts longer", "Holidays are the only time people read"],
      correct: "a",
      explanation: "Payday content lands best on payday; festive content needs to be ready in advance.",
      wrong: { b: "Not a requirement.", c: "Unrelated to length.", d: "People read all year." },
    }),
    q({
      id: "cw-q19-03", atom: "a-cw-consistency", d: 2,
      prompt: "Which schedule is better for building an audience?",
      options: ["One good post every week for a year", "Ten posts in one month, then nothing for five months", "Whenever the writer feels inspired", "Daily for one week only"],
      correct: "a",
      explanation: "Readers and search engines learn to expect a sustainable rhythm.",
      wrong: { b: "Bursts and silence lose readers.", c: "Unpredictable.", d: "Not sustained." },
    }),
    q({
      id: "cw-q19-04", atom: "a-cw-m5-practical", d: 3,
      prompt: "Your notes say \"LED bulbs use about 75% less electricity than old filament bulbs\". Which sentence is accurate?",
      options: [
        "According to the Home Energy Guide, LED bulbs use about 75% less electricity than old filament bulbs.",
        "LED bulbs cut your whole electricity bill by 75%.",
        "LEDs use no electricity at all.",
        "LEDs are 75% brighter.",
      ],
      correct: "a",
      explanation: "It keeps what was measured (bulb use, not the whole bill) and names the source.",
      wrong: { b: "Changes what the figure measures.", c: "False.", d: "Changes the measure from energy to brightness." },
    }),
  ]),
};

export default ASSESSMENTS;
