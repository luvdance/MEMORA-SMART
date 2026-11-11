/**
 * CONTENT WRITING · MODULE 5 · BLOG WRITING, ARTICLE WRITING AND EDITORIAL
 *
 * Curriculum 5.1 – 5.14 and the practical 5.P. Blogs and publications,
 * posts versus articles, topics, headlines, introductions, arguments,
 * headings, long and short form, evidence, opinion pieces, how-to guides,
 * listicles and reviews, editorial calendars and consistency; then a
 * 1,000-word referenced blog article.
 *
 * Sources in this module's briefs are invented for practice and say so.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s5-blogging";

/* ── Lesson 16 lab: headlines and an opening ───────────────────────────── */
const HEAD_BRIEF = `**PocketBooks** is a simple bookkeeping app for market traders and small shop owners. The blog post explains how a trader can track daily sales and expenses in ten minutes a day using a notebook or the app. Readers are traders in Onitsha, Aba and Lagos who have never kept records and think bookkeeping is "for big companies".`;

const HEAD_DOC = `# Headlines and opening

## Headlines
[Five headline options, one per line, each starting with "- ". Use at least one number, one "How to" and one question.]

## Chosen headline
[Copy the one you would publish.]

## Opening
[The first 50 to 100 words of the post.]
`;

const HEAD_DONE = `# Headlines and opening

## Headlines
- How to Keep Your Shop's Records in 10 Minutes a Day
- Bookkeeping Is Not Only for Big Companies: A Trader's Guide
- Where Did Today's Money Go? A Simple Way to Find Out
- 3 Numbers Every Market Trader Should Write Down Daily
- The 10-Minute Habit That Shows If Your Shop Really Makes a Profit

## Chosen headline
How to Keep Your Shop's Records in 10 Minutes a Day

## Opening
You sold well today. The shop was busy from morning, and money changed hands all day. So why is there so little left in your purse tonight? Many traders never find out, because they never write it down. Bookkeeping sounds like something for big companies with accountants, but it is not. With a notebook and ten minutes each evening, you can see exactly what you sold, what you spent and what you kept. Here is how.
`;

/* ── Lesson 17 lab: an argued section with evidence ────────────────────── */
const ARG_BRIEF = `You are writing a section of a blog post for a small-business magazine arguing that **small shops should accept transfers and POS payments, not only cash**. Research notes (practice sources, invented for this exercise):

- **Small Retail Survey 2025 (practice source), https://example.org/retail-survey:** shops in the survey that accepted transfers reported 18% higher average monthly sales than cash-only shops.
- **Same survey:** 54% of shoppers aged 18 to 35 said they had left a shop because it did not accept transfers.
- **Interview:** Mrs Ifeoma Nnaji, who sells provisions in Enugu, started accepting transfers in 2024. "My customers stopped saying 'I'll come back later'. They pay now."`;

const ARG_DOC = `# Why small shops should accept transfers

## Claim
[One sentence stating your argument.]

## Reasons
[Two paragraphs. Each starts with a reason, then gives evidence (a figure or quote) and explains what it means for the shop owner.]

## Counter-argument
[One paragraph: state the strongest objection fairly, then answer it.]

## References
[At least one Markdown link: - [Name](https://...)]
`;

const ARG_DONE = `# Why small shops should accept transfers

## Claim
Small shops that accept transfers and POS payments, not only cash, sell more and lose fewer customers.

## Reasons
Customers who do not carry cash still want to buy. In the Small Retail Survey 2025, shops that accepted transfers reported 18% higher average monthly sales than cash-only shops. For a shop that sells ₦500,000 a month, that difference would be worth about ₦90,000.

Younger shoppers simply walk away from cash-only shops. The same survey found that 54% of shoppers aged 18 to 35 had left a shop because it did not accept transfers. Mrs Ifeoma Nnaji, who sells provisions in Enugu, saw the change herself: "My customers stopped saying 'I'll come back later'. They pay now." Every customer who says they will come back is a sale at risk.

## Counter-argument
The strongest objection is that transfers can fail or be faked with false alerts, and bank charges reduce profit. These risks are real, but they can be managed. Shop owners can confirm every payment in their banking app before the customer leaves, and charges on small transfers are usually a few naira, far less than the value of a lost sale.

## References
- [Small Retail Survey 2025 (practice source)](https://example.org/retail-survey)
`;

/* ── Lesson 18 lab: a product review ───────────────────────────────────── */
const REVIEW_BRIEF = `You tested the **Breeze 16" rechargeable standing fan** for two weeks in a Port Harcourt flat. Your notes:

- Price: ₦68,000. Battery: on the lowest speed it ran for 9 hours; on the highest speed, 3 hours 40 minutes. The box claims "up to 12 hours".
- Full charge takes about 6 hours. It has a small LED light and a USB port for phones.
- Quiet on low speed; noticeably loud on high speed.
- The remote control stopped working on day 9 until the battery was replaced.
- Sturdy base; the height adjusts easily. One-year warranty.`;

const REVIEW_DOC = `# Breeze 16" rechargeable fan review

## Verdict
[One or two sentences: is it worth buying, and for whom?]

## What I tested
[How you tested it: how long, where, in what conditions.]

## Pros
[At least three "- " bullets.]

## Cons
[At least two "- " bullets.]

## Who should buy it
[One short paragraph.]

## Rating
[A score out of 5, such as 3.5/5.]
`;

