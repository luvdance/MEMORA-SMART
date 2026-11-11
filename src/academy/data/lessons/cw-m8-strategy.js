/**
 * CONTENT WRITING · MODULE 8 · CONTENT STRATEGY AND STORYTELLING
 *
 * Curriculum 8.1 – 8.14 and the practical 8.P. Content strategy and content
 * marketing, business objectives, audiences and personas, pillars and
 * categories, planning, brand storytelling and narrative structures,
 * educational content, distribution, measurement and analytics; then a
 * 30-day content strategy.
 *
 * Analytics figures in briefs are invented for practice.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s8-strategy";

/* ── Lesson 28 lab: from business objective to persona ─────────────────── */
const OBJ_BRIEF = `**TutorLink** connects secondary school students in Abuja with vetted home tutors for maths, English and the sciences. The founder says: "We want more parents to book tutors. Right now we get about 40 new bookings a month, mostly from referrals. We'd like 100 a month by the end of June, and we think content could help."

What the team knows about customers: most bookings are made by mothers aged 35 to 50 with children in SS1 to SS3. Their biggest worries are WAEC and JAMB results and whether a stranger in the home is safe. Most of them use WhatsApp and Facebook daily and search Google when they need a service.`;

const OBJ_DOC = `# TutorLink content strategy: foundations

## Business objective
[One SMART objective: specific, measurable, achievable, relevant, time-bound.]

## Content goals
[Two or three "- " bullets: what content must do to support the objective.]

## Target audience
[One or two sentences.]

## Persona
- Name:
- Age:
- Situation:
- Goals:
- Worries:
- Channels:
`;

const OBJ_DONE = `# TutorLink content strategy: foundations

## Business objective
Increase new tutor bookings from 40 to 100 a month by 30 June, with at least 40 of them coming from people who found us through our content.

## Content goals
- Build trust by showing how we vet and train every tutor
- Attract parents searching for exam help with useful WAEC and JAMB preparation content
- Turn readers into enquiries with a clear WhatsApp booking link on every piece

## Target audience
Parents in Abuja, mostly mothers aged 35 to 50, whose children are in SS1 to SS3 and preparing for WAEC and JAMB.

## Persona
- Name: Mrs Hauwa Danjuma
- Age: 43
- Situation: civil servant in Abuja with a son in SS2 who is struggling with maths
- Goals: help her son pass WAEC maths with a credit and get into university
- Worries: letting a stranger into her home, and paying for tutoring that does not work
- Channels: WhatsApp and Facebook daily, Google when she needs a service
`;

/* ── Lesson 29 lab: a brand story ──────────────────────────────────────── */
const STORY_BRIEF = `TutorLink's founder, **Ibrahim Yusuf**, told you this in an interview:

"In 2021 my niece Amina failed WAEC maths twice. Her parents had paid three different tutors. One stopped coming, one spent the lessons on his phone, and nobody ever told them what Amina was actually struggling with. I'm an engineer, and I was tutoring her myself on weekends. I realised the problem wasn't Amina. It was that parents had no way to find a good tutor or to know if the lessons were working. So I started TutorLink: every tutor is vetted and trained, and parents get a short progress report after every lesson. Amina passed with a B3 the next year. She's now studying medicine."`;

const STORY_DOC = `# The TutorLink story

Use the story spine. Write at least one full sentence after each label.

- Once upon a time:
- Every day:
- Until one day:
- Because of that:
- Because of that, too:
- Until finally:
- And ever since then:

## The story as published
[120 to 220 words, written as flowing prose for TutorLink's About page.]
`;

const STORY_DONE = `# The TutorLink story

Use the story spine. Write at least one full sentence after each label.

- Once upon a time: Ibrahim Yusuf, an engineer in Abuja, watched his niece Amina fail WAEC maths twice.
- Every day: Her parents paid tutors who missed lessons, played with their phones and never explained what Amina found hard.
- Until one day: Ibrahim started teaching her himself and realised the problem was not Amina but the lack of good, accountable tutors.
- Because of that: He started TutorLink to vet and train every tutor.
- Because of that, too: Parents now receive a short progress report after every lesson, so they know if it is working.
- Until finally: Amina passed WAEC maths with a B3 the next year.
- And ever since then: TutorLink has helped Abuja families find tutors they can trust, and Amina is now studying medicine.

## The story as published
In 2021, Ibrahim Yusuf watched his niece Amina fail WAEC maths for the second time. Her parents had done everything they could. They paid three different tutors. One stopped coming. One spent the lessons on his phone. None of them ever told the family what Amina was actually finding hard.

Ibrahim, an engineer, began tutoring her himself at weekends, and he saw the real problem. It was not Amina. It was that parents had no way to find a good tutor, and no way to know whether the lessons were working.

So he started TutorLink. Every tutor is vetted and trained before they meet a family, and parents receive a short progress report after every lesson. No more guessing, and no more paying for lessons that go nowhere.

The next year, Amina passed WAEC maths with a B3. Today she is studying medicine. Every tutor we send into an Abuja home carries that story with them.
`;

