/**
 * CONTENT WRITING · MODULE 12 · EMAIL MARKETING AND DIRECT RESPONSE
 *
 * Curriculum 12.1 – 12.14 and the practical 12.P. Email marketing and
 * funnels, subject lines, welcome, promotional and sales emails,
 * newsletters, abandoned cart, follow-up and retention emails,
 * personalisation, sequences, direct response, campaign metrics and
 * avoiding spam; then a five-email launch campaign.
 *
 * Campaign figures in briefs are invented for practice.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s12-email";

/* ── Lesson 43 lab: subject lines and a welcome email ──────────────────── */
const WELCOME_BRIEF = `**Kora** (the savings app from Module 3) sends this email the moment someone signs up for its newsletter on the website, before they have downloaded the app.

- Voice: the smart friend who is good with money; friendly, clear, never preachy.
- The newsletter arrives every Friday with one money tip.
- The single next step: download the app and set up a first savings goal (it takes 2 minutes).
- New users who set a goal in their first week get ₦500 added to their first goal.`;

const WELCOME_DOC = `# Kora welcome email

## Subject line options
[Five options, one per "- " line, each 50 characters or fewer.]

## Chosen subject line

## Preview text
[40 to 90 characters that add to the subject line.]

## Email
[Greeting, thank-you, what to expect, the one next step, a sign-off.]
`;

const WELCOME_DONE = `# Kora welcome email

## Subject line options
- Welcome to Kora! Here's your first money tip
- You're in. Here's ₦500 to start saving
- Your first savings goal takes 2 minutes
- Hi from Kora: what to expect every Friday
- Small wins start today

## Chosen subject line
You're in. Here's ₦500 to start saving

## Preview text
Set your first goal this week and we'll add ₦500 to it.

## Email
Hi {{first_name|there}},

Welcome to Kora, and thanks for joining us. Every Friday you'll get one short money tip from us: practical, quick to read, and never preachy.

Here's your first one: savings grow fastest when they happen automatically. So let's set that up.

Download the Kora app and create your first savings goal. It takes about 2 minutes, and if you set it up this week, we'll add ₦500 to it.

Download Kora and set your first goal

Small wins add up. See you on Friday,
Tolu from Kora
`;

/* ── Lesson 44 lab: an abandoned cart email ────────────────────────────── */
const CART_BRIEF = `A shopper added the **Voltra PowerUp 20K** (from Module 11) to their cart at voltra.ng yesterday but did not check out.

- Launch price ₦27,000 until 15 December (usually ₦32,000).
- Free delivery in Lagos, Abuja and Port Harcourt; pay on delivery available.
- 18-month warranty; replacement within 7 days if faulty.
- The most common reasons shoppers abandon carts at voltra.ng: unsure about delivery costs, and worried about paying online.`;

const CART_DOC = `# Abandoned cart email

## Subject line

## Preview text

## Email
`;

const CART_DONE = `# Abandoned cart email

## Subject line
Still thinking about your PowerUp 20K?

## Preview text
Delivery is free, and you can pay when it arrives.

## Email
Hi {{first_name|there}},

You left the Voltra PowerUp 20K in your cart. It's still there, and so is the launch price of ₦27,000 (usually ₦32,000) until 15 December.

In case you were unsure about anything:

- Delivery is free in Lagos, Abuja and Port Harcourt
- You can pay on delivery, so there's no need to pay online
- It comes with an 18-month warranty, and we replace it within 7 days if it's faulty

Return to your cart and complete your order

Questions? Just reply to this email.
The Voltra team
`;

/* ── Lesson 45 lab: a personalised retention email ─────────────────────── */
const RETAIN_BRIEF = `**Kora** wants to re-engage users who have not opened the app for 30 days. The email platform can insert these fields: {{first_name}}, {{goal_name}}, {{goal_saved}} (amount saved so far) and {{goal_target}}. The fallback syntax is {{field|fallback}}, for example {{first_name|there}}.

Facts: Kora's new "Round-up" feature saves the change from every card payment automatically. Users who switch on Round-up save an average of ₦4,000 more a month (internal data, practice figure).`;

const RETAIN_DOC = `# Kora: we miss you

## Subject line

## Email
`;

const RETAIN_DONE = `# Kora: we miss you

## Subject line
{{first_name|Hi}}, your {{goal_name|savings}} goal is waiting

## Email
Hi {{first_name|there}},

You've saved {{goal_saved|money}} towards {{goal_name|your goal}} so far. That's real progress, and it's still there waiting for you.

We know life gets busy, so we built something that saves for you while you get on with it. Round-up rounds up every card payment and saves the change automatically. Kora users who switch it on save an average of ₦4,000 more a month.

Switch on Round-up in 30 seconds

Your target is {{goal_target|within reach}}. Let's get you there.

Tolu from Kora
`;

