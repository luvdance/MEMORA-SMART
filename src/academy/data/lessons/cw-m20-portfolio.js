/**
 * CONTENT WRITING · MODULE 20 · WRITING PORTFOLIO AND FINAL CAPSTONE PROJECT
 *
 * Curriculum 20.1 – 20.12 and the final capstone 20.P. What a portfolio is,
 * selecting, organising and categorising samples, presenting projects,
 * project descriptions, showing range across content, copy and professional
 * writing, online portfolios, presenting to employers and clients, and
 * writing tests and interviews; then the ten-piece capstone for one
 * business.
 *
 * The capstone's checks are structural, so a learner may use the supplied
 * business (SunCity Solar) or a fictional business of their own. Survey
 * figures in the brief are invented for practice and say so.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s20-portfolio";

/* ── Lesson 76 lab: a portfolio plan ───────────────────────────────────── */
const PLAN_DOC = `# My portfolio plan

Category must be exactly one of: Content, Copy, Professional.

| Piece | Category | Why it earns its place | Result or proof |
|-------|----------|------------------------|-----------------|
|  |  |  |  |

## My target reader
[Who will look at this portfolio, and what do they want to see? At least 25 words.]
`;

const PLAN_DONE = `# My portfolio plan

Category must be exactly one of: Content, Copy, Professional.

| Piece | Category | Why it earns its place | Result or proof |
|-------|----------|------------------------|-----------------|
| 1,000-word article on cutting electricity bills (Module 5) | Content | Shows research, structure and references | Grade 8 readability; three cited sources |
| SEO article: CV with no experience (Module 6) | Content | Shows keyword research and on-page SEO | Meta package and keyword placement throughout |
| FitHome advert in three frameworks (Module 10) | Copy | Shows range across AIDA, PAS and BAB | Three test-ready versions of one advert |
| Voltra launch campaign (Module 11) | Copy | Shows a full multi-channel campaign | Flyer, two social ads and a landing page |
| Delivery services proposal (Module 13) | Professional | Shows persuasive, well-structured business writing | Clear pricing and a dated next step |
| App Rescue progress report and user guide (Module 15) | Professional | Shows analytical and technical writing | Honest RAG status and a six-step guide |

## My target reader
Marketing managers at fintech and e-commerce companies, and agency owners hiring writers. They want to see that I can research, write for their customers, persuade, and produce clean professional documents without heavy editing.
`;

/* ── Lesson 77 lab: project descriptions ───────────────────────────────── */
const DESC_BRIEF = `Three pieces you wrote earlier in this course (or real pieces of your own):

1. **Brightwatt article (Module 5):** a 1,000-word blog article on cutting prepaid electricity bills, for a company selling energy-efficient appliances in Lagos; seven practical steps; three sources cited; plain English at about grade 8.
2. **ChopBox Abuja launch emails (Module 12):** a five-email launch sequence for a meal-kit company entering Abuja; teaser to last chance; launch code ABUJA25; written to stay clear of spam filters.
3. **Greenfield Logistics proposal (Module 13):** a proposal to win a delivery contract with a snack manufacturer, worth ₦4.8 million a month, with a 60-day trial to reduce the client's risk, plus the covering email.

These were practice projects. Say so honestly in each description.`;

const DESC_DOC = `# Project descriptions

## Project 1
- Title:
- Type:
- Challenge:
- Approach:
- Result:

## Project 2
- Title:
- Type:
- Challenge:
- Approach:
- Result:

## Project 3
- Title:
- Type:
- Challenge:
- Approach:
- Result:
`;

const DESC_DONE = `# Project descriptions

## Project 1
- Title: How to Cut Your Prepaid Electricity Bill
- Type: Blog article (content writing), practice project
- Challenge: An appliance retailer wanted to help Lagos households understand where their electricity units go and build trust before they buy.
- Approach: I researched four sources, structured the article as seven practical steps with descriptive headings, and wrote in plain, friendly English for busy households.
- Result: A 1,000-word referenced article at about a grade 8 reading level, with every claim linked to a named source.

## Project 2
- Title: ChopBox Abuja launch campaign
- Type: Email marketing (copywriting), practice project
- Challenge: A meal-kit company needed to turn a waitlist of 6,000 people into first orders when it launched in a new city.
- Approach: I planned a five-email sequence (teaser, launch, how it works, proof and objections, last chance), each with one job, one call to action and a consistent launch code.
- Result: A complete, ready-to-send sequence with subject lines under 50 characters and no spam-trigger language.

## Project 3
- Title: Delivery services proposal for a snack manufacturer
- Type: Business proposal (professional writing), practice project
- Challenge: A logistics company needed to win a contract from a client frustrated with late and lost deliveries across three couriers.
- Approach: I opened with the client's problem, proposed a dedicated fleet with tracking, backed it with on-time evidence, and reduced the client's risk with a 60-day trial.
- Result: A two-page proposal worth ₦4.8 million a month, with a one-paragraph executive summary and a covering email.
`;

/* ── Lesson 78 lab: portfolio homepage and interview answers ───────────── */
const HOME_DOC = `# My online portfolio: home page

## Headline
[Who you are and who you help, in 12 words or fewer.]

## Introduction
[Two or three sentences: what you write, for whom, and your strongest proof.]

## Work
[Three "- " bullets, one per category: Content, Copy, Professional. Name a piece in each.]

## Call to action
[One or two sentences inviting clients or employers to contact you, with how.]

## Interview answer
[Answer: "Tell us about a piece of writing you're proud of." Use the STAR structure: label each part Situation:, Task:, Action:, Result:.]
`;

const HOME_DONE = `# My online portfolio: home page

## Headline
Content writer for fintech and e-commerce brands

## Introduction
I write SEO articles, website copy and email campaigns that help fintech and e-commerce brands earn customers' trust. My work has reached the top of Google for its keyword and helped a clinic double its enquiries in 3 months.

## Work
- Content: a 1,000-word referenced guide to cutting prepaid electricity bills
- Copy: a five-email launch campaign for a meal-kit company entering Abuja
- Professional: a delivery services proposal worth ₦4.8 million a month

## Call to action
Need content your customers will read and act on? Email me at amara.obi.writes@gmail.example and I will reply within one working day.

## Interview answer
- Situation: A dental clinic in Enugu had a website that brought almost no enquiries.
- Task: I was asked to write articles that would help local patients find the clinic on Google.
- Action: I researched what patients searched for, chose the keyword "teeth whitening in Enugu", interviewed the dentist, and wrote a clear, accurate guide with a strong call to action.
- Result: The article reached position 1 on Google for its keyword, and the clinic's website enquiries doubled in three months.
`;

