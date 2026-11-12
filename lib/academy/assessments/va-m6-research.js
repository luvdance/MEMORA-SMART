/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 6 · RESEARCH AND DATA
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l35-search", [
    q({
      id: "va-q35-01", atom: "a-va-operators", d: 2,
      prompt: "Which search finds only pages on Nigerian government websites?",
      options: ["site:gov.ng import duty", "import duty gov", "\"gov.ng\" OR import", "import duty -gov.ng"],
      correct: "a",
      explanation: "site: limits results to one site or domain.",
      wrong: { b: "Just adds the word gov.", c: "Finds either term anywhere.", d: "Excludes government sites." },
    }),
    q({
      id: "va-q35-02", atom: "a-va-operators", d: 2,
      prompt: "What does the minus sign do in jaguar -car?",
      options: ["Excludes pages containing \"car\"", "Subtracts numbers", "Finds only cars", "Searches for the exact phrase"],
      correct: "a",
      explanation: "A minus sign excludes a word.",
      wrong: { b: "Not in search.", c: "The opposite.", d: "That is quotation marks." },
    }),
    q({
      id: "va-q35-03", atom: "a-va-operators", d: 2,
      prompt: "Which operator finds PDF documents?",
      options: ["filetype:pdf", "site:pdf", "intitle:pdf", "\"pdf\""],
      correct: "a",
      explanation: "filetype: restricts results to a file type.",
      wrong: { b: "site: needs a website.", c: "Finds the word in titles.", d: "Finds the word." },
    }),
    q({
      id: "va-q35-04", atom: "a-va-research-process", d: 2,
      prompt: "What should you record for each fact you find?",
      options: ["The source link and the date you checked it", "Only the fact", "Your mood", "The search engine's logo"],
      correct: "a",
      explanation: "Sources and dates let you and the client trust and recheck the fact.",
      wrong: { b: "Unverifiable.", c: "Irrelevant.", d: "Irrelevant." },
    }),
    q({
      id: "va-q35-05", atom: "a-va-research-process", d: 2,
      prompt: "How should a research summary begin?",
      options: ["With the answer to the client's question", "With how long you searched", "With a list of every website you visited", "With your opinion of the client"],
      correct: "a",
      explanation: "Answer first, then evidence and caveats.",
      wrong: { b: "Not useful.", c: "Belongs at the end, if at all.", d: "No." },
    }),
  ]),

  ...check("va-l36-credible", [
    q({
      id: "va-q36-01", atom: "a-va-craap", d: 2,
      prompt: "In the CRAAP test, \"Purpose\" asks…",
      options: ["Why the source exists: to inform, sell, persuade or entertain", "How long the page is", "Whether it has pictures", "Whether you like it"],
      correct: "a",
      explanation: "Selling or persuading sources are biased.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q36-02", atom: "a-va-cross-check", d: 2,
      prompt: "Which is a primary source for a hotel's room prices?",
      options: ["The hotel's own website", "A travel blog from 2019", "A WhatsApp message", "A friend's memory"],
      correct: "a",
      explanation: "The original source of the information.",
      wrong: { b: "Secondary and outdated.", c: "Unverified.", d: "Unreliable." },
    }),
    q({
      id: "va-q36-03", atom: "a-va-cross-check", d: 2,
      prompt: "You cannot confirm a venue's capacity. What do you report?",
      options: ["That it is unconfirmed and how you are confirming it", "Your best guess as fact", "Nothing", "The largest number you saw anywhere"],
      correct: "a",
      explanation: "Honest gaps protect the client.",
      wrong: { b: "Misleading.", c: "Hides a critical gap.", d: "Unverified." },
    }),
    q({
      id: "va-q36-04", atom: "a-va-craap", d: 2,
      prompt: "Why should important facts be checked in at least two independent sources?",
      options: ["To confirm accuracy, since any one source can be wrong", "To make the report longer", "Because search engines require it", "It is not necessary"],
      correct: "a",
      explanation: "Cross-checking catches errors.",
      wrong: { b: "Not the purpose.", c: "No.", d: "It is good practice." },
    }),
  ]),

  ...check("va-l37-market", [
    q({
      id: "va-q37-01", atom: "a-va-competitors", d: 2,
      prompt: "Why is a comparison table useful for competitor research?",
      options: ["The same columns for every competitor make differences easy to see", "It hides weak competitors", "Tables are required by law", "It replaces the need for sources"],
      correct: "a",
      explanation: "Like-for-like comparison reveals gaps.",
      wrong: { b: "No.", c: "No.", d: "Sources still matter." },
    }),
    q({
      id: "va-q37-02", atom: "a-va-market", d: 2,
      prompt: "In a SWOT analysis, which are external to the business?",
      options: ["Opportunities and threats", "Strengths and weaknesses", "Strengths and threats", "Weaknesses and opportunities"],
      correct: "a",
      explanation: "O and T are outside; S and W are inside.",
      wrong: { b: "Internal.", c: "Mixed.", d: "Mixed." },
    }),
    q({
      id: "va-q37-03", atom: "a-va-market", d: 3,
      prompt: "Which is an insight rather than a fact?",
      options: ["Food is a gap for study cafés: The Study Spot's reviews complain about limited food", "The Study Spot opens at 9:00", "Coffee costs ₦1,800", "Mama's Kitchen has 520 reviews"],
      correct: "a",
      explanation: "An insight says what the facts mean, with evidence.",
      wrong: { b: "A fact.", c: "A fact.", d: "A fact." },
    }),
    q({
      id: "va-q37-04", atom: "a-va-competitors", d: 2,
      prompt: "Why are customer reviews valuable in competitor research?",
      options: ["They show what customers praise and complain about", "They are always accurate", "They replace visiting the business", "They show the owner's salary"],
      correct: "a",
      explanation: "Reviews reveal strengths and gaps.",
      wrong: { b: "Some are fake or extreme.", c: "Not entirely.", d: "No." },
    }),
  ]),

  ...check("va-l38-leads", [
    q({
      id: "va-q38-01", atom: "a-va-icp", d: 2,
      prompt: "What is an ideal customer profile (ICP)?",
      options: ["The criteria describing the customers a client wants", "A customer's social media profile picture", "A list of current customers' passwords", "A type of invoice"],
      correct: "a",
      explanation: "The ICP defines who qualifies as a lead.",
      wrong: { b: "No.", c: "Never.", d: "No." },
    }),
    q({
      id: "va-q38-02", atom: "a-va-icp", d: 2,
      prompt: "Why qualify leads before adding them to a list?",
      options: ["A short list of good leads is worth more than a long list of poor ones", "To make the list look longer", "Qualifying is illegal", "It is not needed"],
      correct: "a",
      explanation: "Sales time is expensive; spend it on real prospects.",
      wrong: { b: "The opposite.", c: "No.", d: "It is the core of the job." },
    }),
    q({
      id: "va-q38-03", atom: "a-va-contact-list", d: 2,
      prompt: "You cannot find a contact's email. What do you do?",
      options: ["Leave it blank or use the company's published address, and note it", "Guess firstname@company", "Buy a list of emails", "Use their personal Gmail from a friend"],
      correct: "a",
      explanation: "Never guess or buy personal data.",
      wrong: { b: "Guesses bounce or reach the wrong person.", c: "Bought lists break privacy law and trust.", d: "A privacy breach." },
    }),
    q({
      id: "va-q38-04", atom: "a-va-contact-list", d: 2,
      prompt: "Which privacy practice applies when building contact lists?",
      options: ["Collect only business contact details for a legitimate purpose and honour requests not to be contacted", "Collect everything you can find", "Scrape personal phone numbers from social media", "Ignore opt-out requests"],
      correct: "a",
      explanation: "Laws such as the NDPA and GDPR require this.",
      wrong: { b: "Breaks data minimisation.", c: "Illegal in many places.", d: "Illegal and unprofessional." },
    }),
  ]),

  ...check("va-l39-data", [
    q({
      id: "va-q39-01", atom: "a-va-data-collect", d: 2,
      prompt: "Why use a form instead of collecting answers by email?",
      options: ["Answers go straight into a spreadsheet, one row per response", "Forms are more colourful", "Emails cannot hold answers", "Forms hide the data"],
      correct: "a",
      explanation: "Structured collection makes analysis easy.",
      wrong: { b: "Not the reason.", c: "They can, but messily.", d: "No." },
    }),
    q({
      id: "va-q39-02", atom: "a-va-countif", d: 2,
      prompt: "Which formula counts the Yes answers in D2:D11?",
      options: ["=COUNTIF(D2:D11,\"Yes\")", "=SUM(D2:D11)", "=COUNT(D2:D11)", "=IF(D2:D11,\"Yes\")"],
      correct: "a",
      explanation: "COUNTIF counts cells that match a criterion.",
      wrong: { b: "SUM adds numbers.", c: "COUNT counts numbers, not text.", d: "Not a valid count." },
    }),
    q({
      id: "va-q39-03", atom: "a-va-percent", d: 3,
      prompt: "6 of 10 customers rated 4 or more. What does the share formula return before percent formatting?",
      options: ["0.6", "6", "60", "10"],
      correct: "a",
      explanation: "6 ÷ 10 = 0.6, shown as 60% when formatted.",
      wrong: { b: "That is the count.", c: "Only after multiplying by 100.", d: "That is the total." },
    }),
    q({
      id: "va-q39-04", atom: "a-va-reporting", d: 2,
      prompt: "Which chart shows a trend over six months best?",
      options: ["A line chart", "A pie chart", "A 3D pie chart", "No chart at all"],
      correct: "a",
      explanation: "Line charts show change over time.",
      wrong: { b: "For parts of a whole.", c: "Distorts.", d: "The trend is harder to see." },
    }),
  ]),

  ...check("va-l40-verify-crm", [
    q({
      id: "va-q40-01", atom: "a-va-verify", d: 2,
      prompt: "A lead's email domain does not match its website. What should you do?",
      options: ["Flag it as unverified and confirm the right email from the company's own website or by phone", "Include it as is", "Invent a matching email", "Delete every lead from that area"],
      correct: "a",
      explanation: "Mismatches may be wrong or fraudulent; verify.",
      wrong: { b: "Risks contacting the wrong company.", c: "Guessing.", d: "Overreaction." },
    }),
    q({
      id: "va-q40-02", atom: "a-va-crm", d: 1,
      prompt: "In a database, what is a record?",
      options: ["One row: one item, such as one contact", "One column", "The whole database", "A backup file"],
      correct: "a",
      explanation: "Records are rows; fields are columns.",
      wrong: { b: "That is a field.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q40-03", atom: "a-va-crm", d: 2,
      prompt: "A quote has been sent and the prospect has not replied yet. Which pipeline stage?",
      options: ["Proposal sent", "Won", "New lead", "Lost"],
      correct: "a",
      explanation: "The proposal is with the prospect.",
      wrong: { b: "They have not agreed.", c: "Contact has been made.", d: "No reply yet is not a no." },
    }),
    q({
      id: "va-q40-04", atom: "a-va-crm", d: 2,
      prompt: "What is Airtable?",
      options: ["A flexible database that looks like a spreadsheet, with typed fields and views", "An airline booking site", "A video call tool", "An email client"],
      correct: "a",
      explanation: "Airtable combines spreadsheet ease with database structure.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q40-05", atom: "a-va-verify", d: 2,
      prompt: "Which is a sign of a duplicate record?",
      options: ["Two companies with the same website and phone number", "Two companies in the same city", "Two companies with four-star ratings", "Two companies that both sell dental chairs"],
      correct: "a",
      explanation: "Same website and phone means the same business.",
      wrong: { b: "Common.", c: "Coincidence.", d: "Competitors, not duplicates." },
    }),
  ]),

  ...check("va-l41-practical", [
    q({
      id: "va-q41-01", atom: "a-va-m6-method", d: 2,
      prompt: "Why keep an \"Excluded\" list with reasons?",
      options: ["It shows the client your judgement and avoids researching the same business twice", "To make the file bigger", "Clients like long lists", "It is not useful"],
      correct: "a",
      explanation: "Transparency and efficiency.",
      wrong: { b: "No.", c: "Quality matters more.", d: "It is." },
    }),
    q({
      id: "va-q41-02", atom: "a-va-m6-practical", d: 2,
      prompt: "A clinic in the directory is marked \"Permanently closed\" on Google Maps. What do you do?",
      options: ["Exclude it and note the reason", "Include it; it may reopen", "Include it without the note", "Call it a hot lead"],
      correct: "a",
      explanation: "Closed businesses fail the criteria.",
      wrong: { b: "Wastes sales time.", c: "Misleading.", d: "No." },
    }),
    q({
      id: "va-q41-03", atom: "a-va-m6-method", d: 2,
      prompt: "What should be stated at the top of a lead list?",
      options: ["The source, the criteria and the date checked", "Your favourite song", "The client's bank details", "Nothing"],
      correct: "a",
      explanation: "Context makes the list trustworthy and reusable.",
      wrong: { b: "No.", c: "Never.", d: "Context is needed." },
    }),
    q({
      id: "va-q41-04", atom: "a-va-m6-practical", d: 2,
      prompt: "Which lead fails Nadia's criteria?",
      options: ["A clinic with an Instagram page but no website", "A private clinic in Yaba with its own website", "A clinic in Lekki with matching email and website", "A clinic open on Saturdays"],
      correct: "a",
      explanation: "The criteria require the clinic's own website.",
      wrong: { b: "Fits.", c: "Fits.", d: "Opening days are not a criterion." },
    }),
  ]),
};

export default ASSESSMENTS;