/* ── Lesson 30 lab: reading the numbers ────────────────────────────────── */
const DATA_BRIEF = `TutorLink's content results for April (figures invented for practice):

| Piece | Channel | Impressions | Engagements | Link clicks | Enquiries |
|-------|---------|-------------|-------------|-------------|-----------|
| "WAEC maths: 10 topics that always come out" | Blog (from Google) | 12,000 | 300 | 480 | 24 |
| Tutor vetting carousel | Facebook | 20,000 | 1,000 | 200 | 4 |
| Parent testimonial video | WhatsApp Status | 2,500 | 250 | 100 | 10 |

Definitions used in this course:
- **Engagement rate** = engagements ÷ impressions × 100
- **Click-through rate (CTR)** = link clicks ÷ impressions × 100
- **Conversion rate** = enquiries ÷ link clicks × 100`;

const DATA_DOC = `# April content report

## Engagement rate of the Facebook carousel (%)

## CTR of the blog post (%)

## Conversion rate of the WhatsApp video (%)

## Which piece produced the most enquiries?

## Recommendation
[At least 40 words: what should TutorLink do more of in May, and why? Use the numbers.]
`;

const DATA_DONE = `# April content report

## Engagement rate of the Facebook carousel (%)
5%

## CTR of the blog post (%)
4%

## Conversion rate of the WhatsApp video (%)
10%

## Which piece produced the most enquiries?
The WAEC maths blog post, with 24 enquiries.

## Recommendation
Write more exam-preparation blog posts like the WAEC maths article. It produced 24 of April's 38 enquiries because parents searching Google are already looking for help. The Facebook carousel had the best engagement at 5% but only 4 enquiries, so keep it for building trust, and add a clearer booking link. The testimonial video converted 10% of clicks, so share more parent stories on WhatsApp.
`;

/* ── Lesson 31 lab: the 30-day strategy ────────────────────────────────── */
const PLAN_BRIEF = `Write a 30-day content strategy for **TutorLink** for June, using everything you have produced in this module: the objective (100 bookings a month), the persona (parents of SS1–SS3 students in Abuja), the brand story, and April's results (the blog brought the most enquiries; parent stories converted well on WhatsApp; the Facebook carousel built engagement). WAEC exams run from early May to late June, and many parents plan holiday lessons in July.`;

const PLAN_DOC = `# TutorLink: 30-day content strategy for June

## Objective
[The SMART business objective and how content supports it.]

## Audience
[Who the content is for.]

## Content pillars
| Pillar | Share of content | Example piece |
|--------|------------------|---------------|
|  |  |  |

## Channels
[One "- " bullet per channel: what it is used for and how often.]

## Weekly plan
| Week | Theme | Key pieces |
|------|-------|------------|
|  |  |  |

## KPIs
| KPI | Target for June |
|-----|-----------------|
|  |  |
`;

