/**
 * VIRTUAL ASSISTANT · MODULE 9 · SOCIAL MEDIA AND DIGITAL MARKETING SUPPORT
 *
 * Curriculum 9.1 – 9.10 and the practical 9.P. Platforms and social media
 * management, scheduling and publishing, simple graphics, content
 * calendars, community management, comments and DMs, analytics, email
 * marketing and campaign support; then a seven-day calendar, three graphic
 * briefs and a monthly report.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s9-social";

/** Instagram posts for a bakery: engagement rate of post 3 = 9.6%. */
const POSTS = {
  A1: "Post", B1: "Reach", C1: "Engagements", D1: "Engagement rate (%)",
  A2: "Cake of the week", B2: 4200, C2: 210,
  A3: "Behind the scenes video", B3: 6500, C3: 624,
  A4: "Price list", B4: 3800, C4: 76,
  A5: "Customer photo", B5: 5100, C5: 357,
};

/* ── Lesson 60 lab: a newsletter ──────────────────────────────────────── */
const NEWS_BRIEF = `Your client, **Sweet Crumbs Bakery** (Ikeja, Lagos), sends a monthly email newsletter to **1,800 subscribers** in Mailchimp. This month's news:

- New product: **coconut chin-chin cookies**, ₦2,500 a pack, in store and online from **1 July**.
- Offer: **10% off your first order of the new cookies** with code **CRUMBS10**, valid until **15 July**.
- The bakery will be closed on **Saturday 4 July** for staff training.
- Order online at sweetcrumbs.example/order.

Write the campaign: a **subject line of 50 characters or fewer**, **preview text** (the line shown after the subject in the inbox), the email body with a clear call to action, and the footer every marketing email must have.`;

const NEWS_DOC = `# Sweet Crumbs newsletter, July

- Subject:
- Preview text:

## Email

[The email body.]

## Footer

[The footer every marketing email must have.]
`;

const NEWS_DONE = `# Sweet Crumbs newsletter, July

- Subject: New: coconut chin-chin cookies, 10% off
- Preview text: Try them from 1 July with code CRUMBS10.

## Email

Hi *|FNAME|*,

Meet our newest treat: coconut chin-chin cookies. Crunchy, golden and full of toasted coconut, they cost ₦2,500 a pack and arrive in store and online on 1 July.

To celebrate, take 10% off your first order of the new cookies with the code CRUMBS10. The offer ends on 15 July.

[Order your cookies](https://sweetcrumbs.example/order)

Please note: the bakery will be closed on Saturday 4 July for staff training.

Warm wishes,
The Sweet Crumbs team

## Footer

You are receiving this email because you subscribed at Sweet Crumbs Bakery. Sweet Crumbs Bakery, 12 Allen Avenue, Ikeja, Lagos. Unsubscribe or update your preferences.
`;

/* ── Lesson 61 lab: the practical ─────────────────────────────────────── */
const PRAC_BRIEF = `Your client is **GlowUp Fitness**, a women's gym in Abuja. Its goals for July: get **more trial-class sign-ups** and grow its **Instagram** following. It posts on **Instagram** and **Facebook**. Content pillars: **Educate** (workout and nutrition tips), **Inspire** (member success stories), **Promote** (offers and classes) and **Community** (behind the scenes, questions).

**Facts for the posts:** free trial class every Saturday at 9:00; a July offer of 20% off the first month; trainer Bimpe teaches a new Pilates class on Tuesdays at 18:00; member Hauwa lost 8 kg in 4 months.

**June results for the monthly report** (from Meta Business Suite):

| Measure | May | June |
|---|---|---|
| Instagram followers | 2,400 | 2,640 |
| Reach | 18,000 | 24,500 |
| Engagements | 1,080 | 1,715 |
| Trial sign-ups from social media | 12 | 19 |

Best post in June: the video of Hauwa's story (reach 6,200).`;

const PRAC_DOC = `# GlowUp Fitness: social media pack, July

## Content calendar

| Day | Platform | Pillar | Format | Caption | CTA |
|---|---|---|---|---|---|

## Graphic briefs

### Design 1:

### Design 2:

### Design 3:

## June report

### Results

### What worked

### Next month
`;