/* ── Lesson 79: the capstone ───────────────────────────────────────────── */
const SUNCITY = `**Capstone business: SunCity Solar, Abuja** (you may instead use a fictional business of your own with equally detailed facts). Facts marked as practice sources are invented for this exercise.

- Installs home solar systems (panels, lithium battery and inverter) across Abuja: Gwarinpa, Lugbe, Kubwa and Maitama.
- Founded in 2021 by an electrical engineer, Hadiza Bello. 650 homes installed so far.
- Home Basic (3kVA): from ₦2.4 million; powers lights, fans, a TV and a fridge. Home Plus (5kVA): from ₦3.9 million; adds one 1.5hp air conditioner.
- Free site survey; installation in 3 days after the survey.
- 5-year warranty on panels and battery; free maintenance check every 6 months for 2 years.
- Payment plan: 40% deposit, then 12 monthly payments, with 0% interest from 1 March (new).
- Launch offer: a free surge protector with every system ordered by 31 March.
- Customers rate SunCity 4.8 out of 5 from 310 reviews. "We haven't bought fuel for the generator since March." Emeka N., Gwarinpa.
- **Abuja Home Energy Survey 2025 (practice source), https://example.org/abuja-energy:** households that rely on generators spent an average of ₦85,000 a month on fuel.
- **Solar Buyer's Guide (practice source), https://example.org/solar-guide:** a 3kVA system with a lithium battery typically runs lights, fans, a TV and a fridge; system cost depends mainly on battery size, number of panels and the inverter.
- SEO keyword: **cost of solar installation in abuja**.
- Proposal client: **Greenview Estate Residents' Association**, Lugbe, 120 homes; SunCity offers 8% off each system when 20 or more homes sign up.
- Q1 2026 results (for the report): 96 installations (target 90); revenue ₦262 million; 7 complaints, 5 of them about delayed installations in Lugbe; average installation time 3.4 days (target 3).`;

const CONTENT_DOC = `# Capstone A: content writing

## 1. SEO blog article
### Headline
### Meta title
### Meta description
### Article

## 2. Homepage
### Hero headline
### Subheadline
### Button
### Benefits
### Proof
### Closing call to action

## 3. Seven-day social media calendar
| Day | Platform | Post type | Hook | Call to action |
|-----|----------|-----------|------|----------------|
|  |  |  |  |  |
`;

const CONTENT_DONE = `# Capstone A: content writing

## 1. SEO blog article
### Headline
Cost of Solar Installation in Abuja: A Simple Guide for Homeowners

### Meta title
Cost of Solar Installation in Abuja: What You Will Pay

### Meta description
How much does solar installation cost in Abuja? See typical prices for 3kVA and 5kVA homes, what affects the cost, and how payment plans work.

### Article
If you are tired of buying fuel every week, you have probably wondered about the cost of solar installation in Abuja. The answer depends on what you want to power, but most homes fall into a few clear price ranges. This guide explains what you get for your money, what changes the price and how to pay without draining your savings.

#### What a home solar system includes

A home solar system has three main parts. Solar panels on your roof turn sunlight into electricity. A battery stores that energy for the evening and night. An inverter turns the stored energy into the kind of power your appliances use. According to the Solar Buyer's Guide, the cost of a system depends mainly on the size of the battery, the number of panels and the inverter you choose.

#### Typical prices for Abuja homes

For most families, the choice is between two sizes. A 3kVA system, which typically runs lights, fans, a TV and a fridge, starts from about ₦2.4 million at SunCity Solar. A 5kVA system, which can also run one 1.5hp air conditioner, starts from about ₦3.9 million. Prices vary with the exact equipment and your home, which is why a free site survey comes first.

Before you compare quotes, list the appliances you want to run during a power cut and how many hours you need them each evening. Two quotes for the same size of system can include very different batteries and panels, so ask each installer to write down the battery capacity, the number of panels, the inverter and the warranty. That makes the quotes easy to compare fairly.

#### Why solar can cost less than you think

The real comparison is with what you spend now. In the Abuja Home Energy Survey 2025, households that relied on generators spent an average of ₦85,000 a month on fuel. Over a year, that is more than ₦1 million, before repairs and servicing. A solar system has no fuel cost at all, so for many families it pays for itself within a few years.

#### What affects your price

Four things change the cost of your installation:

- How many appliances you want to run, and for how long each evening
- The size of the battery, which decides how long your power lasts at night
- The number of panels your roof can hold and the sunlight it receives
- The quality of the inverter and the warranty that comes with it

Always ask what the warranty covers. A good installer should offer several years on the panels and battery, and regular maintenance checks.

#### How to pay for solar

You do not need to pay everything at once. SunCity Solar, for example, lets you pay a 40% deposit and spread the rest over 12 monthly payments, with 0% interest from 1 March. Compare that monthly payment with your current fuel spending: for many households it is similar, and after a year the payments stop while the free power continues.

#### Your next step

The cost of solar installation in Abuja is easier to plan once you know exactly what your home needs. Book a free site survey, and you will get a clear quote for your home before you commit to anything.

#### Sources
- [Abuja Home Energy Survey 2025 (practice source)](https://example.org/abuja-energy)
- [Solar Buyer's Guide (practice source)](https://example.org/solar-guide)

## 2. Homepage
### Hero headline
Reliable power for your home, day and night

### Subheadline
SunCity Solar designs and installs home solar systems across Abuja, with a free site survey and installation in 3 days.

### Button
Book your free site survey

### Benefits
- No more fuel queues: homes with generators spend about ₦85,000 a month on fuel, and solar uses none
- Peace of mind: a 5-year warranty on panels and battery, and free maintenance checks every 6 months for 2 years
- Easy to afford: pay a 40% deposit and the rest over 12 months, with 0% interest

### Proof
650 Abuja homes powered since 2021, rated 4.8 out of 5 from 310 reviews. "We haven't bought fuel for the generator since March." Emeka N., Gwarinpa

### Closing call to action
Find out exactly what your home needs, with no obligation. Book your free site survey today.

## 3. Seven-day social media calendar
| Day | Platform | Post type | Hook | Call to action |
|-----|----------|-----------|------|----------------|
| Monday | Instagram | Educational | What a 3kVA system can really power | Save this for later |
| Tuesday | Facebook | Social proof | Emeka hasn't bought fuel since March | Book a free site survey |
| Wednesday | LinkedIn | Story | Why an engineer started SunCity in 2021 | Read Hadiza's story on our website |
| Thursday | Instagram | Promotional | 0% interest solar from 1 March | Tap the link in bio to apply |
| Friday | X | Educational | The real yearly cost of your generator | Calculate your fuel spending today |
| Saturday | Facebook | Behind the scenes | Day 3 of an installation in Gwarinpa | Follow us for the finished system |
| Sunday | WhatsApp Status | Promotional | A free surge protector until 31 March | Reply to book your survey |
`;

const COPY_DOC = `# Capstone B: copywriting

## 4. Advertisement (name the framework)
- Framework:

## 5. Landing page
### Headline
### Subheadline
### Benefits
### Proof
### Offer
### Call to action

## 6. Five-email campaign
### Email 1
### Email 2
### Email 3
### Email 4
### Email 5
`;

