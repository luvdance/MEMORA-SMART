/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 6 · SEO CONTENT WRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l20-search", [
    q({
      id: "cw-q20-01", atom: "a-cw-seo-intro", d: 1,
      prompt: "Which part of SEO is mainly the writer's job?",
      options: ["On-page SEO: topics, intent, keywords, headings, titles, links", "Server speed", "Buying links from other sites", "Setting up https certificates"],
      correct: "a",
      explanation: "Writers control what the page says and how it is structured.",
      wrong: { b: "Technical SEO, usually developers.", c: "Buying links breaks search guidelines.", d: "Technical SEO." },
    }),
    q({
      id: "cw-q20-02", atom: "a-cw-crawl-index-rank", d: 2,
      prompt: "In which stage does a search engine analyse and store a page in its catalogue?",
      options: ["Indexing", "Crawling", "Ranking", "Publishing"],
      correct: "a",
      explanation: "Crawling finds pages, indexing stores and understands them, ranking orders them for a search.",
      wrong: { b: "Crawling discovers and downloads.", c: "Ranking orders results for a query.", d: "Publishing is the site owner's step." },
    }),
    q({
      id: "cw-q20-03", atom: "a-cw-crawl-index-rank", d: 2,
      prompt: "What does E-E-A-T stand for?",
      options: ["Experience, expertise, authoritativeness, trustworthiness", "Engagement, editing, accuracy, timing", "Every element always tagged", "Easy, effective, attractive, timely"],
      correct: "a",
      explanation: "Signals of helpful, credible content.",
      wrong: { b: "Not E-E-A-T.", c: "Not E-E-A-T.", d: "Not E-E-A-T." },
    }),
    q({
      id: "cw-q20-04", atom: "a-cw-search-intent", d: 2,
      prompt: "\"best phone under ₦200,000\" is mainly which intent?",
      options: ["Commercial investigation", "Navigational", "Transactional", "Informational only"],
      correct: "a",
      explanation: "\"Best\" signals comparing options before buying.",
      wrong: { b: "No specific site is named.", c: "They are not yet buying a specific item.", d: "They want to choose, not just learn." },
    }),
    q({
      id: "cw-q20-05", atom: "a-cw-keyword-research", d: 3,
      prompt: "Which keyword should a new local tailoring business target first?",
      options: ["\"tailor for native wear in ikeja\"", "\"fashion\"", "\"clothes\"", "\"style\""],
      correct: "a",
      explanation: "Specific, relevant, local intent, and realistic to rank for.",
      wrong: { b: "Too broad and competitive.", c: "Too broad.", d: "Too broad, unclear intent." },
    }),
  ]),

  ...check("cw-l21-keywords", [
    q({
      id: "cw-q21-01", atom: "a-cw-primary-secondary", d: 2,
      prompt: "Why should two pages on one site not target the same primary keyword?",
      options: ["They compete with each other and weaken both", "It is illegal", "Search engines delete both pages", "Readers cannot open two pages"],
      correct: "a",
      explanation: "This is called cannibalisation; one strong page beats two weak ones.",
      wrong: { b: "Not a legal issue.", c: "They are not deleted, but compete.", d: "Irrelevant." },
    }),
    q({
      id: "cw-q21-02", atom: "a-cw-long-tail", d: 2,
      prompt: "Which is a long-tail keyword?",
      options: ["how to register a small business in nigeria", "business", "nigeria", "register"],
      correct: "a",
      explanation: "Longer, specific, clear intent, lower competition.",
      wrong: { b: "Head term.", c: "Head term.", d: "Single word." },
    }),
    q({
      id: "cw-q21-03", atom: "a-cw-placement", d: 2,
      prompt: "Which is NOT a key place for the primary keyword?",
      options: ["Every sentence of the article", "The H1", "The meta title", "The first 100 words"],
      correct: "a",
      explanation: "Key places matter; repetition is stuffing.",
      wrong: { b: "A key place.", c: "A key place.", d: "A key place." },
    }),
    q({
      id: "cw-q21-04", atom: "a-cw-seo-headlines", d: 3,
      prompt: "Which SEO headline is strongest for the keyword \"how to start poultry farming\"?",
      options: [
        "How to Start Poultry Farming: A Beginner's Guide for 2026",
        "Poultry",
        "My Thoughts on Agriculture",
        "Poultry Farming Poultry Farming Guide Poultry",
      ],
      correct: "a",
      explanation: "Keyword near the start, matches intent, specific audience and freshness.",
      wrong: { b: "Vague.", c: "No keyword, no promise.", d: "Stuffed and unreadable." },
    }),
  ]),

  ...check("cw-l22-onpage", [
    q({
      id: "cw-q22-01", atom: "a-cw-meta", d: 2,
      prompt: "What length should a meta description usually be?",
      options: ["120 to 160 characters", "10 to 20 characters", "500 to 600 characters", "Exactly 60 words"],
      correct: "a",
      explanation: "Longer descriptions are cut off in results.",
      wrong: { b: "Too short to persuade.", c: "Would be truncated.", d: "Characters, not words, and far too long." },
    }),
    q({
      id: "cw-q22-02", atom: "a-cw-meta", d: 3,
      prompt: "Does the meta description directly improve rankings?",
      options: ["Not directly, but it strongly affects whether people click", "Yes, it is the main ranking factor", "It hides the page from search", "Only if it repeats the keyword ten times"],
      correct: "a",
      explanation: "It is a click-earning summary, not a direct ranking signal.",
      wrong: { b: "It is not.", c: "It does not hide anything.", d: "That is stuffing." },
    }),
    q({
      id: "cw-q22-03", atom: "a-cw-slugs", d: 2,
      prompt: "Which slug is best?",
      options: ["/services/office-cleaning-lagos", "/services/Office_Cleaning_Lagos!", "/services/page?id=8812", "/services/the-best-and-most-affordable-office-cleaning-in-all-of-lagos-2026"],
      correct: "a",
      explanation: "Short, lowercase, hyphenated, descriptive.",
      wrong: { b: "Capitals, underscores and punctuation.", c: "Meaningless.", d: "Padded and dated." },
    }),
    q({
      id: "cw-q22-04", atom: "a-cw-heading-hierarchy", d: 2,
      prompt: "How many H1 headings should a page have?",
      options: ["One", "Two", "One per paragraph", "None"],
      correct: "a",
      explanation: "One H1, the on-page headline; sections use H2 and H3.",
      wrong: { b: "Confuses the main topic.", c: "Far too many.", d: "Every page needs a main heading." },
    }),
    q({
      id: "cw-q22-05", atom: "a-cw-alt-text", d: 3,
      prompt: "Which alt text is best for a photo of a nurse checking a patient's blood pressure at a clinic?",
      options: [
        "Nurse checking an older man's blood pressure at a community clinic",
        "Image of nurse",
        "nurse nurse clinic blood pressure nigeria best clinic",
        "photo123.jpg",
      ],
      correct: "a",
      explanation: "Describes what matters, concisely, without \"image of\" or stuffing.",
      wrong: { b: "Starts with \"image of\" and says little.", c: "Keyword stuffing.", d: "A file name, not a description." },
    }),
  ]),

  ...check("cw-l23-optimise", [
    q({
      id: "cw-q23-01", atom: "a-cw-seo-readability", d: 2,
      prompt: "What makes a page relevant in a lasting way?",
      options: ["Completely answering the search the way an expert would", "Repeating the keyword often", "Making the page as long as possible", "Using many images"],
      correct: "a",
      explanation: "Completeness and helpfulness, not repetition or length.",
      wrong: { b: "That is stuffing.", c: "Padding hurts.", d: "Images help only when useful." },
    }),
    q({
      id: "cw-q23-02", atom: "a-cw-updating", d: 3,
      prompt: "Search Console shows a page appears in many searches but few people click. What should you try first?",
      options: ["Rewrite the meta title and description to match intent and give a reason to click", "Delete the page", "Add the keyword fifty times", "Change the URL every week"],
      correct: "a",
      explanation: "Seen but not clicked usually means the search result does not persuade.",
      wrong: { b: "The page is already earning impressions.", c: "Stuffing.", d: "Changing URLs breaks links." },
    }),
    q({
      id: "cw-q23-03", atom: "a-cw-stuffing", d: 2,
      prompt: "What is keyword stuffing?",
      options: ["Repeating a keyword unnaturally to try to rank", "Using one keyword in the title", "Researching keywords", "Writing long-tail keywords"],
      correct: "a",
      explanation: "It is treated as spam and makes text unreadable.",
      wrong: { b: "Normal placement.", c: "Research is good practice.", d: "Long-tail targeting is good practice." },
    }),
    q({
      id: "cw-q23-04", atom: "a-cw-seo-tools", d: 2,
      prompt: "Which free tool shows which searches your own pages appear for and how many clicks they get?",
      options: ["Google Search Console", "Google Trends", "Canva", "Microsoft Word"],
      correct: "a",
      explanation: "Search Console reports your site's search performance.",
      wrong: { b: "Trends shows interest over time, not your pages.", c: "A design tool.", d: "A word processor." },
    }),
    q({
      id: "cw-q23-05", atom: "a-cw-m6-practical", d: 3,
      prompt: "An 800-word article uses its 4-word keyword 12 times. What share of the words is the keyword?",
      options: ["6%: likely stuffing", "1.5%: fine", "12%", "0.5%"],
      correct: "a",
      explanation: "12 × 4 = 48 words; 48 ÷ 800 = 6%, well above the 2–3% warning sign.",
      wrong: { b: "That would be 3 uses.", c: "Counts uses, not words.", d: "Far too low." },
    }),
  ]),
};

export default ASSESSMENTS;