/* ── Lesson 46 labs: metrics, then the five-email campaign ─────────────── */
const METRICS_BRIEF = `Results of Kora's Friday newsletter last week (figures invented for practice):

- Delivered: 20,000
- Unique opens: 7,000
- Unique clicks: 1,400
- Unsubscribes: 40
- App sign-ups from the email: 280

Definitions used in this course:
- **Open rate** = unique opens ÷ delivered × 100
- **Click-through rate (CTR)** = unique clicks ÷ delivered × 100
- **Click-to-open rate (CTOR)** = unique clicks ÷ unique opens × 100
- **Unsubscribe rate** = unsubscribes ÷ delivered × 100
- **Conversion rate** = conversions ÷ unique clicks × 100`;

const METRICS_DOC = `# Newsletter report

## Open rate (%)

## Click-through rate (%)

## Click-to-open rate (%)

## Unsubscribe rate (%)

## Conversion rate (%)

## What to test next
[At least 30 words.]
`;

const METRICS_DONE = `# Newsletter report

## Open rate (%)
35%

## Click-through rate (%)
7%

## Click-to-open rate (%)
20%

## Unsubscribe rate (%)
0.2%

## Conversion rate (%)
20%

## What to test next
The open rate is healthy, and one in five openers clicked, so the content works. I would test two subject lines against each other next week to raise opens, and test a single, clearer button to raise clicks.
`;

const LAUNCH_BRIEF = `**ChopBox** (from Module 9) is launching in **Abuja** on **Monday 3 March**. You are writing a five-email launch campaign to 6,000 people in Abuja who joined the waitlist.

- Ingredient boxes (washed, cut and measured) with chef recipes for Nigerian dishes; dinner in about 30 minutes.
- Launch offer: 25% off the first box with code **ABUJA25**, valid until Monday 10 March at midnight.
- From ₦18,000 a week for 3 dishes for a family of four; skip or cancel any week.
- Lagos customers rate ChopBox 4.8 out of 5 from 900 reviews.
- Review: "My children ask for my efo riro now. They never did before." Amaka O., Lagos.
- Delivery days in Abuja: Sunday and Wednesday.

Send dates: 27 Feb (teaser), 3 March (launch), 5 March (how it works), 7 March (proof and objections), 10 March (last chance).`;

const LAUNCH_DOC = `# ChopBox Abuja launch emails

## Email 1: Teaser
Subject:
Preview:

## Email 2: Launch

## Email 3: How it works

## Email 4: Proof and objections

## Email 5: Last chance
`;