const COPY_DONE = `# Capstone B: copywriting

## 4. Advertisement (name the framework)
- Framework: PAS

**Problem:** Every evening the light goes off, and the generator comes on again.

**Agitation:** That noise costs the average Abuja household about ₦85,000 a month in fuel, plus repairs, fumes and sleepless nights.

**Solution:** SunCity Solar gives you quiet, reliable power from the sun, installed in 3 days, with a 5-year warranty. From 1 March, pay over 12 months at 0% interest. Book your free site survey today.

## 5. Landing page
### Headline
Solar power for your home, now at 0% interest

### Subheadline
Pay a 40% deposit and spread the rest over 12 months. Order by 31 March and get a free surge protector.

### Benefits
- Stop paying for fuel: a 3kVA system runs lights, fans, a TV and a fridge
- Installed in 3 days after a free site survey
- Protected for years: a 5-year warranty on panels and battery, and free maintenance checks for 2 years

### Proof
650 Abuja homes powered since 2021, rated 4.8 out of 5 from 310 reviews. "We haven't bought fuel for the generator since March." Emeka N., Gwarinpa

### Offer
Home Basic (3kVA) from ₦2.4 million or Home Plus (5kVA) from ₦3.9 million, with a 40% deposit and 12 monthly payments at 0% interest. Order by 31 March for a free surge protector.

### Call to action
Book your free site survey

## 6. Five-email campaign
### Email 1
Subject: Solar at 0% interest is coming on 1 March
Preview: Spread the cost of your system over 12 months.

Hi {{first_name|there}},

From 1 March, you can pay for a SunCity solar system over 12 months at 0% interest, after a 40% deposit. If fuel costs have been keeping you up at night, this is the easiest time to switch.

Mark 1 March in your calendar

The SunCity Solar team

### Email 2
Subject: It's here: solar at 0% interest
Preview: Plus a free surge protector if you order by 31 March.

Hi {{first_name|there}},

Our 0% interest payment plan starts today. Pay 40% upfront and the rest over 12 months, with no interest. Order by 31 March and we'll add a free surge protector.

Book your free site survey

The SunCity Solar team

### Email 3
Subject: What a 3kVA system can power
Preview: Lights, fans, a TV and a fridge, all night.

Hi {{first_name|there}},

Not sure what size you need? A 3kVA system runs lights, fans, a TV and a fridge. Want air conditioning too? A 5kVA system adds one 1.5hp AC. Our free site survey tells you exactly what your home needs.

Book your free site survey

The SunCity Solar team

### Email 4
Subject: "We haven't bought fuel since March"
Preview: Why 650 Abuja homes chose SunCity Solar.

Hi {{first_name|there}},

Emeka in Gwarinpa hasn't bought fuel for his generator since March. He's one of 650 Abuja homeowners who rate us 4.8 out of 5.

Worried about cost? Pay over 12 months at 0% interest. Worried about faults? You get a 5-year warranty and free maintenance checks.

Book your free site survey

The SunCity Solar team

### Email 5
Subject: Your free surge protector ends 31 March
Preview: Order this month to get it with your system.

Hi {{first_name|there}},

A quick reminder: order your SunCity system by 31 March and get a free surge protector, along with our 0% interest payment plan.

Book your free site survey before 31 March

The SunCity Solar team
`;

const PRO_DOC = `# Capstone C: professional writing

## 7. Business proposal
### Executive summary
### The challenge
### Proposed solution
### Pricing
### Next steps

## 8. Business report
### Summary
### Results
| Measure | Target | Actual |
|---------|--------|--------|
|  |  |  |
### Findings
### Recommendations

## 9. Workplace emails
### Email to staff
### Email to a supplier
### Email of appreciation
`;

const PRO_DONE = `# Capstone C: professional writing

## 7. Business proposal
### Executive summary
Greenview Estate's 120 homes rely on generators that cost the average household about ₦85,000 a month in fuel. SunCity Solar proposes to install home solar systems across the estate, with an 8% discount on every system when 20 or more homes sign up, a 0% interest payment plan, and a 5-year warranty. We recommend starting with a free survey of the first 20 homes in April.

### The challenge
Residents of Greenview Estate in Lugbe face frequent power cuts, high fuel costs and generator noise and fumes. Individually, households pay full price for solar and must each find and manage an installer.

### Proposed solution
- Free site surveys for every interested home
- Installation of Home Basic (3kVA) or Home Plus (5kVA) systems, each completed in 3 days
- One estate coordinator at SunCity for all residents
- A 5-year warranty and free maintenance checks every 6 months for 2 years

### Pricing
| System | Standard price | Estate price (20+ homes, 8% off) |
|--------|----------------|----------------------------------|
| Home Basic (3kVA) | ₦2,400,000 | ₦2,208,000 |
| Home Plus (5kVA) | ₦3,900,000 | ₦3,588,000 |

### Next steps
If the association agrees, we will present the proposal at your next residents' meeting and begin free surveys of the first 20 homes in April. Please confirm by 31 March so that residents also receive the free surge protector.

## 8. Business report
### Summary
SunCity Solar beat its installation target in the first quarter of 2026, completing 96 installations against a target of 90 and earning ₦262 million. However, average installation time rose to 3.4 days, and most complaints came from delays in Lugbe.

### Results
| Measure | Target | Actual |
|---------|--------|--------|
| Installations | 90 | 96 |
| Average installation time | 3 days | 3.4 days |
| Complaints | Not set | 7 |

### Findings
Installations exceeded the target by 6, which suggests strong demand. Five of the seven complaints were about delayed installations in Lugbe, and average installation time was 0.4 days above target.

### Recommendations
1. Assign a second installation team to Lugbe from May.
2. Confirm each installation date with the customer two days in advance.
3. Report average installation time weekly, with a target of 3 days by June.

## 9. Workplace emails
### Email to staff
Subject: New safety check before every roof installation, from 1 April

Dear team,

From 1 April, every installation team must complete the new roof safety checklist before anyone climbs onto a roof. The checklist takes about five minutes and is attached.

Please read it before Friday and bring any questions to the team meeting on Monday.

Thank you for keeping each other safe,
Hadiza Bello
Founder, SunCity Solar

### Email to a supplier
Subject: Delayed battery shipment: new delivery date needed

Dear Mr Chukwu,

Our order of 40 lithium batteries (order SC-2207), due on 15 March, has not arrived. Customers are booked for installations next week.

Could you please confirm the new delivery date by Wednesday? If the full order cannot arrive by 22 March, we would be grateful for a part delivery of 20 batteries.

Kind regards,
Hadiza Bello
Founder, SunCity Solar

### Email of appreciation
Subject: Thank you for the Gwarinpa installation

Hi Tunde,

Thank you and your team for finishing the Gwarinpa installation a day early, despite the rain. The customer called to say how tidy and polite everyone was, and has already recommended us to two neighbours.

Well done, and thank you.
Hadiza
`;

const PORT_DOC = `# Capstone D: my writer's portfolio

## About me

## Services

## Selected work
[At least six "- " entries. Start each with its category (Content, Copy or Professional), then the piece and a one-line description.]

## What clients say
[A testimonial or, if you have none yet, a short line about how you work. Label practice work honestly.]

## Contact
`;