const REVIEW_DONE = `# Breeze 16" rechargeable fan review

## Verdict
A good fan for light power cuts, but its battery falls well short of the 12 hours on the box. Buy it if you need a quiet fan for a bedroom at night, not a powerful one for a whole room.

## What I tested
I used the fan for two weeks in a two-bedroom flat in Port Harcourt, timing the battery from a full charge at the lowest and highest speeds, and using it every night during power cuts.

## Pros
- Ran for 9 hours on the lowest speed, enough for a full night
- Quiet on low speed, so it does not disturb sleep
- Sturdy base and easy height adjustment
- Useful extras: an LED light and a USB port to charge a phone

## Cons
- Only 3 hours 40 minutes on the highest speed, far below the "up to 12 hours" claim
- Loud on high speed
- The remote stopped working on day 9 until I replaced its battery

## Who should buy it
Buy it if you want a quiet fan for one bedroom during night-time power cuts. If you need strong airflow for long daytime outages, look for a fan with a larger battery.

## Rating
3.5/5
`;

/* ── Lesson 19 labs: an editorial calendar, then the 1,000-word article ── */
const CAL_BRIEF = `**Kora** (the savings app from Module 3) wants a four-week blog calendar for March. It publishes one blog post every Tuesday. Its audience is young professionals in Lagos and Abuja. March 8 is International Women's Day, and many readers receive their salaries on the 25th.`;

const CAL_DOC = `# Kora blog calendar: March

Publish every Tuesday: 3, 10, 17 and 24 March.

| Date | Working title | Format | Goal | Owner |
|------|---------------|--------|------|-------|
|  |  |  |  |  |
`;

const CAL_DONE = `# Kora blog calendar: March

Publish every Tuesday: 3, 10, 17 and 24 March.

| Date | Working title | Format | Goal | Owner |
|------|---------------|--------|------|-------|
| 3 March | 5 money habits to start this month, not in January | Listicle | Attract new readers from search and social media | Writer: Ada |
| 10 March | What the women who save consistently do differently | Interview feature | Mark International Women's Day with real stories | Writer: Ada |
| 17 March | How to split your salary before it disappears | How-to guide | Teach a budgeting method readers can use on payday | Writer: Tolu |
| 24 March | Salary lands tomorrow: your 10-minute payday checklist | Checklist | Help readers act on payday and try Kora's auto-save | Writer: Tolu |
`;

const BLOG_BRIEF = `**Brief:** a 1,000-word blog article for **Brightwatt**, a company that sells energy-efficient appliances in Lagos. Audience: households paying for electricity on prepaid meters. Purpose: educate; the reader should finish with practical ways to reduce their electricity spending. Tone: practical and friendly. Must include at least three headings, research and references.

**Research notes.** These sources are invented for this exercise; cite them by these names.

- **Home Energy Guide (practice source), https://example.org/home-energy:** LED bulbs use about 75% less electricity than old filament bulbs and last much longer. A fridge is often the appliance that runs the most hours in a home; a fridge door left open or a worn door seal makes it work harder. Appliances on standby still draw some power.
- **Cooling Facts Sheet (practice source), https://example.org/cooling:** setting an air conditioner one or two degrees higher reduces its energy use noticeably; ceiling fans use far less electricity than air conditioners. Clean filters help an AC run efficiently.
- **Brightwatt customer audit (practice source):** in 40 homes Brightwatt audited in 2025, the three biggest users of electricity were air conditioners, fridges and freezers, and pressing irons.
- **Meter Tips Bulletin (practice source), https://example.org/meter-tips:** households can check their prepaid meter's units before and after running an appliance for an hour to see how much it uses.`;

const BLOG_DOC = `# [Headline]

[Introduction]

## [Section heading]

## [Section heading]

## [Section heading]

## Conclusion

## References
`;

