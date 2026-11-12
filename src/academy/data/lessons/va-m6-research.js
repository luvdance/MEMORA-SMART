/**
 * VIRTUAL ASSISTANT · MODULE 6 · ONLINE RESEARCH AND DATA MANAGEMENT
 *
 * Curriculum 6.1 – 6.10 and the practical 6.P. Research and advanced
 * search, credible sources, competitor and market research, lead generation
 * and contact lists, data collection, analysis and reporting, verification,
 * and databases and CRMs; then a verified list of 20 leads.
 *
 * All businesses, people and websites in this module are invented for
 * practice and use the reserved .example domain.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s6-research";

/* ── Survey data for lesson 39 ─────────────────────────────────────────── */
const SURVEY = {
  A1: "Customer", B1: "City", C1: "Rating (1–5)", D1: "Would recommend",
  A2: "Ada", B2: "Lagos", C2: 5, D2: "Yes",
  A3: "Bayo", B3: "Abuja", C3: 4, D3: "Yes",
  A4: "Chika", B4: "Lagos", C4: 2, D4: "No",
  A5: "Dapo", B5: "Ibadan", C5: 5, D5: "Yes",
  A6: "Efe", B6: "Lagos", C6: 3, D6: "No",
  A7: "Femi", B7: "Abuja", C7: 4, D7: "Yes",
  A8: "Gift", B8: "Port Harcourt", C8: 1, D8: "No",
  A9: "Hauwa", B9: "Kano", C9: 5, D9: "Yes",
  A10: "Ike", B10: "Lagos", C10: 4, D10: "Yes",
  A11: "Joy", B11: "Abuja", C11: 3, D11: "Yes",
  F1: "Measure", G1: "Result",
};
const SURVEY_LOCK = Object.keys(SURVEY).filter((k) => /^[A-D]/.test(k) || k === "F1" || k === "G1");

/* ── The practical's directory: 20 good entries and 6 problems ──────────── */
const GOOD = [
  ["Bright Smile Dental Clinic", "Lekki", "brightsmile", "803 111 2001", "Opened a second branch in 2025"],
  ["Pearl Dental Clinic", "Ikeja GRA", "pearldental", "805 222 3002", "Offers orthodontics; 4.7 stars, 210 reviews"],
  ["Victoria Island Dental Studio", "Victoria Island", "videntalstudio", "809 333 4003", "Corporate clients; open Saturdays"],
  ["Surulere Family Dentistry", "Surulere", "surulerefamilydental", "802 444 5004", "Family practice; children's dentistry"],
  ["Yaba Tooth Centre", "Yaba", "yabatooth", "806 555 6005", "Near UNILAG; student discounts"],
  ["Gbagada Dental Care", "Gbagada", "gbagadadental", "807 666 7006", "Implants and crowns"],
  ["Ajah Smile Studio", "Ajah", "ajahsmile", "808 777 8007", "New clinic, opened 2026"],
  ["Magodo Dental Practice", "Magodo", "magododental", "810 888 9008", "Three dentists on staff"],
  ["Festac Dental Clinic", "Festac", "festacdental", "811 999 1009", "Long-established, since 2004"],
  ["Ikoyi Aesthetic Dentistry", "Ikoyi", "ikoyiaesthetic", "812 101 2010", "Cosmetic and whitening focus"],
  ["Maryland Dental Hub", "Maryland", "marylanddentalhub", "813 202 3011", "Online booking on website"],
  ["Ogudu Dental Clinic", "Ogudu", "ogududental", "814 303 4012", "Emergency dental service"],
  ["Ilupeju Smile Clinic", "Ilupeju", "ilupejusmile", "815 404 5013", "Accepts HMO patients"],
  ["Lekki Phase 1 Dental", "Lekki Phase 1", "lekkiphase1dental", "816 505 6014", "Modern digital X-ray"],
  ["Ojodu Dental Centre", "Ojodu", "ojodudental", "817 606 7015", "Weekend clinics"],
  ["Apapa Dental Services", "Apapa", "apapadental", "818 707 8016", "Serves port companies' staff"],
  ["Ikorodu Smile Care", "Ikorodu", "ikorodusmile", "819 808 9017", "Growing practice, hiring"],
  ["Oniru Dental Lounge", "Oniru", "onirudental", "901 909 1018", "Premium clinic; spa-style"],
  ["Ketu Dental Clinic", "Ketu", "ketudental", "902 121 2019", "Budget-friendly"],
  ["Sangotedo Dental Studio", "Sangotedo", "sangotedodental", "903 232 3020", "Recently renovated"],
];

const ROW = (n, g) => `| ${n} | ${g[0]} | https://www.${g[2]}.example | info@${g[2]}.example | +234 ${g[3]} | ${g[1]}, Lagos | ${g[4]} |`;