const PRAC_DONE = `# GlowUp Fitness: social media pack, July

## Content calendar

| Day | Platform | Pillar | Format | Caption | CTA |
|---|---|---|---|---|---|
| Monday 6 July | Instagram | Educate | Carousel | Five moves you can do at home in 15 minutes. | Save this for later |
| Tuesday 7 July | Instagram and Facebook | Promote | Reel | Meet Bimpe's new Pilates class, every Tuesday at 18:00. | Book your spot |
| Wednesday 8 July | Instagram | Inspire | Reel | Hauwa lost 8 kg in 4 months. Here is how she did it. | Share your goal in the comments |
| Thursday 9 July | Facebook | Community | Photo | Behind the scenes: our trainers' morning warm-up. | Tell us your favourite class |
| Friday 10 July | Instagram and Facebook | Promote | Static post | 20% off your first month in July. | Join today |
| Saturday 11 July | Instagram | Promote | Story | Free trial class today at 9:00. | Sign up for a free trial |
| Sunday 12 July | Instagram | Educate | Carousel | What to eat before a morning workout. | Save this post |

## Graphic briefs

### Design 1: July offer
- Size: 1080 × 1350 (Instagram portrait)
- Text: 20% off your first month, July only
- Visual: a member mid-workout, brand pink and white
- CTA: Join today

### Design 2: Free trial class
- Size: 1080 × 1920 (Story)
- Text: Free trial class, Saturdays at 9:00
- Visual: the studio with members smiling
- CTA: Sign up for a free trial

### Design 3: Pilates with Bimpe
- Size: 1080 × 1080 (square post)
- Text: New Pilates class, Tuesdays at 18:00
- Visual: Bimpe leading a class
- CTA: Book your spot

## June report

### Results

| Measure | May | June | Change |
|---|---|---|---|
| Instagram followers | 2,400 | 2,640 | +10% |
| Reach | 18,000 | 24,500 | +36% |
| Engagements | 1,080 | 1,715 | +59% |
| Trial sign-ups from social media | 12 | 19 | +58% |

### What worked

- Member stories performed best: Hauwa's video reached 6,200 people, the most of any June post.
- Engagement grew faster than reach, so the content is connecting with people, not just being seen.

### Next month

- Post one member story video each week.
- End every Promote post with a clear call to book a free trial.
- Track sign-ups per post with a link in bio.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 9.1 – 9.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l55-platforms",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "Social Media Platforms and Management",
    subtitle: "What each platform is for, and what managing a client's social media involves",
    estimatedMinutes: 40,
    intro:
      "Small businesses know they should be active on social media and rarely have time. Social media support is one of the most requested VA services.",

    atoms: [
      {
        id: "a-va-platforms",
        title: "Understanding social media platforms",
        explain:
          "Each platform has its own audience, content style and purpose. Choose platforms by where the client's customers actually are, not by trying to be everywhere.",
        table: {
          caption: "The main platforms for business.",
          headers: ["Platform", "Best for", "Content that works"],
          rows: [
            ["Instagram", "Consumer brands: fashion, food, beauty, fitness, events", "Photos, Reels (short video), Stories, carousels"],
            ["Facebook", "Local businesses, communities, older audiences, ads", "Posts, groups, events, video"],
            ["TikTok", "Reaching younger audiences fast", "Short, authentic, entertaining videos"],
            ["LinkedIn", "B2B, professional services, recruiting", "Insights, company news, articles, case studies"],
            ["X (Twitter)", "News, public conversations, customer service", "Short updates, threads, replies"],
            ["YouTube", "Tutorials, reviews, long-form video", "How-to and explainer videos"],
            ["WhatsApp Business", "Direct sales and customer chat (very strong in Nigeria)", "Catalogue, Status updates, broadcast lists"],
          ],
        },
      },
      {
        id: "a-va-smm",
        title: "Introduction to social media management",
        explain:
          "Social media management means planning, creating, publishing, engaging and reporting on a brand's social accounts. The client sets the direction: goals (followers, inquiries, sales), audience, brand voice and content pillars (three to five recurring themes such as Educate, Inspire, Promote and Community). The VA turns that into a content calendar, prepares posts, gets approval, schedules them, responds to comments and messages, and reports results. Get access properly: through Meta Business Suite roles (Facebook and Instagram), LinkedIn page admin roles or the scheduling tool's team features, never by sharing the client's personal password. Follow the brand voice and visual style every time, and get approval before posting anything sensitive, such as a price change, a response to a controversy or anything about a person.",
        decision: {
          scenario: "A new client wants you to manage her boutique's Instagram and sends you her Instagram password by WhatsApp.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Thank her and ask her to add you as a person with a role in Meta Business Suite instead, so she keeps control", why: "Right. Roles give you access without her password, and she can remove you any time." },
            { id: "b", text: "Log in with the password and start posting", whyWrong: "Shared passwords are insecure and trigger login alerts; roles are the professional way." },
            { id: "c", text: "Change the password so only you have it", whyWrong: "Never take control of a client's account." },
            { id: "d", text: "Save the password in your phone's notes", whyWrong: "Insecure, and still the wrong way to get access." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-platform-desk",
        title: "Choosing platforms for clients",
        explain:
          "For each client, choose the platform that should come first.",
        deskLab: {
          app: "social",
          title: "Which platform first?",
          task: "Choose the best first platform for each client.",
          fields: [{ key: "platform", label: "Platform", type: "select", options: ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "WhatsApp Business"] }],
          items: [
            { id: "f1", title: "A B2B accounting firm that wants company clients", expect: { platform: "LinkedIn" } },
            { id: "f2", title: "A fashion boutique with eye-catching clothes for women aged 20–35", expect: { platform: "Instagram" } },
            { id: "f3", title: "A plumber who wants customers to message him for quotes and see his price list", expect: { platform: "WhatsApp Business" } },
            { id: "f4", title: "A cooking teacher who wants to publish 15-minute recipe tutorials", expect: { platform: "YouTube" } },
            { id: "f5", title: "A new snack brand that wants to go viral with teenagers", expect: { platform: "TikTok" } },
            { id: "f6", title: "A community health clinic that wants to reach parents in its town and run local events", expect: { platform: "Facebook" } },
          ],
          solution: { f1: { platform: "LinkedIn" }, f2: { platform: "Instagram" }, f3: { platform: "WhatsApp Business" }, f4: { platform: "YouTube" }, f5: { platform: "TikTok" }, f6: { platform: "Facebook" } },
          hint: "Match the audience and the content type to the platform table.",
          successMessage: "Right platform first: the client's effort goes where their customers are.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 9.3 – 9.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l56-schedule-graphics",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4"],
    title: "Scheduling, Publishing and Simple Graphics",
    subtitle: "Meta Business Suite, Buffer and Hootsuite, and simple, effective graphics in Canva",
    estimatedMinutes: 45,
    intro:
      "Scheduling tools let one VA run several brands' social media in a few hours a week, and Canva lets anyone create clean, on-brand graphics.",

    atoms: [
      {
        id: "a-va-scheduling-tools",
        title: "Content scheduling and publishing",
        explain:
          "Scheduling tools publish posts automatically at the time you choose. Meta Business Suite (free) schedules Facebook and Instagram posts, Stories and Reels, and shows the inbox and insights. Buffer and Hootsuite schedule across many platforms (Instagram, Facebook, LinkedIn, X, TikTok, Pinterest) from one place, with approval workflows for teams. Choose posting times from the account's insights (when the followers are online), not from generic advice. Before scheduling, run a publishing checklist: spelling and facts checked, the right image size, the link works, tags and hashtags correct, alt text added for accessibility, the client has approved it, and the time is in the right time zone. After posting, check that it published and watch the first comments.",
      },
      {
        id: "a-va-canva",
        title: "Creating simple graphics with Canva",
        explain:
          "Canva is a browser design tool with templates for every social format. Start from a template in the right size, then set up the client's brand kit (logo, colours, fonts) so every design matches. Keep designs simple: one message, a clear visual hierarchy (the most important words biggest), strong contrast between text and background, at most two fonts, little text (the caption carries the detail), plenty of space and the logo placed consistently. Use the client's own photos where possible, or licensed images from Canva's library; never take random images from Google. Export as PNG for graphics with text and JPG for photos, or MP4 for video. Sizes matter, because the wrong size gets cropped.",
        table: {
          caption: "Common social image sizes (pixels).",
          headers: ["Format", "Size"],
          rows: [
            ["Instagram square post", "1080 × 1080"],
            ["Instagram portrait post (most space in the feed)", "1080 × 1350"],
            ["Instagram or Facebook Story, Reel, TikTok", "1080 × 1920"],
            ["LinkedIn or Facebook link image", "1200 × 627"],
            ["YouTube thumbnail", "1280 × 720"],
          ],
        },
      },
      {
        id: "a-va-graphics-desk",
        title: "Sizes and publishing checks",
        explain:
          "Your client sends a batch of design and publishing requests. Choose the right size or action for each.",
        deskLab: {
          app: "social",
          title: "Design and publishing requests",
          task: "Choose the right size or action for each request.",
          fields: [{ key: "answer", label: "Answer", type: "select", options: ["1080 × 1080", "1080 × 1350", "1080 × 1920", "1200 × 627", "1280 × 720", "Add alt text", "Use a licensed or client photo"] }],
          items: [
            { id: "g1", title: "An Instagram Story announcing a flash sale", expect: { answer: "1080 × 1920" } },
            { id: "g2", title: "A feed post that should take up as much space as possible on phones", expect: { answer: "1080 × 1350" } },
            { id: "g3", title: "A thumbnail for a YouTube tutorial", expect: { answer: "1280 × 720" } },
            { id: "g4", title: "The image for a LinkedIn post sharing a blog link", expect: { answer: "1200 × 627" } },
            { id: "g5", title: "A square quote graphic for the Instagram grid", expect: { answer: "1080 × 1080" } },
            { id: "g6", title: "Make a post readable for blind followers using screen readers", expect: { answer: "Add alt text" } },
            { id: "g7", title: "The client asks you to use a photo of a cake you found on Google", expect: { answer: "Use a licensed or client photo" }, why: "Images found on Google are usually copyrighted." },
          ],
          solution: { g1: { answer: "1080 × 1920" }, g2: { answer: "1080 × 1350" }, g3: { answer: "1280 × 720" }, g4: { answer: "1200 × 627" }, g5: { answer: "1080 × 1080" }, g6: { answer: "Add alt text" }, g7: { answer: "Use a licensed or client photo" } },
          hint: "Use the size table; and remember accessibility and copyright.",
          successMessage: "Right size, accessible, legal: graphics that look professional on every platform.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 9.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l57-calendars",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.5"],
    title: "Content Calendars",
    subtitle: "Planning a balanced, consistent month of content in advance",
    estimatedMinutes: 40,
    intro:
      "A content calendar is the difference between posting whenever someone remembers and a brand that shows up consistently with a plan.",

    atoms: [
      {
        id: "a-va-calendar-what",
        title: "What a content calendar is",
        explain:
          "A content calendar is a schedule of planned posts, usually in a Google Sheet, Notion, Trello or the scheduling tool itself. Each row is one post with: date and time, platform, content pillar, format (photo, carousel, Reel, Story, video), the caption, the visual (or a link to it), the call to action, hashtags, status (Idea, Draft, Approved, Scheduled, Published) and a link to the live post. Plan a week or a month ahead, around key dates: holidays (Eid, Christmas, Independence Day on 1 October), the client's launches and events, and awareness days that fit the brand. Batch the work: write all the captions in one session, design all the graphics in another, then send the whole week for approval at once.",
      },
      {
        id: "a-va-content-mix",
        title: "Balancing the content mix",
        explain:
          "A feed that only sells gets ignored. Balance the pillars: a common rule of thumb is that most posts give value (educate, inspire, entertain, build community) and a minority promote (offers, sales, new products), sometimes described as 80/20 or as rotating the pillars through the week. Avoid two hard-sell posts in a row. Vary formats too, because each platform rewards different ones (Reels and carousels on Instagram). Keep a consistent rhythm the client can sustain: three good posts a week every week beats daily posts for two weeks and then silence. Leave space for timely content (news, trends, customer questions).",
      },
      {
        id: "a-va-content-calendar-desk",
        title: "Planning a balanced week",
        explain:
          "Sweet Crumbs Bakery posts once a day on Instagram. Assign each post idea its pillar and a day, so the week is balanced.",
        deskLab: {
          app: "social",
          title: "Sweet Crumbs · Instagram · week plan",
          task: "Choose the pillar for each post idea and give each a different day, with no two Promote posts on neighbouring days.",
          fields: [
            { key: "pillar", label: "Pillar", type: "select", options: ["Educate", "Inspire", "Promote", "Community"] },
            { key: "day", label: "Day", type: "select", options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
          ],
          items: [
            { id: "c1", title: "How to store bread so it stays fresh for 5 days", check: "return val.pillar === 'Educate' && !!val.day;" },
            { id: "c2", title: "10% off all birthday cakes this weekend", check: "return val.pillar === 'Promote' && !!val.day;" },
            { id: "c3", title: "Behind the scenes: our bakers at 4am", check: "return val.pillar === 'Community' && !!val.day;" },
            { id: "c4", title: "A customer's story: the cake that made her mum cry", check: "return val.pillar === 'Inspire' && !!val.day;" },
            { id: "c5", title: "New product: coconut chin-chin cookies, ₦2,500", check: "return val.pillar === 'Promote' && !!val.day;" },
            { id: "c6", title: "Poll: chocolate or vanilla?", check: "return val.pillar === 'Community' && !!val.day;" },
            { id: "c7", title: "Three mistakes people make when baking at home", check: "return val.pillar === 'Educate' && !!val.day;" },
          ],
          rules: [
            { label: "One post per day, every day", check: "const d = rows.map((r) => r.day).filter(Boolean); return d.length === 7 && new Set(d).size === 7;", fail: "Give each post a different day, so there is one post every day of the week." },
            { label: "No two Promote posts on neighbouring days", check: "const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; const p = rows.filter((r) => r.pillar === 'Promote').map((r) => days.indexOf(r.day)).sort((a, b) => a - b); return p.every((x, i) => i === 0 || x - p[i - 1] > 1);", fail: "Two Promote posts are on neighbouring days: spread them out." },
          ],
          solution: {
            c1: { pillar: "Educate", day: "Mon" }, c2: { pillar: "Promote", day: "Fri" }, c3: { pillar: "Community", day: "Tue" }, c4: { pillar: "Inspire", day: "Thu" },
            c5: { pillar: "Promote", day: "Wed" }, c6: { pillar: "Community", day: "Sat" }, c7: { pillar: "Educate", day: "Sun" },
          },
          hint: "Place the two Promote posts first, at least one day apart, then fill the other days.",
          successMessage: "A balanced week: five value posts, two promotions, never back to back.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 9.6 – 9.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l58-community",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.6", "9.7"],
    title: "Community Management, Comments and DMs",
    subtitle: "Building a community and responding to every comment and message the right way",
    estimatedMinutes: 40,
    intro:
      "Social media is social. Followers who get a friendly, fast answer become customers; followers who are ignored go elsewhere.",

    atoms: [
      {
        id: "a-va-community",
        title: "Community management",
        explain:
          "Community management is building relationships with the people around a brand: followers, customers and fans. Respond quickly (within the client's target, often within hours), in the brand's voice, using people's names. Start conversations: ask questions, run polls, share customer photos (with permission) and thank people for tagging the brand. Keep a response guide agreed with the client: answers to frequent questions, how to handle complaints, what to escalate (legal threats, safety issues, journalists, influencer requests, anything that could become a crisis) and what to hide or delete (spam, scams, hate speech, personal attacks; never genuine criticism). Watch for patterns in comments and report them to the client.",
      },
      {
        id: "a-va-responses",
        title: "Responding to comments and direct messages",
        explain:
          "Reply publicly to public questions when the answer helps others too (prices, opening hours). Move personal matters to direct messages: orders, payments, addresses, complaints that need account details (\"We're sorry about this. We've sent you a DM to sort it out\"). Respond to negative comments calmly and helpfully in public; deleting genuine complaints looks like hiding and often makes things worse. Like or thank positive comments. Hide or delete spam, scams (fake \"customer care\" accounts, suspicious links) and abusive content, following the platform's tools and the client's guide. Never share private information in public replies. Answer DMs with the same care as email, and save common answers as quick replies.",
        decision: {
          scenario: "On the bakery's Instagram post, a customer comments: \"My order #4521 was delivered 3 hours late and the cake was damaged.\"",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Reply publicly with an apology and say you have sent a DM, then sort out the order privately", why: "Right. A public apology shows you care; the order details belong in private." },
            { id: "b", text: "Delete the comment", whyWrong: "Deleting genuine complaints looks like hiding and angers the customer more." },
            { id: "c", text: "Reply publicly asking for her address and phone number", whyWrong: "Personal details must never be requested in public." },
            { id: "d", text: "Ignore it and post something positive", whyWrong: "Unanswered complaints tell every follower the brand does not care." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-community-desk",
        title: "Working the social inbox",
        explain:
          "Here are this morning's comments and messages on Sweet Crumbs' accounts. Choose the right action for each.",
        deskLab: {
          app: "social",
          title: "Sweet Crumbs · Comments and DMs · 09:00",
          task: "Choose the right action for each comment or message.",
          fields: [{ key: "action", label: "Action", type: "select", options: ["Reply publicly", "Apologise publicly and move to DM", "Like and thank", "Hide or delete as spam", "Escalate to the client"] }],
          items: [
            { id: "x1", title: "Comment: \"What time do you open on Sundays?\"", expect: { action: "Reply publicly" }, why: "A public question whose answer helps others." },
            { id: "x2", title: "Comment: \"Best chin-chin in Lagos!! 😍\"", expect: { action: "Like and thank" } },
            { id: "x3", title: "Comment: \"Paid for a cake on Friday and it never arrived. Order 4530.\"", expect: { action: "Apologise publicly and move to DM" } },
            { id: "x4", title: "Comment from \"SweetCrumbs_Support_Desk\": \"DM us your card details for a refund\"", expect: { action: "Hide or delete as spam" }, why: "A fake support account scamming followers: remove it and warn followers if needed." },
            { id: "x5", title: "DM from a food blogger with 200,000 followers asking for free cakes in exchange for a review", expect: { action: "Escalate to the client" }, why: "Influencer deals are the client's decision." },
            { id: "x6", title: "Comment: \"I got food poisoning after eating your meat pie\"", expect: { action: "Escalate to the client" }, hint: "This is a safety issue.", why: "Health and safety claims go to the client immediately (and are answered carefully, then moved to DM)." },
            { id: "x7", title: "Comment: \"Do you deliver to Ajah?\"", expect: { action: "Reply publicly" } },
            { id: "x8", title: "Comment with a link: \"Earn $500 a day from home! Click here\"", expect: { action: "Hide or delete as spam" } },
          ],
          solution: {
            x1: { action: "Reply publicly" }, x2: { action: "Like and thank" }, x3: { action: "Apologise publicly and move to DM" }, x4: { action: "Hide or delete as spam" },
            x5: { action: "Escalate to the client" }, x6: { action: "Escalate to the client" }, x7: { action: "Reply publicly" }, x8: { action: "Hide or delete as spam" },
          },
          hint: "Public questions get public answers; personal problems move to DM; spam goes; safety and deals go to the client.",
          successMessage: "Every comment handled correctly: the community feels heard and the brand stays safe.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l59-analytics",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.8"],
    title: "Engagement and Performance Analytics",
    subtitle: "The metrics that matter, engagement rate, and reporting what works",
    estimatedMinutes: 40,
    intro:
      "Clients want to know whether social media is working. Numbers answer that, if you choose the right ones and explain them.",

    atoms: [
      {
        id: "a-va-metrics",
        title: "Social media metrics",
        explain:
          "Platforms report many numbers; these matter most. Reach: how many different people saw a post. Impressions: how many times it was shown (one person can see it several times). Engagements: likes, comments, shares, saves and clicks. Engagement rate: engagements divided by reach, times 100, which lets you compare posts fairly whatever their reach. Clicks and click-through rate (CTR): how many people clicked a link, as a share of those who saw it. Follower growth: new followers minus those who left. Saves and shares are especially valuable: they show content people find useful enough to keep or pass on. Most important of all are business results tied to the client's goal: inquiries, sign-ups, bookings and sales from social media. Find the numbers in Meta Business Suite insights, LinkedIn analytics, TikTok analytics or the scheduling tool's reports.",
      },
      {
        id: "a-va-engagement-sheet",
        title: "Calculating engagement rate",
        explain:
          "Four of the bakery's posts are below. Engagement rate = engagements ÷ reach × 100. In D3, calculate the rate for the behind-the-scenes video, rounded to 1 decimal place: =ROUND(C3/B3*100,1).",
        exercise: {
          data: { ...POSTS },
          rows: 5,
          cols: 4,
          target: "D3",
          expected: 9.6,
          mustUseFormula: true,
          mustUse: "ROUND",
          lockedCells: Object.keys(POSTS),
          task: "In D3, calculate the engagement rate of the video, as a percentage rounded to 1 decimal place.",
          hint: "=ROUND(C3/B3*100,1)",
          successMessage: "9.6%: the video beat the price list (2%) almost five times over. That is the kind of finding a report should lead with.",
        },
      },
      {
        id: "a-va-social-report",
        title: "Reporting performance",
        explain:
          "A monthly social media report tells the client what happened, why, and what to do next. Show the key metrics against the previous month (followers, reach, engagements, engagement rate, and the business results such as inquiries or sign-ups), with the change. Highlight the best and worst posts and what made the difference. Give two or three insights in plain language (\"Member stories get three times the engagement of offers\") and recommendations for next month. Keep it to a page or a few slides with one or two charts. Be honest about drops and explain them; a vanity number (likes) never replaces the business result the client cares about.",
        decision: {
          scenario: "In June, followers rose 10%, but trial sign-ups from social media fell from 19 to 11. The client's goal is sign-ups.",
          question: "What should the report lead with?",
          options: [
            { id: "a", text: "The fall in sign-ups, the likely reason and what you will change, then the follower growth", why: "Right. Lead with the client's goal, honestly, with a plan." },
            { id: "b", text: "The 10% follower growth, and leave out sign-ups", whyWrong: "Hiding the result that matters destroys trust when the client notices." },
            { id: "c", text: "Only likes", whyWrong: "A vanity metric that says nothing about the goal." },
            { id: "d", text: "Skip this month's report", whyWrong: "Bad months are when reports matter most." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 9.9 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l60-email-campaigns",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.9", "9.10"],
    title: "Email Marketing and Campaign Support",
    subtitle: "Mailchimp campaigns, the rules of email marketing, and supporting a client's campaigns",
    estimatedMinutes: 45,
    intro:
      "Email is often the marketing channel that sells most for small businesses, because the audience chose to hear from them. VAs often run it.",

    atoms: [
      {
        id: "a-va-mailchimp",
        title: "Introduction to email marketing with Mailchimp",
        explain:
          "Email marketing sends campaigns (newsletters, offers, announcements) to people who have subscribed. In Mailchimp, subscribers live in an audience; tags and segments group them (customers, Lagos, cake buyers) so you can send relevant emails. Build a campaign from a template: a subject line (short, specific, under about 50 characters so it is not cut off on phones), preview text (the line shown after the subject), the content with one main message and a clear call-to-action button, and personalisation with merge tags such as *|FNAME|* for the first name. Always send a test email to yourself and check it on a phone, then schedule it. Afterwards, read the report: open rate, click rate, unsubscribes and bounces. The law matters: only email people who opted in, include an unsubscribe link and the business's physical address in every campaign (required by laws such as the US CAN-SPAM Act and expected under GDPR and Nigeria's NDPA), and never buy email lists.",
      },
      {
        id: "a-va-campaign-support",
        title: "Supporting digital marketing campaigns",
        explain:
          "A campaign is a coordinated push towards one goal over a period: a product launch, a sale, an event. VAs support campaigns by keeping a campaign checklist and timeline; preparing and scheduling assets across channels (social posts, emails, website banners, WhatsApp broadcasts) so the message and offer are consistent; creating tracked links with UTM parameters (tags added to a link, such as ?utm_source=instagram&utm_campaign=july_offer, so Google Analytics shows which channel brought each visitor); setting up landing pages or forms with simple tools; monitoring comments and inquiries during the campaign; and reporting results against the goal at the end. Paid ads are usually managed by a specialist, but a VA may prepare ad creatives, check budgets and pull reports.",
      },
      {
        id: "a-va-newsletter-lab",
        title: "Writing a newsletter campaign",
        explain:
          "Write Sweet Crumbs' July newsletter for Mailchimp.",
        writingLab: {
          task:
            "Subject: 50 characters or fewer, naming the new cookies. Preview text: one short line adding the code or date. Email: a personalised greeting using *|FNAME|*, the product with its price and launch date, the offer with the code CRUMBS10 and the 15 July end date, a call-to-action link to sweetcrumbs.example/order that starts with a verb, and the 4 July closure; 70 to 170 words. Footer: why they are receiving it, the bakery's address and an unsubscribe option.",
          brief: NEWS_BRIEF,
          doc: NEWS_DOC,
          tests: [
            { label: "Subject of 50 characters or fewer, naming the cookies", check: String.raw`const s = field(doc, 'Subject') || ''; return s.length >= 10 && s.length <= 50 && /cookie|chin-chin/i.test(s);`, fail: "Write a subject of 50 characters or fewer that names the new cookies." },
            { label: "Preview text that adds information", check: String.raw`const p = field(doc, 'Preview text') || ''; return words(p) >= 4 && p.length <= 90 && /(CRUMBS10|1 July|10%)/i.test(p);`, fail: "Add preview text (up to 90 characters) with the code, the date or the discount." },
            { label: "Personalised greeting", check: String.raw`return /\*\|FNAME\|\*/.test(section('Email') || '');`, fail: "Greet the reader with the merge tag *|FNAME|*." },
            { label: "Product, price, date, offer and closure", check: String.raw`const e = section('Email') || ''; return /2,?500/.test(e) && /1 July/i.test(e) && /CRUMBS10/.test(e) && /15 July/i.test(e) && /4 July/i.test(e);`, fail: "Include the price (₦2,500), the 1 July launch, the code CRUMBS10, the 15 July end date and the 4 July closure." },
            { label: "A call-to-action link starting with a verb", check: String.raw`const l = links(section('Email') || ''); return l.some((x) => /sweetcrumbs\.example\/order/.test(x.url) && isAction(x.text));`, fail: "Add a link like [Order your cookies](https://sweetcrumbs.example/order), whose text starts with a verb." },
            { label: "Email body of 70 to 170 words", check: String.raw`const w = words(section('Email') || ''); return w >= 70 && w <= 170;`, fail: "Keep the email body between 70 and 170 words." },
            { label: "A compliant footer", check: String.raw`const f = section('Footer') || ''; return /unsubscribe/i.test(f) && /(ikeja|lagos)/i.test(f) && /(subscribed|receiving)/i.test(f);`, fail: "In the footer, say why they receive it, give the bakery's address and an unsubscribe option." },
          ],
          solution: NEWS_DONE,
          hint: "One main message (the new cookies and the offer), one main button; everything else is short.",
          successMessage: "A campaign ready for Mailchimp: short subject, clear offer, one call to action and a legal footer.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l61-practical",
    moduleId: "va-m9-social",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["9.P"],
    title: "Practical: Calendar, Graphics and Monthly Report",
    subtitle: "A seven-day content calendar, three graphic briefs and a monthly report for a gym",
    estimatedMinutes: 75,
    intro:
      "GlowUp Fitness has hired you to support its social media. Deliver the first week's calendar, three graphics and June's report.",

    atoms: [
      {
        id: "a-va-m9-plan",
        title: "From goals to a week of content",
        explain:
          "Start from the client's goals (here: trial sign-ups and Instagram growth), then plan content that serves them: value posts that build the audience (educate, inspire, community) and a few promotional posts that ask for the sign-up. Give every post a clear call to action. Brief each graphic before designing it: the size for its format, the main text (a few words), the visual and the call to action. Then build the graphics in Canva with the brand kit, export them, and schedule the week in Meta Business Suite. Report monthly with the metrics against the previous month and what you will change.",
      },
      {
        id: "a-va-m9-practical",
        title: "Practical: the social media pack",
        explain:
          "Write the pack. When it passes, design the three graphics in Canva from your briefs and build the calendar as a Google Sheet for your portfolio.",
        writingLab: {
          task:
            "Content calendar: 7 rows, one per day, each with a platform (Instagram and/or Facebook), a pillar (Educate, Inspire, Promote or Community), a format, a caption and a CTA; use all four pillars, 1 to 3 Promote posts, and include the free trial class. Graphic briefs: three, each with Size (a correct pixel size), Text, Visual and CTA. June report: a results table with the four measures for May and June and a change column; two insights under What worked (one mentions Hauwa's video); two or more actions under Next month.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Seven calendar rows with every column filled", check: String.raw`const r = rows(section('Content calendar') || ''); return r.length === 7 && r.every((x) => x.length >= 6 && x.slice(0, 6).every((c) => c.trim()));`, fail: "Plan seven posts, one row per day, with every column filled." },
            { label: "Platforms and pillars from the brief", check: String.raw`const r = rows(section('Content calendar') || ''); return r.every((x) => /(instagram|facebook)/i.test(x[1]) && /^(educate|inspire|promote|community)$/i.test(x[2].trim()));`, fail: "Use only Instagram and Facebook, and the four pillars: Educate, Inspire, Promote, Community." },
            { label: "A balanced mix with the free trial", check: String.raw`const r = rows(section('Content calendar') || ''); const p = r.map((x) => x[2].trim().toLowerCase()); const promo = p.filter((x) => x === 'promote').length; return new Set(p).size === 4 && promo >= 1 && promo <= 3 && r.some((x) => /trial/i.test(x.join(' ')));`, fail: "Use all four pillars, with 1 to 3 Promote posts, and include the free trial class." },
            { label: "Three graphic briefs with correct sizes", check: String.raw`const g = sections('Design '); return g.length === 3 && g.every((x) => /(1080\s?[×x]\s?(1080|1350|1920)|1200\s?[×x]\s?627)/.test(field(x.text, 'Size') || '') && words(field(x.text, 'Text') || '') >= 3 && words(field(x.text, 'Visual') || '') >= 3 && words(field(x.text, 'CTA') || '') >= 2);`, fail: "Write three briefs, each with a correct Size (such as 1080 × 1350), the Text, the Visual and a CTA." },
            { label: "Results table with the change", check: String.raw`const r = rows(section('Results') || ''); const t = r.map((x) => x.join(' ')).join(' '); return r.length >= 4 && r.every((x) => x.length >= 4 && /[+-−]?\d/.test(x[3] || '')) && /2,?640/.test(t) && /24,?500/.test(t) && /1,?715/.test(t) && /19/.test(t);`, fail: "Fill the results table with the four measures for May and June and a Change column." },
            { label: "Insights and next steps", check: String.raw`const w = bullets(section('What worked') || ''); const n = bullets(section('Next month') || ''); return w.length >= 2 && w.some((x) => /hauwa/i.test(x)) && n.length >= 2;`, fail: "Give two insights (one about Hauwa's video) and at least two actions for next month." },
          ],
          solution: PRAC_DONE,
          hint: "Plan the two or three Promote posts first (the offer, the trial, Pilates), then fill the other days with value posts.",
          successMessage: "A week of content, three graphic briefs and a clear monthly report: a complete social media support package.",
        },
      },
    ],

    task: {
      title: "Module 9 practical: build the real assets",
      intro: "Make the pack real and add it to your portfolio.",
      prompts: [
        "Design the three graphics in Canva at the sizes in your briefs, with a consistent colour scheme, and export them as PNGs.",
        "Build the seven-day calendar in Google Sheets with a status column and drop-downs for platform and pillar.",
        "Create a free Mailchimp account, build the Sweet Crumbs newsletter in a template, and send a test to yourself.",
        "Turn the June report into one page or two slides with a simple bar chart of May versus June.",
      ],
      closing: "Module 10 adds the newest VA skills: using AI tools and automation to work faster without losing accuracy.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