const BLOG_DONE = `# How to Cut Your Prepaid Electricity Bill: 7 Practical Steps for Lagos Homes

You load ₦20,000 on your prepaid meter, and a week later the units are almost gone. You have not been doing anything unusual, so where did the money go? For most homes the answer is a handful of appliances running longer and harder than they need to. The good news is that you can find them and cut their cost without buying a new house full of equipment. This guide shows you how, in seven practical steps.

## Step 1: Find out where your units really go

Before you change anything, measure. The Meter Tips Bulletin suggests a simple test: note the units on your prepaid meter, switch on one appliance for an hour with everything else off, then read the meter again. The difference is what that appliance costs you per hour.

Test your biggest suspects first. In 40 Lagos homes that Brightwatt audited in 2025, the three biggest users of electricity were air conditioners, fridges and freezers, and pressing irons. Your home may be different, which is exactly why a ten-minute test is worth doing. Write the numbers down. They will tell you where to focus.

Here is how one family used the test. They suspected their old freezer, but the meter showed that the air conditioner in the main bedroom used far more units in an hour than anything else in the flat. They had planned to replace the freezer. Instead, they changed how they used the air conditioner, which cost them nothing, and their recharges lasted noticeably longer. Measure before you spend.

## Step 2: Switch every bulb to LED

Lighting is the easiest saving in any home. According to the Home Energy Guide, LED bulbs use about 75% less electricity than old filament bulbs, and they last much longer. If your home still has the old yellow bulbs, replace the ones you use most first: the sitting room, the kitchen and the security light that stays on all night.

An LED bulb costs more on the day you buy it, but it pays for itself in units saved and in the bulbs you do not have to keep replacing.

When you buy, check the packet for two things. The first is the wattage: a 9-watt LED usually gives about the same light as an old 60-watt bulb. The second is the colour. "Warm white" gives the soft yellow light many people like in sitting rooms and bedrooms, while "cool white" or "daylight" suits kitchens and reading. Buy from a shop that will exchange a bulb that fails early, because cheap copies of good brands are common.

## Step 3: Give your fridge an easier life

Your fridge runs all day and all night, so small problems add up. The Home Energy Guide notes that a fridge door left open, or a worn door seal, makes the fridge work harder. Check the seal with a simple test: close the door on a sheet of paper. If the paper slides out easily, the seal is letting cold air escape and should be replaced.

Keep the door closed as much as you can. Decide what you want before you open it, let hot food cool before you put it inside, and leave a little space behind the fridge so air can move around it.

## Step 4: Use your air conditioner smarter

If you have an air conditioner, it is probably your biggest cost. You do not have to stop using it, but you can use it better. The Cooling Facts Sheet explains that setting your AC one or two degrees higher reduces its energy use noticeably. Most people feel comfortable at 24 or 25 degrees, especially with a fan running.

Clean the filters every few weeks, because clean filters help an AC run efficiently. Close doors and windows while it is on, and draw the curtains on sunny afternoons so the room heats up less.

## Step 5: Let the fan do more of the work

A ceiling or standing fan uses far less electricity than an air conditioner, according to the same factsheet. On many evenings a fan alone is enough. On hotter nights, cool the bedroom with the AC for an hour before bed, then switch to the fan. You stay comfortable and your units last longer.

## Step 6: Iron in batches, not every morning

A pressing iron draws a lot of power while it heats up. Heating it every morning for one shirt is the most expensive way to iron. Iron the whole week's clothes in one session instead, and start with the items that need the lowest heat while the iron warms up. Switch it off a few minutes before you finish and use the remaining heat for the last items.

## Step 7: Switch off at the socket

Televisions, decoders, sound systems and phone chargers often sit on standby all day. The Home Energy Guide notes that appliances on standby still draw some power. One device on standby uses little, but a whole house of them, every hour of every day, adds up. Plug your entertainment devices into one extension with a switch, and turn it off at night and when you go out.

## Put it together: a simple weekly routine

Habits save more than any single gadget, so turn these steps into a routine the whole household follows. On Monday, read the meter and write down the units left. Every evening, switch off the entertainment extension before bed and set the air conditioner a little warmer. Once a week, iron everyone's clothes in one session and wipe the fridge seal clean. At the end of the month, compare how long your recharge lasted with the month before.

Share the plan with everyone at home, including children and house help. People are more willing to change habits when they understand why, so explain that every unit saved is money the family can spend on something else. Put a small note by the meter with the three rules that matter most in your home.

## Conclusion

Most homes waste electricity in the same few places: old bulbs, a hard-working fridge, an air conditioner set too cold, an iron heated every day and devices left on standby. You do not need to fix everything at once. Start this week with the meter test from Step 1 on your three biggest appliances. Once you know where your units go, choose the two changes that will save you the most, and watch how much longer your next recharge lasts.

## References
- [Home Energy Guide (practice source)](https://example.org/home-energy)
- [Cooling Facts Sheet (practice source)](https://example.org/cooling)
- [Meter Tips Bulletin (practice source)](https://example.org/meter-tips)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 5.1 – 5.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l16-blogs",
    moduleId: "cw-m5-blogging",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3", "5.4", "5.5"],
    title: "Blogs, Topics and Headlines",
    subtitle: "Online publications, posts versus articles, choosing topics, headlines and openings",
    estimatedMinutes: 35,
    intro:
      "Blogs and online publications are where most content writers start earning. This lesson explains how they work, how to choose what to write about, and how to write the two things that decide whether anyone reads it: the headline and the opening.",

    atoms: [
      {
        id: "a-cw-blogs",
        title: "Understanding blogs and online publications",
        explain:
          "A blog is a regularly updated section of a website where an organisation or person publishes posts, newest first. Business blogs exist to attract visitors from search and social media, answer customers' questions, show expertise and keep the website fresh. Online publications (news sites, magazines such as TechCabal or BusinessDay, and platforms such as Medium and Substack) publish articles by staff or freelance writers for a broad readership and earn money from advertising, subscriptions or sponsorship. Writers work for both: as in-house content writers, as freelancers paid per post or per word, as contributors who pitch ideas to editors, or as ghostwriters writing posts published under a founder's name. Every blog and publication has its own audience, style guide and standards, so read at least ten of its recent pieces before you write for it.",
      },
      {
        id: "a-cw-post-vs-article",
        title: "The difference between blog posts and articles",
        explain:
          "The words are often used interchangeably, but there are useful differences. A blog post is usually more personal and conversational, often written in the first person, focused on one practical topic, published on a company or personal blog, updated over time, and optimised for search. An article is usually more formal and objective, researched and fact-checked to editorial standards, often longer, published by a publication, and edited by someone other than the writer. A business blog post might be \"5 ways we cut our delivery times\"; a magazine article might be \"Why last-mile delivery is so expensive in Nigerian cities\", with interviews, data and several viewpoints. Clients use the words loosely, so ask what they expect: tone, length, research depth and whether they want sources and quotes.",
        table: {
          caption: "Blog posts and articles compared.",
          headers: ["", "Blog post", "Article"],
          rows: [
            ["Voice", "Personal, conversational, often first person", "More formal and objective"],
            ["Publisher", "A company or person's own blog", "A publication with editors"],
            ["Research", "Practical expertise, some sources", "Interviews, data, several viewpoints"],
            ["Typical goal", "Search traffic, trust, leads", "Inform a broad readership"],
          ],
        },
      },
      {
        id: "a-cw-topics",
        title: "Choosing relevant topics",
        explain:
          "A relevant topic sits where three things overlap: what the audience needs or searches for, what the business knows better than most, and what connects naturally to what the business sells. Questions customers ask repeatedly are the best source, because each is a topic people already want answered. Check that the topic is not already covered well on the blog; if it is, update that piece instead. Then find the angle (Module 4): a specific reader, a specific outcome. For a bookkeeping app, \"accounting\" is a subject, \"why bookkeeping matters\" is a weak topic, and \"how a market trader can keep records in ten minutes a day\" is a strong, relevant topic with an angle.",
      },
      {
        id: "a-cw-headlines",
        title: "Creating compelling article headlines",
        explain:
          "Most people read the headline and nothing else, so it must tell the right reader exactly what they will get. Strong headline patterns include: How to (\"How to Keep Your Shop's Records in 10 Minutes a Day\"); numbered lists (\"3 Numbers Every Market Trader Should Write Down\"); questions that the reader is already asking (\"Where Did Today's Money Go?\"); the promise of a specific outcome; and the myth or mistake (\"Bookkeeping Is Not Only for Big Companies\"). Make headlines specific (numbers, times, places, people), keep them under about 70 characters so they display fully in search results, and make sure the article delivers exactly what the headline promises; a misleading headline earns a click and loses a reader. Professional writers draft five to ten headlines and choose one.",
        mistake: "Clickbait: \"You Won't Believe What This Trader Did!\" It may get a click, but readers who feel tricked leave at once and never trust the brand again.",
        decision: {
          scenario: "Choose a headline for a post that teaches nurses in Nigeria how to prepare for the UK's English language test.",
          question: "Which headline is strongest?",
          options: [
            { id: "a", text: "How Nigerian Nurses Can Prepare for the OET in 8 Weeks", why: "Right. It names the reader, the outcome and a concrete time frame, and it promises something the article can deliver." },
            { id: "b", text: "Everything You Need to Know About Everything", whyWrong: "Vague and impossible to deliver." },
            { id: "c", text: "Nurses, This Will Shock You!", whyWrong: "Clickbait: it promises a feeling, not information." },
            { id: "d", text: "An Exploration of Language Assessment Considerations", whyWrong: "Abstract and academic; the target reader will not recognise it as for them." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-hooks-intro",
        title: "Writing introductions that capture attention",
        explain:
          "You learned the three moves of an introduction in Module 4: hook, problem, promise. For blog posts, the most reliable hooks are: a familiar scene the reader recognises (\"You sold well today. So why is there so little left in your purse?\"); a surprising, sourced fact; a direct question the reader is already asking; and a short story about one person. Write in second person (you) so the reader sees themselves. Keep the opening paragraph short: one to three sentences on a phone screen. Then make the promise specific (\"Here is how, in ten minutes a day\") and move into the first section quickly. A useful test: if you deleted your first sentence, would anything be lost? If not, delete it.",
        writingLab: {
          task:
            "Write five headline options for PocketBooks' post, one per bullet, each under 70 characters. Include at least one with a number, one starting \"How to\" and one question. Copy your best one under \"Chosen headline\". Then write the opening: 50 to 100 words that speak to the trader as \"you\", end with a short promise, and contain no warm-up cliché (\"In today's\", \"Since time immemorial\", \"This article\").",
          brief: HEAD_BRIEF,
          doc: HEAD_DOC,
          tests: [
            { label: "Five headlines, each under 70 characters", check: "const h = bullets(section('Headlines')).filter((b) => words(b) >= 4); return h.length >= 5 && h.every((b) => b.length <= 70);", fail: "Write five headlines of four words or more, each under 70 characters." },
            { label: "One with a number, one \"How to\" and one with a question", check: String.raw`const h = bullets(section('Headlines')); return h.some((b) => /\d/.test(b)) && h.some((b) => /^how to\b/i.test(b)) && h.some((b) => /\?/.test(b));`, fail: "Vary the patterns: a number, a \"How to\" and a question." },
            { label: "Chosen headline is one of your five", check: String.raw`const c = (section('Chosen headline') || '').trim().toLowerCase(); return c.length > 0 && bullets(section('Headlines')).some((b) => b.trim().toLowerCase() === c);`, fail: "Copy one of your five headlines exactly under \"Chosen headline\"." },
            { label: "Opening: 50 to 100 words, talks to \"you\", no warm-up clichés", check: String.raw`const o = section('Opening') || ''; return words(o) >= 50 && words(o) <= 100 && you(o) >= 2 && !/in today'?s|since time immemorial|this article/i.test(o);`, fail: "Open with the trader's situation, in second person, in 50 to 100 words." },
            { label: "The opening is plain English (grade 7 or below)", check: "return grade(section('Opening')) <= 7;", fail: "These readers are busy traders. Use short sentences and everyday words." },
          ],
          solution: HEAD_DONE,
          hint: "Picture one trader at closing time counting money. Start there.",
          successMessage: "Five headlines to choose from and an opening that puts the reader in the first sentence.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 5.6 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l17-arguments",
    moduleId: "cw-m5-blogging",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.6", "5.7", "5.8", "5.9"],
    title: "Arguments, Headings and Evidence",
    subtitle: "Building a logical case, structuring with headings, choosing length, and using evidence",
    estimatedMinutes: 40,
    intro:
      "An article that informs still has to convince the reader that it is right. This lesson covers how to build a logical argument, signpost it with headings, choose the right length, and support it with examples, statistics and references.",

    atoms: [
      {
        id: "a-cw-arguments",
        title: "Developing logical arguments",
        explain:
          "An argument is a claim supported by reasons and evidence. Build each one in four parts: the claim (what you want the reader to accept), the reasons (why it is true), the evidence for each reason (data, examples, expert views, quotes), and the explanation that connects evidence to claim (what it means for this reader). Many writers use PEEL for each paragraph: Point, Evidence, Explain, Link. A strong argument also deals with the counter-argument: state the strongest objection fairly, then answer it. This builds trust, because readers see you are not hiding anything. Avoid common logical errors: generalising from one example, confusing correlation with cause (two things happening together does not prove one caused the other), attacking people instead of their ideas, and presenting only two options when more exist.",
        table: {
          caption: "Common logical errors to avoid.",
          headers: ["Error", "Example", "Fix"],
          rows: [
            ["Hasty generalisation", "My cousin's shop failed, so small shops fail.", "Use data from many cases"],
            ["Correlation as cause", "Shops with POS sell more, so POS causes sales.", "Say \"are associated with\" unless the source proves cause"],
            ["False choice", "Either accept transfers or close down.", "Acknowledge other options"],
            ["Attacking the person", "Only lazy traders refuse transfers.", "Answer the reasons, not the people"],
          ],
        },
      },
      {
        id: "a-cw-headings",
        title: "Structuring headings and subheadings",
        explain:
          "Headings are the skeleton of an article, and they form a hierarchy. The title (the H1, Heading 1) appears once. Main sections use H2 headings, and subsections within a section use H3. In Markdown, \"# \" is the title, \"## \" an H2 and \"### \" an H3. Never skip a level (an H3 directly under the title) and never use headings just to make text bigger. Write headings that are informative on their own: \"Step 3: Give your fridge an easier life\" rather than \"Fridge\". Keep parallel headings in the same grammatical form (all steps start with a verb, or all are questions). Headings help three readers at once: the human scanning for what they need, screen-reader users who jump between headings, and search engines that use them to understand the page (Module 6).",
        example: "# How to Cut Your Prepaid Electricity Bill     ← title (H1)\n## Step 1: Find out where your units go         ← section (H2)\n### The one-hour meter test                     ← subsection (H3)\n## Step 2: Switch every bulb to LED              ← section (H2)",
      },
      {
        id: "a-cw-long-short",
        title: "Writing long-form and short-form articles",
        explain:
          "Short-form articles (roughly 300 to 900 words) answer one narrow question quickly: news updates, quick tips, announcements, a single how-to step. Long-form articles (1,200 words and more) cover a topic thoroughly: complete guides, in-depth analysis, comparisons, research-based pieces. Length should follow the reader's need, not a target: a question with a short answer deserves a short article, and padding a short answer to 2,000 words annoys readers. Long-form tends to perform well in search and earns links when it is genuinely the most complete answer, but it demands more structure: headings every few hundred words, summaries, lists, and examples to keep momentum. Short-form demands ruthless focus: one idea, the answer early, no throat-clearing.",
        decision: {
          scenario: "A client asks for a 2,500-word article answering \"What time does the CAC portal open?\"",
          question: "What is the professional response?",
          options: [
            { id: "a", text: "Suggest a short answer, or a longer guide to registering a business that includes the answer, because 2,500 words would only be padding", why: "Right. Length follows the reader's need. You can offer a better brief instead of padding." },
            { id: "b", text: "Write 2,500 words with lots of background history", whyWrong: "Readers looking for a time will leave before they find it." },
            { id: "c", text: "Write 2,500 words repeating the answer many times", whyWrong: "That is padding, and readers and search engines both notice." },
            { id: "d", text: "Refuse the job", whyWrong: "Advising the client is better than refusing." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-evidence",
        title: "Using examples, statistics and references",
        explain:
          "Evidence turns opinion into argument. Use examples to make abstract points concrete (a named trader, a real situation); statistics to show scale (always with the source, the date and what exactly was measured); expert quotations to add authority; and case studies to show cause and effect in a real setting. Present numbers so readers feel them: \"18% higher sales\" becomes clearer as \"about ₦90,000 more a month for a shop selling ₦500,000\". Round sensibly, compare with something familiar, and never change what a statistic measured. Quote people exactly, with their name and role, and only with permission. Reference every source in the text and in a list at the end (Module 4). One strong, relevant piece of evidence per point is better than five weak ones.",
        writingLab: {
          task:
            "Write an argued section. Claim: one sentence. Reasons: two paragraphs, each with at least one figure or quotation from the research notes and an explanation of what it means for a shop owner (each paragraph at least 40 words). Counter-argument: one paragraph that states the strongest objection (failed or fake transfers, or charges) and answers it, at least 40 words. References: at least one Markdown link. Use the figures exactly as the research gives them.",
          brief: ARG_BRIEF,
          doc: ARG_DOC,
          tests: [
            { label: "Claim: one sentence", check: "const c = section('Claim'); return sentences(c).length === 1 && words(c) >= 8;", fail: "State the argument in a single sentence." },
            { label: "Two reason paragraphs of at least 40 words", check: "return paragraphs(section('Reasons')).filter((p) => words(p) >= 40).length >= 2;", fail: "Write two paragraphs (separated by a blank line), each with a reason, evidence and explanation." },
            { label: "Evidence used exactly: 18% and 54%", check: String.raw`const r = section('Reasons') || ''; return /18\s?%/.test(r) && /54\s?%/.test(r);`, fail: "Use both survey figures exactly as the notes give them." },
            { label: "The figures are explained for the reader", check: String.raw`return /₦|that means|for a shop|which means|every customer|worth/i.test(section('Reasons') || '');`, fail: "After each figure, say what it means for a shop owner, for example in naira." },
            { label: "Counter-argument stated and answered (40+ words)", check: String.raw`const c = section('Counter-argument') || ''; return words(c) >= 40 && /(fail|fake|false alert|charge|fee)/i.test(c) && /(but|however|yet)/i.test(c);`, fail: "State the strongest objection fairly, then answer it with \"but\" or \"however\"." },
            { label: "At least one reference link", check: "return links(section('References')).length >= 1;", fail: "List the survey as \"- [Small Retail Survey 2025 (practice source)](https://example.org/retail-survey)\"." },
          ],
          solution: ARG_DONE,
          hint: "Use PEEL for each reason paragraph: Point, Evidence, Explain, Link.",
          successMessage: "A claim, reasons with evidence, honest treatment of the objection, and a reference. That is an argument an editor can publish.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 5.10 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l18-formats",
    moduleId: "cw-m5-blogging",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.10", "5.11", "5.12"],
    title: "Opinion, How-To, Listicles and Reviews",
    subtitle: "The four article formats clients ask for most",
    estimatedMinutes: 40,
    intro:
      "Four formats make up most of what blogs and publications commission. Each has its own shape and its own promise to the reader.",

    atoms: [
      {
        id: "a-cw-opinion",
        title: "Writing opinion pieces and editorials",
        explain:
          "An opinion piece (op-ed) argues a personal position on an issue, under the writer's name; an editorial argues the publication's official position, usually unsigned. Both need a clear, arguable thesis stated early (\"Lagos should ban okada only where it has built alternatives\"), a timely hook (a news event, a new policy, a debate happening now), two or three strong arguments with evidence, fair treatment of the other side, and a conclusion that calls for something specific: a decision, a change, a way of thinking. Write with conviction but not abuse: attack ideas, not people. Facts in an opinion piece must still be true; only the conclusion is opinion. Publications usually want 600 to 900 words and expect writers to disclose any interest they have in the issue.",
      },
      {
        id: "a-cw-how-to",
        title: "Writing how-to guides and tutorials",
        explain:
          "A how-to guide teaches the reader to complete a task. Start by saying what they will achieve and what they need (time, tools, documents, cost). Then give the steps in order, numbered, one action per step, each starting with a verb (\"Open\", \"Enter\", \"Click\"). Explain why only when it helps the reader do the step correctly. Show what success looks like after key steps (\"You will receive an SMS with a code\"), and warn about common mistakes at the step where they happen, not in a separate section. End with what to do if something goes wrong and what to do next. Test your guide by following it yourself, or better, by watching someone else follow it: every point where they hesitate needs rewriting.",
        samples: [
          { label: "Unclear step", tone: "bad", text: "The registration process should then be completed by the user with the relevant details and documentation." },
          { label: "Clear step", tone: "good", text: "4. Enter your NIN and date of birth, then click Continue. You will receive a six-digit code by SMS." },
        ],
      },
      {
        id: "a-cw-listicles-reviews",
        title: "Writing listicles and product reviews",
        explain:
          "A listicle is an article organised as a numbered list (\"7 practical steps\", \"10 places to eat in Jos\"). Good listicles have items that are parallel (same type and grammatical form), each with a heading and enough explanation to be useful; a logical order (most important first, or in sequence); and an introduction and conclusion that frame them. The number should be honest: if you only have five good tips, write five. A product review helps a reader decide whether to buy. Readers trust reviews that show how the product was tested, give specific results (\"9 hours on low speed\") rather than adjectives, cover both pros and cons, compare claims with reality, say who the product suits and who should avoid it, and give a clear verdict and rating. Disclose if you received the product free or are paid through affiliate links: undisclosed paid reviews mislead readers and break advertising rules in many countries.",
        decision: {
          scenario: "A brand sends you a free blender to review and offers ₦50,000 if your review is \"positive\". In testing, the blender leaked twice.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Decline the payment condition, review it honestly including the leaks, and disclose that the product was free", why: "Right. A review's value is its honesty. Paid positivity misleads readers and destroys your credibility and theirs." },
            { id: "b", text: "Accept and leave out the leaks", whyWrong: "That deceives readers, and in many countries it breaks advertising rules on paid endorsements." },
            { id: "c", text: "Accept and mention the leaks in very small print", whyWrong: "Still a paid positive review. The payment condition is the problem." },
            { id: "d", text: "Publish nothing and keep the blender", whyWrong: "Keeping a review product without reviewing it is unprofessional; return it or review it honestly." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-review-anatomy",
        title: "The anatomy of a review",
        explain:
          "Most professional reviews follow the same order, because it matches what a reader wants to know first. The verdict comes first: worth buying or not, and for whom, in one or two sentences, so a busy reader can stop there. Then the testing method: how long, where, under what conditions, so the reader can judge whether your experience matches theirs. Then the pros and cons as short bullet lists, each backed by a specific result. Then the claims versus reality: where the product met or missed what the box or advert promised. Then who should buy it, and who should look elsewhere. Finally a rating, on a scale stated clearly (out of 5 or out of 10). Write the verdict last, once you have weighed everything, then move it to the top.",
        writingLab: {
          task:
            "Write a review of the Breeze fan from your test notes. Verdict: one or two sentences saying whether it is worth buying and for whom. What I tested: how you tested it (at least 20 words). Pros: at least three bullets. Cons: at least two bullets, including the battery result compared with the box claim. Who should buy it: a short paragraph. Rating: a score out of 5. Use specific results (hours, minutes, price), not only adjectives.",
          brief: REVIEW_BRIEF,
          doc: REVIEW_DOC,
          tests: [
            { label: "Verdict: one or two sentences", check: "const v = section('Verdict'); const n = sentences(v).length; return n >= 1 && n <= 2 && words(v) >= 12;", fail: "Give the verdict first: worth buying or not, and for whom." },
            { label: "Testing method described (20+ words)", check: "return words(section('What I tested')) >= 20;", fail: "Say how long you tested it, where and how you measured the battery." },
            { label: "At least three pros and two cons", check: "return bullets(section('Pros')).length >= 3 && bullets(section('Cons')).length >= 2;", fail: "Balance: three or more pros and two or more cons." },
            { label: "Cons compare the real battery life with the box claim", check: String.raw`const c = section('Cons') || ''; return /3 hours|3h|3 hrs|40 minutes/i.test(c) && /12 hours/i.test(c);`, fail: "Readers need to know the box says \"up to 12 hours\" but high speed lasted 3 hours 40 minutes." },
            { label: "Specific results, not just adjectives", check: String.raw`return nums(section('Pros')).length + nums(section('Cons')).length >= 2;`, fail: "Use numbers from your notes: hours, minutes, days." },
            { label: "A rating out of 5", check: String.raw`return /\b[0-5](\.5)?\s?\/\s?5\b|out of 5/i.test(section('Rating') || '');`, fail: "Give a score such as \"3.5/5\"." },
          ],
          solution: REVIEW_DONE,
          hint: "Write the verdict last, after the pros and cons, then move it to the top.",
          successMessage: "A review a reader can trust: tested, specific, balanced and honest about the box claim.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.13 – 5.14 · PRACTICAL 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l19-editorial",
    moduleId: "cw-m5-blogging",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.13", "5.14", "5.P"],
    title: "Editorial Calendars and the 1,000-Word Article",
    subtitle: "Planning what gets published when, staying consistent, and the module practical",
    estimatedMinutes: 75,
    intro:
      "Professional content is planned, not improvised. This lesson shows how editorial calendars and schedules work, then asks you to write the module's practical: a 1,000-word referenced blog article.",

    atoms: [
      {
        id: "a-cw-editorial-calendar",
        title: "Creating editorial calendars",
        explain:
          "An editorial calendar is the plan of what will be published, when, where and by whom. It usually lives in a spreadsheet, Notion, Trello or a shared calendar, with one row per piece: publish date, working title, format, platform, goal or audience, target keyword, writer, editor, status (idea, briefed, drafting, editing, scheduled, published) and links to the brief and draft. Plan around the audience's year: seasons, holidays, salary dates, school terms, industry events and product launches. Leave space for news and reactive pieces. A calendar makes deadlines visible, spreads topics so the blog does not repeat itself, lets the team prepare seasonal content in advance, and shows clients exactly what they are paying for.",
        writingLab: {
          task:
            "Build Kora's March blog calendar: four rows, one for each Tuesday (3, 10, 17 and 24 March). Each row needs a working title (at least 5 words), a format, a goal (at least 5 words) and an owner. Use the brief: one post must connect to International Women's Day and one to payday at the end of the month, and use at least three different formats.",
          brief: CAL_BRIEF,
          doc: CAL_DOC,
          tests: [
            { label: "Four complete rows", check: "return rows(doc).filter((c) => words(c[0]) >= 1 && words(c[1]) >= 5 && words(c[2]) >= 1 && words(c[3]) >= 5 && words(c[4]) >= 1).length >= 4;", fail: "Fill every column for four rows." },
            { label: "One row for each Tuesday: 3, 10, 17 and 24 March", check: String.raw`const d = rows(doc).map((c) => c[0]); return ['3', '10', '17', '24'].every((n) => d.some((x) => new RegExp('^' + n + '\\b').test(x)));`, fail: "The client publishes every Tuesday: 3, 10, 17 and 24 March." },
            { label: "Women's Day and payday are both used", check: String.raw`const t = rows(doc).map((c) => c.join(' ')).join(' '); return /wom[ae]n/i.test(t) && /(salary|payday|pay day)/i.test(t);`, fail: "Plan around the audience's month: International Women's Day on the 8th and salaries on the 25th." },
            { label: "At least three different formats", check: "return new Set(rows(doc).map((c) => (c[2] || '').toLowerCase().trim()).filter(Boolean)).size >= 3;", fail: "Vary the formats: listicle, how-to, interview, checklist…" },
          ],
          solution: CAL_DONE,
          hint: "Place the two dated hooks first (Women's Day near the 10th, payday near the 24th), then fill the other weeks.",
          successMessage: "A month of content planned around the reader's real calendar, with nothing left to the last minute.",
        },
      },
      {
        id: "a-cw-consistency",
        title: "Content consistency and publishing schedules",
        explain:
          "Consistency matters more than volume. A blog that publishes one good post every week for a year builds an audience; one that publishes ten posts in January and nothing until June does not, because readers and search engines both learn to expect a rhythm. Choose a schedule the team can sustain, such as weekly or fortnightly, publish on the same day, and keep a buffer of two or three finished pieces for busy weeks. Consistency also means a consistent standard: the same voice, formatting, image style, heading style, citation practice and quality checks, usually recorded in a style guide (Module 17). Track what you publish and how it performs, and review the plan monthly.",
      },
      {
        id: "a-cw-m5-practical",
        title: "Practical: a 1,000-word blog article",
        explain:
          "Write Brightwatt's 1,000-word blog article from the brief and research notes. Use everything from Modules 4 and 5: a specific headline, an introduction with hook, problem and promise, descriptive H2 sections that are parallel in form, evidence named in the text, a conclusion with a next step, and a references list. Plan first: choose your structure (a numbered list of steps works well for this brief), then draft, then edit with the style report until it reads like plain, friendly English.",
        writingLab: {
          task:
            "Write the article: a specific headline of at least 6 words; an introduction; at least five \"## \" sections with descriptive headings; a Conclusion with a next step; and References with at least three Markdown links. Length 950 to 1,400 words, reading grade 9 or below, no sentence longer than 35 words. Name at least three sources in the body and report the audit's three biggest electricity users accurately.",
          brief: BLOG_BRIEF,
          doc: BLOG_DOC,
          words: [950, 1400],
          tests: [
            { label: "A specific headline of at least 6 words", check: String.raw`const h = (lines(doc).find((l) => /^#\s/.test(l)) || '').replace(/^#\s*/, ''); return words(h) >= 6 && !/^\[/.test(h);`, fail: "Replace \"[Headline]\" with a specific headline." },
            { label: "At least five descriptive sections, plus Conclusion and References", check: String.raw`const h = headings(2); return h.filter((x) => !/^(conclusion|references)$/i.test(x) && words(x) >= 3 && !/^\[/.test(x)).length >= 5 && h.some((x) => /^conclusion/i.test(x)) && h.some((x) => /^references/i.test(x));`, fail: "Write five or more \"## \" sections with headings of three words or more." },
            { label: "950 to 1,400 words", check: "const n = words(doc); return n >= 950 && n <= 1400;", fail: "The stats bar shows the total. Aim for 950 to 1,400 words." },
            { label: "Three references as links, three sources named in the body", check: String.raw`const body = doc.split(/^##\s+References/m)[0]; const named = ['Home Energy Guide', 'Cooling Facts', 'Meter Tips', 'Brightwatt'].filter((s) => body.includes(s)).length; return links(section('References')).length >= 3 && named >= 3;`, fail: "Name your sources in the text where you use them, and list at least three as links under References." },
            { label: "The audit is reported accurately", check: String.raw`return /air condition/i.test(doc) && /fridges? and freezers?/i.test(doc) && /pressing irons?|irons?\b/i.test(doc) && /40 (lagos )?homes/i.test(doc);`, fail: "The audit covered 40 homes; the top three were air conditioners, fridges and freezers, and pressing irons." },
            { label: "Readable: grade 9 or below, no sentence over 35 words", check: "return grade(doc) <= 9 && longest(doc) <= 35;", fail: "Split long sentences and choose everyday words." },
            { label: "Conclusion ends with a next step", check: "const c = section('Conclusion'); return words(c) >= 40 && sentences(c).slice(-2).some((s) => isAction(s));", fail: "End by telling the reader exactly what to do first, starting with a verb." },
          ],
          solution: BLOG_DONE,
          hint: "Outline seven steps first, each an H2 starting with \"Step N:\" and a verb. Then write 100 to 150 words for each.",
          successMessage: "A complete 1,000-word article: researched, structured, referenced and readable. Download it for your portfolio.",
        },
      },
    ],

    task: {
      title: "Module 5 practical: publish a 1,000-word article",
      intro: "Take your best article from this module to publication standard.",
      prompts: [
        "Choose a topic for a real or fictional business and write a brief for it.",
        "Research at least four reliable sources and outline the article before drafting.",
        "Write 1,000 to 1,200 words with an H1 headline, at least four H2 sections, evidence named in the text and a references list.",
        "Edit it in passes: structure, then sentences, then fact-checking, then proofreading.",
        "Publish it on Medium, Substack, LinkedIn articles or your own blog, and add the link to your portfolio list.",
      ],
      closing: "Module 6 shows how to make articles like this one discoverable: SEO content writing.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