const PLAN_DONE = `# TutorLink: 30-day content strategy for June

## Objective
Grow new bookings to 100 in June, with at least 40 coming from content. Content will build trust in our vetted tutors, attract parents searching for exam help, and send every reader to our WhatsApp booking line.

## Audience
Parents in Abuja, mostly mothers aged 35 to 50, with children in SS1 to SS3 who are preparing for WAEC and JAMB.

## Content pillars
| Pillar | Share of content | Example piece |
|--------|------------------|---------------|
| Exam help | 40% | "WAEC biology: how to answer essay questions" blog post |
| Trust and safety | 25% | Carousel: the five checks every tutor passes |
| Parent and student stories | 20% | Video: Amina's story, from F9 to B3 |
| Holiday lessons offer | 15% | Post: book July holiday lessons early |

## Channels
- Blog: two exam-help articles a week, optimised for Google searches
- Facebook: three posts a week, mainly trust and stories, each with the booking link
- WhatsApp Status and channel: daily, with parent stories and exam tips
- Email to past enquirers: one newsletter a week

## Weekly plan
| Week | Theme | Key pieces |
|------|-------|------------|
| Week 1 | Last-minute WAEC help | Two blog posts on final revision, daily tips on WhatsApp |
| Week 2 | Why parents trust TutorLink | Vetting carousel, founder story video, FAQ post |
| Week 3 | Stories of results | Three parent testimonials, Amina's story, a student interview |
| Week 4 | Plan the holidays | Holiday lessons offer, JAMB preparation guide, booking reminder email |

## KPIs
| KPI | Target for June |
|-----|-----------------|
| Enquiries from content | 60 |
| Bookings from content | 40 |
| Blog visits from Google | 15,000 |
| Conversion rate from link clicks to enquiries | 6% |
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 8.1 – 8.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l28-strategy",
    moduleId: "cw-m8-strategy",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3", "8.4", "8.5"],
    title: "Content Strategy Foundations",
    subtitle: "Strategy, content marketing, business objectives, audiences and personas",
    estimatedMinutes: 40,
    intro:
      "Writing a good piece is a craft. Deciding which pieces to write, for whom, and why, is strategy. Writers who can do both are the ones businesses trust with budgets.",

    atoms: [
      {
        id: "a-cw-strategy-defined",
        title: "What is content strategy?",
        explain:
          "Content strategy is the plan for using content to achieve a business goal: what content to create, for which audience, on which channels, how often, in what voice, and how success will be measured. It answers why before what. Without a strategy, businesses post whatever comes to mind, measure likes, and wonder why nothing changes. A written strategy usually covers: the business objective; the audience and personas; the content's role (what it must do for the audience and the business); content pillars; channels and frequency; the voice; the workflow (who writes, edits and approves); and the metrics and review schedule. It does not need to be long: a clear two-page strategy that everyone follows is worth more than a fifty-page document nobody reads.",
      },
      {
        id: "a-cw-content-marketing",
        title: "Content marketing fundamentals",
        explain:
          "Content marketing is attracting and keeping customers by consistently publishing valuable content, rather than by interrupting them with adverts. It works along the customer journey, often described as a funnel. At the top (awareness), people have a problem but do not know you: educational content and search articles attract them. In the middle (consideration), they compare solutions: guides, comparisons, case studies and stories build trust. At the bottom (decision), they are ready to choose: testimonials, FAQs, offers and clear calls to action help them act. After purchase (retention), newsletters and helpful content keep them coming back and referring others. Content marketing is slower than advertising, but its results compound: a good article can bring customers for years.",
        table: {
          caption: "Content for each stage of the customer journey.",
          headers: ["Stage", "The customer is…", "Content that helps"],
          rows: [
            ["Awareness", "Noticing a problem", "Educational articles, tips, social posts"],
            ["Consideration", "Comparing solutions", "Guides, comparisons, case studies, stories"],
            ["Decision", "Ready to choose", "Testimonials, FAQs, offers, clear CTAs"],
            ["Retention", "Already a customer", "Newsletters, how-to help, community content"],
          ],
        },
      },
      {
        id: "a-cw-business-objectives",
        title: "Understanding business objectives",
        explain:
          "Content must serve a business objective, not just \"get engagement\". Common objectives are more sales or bookings, more qualified leads, lower customer-support costs, better customer retention, a new market entered, or a stronger reputation. Write objectives in SMART form: Specific (what exactly), Measurable (a number), Achievable (realistic from where the business is), Relevant (it matters to the business) and Time-bound (a deadline). \"Get more customers\" is a wish; \"Increase new bookings from 40 to 100 a month by 30 June\" is an objective. Then decide what content must do to contribute, and how you will know: for example, at least 40 bookings coming from people who found the business through content.",
        decision: {
          scenario: "A client says: \"Our goal for content is to go viral.\"",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Ask what business result they want (sales, leads, bookings) and agree a measurable target that content can contribute to", why: "Right. Virality is not an objective; it may or may not produce customers. Tie content to a measurable business result." },
            { id: "b", text: "Promise viral content", whyWrong: "Nobody can promise virality, and views alone may not help the business." },
            { id: "c", text: "Focus only on follower numbers", whyWrong: "Followers are a means, not the end, and can be bought or irrelevant." },
            { id: "d", text: "Decline: content cannot help businesses", whyWrong: "It can, when it is tied to a real objective." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-target-audiences",
        title: "Identifying target audiences",
        explain:
          "A target audience is the specific group a strategy is designed to reach: the people who make or influence the buying decision. Identify it from evidence: who already buys (customer records, sales conversations), who buys most or most often, who the business wants more of, and who is involved in the decision (for tutoring, the student uses the service but the parent books and pays). Describe the audience by demographics (age, location, income, role), situation (what is happening in their life that creates the need), needs and worries, and media habits (which channels they use, when). A strategy can have a primary and a secondary audience, but content for each should be written separately.",
      },
      {
        id: "a-cw-strategy-personas",
        title: "Developing audience personas",
        explain:
          "In Module 3 you built a persona to write a single message. In strategy, personas guide months of content, so they need more detail: goals and worries in the buying decision, the questions they ask at each stage of the journey, the objections that stop them, the channels they use and the times they use them, and who influences them. Keep one to three personas, each based on research: interviews with customers, the sales team's knowledge, reviews, comments and analytics. Give each a name and a short situation so the team can ask, \"Would Mrs Danjuma care about this post?\" Review personas at least once a year, because audiences change.",
        writingLab: {
          task:
            "Set TutorLink's strategy foundations. Business objective: one SMART sentence with numbers and a deadline (use the founder's figures: from 40 to 100 bookings a month by the end of June). Content goals: two or three bullets saying what content must do. Target audience: one or two sentences from the evidence. Persona: fill every field with specific detail (Situation, Goals, Worries and Channels need at least four words each), and make the worries match the research (exam results or safety).",
          brief: OBJ_BRIEF,
          doc: OBJ_DOC,
          tests: [
            { label: "Objective: SMART, with 40, 100 and a June deadline", check: String.raw`const o = section('Business objective') || ''; return /40/.test(o) && /100/.test(o) && /june/i.test(o) && /(booking|bookings)/i.test(o) && sentences(o).length <= 2;`, fail: "Write one measurable objective: bookings, from 40 to 100 a month, by a date in June." },
            { label: "Two or three content goals", check: "const b = bullets(section('Content goals')).filter((x) => words(x) >= 5); return b.length >= 2 && b.length <= 3;", fail: "Write two or three goals of five words or more." },
            { label: "Audience matches the evidence", check: String.raw`const a = section('Target audience') || ''; return /(parent|mother)/i.test(a) && /abuja/i.test(a) && /(SS1|SS3|secondary|waec|jamb)/i.test(a);`, fail: "Describe the people who book: parents in Abuja with secondary-school children preparing for exams." },
            { label: "Every persona field filled", check: String.raw`const p = section('Persona'); return ['Name', 'Age', 'Situation', 'Goals', 'Worries', 'Channels'].every((f) => words(field(p, f) || '') >= (['Name', 'Age'].includes(f) ? 1 : 4));`, fail: "Fill every field; Situation, Goals, Worries and Channels need at least four words." },
            { label: "Persona follows the research (age 35–50, real worries and channels)", check: String.raw`const p = section('Persona'); const a = num(field(p, 'Age')); return a >= 35 && a <= 50 && /(waec|jamb|exam|stranger|safe)/i.test(field(p, 'Worries') || '') && /(whatsapp|facebook)/i.test(field(p, 'Channels') || '');`, fail: "Base the persona on the research: age 35 to 50, worries about exams or safety, on WhatsApp or Facebook." },
          ],
          solution: OBJ_DONE,
          hint: "Write the objective from the founder's own numbers, then ask what content would make Mrs Danjuma trust you enough to book.",
          successMessage: "A measurable objective and a real reader: the two things every later content decision is tested against.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 8.6 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l29-pillars-story",
    moduleId: "cw-m8-strategy",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.6", "8.7", "8.8", "8.9", "8.10"],
    title: "Pillars, Plans and Brand Stories",
    subtitle: "Content pillars, planning, brand storytelling and narrative structures",
    estimatedMinutes: 40,
    intro:
      "Pillars keep a strategy focused. Stories make it memorable. This lesson covers both, and how to plan content so it actually gets made.",

    atoms: [
      {
        id: "a-cw-pillars",
        title: "Content pillars and content categories",
        explain:
          "Content pillars are the three to five core themes a brand always talks about, chosen where the audience's interests meet the brand's expertise and goals. For TutorLink: exam help, trust and safety, parent and student stories, and offers. Every piece belongs to a pillar, which keeps content focused, makes ideas easier to generate (\"what's this week's exam help piece?\") and builds a recognisable reputation. Give each pillar a rough share of output (for example 40% exam help, 25% trust, 20% stories, 15% offers), keeping promotion the smallest share. Categories are the practical groupings used on a blog or in a calendar (Exam tips, Parent guides, News), often one or more per pillar, so readers can browse and the team can track balance.",
      },
      {
        id: "a-cw-content-planning",
        title: "Content planning and calendars",
        explain:
          "A strategy becomes real in the calendar. Plan in layers. A yearly or quarterly view marks the big moments: product launches, seasons, exams, holidays, salary dates. A monthly plan sets themes (one per week works well) and the main pieces for each. A weekly calendar (Modules 5 and 7) schedules every piece by day, channel, pillar, writer and status. Plan backwards from publish dates: a 1,500-word guide needs research, drafting, editing and approval time. Balance the pillars across the month, mix formats, and keep a backlog of ideas and a buffer of finished pieces. Review weekly what was published, and monthly what worked.",
      },
      {
        id: "a-cw-brand-story",
        title: "Brand storytelling",
        explain:
          "A brand story explains why an organisation exists in a way people remember and repeat. The strongest brand stories are true and specific: a founder who saw a problem (often personally), a turning point, a decision, and the difference it now makes for customers. The customer, not the company, should be the hero whose problem is solved; the brand is the guide that helps. Brand stories appear on About pages, in pitch decks, in founder posts, in videos, and in short form in bios and adverts. Interview the founder and early customers to find the story: ask what made them start, the hardest moment, a customer they remember, and what they would never compromise on. Never invent or exaggerate details.",
      },
      {
        id: "a-cw-narrative",
        title: "Narrative structures",
        explain:
          "Narrative structures are reusable shapes for stories. The story spine (from the theatre teacher Kenn Adams, widely used by Pixar's storytellers) is the easiest to learn: Once upon a time… Every day… Until one day… Because of that… Because of that… Until finally… And ever since then… Fill it in, then rewrite it as flowing prose. Other useful structures: the three-act structure (setup, confrontation, resolution); the hero's journey in short form (a hero with a goal meets a problem, finds a guide, takes action, and is changed); before–after–bridge (Module 10); and the challenge–action–result structure used in case studies and CVs. Choose the structure that fits the length and platform: a spine for an About page, challenge–action–result for a case study, a three-line before–after for a social post.",
        table: {
          caption: "The story spine.",
          headers: ["Line", "What it does"],
          rows: [
            ["Once upon a time…", "Introduces the character and setting"],
            ["Every day…", "Shows the normal situation and the problem"],
            ["Until one day…", "The turning point"],
            ["Because of that…", "The first consequence or action"],
            ["Because of that…", "What followed"],
            ["Until finally…", "The climax: the problem is resolved"],
            ["And ever since then…", "The new normal, and why it matters now"],
          ],
        },
      },
      {
        id: "a-cw-business-stories",
        title: "Storytelling in business and marketing",
        explain:
          "Businesses use several kinds of story. Origin stories (why we started), customer stories and case studies (how a real customer's problem was solved, with permission), people stories (the team, the cook, the tutor), product stories (how something is made or sourced), and values stories (a moment when the brand chose to do the right thing). In marketing, a story makes a benefit believable: \"Amina passed with a B3\" proves more than \"our tutors get results\". Keep stories true, specific and short; put the customer at the centre; and connect the story to what the reader can do next. Get written permission before telling any customer's story, and change details if they want privacy.",
        writingLab: {
          task:
            "Turn the founder's interview into TutorLink's brand story. First fill the story spine: at least one full sentence (6 words or more) after each of the seven labels. Then write \"The story as published\": 120 to 220 words of flowing prose (no bullet points) in at least three paragraphs, keeping the true details (Amina, WAEC maths, three tutors, progress reports, the B3) and adding nothing that is not in the interview.",
          brief: STORY_BRIEF,
          doc: STORY_DOC,
          tests: [
            { label: "All seven spine lines filled with full sentences", check: String.raw`const labels = ['Once upon a time', 'Every day', 'Until one day', 'Because of that', 'Because of that, too', 'Until finally', 'And ever since then']; return labels.every((l) => words(field(doc, l) || '') >= 6);`, fail: "Write a sentence of six words or more after every label." },
            { label: "Published story: 120 to 220 words in at least three paragraphs", check: "const s = section('The story as published'); return words(s) >= 120 && words(s) <= 220 && paragraphs(s).length >= 3 && bullets(s).length === 0;", fail: "Write the story as prose: 120 to 220 words, three or more paragraphs, no bullets." },
            { label: "Keeps the true details", check: String.raw`const s = section('The story as published') || ''; return /amina/i.test(s) && /waec/i.test(s) && /(three|3) (different )?tutors/i.test(s) && /progress report/i.test(s) && /B3/.test(s);`, fail: "Keep Amina, WAEC maths, the three tutors, the progress reports and the B3." },
            { label: "Adds no invented claims", check: String.raw`const s = section('The story as published') || ''; return !/(thousand|\d{2,}%|award|best in nigeria|number one|no\. 1|100% pass)/i.test(s);`, fail: "Do not add numbers, awards or claims the founder did not give you." },
          ],
          solution: STORY_DONE,
          hint: "Fill the spine in two minutes, then write the prose with short sentences at the moments that matter.",
          successMessage: "A true story, told in order, with the customer's problem at its centre. Every brand needs one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 8.11 – 8.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l30-measure",
    moduleId: "cw-m8-strategy",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.11", "8.12", "8.13", "8.14"],
    title: "Educating, Distributing and Measuring",
    subtitle: "Educational content, distribution channels, performance and analytics",
    estimatedMinutes: 40,
    intro:
      "Great content that nobody sees, or that nobody measures, cannot prove its worth. This lesson covers making educational content people value, getting it to them, and reading the numbers.",

    atoms: [
      {
        id: "a-cw-educational-content",
        title: "Creating engaging educational content",
        explain:
          "Educational content is the backbone of most strategies, because it attracts people when they are looking for help and proves the brand knows its subject. Make it engaging by solving one specific problem per piece, starting with the outcome (\"By the end, you will know the 10 topics that always appear in WAEC maths\"), using concrete examples and worked examples, breaking it into steps or chunks, adding visuals (tables, checklists, diagrams), and ending with something to do. Teach generously: the fear that giving away knowledge loses customers is usually wrong; people who learn from you trust you, and many still pay for help to do it well. Keep it accurate: one wrong exam date or formula destroys credibility.",
      },
      {
        id: "a-cw-distribution",
        title: "Content distribution channels",
        explain:
          "Distribution is how content reaches people. There are three kinds of channel. Owned media: channels the brand controls, such as its website and blog, email list, WhatsApp channel and app. Earned media: attention others give you, such as shares, mentions, press coverage, reviews and links from other sites. Paid media: attention you pay for, such as social media adverts, search ads, sponsored posts and influencer partnerships. Strong strategies build owned channels (especially an email list, which no platform can take away), earn attention with genuinely useful content, and use paid promotion to give the best pieces extra reach. Plan distribution for every important piece before writing it: where will it be shared, how often, and in which versions?",
        table: {
          caption: "Owned, earned and paid media.",
          headers: ["Type", "Examples", "Strength", "Weakness"],
          rows: [
            ["Owned", "Website, blog, email list, WhatsApp channel", "You control it; free to use", "Takes time to build an audience"],
            ["Earned", "Shares, press, reviews, backlinks", "Highly trusted", "You cannot control it"],
            ["Paid", "Ads, sponsored posts, influencers", "Fast, targeted reach", "Stops when the money stops"],
          ],
        },
      },
      {
        id: "a-cw-measuring",
        title: "Measuring content performance",
        explain:
          "Measure what connects to the objective. Metrics fall into levels. Reach: impressions (times content was shown), reach (people who saw it), page views. Engagement: likes, comments, shares, saves, time on page; engagement rate = engagements ÷ impressions × 100 (some tools divide by reach instead, so always state your formula). Action: link clicks and click-through rate (CTR) = clicks ÷ impressions × 100. Conversion: enquiries, sign-ups, bookings, sales; conversion rate = conversions ÷ visitors or clicks × 100. Vanity metrics (likes, followers) feel good but may not move the business; prioritise the metrics closest to the objective. Choose a few key performance indicators (KPIs) with targets, and compare like with like (the same channel, the same period).",
        example: "Engagement rate = 1,000 engagements ÷ 20,000 impressions × 100 = 5%\nCTR = 480 clicks ÷ 12,000 impressions × 100 = 4%\nConversion rate = 10 enquiries ÷ 100 clicks × 100 = 10%",
        decision: {
          scenario: "A carousel got 1,000 engagements but 4 enquiries. A blog post got 300 engagements but 24 enquiries. The objective is bookings.",
          question: "What should the strategy do?",
          options: [
            { id: "a", text: "Invest more in content like the blog post, and keep the carousel for trust with a clearer booking link", why: "Right. The objective is bookings, so the metric closest to bookings decides. Engagement still has a job: building trust." },
            { id: "b", text: "Make only carousels, because they get the most engagement", whyWrong: "Engagement is not the objective; enquiries are." },
            { id: "c", text: "Stop all content", whyWrong: "The blog is clearly producing enquiries." },
            { id: "d", text: "Ignore the numbers", whyWrong: "The numbers show where the results come from." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-analytics",
        title: "Introduction to content analytics",
        explain:
          "Content analytics means collecting and interpreting data about content to make better decisions. Tools: Google Analytics 4 for website traffic, sources and conversions; Google Search Console for search performance; Meta Business Suite, LinkedIn and X analytics for social posts; and email platform reports (Module 12). Use UTM tags (labels added to a link, such as ?utm_source=facebook&utm_campaign=june) so analytics show which post brought each visitor. Then interpret: compare pieces by the metric that matches their job, look for patterns (which pillars, formats and channels lead to conversions), and turn findings into decisions for next month. A report should end with recommendations, not just numbers.",
        writingLab: {
          task:
            "Write TutorLink's April report from the data. Calculate, using the course's formulas: the Facebook carousel's engagement rate, the blog post's CTR, and the WhatsApp video's conversion rate (each as a percentage). Name the piece that produced the most enquiries, with the number. Then write a recommendation of at least 40 words for May that uses at least two of the numbers and connects them to the objective (bookings).",
          brief: DATA_BRIEF,
          doc: DATA_DOC,
          tests: [
            { label: "Facebook engagement rate is right", check: "return Math.abs(num(section('Engagement rate')) - 5) < 0.05;", fail: "1,000 engagements ÷ 20,000 impressions × 100." },
            { label: "Blog CTR is right", check: "return Math.abs(num(section('CTR of the blog')) - 4) < 0.05;", fail: "480 clicks ÷ 12,000 impressions × 100." },
            { label: "WhatsApp conversion rate is right", check: "return Math.abs(num(section('Conversion rate')) - 10) < 0.05;", fail: "10 enquiries ÷ 100 link clicks × 100." },
            { label: "The piece with the most enquiries", check: String.raw`const s = section('Which piece') || ''; return /(blog|waec)/i.test(s) && /24/.test(s);`, fail: "Compare the Enquiries column." },
            { label: "Recommendation: 40+ words, uses the numbers, tied to bookings", check: String.raw`const r = section('Recommendation') || ''; return words(r) >= 40 && nums(r).length >= 2 && /(enquir|booking)/i.test(r);`, fail: "Recommend what to do in May, using at least two numbers, and tie it to enquiries or bookings." },
          ],
          solution: DATA_DONE,
          hint: "Each formula is a division then × 100. Check the denominator: impressions for the first two, link clicks for conversion.",
          successMessage: "Numbers calculated, compared by the right metric, and turned into a decision. That is what clients mean by a content report.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · PRACTICAL 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l31-strategy-doc",
    moduleId: "cw-m8-strategy",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.P"],
    title: "Practical: A 30-Day Content Strategy",
    subtitle: "Objective, audience, pillars, channels, weekly plan and KPIs on two pages",
    estimatedMinutes: 60,
    intro:
      "You now have every piece a strategy needs. Put them together into a 30-day strategy a client could approve on Monday and the team could follow on Tuesday.",

    atoms: [
      {
        id: "a-cw-strategy-document",
        title: "The shape of a strategy document",
        explain:
          "A short content strategy document has six parts. Objective: the SMART business goal and what content contributes. Audience: who the content is for. Content pillars: three to five themes with their share of output and an example each. Channels: each channel's role and frequency. Plan: the month's weekly themes and key pieces, tied to the audience's calendar. KPIs: three to five measures with targets, closest to the objective first. Use evidence from past results to justify choices (\"the blog brought most enquiries in April, so it gets two posts a week\"), keep promotion the smallest pillar, and make it short enough to read in five minutes.",
      },
      {
        id: "a-cw-m8-practical",
        title: "Practical: develop a 30-day content strategy",
        explain:
          "Write TutorLink's June content strategy. Use your foundations from Lesson 28, your brand story, and April's results to justify your choices, and plan around the exam and holiday calendar in the brief.",
        writingLab: {
          task:
            "Objective: include 100 bookings and how content contributes. Audience: one or two sentences. Content pillars: three to five rows whose shares add up to 100%, each with an example piece, and the promotional or offer pillar no more than 20%. Channels: at least three bullets, each with a frequency (such as \"twice a week\" or \"daily\"). Weekly plan: four weeks, each with a theme and key pieces, and at least one week about July holiday lessons. KPIs: at least three rows with numeric targets, including one for enquiries or bookings.",
          brief: PLAN_BRIEF,
          doc: PLAN_DOC,
          tests: [
            { label: "Objective with 100 bookings and content's role", check: String.raw`const o = section('Objective') || ''; return /100/.test(o) && /booking/i.test(o) && /content/i.test(o);`, fail: "Restate the objective (100 bookings) and how content contributes." },
            { label: "Three to five pillars adding up to 100%", check: String.raw`const r = rows(section('Content pillars')).filter((c) => words(c[0]) >= 1); const total = r.reduce((n, c) => n + (num(c[1]) || 0), 0); return r.length >= 3 && r.length <= 5 && Math.abs(total - 100) < 0.5 && r.every((c) => words(c[2]) >= 4);`, fail: "List three to five pillars whose shares add up to 100%, each with an example of four words or more." },
            { label: "Promotion is the smallest share (20% or less)", check: String.raw`const r = rows(section('Content pillars')).filter((c) => /(offer|promo|sale|discount|holiday lessons)/i.test(c[0])); return r.length >= 1 && r.every((c) => num(c[1]) <= 20);`, fail: "Include an offer or promotional pillar, and keep it to 20% or less." },
            { label: "At least three channels, each with a frequency", check: String.raw`const b = bullets(section('Channels')); return b.length >= 3 && b.every((x) => /(daily|every day|weekly|a week|per week|twice|once|times|fortnight|monthly)/i.test(x));`, fail: "Give each channel a role and how often it is used." },
            { label: "Four weekly themes, one about July holiday lessons", check: String.raw`const r = rows(section('Weekly plan')).filter((c) => /week\s?[1-4]/i.test(c[0]) && words(c[1]) >= 2 && words(c[2]) >= 4); return r.length >= 4 && r.some((c) => /(holiday|july)/i.test(c.join(' ')));`, fail: "Plan Weeks 1 to 4, each with a theme and key pieces, and use the July holiday-lessons opportunity." },
            { label: "Three KPIs with numeric targets, one for enquiries or bookings", check: String.raw`const r = rows(section('KPIs')).filter((c) => words(c[0]) >= 2 && !isNaN(num(c[1]))); return r.length >= 3 && r.some((c) => /(enquir|booking)/i.test(c[0]));`, fail: "Give three or more KPIs with a number each, including enquiries or bookings." },
          ],
          solution: PLAN_DONE,
          hint: "Start from April's evidence: what worked gets more space, and what built trust keeps a role.",
          successMessage: "A 30-day strategy a client can approve: one objective, a clear audience, balanced pillars, a plan tied to the calendar, and numbers to judge it by.",
        },
      },
    ],

    task: {
      title: "Module 8 practical: a strategy for a real brand",
      intro: "Write a strategy you could present to a real business owner.",
      prompts: [
        "Choose a real small business or organisation and interview the owner about their goals, customers and current content.",
        "Audit their last month of content: list each piece, its pillar and its results where you can see them.",
        "Write a SMART objective, one or two evidence-based personas and three to five pillars.",
        "Write a 30-day plan with weekly themes, channels and frequency, and five KPIs with targets.",
        "Present it in ten minutes, ask for feedback, and revise it. Keep the final version for your portfolio.",
      ],
      closing: "Part Three starts in Module 9: copywriting, where every word is measured by whether the reader acts.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
