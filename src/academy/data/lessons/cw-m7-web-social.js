/**
 * CONTENT WRITING · MODULE 7 · WEBSITE AND SOCIAL MEDIA CONTENT WRITING
 *
 * Curriculum 7.1 – 7.17 and the practical 7.P. Homepages, About pages,
 * service and product pages, landing pages, FAQs, microcopy and calls to
 * action; then social media audiences, platforms, captions, educational and
 * promotional posts, storytelling, calendars, hooks, hashtags, engagement
 * and repurposing; then a website package and a seven-day calendar.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s7-web-social";

/* ── Lesson 24 lab: a homepage ─────────────────────────────────────────── */
const HOME_BRIEF = `**CleanSweep Lagos** cleans homes and offices in Lekki, Ikoyi and Victoria Island.

- Vetted, trained and insured cleaners; the same cleaner every visit if you want.
- Book online in 2 minutes; choose a one-off clean or weekly, fortnightly or monthly.
- Prices start at ₦25,000 for a two-bedroom flat. Free re-clean within 24 hours if anything is missed.
- 1,200 homes cleaned in 2025. Average customer rating 4.8 out of 5 from 430 reviews.
- Customer quote: "I come home on Friday to a clean flat and a free weekend." Tobi A., Lekki.`;

const HOME_DOC = `# CleanSweep Lagos: homepage

## Hero headline
[10 words or fewer: the main benefit.]

## Subheadline
[One or two sentences: what you do, for whom, where.]

## Primary call to action
[The button text: 2 to 5 words, starting with a verb.]

## Benefits
[Three "- " bullets, each a benefit to the customer with a supporting fact.]

## Social proof
[Numbers, ratings or a customer quote from the brief.]

## Closing call to action
[One or two sentences that remove a last worry, then the action.]
`;

const HOME_DONE = `# CleanSweep Lagos: homepage

## Hero headline
Come home to a clean house, every week

## Subheadline
Trusted, trained cleaners for homes and offices in Lekki, Ikoyi and Victoria Island. Book in two minutes.

## Primary call to action
Book your first clean

## Benefits
- Peace of mind: every cleaner is vetted, trained and insured, and you can keep the same cleaner every visit
- Your time back: book online in 2 minutes, one-off or weekly, fortnightly or monthly
- No risk: if we miss anything, we come back and re-clean it free within 24 hours

## Social proof
1,200 Lagos homes cleaned in 2025, rated 4.8 out of 5 from 430 reviews. "I come home on Friday to a clean flat and a free weekend." Tobi A., Lekki

## Closing call to action
Prices start at ₦25,000 for a two-bedroom flat, and every clean is covered by our free re-clean promise. Book your first clean today.
`;

/* ── Lesson 25 lab: microcopy and FAQs ─────────────────────────────────── */
const MICRO_BRIEF = `You are writing the interface text for **CleanSweep's booking page**. The developer's draft text is:

- Button on the booking form: "Submit"
- Error when the phone number is too short: "Invalid input. Error code 422."
- Message when a user has no bookings yet: "No data."
- Error when the chosen date is fully booked: "Request failed."

Customers often ask: How do I pay? Can I cancel? Do I need to provide cleaning products? Are the cleaners insured?
Facts: pay by card or transfer after booking; free cancellation up to 24 hours before; cleaners bring all products and equipment; all cleaners are insured.`;

const MICRO_DOC = `# CleanSweep booking page text

## Microcopy
- Booking button:
- Phone number error:
- No bookings yet:
- Date fully booked:

## FAQ
[Four questions as "### " headings, each followed by a short answer.]
`;

const MICRO_DONE = `# CleanSweep booking page text

## Microcopy
- Booking button: Book my clean
- Phone number error: Enter an 11-digit phone number, such as 08031234567.
- No bookings yet: You have no cleans booked yet. Choose a date to book your first one.
- Date fully booked: That day is fully booked. Choose another date, or join the waiting list.

## FAQ
### How do I pay?
You pay by card or bank transfer after you book. We send a receipt by email.

### Can I cancel a booking?
Yes. Cancellation is free up to 24 hours before your clean.

### Do I need to provide cleaning products?
No. Your cleaner brings all the products and equipment.

### Are the cleaners insured?
Yes. Every CleanSweep cleaner is vetted, trained and insured.
`;

/* ── Lesson 26 lab: one idea, four platforms ───────────────────────────── */
const SOCIAL_BRIEF = `CleanSweep wants to share one tip across platforms: **"Clean from top to bottom: dust shelves and fans before you sweep or mop, so dust does not fall on a clean floor."** It also wants people to know about its weekly cleaning plan (from ₦25,000).`;

const SOCIAL_DOC = `# One tip, four platforms

## Instagram caption
[Hook in the first line, the tip, a call to action, and 3 to 5 hashtags at the end.]

## LinkedIn post
[For office managers: at least 60 words, short paragraphs, a professional angle.]

## X post
[280 characters or fewer.]

## Facebook post
[Conversational, ends with a question to start comments.]
`;