const DIRECTORY = [
  ROW(1, GOOD[0]), ROW(2, GOOD[1]), ROW(3, GOOD[2]),
  "| 4 | Lekki Dental Centre | https://www.lekkidentalcentre.example | info@lekkidentalcentre.example | +234 804 555 1111 | Lekki, Lagos | Google Maps: *Permanently closed* (March 2026) |",
  ROW(5, GOOD[3]), ROW(6, GOOD[4]), ROW(7, GOOD[5]),
  "| 8 | Pearl Dental Clinic Ltd | https://www.pearldental.example | hello@pearldental.example | +234 805 222 3002 | Ikeja GRA, Lagos | Same website and phone as entry 2 |",
  ROW(9, GOOD[6]), ROW(10, GOOD[7]), ROW(11, GOOD[8]),
  "| 12 | Lagos State General Hospital Dental Unit | https://www.lasgh-dental.example | dental@lasgh-dental.example | +234 701 000 1212 | Ikeja, Lagos | Public hospital department, not a private clinic |",
  ROW(13, GOOD[9]), ROW(14, GOOD[10]), ROW(15, GOOD[11]),
  "| 16 | Abuja Smiles Dental | https://www.abujasmiles.example | info@abujasmiles.example | +234 809 444 1616 | Wuse 2, Abuja | |",
  ROW(17, GOOD[12]), ROW(18, GOOD[13]), ROW(19, GOOD[14]),
  "| 20 | Toothcare Plus | (none found) | toothcareplus22@gmail.com | +234 806 777 2020 | Mushin, Lagos | Instagram page only |",
  ROW(21, GOOD[15]), ROW(22, GOOD[16]), ROW(23, GOOD[17]),
  "| 24 | Royal Dental Studio | https://www.royaldentalstudio.example | sales@cheap-dental-deals.example | +234 808 999 2424 | Lekki, Lagos | |",
  ROW(25, GOOD[18]), ROW(26, GOOD[19]),
].join("\n");

const LEADS_BRIEF = `Your client is **Nadia Hassan**, owner of **SmileBright Supplies**, which sells dental equipment and materials. She wants a **verified list of 20 private dental clinics in Lagos that have their own website**, so her sales team can contact them.

You searched Google Maps and a business directory and collected these 26 entries (a practice source; every business here is invented). **Six of them should not be on her list.** Check each entry against her criteria and verify the details: is it open, private, in Lagos, with its own website, and does the email domain match the website?

| # | Company | Website | Email | Phone | Area | Notes |
|---|---|---|---|---|---|---|
${DIRECTORY}`;

const LEADS_DOC = `# SmileBright Supplies: verified leads, Lagos dental clinics

- Source: Google Maps and business directory (practice source), checked April 2026
- Criteria: private dental clinic, open, in Lagos, own website, matching email domain

## Leads

| # | Company | Website | Email | Phone | Area | Notes |
|---|---|---|---|---|---|---|

## Excluded

[List each entry you excluded and why.]
`;

const LEADS_DONE = `# SmileBright Supplies: verified leads, Lagos dental clinics

- Source: Google Maps and business directory (practice source), checked April 2026
- Criteria: private dental clinic, open, in Lagos, own website, matching email domain

## Leads

| # | Company | Website | Email | Phone | Area | Notes |
|---|---|---|---|---|---|---|
${GOOD.map((g, i) => ROW(i + 1, g)).join("\n")}

## Excluded

- Lekki Dental Centre: permanently closed.
- Pearl Dental Clinic Ltd: duplicate of Pearl Dental Clinic (same website and phone).
- Lagos State General Hospital Dental Unit: a public hospital, not a private clinic.
- Abuja Smiles Dental: in Abuja, not Lagos.
- Toothcare Plus: no website.
- Royal Dental Studio: email domain does not match the website; could not verify.
`;

/* ── Lesson 37 lab: competitor research ───────────────────────────────── */
const COMP_BRIEF = `Your client, **Tola Martins**, is about to open **Brew & Bloom**, a café in **Yaba, Lagos**, aimed at students and remote workers. She asks you to research the three main competitors nearby. Your research notes (a practice source; businesses invented):

- **Café Neo-Style Yaba**: coffee ₦2,500–₦3,800; free Wi-Fi with a 1-hour limit; 4.1 stars from 380 Google reviews (complaints: slow service, few sockets); Instagram 12,000 followers, posts twice a week; open 8:00–20:00.
- **The Study Spot**: coffee ₦1,800–₦2,800; unlimited Wi-Fi, many sockets, quiet rules; 4.6 stars from 150 reviews (praise: quiet, cheap; complaints: limited food); Instagram 3,100 followers, rarely posts; open 9:00–22:00.
- **Mama's Kitchen & Coffee**: coffee ₦1,500–₦2,200; no Wi-Fi; 4.3 stars from 520 reviews (praise: big portions of local food; complaints: noisy); Instagram 8,400 followers, posts daily food videos; open 7:00–21:00.`;

const COMP_DOC = `# Competitor research: cafés near Yaba

## Comparison

| Competitor | Coffee price (₦) | Wi-Fi | Rating | Instagram |
|---|---|---|---|---|

## Insights

## Recommendation
`;