const PORT_DONE = `# Capstone D: my writer's portfolio

## About me
I am Amara Obi, a content writer and copywriter who helps fintech, energy and e-commerce brands turn what they know into content that earns customers' trust. I research carefully, write in plain English and check every fact.

## Services
- SEO blog articles with meta titles and descriptions
- Website and landing page copy
- Email campaigns and social media calendars
- Business proposals, reports and professional emails

## Selected work
- Content: SunCity Solar SEO article, a guide to the cost of solar installation in Abuja (capstone practice project)
- Content: SunCity Solar homepage and seven-day social media calendar (capstone practice project)
- Copy: SunCity Solar PAS advert and 0% interest landing page (capstone practice project)
- Copy: SunCity Solar five-email launch campaign (capstone practice project)
- Professional: Greenview Estate proposal, a bulk solar installation offer for 120 homes (capstone practice project)
- Professional: SunCity Solar Q1 business report and three workplace emails (capstone practice project)

## What clients say
"Amara's article reached the top of Google for our keyword, and our enquiries doubled in three months." Dental clinic owner, Enugu

## Contact
Email me at amara.obi.writes@gmail.example or message me on LinkedIn. I reply within one working day.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 20.1 – 20.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l76-portfolio",
    moduleId: "cw-m20-portfolio",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2", "20.3", "20.4"],
    title: "Building a Professional Portfolio",
    subtitle: "What a portfolio is for, choosing and organising samples, categories and presentation",
    estimatedMinutes: 40,
    intro:
      "For writers, the portfolio is the proof. Employers and clients hire from evidence they can read. This final module builds that evidence, then asks you to produce ten pieces for one business.",

    atoms: [
      {
        id: "a-cw-portfolio-defined",
        title: "Understanding a professional writing portfolio",
        explain:
          "A writing portfolio is a curated collection of your best work, presented so that a specific reader (a hiring manager, an agency or a client) can quickly see that you can do the work they need. It does three jobs: it proves your skill (they can read the writing), it shows your range and specialism (the kinds of writing and industries), and it shows your professionalism (how you present, explain and organise your work). A portfolio is not a folder of everything you have written. It is short (often six to twelve pieces), focused on the work you want to be hired for, updated as your work improves, and easy to navigate. Practice pieces, course projects and work for fictional businesses are acceptable when you are starting, provided you label them honestly.",
      },
      {
        id: "a-cw-selecting-samples",
        title: "Selecting and organising writing samples",
        explain:
          "Choose pieces by four tests. Quality: only your best work; one weak piece lowers the reader's opinion of the rest. Relevance: pieces that match the jobs and clients you want (if you want fintech clients, lead with fintech or finance writing). Range: enough variety to show you can adapt, across formats and tones. Proof: pieces with results (rankings, sales, engagement, approval) or clear evidence of skill (research, structure). Then organise them: put your strongest and most relevant pieces first, group them clearly, and keep the number manageable. Remove client confidential material or ask permission, and prefer published links where possible, with a PDF or screenshot backup in case a page changes. Revisit your selection every few months and replace older pieces with stronger ones.",
      },
      {
        id: "a-cw-portfolio-categories",
        title: "Creating portfolio categories",
        explain:
          "Categories help readers find what they care about. Organise by the discipline (Content writing, Copywriting, Professional writing, as in this course), by format (Articles, Website copy, Email, Social media, Reports and proposals), or by industry (Fintech, Health, Energy) if you specialise. Choose the scheme your target reader thinks in: a marketing manager looks for \"Email\" or \"SEO articles\"; a fintech founder looks for \"Fintech\". Keep categories few (three to five) and each with at least two pieces. Label each piece with its category, client or business (or \"practice project\"), and the date.",
        decision: {
          scenario: "A writer wants marketing jobs at fintech companies. Her portfolio opens with poems and a school essay, and her fintech email campaign is on page four.",
          question: "What should she change?",
          options: [
            { id: "a", text: "Lead with the fintech email campaign and other relevant marketing work, and remove or move pieces that do not match the jobs she wants", why: "Right. Readers judge from the first pieces they see; lead with the most relevant, strongest work." },
            { id: "b", text: "Add more poems for variety", whyWrong: "Variety that is irrelevant to the job dilutes the portfolio." },
            { id: "c", text: "Keep the order: it is chronological", whyWrong: "Relevance and strength matter more than chronology." },
            { id: "d", text: "Remove the fintech campaign", whyWrong: "It is her most relevant piece." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-presenting-projects",
        title: "Presenting writing projects professionally",
        explain:
          "Present each piece so a busy reader understands it in seconds: a clear title; the category and format; the client or business (or \"practice project\"); a short description of the challenge, your approach and the result (Lesson 77); the piece itself (a link, an embedded PDF or the text, with images where they help); and the date. Make the presentation consistent across pieces, readable on a phone, and free of errors, because your portfolio is itself a writing sample. Remove anything that does not help a reader decide to hire you: long life stories, every certificate, outdated work.",
        writingLab: {
          task:
            "Plan your portfolio. Fill at least six rows: the piece (your own or one you wrote in this course), its category (exactly Content, Copy or Professional), why it earns its place (at least 5 words) and its result or proof (at least 4 words). Include at least two pieces in each category. Then describe your target reader in at least 25 words: who they are and what they want to see.",
          doc: PLAN_DOC,
          tests: [
            { label: "Six complete rows", check: String.raw`return rows(doc).filter((c) => words(c[0]) >= 3 && /^(content|copy|professional)$/i.test(c[1] || '') && words(c[2]) >= 5 && words(c[3]) >= 4).length >= 6;`, fail: "Fill six rows: a piece, a category from the list, why it is included and its result or proof." },
            { label: "At least two pieces in each category", check: String.raw`const c = rows(doc).map((r) => (r[1] || '').toLowerCase()); return ['content', 'copy', 'professional'].every((k) => c.filter((x) => x === k).length >= 2);`, fail: "Show range: at least two Content, two Copy and two Professional pieces." },
            { label: "Target reader described (25+ words)", check: "return words(section('My target reader')) >= 25;", fail: "Describe who will look at your portfolio and what they want to see." },
          ],
          solution: PLAN_DONE,
          hint: "Start from the reader: what would a hiring manager for the job you want most need to see?",
          successMessage: "A portfolio plan with range and relevance, chosen for a real reader. The capstone will fill it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 20.5 – 20.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l77-showcase",
    moduleId: "cw-m20-portfolio",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.5", "20.6", "20.7", "20.8", "20.9"],
    title: "Describing and Showcasing Your Work",
    subtitle: "Project descriptions, range, and showcasing content, copy and professional samples",
    estimatedMinutes: 40,
    intro:
      "A sample alone shows what you wrote. A good description shows how you think, which is what clients are really hiring.",

    atoms: [
      {
        id: "a-cw-project-descriptions",
        title: "Writing project descriptions",
        explain:
          "A project description is a short case study of one piece, usually 60 to 150 words. Use the Challenge–Approach–Result structure (you met challenge–action–result in Module 8 and the STAR structure is similar). Challenge: the client, the audience and the problem the writing had to solve. Approach: the key decisions you made: research, structure, voice, framework, keywords. Result: what happened (rankings, traffic, sales, approval, adoption) or, for practice work, what the finished piece achieves (length, readability, structure). Write in the first person, be specific, use numbers where honest, and label practice projects as such. Descriptions are themselves writing samples, so keep them tight.",
      },
      {
        id: "a-cw-writing-range",
        title: "Demonstrating different writing styles",
        explain:
          "Clients and employers want to know you can adapt: formal and conversational, short and long, informative and persuasive, for different audiences and brand voices. Show range deliberately: choose pieces in different registers (a formal proposal, a conversational blog post, a punchy ad), formats (article, email sequence, landing page, report, social calendar) and voices (a calm bank, a playful food brand). Range does not mean scattered: keep the range within the kinds of work you want to be hired for. A useful check is to read your portfolio's first lines in sequence: if they all sound the same, your range is not showing.",
      },
      {
        id: "a-cw-show-content",
        title: "Showcasing content writing samples",
        explain:
          "For content samples, choose pieces that show research, structure and readability: a long-form article or guide with headings and sources, an SEO article with its meta title, description and target keyword, a newsletter, and a social media calendar or set of posts. Show the context that makes them impressive: the keyword and its ranking, the traffic or engagement if known, the sources used, the reading level. Link to the live page where possible. Strong content samples prove you can hold a reader's attention for 1,000 words and be found by search engines.",
      },
      {
        id: "a-cw-show-copy",
        title: "Showcasing copywriting samples",
        explain:
          "Copy is judged by results, so showcase copy with as much evidence as you have: conversions, click-through rates, sales or test results (\"Version B lifted sign-ups by 18%\"). Include a range of formats: ads, a landing or sales page, an email sequence, product descriptions, headlines and slogans. Where results are unavailable or confidential, show your thinking: the framework, the audience insight and the alternative versions you wrote for testing. Present copy as it appeared (screenshots of ads and pages help) or as a clean document, and never claim results you cannot support.",
        decision: {
          scenario: "Your landing page for a client converted well, but the client asked you not to share their figures.",
          question: "How should you showcase it?",
          options: [
            { id: "a", text: "Respect confidentiality: show the copy (with permission) and describe your approach without the figures, or ask permission to share a percentage", why: "Right. Client confidentiality comes first; your thinking and the copy itself are still strong evidence." },
            { id: "b", text: "Publish the figures anyway", whyWrong: "Breaking a client's confidence destroys trust and future referrals." },
            { id: "c", text: "Invent different figures", whyWrong: "Inventing results is dishonest." },
            { id: "d", text: "Leave it out of your portfolio entirely", whyWrong: "You can usually still show the work and approach, with permission." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-show-professional",
        title: "Showcasing professional writing samples",
        explain:
          "Professional writing samples prove you can be trusted with an organisation's important documents: a proposal, a report with an executive summary, a policy or SOP, a user guide, a set of workplace emails, a company profile, a CV and cover letter. Because real business documents are often confidential, anonymise them (remove names, figures and identifying details) with permission, or use practice documents for fictional organisations, clearly labelled. Show structure and clarity: the reader should see your executive summary, headings, tables and plain language at a glance. These samples matter for communications, proposal, technical writing and corporate roles, where documents, not blog posts, are the job.",
        writingLab: {
          task:
            "Write three project descriptions, one for each piece in the brief, using Challenge, Approach and Result. Fill Title, Type (including the discipline and \"practice project\"), Challenge (at least 15 words), Approach (at least 20 words, in the first person) and Result (at least 12 words, with at least one number). The three must cover content, copy and professional writing.",
          brief: DESC_BRIEF,
          doc: DESC_DOC,
          tests: [
            { label: "Every field filled for all three projects", check: String.raw`const p = sections('Project '); return p.length === 3 && p.every((x) => words(field(x.text, 'Title') || '') >= 3 && words(field(x.text, 'Challenge') || '') >= 15 && words(field(x.text, 'Approach') || '') >= 20 && words(field(x.text, 'Result') || '') >= 12);`, fail: "Fill every field: Title, Type, Challenge (15+ words), Approach (20+) and Result (12+)." },
            { label: "Each is labelled as a practice project", check: String.raw`return sections('Project ').every((x) => /practice/i.test(field(x.text, 'Type') || ''));`, fail: "These were practice projects. Say so in each Type field." },
            { label: "Approach in the first person", check: String.raw`return sections('Project ').every((x) => /\bI\b/.test(field(x.text, 'Approach') || ''));`, fail: "Describe your approach as \"I researched…, I structured…\"." },
            { label: "Each result includes a number", check: String.raw`return sections('Project ').every((x) => /\d/.test(field(x.text, 'Result') || ''));`, fail: "Give each result at least one number: length, reading grade, value, count." },
            { label: "Covers content, copy and professional writing", check: String.raw`const t = sections('Project ').map((x) => (field(x.text, 'Type') || '').toLowerCase()).join(' '); return /content/.test(t) && /copy/.test(t) && /professional/.test(t);`, fail: "Name the discipline in each Type: content writing, copywriting, professional writing." },
          ],
          solution: DESC_DONE,
          hint: "For each piece ask: what was the problem, what did I decide, and what does the finished piece achieve?",
          successMessage: "Three project descriptions that show your thinking, not just your words.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 20.10 – 20.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l78-online",
    moduleId: "cw-m20-portfolio",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.10", "20.11", "20.12"],
    title: "Online Portfolios, Presentations and Interviews",
    subtitle: "Putting your work online, presenting it, and passing writing tests and interviews",
    estimatedMinutes: 45,
    intro:
      "Your work needs a home online, and you need to present it confidently. This lesson covers both, and how to prepare for the writing tests and interviews that come next.",

    atoms: [
      {
        id: "a-cw-online-portfolio",
        title: "Building an online writing portfolio",
        explain:
          "An online portfolio lets anyone see your work from a link. Options: your own website (most professional and fully yours; builders such as WordPress, Wix, Squarespace or Carrd make it straightforward, ideally with your own domain name); writer portfolio platforms such as Journo Portfolio, Contently or Clippings.me, which are quick to set up; a well-organised Notion page or Google Drive folder (simple and free, acceptable at the start); and supporting profiles, such as LinkedIn's Featured section and a Medium or Substack page for published articles. Whatever the platform, the home page should say who you are and who you help in one line, show your best work in categories, include a short About section, and end with a clear way to contact you. Make it fast, mobile-friendly and error-free, and use the same name and photo as your LinkedIn profile.",
        table: {
          caption: "Online portfolio options.",
          headers: ["Option", "Strength", "Limitation"],
          rows: [
            ["Own website (WordPress, Wix, Carrd)", "Most professional, fully yours", "Takes time; domain and hosting cost"],
            ["Journo Portfolio, Contently, Clippings.me", "Quick, designed for writers", "Less control; free plans have limits"],
            ["Notion page or Google Drive folder", "Free and simple", "Looks less polished"],
            ["LinkedIn Featured, Medium, Substack", "Where readers and recruiters already are", "Best as support, not the only home"],
          ],
        },
      },
      {
        id: "a-cw-presenting-work",
        title: "Presenting work to prospective employers and clients",
        explain:
          "When you present your portfolio, in an interview, a sales call or a pitch email, select rather than show everything. Before the meeting, choose the three pieces most relevant to this employer or client and prepare a two-minute story for each: the challenge, your approach and the result. Lead with the piece closest to their need. Explain your decisions, not just the outcome (\"I chose PAS because the audience already felt the problem\"), because clients hire your judgement. Be honest about what was yours in team projects and which pieces were practice. In emails, link directly to the two or three relevant samples rather than sending the whole portfolio. Afterwards, send a short thank-you with the links again.",
        decision: {
          scenario: "A writing test asks for \"a 300-word article introduction for first-time investors, in a friendly tone, within 45 minutes\".",
          question: "What is the best approach?",
          options: [
            { id: "a", text: "Spend a few minutes planning (reader, key message, hook), write, then keep ten minutes to edit to exactly what the brief asks", why: "Right. Tests check that you follow a brief, write well under time pressure and edit your work." },
            { id: "b", text: "Write 1,000 words to show effort", whyWrong: "Ignoring the brief's length is the fastest way to fail a test." },
            { id: "c", text: "Paste an AI answer to save time", whyWrong: "Unedited AI text is easy to spot and may break the test's rules." },
            { id: "d", text: "Write in a formal academic style to sound expert", whyWrong: "The brief asks for a friendly tone for first-time investors." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-tests-interviews",
        title: "Preparing for writing assessments and interviews",
        explain:
          "Most writing jobs include a writing test: a short brief to complete in a time limit (for example, a 300-word blog introduction and three headlines in an hour), an editing test (correct a flawed document), or a paid trial article. Prepare by practising timed exercises like the labs in this course, reading the brief twice, planning before writing, and keeping time to edit. Follow the brief exactly (length, tone, format), check every fact you use, and proofread; never submit unedited AI output. Be cautious of unpaid tests that look like real client work. In interviews, expect questions such as \"Tell us about a piece you're proud of\", \"How do you research a topic you don't know?\", \"How do you handle feedback?\" and \"How do you use AI?\". Answer with the STAR structure: Situation, Task, Action, Result. Prepare questions to ask them, such as how they measure content success.",
        writingLab: {
          task:
            "Write your portfolio's home page and one interview answer. Headline: 12 words or fewer, saying who you are and who you help. Introduction: two or three sentences with your strongest proof (a number). Work: three bullets starting with Content:, Copy: and Professional:, each naming a piece. Call to action: inviting contact, with an email address or LinkedIn. Interview answer: \"Tell us about a piece of writing you're proud of\", as four bullets labelled Situation:, Task:, Action: and Result:, with the Result including a number. Use your own work or the course pieces.",
          doc: HOME_DOC,
          tests: [
            { label: "Headline: who you are and who you help, 12 words or fewer", check: String.raw`const h = section('Headline') || ''; return words(h) >= 4 && words(h) <= 12 && /(writer|copywriter|editor)/i.test(h) && /\bfor\b/i.test(h);`, fail: "Say what you are and who you serve in 12 words or fewer, such as \"Content writer for fintech brands\"." },
            { label: "Introduction: two or three sentences with proof", check: String.raw`const i = section('Introduction') || ''; const n = sentences(i).length; return n >= 2 && n <= 3 && nums(i).length >= 1;`, fail: "In two or three sentences, say what you write and for whom, with a number as proof." },
            { label: "Work in three categories", check: String.raw`const b = bullets(section('Work')); return ['content:', 'copy:', 'professional:'].every((k) => b.some((x) => x.toLowerCase().startsWith(k) && words(x) >= 5));`, fail: "Write three bullets starting Content:, Copy: and Professional:, each naming a piece." },
            { label: "A call to action with a way to contact you", check: String.raw`const c = section('Call to action') || ''; return /(@|linkedin)/i.test(c) && /(email|message|contact|get in touch)/i.test(c);`, fail: "Invite readers to contact you, and give an email address or LinkedIn." },
            { label: "Interview answer in STAR, with a numbered result", check: String.raw`const a = section('Interview answer'); return ['Situation', 'Task', 'Action', 'Result'].every((f) => words(field(a, f) || '') >= 8) && /\d/.test(field(a, 'Result') || '');`, fail: "Label four bullets Situation:, Task:, Action: and Result:, eight words or more each, with a number in the Result." },
          ],
          solution: HOME_DONE,
          hint: "Your home page headline is your positioning statement from Module 19, shortened.",
          successMessage: "A portfolio home page that tells a visitor in seconds who you are and why to hire you, and an interview answer ready to use.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 20.P · THE FINAL CAPSTONE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l79-capstone",
    moduleId: "cw-m20-portfolio",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.P"],
    title: "Final Capstone: A Ten-Piece Portfolio",
    subtitle: "Everything you have learned, written for one business",
    estimatedMinutes: 240,
    intro:
      "The capstone brings the whole course together. You will write ten professional pieces for one business, in four labs, and finish with the portfolio that presents them. Take your time: this is the work you will show employers and clients.",

    atoms: [
      {
        id: "a-cw-capstone-brief",
        title: "The capstone brief",
        explain:
          "Choose one business and write everything it needs. The brief below gives you SunCity Solar, a solar installer in Abuja, with all the facts you need; you may instead invent a business of your own, as long as you write down equally detailed facts first and use them consistently. The ten pieces are: (1) a researched, SEO-optimised blog article; (2) a homepage content package; (3) a seven-day social media calendar; (4) an advertisement using a named copywriting framework; (5) a persuasive landing page; (6) a five-email marketing campaign; (7) a formal business proposal; (8) a business report; (9) a collection of workplace emails; and (10) your writer's portfolio presenting all of the above. Use one consistent brand voice (calm, trustworthy and practical for SunCity), keep every fact consistent across all ten pieces, check every claim against the brief, and edit each piece with the style report before you check it. Each lab shows a model answer after an attempt; read it after you have written your own.",
        table: {
          caption: "The ten capstone pieces and the modules that taught them.",
          headers: ["Piece", "Lab", "Modules"],
          rows: [
            ["1. SEO blog article", "A: Content", "4, 5, 6"],
            ["2. Homepage content package", "A: Content", "7"],
            ["3. Seven-day social media calendar", "A: Content", "7, 8"],
            ["4. Advertisement using a framework", "B: Copy", "9, 10, 11"],
            ["5. Persuasive landing page", "B: Copy", "11"],
            ["6. Five-email marketing campaign", "B: Copy", "12"],
            ["7. Formal business proposal", "C: Professional", "13, 15"],
            ["8. Business report", "C: Professional", "13, 15"],
            ["9. Workplace emails", "C: Professional", "14"],
            ["10. Writer's portfolio", "D: Portfolio", "16, 19, 20"],
          ],
        },
      },
      {
        id: "a-cw-capstone-content",
        title: "Capstone A: content writing",
        explain:
          "Write pieces 1 to 3. The SEO article must target the keyword from the brief (or your own business's keyword), match its intent, cite its sources, and help a homeowner decide. The homepage must answer a visitor's three questions in seconds. The calendar must mix post types and platforms with real hooks and calls to action.",
        writingLab: {
          task:
            "1. SEO article: a Headline and Meta title containing the keyword, a Meta title of 50 to 60 characters, a Meta description of 120 to 160 characters, and an Article of 500 to 900 words with the keyword in its first 100 words, at least four \"#### \" sections, at least two source links, grade 9 or below, and a closing call to action. 2. Homepage: a hero headline of 10 words or fewer, a subheadline, a verb-first button, three benefit bullets with facts, proof with a number, and a closing call to action. 3. Calendar: seven rows, Monday to Sunday, at least three platforms and four post types, each with a hook and a verb-first CTA.",
          brief: SUNCITY,
          briefTitle: "The capstone brief",
          doc: CONTENT_DOC,
          tests: [
            { label: "Article: keyword in headline, meta lengths right", check: String.raw`const kw = /cost of solar installation in abuja/i; const t = (section('Meta title') || '').trim(); const d = (section('Meta description') || '').trim(); return words(section('Headline')) >= 5 && t.length >= 50 && t.length <= 60 && d.length >= 120 && d.length <= 160 && (kw.test(section('Headline') || '') || words(section('Headline')) >= 5) && /\w/.test(t);`, fail: "Write the headline, a 50–60 character meta title and a 120–160 character meta description." },
            { label: "Article: 500–900 words, keyword early, four sections, two sources", check: String.raw`const a = section('Article') || ''; const n = words(a); const kw = (field(doc, 'SEO keyword') || '').toLowerCase(); const early = wordList(a).slice(0, 100).join(' ').toLowerCase(); return n >= 500 && n <= 900 && headings(4).length >= 4 && links(a).length >= 2 && (/cost of solar installation in abuja/.test(early) || (kw && early.includes(kw)));`, fail: "Write 500 to 900 words, use the keyword in the first 100 words, add four \"#### \" sections and at least two source links." },
            { label: "Article: grade 9 or below, ends with a call to action", check: String.raw`const a = (section('Article') || '').split(/^####\s+Sources/m)[0]; return grade(a) <= 9 && sentences(a).slice(-2).some((s) => isAction(s));`, fail: "Keep the article at grade 9 or below and end with a clear next step." },
            { label: "Homepage: hero, button, three benefits, proof, close", check: String.raw`const h = section('Hero headline') || ''; const b = (section('Button') || '').trim(); return words(h) >= 3 && words(h) <= 10 && words(section('Subheadline')) >= 8 && words(b) >= 2 && words(b) <= 5 && isAction(b) && bullets(section('Benefits')).filter((x) => /\d/.test(x)).length >= 2 && bullets(section('Benefits')).length >= 3 && nums(section('Proof')).length >= 1 && isAction(lastSentence(section('Closing call to action')));`, fail: "Write every homepage part: a short hero, a subheadline, a verb-first button, three benefits (two with numbers), proof with a number and a closing CTA." },
            { label: "Calendar: seven days, mixed platforms and types, hooks and CTAs", check: String.raw`const r = rows(section('3. Seven-day')).filter((c) => words(c[0]) >= 1); const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; return days.every((d) => r.some((c) => c[0].toLowerCase().startsWith(d))) && new Set(r.map((c) => c[1].toLowerCase())).size >= 3 && new Set(r.map((c) => c[2].toLowerCase())).size >= 4 && r.every((c) => words(c[3]) >= 4 && isAction(c[4] || ''));`, fail: "Seven rows, Monday to Sunday, at least three platforms and four post types, each with a hook and a verb-first CTA." },
          ],
          solution: CONTENT_DONE,
          hint: "Write the article first: its research gives you the facts and proof points for the homepage and the calendar.",
          successMessage: "Pieces 1 to 3 done: an SEO article, a homepage and a week of social content, all in one voice.",
        },
      },
      {
        id: "a-cw-capstone-copy",
        title: "Capstone B: copywriting",
        explain:
          "Write pieces 4 to 6 around one offer (for SunCity, the new 0% interest payment plan and the free surge protector until 31 March). Name the framework for the advertisement and follow it. Keep the landing page's message matched to the ad, and plan the five emails as a sequence with five different jobs.",
        writingLab: {
          task:
            "4. Advertisement: name the framework (AIDA, PAS, BAB, FAB or 4Ps) on the Framework line, then write the advert in that framework with each part labelled in bold (for example **Problem:**), 50 to 140 words, ending with a verb-first call to action. 5. Landing page: every part, at least three benefits, proof with a number, the offer with its deadline, and a verb-first call to action. 6. Five emails: each with a \"Subject:\" line (50 characters or fewer), a \"Preview:\" line (40 to 90 characters), a greeting with a merge field and fallback, a short CTA line starting with a verb, and 40 to 160 words; no spam phrases.",
          brief: SUNCITY,
          briefTitle: "The capstone brief",
          doc: COPY_DOC,
          tests: [
            { label: "Advert: a named framework with its parts labelled", check: String.raw`const s = section('4. Advertisement') || ''; const f = (field(s, 'Framework') || '').toUpperCase().replace(/\s/g, ''); const parts = { AIDA: ['Attention', 'Interest', 'Desire', 'Action'], PAS: ['Problem', 'Agitation', 'Solution'], BAB: ['Before', 'After', 'Bridge'], FAB: ['Feature', 'Advantage', 'Benefit'], '4PS': ['Promise', 'Picture', 'Proof', 'Push'] }[f]; return Boolean(parts) && parts.every((p) => new RegExp('\\*\\*' + p + 's?:?\\*\\*', 'i').test(s));`, fail: "Name one framework (AIDA, PAS, BAB, FAB or 4Ps) and label each of its parts in bold, such as **Problem:**." },
            { label: "Advert: 50 to 140 words, ending with a call to action", check: String.raw`const s = section('4. Advertisement') || ''; return words(s) >= 50 && words(s) <= 140 && isAction(lastSentence(s));`, fail: "Keep the advert to 50 to 140 words and end with a verb-first call to action." },
            { label: "Landing page: every part, proof, offer with deadline, CTA", check: String.raw`const lp = section('5. Landing page'); const s = (h) => (sections(h, lp)[0] || {}).text || ''; return ['Headline', 'Subheadline', 'Benefits', 'Proof', 'Offer', 'Call to action'].every((h) => words(s(h)) >= 3) && bullets(s('Benefits')).length >= 3 && nums(s('Proof')).length >= 1 && /(\d{1,2} (january|february|march|april|may|june|july|august|september|october|november|december)|until|by)/i.test(s('Offer')) && isAction(s('Call to action'));`, fail: "Write every landing-page part: three benefits, proof with a number, the offer with its deadline and a verb-first CTA." },
            { label: "Five emails with subject, preview, merge field and CTA", check: String.raw`const e = sections('Email ', section('6. Five-email')); return e.length === 5 && e.every((x) => { const s = field(x.text, 'Subject') || ''; const p = field(x.text, 'Preview') || ''; return s.length >= 10 && s.length <= 50 && p.length >= 40 && p.length <= 90 && /\{\{\s*\w+\s*\|[^}]+\}\}/.test(x.text) && lines(x.text).some((l) => isAction(l) && words(l) <= 9 && !/^(subject|preview):/i.test(l)) && words(x.text) >= 40 && words(x.text) <= 160; });`, fail: "Each email needs a Subject (50 characters or fewer), a Preview (40–90), a {{field|fallback}} greeting, a short verb-first CTA line, and 40 to 160 words." },
            { label: "No spam patterns", check: String.raw`return !/(100% free|act now|you'?re a winner|guaranteed income|click here now|!!)/i.test(doc);`, fail: "Remove spam phrases and repeated exclamation marks." },
          ],
          solution: COPY_DONE,
          hint: "Decide the offer and its deadline first; then the ad, landing page and emails all point to the same action.",
          successMessage: "Pieces 4 to 6 done: an advert in a named framework, a landing page and a five-email campaign.",
        },
      },
      {
        id: "a-cw-capstone-professional",
        title: "Capstone C: professional writing",
        explain:
          "Write pieces 7 to 9. The proposal must be about the client's problem first and make the decision easy. The report must present results honestly against targets and end in specific recommendations. The workplace emails show you can write to staff, partners and colleagues with the right tone for each.",
        writingLab: {
          task:
            "7. Proposal: an Executive summary (50 to 120 words, with a recommendation), The challenge, a Proposed solution with at least three bullets, a Pricing table with at least two rows of prices, and Next steps with a date. 8. Report: a Summary of two or three sentences, a Results table with at least three measures showing target and actual, Findings (at least 25 words) and at least three numbered Recommendations. 9. Three workplace emails (to staff, to a supplier, and appreciation), each with a \"Subject:\" line, a greeting, a clear purpose and a sign-off with a name; 40 to 160 words each.",
          brief: SUNCITY,
          briefTitle: "The capstone brief",
          doc: PRO_DOC,
          tests: [
            { label: "Proposal: summary with a recommendation, the challenge, solution bullets", check: String.raw`const p = section('7. Business proposal'); const s = (h) => (sections(h, p)[0] || {}).text || ''; return words(s('Executive summary')) >= 50 && words(s('Executive summary')) <= 120 && /(recommend|propose)/i.test(s('Executive summary')) && words(s('The challenge')) >= 20 && bullets(s('Proposed solution')).length >= 3;`, fail: "Write a 50–120 word summary with a recommendation, the client's challenge, and at least three solution bullets." },
            { label: "Proposal: pricing table and dated next steps", check: String.raw`const p = section('7. Business proposal'); const s = (h) => (sections(h, p)[0] || {}).text || ''; return rows(s('Pricing')).filter((c) => /₦|\d/.test(c.slice(1).join(' '))).length >= 2 && /\d/.test(s('Next steps')) && words(s('Next steps')) >= 12;`, fail: "Add a pricing table with at least two priced rows and next steps with a date." },
            { label: "Report: summary, results table, findings and three recommendations", check: String.raw`const r = section('8. Business report'); const s = (h) => (sections(h, r)[0] || {}).text || ''; const n = sentences(s('Summary')).length; return n >= 2 && n <= 3 && rows(s('Results')).filter((c) => c.length >= 3 && words(c[0]) >= 1).length >= 3 && words(s('Findings')) >= 25 && numbered(s('Recommendations')).length >= 3;`, fail: "Write a two- or three-sentence summary, a results table with three measures, findings and three numbered recommendations." },
            { label: "Three workplace emails, each complete", check: String.raw`const e = sections('Email ', section('9. Workplace emails')); return e.length >= 3 && e.every((x) => words(field(x.text, 'Subject') || '') >= 3 && /^(Dear|Hi|Hello|Good (morning|afternoon))\b/m.test(x.text) && words(x.text) >= 40 && words(x.text) <= 160 && /(regards|thank you|thanks|sincerely|well done)[\s\S]*\n[A-Z][a-z]+/i.test(x.text));`, fail: "Each email needs a Subject line, a greeting, a purpose, a sign-off with a name, and 40 to 160 words." },
          ],
          solution: PRO_DONE,
          hint: "For the proposal, start from the client's problem; for the report, from the targets. Let the facts decide the recommendations.",
          successMessage: "Pieces 7 to 9 done: a proposal, a report and workplace emails that any organisation would be glad to send.",
        },
      },
      {
        id: "a-cw-capstone-portfolio",
        title: "Capstone D: your writer's portfolio",
        explain:
          "Piece 10 presents the other nine. Write the portfolio page you will publish online: who you are and who you help, your services, your selected work grouped by category with a one-line description of each, honest labels for practice work, a testimonial or a line on how you work, and a clear way to contact you. Then publish it (Lesson 78) with the nine capstone pieces attached or linked.",
        writingLab: {
          task:
            "About me: two or three sentences in the first person, saying what you write and for whom. Services: at least three bullets. Selected work: at least six bullets, each starting with Content:, Copy: or Professional:, with at least two in each category, naming the piece with a short description, and practice work labelled \"practice\". What clients say: a testimonial or a line on how you work. Contact: an email address or LinkedIn, and a response time.",
          brief: SUNCITY,
          briefTitle: "The capstone brief",
          doc: PORT_DOC,
          tests: [
            { label: "About me: two or three sentences, first person", check: String.raw`const a = section('About me') || ''; const n = sentences(a).length; return n >= 2 && n <= 3 && /\bI\b/.test(a) && /(writ|copy)/i.test(a);`, fail: "Write two or three sentences in the first person about what you write and for whom." },
            { label: "At least three services", check: "return bullets(section('Services')).filter((b) => words(b) >= 3).length >= 3;", fail: "List at least three services." },
            { label: "Six selected pieces, two per category", check: String.raw`const b = bullets(section('Selected work')); const c = (k) => b.filter((x) => x.toLowerCase().startsWith(k) && words(x) >= 6).length; return b.length >= 6 && c('content:') >= 2 && c('copy:') >= 2 && c('professional:') >= 2;`, fail: "List at least six pieces, starting Content:, Copy: or Professional:, with two in each category." },
            { label: "Practice work labelled honestly", check: String.raw`const b = bullets(section('Selected work')); return b.filter((x) => /practice/i.test(x)).length >= Math.min(6, b.length) || /practice/i.test(section('Selected work') || '');`, fail: "Label capstone and course pieces as practice projects." },
            { label: "Testimonial or working style, and contact details", check: String.raw`const c = section('Contact') || ''; return words(section('What clients say')) >= 10 && /(@|linkedin)/i.test(c) && /(reply|respond|within)/i.test(c);`, fail: "Add a testimonial or a line on how you work, and contact details with a response time." },
          ],
          solution: PORT_DONE,
          hint: "Use your portfolio plan from Lesson 76 and your positioning statement from Module 19 as the starting points.",
          successMessage: "The capstone is complete: ten professional pieces for one business, presented in a portfolio. Publish it, and start applying.",
        },
      },
    ],

    task: {
      title: "Final capstone: publish your portfolio and apply",
      intro: "Finish the course the way a professional writer would: with your work in front of the people who hire writers.",
      prompts: [
        "Download all ten capstone pieces from the Writing Desk, format them in Google Docs or Word, and export each to PDF.",
        "Publish your portfolio online (your own site, a portfolio platform or a Notion page), using your Capstone D page as the home page.",
        "Add three pieces to the Featured section of your LinkedIn profile and update your headline and About section.",
        "Apply for three writing roles or send three freelance proposals, each linking to the two most relevant pieces.",
        "Book your final certification exam, then keep writing: one new portfolio piece every month keeps your skills and your portfolio growing.",
      ],
      closing: "Congratulations on completing Content Writing, Copywriting & Professional Communication. You now write for every purpose a business has.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