const SOCIAL_DONE = `# One tip, four platforms

## Instagram caption
Stop mopping first. Here's why your floor never stays clean.

Dust falls. So clean from top to bottom: shelves, fan blades and frames first, then sweep, then mop. Your floor stays clean the first time.

Save this for your next cleaning day, or let us do it for you. Book a weekly clean from ₦25,000 via the link in our bio.

#CleaningTips #LagosHomes #CleanHome #HomeHacks

## LinkedIn post
Most office cleaning schedules waste time in one simple way: they clean in the wrong order.

When cleaners mop before they dust, the dust from shelves, fans and window frames lands on a floor that was just cleaned. The floor then needs doing twice, or it stays dusty.

The fix costs nothing: clean from top to bottom. High surfaces first, desks next, floors last.

If you manage an office in Lekki, Ikoyi or Victoria Island, our team follows this order on every visit. Message us for a weekly office plan.

## X post
Cleaning tip: dust shelves and fans BEFORE you sweep or mop. Otherwise the dust lands on your clean floor and you do it twice. Top to bottom, every time.

## Facebook post
Quick question for everyone who cleans on Saturdays: do you sweep first or dust first?

Here's our tip after cleaning 1,200 Lagos homes: always dust first. Shelves, fans and frames, then sweep, then mop. The dust falls on a floor you have not cleaned yet, so you only clean it once.

What's the one cleaning job you hate the most? Tell us below!
`;

/* ── Lesson 27 labs: replying to comments, then the practical ──────────── */
const REPLY_BRIEF = `Three comments arrived on CleanSweep's Instagram post today:

1. **@kemi_lekki:** "Your cleaner didn't come on Tuesday and nobody called me. Very poor service."
2. **@dapo.vi:** "Do you clean after parties? How much for a 3-bedroom?"
3. **@ngozi_cooks:** "Best cleaners in Lagos! My flat has never looked this good 😍"

Facts: a post-party clean for a 3-bedroom costs from ₦45,000. The support line is 0700 253 2679.`;

const REPLY_DOC = `# Replies

## Reply 1
[Apologise, take responsibility, move the conversation to private messages.]

## Reply 2
[Answer the question with the facts, then invite the next step.]

## Reply 3
[Thank them warmly and personally.]
`;

const REPLY_DONE = `# Replies

## Reply 1
Kemi, we're very sorry. A missed visit with no call is not acceptable, and it's on us. Please send us a DM with your booking number, or call 0700 253 2679, so we can fix this today and refund Tuesday's clean.

## Reply 2
Yes, we do, Dapo! A post-party clean for a 3-bedroom starts from ₦45,000. Send us a DM with your date and we'll confirm the price and a cleaner.

## Reply 3
Thank you so much, Ngozi! We'll pass this on to your cleaner. It made the team's day.
`;

const PACK_BRIEF = `**Your fictional business: "Mama Put Express"**, a lunch delivery service in Yaba, Lagos.

- Home-style Nigerian lunches (jollof, efo riro with semo, beans and plantain, ofada) delivered to offices and campuses in Yaba from 11:30am to 2:30pm.
- Order on WhatsApp or the website by 11am for delivery the same day.
- Meals from ₦3,500. Free delivery on orders of 3 meals or more.
- Cooked fresh every morning by Mama Bisi, who ran a buka in Yaba for 15 years.
- Over 800 meals delivered in the first two months.`;

const PACK_DOC = `# Mama Put Express: website and social package

## Homepage hero
- Headline:
- Subheadline:
- Button:

## About
[80 to 160 words: the story, who you serve and why it matters.]

## Services
[Three "- " bullets: what customers can order and how.]

## FAQ
[Three "### " questions with short answers.]

## Seven-day social calendar
| Day | Platform | Post type | Hook | Call to action |
|-----|----------|-----------|------|----------------|
|  |  |  |  |  |
`;