const COMP_DONE = `# Competitor research: cafés near Yaba

## Comparison

| Competitor | Coffee price (₦) | Wi-Fi | Rating | Instagram |
|---|---|---|---|---|
| Café Neo-Style Yaba | 2,500–3,800 | Free, 1-hour limit | 4.1 (380 reviews) | 12,000 followers, twice a week |
| The Study Spot | 1,800–2,800 | Unlimited, many sockets | 4.6 (150 reviews) | 3,100 followers, rarely posts |
| Mama's Kitchen & Coffee | 1,500–2,200 | None | 4.3 (520 reviews) | 8,400 followers, daily videos |

## Insights

- Remote workers value Wi-Fi and sockets: The Study Spot has the best rating (4.6), and Café Neo-Style's reviews complain about too few sockets.
- Food is a gap for study cafés: The Study Spot's reviews (4.6 stars) complain about limited food, while Mama's Kitchen wins on food but has no Wi-Fi and is noisy.
- Regular Instagram content builds a following: Mama's Kitchen posts daily videos and has 8,400 followers, while The Study Spot rarely posts and has 3,100.

## Recommendation

Brew & Bloom should combine The Study Spot's unlimited Wi-Fi and sockets with a proper food menu, price coffee between ₦1,800 and ₦2,800, and post on Instagram at least three times a week.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 6.1 – 6.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l35-search",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2"],
    title: "Online Research and Advanced Search",
    subtitle: "A research process, and search techniques that find the right answer fast",
    estimatedMinutes: 40,
    intro:
      "\"Can you find out…\" is one of the most common requests a VA hears. Fast, reliable research is a skill, and most people never learn it properly.",

    atoms: [
      {
        id: "a-va-research-process",
        title: "Understanding online research",
        explain:
          "Online research is finding, checking and summarising information to answer a client's question. Follow a process. 1. Define the question exactly and how the answer will be used (\"three venues in Abuja for 80 people under ₦1.5 million, for a decision on Friday\"). 2. Plan keywords and where to look (Google, Google Maps, LinkedIn, official websites, news, directories). 3. Search, using the techniques below. 4. Evaluate each source (next lesson). 5. Record what you find as you go, with the source link and the date you checked it, in a sheet or document. 6. Summarise: the answer first, then the options or evidence, then any gaps or caveats. Set a time limit and tell the client if the answer does not exist or needs paid access, rather than searching for hours.",
      },
      {
        id: "a-va-operators",
        title: "Search engine techniques and advanced Google searches",
        explain:
          "Search operators make Google precise. Quotation marks find an exact phrase: \"dental clinic\". site: searches one website or kind of website: site:linkedin.com, site:gov.ng, site:.edu. filetype: finds documents: filetype:pdf annual report. A minus sign excludes a word: jaguar -car. OR (in capitals) finds either word: caterer OR catering. intitle: requires a word in the page title. before:2025-01-01 and after: limit by date, as does Tools > Any time. Combine them: site:linkedin.com/in \"operations manager\" Lagos logistics. For local businesses use Google Maps (it shows ratings, opening hours and whether a place is closed); for people and companies, LinkedIn; for news, Google News; for academic sources, Google Scholar.",
        table: {
          caption: "Google search operators.",
          headers: ["Operator", "Example", "Finds"],
          rows: [
            ["\" \"", "\"event venue\" Abuja", "The exact phrase"],
            ["site:", "site:gov.ng import duty", "Only that site or domain"],
            ["filetype:", "filetype:pdf solar market Nigeria", "Only that file type"],
            ["-", "apple -iphone", "Excludes a word"],
            ["OR", "caterer OR catering Ibadan", "Either word"],
            ["intitle:", "intitle:\"price list\" cement", "The word in the page title"],
            ["after: / before:", "fintech funding after:2025-06-01", "Pages from that period"],
          ],
        },
      },
      {
        id: "a-va-search-desk",
        title: "Choosing the best search",
        explain:
          "For each research request, choose the search that will find the answer fastest.",
        deskLab: {
          app: "research",
          title: "Research requests",
          task: "Choose the best search for each request.",
          fields: [{ key: "query", label: "Best search", type: "select" }],
          items: [
            { id: "q1", title: "Find official Nigerian government guidance on import duty", options: { query: ["site:gov.ng import duty", "import duty", "\"import\" OR \"duty\"", "import duty -nigeria"] }, expect: { query: "site:gov.ng import duty" }, why: "site:gov.ng limits results to official Nigerian government sites." },
            { id: "q2", title: "Find PDF reports about the Nigerian solar market", options: { query: ["filetype:pdf solar market Nigeria", "solar market Nigeria pictures", "site:pdf solar", "\"solar\" -Nigeria"] }, expect: { query: "filetype:pdf solar market Nigeria" } },
            { id: "q3", title: "Find operations managers at logistics firms in Lagos on LinkedIn", options: { query: ["site:linkedin.com/in \"operations manager\" logistics Lagos", "operations manager", "linkedin jobs", "\"logistics\" OR \"Lagos\""] }, expect: { query: "site:linkedin.com/in \"operations manager\" logistics Lagos" } },
            { id: "q4", title: "Find caterers in Ibadan, whether they call it catering or caterer", options: { query: ["caterer OR catering Ibadan", "caterer catering Ibadan -food", "\"caterer catering Ibadan\"", "site:ibadan caterer"] }, expect: { query: "caterer OR catering Ibadan" } },
            { id: "q5", title: "Find information about the Jaguar animal, not the car", options: { query: ["jaguar animal -car", "jaguar", "\"jaguar car\"", "jaguar OR car"] }, expect: { query: "jaguar animal -car" } },
            { id: "q6", title: "Find news about fintech funding published since June 2025", options: { query: ["fintech funding after:2025-06-01", "fintech funding 2010", "\"fintech\" -funding", "filetype:pdf fintech"] }, expect: { query: "fintech funding after:2025-06-01" } },
            { id: "q7", title: "Find pages whose title contains \"price list\" for cement", options: { query: ["intitle:\"price list\" cement", "price list cement -price", "cement", "site:price list cement"] }, expect: { query: "intitle:\"price list\" cement" } },
          ],
          solution: {
            q1: { query: "site:gov.ng import duty" }, q2: { query: "filetype:pdf solar market Nigeria" }, q3: { query: "site:linkedin.com/in \"operations manager\" logistics Lagos" }, q4: { query: "caterer OR catering Ibadan" },
            q5: { query: "jaguar animal -car" }, q6: { query: "fintech funding after:2025-06-01" }, q7: { query: "intitle:\"price list\" cement" },
          },
          hint: "Match each request to the operator in the table: a site, a file type, an exclusion, either word, a date or a title.",
          successMessage: "Seven precise searches. Try each in Google now and compare the results with a plain search.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l36-credible",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.3"],
    title: "Finding Reliable and Credible Information",
    subtitle: "Judging sources with the CRAAP test and cross-checking facts",
    estimatedMinutes: 35,
    intro:
      "A client will make decisions, and sometimes spend money, on what you report. Wrong information found fast is worse than no information.",

    atoms: [
      {
        id: "a-va-craap",
        title: "The CRAAP test",
        explain:
          "Judge every source on five questions, remembered as CRAAP. Currency: when was it published or updated? Prices, laws and statistics go out of date quickly. Relevance: does it answer your exact question, for the right country and audience? Authority: who wrote or published it, and are they qualified? An official body, a recognised company or an expert is stronger than an anonymous blog. Accuracy: is it supported by evidence or data, and do other reliable sources agree? Purpose: why does it exist: to inform, to sell, to persuade or to entertain? A supplier's page about \"the best\" product is advertising.",
      },
      {
        id: "a-va-cross-check",
        title: "Primary sources and cross-checking",
        explain:
          "A primary source is the original: a company's own website for its prices and opening hours, a government site for a regulation, a published report for a statistic. A secondary source reports on it: a news article, a blog, a directory. Prefer primary sources, and when you use a secondary one, trace the claim back to its origin. Cross-check important facts in at least two independent reliable sources. Be wary of red flags: no author or date, sensational headlines, many spelling errors, figures with no source, social media posts and forwarded WhatsApp messages. Record the source link and the date you checked it, because information changes. When you cannot confirm something, say so in your report (\"price confirmed on the venue's website on 3 April; capacity not stated, awaiting reply\").",
        decision: {
          scenario: "A blog post from 2019 says a hotel's conference hall holds 300 people. The hotel's website does not mention capacity.",
          question: "What do you report to the client?",
          options: [
            { id: "a", text: "That capacity is unconfirmed, and that you have emailed the hotel to confirm", why: "Right. Old, secondary information is not confirmed; go to the primary source and be honest about the gap." },
            { id: "b", text: "That the hall holds 300 people", whyWrong: "The source is six years old and secondary; halls are renovated and rules change." },
            { id: "c", text: "Nothing about capacity", whyWrong: "Capacity is critical; report the gap and how you are closing it." },
            { id: "d", text: "An estimate based on the photos", whyWrong: "A guess presented as research could ruin an event." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-source-desk",
        title: "Rating sources",
        explain:
          "Your client is choosing an event venue and an inverter brand. Rate each source you found.",
        deskLab: {
          app: "research",
          title: "Sources for the client's questions",
          task: "Rate each source as reliable, use with caution (cross-check first), or not reliable.",
          fields: [{ key: "rating", label: "Rating", type: "select", options: ["Reliable", "Use with caution", "Not reliable"] }],
          items: [
            { id: "c1", title: "The venue's own website, price list updated this month", expect: { rating: "Reliable" }, why: "Primary, current and authoritative for its own prices." },
            { id: "c2", title: "A forwarded WhatsApp message: \"This inverter brand explodes, share!\"", expect: { rating: "Not reliable" }, why: "No author, no evidence, designed to spread." },
            { id: "c3", title: "A 2018 blog listing \"Top 10 Abuja venues\" with prices", expect: { rating: "Use with caution" }, why: "Secondary and out of date: use it to find venues, then check prices with each venue." },
            { id: "c4", title: "The Standards Organisation of Nigeria (SON) website on inverter certification", expect: { rating: "Reliable" }, why: "An official, authoritative primary source." },
            { id: "c5", title: "An inverter seller's page: \"Our brand is the best in Nigeria\"", expect: { rating: "Use with caution" }, hint: "What is the page's purpose?", why: "Useful for specifications, but its purpose is to sell." },
            { id: "c6", title: "Google reviews of the venue: 4.5 stars from 640 reviews, many recent", expect: { rating: "Use with caution" }, hint: "Reviews are opinions; useful, but…", why: "Helpful as a pattern, but individual reviews can be fake or extreme; cross-check." },
            { id: "c7", title: "An anonymous Instagram account claiming a venue was shut by government", expect: { rating: "Not reliable" }, why: "Anonymous and unverified: check official or news sources instead." },
          ],
          solution: {
            c1: { rating: "Reliable" }, c2: { rating: "Not reliable" }, c3: { rating: "Use with caution" }, c4: { rating: "Reliable" },
            c5: { rating: "Use with caution" }, c6: { rating: "Use with caution" }, c7: { rating: "Not reliable" },
          },
          hint: "Run CRAAP on each: how current, who wrote it, and why it exists.",
          successMessage: "You can now say not just what you found, but how much the client can trust it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l37-market",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.4"],
    title: "Competitor and Market Research",
    subtitle: "Comparing competitors and turning research into insights and a recommendation",
    estimatedMinutes: 45,
    intro:
      "Clients pay VAs to look at their market so they can make better decisions. The value is not the list of facts; it is what the facts mean.",

    atoms: [
      {
        id: "a-va-competitors",
        title: "Competitor research",
        explain:
          "Competitor research compares the businesses your client competes with. Find them: search Google and Google Maps for the client's product and area, check who advertises, look at review sites and ask the client who they lose customers to. Compare the same things for each: products and services, prices, location and hours, what customers praise and complain about (reviews are a goldmine), online presence (website, social media followers and how often they post), and how they position themselves (cheapest, premium, fastest, friendliest). Put it in a comparison table with the same columns for every competitor, so differences jump out. Record sources and dates.",
      },
      {
        id: "a-va-market",
        title: "Market research and SWOT",
        explain:
          "Market research looks at the wider picture: who the customers are and what they need, how big the market is, trends (new products, changes in prices, regulation, technology) and gaps nobody is filling. Sources include industry reports, government statistics (in Nigeria, the National Bureau of Statistics), trade associations, news, surveys and social media conversations. A SWOT summary organises findings for the client's business: Strengths and Weaknesses (inside the business) and Opportunities and Threats (outside it). End every piece of research with insights (what the facts mean, each supported by evidence) and a recommendation (what the client should do). A list of facts without \"so what\" leaves the thinking to the client.",
        samples: [
          { label: "A fact, not an insight", tone: "bad", text: "The Study Spot has 4.6 stars." },
          { label: "An insight with evidence", tone: "good", text: "Remote workers value Wi-Fi and sockets: The Study Spot, with unlimited Wi-Fi and many sockets, has the best rating (4.6), while Café Neo-Style's reviews complain about too few sockets." },
        ],
      },
      {
        id: "a-va-competitor-lab",
        title: "Researching Brew & Bloom's competitors",
        explain:
          "Turn the notes into a comparison table, three insights and a recommendation for Tola.",
        writingLab: {
          task:
            "Comparison: one table row per competitor (all three), with the price range, Wi-Fi, rating with review count, and Instagram. Insights: three bullets, each an insight with evidence (naming at least one competitor and a figure). Recommendation: one paragraph of 25 to 70 words that tells Tola what Brew & Bloom should do, including a coffee price range in naira.",
          brief: COMP_BRIEF,
          doc: COMP_DOC,
          tests: [
            { label: "A table row for each competitor", check: String.raw`const r = rows(section('Comparison') || ''); const t = r.map((x) => x[0]).join(' '); return r.length === 3 && /neo-style/i.test(t) && /study spot/i.test(t) && /mama/i.test(t);`, fail: "Give each of the three competitors one row." },
            { label: "Prices, Wi-Fi, ratings and Instagram filled in", check: String.raw`const r = rows(section('Comparison') || ''); return r.length === 3 && r.every((x) => x.length >= 5 && /\d/.test(x[1]) && x[2].length >= 3 && /4\.\d/.test(x[3]) && /\d/.test(x[4]));`, fail: "Fill every column: price range, Wi-Fi, rating (such as 4.6) and Instagram followers." },
            { label: "Three insights with evidence", check: String.raw`const b = bullets(section('Insights') || ''); return b.length === 3 && b.every((x) => /(neo-style|study spot|mama)/i.test(x) && /\d/.test(x) && words(x) >= 15);`, fail: "Write three insights, each naming a competitor, citing a figure, and saying what it means (15+ words)." },
            { label: "A recommendation with a price range", check: String.raw`const r = section('Recommendation') || ''; return words(r) >= 25 && words(r) <= 70 && /brew/i.test(r) && /₦\s?\d/.test(r) && /(should|recommend)/i.test(r);`, fail: "Recommend what Brew & Bloom should do in 25 to 70 words, including a coffee price range in naira." },
          ],
          solution: COMP_DONE,
          hint: "For each insight, start with what it means (\"Food is a gap for study cafés\"), then give the evidence after a colon.",
          successMessage: "Research that ends in a decision. That is what clients pay for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 6.5 – 6.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l38-leads",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.5", "6.6"],
    title: "Lead Generation and Contact Lists",
    subtitle: "Finding and qualifying prospects, and building contact lists sales teams can use",
    estimatedMinutes: 45,
    intro:
      "Lead generation is one of the best-paid research services a VA can offer, because every lead is a possible sale for the client.",

    atoms: [
      {
        id: "a-va-icp",
        title: "Lead generation and prospect research",
        explain:
          "A lead (or prospect) is a person or business that might buy from your client. Lead generation starts with the ideal customer profile (ICP): the kind of customer the client wants, described by criteria such as industry, location, company size, signs they need the product (no website, hiring, just opened, poor reviews about something the client fixes), and who makes the buying decision (the owner, the operations manager). Then find businesses that match, using Google Maps (local businesses, with ratings and websites), LinkedIn (companies and decision-makers), industry directories, trade association member lists and event exhibitor lists. Qualify each one against the criteria before adding it; a short list of qualified leads is worth far more than a long list of random names.",
      },
      {
        id: "a-va-contact-list",
        title: "Building a contact list",
        explain:
          "A contact list is a spreadsheet the sales team can work from. Agree the columns with the client before you start; typical ones are company name, website, contact person, job title, email, phone, location, source, date checked and notes (why this lead fits, or a useful fact for the first conversation). Find contact details on the company's own website (contact or team page), its Google Maps listing and LinkedIn. Prefer a named decision-maker's business contact over a generic info@ address when available, but never guess email addresses. Respect privacy law: in Nigeria (NDPA), the UK and EU (GDPR) and elsewhere, collect only business contact details for a legitimate business purpose, record where you found them, and honour anyone who asks not to be contacted. Never buy or scrape lists of personal data.",
      },
      {
        id: "a-va-qualify-desk",
        title: "Qualifying prospects",
        explain:
          "Your client builds websites for restaurants. Her ideal customer: an independent restaurant in Lagos, open, with good reviews (4.0 stars or more) but no website or a very poor one. Qualify each prospect.",
        deskLab: {
          app: "leads",
          title: "Prospects for a restaurant web designer",
          task: "Decide whether each prospect is a qualified lead, and if not, why.",
          brief: "**Ideal customer profile:** an **independent** restaurant (not a chain) in **Lagos**, currently **open**, rated **4.0 or more**, with **no website or a very poor one**.",
          briefTitle: "The client's ideal customer",
          fields: [{ key: "decision", label: "Decision", type: "select", options: ["Qualified lead", "Not a fit: has a good website", "Not a fit: a chain", "Not a fit: outside Lagos", "Not a fit: closed", "Not a fit: rating below 4.0"] }],
          items: [
            { id: "l1", title: "Iya Basira's Kitchen, Surulere · 4.5 stars · Instagram only, no website", expect: { decision: "Qualified lead" } },
            { id: "l2", title: "Chicken Republic, Yaba · 4.0 stars · national chain website", expect: { decision: "Not a fit: a chain" } },
            { id: "l3", title: "The Grill House, Lekki · 4.4 stars · modern website with online booking", expect: { decision: "Not a fit: has a good website" } },
            { id: "l4", title: "Bukka Express, Ikeja · 3.4 stars · no website", expect: { decision: "Not a fit: rating below 4.0" } },
            { id: "l5", title: "Amala Spot, Ibadan · 4.6 stars · no website", expect: { decision: "Not a fit: outside Lagos" } },
            { id: "l6", title: "Ocean Breeze Seafood, Victoria Island · 4.2 stars · website last updated 2017, broken menu page", expect: { decision: "Qualified lead" }, why: "A very poor, outdated website is exactly what the client fixes." },
            { id: "l7", title: "Calabar Pot, Gbagada · 4.3 stars · Google Maps: permanently closed", expect: { decision: "Not a fit: closed" } },
            { id: "l8", title: "Suya Central, Ajah · 4.7 stars · Facebook page only", expect: { decision: "Qualified lead" } },
          ],
          solution: {
            l1: { decision: "Qualified lead" }, l2: { decision: "Not a fit: a chain" }, l3: { decision: "Not a fit: has a good website" }, l4: { decision: "Not a fit: rating below 4.0" },
            l5: { decision: "Not a fit: outside Lagos" }, l6: { decision: "Qualified lead" }, l7: { decision: "Not a fit: closed" }, l8: { decision: "Qualified lead" },
          },
          hint: "Check the criteria in order: independent, Lagos, open, 4.0+, and no good website. The first one that fails is the reason.",
          successMessage: "Three qualified leads out of eight: the sales team spends its time only where it can win.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 6.7 – 6.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l39-data",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.7", "6.8"],
    title: "Data Collection, Analysis and Reporting",
    subtitle: "Collecting data cleanly, counting and summarising it, and reporting what it shows",
    estimatedMinutes: 45,
    intro:
      "Clients collect data all the time (orders, survey answers, sign-ups) and rarely look at it. A VA who can turn it into three clear numbers becomes very valuable.",

    atoms: [
      {
        id: "a-va-data-collect",
        title: "Data collection and organisation",
        explain:
          "Collect data in a way that makes it easy to analyse later. Use forms (Google Forms, Microsoft Forms, Typeform) instead of free-text emails: they put every answer into a spreadsheet automatically, one row per response. Design questions with fixed answers where possible (multiple choice, a 1–5 rating, Yes/No) so answers can be counted; keep open questions for comments. Ask only what you need, and say how the data will be used. Organise the results as a tidy table: one row per response, one column per question, consistent values (\"Lagos\", not \"lagos\", \"Lag\" and \"LA\"), no merged cells, and the raw data kept separate from your analysis.",
      },
      {
        id: "a-va-countif",
        title: "Counting with COUNTIF",
        explain:
          "Here are ten customer survey responses. =COUNTIF(range,criterion) counts the cells that match: =COUNTIF(D2:D11,\"Yes\") counts the customers who would recommend the business. In G2, count the Yes answers.",
        exercise: {
          data: { ...SURVEY, F2: "Would recommend (count)" },
          rows: 11,
          cols: 7,
          target: "G2",
          expected: 7,
          mustUseFormula: true,
          mustUse: "COUNTIF",
          lockedCells: [...SURVEY_LOCK, "F2"],
          task: "In G2, count how many customers answered Yes in D2:D11.",
          hint: "=COUNTIF(D2:D11,\"Yes\")",
          successMessage: "7 of 10 would recommend the business.",
        },
      },
      {
        id: "a-va-percent",
        title: "Percentages: the share of satisfied customers",
        explain:
          "Clients understand percentages better than counts. Share = the matching count divided by the total. COUNTIF can test numbers too: \">=4\" (in quotes) counts ratings of 4 or 5. =COUNTIF(C2:C11,\">=4\")/COUNT(C2:C11) gives the share of satisfied customers as a decimal (0.6); format the cell as Percent to show 60%. In G3, calculate that share.",
        exercise: {
          data: { ...SURVEY, F3: "Rated 4 or 5 (share)" },
          rows: 11,
          cols: 7,
          target: "G3",
          expected: 0.6,
          mustUseFormula: true,
          mustUse: "COUNTIF",
          lockedCells: [...SURVEY_LOCK, "F3"],
          task: "In G3, divide the number of ratings of 4 or more by the number of ratings.",
          hint: "=COUNTIF(C2:C11,\">=4\")/COUNT(C2:C11)",
          successMessage: "0.6, which is 60% satisfied when formatted as a percentage.",
        },
      },
      {
        id: "a-va-reporting",
        title: "Basic data reporting",
        explain:
          "A data report answers the client's question with a few key numbers, each with context. Lead with the headline (\"60% of customers rated us 4 or 5; 7 of 10 would recommend us\"), then the breakdown (by city, by month), then what it means and what to do. Compare with something: last month, a target, another branch. Choose charts by purpose: a bar chart to compare categories, a line chart for a trend over time, a pie chart only for parts of one whole with few slices. Label axes and units, start bar charts at zero, and highlight the bar or point that matters. A pivot table (Insert > Pivot table) summarises large tables in seconds, for example the average rating per city. Mention data limits honestly: ten responses is a small sample.",
        decision: {
          scenario: "Your client wants to show how monthly sales changed from January to June.",
          question: "Which chart is best?",
          options: [
            { id: "a", text: "A line chart with months along the bottom", why: "Right. Line charts show change over time." },
            { id: "b", text: "A pie chart of the six months", whyWrong: "Pie charts show parts of one whole; they hide the trend." },
            { id: "c", text: "A table of numbers only", whyWrong: "Possible, but the trend is much harder to see." },
            { id: "d", text: "A 3D exploding pie chart", whyWrong: "Distorts sizes and hides the trend." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 6.9 – 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l40-verify-crm",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["6.9", "6.10"],
    title: "Data Accuracy, Databases and CRMs",
    subtitle: "Verifying data, and keeping contacts and deals in HubSpot CRM and Airtable",
    estimatedMinutes: 45,
    intro:
      "Bad data quietly costs clients money: emails that bounce, calls to closed businesses, deals forgotten. Keeping data accurate, and keeping it in the right system, is core VA work.",

    atoms: [
      {
        id: "a-va-verify",
        title: "Data accuracy and verification",
        explain:
          "Verify each record before it is used. Check the business exists and is open (its website, Google Maps status, recent social media activity). Check that details agree: the email domain should match the website (info@pearldental.example for pearldental.example); the phone number should be in the right format and, for important leads, match the website. Remove duplicates: the same company under two names, or the same website or phone twice. Check it meets the criteria (location, type). Mark how and when each record was verified, and flag anything you could not confirm rather than guessing. Spot-check a sample of your own work before delivering. For large lists, an email verification tool can check whether addresses exist, but it never replaces checking that a lead is a real fit.",
        decision: {
          scenario: "A dental clinic's website is royaldentalstudio.example, but the email you found for it is sales@cheap-dental-deals.example.",
          question: "What do you do with this lead?",
          options: [
            { id: "a", text: "Exclude it or flag it as unverified until you confirm the correct email on the clinic's own website or by phone", why: "Right. A mismatched domain may be an old, wrong or even fraudulent address." },
            { id: "b", text: "Include it as it is", whyWrong: "The sales team may email the wrong company." },
            { id: "c", text: "Change the email to info@royaldentalstudio.example", whyWrong: "That is guessing; the address may not exist." },
            { id: "d", text: "Delete the clinic from all records forever", whyWrong: "It may be a good lead; flag it and verify." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-crm",
        title: "Databases and CRM systems",
        explain:
          "A database stores information in tables: each table holds one kind of thing (contacts, companies, orders), each record (row) is one item, and each field (column) is one detail, with a unique ID per record. A CRM (customer relationship management) system is a database built for customers and sales. In HubSpot CRM (which has a free version), contacts (people) belong to companies, and deals (possible sales) move through pipeline stages such as New lead, Contacted, Meeting booked, Proposal sent, Won and Lost. Every email, call and meeting is logged as an activity on the record, and tasks remind the team to follow up. Airtable is a flexible database that looks like a spreadsheet: tables with typed fields (single select, date, attachment, link to another table) and views (grid, kanban, calendar) of the same data. A VA typically imports lists, keeps records clean, logs activities, moves deals through stages and produces pipeline reports.",
        table: {
          caption: "A typical sales pipeline.",
          headers: ["Stage", "Means"],
          rows: [
            ["New lead", "Added to the CRM; no contact yet"],
            ["Contacted", "First email or call made; no meeting yet"],
            ["Meeting booked", "A call, demo or visit is scheduled"],
            ["Proposal sent", "A quote or proposal is with the prospect"],
            ["Won", "The prospect agreed to buy"],
            ["Lost", "The prospect said no or went silent after follow-ups"],
          ],
        },
      },
      {
        id: "a-va-crm-desk",
        title: "Updating deal stages in the CRM",
        explain:
          "You manage SmileBright Supplies' HubSpot CRM. Read the latest activity on each deal and move it to the right pipeline stage.",
        deskLab: {
          app: "board",
          title: "SmileBright Supplies · Sales pipeline",
          boardBy: "stage",
          task: "Move each deal to the right stage based on its latest activity.",
          fields: [{ key: "stage", label: "Stage", type: "select", options: ["New lead", "Contacted", "Meeting booked", "Proposal sent", "Won", "Lost"] }],
          items: [
            { id: "d1", title: "Pearl Dental Clinic", short: "Pearl Dental", meta: "Latest: quote for 2 dental chairs emailed on Monday; awaiting reply", expect: { stage: "Proposal sent" } },
            { id: "d2", title: "Yaba Tooth Centre", short: "Yaba Tooth", meta: "Latest: imported from the verified lead list yesterday", expect: { stage: "New lead" } },
            { id: "d3", title: "Ikoyi Aesthetic Dentistry", short: "Ikoyi Aesthetic", meta: "Latest: signed the order and paid the deposit", expect: { stage: "Won" } },
            { id: "d4", title: "Magodo Dental Practice", short: "Magodo Dental", meta: "Latest: demo visit booked for Thursday 10:00", expect: { stage: "Meeting booked" } },
            { id: "d5", title: "Festac Dental Clinic", short: "Festac Dental", meta: "Latest: intro email sent; no reply yet", expect: { stage: "Contacted" } },
            { id: "d6", title: "Ketu Dental Clinic", short: "Ketu Dental", meta: "Latest: said they bought from another supplier last month", expect: { stage: "Lost" } },
            { id: "d7", title: "Oniru Dental Lounge", short: "Oniru Dental", meta: "Latest: phoned the manager, who asked for a meeting next week; date agreed 14 May", expect: { stage: "Meeting booked" }, hint: "A date is agreed.", why: "Once a date is agreed, the deal is at Meeting booked." },
          ],
          solution: {
            d1: { stage: "Proposal sent" }, d2: { stage: "New lead" }, d3: { stage: "Won" }, d4: { stage: "Meeting booked" },
            d5: { stage: "Contacted" }, d6: { stage: "Lost" }, d7: { stage: "Meeting booked" },
          },
          hint: "Use the latest activity only, and the definitions in the pipeline table.",
          successMessage: "A pipeline that tells the truth: the sales manager can see exactly where every deal stands.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l41-practical",
    moduleId: "va-m6-research",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["6.P"],
    title: "Practical: A Verified Lead List",
    subtitle: "Twenty verified leads for a dental supplies company",
    estimatedMinutes: 75,
    intro:
      "This is a real deliverable that VAs are paid for every day: a clean, verified lead list built against the client's criteria.",

    atoms: [
      {
        id: "a-va-m6-method",
        title: "How to build a lead list for a client",
        explain:
          "Agree the criteria (the ICP) and the columns before starting. Search systematically (Google Maps area by area, directories, LinkedIn) and record every candidate. Then verify each one: open, matches the criteria, details consistent, not a duplicate. Keep an \"Excluded\" list with the reason for each, so the client can see your judgement and you do not research the same business twice. Add a useful note to each lead for the sales team. State the source and the date checked at the top. Deliver in a Google Sheet or Excel file with a frozen header row and consistent formats.",
      },
      {
        id: "a-va-m6-practical",
        title: "Practical: verify and build the list",
        explain:
          "Check all 26 entries against Nadia's criteria, exclude the six that fail, and build the list of 20. Then rebuild it as a Google Sheet for your portfolio; for your own practice, repeat the exercise with real businesses in an industry you would like to serve.",
        writingLab: {
          task:
            "Leads: a table of exactly 20 rows, one per verified clinic, with all seven columns filled: number, company, website (https://…), email (same domain as the website), phone (+234 format), area (in Lagos) and a note. No closed, duplicate, public, out-of-Lagos, website-less or mismatched entries. Excluded: a bullet for each of the six entries you removed, with its reason.",
          brief: LEADS_BRIEF,
          doc: LEADS_DOC,
          tests: [
            { label: "Exactly 20 leads with every column filled", check: String.raw`const r = rows(section('Leads') || ''); return r.length === 20 && r.every((x) => x.length >= 7 && x.slice(0, 7).every((c) => c.trim()));`, fail: "Make the table exactly 20 rows, with all seven columns filled for every lead." },
            { label: "Websites and matching email domains", check: String.raw`return rows(section('Leads') || '').every((x) => { const m = /^https?:\/\/(www\.)?([a-z0-9-]+\.example)\/?$/i.exec(x[2] || ''); const e = /^[^@\s]+@([a-z0-9.-]+)$/i.exec(x[3] || ''); return m && e && m[2].toLowerCase() === e[1].toLowerCase(); });`, fail: "Every lead needs its own website, and an email at the same domain as that website." },
            { label: "Phones in +234 format, all in Lagos", check: String.raw`return rows(section('Leads') || '').every((x) => /^\+234 \d{3} \d{3} \d{4}$/.test((x[4] || '').trim()) && /lagos/i.test(x[5] || '') && !/abuja/i.test(x[5] || ''));`, fail: "Write phones as +234 803 111 2001, and include only clinics in Lagos." },
            { label: "None of the six problem entries", check: String.raw`const t = rows(section('Leads') || '').map((x) => x[1]).join(' | '); return !/(lekki dental centre|pearl dental clinic ltd|general hospital|abuja smiles|toothcare plus|royal dental)/i.test(t);`, fail: "Some entries fail the criteria: check for a closed clinic, a duplicate, a public hospital, one outside Lagos, one with no website and one with a mismatched email." },
            { label: "No duplicates", check: String.raw`const r = rows(section('Leads') || ''); const w = r.map((x) => (x[2] || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')); return new Set(w).size === w.length;`, fail: "Two rows share a website: remove the duplicate." },
            { label: "Six exclusions, each with a reason", check: String.raw`const b = bullets(section('Excluded') || ''); const t = b.join(' '); return b.length >= 6 && /closed/i.test(t) && /duplicate/i.test(t) && /(public|hospital)/i.test(t) && /abuja/i.test(t) && /website/i.test(t) && /(match|domain|verify)/i.test(t);`, fail: "List the six excluded entries with their reasons: closed, duplicate, public hospital, outside Lagos, no website, mismatched email." },
          ],
          solution: LEADS_DONE,
          hint: "Read the Notes and Area columns of the directory first; four of the six problems are written there. The other two need you to compare columns.",
          successMessage: "Twenty verified leads and a clear record of what you excluded and why: exactly what a client pays for.",
        },
      },
    ],

    task: {
      title: "Module 6 practical: real research for your portfolio",
      intro: "Repeat the method with real data.",
      prompts: [
        "Choose an industry you would like to serve and write a five-line ideal customer profile for a client in it.",
        "Use Google Maps and the operators from lesson 35 to research 20 real businesses that match, and build a Google Sheet with the columns from this module, a source and a date checked.",
        "Verify every record: open, matching website and email domain, no duplicates; keep an Excluded tab with reasons.",
        "Create a free HubSpot CRM account, import five of your leads and move them through two pipeline stages.",
      ],
      closing: "Module 7 turns to customers: answering inquiries, handling complaints and running a support desk.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