const LAUNCH_DONE = `# ChopBox Abuja launch emails

## Email 1: Teaser
Subject: Abuja, dinner is about to get easier
Preview: ChopBox arrives on Monday 3 March. You're first in line.

Hi {{first_name|there}},

You joined the ChopBox waitlist, so you're hearing it first: we launch in Abuja on Monday 3 March.

Every week, we'll deliver everything you need for home-cooked Nigerian dinners, washed, cut and measured, with a chef's recipe. Dinner in about 30 minutes, without the market.

On launch day you'll get a special waitlist offer. Watch your inbox on Monday.

Mark Monday 3 March in your calendar

See you soon,
The ChopBox team

## Email 2: Launch
Subject: We're live in Abuja: 25% off your first box
Preview: Use code ABUJA25 before Monday 10 March.

Hi {{first_name|there}},

ChopBox is now delivering in Abuja.

Choose 3, 4 or 5 dishes a week, from egusi to jollof, and we'll deliver every ingredient washed, cut and measured on Sunday or Wednesday. Plans start from ₦18,000 a week for a family of four, and you can skip or cancel any week.

As a thank-you for waiting, take 25% off your first box with code ABUJA25 until Monday 10 March.

Choose your first box

Happy cooking,
The ChopBox team

## Email 3: How it works
Subject: Dinner in 30 minutes: here's how
Preview: Three steps from your door to the table.

Hi {{first_name|there}},

Wondering how ChopBox actually works? It takes three steps.

1. Choose your dishes on our website by Friday.
2. We deliver on Sunday or Wednesday in a cool box, with everything washed, cut and measured.
3. Follow the photo recipe card, and dinner is ready in about 30 minutes.

No market trip, no wasted vegetables, and food that tastes like home.

Your 25% launch discount with code ABUJA25 is still waiting, until Monday 10 March.

See this week's menu

The ChopBox team

## Email 4: Proof and objections
Subject: "My children ask for my efo riro now"
Preview: What Lagos families say, and answers to your questions.

Hi {{first_name|there}},

In Lagos, families rate ChopBox 4.8 out of 5 from 900 reviews. One of them, Amaka, told us: "My children ask for my efo riro now. They never did before."

You might still be wondering:

- Is it expensive? Plans start from ₦18,000 a week for a family of four, and you waste nothing.
- What if I travel? Skip or cancel any week, with no fee.
- I'm not a good cook. Every recipe card has photos and simple steps.

Your 25% discount with ABUJA25 ends on Monday 10 March.

Order your first box

The ChopBox team

## Email 5: Last chance
Subject: Your 25% off ends tonight
Preview: Code ABUJA25 expires at midnight. Here's your reminder.

Hi {{first_name|there}},

A quick reminder: your 25% launch discount ends tonight, Monday 10 March, at midnight.

Use code ABUJA25 to try your first ChopBox for less, and see how easy home-cooked dinners can be.

Claim your 25% off before midnight

After tonight, ChopBox stays in Abuja, but the launch discount does not. We hope to cook with you soon.

The ChopBox team
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 12.1 – 12.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l43-email",
    moduleId: "cw-m12-email",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3", "12.4"],
    title: "Email Marketing, Funnels and Subject Lines",
    subtitle: "Why email still sells, how funnels work, subject lines and welcome emails",
    estimatedMinutes: 40,
    intro:
      "Email is the one marketing channel a business owns outright. People gave permission to hear from you, and the copy decides whether they keep reading or unsubscribe.",

    atoms: [
      {
        id: "a-cw-email-marketing",
        title: "Introduction to email marketing",
        explain:
          "Email marketing is sending messages to people who have agreed to receive them, to build relationships and drive sales. It is consistently one of the highest-returning marketing channels because the list is owned (no algorithm decides who sees it), the audience has asked to hear from you, and messages can be personalised and measured. Permission is the foundation: people must opt in, the sender must be clearly identified, and every marketing email must include an easy way to unsubscribe. In Nigeria, the Nigeria Data Protection Act 2023 requires a lawful basis such as consent for processing personal data, and other countries have similar laws. Email platforms (Mailchimp, Brevo, Klaviyo, ConvertKit/Kit) manage lists, design, sending, personalisation and reports. The copywriter writes subject lines, preview text, body copy and calls to action, often for whole automated sequences.",
      },
      {
        id: "a-cw-email-funnels",
        title: "Understanding email marketing funnels",
        explain:
          "An email funnel moves subscribers from first contact to purchase and beyond. Entry: someone joins the list, usually through a sign-up form or a lead magnet (a free guide, checklist or discount). Welcome: an immediate email, often followed by a short series, introduces the brand and asks for one small action. Nurture: helpful content builds trust (newsletters, tips, stories). Conversion: promotional and sales emails present offers. Retention: post-purchase emails, onboarding, reminders and win-back emails keep customers. Many emails are automated triggers (sent when a subscriber does something: signs up, abandons a cart, buys, goes quiet); others are broadcasts (sent to the whole list or a segment at once, such as a newsletter). Know where each email sits in the funnel before you write it.",
        table: {
          caption: "Emails at each stage of the funnel.",
          headers: ["Stage", "Typical emails", "Main goal"],
          rows: [
            ["Entry", "Lead magnet delivery", "Deliver what was promised"],
            ["Welcome", "Welcome email or series", "First small action, set expectations"],
            ["Nurture", "Newsletters, tips, stories", "Build trust"],
            ["Conversion", "Promotions, launches, abandoned cart", "Sales"],
            ["Retention", "Onboarding, follow-ups, win-back", "Repeat purchases and loyalty"],
          ],
        },
      },
      {
        id: "a-cw-subject-lines",
        title: "Writing compelling subject lines",
        explain:
          "The subject line decides whether an email is opened, and the preview text (the short line shown after it in most inboxes) works with it. Keep subject lines short, roughly 50 characters or fewer, because phones cut long ones; put the most important words first. Proven approaches: a clear benefit (\"Your first savings goal takes 2 minutes\"), curiosity that the email pays off honestly, a question, personalisation, urgency when real (\"Your 25% off ends tonight\"), and news (\"We're live in Abuja\"). Preview text of about 40 to 90 characters should add new information, not repeat the subject or say \"View this email in your browser\". Avoid all capitals, several exclamation marks and misleading tricks such as a fake \"Re:\", which damage trust and deliverability. Write several and test.",
        decision: {
          scenario: "Choose the best subject line for an email announcing a savings app's new automatic round-up feature.",
          question: "Which subject line is strongest?",
          options: [
            { id: "a", text: "Save without thinking about it", why: "Right. Short, benefit-led, and the email can deliver on it." },
            { id: "b", text: "RE: Your account", whyWrong: "A fake reply is misleading and damages trust." },
            { id: "c", text: "!!!AMAZING NEW FEATURE INSIDE!!!", whyWrong: "Capitals and exclamation marks look like spam and say nothing specific." },
            { id: "d", text: "Kora Product Update Newsletter Volume 12 Issue 4 Announcement", whyWrong: "Long, dull and cut off on phones." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-welcome-emails",
        title: "Writing welcome emails",
        explain:
          "The welcome email is usually the most opened email a brand ever sends, because it arrives the moment someone signs up and is expecting it. Send it immediately. Its jobs: thank them and confirm they are in; deliver anything promised (the discount code, the guide); set expectations (what they will receive and how often); show the brand's voice; and ask for one next step, the most valuable small action (download the app, set a goal, complete a profile, browse best-sellers). Keep it short, warm and personal, signed by a real person where possible, with one clear CTA. A welcome series of two to four emails over the first week can then tell the brand story, share the best content and make a first offer.",
        writingLab: {
          task:
            "Write Kora's welcome email. Write five subject lines, each 50 characters or fewer, and copy your choice under \"Chosen subject line\". Preview text: 40 to 90 characters that do not repeat the subject. Email: a greeting with a personalisation field and fallback (such as {{first_name|there}}), thanks, what to expect (Friday, one tip), exactly one next step (download and set a first goal, mentioning the 2 minutes and the ₦500), a CTA line starting with a verb, and a sign-off with a person's name. 80 to 160 words, in Kora's voice (no \"valued customer\").",
          brief: WELCOME_BRIEF,
          doc: WELCOME_DOC,
          tests: [
            { label: "Five subject lines of 50 characters or fewer", check: "const s = bullets(section('Subject line options')).filter((b) => words(b) >= 3); return s.length >= 5 && s.every((b) => b.length <= 50);", fail: "Write five subject lines, each 50 characters or fewer." },
            { label: "Chosen subject line is one of the five", check: String.raw`const c = (section('Chosen subject line') || '').trim().toLowerCase(); return c && bullets(section('Subject line options')).some((b) => b.trim().toLowerCase() === c);`, fail: "Copy one of your five exactly." },
            { label: "Preview text: 40 to 90 characters, adds something new", check: String.raw`const p = (section('Preview text') || '').trim(); const c = section('Chosen subject line') || ''; return p.length >= 40 && p.length <= 90 && overlap(p, c) < 0.5 && !/view (this email )?in (your )?browser/i.test(p);`, fail: "Write 40 to 90 characters that add to the subject line rather than repeating it." },
            { label: "Personalised greeting with a fallback", check: String.raw`return /\{\{\s*first_name\s*\|[^}]+\}\}/.test(section('Email') || '');`, fail: "Greet with a merge field and a fallback, such as Hi {{first_name|there}},." },
            { label: "Sets expectations and asks for the one next step", check: String.raw`const e = section('Email') || ''; return /friday/i.test(e) && /download/i.test(e) && /goal/i.test(e) && /2 minutes|two minutes/i.test(e) && /₦\s?500/.test(e);`, fail: "Say what arrives on Fridays, and ask them to download Kora and set a goal (2 minutes, ₦500)." },
            { label: "A verb-first CTA line, a named sign-off, 80 to 160 words, in voice", check: String.raw`const e = section('Email') || ''; const l = lines(e); return l.some((x) => isAction(x) && words(x) <= 8) && /from kora|the kora team|^[A-Z][a-z]+ from/m.test(e) && words(e) >= 80 && words(e) <= 160 && !/valued customer|please be informed/i.test(e);`, fail: "Add a short CTA line starting with a verb, sign off with a name, keep to 80 to 160 words, and stay in Kora's voice." },
          ],
          solution: WELCOME_DONE,
          hint: "One email, one job: get them to set a first goal this week.",
          successMessage: "A welcome email that thanks, sets expectations and gets one valuable action. It is the most-read email you will ever write for a brand.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 12.5 – 12.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l44-campaign-emails",
    moduleId: "cw-m12-email",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.5", "12.6", "12.7", "12.8"],
    title: "Promotions, Newsletters, Carts and Follow-ups",
    subtitle: "The four email types businesses send most",
    estimatedMinutes: 40,
    intro:
      "Most of a business's email falls into four types. Each has a different reader mindset and a different shape.",

    atoms: [
      {
        id: "a-cw-promo-emails",
        title: "Promotional and sales emails",
        explain:
          "Promotional emails present an offer: a sale, a launch, a new product, an event. Use the frameworks from Module 10: the subject line states the offer or the benefit; the opening names why it matters to this reader; the body gives two or three benefits and proof; the offer is stated clearly with its deadline and any code; and there is one main CTA, as a button, repeated once for long emails. Keep promotional emails short and scannable (often 75 to 200 words); readers decide quickly. Segment where possible (send the kids' clothing sale to parents), and do not send so many promotions that every email is a sales pitch: the 80/20 balance from Module 7 applies to email too.",
      },
      {
        id: "a-cw-newsletters",
        title: "Newsletter writing",
        explain:
          "A newsletter is a regular email (weekly, fortnightly, monthly) that keeps subscribers informed and engaged. Readers stay subscribed when every issue is worth opening, so lead with value: a useful tip, an insight, a story, curated links, news that affects them. Give it a consistent structure and name, a recognisable voice (many of the best are written by one named person), a predictable schedule, and one main idea or a few short sections with clear headings. Keep promotion to a small part. Write the subject line from the most interesting item, not \"Newsletter #12\". Measure which sections get clicks and do more of those.",
      },
      {
        id: "a-cw-abandoned-cart",
        title: "Abandoned cart emails",
        explain:
          "An abandoned cart email is triggered when a shopper adds items to their cart but does not buy. It often has the highest conversion rate of any marketing email because the reader has already shown intent. Send the first one within a few hours, with a subject line that reminds without pressure (\"Still thinking about your PowerUp 20K?\"); show exactly what they left (image, name, price); answer the most common reasons people abandon (delivery cost, payment worries, uncertainty about the product) with facts such as free delivery, pay on delivery, warranty and returns; and give one CTA back to the cart. A second reminder a day later can add social proof; a third might add an incentive, but do not train customers to abandon carts for discounts. Never shame the reader or invent urgency.",
        samples: [
          { label: "Pressure", tone: "bad", text: "YOU FORGOT SOMETHING!!! Complete your order NOW before it's too late!!!" },
          { label: "Helpful reminder", tone: "good", text: "Still thinking about your PowerUp 20K? Delivery is free, you can pay when it arrives, and the launch price lasts until 15 December." },
        ],
      },
      {
        id: "a-cw-follow-ups",
        title: "Follow-up emails",
        explain:
          "Follow-up emails continue a conversation after an action or a non-action: after a purchase (thank you, delivery details, how to get the best from the product), after a sign-up for a webinar or event (reminder, then recording), after a free trial ends, after a quote is sent, or after a review is requested. Good follow-ups are timely (sent when the reader expects them), useful (they help the reader succeed with what they bought), and polite in their ask. A post-purchase follow-up that teaches the customer to use the product well reduces refunds and increases reviews. Space follow-ups sensibly, and stop when the reader has acted.",
        writingLab: {
          task:
            "Write Voltra's abandoned cart email. Subject line: 50 characters or fewer, a reminder without pressure (no capitals words, no \"!\"). Preview text: 40 to 90 characters. Email: a personalised greeting with a fallback; remind them what they left and the launch price with its deadline; answer both common worries (delivery cost and paying online) with the facts as bullets; mention the warranty; one CTA line back to the cart starting with a verb; 70 to 150 words; no invented urgency.",
          brief: CART_BRIEF,
          doc: CART_DOC,
          tests: [
            { label: "Subject: 50 characters or fewer, no shouting", check: String.raw`const s = (section('Subject line') || '').trim(); return s.length >= 10 && s.length <= 50 && !/!/.test(s) && !/\b[A-Z]{4,}\b/.test(s.replace(/PowerUp|20K/g, ''));`, fail: "Remind calmly: no exclamation marks and no words in capitals." },
            { label: "Preview text: 40 to 90 characters", check: String.raw`const p = (section('Preview text') || '').trim(); return p.length >= 40 && p.length <= 90;`, fail: "Write 40 to 90 characters of preview text." },
            { label: "Personalised greeting, the product, price and deadline", check: String.raw`const e = section('Email') || ''; return /\{\{\s*first_name\s*\|[^}]+\}\}/.test(e) && /powerup/i.test(e) && /₦\s?27,?000/.test(e) && /15 december/i.test(e);`, fail: "Greet with {{first_name|there}}, name the PowerUp 20K, and give ₦27,000 until 15 December." },
            { label: "Both worries answered as bullets, plus the warranty", check: String.raw`const b = bullets(section('Email')).join(' '); return /free delivery|delivery is free/i.test(b) && /pay on delivery|pay when/i.test(b) && /warranty/i.test(section('Email') || '');`, fail: "Answer delivery cost and online payment with the facts as bullets, and mention the warranty." },
            { label: "One CTA line, 70 to 150 words, no invented urgency", check: String.raw`const e = section('Email') || ''; return lines(e).filter((x) => isAction(x) && /cart|order|checkout/i.test(x) && words(x) <= 9).length >= 1 && words(e) >= 70 && words(e) <= 150 && !/(only \d+ left|selling out|last chance|hurry)/i.test(e);`, fail: "Add one short CTA back to the cart, keep to 70 to 150 words, and remove any invented urgency." },
          ],
          solution: CART_DONE,
          hint: "The brief tells you why people leave. Answer exactly those two worries.",
          successMessage: "A cart reminder that helps rather than nags: the item, the price, the two worries answered and one way back.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 12.9 – 12.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l45-retention",
    moduleId: "cw-m12-email",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.9", "12.10", "12.11", "12.12"],
    title: "Retention, Personalisation, Sequences and Direct Response",
    subtitle: "Keeping customers, writing to one person at scale, and copy that asks for a response",
    estimatedMinutes: 40,
    intro:
      "Keeping a customer usually costs far less than finding a new one. This lesson covers the emails that keep customers, how to personalise them properly, how sequences work, and the direct-response tradition they come from.",

    atoms: [
      {
        id: "a-cw-retention-emails",
        title: "Customer retention emails",
        explain:
          "Retention emails keep existing customers engaged and buying. Types include onboarding (helping new customers succeed in their first weeks), usage tips and new features, milestone and anniversary emails (\"You've saved for six months\"), loyalty rewards, replenishment reminders (\"Time to replace your water filter\"), feedback and review requests, and win-back emails to customers who have gone quiet. Win-back emails work best when they remind the reader of the value they already got, offer something new or useful, and make returning easy, rather than simply begging (\"We miss you!\") or discounting. Retention copy should feel like service, not selling: the reader is already a customer, so speak to them as one.",
      },
      {
        id: "a-cw-personalisation",
        title: "Email personalisation",
        explain:
          "Personalisation means using what you know about a subscriber to make an email relevant. At its simplest, merge tags (also called merge fields or personalisation tokens) insert data such as a first name: in many platforms, {{first_name}} or *|FNAME|*. Always set a fallback for missing data ({{first_name|there}} produces \"Hi there\" when no name is stored); \"Hi ,\" or \"Hi {{first_name}}\" in a customer's inbox is an embarrassing, common error. Deeper personalisation is more valuable than a name: segmenting by location, interests or purchase history, and using behaviour (what they browsed, saved or bought) to choose content. Respect privacy: use data people would expect you to use, and never in ways that feel intrusive.",
        decision: {
          scenario: "A newsletter goes out with the greeting \"Hi {{first_name}},\" and 30% of subscribers have no first name stored.",
          question: "What should have been written?",
          options: [
            { id: "a", text: "\"Hi {{first_name|there}},\" so subscribers without a name see \"Hi there,\"", why: "Right. A fallback prevents a broken greeting for missing data." },
            { id: "b", text: "Nothing: an empty name is fine", whyWrong: "Readers would see \"Hi ,\", which looks careless." },
            { id: "c", text: "Remove all personalisation forever", whyWrong: "Personalisation helps when done properly; just add a fallback." },
            { id: "d", text: "\"Hi Valued Customer,\"", whyWrong: "Stiff and impersonal as a default for everyone." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-sequences",
        title: "Writing persuasive email sequences",
        explain:
          "A sequence is a series of emails sent automatically, in order, with set gaps, to move a subscriber towards one goal. Common sequences: welcome (3 to 5 emails over a week), onboarding, launch (Module 12's practical), webinar or event, and sales sequences for a product. Plan the sequence before writing: the goal, the number of emails, the timing, and each email's single job (introduce, educate, prove, answer objections, ask). Each email should stand alone (some readers miss earlier ones) while building on the last. Vary the angle (story, how it works, proof, FAQ, deadline) rather than repeating the same pitch, and stop the sequence for people who have already bought.",
        table: {
          caption: "A five-email launch sequence.",
          headers: ["Email", "Job", "Typical angle"],
          rows: [
            ["1. Teaser", "Build anticipation", "Something is coming, and you're first"],
            ["2. Launch", "Announce and offer", "It's here, with the launch offer"],
            ["3. How it works", "Educate", "Three simple steps"],
            ["4. Proof and objections", "Remove doubts", "Reviews, then answers to worries"],
            ["5. Last chance", "Prompt action", "The offer ends tonight"],
          ],
        },
      },
      {
        id: "a-cw-direct-response",
        title: "Introduction to direct-response marketing",
        explain:
          "Direct-response marketing asks the reader to respond immediately and measurably: call this number, reply to this email, use this code, click this link. Its opposite is brand advertising, which builds familiarity over time without asking for an immediate action. Direct response has a long tradition in mail-order advertising and sales letters, and email is its modern home. Its principles: a specific offer, a clear single call to action, a reason to act now, an easy way to respond, and tracking so every response can be measured (codes such as ABUJA25, unique links, dedicated phone numbers). Because results are measured, direct-response writers test constantly and let the numbers, not opinions, decide which copy wins.",
        writingLab: {
          task:
            "Write Kora's win-back email. Subject line: 50 characters or fewer, using at least one merge field with a fallback. Email: a greeting with {{first_name|…}}; remind the reader of their progress with {{goal_saved|…}} and {{goal_name|…}} (every merge field must have a fallback); introduce Round-up and its benefit with the practice figure (₦4,000); one CTA line starting with a verb; 70 to 150 words. Do not beg (\"We miss you\" is not the message) and do not offer a discount.",
          brief: RETAIN_BRIEF,
          doc: RETAIN_DOC,
          tests: [
            { label: "Subject: 50 characters or fewer with a merge field", check: String.raw`const s = (section('Subject line') || '').trim(); return /\{\{[^}]+\|[^}]+\}\}/.test(s) && s.replace(/\{\{[^}|]+\|([^}]+)\}\}/g, '$1').length <= 50;`, fail: "Use a merge field with a fallback, and keep the subject to 50 characters (counting the fallback text)." },
            { label: "Every merge field has a fallback", check: String.raw`const m = doc.match(/\{\{[^}]*\}\}/g) || []; return m.length >= 3 && m.every((x) => /\{\{\s*\w+\s*\|[^}]+\}\}/.test(x));`, fail: "Write every field as {{field|fallback}}, and use at least three fields." },
            { label: "Reminds them of their own progress", check: String.raw`const e = section('Email') || ''; return /\{\{\s*goal_saved/.test(e) && /\{\{\s*goal_name/.test(e) && /\{\{\s*first_name/.test(e);`, fail: "Use {{first_name|…}}, {{goal_saved|…}} and {{goal_name|…}} to show them what they have already achieved." },
            { label: "Introduces Round-up with the ₦4,000 figure", check: String.raw`const e = section('Email') || ''; return /round-?up/i.test(e) && /₦\s?4,?000/.test(e);`, fail: "Explain Round-up and its benefit: about ₦4,000 more a month." },
            { label: "One CTA, 70 to 150 words, no begging or discount", check: String.raw`const e = section('Email') || ''; return lines(e).some((x) => isAction(x) && words(x) <= 8) && words(e) >= 70 && words(e) <= 150 && !/we miss you|please come back|% off|discount/i.test(e);`, fail: "One short CTA line, 70 to 150 words, and no \"we miss you\" or discounts." },
          ],
          solution: RETAIN_DONE,
          hint: "Lead with their progress, not your feelings: show them what they have already built.",
          successMessage: "A win-back email that serves the customer: their progress, a useful new feature and an easy way back.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 12.13 – 12.14 · PRACTICAL 12.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l46-launch-emails",
    moduleId: "cw-m12-email",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.13", "12.14", "12.P"],
    title: "Metrics, Spam and a Five-Email Launch",
    subtitle: "Measuring campaigns, staying out of the spam folder, and the module practical",
    estimatedMinutes: 75,
    intro:
      "An email that lands in spam earns nothing, and an email nobody measures teaches nothing. This lesson covers both, then you write a complete five-email launch campaign.",

    atoms: [
      {
        id: "a-cw-email-metrics",
        title: "Measuring email campaign performance",
        explain:
          "Email platforms report several metrics. Delivered: emails that reached an inbox server (sent minus bounces). Open rate: unique opens ÷ delivered × 100. Opens are less reliable than they used to be, because some email apps (notably Apple Mail Privacy Protection) load images automatically and inflate opens, so treat open rate as a rough signal. Click-through rate (CTR): unique clicks ÷ delivered × 100. Click-to-open rate (CTOR): unique clicks ÷ unique opens × 100, which shows how persuasive the content was for those who opened. Conversion rate: conversions ÷ clicks × 100 (or ÷ delivered, so always state the formula). Unsubscribe rate and spam complaint rate show whether you are sending too often or the wrong content. Subject lines affect opens; body copy and CTAs affect clicks; the offer and landing page affect conversions. Test one thing at a time.",
        writingLab: {
          task:
            "Calculate the newsletter's five rates from the brief using the course's formulas (to one decimal place where needed), then write at least 30 words on what to test next and why, based on the numbers.",
          brief: METRICS_BRIEF,
          doc: METRICS_DOC,
          tests: [
            { label: "Open rate", check: "return Math.abs(num(section('Open rate')) - 35) < 0.05;", fail: "7,000 ÷ 20,000 × 100." },
            { label: "Click-through rate", check: "return Math.abs(num(section('Click-through rate')) - 7) < 0.05;", fail: "1,400 ÷ 20,000 × 100." },
            { label: "Click-to-open rate", check: "return Math.abs(num(section('Click-to-open rate')) - 20) < 0.05;", fail: "1,400 ÷ 7,000 × 100." },
            { label: "Unsubscribe rate", check: "return Math.abs(num(section('Unsubscribe rate')) - 0.2) < 0.005;", fail: "40 ÷ 20,000 × 100." },
            { label: "Conversion rate", check: "return Math.abs(num(section('Conversion rate')) - 20) < 0.05;", fail: "280 sign-ups ÷ 1,400 clicks × 100." },
            { label: "A test recommendation of 30+ words", check: String.raw`const t = section('What to test next') || ''; return words(t) >= 30 && /test/i.test(t);`, fail: "Say what you would test next (subject line, CTA, content) and why, in 30 words or more." },
          ],
          solution: METRICS_DONE,
          hint: "Check each denominator: delivered, delivered, opens, delivered, clicks.",
          successMessage: "Five rates calculated correctly and turned into a test plan. Numbers, not opinions, decide what to change.",
        },
      },
      {
        id: "a-cw-spam",
        title: "Avoiding spam-like language and practices",
        explain:
          "Spam filters and readers both judge emails. Practices that harm deliverability and trust: sending to people who did not opt in, or to bought lists; no clear unsubscribe link or a sender name people do not recognise; misleading subject lines (fake \"Re:\" or \"Fwd:\"); subject lines in capitals or with several exclamation marks; heavy use of spammy phrases (\"100% free\", \"act now\", \"you're a winner\", \"risk-free!!!\", \"guaranteed income\"); one large image with almost no text; too many links; and sudden large sends from a new account. Good practice: send only to people who opted in, identify the sender clearly, include an easy unsubscribe link and the business's address (often required by law), keep a balance of text and images, write honest subject lines, clean inactive subscribers from the list, and send at a consistent rhythm. Most of this is good writing anyway: clear, honest and relevant.",
        samples: [
          { label: "Looks like spam", tone: "bad", text: "Subject: !!!100% FREE GIFT - ACT NOW - YOU'RE A WINNER!!!" },
          { label: "Looks like a brand you trust", tone: "good", text: "Subject: Your 25% off ends tonight" },
        ],
      },
      {
        id: "a-cw-m12-practical",
        title: "Practical: a five-email launch campaign",
        explain:
          "Write ChopBox's five-email Abuja launch campaign: teaser, launch, how it works, proof and objections, and last chance. Each email needs a subject line, preview text, a personalised greeting with a fallback, a body that does its one job, one CTA and a sign-off. Keep the offer (25% off with ABUJA25 until Monday 10 March) consistent, vary the angle, and keep every email clear of spam patterns.",
        writingLab: {
          task:
            "Under each \"## Email N\" heading write a \"Subject:\" line (50 characters or fewer, no word in capitals, at most one \"!\"), a \"Preview:\" line (40 to 90 characters), a greeting with {{first_name|…}}, the body, one CTA line starting with a verb, and a sign-off. Each email 50 to 200 words. Email 1 announces the 3 March date without the code; Emails 2 to 5 all give the code ABUJA25 and the 10 March deadline; Email 4 quotes the review and answers at least two objections; Email 5's subject says it ends tonight. No spam phrases.",
          brief: LAUNCH_BRIEF,
          doc: LAUNCH_DOC,
          tests: [
            { label: "Five emails, each with subject and preview within limits", check: String.raw`const e = sections('Email '); return e.length === 5 && e.every((x) => { const s = field(x.text, 'Subject') || ''; const p = field(x.text, 'Preview') || ''; return s.length >= 10 && s.length <= 50 && p.length >= 40 && p.length <= 90; });`, fail: "Give every email a Subject: line (50 characters or fewer) and a Preview: line (40 to 90 characters)." },
            { label: "Every email: greeting with fallback, CTA line, sign-off, 50–200 words", check: String.raw`return sections('Email ').every((x) => /\{\{\s*first_name\s*\|[^}]+\}\}/.test(x.text) && lines(x.text).some((l) => isAction(l) && words(l) <= 9 && !/^(subject|preview):/i.test(l)) && /(team|from chopbox|chopbox)\s*$/im.test(x.text) && words(x.text) >= 50 && words(x.text) <= 200);`, fail: "Each email needs {{first_name|…}}, a short verb-first CTA line, a sign-off and 50 to 200 words." },
            { label: "Email 1 teases the date; Emails 2–5 carry the code and deadline", check: String.raw`const e = sections('Email '); return e.length === 5 && /3 march/i.test(e[0].text) && !/ABUJA25/.test(e[0].text) && e.slice(1).every((x) => /ABUJA25/.test(x.text) && /10 march|tonight/i.test(x.text));`, fail: "Keep the code out of the teaser; give ABUJA25 and the 10 March deadline in Emails 2 to 5." },
            { label: "Email 4 quotes the review and answers two objections", check: String.raw`const e = sections('Email ')[3] || { text: '' }; return /efo riro/i.test(e.text) && /4\.8/.test(e.text) && bullets(e.text).length >= 2;`, fail: "In Email 4, quote Amaka's review with the 4.8 rating, and answer at least two worries as bullets." },
            { label: "Email 5's subject says it ends tonight", check: String.raw`const e = sections('Email ')[4] || { text: '' }; return /tonight|midnight|last chance|ends today/i.test(field(e.text, 'Subject') || '');`, fail: "Make Email 5's subject line say that the offer ends tonight." },
            { label: "No spam patterns", check: String.raw`return !/(100% free|act now|you'?re a winner|risk-free!|guaranteed income|click here now)/i.test(doc) && sections('Email ').every((x) => { const s = field(x.text, 'Subject') || ''; return !/\b[A-Z]{4,}\b/.test(s.replace(/ABUJA25/g, '')) && (s.match(/!/g) || []).length <= 1; });`, fail: "Remove spam phrases, capitals in subject lines and repeated exclamation marks." },
          ],
          solution: LAUNCH_DONE,
          hint: "Plan the five jobs first (tease, announce, explain, prove, remind), then write each email to do only its job.",
          successMessage: "A complete launch sequence: five emails, five angles, one honest offer, and nothing a spam filter would catch. Portfolio piece.",
        },
      },
    ],

    task: {
      title: "Module 12 practical: an email programme for a real business",
      intro: "Write the emails a small business needs but has never sent.",
      prompts: [
        "Choose a real business and set up a free account on an email platform such as Brevo or Mailchimp to see how editors, merge tags and previews work.",
        "Write a three-email welcome series and an abandoned cart (or follow-up) email for the business.",
        "Write a five-email launch or promotion sequence with subject lines, preview text and CTAs.",
        "Send test emails to yourself and read them on a phone: fix anything that looks broken or long.",
        "Write a one-page plan for what you would measure and test after the first send.",
      ],
      closing: "Part Four begins in Module 13: professional writing, starting with business and corporate documents.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