const PACK_DONE = `# Mama Put Express: website and social package

## Homepage hero
- Headline: Home-style lunch, delivered hot to your desk
- Subheadline: Fresh Nigerian lunches cooked every morning by Mama Bisi and delivered to offices and campuses in Yaba.
- Button: Order today's lunch

## About
For 15 years, Mama Bisi fed Yaba from her buka near the market. Office workers and students queued for her efo riro, her jollof and her ofada stew. Then her customers got busier and their lunch breaks got shorter, and many stopped coming. So in 2026 we started Mama Put Express to take her cooking to them. Every meal is cooked fresh that morning in our Yaba kitchen and delivered between 11:30am and 2:30pm. In our first two months we delivered more than 800 meals. Our promise is simple: real home-style food, at a fair price, without leaving your desk.

## Services
- Daily lunch delivery to offices and campuses in Yaba, from 11:30am to 2:30pm
- Order by 11am on WhatsApp or our website for delivery the same day
- Group orders: free delivery when you order 3 meals or more

## FAQ
### What time should I order?
Order by 11am for delivery the same day between 11:30am and 2:30pm.

### How much does a meal cost?
Meals start from ₦3,500. Delivery is free on orders of 3 meals or more.

### Where do you deliver?
We deliver to offices and campuses in Yaba.

## Seven-day social calendar
| Day | Platform | Post type | Hook | Call to action |
|-----|----------|-----------|------|----------------|
| Monday | Instagram | Promotional | Monday deserves a proper lunch | Order on WhatsApp by 11am |
| Tuesday | WhatsApp Status | Menu | Today's pot: efo riro and semo | Reply to order |
| Wednesday | Instagram | Story | 15 years at the buka, now at your desk | Read Mama Bisi's story on our website |
| Thursday | LinkedIn | Educational | Why your team's 3pm slump starts at lunch | Book a group lunch for your office |
| Friday | Instagram | Entertaining | Things every Yaba office worker says at 12:59pm | Tag a colleague who needs lunch |
| Saturday | Facebook | Social proof | 800 meals in two months, thank you Yaba | Share your favourite Mama Put meal |
| Sunday | X | Promotional | Next week's menu is out | See the menu and plan your week |
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 7.1 – 7.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l24-website",
    moduleId: "cw-m7-web-social",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3", "7.4"],
    title: "Writing a Website",
    subtitle: "Homepages, About pages, service and product pages, and landing pages",
    estimatedMinutes: 40,
    intro:
      "A website is often the first place a customer meets a business, and the words decide in seconds whether they stay. This lesson covers the four kinds of page every business needs written.",

    atoms: [
      {
        id: "a-cw-homepage",
        title: "Homepage content",
        explain:
          "A homepage must answer three questions within about five seconds: what is this, is it for me, and what do I do next? Visitors scan before they read, so structure it in blocks. The hero section at the top holds a headline that states the main benefit (\"Come home to a clean house, every week\"), a subheadline that says what you do, for whom and where, and one primary call to action. Below it: three or four benefits, each backed by a fact; social proof (numbers, ratings, logos, testimonials); a short explanation of how it works; and a closing call to action that removes a last worry (price, guarantee). Write benefits, not slogans: visitors care about their outcome, not your adjectives. Keep paragraphs to one or two lines, and make every heading useful on its own.",
        samples: [
          { label: "Says nothing", tone: "bad", text: "Welcome to CleanSweep. We are a leading provider of world-class cleaning solutions committed to excellence." },
          { label: "Answers the three questions", tone: "good", text: "Come home to a clean house, every week. Trusted cleaners for homes and offices in Lekki, Ikoyi and VI. [Book your first clean]" },
        ],
        writingLab: {
          task:
            "Write CleanSweep's homepage from the brief. Hero headline: 10 words or fewer, a benefit to the customer (not the company name). Subheadline: one or two sentences saying what, for whom and where. Primary call to action: 2 to 5 words, starting with a verb, not \"Submit\" or \"Click here\". Benefits: three bullets, each with a fact from the brief. Social proof: at least one number and the customer quote. Closing call to action: mention the price or the re-clean promise, and end with an action.",
          brief: HOME_BRIEF,
          doc: HOME_DOC,
          tests: [
            { label: "Hero headline: 10 words or fewer, a benefit", check: String.raw`const h = section('Hero headline') || ''; return words(h) >= 3 && words(h) <= 10 && !/cleansweep|welcome|leading|world-class/i.test(h);`, fail: "State the customer's outcome in 10 words or fewer. Not \"Welcome to CleanSweep\"." },
            { label: "Subheadline says what, for whom and where", check: String.raw`const s = section('Subheadline') || ''; return sentences(s).length <= 2 && /clean/i.test(s) && /(home|office)/i.test(s) && /(lekki|ikoyi|victoria island|vi\b)/i.test(s);`, fail: "In one or two sentences: cleaning, for homes or offices, in Lekki, Ikoyi or VI." },
            { label: "Button: 2 to 5 words starting with a verb", check: String.raw`const b = (section('Primary call to action') || '').trim(); return words(b) >= 2 && words(b) <= 5 && isAction(b) && !/submit|click here/i.test(b);`, fail: "Write a short, specific button such as \"Book your first clean\"." },
            { label: "Three benefits, each with a supporting fact", check: String.raw`const b = bullets(section('Benefits')); return b.length >= 3 && b.filter((x) => /(vetted|trained|insured|2 minutes|two minutes|24 hours|re-clean|same cleaner|weekly)/i.test(x)).length >= 3;`, fail: "Back each benefit with a fact: vetting and insurance, two-minute booking, the free re-clean…" },
            { label: "Social proof: a number and the customer quote", check: String.raw`const p = section('Social proof') || ''; return /(1,200|4\.8|430)/.test(p) && /free weekend/i.test(p);`, fail: "Use the 2025 numbers or rating, and Tobi's quote." },
            { label: "Closing: removes a worry and ends with an action", check: String.raw`const c = section('Closing call to action') || ''; return /(₦\s?25,?000|re-clean|free)/i.test(c) && isAction(lastSentence(c));`, fail: "Mention the starting price or the free re-clean, then end with the action." },
          ],
          solution: HOME_DONE,
          hint: "Ask the visitor's three questions (what is this, is it for me, what next?) and make sure the hero answers all three.",
          successMessage: "A homepage that answers a visitor's questions in five seconds, with every claim backed by a fact.",
        },
      },
      {
        id: "a-cw-about",
        title: "About Us pages",
        explain:
          "The About page is often the second most visited page, because people want to know who they are dealing with before they pay. It is not a list of company history. Tell the story: why the business started (the problem the founder saw), who it serves, what it believes and does differently, and the people behind it. Back it with proof: years, customers served, qualifications, awards, photos of real staff. Keep the customer in the story: \"We started because busy professionals had no time to clean\" connects better than \"Founded in 2019, the company has grown\". End with a link to the next step. Avoid empty phrases such as \"customer-centric\", \"world-class\" and \"one-stop shop\".",
      },
      {
        id: "a-cw-service-pages",
        title: "Services and product pages",
        explain:
          "A service or product page helps a visitor who is already interested decide to buy. Give each service its own page, so it can answer specific questions and rank for its own searches. Structure: a headline naming the service and its main outcome; who it is for; what is included (a clear list); how it works (three or four steps); price or how pricing works; proof (reviews, results, case studies); answers to the objections people raise (guarantees, timelines, what happens if something goes wrong); and a call to action. Be specific: \"deep clean of kitchen, including inside the oven and fridge\" is more persuasive than \"comprehensive kitchen cleaning\". Use the customer's words for the service, not internal jargon.",
      },
      {
        id: "a-cw-landing-content",
        title: "Landing page content",
        explain:
          "A landing page is a standalone page built for one campaign and one action: a visitor arrives from an advert, email or social post and is asked to do one thing, such as book, sign up or download. Unlike a homepage, it removes distractions: usually no main menu and one call to action repeated down the page. The headline must match the promise of the advert that brought the visitor (message match); if the advert said \"20% off your first clean\", the page headline must say it too. Then: the offer, the benefits, proof, answers to objections, and the call to action. Every section either increases desire or removes a doubt. You will write persuasive landing pages in depth in Module 11.",
        decision: {
          scenario: "An Instagram ad says \"Your first office clean 20% off this month\". People who click arrive on CleanSweep's general homepage.",
          question: "What is the problem?",
          options: [
            { id: "a", text: "No message match: visitors cannot see the offer they clicked for, so many leave. They need a landing page about that offer", why: "Right. A landing page continues the exact promise of the ad and asks for one action." },
            { id: "b", text: "Nothing: the homepage has all the information", whyWrong: "Visitors expected the offer and now have to search for it. Most will not." },
            { id: "c", text: "The ad should not mention a discount", whyWrong: "The offer is fine; the page it leads to is the problem." },
            { id: "d", text: "The homepage needs more menu items", whyWrong: "More choices make it even less likely they find the offer." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 7.5 – 7.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l25-microcopy",
    moduleId: "cw-m7-web-social",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.5", "7.6", "7.7"],
    title: "FAQs, Microcopy and Calls to Action",
    subtitle: "The small words that decide whether people complete what they started",
    estimatedMinutes: 35,
    intro:
      "Some of the most valuable writing on a website is only a few words long: the answer to a worry, the label on a button, the message when something goes wrong.",

    atoms: [
      {
        id: "a-cw-faqs",
        title: "Frequently Asked Questions (FAQs)",
        explain:
          "An FAQ section answers the questions that stop people buying or that fill the support inbox. Collect them from real sources: customer service, sales staff, emails, chats and reviews. Write each question in the customer's words (\"Can I cancel?\", not \"Cancellation policy\"), and start each answer with the direct answer (\"Yes.\" or \"No.\" or the number), then the detail. Keep answers short, two or three sentences, and link to a fuller page if needed. Group long FAQs by topic (Booking, Payment, Service). FAQs also help search, because their questions match real searches and can appear directly in results. Do not use an FAQ to hide important terms: if something matters to every customer, such as the cancellation charge, put it on the main page too.",
      },
      {
        id: "a-cw-microcopy",
        title: "Website microcopy and user interface text",
        explain:
          "Microcopy is the small text in an interface: button labels, form labels and hints, error messages, empty states, confirmations, tooltips and notifications. Writing it is called UX writing. Rules: be clear before clever; use the words users use; keep labels short and consistent (if it is \"Book\" on one page, do not call it \"Reserve\" on the next). Error messages should say what happened and how to fix it, in plain words, without blaming the user (\"Enter an 11-digit phone number, such as 08031234567\", not \"Invalid input. Error 422\"). Empty states (a screen with nothing in it yet) should explain what will appear there and how to start. Confirmations should say exactly what happened and what comes next (\"Your clean is booked for Friday at 10am. We've sent the details to your email.\").",
        samples: [
          { label: "Developer text", tone: "bad", text: "Request failed. Error code 409." },
          { label: "Microcopy", tone: "good", text: "That day is fully booked. Choose another date, or join the waiting list." },
        ],
        decision: {
          scenario: "Which button text is strongest at the end of CleanSweep's quote form?",
          question: "Choose the best CTA.",
          options: [
            { id: "a", text: "Get my free quote", why: "Right. It starts with a verb, names the value (a quote, free) and reads as the user's own decision." },
            { id: "b", text: "Submit", whyWrong: "It says what the computer does, not what the customer gets." },
            { id: "c", text: "Click here to proceed with your request for pricing information", whyWrong: "Far too long for a button, and vague." },
            { id: "d", text: "OK", whyWrong: "Says nothing about what happens next." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-ctas",
        title: "Writing clear calls to action",
        explain:
          "A call to action (CTA) tells the reader exactly what to do next. On a website it is usually a button or a link. A strong CTA starts with a verb, names the specific action or the value (\"Book my clean\", \"Get my free quote\", \"Download the price list\"), is short (two to five words for buttons), and appears where the reader is ready to act: after the benefits, after the proof, at the end. Generic CTAs such as \"Submit\", \"Click here\" and \"Learn more\" say nothing about what happens. First-person button text (\"Start my free trial\") often works well because it reads as the user's own decision. Use one primary CTA per page or screen; several competing CTAs split attention and reduce action.",
        writingLab: {
          task:
            "Rewrite the developer's text for CleanSweep's booking page. Booking button: 2 to 5 words, starting with a verb. Phone error: say what to do (mention 11 digits) with an example, without \"invalid\" or \"error\". No bookings yet: explain and invite the first booking. Date fully booked: say what happened and offer another option. Then write the FAQ: four \"### \" questions in the customer's words, each ending with \"?\", each answered in 30 words or fewer that start with the direct answer, using the facts given.",
          brief: MICRO_BRIEF,
          doc: MICRO_DOC,
          tests: [
            { label: "Booking button: 2 to 5 words starting with a verb", check: String.raw`const b = field(section('Microcopy'), 'Booking button') || ''; return words(b) >= 2 && words(b) <= 5 && isAction(b) && !/submit/i.test(b);`, fail: "Replace \"Submit\" with what the customer gets, such as \"Book my clean\"." },
            { label: "Phone error says how to fix it, with an example", check: String.raw`const e = field(section('Microcopy'), 'Phone number error') || ''; return /11/.test(e) && /\d{6,}/.test(e.replace(/\s/g, '')) && !/invalid|error/i.test(e);`, fail: "Tell the user what a correct number looks like (11 digits) and show one." },
            { label: "Empty state explains and invites the first booking", check: String.raw`const e = field(section('Microcopy'), 'No bookings yet') || ''; return words(e) >= 6 && /book/i.test(e) && !/no data/i.test(e);`, fail: "Say there are no bookings yet and how to make the first one." },
            { label: "Fully booked message gives another option", check: String.raw`const e = field(section('Microcopy'), 'Date fully booked') || ''; return /(another|different|other) (date|day)|waiting list/i.test(e) && !/request failed/i.test(e);`, fail: "Explain the day is full and offer another date or a waiting list." },
            { label: "Four FAQ questions ending with \"?\"", check: String.raw`return headings(3).filter((h) => /\?$/.test(h)).length >= 4;`, fail: "Write four \"### \" questions, each ending with a question mark." },
            { label: "Short answers that start with the direct answer, using the facts", check: String.raw`const s = sections('').filter((x) => /\?$/.test(x.heading)); const ok = s.filter((x) => words(x.text) >= 4 && words(x.text) <= 30); const f = section('FAQ') || ''; return ok.length >= 4 && /24 hours/.test(f) && /insured/i.test(f) && /(card|transfer)/i.test(f);`, fail: "Answer each in 30 words or fewer, starting with Yes, No or the fact, and use the facts: 24 hours, insured, card or transfer." },
          ],
          solution: MICRO_DONE,
          hint: "For every message ask: what does the customer need to know, and what can they do now?",
          successMessage: "A booking page that guides people through problems instead of blaming them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 7.8 – 7.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l26-social",
    moduleId: "cw-m7-web-social",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.8", "7.9", "7.10", "7.11", "7.12"],
    title: "Writing for Social Media",
    subtitle: "Audiences, platforms, captions, educational and promotional posts, and stories",
    estimatedMinutes: 40,
    intro:
      "Social media is where many writers get their first paid work. Each platform has its own audience, rhythm and rules, and good social writing respects all three.",

    atoms: [
      {
        id: "a-cw-social-audiences",
        title: "Understanding social media audiences",
        explain:
          "People on social media are not looking for your brand; they are scrolling, often on a phone, between other things. You have about a second to earn attention, and you must give value before you ask for anything. Understand three things about your audience on each platform: who they are there (the same person is a professional on LinkedIn and relaxed on Instagram), what they come for (news, entertainment, ideas, community, deals), and what makes them engage (comment, share, save). Study your audience's own posts and comments: their words, jokes and complaints are your best research. Use platform analytics (Instagram Insights, LinkedIn analytics, Meta Business Suite) to see what they actually respond to, not what you assume.",
      },
      {
        id: "a-cw-platforms",
        title: "Writing for Facebook, Instagram, LinkedIn and X",
        explain:
          "Facebook: a broad, often older audience, strong for communities and groups; conversational posts, questions, local news and longer stories work well. Instagram: visual first, younger audience; the caption supports the image or carousel, its first line (about 125 characters shows before \"more\") must hook, and links do not work in captions, so CTAs point to the link in bio or to DMs. LinkedIn: professionals; insights, lessons, career and industry stories, written in short paragraphs with line breaks; the first two lines show before \"see more\", so the hook goes there; a professional tone that is still human. X: real-time conversation and news; a post has a 280-character limit on standard accounts, so be sharp and specific; threads carry longer ideas. WhatsApp channels and Status, and TikTok scripts, follow the same rule: write for the platform's culture, not one text pasted everywhere.",
        table: {
          caption: "The four main platforms at a glance.",
          headers: ["Platform", "Audience mood", "What works", "Watch out for"],
          rows: [
            ["Facebook", "Community, local, family", "Questions, stories, groups, events", "Long blocks of text without breaks"],
            ["Instagram", "Visual, relaxed", "Hook in line 1, carousels, short captions", "Links in captions do not work"],
            ["LinkedIn", "Professional, learning", "Insights, lessons, line breaks, first two lines", "Corporate jargon, hard selling"],
            ["X", "Fast, news, debate", "Sharp, specific, threads", "280-character limit on standard accounts"],
          ],
        },
      },
      {
        id: "a-cw-captions",
        title: "Creating engaging captions",
        explain:
          "A caption has three jobs: stop the scroll, deliver the value, and prompt an action. Put the hook in the first line, because that is often all that shows. Deliver one idea, in short lines with space between them. Write the way your audience talks, in the brand's voice. End with one clear CTA: save this, share it with someone, comment your answer, tap the link in bio, send us a DM. Use emojis only if they fit the brand and the platform, and never to replace words. Read captions on a phone before posting: what looks short on a laptop is a wall of text on a small screen.",
      },
      {
        id: "a-cw-edu-promo",
        title: "Writing educational and promotional posts",
        explain:
          "Educational posts teach something useful: a tip, a how-to, a myth corrected, a checklist. They build trust and get saved and shared, which widens reach. Promotional posts sell: an offer, a product, a launch, a deadline. Audiences accept promotion from accounts that mostly give them value, so many brands follow a rough 80/20 rule: most posts give (educate, entertain, inform), a minority ask (promote). The best promotional posts still lead with value or a benefit, not with \"Buy now\". A useful bridge is the educational post that ends with a soft promotion: \"Here is how to clean top to bottom. Or let us do it: weekly plans from ₦25,000.\"",
      },
      {
        id: "a-cw-social-stories",
        title: "Storytelling for social media",
        explain:
          "Stories hold attention on social media because readers want to know what happens next. Use the structure from Module 3, compressed: a character, a problem, a turning point, a result, often in five to eight short lines. Customer stories (with permission), behind-the-scenes stories (how the food is cooked at 5am), founder stories and before-and-after stories all work. Start in the middle of the action (\"At 5am, Mama Bisi is already pounding pepper.\"), use concrete details, and let the lesson or product appear naturally at the turning point. On LinkedIn, the personal lesson story is a format of its own; on Instagram, a carousel can tell a story slide by slide.",
        writingLab: {
          task:
            "Adapt CleanSweep's cleaning tip for four platforms. Instagram: a hook in the first line (under 125 characters), the tip, a CTA, and 3 to 5 hashtags at the end. LinkedIn: at least 60 words for office managers, in at least three short paragraphs, with a professional angle. X: 280 characters or fewer. Facebook: conversational, ending with a question to start comments. Every version must keep the tip (dust or high surfaces before sweeping or mopping), and the four must be genuinely different texts.",
          brief: SOCIAL_BRIEF,
          doc: SOCIAL_DOC,
          tests: [
            { label: "Instagram: hook under 125 characters, CTA, 3 to 5 hashtags at the end", check: String.raw`const s = section('Instagram caption') || ''; const ls = lines(s); const tags = (ls[ls.length - 1] || '').match(/#\w+/g) || []; return ls[0] && ls[0].length <= 125 && tags.length >= 3 && tags.length <= 5 && count(s, /#\w+/g) === tags.length && /(link in (our )?bio|dm|save this|book)/i.test(s);`, fail: "First line under 125 characters; a CTA (save, link in bio, DM, book); and 3 to 5 hashtags together on the last line." },
            { label: "LinkedIn: 60+ words in at least three short paragraphs", check: "const s = section('LinkedIn post'); return words(s) >= 60 && paragraphs(s).length >= 3 && paragraphs(s).every((p) => sentences(p).length <= 3);", fail: "Write at least 60 words in three or more short paragraphs of one to three sentences." },
            { label: "X: 280 characters or fewer", check: String.raw`const s = (section('X post') || '').trim(); return s.length >= 40 && s.length <= 280;`, fail: "Count the characters: 280 or fewer." },
            { label: "Facebook: ends with a question", check: String.raw`const s = (section('Facebook post') || '').trim(); return words(s) >= 25 && sentences(s).slice(-2).some((x) => /\?/.test(x));`, fail: "End with a question that invites comments." },
            { label: "Every version keeps the tip", check: String.raw`return ['Instagram', 'LinkedIn', 'X post', 'Facebook'].every((h) => /(dust|shel|fan|top to bottom|high surfaces)/i.test(section(h) || '') && /(sweep|mop|floor)/i.test(section(h) || ''));`, fail: "Each platform's version must still teach the tip: dust high surfaces before the floor." },
            { label: "Four genuinely different texts", check: "const t = ['Instagram', 'LinkedIn', 'X post', 'Facebook'].map((h) => section(h) || ''); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (i !== j && overlap(t[i], t[j]) > 0.4) return false; return true;", fail: "Write each version for its platform instead of pasting one text four times." },
          ],
          solution: SOCIAL_DONE,
          hint: "Picture the reader on each platform: a scroller on Instagram, an office manager on LinkedIn, someone in a hurry on X, a neighbour on Facebook.",
          successMessage: "One tip, four platforms, four native pieces of writing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 7.13 – 7.17 · PRACTICAL 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l27-calendar",
    moduleId: "cw-m7-web-social",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.13", "7.14", "7.15", "7.16", "7.17", "7.P"],
    title: "Calendars, Hooks, Community and the Package",
    subtitle: "Planning, hooks, hashtags, engagement, repurposing, and the module practical",
    estimatedMinutes: 75,
    intro:
      "Social media rewards those who plan, hook, join the conversation and reuse their best ideas. This lesson covers all four, then you write a complete website and social package for a new business.",

    atoms: [
      {
        id: "a-cw-social-calendar",
        title: "Content calendars and planning",
        explain:
          "A social content calendar plans posts by day and platform, usually a week to a month ahead. For each post it records the date and time, platform, content pillar or type (educational, promotional, story, entertaining, social proof), the hook, the caption or a link to it, the visual needed, the CTA, hashtags and status. Plan a balanced mix across the week, tie posts to the audience's rhythm (Monday motivation, Friday fun, payday, holidays), and batch-write a week at a time so posting never depends on inspiration. Scheduling tools such as Meta Business Suite, Buffer and Hootsuite publish posts automatically at the planned time. Leave room for timely posts that react to news.",
      },
      {
        id: "a-cw-hooks",
        title: "Writing hooks that attract attention",
        explain:
          "A hook is the opening line or first seconds that stop the scroll. Reliable hook patterns: a bold statement or myth-buster (\"Stop mopping first.\"), a specific number (\"800 meals in two months\"), a question the reader is asking (\"Where does your salary go by the 15th?\"), a relatable moment (\"Things every Yaba office worker says at 12:59pm\"), a curiosity gap that the post closes honestly, and a direct call-out of the audience (\"Landlords in Abuja, read this.\"). Keep it short and specific, put the most interesting word early, and make sure the post delivers what the hook promises. Write five hooks for every important post and choose the strongest.",
        samples: [
          { label: "No hook", tone: "bad", text: "Hello everyone, today we want to share some cleaning tips with you." },
          { label: "Hook", tone: "good", text: "Stop mopping first. Here's why your floor never stays clean." },
        ],
      },
      {
        id: "a-cw-hashtags",
        title: "Hashtag usage and platform conventions",
        explain:
          "Hashtags group posts by topic so people can find them. Use them with purpose: a mix of a few specific hashtags (#LagosHomes, #YabaFood), some broader topic tags (#CleaningTips) and a branded tag if the brand has one (#MamaPutExpress). Instagram allows up to 30 but most professionals use 3 to 5 relevant ones, placed at the end of the caption or in the first comment. LinkedIn: 3 to 5 at the end. X: one or two, or none. Facebook: few or none. Write multi-word hashtags in capitalised words (#CleaningTips, not #cleaningtips) so screen readers read them correctly. Other conventions: tag people and brands only when relevant, credit others' content, respect each platform's rules on contests and paid partnerships (mark sponsored posts clearly), and keep links where the platform allows them.",
      },
      {
        id: "a-cw-engagement",
        title: "Community engagement and audience interaction",
        explain:
          "Social media is a conversation, so the writing continues after the post goes live. Reply to comments and messages quickly, in the brand voice, and personally (use the person's name). Thank praise specifically. Answer questions with the actual answer and the next step. Handle complaints in public with an apology, responsibility and a move to private messages to sort out details; never argue, delete fair criticism or copy-paste the same reply to everyone. Ask questions in posts that people genuinely want to answer, respond to the replies, and share customers' content (with permission). A good rule for complaints is: acknowledge, apologise, act, and follow up.",
        writingLab: {
          task:
            "Reply to CleanSweep's three comments. Reply 1 (the complaint): use Kemi's name, apologise, take responsibility, and move to private contact (DM or the support line); 20 to 60 words, no excuses. Reply 2 (the question): use Dapo's name, answer yes with the price from the facts, and invite the next step. Reply 3 (the praise): use Ngozi's name and thank her; 30 words or fewer.",
          brief: REPLY_BRIEF,
          doc: REPLY_DOC,
          tests: [
            { label: "Reply 1: name, apology, responsibility, private contact", check: String.raw`const r = section('Reply 1') || ''; return /kemi/i.test(r) && /sorry|apologi/i.test(r) && /(on us|our fault|we let you down|not acceptable|our mistake)/i.test(r) && /(dm|direct message|message us|call|0700)/i.test(r) && words(r) >= 20 && words(r) <= 60;`, fail: "Use her name, say sorry, own the mistake (\"it's on us\"), and move to a DM or the support line, in 20 to 60 words." },
            { label: "Reply 1 makes no excuses", check: String.raw`return !/(traffic|but our cleaner|unfortunately the cleaner|it was not our fault|you should have)/i.test(section('Reply 1') || '');`, fail: "Excuses in public make an angry customer angrier. Apologise and act." },
            { label: "Reply 2: name, the price and a next step", check: String.raw`const r = section('Reply 2') || ''; return /dapo/i.test(r) && /₦\s?45,?000/.test(r) && /(dm|message|book|call|send)/i.test(r);`, fail: "Answer with the ₦45,000 starting price and tell Dapo how to book." },
            { label: "Reply 3: name and thanks, 30 words or fewer", check: String.raw`const r = section('Reply 3') || ''; return /ngozi/i.test(r) && /thank/i.test(r) && words(r) <= 30;`, fail: "Thank Ngozi by name, briefly and warmly." },
          ],
          solution: REPLY_DONE,
          hint: "For the complaint: acknowledge, apologise, act. The details belong in a private message.",
          successMessage: "Three replies in the brand voice: an angry customer calmed, a sale moved forward and a fan thanked.",
        },
      },
      {
        id: "a-cw-repurposing",
        title: "Repurposing content across platforms",
        explain:
          "Repurposing turns one strong piece of content into many. A 1,000-word blog article can become a LinkedIn post (the key lesson), an Instagram carousel (the steps, one per slide), an X thread (the main points), a short video script (the most surprising tip), a newsletter section (summary and link), and a WhatsApp Status series. Repurposing is not copying: each version is rewritten for its platform's format, length and audience, as you did with the cleaning tip. Start from your best-performing content, because it has already proved its value, and keep a simple table of each core piece and its versions.",
      },
      {
        id: "a-cw-m7-practical",
        title: "Practical: website package and seven-day calendar",
        explain:
          "Write the core website and social content for Mama Put Express. Website: a homepage hero, an About story, services and an FAQ. Social: a seven-day calendar with a mix of post types across platforms, each with a hook and a CTA. Use every fact in the brief accurately, write in one consistent voice (warm, local, proud of the food), and keep everything readable on a phone.",
        writingLab: {
          task:
            "Homepage hero: a headline of 10 words or fewer, a subheadline, and a button of 2 to 5 words starting with a verb. About: 80 to 160 words telling Mama Bisi's story, including her 15 years and the 800 meals. Services: three bullets that include the 11am order deadline and the free-delivery rule. FAQ: three \"### \" questions ending with \"?\". Calendar: seven rows, Monday to Sunday, using at least three platforms and at least four post types, each with a hook (at least 4 words) and a CTA that starts with a verb.",
          brief: PACK_BRIEF,
          doc: PACK_DOC,
          tests: [
            { label: "Hero: headline (10 words or fewer), subheadline, verb-first button", check: String.raw`const h = section('Homepage hero'); const hd = field(h, 'Headline') || '', sub = field(h, 'Subheadline') || '', b = field(h, 'Button') || ''; return words(hd) >= 3 && words(hd) <= 10 && words(sub) >= 8 && words(b) >= 2 && words(b) <= 5 && isAction(b);`, fail: "Fill Headline (10 words or fewer), Subheadline and Button (2 to 5 words, starting with a verb)." },
            { label: "About: 80 to 160 words with the story and the numbers", check: String.raw`const a = section('About') || ''; return words(a) >= 80 && words(a) <= 160 && /15 years/i.test(a) && /800/.test(a) && /bisi/i.test(a);`, fail: "Tell Mama Bisi's story in 80 to 160 words, including her 15 years and the 800 meals." },
            { label: "Services: three bullets with the deadline and free delivery", check: String.raw`const s = section('Services') || ''; return bullets(s).length >= 3 && /11\s?am/i.test(s) && /free delivery/i.test(s) && /3 meals|three meals/i.test(s);`, fail: "Include the 11am order time and free delivery on 3 meals or more." },
            { label: "FAQ: three questions with answers", check: String.raw`return sections('').filter((x) => /\?$/.test(x.heading) && words(x.text) >= 5).length >= 3;`, fail: "Write three \"### \" questions ending with \"?\", each with an answer." },
            { label: "Calendar: seven days, Monday to Sunday", check: String.raw`const d = rows(section('Seven-day social calendar')).map((c) => (c[0] || '').toLowerCase()); return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].every((x) => d.some((y) => y.startsWith(x)));`, fail: "One row for each day, Monday to Sunday." },
            { label: "Calendar: 3+ platforms, 4+ post types, hooks and verb-first CTAs", check: String.raw`const r = rows(section('Seven-day social calendar')).filter((c) => words(c[0]) >= 1); const plat = new Set(r.map((c) => (c[1] || '').toLowerCase().trim()).filter(Boolean)); const types = new Set(r.map((c) => (c[2] || '').toLowerCase().trim()).filter(Boolean)); return r.length >= 7 && plat.size >= 3 && types.size >= 4 && r.every((c) => words(c[3]) >= 4 && isAction(c[4] || ''));`, fail: "Mix platforms and post types; give every row a hook of 4+ words and a CTA starting with a verb." },
          ],
          solution: PACK_DONE,
          hint: "Write the About story first: it gives you the voice, and the hooks for the calendar come straight out of it.",
          successMessage: "A business's whole first week online, in one voice. This is exactly what small businesses hire content writers to produce.",
        },
      },
    ],

    task: {
      title: "Module 7 practical: a package for a real business",
      intro: "Offer to do this for a real small business you know, for free or a small fee, as your first client project.",
      prompts: [
        "Interview the owner for 30 minutes: their story, customers, services, prices, common questions and what makes them different.",
        "Write the homepage, About page, one service page and an FAQ of at least six questions.",
        "Write the microcopy for one form on their site or their WhatsApp Business greeting and away messages.",
        "Plan and write a seven-day social calendar across two or three platforms, with every caption written in full.",
        "Ask the owner for written feedback and permission to use the work in your portfolio.",
      ],
      closing: "Module 8 zooms out from single pieces to strategy: planning content that serves business goals over months.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
