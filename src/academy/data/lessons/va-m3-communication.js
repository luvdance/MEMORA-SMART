/**
 * VIRTUAL ASSISTANT · MODULE 3 · PROFESSIONAL COMMUNICATION
 *
 * Curriculum 3.1 – 3.10 and the practical 3.P. Principles and channels,
 * professional email, business messaging, phone and video, active listening
 * and questions, international clients and time zones, difficult
 * conversations, confidentiality and boundaries; then five client responses.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s3-communication";

/* ── Lesson 15 lab: an approval email ─────────────────────────────────── */
const QUOTE_BRIEF = `You are **Bisi Ade**, virtual assistant to **Mr Femi Olawale**, Managing Director of **Olawale Logistics**. He asked you to get quotes for printing 500 branded calendars for clients. You have two:

- **PrintHub Lagos**: ₦1,450 per calendar (₦725,000 total), delivery in 10 days, includes design adjustments.
- **QuickPress**: ₦1,200 per calendar (₦600,000 total), delivery in 18 days, design adjustments cost extra.

The calendars must reach clients before 15 December. To meet that date with either printer, you must place the order by **Friday 21 November**. You recommend PrintHub, because QuickPress's 18 days leaves almost no margin for delays.

Your first draft, which you must not send:

> hi sir, i got the quotes. printhub is 1450 and quickpress is 1200 but quickpress is slower. let me know what u think. thanks`;

const QUOTE_DOC = `# Email to Mr Olawale

- Subject:

[Your email.]
`;

const QUOTE_DONE = `# Email to Mr Olawale

- Subject: Approval needed by Friday 21 November: calendar printing quote

Dear Mr Olawale,

Could you please approve one of the two quotes for the 500 client calendars by Friday 21 November? I recommend PrintHub Lagos.

Here are the two options:

- PrintHub Lagos: ₦1,450 per calendar, ₦725,000 in total, delivery in 10 days, design adjustments included.
- QuickPress: ₦1,200 per calendar, ₦600,000 in total, delivery in 18 days, design adjustments extra.

PrintHub costs ₦125,000 more, but its faster delivery gives us a safe margin to reach clients before 15 December. QuickPress's 18 days leaves almost no room for delays.

If you approve by Friday, I will place the order the same day.

Kind regards,
Bisi Ade
Virtual Assistant to the Managing Director
`;

/* ── Lesson 16 lab: phone message and Slack relay ─────────────────────── */
const CALL_BRIEF = `You are **Ifeoma**, VA to **Grace Bamidele**, a wedding planner. Grace is at a venue visit all day; you answer her business line. At **11:20 on Tuesday 18 March** this call comes in:

> "Hello, this is Mr Victor Eze from Royal Palms Hotel, Abuja. I am calling about the Adeyemi wedding on 12 April. Our ballroom is double-booked for that date, and I need Mrs Bamidele to call me back before **4pm today** to choose between the Garden Hall or moving the reception to 13 April. My direct number is 0803 555 0192."

Grace reads Slack on her phone between appointments.`;

const CALL_DOC = `# Phone message and Slack relay

## Phone message

- Caller:
- Company:
- Phone:
- Date and time:
- Message:
- Action needed:

## Slack message to Grace

[One complete Slack message to Grace.]
`;

const CALL_DONE = `# Phone message and Slack relay

## Phone message

- Caller: Mr Victor Eze
- Company: Royal Palms Hotel, Abuja
- Phone: 0803 555 0192
- Date and time: Tuesday 18 March, 11:20
- Message: The ballroom is double-booked for the Adeyemi wedding on 12 April. He offers the Garden Hall on the same date or moving the reception to 13 April.
- Action needed: Call him back before 4pm today to choose an option.

## Slack message to Grace

@Grace Urgent, needs a call by 4pm today: Mr Victor Eze of Royal Palms Hotel says the ballroom is double-booked for the Adeyemi wedding on 12 April. Options: the Garden Hall on 12 April, or move the reception to 13 April. Please call him on 0803 555 0192 before 4pm. I can tell the Adeyemis once you decide.
`;

/* ── Lesson 17 lab: clarifying a vague request ────────────────────────── */
const VAGUE_BRIEF = `Your client, **Dr Nnamdi Obi**, runs a chain of three dental clinics. On Monday he sends this message:

> "Hi, can you put together something on our patients for the meeting? Thanks."

You do not know which meeting, what "something" is, which patients, what period, what format, who will see it, or when it is needed. You have access to the clinics' booking system, which records appointments, treatments and payments.`;

const VAGUE_DOC = `# Reply to Dr Obi

[Your reply: thank him, say what you understand so far, then ask your questions as a numbered list.]
`;

const VAGUE_DONE = `# Reply to Dr Obi

Hi Dr Obi,

Thank you, I will be happy to prepare this. So that it is exactly what you need, I understand you want a summary of patient information for an upcoming meeting. A few quick questions:

1. Which meeting is it for, and when do you need the summary?
2. What should it cover: the number of patients, appointments, treatments, payments, or something else?
3. Which period should it cover, for example last month or this quarter, and all three clinics or one?
4. What format would you like: a one-page report, a spreadsheet or a few slides?
5. Who will see it? If it goes beyond the management team, I will remove names and other patient details.

If it helps, I can send you a short outline first today, so you can confirm before I build the full summary.

Kind regards,
Ada
`;

/* ── Lesson 18 lab: time-zone desk ────────────────────────────────────── */

/* ── Lesson 19 lab: holding a boundary ────────────────────────────────── */
const BOUNDARY_BRIEF = `You are **Zainab Bello**, a freelance VA. Your client **Mrs Linda Carter** (a property investor in Houston, Texas) pays for a **20-hour monthly package** of business administration: her property inbox, tenant scheduling and invoices, **Monday to Friday, 9:00–17:00 WAT**. She has used 18 hours this month.

On **Saturday at 22:40 WAT** she sends:

> "Hey Zainab! Can you plan my family's vacation to Orlando over the weekend? Flights, hotel, theme park tickets for 5 people. Need it all booked by Sunday night. Thanks!!"

Your facts and options:
- Personal travel planning is not in the package, but you can do it as extra work at your hourly rate of **$15**; you estimate **6 hours**.
- You do not work weekends. The earliest you can start is **Monday 9:00 WAT**, and you could have options ready by **Tuesday at 12:00 noon Houston time**.
- Booking needs her card details through her travel account; you will not take card numbers by message.

Write your reply, to be sent **Monday at 9:00 WAT**.`;

const BOUNDARY_DOC = `# Reply to Mrs Carter

[Your reply.]
`;

const BOUNDARY_DONE = `# Reply to Mrs Carter

Hi Linda,

Thank you for thinking of me for your family's trip to Orlando. It sounds wonderful.

I saw your message this morning, as I do not work at weekends. Personal travel planning is outside your business administration package, but I would be glad to do it as extra work at my hourly rate of $15. I estimate about 6 hours, so around $90, and it would not use your remaining package hours.

If you approve, I will start today and send you flight, hotel and theme park ticket options for 5 people by Tuesday at 12:00 noon Houston time. Once you choose, you can book through your travel account, or I can complete the booking there; please do not send card numbers by message.

Shall I go ahead?

Kind regards,
Zainab
`;

/* ── Lesson 20 lab: five client situations ────────────────────────────── */
const FIVE_BRIEF = `You are **Tobi Lawal**, virtual assistant to **Ms Halima Yusuf**, founder of **Halo Skincare**, an online skincare shop in Abuja. Write one response for each situation.

1. **Complaint.** A customer, Mrs Joy Uche, emails: *"My order HS-2291 arrived with the toner bottle broken and leaking over everything. Very disappointing."* Policy: a free replacement shipped within 48 hours, or a full refund within 5 working days; the customer chooses. No need to return the broken item.
2. **Meeting request.** Mr Kofi Mensah, a packaging supplier in Accra (GMT, one hour behind Abuja), asks to meet Halima next week. She can do a 30-minute Google Meet on **Tuesday at 14:00 WAT** or **Thursday at 10:00 WAT**.
3. **Delayed delivery.** You promised Halima the **monthly sales report by Friday**. The payment platform's export failed and support says it will be fixed on Saturday. You can deliver it by **Monday at 12:00**. Write to Halima.
4. **Clarification request.** Halima messages: *"Please prepare the influencer list."* Ask what you need to know.
5. **Project update.** The product upload project for the new website: **120 of 150 products** are uploaded; the other **30** are waiting for photos from the photographer, promised by **14 June**. If they arrive then, the site is on track to launch on **20 June**. Write Halima a weekly update.`;

const FIVE_DOC = `# Five client responses

## 1. Complaint
- Subject:

## 2. Meeting request
- Subject:

## 3. Delayed delivery
- Subject:

## 4. Clarification request

## 5. Project update
- Subject:
`;

const FIVE_DONE = `# Five client responses

## 1. Complaint
- Subject: Your order HS-2291: a replacement or refund, your choice

Dear Mrs Uche,

I am sorry that your toner arrived broken and leaked over your order. That is not the experience we want for you.

We would like to put it right at once. Please choose one of these:

- A free replacement, shipped within 48 hours.
- A full refund, paid within 5 working days.

There is no need to return the broken bottle. Just reply with your choice and I will arrange it the same day.

Kind regards,
Tobi Lawal
Customer Care, Halo Skincare

## 2. Meeting request
- Subject: Meeting with Halima Yusuf next week: two times to choose from

Dear Mr Mensah,

Thank you for your message. Ms Yusuf would be glad to meet you next week for 30 minutes on Google Meet. She is available at either of these times:

- Tuesday at 14:00 WAT (13:00 GMT, Accra time)
- Thursday at 10:00 WAT (09:00 GMT, Accra time)

Please let me know which suits you, and I will send a calendar invitation with the Meet link.

Kind regards,
Tobi Lawal
Assistant to Halima Yusuf, Halo Skincare

## 3. Delayed delivery
- Subject: Monthly sales report: new delivery time Monday 12:00

Hi Halima,

I am sorry, but the monthly sales report will not be ready on Friday as I promised. The payment platform's export has failed, and their support team says it will be fixed on Saturday.

I will send you the complete report by Monday at 12:00. If you need headline figures before then, I can send this month's order totals from our order sheet today.

Best regards,
Tobi

## 4. Clarification request

Hi Halima, happy to prepare it. A few quick questions so I get it right:

1. What is the list for: a launch campaign, gifting, or paid posts?
2. Which platforms: Instagram, TikTok, or both?
3. What size of influencer, for example by number of followers, and how many names do you need?
4. Which details should I include, such as contact, follower count, engagement rate and rates?
5. When do you need it?

## 5. Project update
- Subject: Weekly update: website product upload, 120 of 150 done

Hi Halima,

Here is this week's update on the product upload for the new website.

- Done: 120 of 150 products are uploaded with descriptions and prices.
- Waiting: the other 30 products need photos, which the photographer has promised by 14 June.
- On track: if the photos arrive by 14 June, the site can launch on 20 June as planned.

I will remind the photographer on 12 June. If the photos are late, I will let you know the same day so we can decide whether to launch with the 120 products.

Best regards,
Tobi
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.1 – 3.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l14-principles",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2"],
    title: "Principles and Channels of Communication",
    subtitle: "The principles of professional communication; written, verbal and non-verbal",
    estimatedMinutes: 35,
    intro:
      "A remote client sees almost nothing of your work except how you communicate. For a VA, communication is not a soft skill; it is the product.",

    atoms: [
      {
        id: "a-va-comm-principles",
        title: "The principles of professional communication",
        explain:
          "Professional communication follows a few principles, often called the 7 Cs. Clear: one main point, in plain words. Concise: no unnecessary words, so the reader's time is respected. Concrete: specific facts, numbers, dates and names rather than \"soon\" or \"some issues\". Correct: accurate facts, names and figures, with good grammar and spelling. Coherent: in a logical order, with the most important point first. Complete: everything the reader needs to act, so they do not have to come back and ask. Courteous: polite and respectful, even when the news is bad. Behind them all are two questions to ask before you communicate anything: who is the audience, and what do I want them to know or do?",
        samples: [
          { label: "Vague, incomplete", tone: "bad", text: "Hi, there's an issue with the booking, can you check when you can?" },
          { label: "Clear, concrete, complete", tone: "good", text: "Hi Mrs Okafor, the hotel cannot hold your room for 14 March after 6pm today without a deposit of ₦45,000. Shall I pay it from the travel card, or release the room?" },
        ],
      },
      {
        id: "a-va-comm-channels",
        title: "Written, verbal and non-verbal communication",
        explain:
          "Written communication (email, chat, documents) is permanent, can be read when convenient and can be forwarded, so it is best for details, decisions and records, but it carries no tone of voice and is easily misread. Verbal communication (phone, voice notes, video calls) carries tone and allows quick back-and-forth, so it is best for urgent, complex or sensitive matters, but it leaves no record unless you confirm it in writing. Non-verbal communication is everything beyond the words: on video, your eye contact (look at the camera, not the screen), facial expression, posture, nodding, dress and background; in speech, your tone, pace and pauses; in writing, your formatting, punctuation and response time. A one-word reply (\"Ok.\") or a late reply sends a non-verbal message too.",
        table: {
          caption: "Choosing the channel.",
          headers: ["Situation", "Best channel", "Why"],
          rows: [
            ["Details, files, decisions to keep", "Email", "Permanent record, can be searched and forwarded"],
            ["Quick question to a team", "Slack or Teams message", "Fast, informal, does not clutter inboxes"],
            ["Urgent and time-critical", "Phone or WhatsApp call", "Immediate; then confirm in writing"],
            ["Complex, sensitive or emotional", "Video or phone call", "Tone and back-and-forth avoid misunderstanding"],
            ["After any important call", "Email summary", "Turns a conversation into a record"],
          ],
        },
      },
      {
        id: "a-va-comm-video-presence",
        title: "Non-verbal signals on camera",
        explain:
          "Video calls are where clients form much of their impression of you. Put the camera at eye level (raise the laptop on books), face a window or a lamp so your face is lit from the front, use a plain or tidy background (or a subtle blur), and dress as you would for an office meeting, at least from the waist up. Look at the camera when you speak, nod and smile to show you are listening, and keep your posture open. Use a headset for clear sound, and mute when you are not speaking in a group call.",
        decision: {
          scenario: "You must tell your client that a supplier has missed a delivery and her product launch will be three days late. She is upset easily when surprised.",
          question: "Which channel should you use first?",
          options: [
            { id: "a", text: "A short phone or video call to explain and agree next steps, then an email summary", why: "Right. Bad, sensitive news is best given by voice, where tone helps, and then confirmed in writing as a record." },
            { id: "b", text: "A long email with all the details", whyWrong: "Bad news in writing alone can feel cold and invites misreading; use it to confirm, not to break the news." },
            { id: "c", text: "A Slack message with a sad emoji", whyWrong: "Too casual for news that changes her launch." },
            { id: "d", text: "Wait until she notices", whyWrong: "Surprises are worse than bad news delivered early." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-channel-desk",
        title: "Choosing the right channel",
        explain:
          "For each message you need to send this week, choose the best channel.",
        deskLab: {
          app: "tasks",
          title: "This week's messages",
          task: "Choose the best channel for each message.",
          fields: [{ key: "channel", label: "Channel", type: "select", options: ["Email", "Slack or Teams message", "Phone or WhatsApp call", "Video call, then email summary"] }],
          items: [
            { id: "m1", title: "Send a supplier the signed contract and the payment schedule", expect: { channel: "Email" }, why: "A file and terms that need a permanent record." },
            { id: "m2", title: "Ask the team which slide template to use", expect: { channel: "Slack or Teams message" }, why: "A quick, informal team question." },
            { id: "m3", title: "The client's flight leaves in 3 hours and has just been cancelled", expect: { channel: "Phone or WhatsApp call" }, why: "Urgent and time-critical: call, then confirm in writing." },
            { id: "m4", title: "Discuss with the client why you need two more hours a week and what changes", expect: { channel: "Video call, then email summary" }, why: "A sensitive, two-way conversation, then a written record of what was agreed." },
            { id: "m5", title: "Confirm the venue, date, time and attendee list for next month's workshop", expect: { channel: "Email" }, why: "Details people will refer back to." },
            { id: "m6", title: "Tell a colleague the shared drive link has moved", expect: { channel: "Slack or Teams message" }, why: "Quick information for a colleague." },
            { id: "m7", title: "A VIP client is at the office reception and nobody is there to meet him", expect: { channel: "Phone or WhatsApp call" }, why: "Immediate action is needed." },
            { id: "m8", title: "Agree the scope of a new three-month project with the client", expect: { channel: "Video call, then email summary" }, why: "Complex: talk it through, then confirm the scope in writing." },
          ],
          solution: {
            m1: { channel: "Email" }, m2: { channel: "Slack or Teams message" }, m3: { channel: "Phone or WhatsApp call" }, m4: { channel: "Video call, then email summary" },
            m5: { channel: "Email" }, m6: { channel: "Slack or Teams message" }, m7: { channel: "Phone or WhatsApp call" }, m8: { channel: "Video call, then email summary" },
          },
          hint: "Ask: is it urgent? Is it sensitive or complex? Does it need a record?",
          successMessage: "Choosing the channel is the first decision in every message, and now you make it on purpose.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l15-email",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.3"],
    title: "Professional Email Writing and Etiquette",
    subtitle: "The structure of a professional email, and the etiquette that keeps you trusted",
    estimatedMinutes: 40,
    intro:
      "Email is still where business decisions are made and recorded. A VA writes dozens a day, some in the client's name. Every one should be easy to act on.",

    atoms: [
      {
        id: "a-va-email-anatomy",
        title: "The anatomy of a professional email",
        explain:
          "A professional email has seven parts. A specific subject line that says what the email is about and any deadline (\"Approval needed by Friday: calendar printing quote\"). A greeting suited to the relationship (\"Dear Mr Olawale,\" for a first or formal email; \"Hi Femi,\" once he uses first names). The bottom line up front: your purpose or request in the first one or two sentences. The details in short paragraphs or bullets: the options, facts and figures. A clear call to action: exactly what you need, by when and why (\"Could you approve one by Friday 21 November, so the calendars arrive before 15 December?\"). A sign-off (Kind regards, Best regards). A signature with your name and role. Use To for people who must act, Cc for people who only need to know, and Bcc rarely (for example, to hide addresses on a large external list).",
        samples: [
          { label: "The request is buried and unclear", tone: "bad", text: "hi sir, i got the quotes. printhub is 1450 and quickpress is 1200 but quickpress is slower. let me know what u think. thanks" },
          { label: "Bottom line up front", tone: "good", text: "Could you please approve one of the two quotes for the 500 client calendars by Friday 21 November? I recommend PrintHub Lagos." },
        ],
      },
      {
        id: "a-va-email-etiquette",
        title: "Email etiquette",
        explain:
          "Etiquette is what makes people trust your emails. Reply within one working day, even if only to say when you will answer fully. Write in full sentences with standard capitals and punctuation: no text-speak (u, pls, ur) and no ALL CAPITALS, which reads as shouting. Keep the tone polite and neutral; read the email as the recipient before sending, and never send in anger. Mention attachments and check they are attached. Use Reply All only when everyone needs your reply. Check names, titles and figures. When you email on a client's behalf, make clear who you are (\"I am writing on behalf of Mr Olawale\" and a signature such as \"Assistant to the Managing Director\"), unless the client has asked you to write as them. Set an out-of-office reply when you are away, saying when you are back and who to contact meanwhile.",
        mistake:
          "Writing \"Please find attached\" and forgetting the attachment, then sending a second email. Attach the file first, then write the email.",
      },
      {
        id: "a-va-email-cc",
        title: "To, Cc, Bcc and Reply All",
        explain:
          "Getting recipients right is part of etiquette. Put in To the people who must act or reply. Put in Cc people who should be kept informed but do not need to act, such as your client when you confirm a booking with a supplier on her behalf. Use Bcc to send to many external people who should not see each other's addresses, such as a newsletter to customers. Reply All only when every person on the thread needs your answer; a \"Thanks!\" to 30 people wastes 30 people's time.",
        decision: {
          scenario: "You are confirming a delivery date with a supplier on behalf of your client, who wants to be kept informed but does not need to reply.",
          question: "How should you address the email?",
          options: [
            { id: "a", text: "Supplier in To, your client in Cc", why: "Right. The supplier must act; the client only needs to know." },
            { id: "b", text: "Both in To", whyWrong: "That suggests your client must act or reply too." },
            { id: "c", text: "Your client in Bcc", whyWrong: "Hiding the client from the supplier is unnecessary and can cause confusion if she replies." },
            { id: "d", text: "Only the supplier; tell your client later", whyWrong: "She asked to be kept informed; Cc does that automatically." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-email-lab",
        title: "Writing an approval email",
        explain:
          "Bisi's first draft is how many beginners write. Rewrite it as a professional email the Managing Director can approve in thirty seconds.",
        writingLab: {
          task:
            "Write Bisi's email. Subject: specific, with the deadline. Greeting: \"Dear Mr Olawale,\". First paragraph: the request and the deadline (Friday 21 November) and your recommendation. Then the two options as bullets with the price per calendar, the total and the delivery time. Then a reason for your recommendation that mentions 15 December. A sign-off and a signature with Bisi's name and role. Standard English, no text-speak, 80 to 180 words.",
          brief: QUOTE_BRIEF,
          doc: QUOTE_DOC,
          tests: [
            { label: "Subject with the topic and the deadline", check: String.raw`const s = field(doc, 'Subject') || ''; return words(s) >= 4 && /(friday|21 nov)/i.test(s) && /(calendar|print|quote)/i.test(s);`, fail: "Write a subject that names the calendars or quote and the Friday 21 November deadline." },
            { label: "Formal greeting", check: String.raw`return /^Dear Mr Olawale,?\s*$/m.test(doc);`, fail: "Greet him as \"Dear Mr Olawale,\"." },
            { label: "Request, deadline and recommendation first", check: String.raw`const body = doc.split(/^Dear Mr Olawale,?\s*$/m)[1] || ''; const p = paragraphs(body)[0] || ''; return /(approve|choose|decide)/i.test(p) && /(21 november|friday)/i.test(p) && /(recommend|suggest)/i.test(p);`, fail: "Open with the request (approve one quote), the deadline and your recommendation, in the first paragraph." },
            { label: "Both options as bullets with prices, totals and delivery", check: String.raw`const b = bullets(doc); const ph = b.find((x) => /printhub/i.test(x)) || ''; const qp = b.find((x) => /quickpress/i.test(x)) || ''; return /1,?450/.test(ph) && /725,?000/.test(ph) && /10 days/i.test(ph) && /1,?200/.test(qp) && /600,?000/.test(qp) && /18 days/i.test(qp);`, fail: "List each printer as a bullet with its price per calendar, its total and its delivery time." },
            { label: "A reason that mentions 15 December", check: String.raw`return /15 december/i.test(doc) && /(because|margin|risk|delay|safe)/i.test(doc);`, fail: "Explain your recommendation in terms of reaching clients before 15 December." },
            { label: "Sign-off and signature", check: String.raw`return /(kind regards|best regards|regards|sincerely)[\s\S]*Bisi Ade[\s\S]*(assistant)/i.test(doc);`, fail: "Close with a sign-off, Bisi's name and her role." },
            { label: "Standard English, 80 to 180 words", check: String.raw`return !/\b(u|pls|ur|thx|abt)\b/.test(doc) && !/^hi sir/im.test(doc) && words(doc) >= 80 && words(doc) <= 180;`, fail: "Use full words and standard capitals, and keep it between 80 and 180 words." },
          ],
          solution: QUOTE_DONE,
          hint: "Move the decision you need to the first sentence; the draft's last line (\"let me know what you think\") becomes a specific request with a date.",
          successMessage: "He can approve this from his phone in thirty seconds. That is what a good VA email does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l16-messaging-calls",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.4", "3.5"],
    title: "Messaging, Phone and Video Calls",
    subtitle: "Slack and Teams etiquette, taking calls and messages, and running video calls",
    estimatedMinutes: 40,
    intro:
      "Many clients live in Slack, Teams and WhatsApp, and some still phone. Each channel has its own etiquette, and a VA is expected to know it.",

    atoms: [
      {
        id: "a-va-messaging",
        title: "Business messaging: Slack and Microsoft Teams",
        explain:
          "Slack and Microsoft Teams organise team chat into channels (topics or projects everyone in them can see) and direct messages (DMs, private). Post work questions in the relevant channel so others can see the answer, and use DMs for personal or sensitive matters. Reply in threads to keep conversations together. Use an @mention only for people who need to act. Write one complete message instead of \"Hi\" followed by a wait: say who, what and by when in a single message, so the reader can act at once (this is often called \"no hello\" etiquette). React with an emoji (✅ or 👀) to show you have seen or done something. Set your status and working hours so people know when you will reply. On WhatsApp for business, the same rules apply: complete messages, no voice notes for things that need a record, and respect the client's hours unless it is urgent.",
        samples: [
          { label: "Makes the reader wait", tone: "bad", text: "Hi Grace\n\nAre you there?\n\nSomething happened with the hotel" },
          { label: "One complete message", tone: "good", text: "@Grace Royal Palms has double-booked the ballroom for the Adeyemi wedding (12 April). Options: Garden Hall same day, or move to 13 April. Please call Mr Eze on 0803 555 0192 before 4pm today." },
        ],
      },
      {
        id: "a-va-phone",
        title: "Telephone communication and taking messages",
        explain:
          "When you answer a client's business line, greet the caller with the business name and your name: \"Good morning, Bamidele Events, Ifeoma speaking. How may I help you?\" Speak clearly, smile (it can be heard), and never leave a caller on hold for more than a minute without checking back. If the person they want is unavailable, take a complete message: the caller's full name, their company, their phone number (read it back to confirm), the date and time of the call, the message in their words, and the action needed with any deadline. Pass it on immediately through the agreed channel. When you leave a voicemail, give your name, company, the reason, the action and your number twice, slowly. After any important call, confirm what was agreed in writing.",
      },
      {
        id: "a-va-video",
        title: "Video calls: Zoom, Teams and Google Meet",
        explain:
          "Prepare before a video call: test your camera, microphone and headset (Zoom and Teams have a test option), close tabs and notifications you would not want to share, and join two or three minutes early. If you host, send the invitation with the link, agenda and time zone, and admit people from the waiting room. During the call, mute when not speaking in a group, use the hand-raise or chat to speak without interrupting, and when you share your screen, share a single window rather than the whole desktop. Ask everyone's permission before recording; recording people without consent is unprofessional and illegal in some places. Take notes of decisions and actions. Afterwards, send a short summary with the decisions, who does what and by when.",
        decision: {
          scenario: "You are about to share your screen in a Zoom call to show the client a spreadsheet. Another client's inbox is open in a browser tab.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Share only the spreadsheet window, not the whole screen", why: "Right. Sharing a single window protects other clients' information and your notifications." },
            { id: "b", text: "Share the whole screen and switch tabs quickly", whyWrong: "Anything on screen, even for a second, can be seen or recorded." },
            { id: "c", text: "Describe the spreadsheet without sharing", whyWrong: "Possible, but sharing the right window is clearer and safe." },
            { id: "d", text: "Ask the client to look away", whyWrong: "Unprofessional, and it does not protect the information." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-call-lab",
        title: "Taking a message and relaying it",
        explain:
          "Take Mr Eze's message properly, then send Grace one complete Slack message she can act on from her phone between appointments.",
        writingLab: {
          task:
            "Phone message: fill every field: the caller's name, company, phone number exactly, date and time, the message (both options) and the action with its deadline. Slack message: one complete message of 30 to 90 words that starts with @Grace, says it is urgent, explains the double booking for 12 April, gives both options, the number and the 4pm deadline.",
          brief: CALL_BRIEF,
          doc: CALL_DOC,
          tests: [
            { label: "Caller, company and the exact phone number", check: String.raw`const s = section('Phone message') || ''; return /victor eze/i.test(field(s, 'Caller') || '') && /royal palms/i.test(field(s, 'Company') || '') && /0803\s?555\s?0192/.test(field(s, 'Phone') || '');`, fail: "Record the caller's full name, the hotel, and the phone number exactly." },
            { label: "Date and time of the call", check: String.raw`const t = field(section('Phone message') || '', 'Date and time') || ''; return /18 march/i.test(t) && /11:20/.test(t);`, fail: "Record when the call came in: Tuesday 18 March, 11:20." },
            { label: "The message with both options", check: String.raw`const m = field(section('Phone message') || '', 'Message') || ''; return /double/i.test(m) && /garden hall/i.test(m) && /13 april/i.test(m);`, fail: "Write the message: the double booking and both options (Garden Hall, or 13 April)." },
            { label: "Action with the deadline", check: String.raw`const a = field(section('Phone message') || '', 'Action needed') || ''; return /call/i.test(a) && /(4pm|4 pm|16:00)/i.test(a);`, fail: "State the action: call him back before 4pm today." },
            { label: "Slack: one complete, urgent message to @Grace", check: String.raw`const s = section('Slack') || ''; return /^@Grace/m.test(s.trim()) && /urgent/i.test(s) && words(s) >= 30 && words(s) <= 90 && paragraphs(s).length === 1;`, fail: "Write one paragraph of 30 to 90 words that starts with @Grace and says it is urgent." },
            { label: "Slack: options, number and deadline", check: String.raw`const s = section('Slack') || ''; return /12 april/i.test(s) && /garden hall/i.test(s) && /13 april/i.test(s) && /0803\s?555\s?0192/.test(s) && /(4pm|4 pm|16:00)/i.test(s);`, fail: "Include the date, both options, Mr Eze's number and the 4pm deadline, so she can call without opening anything else." },
          ],
          solution: CALL_DONE,
          hint: "Grace will read this standing in a venue. Could she make the call from your Slack message alone?",
          successMessage: "A complete message, relayed in one go: the client acts in seconds.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 3.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l17-listening",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.6"],
    title: "Active Listening and Asking Effective Questions",
    subtitle: "Understand exactly what the client needs before you start",
    estimatedMinutes: 35,
    intro:
      "The most expensive VA mistake is doing the wrong task perfectly. Listening well and asking the right questions prevents it.",

    atoms: [
      {
        id: "a-va-listening",
        title: "Active listening",
        explain:
          "Active listening means giving full attention to understand, not just waiting to speak. Focus: close other windows, look at the person (or the camera) and take notes. Do not interrupt; let them finish. Show you are following with small signals (\"I see\", nodding). Paraphrase: repeat the request in your own words (\"So you'd like the three supplier quotes compared by price and delivery time by Thursday?\"). This catches misunderstandings while they are still cheap. Summarise at the end: the decisions, the tasks, who does what and by when. Notice emotions too: \"That sounds frustrating\" shows a client you heard more than the words. In writing, active listening means reading the whole message before replying and answering every question it asks.",
      },
      {
        id: "a-va-questions",
        title: "Asking effective questions",
        explain:
          "Closed questions have short answers (yes or no, a date, a choice): \"Shall I book the 10:00 flight?\" They are best for confirming. Open questions invite explanation: \"What would make this event a success for you?\" They are best for understanding. Clarifying questions fill gaps in a task. For any new task, make sure you know: the purpose (why it is needed), the deliverable (what exactly you will produce), the deadline, the format (document, spreadsheet, slides), the audience (who will see it), the scope (how much: period, number of items), any budget, the priority compared with other tasks, and who approves it. Ask your questions together in one numbered message rather than one at a time, and suggest defaults where you can (\"If it's for the board, I'll do a one-page PDF unless you'd prefer slides\"). Avoid leading questions that push your own answer (\"You don't need it before Friday, do you?\").",
        decision: {
          scenario: "Your client says: \"Book me a hotel in Abuja for the conference.\"",
          question: "Which set of questions is best?",
          options: [
            { id: "a", text: "One message: check-in and check-out dates, budget per night, near the venue or not, and any loyalty programme. I'll send three options by 3pm.", why: "Right. One message with the key questions and a clear next step." },
            { id: "b", text: "\"Which dates?\" now, then \"What budget?\" after he replies, then \"Which area?\"", whyWrong: "Three rounds of messages waste his time and delay the booking." },
            { id: "c", text: "No questions; book the most expensive hotel to be safe", whyWrong: "You may book the wrong dates and overspend his money." },
            { id: "d", text: "\"You want a cheap one, don't you?\"", whyWrong: "A leading question, and it misses dates and location." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-clarify-lab",
        title: "Clarifying a vague request",
        explain:
          "Dr Obi's message could mean a dozen different things. Reply in a way that shows you are willing, then ask everything you need in one go.",
        writingLab: {
          task:
            "Reply to Dr Obi. Greet him and thank him; paraphrase what you understand so far in one sentence that starts \"I understand\". Then ask 4 to 6 numbered questions that together cover: which meeting and the deadline, what the summary should cover, the period or clinics, the format, and who will see it. One question or sentence should mention protecting patient privacy (names or patient details). End by offering a next step, such as an outline first, and a sign-off. 80 to 200 words.",
          brief: VAGUE_BRIEF,
          doc: VAGUE_DOC,
          tests: [
            { label: "Greeting and thanks", check: String.raw`return /^(Hi|Hello|Dear|Good (morning|afternoon))\b.*(Dr )?Obi,?\s*$/im.test(doc) && /thank/i.test(doc);`, fail: "Greet Dr Obi and thank him." },
            { label: "Paraphrases what you understand", check: String.raw`return /I understand/i.test(doc);`, fail: "Show you listened: say what you understand so far, starting \"I understand\"." },
            { label: "4 to 6 numbered questions", check: String.raw`const n = numbered(doc); return n.length >= 4 && n.length <= 6 && n.every((x) => /\?\s*$/.test(x) || /\?/.test(x));`, fail: "Ask 4 to 6 questions as a numbered list, each ending with a question mark." },
            { label: "Covers meeting, deadline, content, period, format and audience", check: String.raw`const t = numbered(doc).join(' '); return /meeting/i.test(t) && /(when|deadline|by )/i.test(t) && /(cover|include|appointments|treatments|payments)/i.test(t) && /(period|month|quarter|year|clinic)/i.test(t) && /(format|report|spreadsheet|slides)/i.test(t) && /(who will see|audience|who is it for|who will)/i.test(t);`, fail: "Make sure your questions cover: which meeting and when, what to cover, which period or clinics, the format and who will see it." },
            { label: "Protects patient privacy", check: String.raw`return /(privacy|names|patient details|anonym|confidential)/i.test(doc);`, fail: "Patient data is sensitive: mention removing names or protecting patient details." },
            { label: "Offers a next step and signs off, 80 to 200 words", check: String.raw`return /(outline|draft)/i.test(doc) && /(regards|best|thanks|thank you)/i.test(lines(doc).slice(-3).join(' ')) && words(doc) >= 80 && words(doc) <= 200;`, fail: "Offer a next step (such as an outline first), sign off, and keep it between 80 and 200 words." },
          ],
          solution: VAGUE_DONE,
          hint: "Work through the checklist: purpose, deliverable, deadline, format, audience, scope. Turn each gap into one question.",
          successMessage: "Five minutes of questions saves five hours of the wrong report.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 3.7 – 3.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l18-international",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.7", "3.8"],
    title: "International Clients, Cultures and Time Zones",
    subtitle: "Clear international English, cross-cultural communication and converting time zones without mistakes",
    estimatedMinutes: 45,
    intro:
      "Many of the best-paid VA jobs are with clients in other countries. Two things decide whether you keep them: whether they understand you easily, and whether you ever get a meeting time wrong.",

    atoms: [
      {
        id: "a-va-intl-english",
        title: "Communicating with international clients",
        explain:
          "International clients read your English quickly, sometimes as a second language. Write plain, standard English: short sentences, common words, and no local expressions or slang that do not travel (\"I'm coming\" meaning \"wait a moment\", \"well done\" as a greeting, \"the light has gone\", \"no wahala\", \"how far\"). Write dates so they cannot be misread: 5 March 2026, not 05/03/26, which an American reads as 3 May. Always give times with a time zone. Name currencies (USD, GBP, NGN) and convert when it helps. Follow the client's spelling (American \"organize, color\" or British \"organise, colour\") and keep it consistent. Start formally (Dear Ms Carter) and follow the client's lead when they switch to first names. Confirm important points in writing after calls.",
        samples: [
          { label: "Local expressions and an ambiguous date", tone: "bad", text: "Good morning ma, well done. The light went off but I'm coming with the report. Meeting is 05/03 by 4." },
          { label: "Plain international English", tone: "good", text: "Good morning Ms Carter. I will send the report within the hour. Our meeting is confirmed for Thursday 5 March at 16:00 WAT (10:00 in Houston)." },
        ],
      },
      {
        id: "a-va-cultures",
        title: "Cross-cultural communication",
        explain:
          "Cultures differ in how they communicate at work, and none is wrong. Some clients prefer direct, brief messages that get to the point (common in the US, Germany and the Netherlands); others expect greetings, courtesy and relationship-building first (common in much of Africa, Asia, the Middle East and Latin America). Attitudes to punctuality, hierarchy and titles, first names, humour and how disagreement is shown also vary. Respect religious and public holidays in the client's country (Thanksgiving, Ramadan and Eid, Chinese New Year, bank holidays). In practice: observe how the client writes and mirror their level of formality and length; ask about preferences rather than assuming; avoid stereotypes, because individuals differ; and when something is unclear, assume good intent and ask.",
      },
      {
        id: "a-va-timezones",
        title: "Time zones and converting meeting times",
        explain:
          "Convert every time through UTC (Coordinated Universal Time), the world's reference. Lagos and the rest of West Africa Time (WAT) are UTC+1 all year, because Nigeria does not change its clocks. Many countries do, for daylight saving time (DST), and that is where VAs make mistakes. The UK is GMT (UTC+0) in winter and BST (UTC+1) from the last Sunday in March to the last Sunday in October, so London equals Lagos time in summer and is one hour behind in winter. US Eastern time (New York, Toronto) is EST (UTC−5) in winter and EDT (UTC−4) from the second Sunday in March to the first Sunday in November; US Pacific (Los Angeles) is PST (UTC−8) or PDT (UTC−7); US Central (Houston, Chicago) is CST (UTC−6) or CDT (UTC−5). Dubai is UTC+4 and India UTC+5:30 all year. To convert: subtract the source's offset to get UTC, then add the target's offset. Use your calendar's secondary time zone, a world clock and timeanddate.com, and always write both times in invitations.",
        table: {
          caption: "Offsets from UTC (northern summer DST shown second).",
          headers: ["Place", "Winter", "Summer", "Difference from Lagos (WAT)"],
          rows: [
            ["Lagos, Accra*, Abuja", "UTC+1 (Accra UTC+0)", "No change", "Accra is always 1 hour behind Lagos"],
            ["London", "UTC+0 (GMT)", "UTC+1 (BST)", "1 hour behind in winter; same time in summer"],
            ["New York, Toronto", "UTC−5 (EST)", "UTC−4 (EDT)", "6 hours behind in winter; 5 in summer"],
            ["Houston, Chicago", "UTC−6 (CST)", "UTC−5 (CDT)", "7 hours behind in winter; 6 in summer"],
            ["Los Angeles", "UTC−8 (PST)", "UTC−7 (PDT)", "9 hours behind in winter; 8 in summer"],
            ["Dubai", "UTC+4", "No change", "3 hours ahead"],
            ["Mumbai", "UTC+5:30", "No change", "4 hours 30 minutes ahead"],
          ],
        },
        example: "A New York client says 10:00 on 10 June (EDT, UTC−4).\n10:00 − (−4) = 14:00 UTC\n14:00 UTC + 1 = 15:00 WAT in Lagos.",
      },
      {
        id: "a-va-tz-desk",
        title: "Time-zone desk",
        explain:
          "Convert each time. Check the date: it tells you whether daylight saving time applies. Type the answer as HH:MM in 24-hour time (15:00, 09:30).",
        deskLab: {
          app: "generic",
          title: "Meeting requests from around the world",
          task: "Convert each time into the city asked for. Type it as HH:MM in 24-hour time.",
          fields: [{ key: "time", label: "Converted time", type: "time" }],
          items: [
            { id: "t1", title: "New York, 10:00 on 10 June → Lagos?", meta: "June: New York is on EDT (UTC−4)", check: "return mins(val.time) === mins('15:00');", hint: "10:00 + 4 = 14:00 UTC; + 1 = Lagos.", why: "10:00 EDT = 14:00 UTC = 15:00 WAT." },
            { id: "t2", title: "New York, 10:00 on 10 January → Lagos?", meta: "January: New York is on EST (UTC−5)", check: "return mins(val.time) === mins('16:00');", hint: "Winter adds an hour of difference.", why: "10:00 EST = 15:00 UTC = 16:00 WAT." },
            { id: "t3", title: "London, 09:00 on 15 July → Lagos?", meta: "July: London is on BST (UTC+1)", check: "return mins(val.time) === mins('09:00');", hint: "In summer, London and Lagos have the same offset.", why: "BST and WAT are both UTC+1: same time." },
            { id: "t4", title: "London, 09:00 on 15 January → Lagos?", meta: "January: London is on GMT (UTC+0)", check: "return mins(val.time) === mins('10:00');", why: "09:00 GMT = 09:00 UTC = 10:00 WAT." },
            { id: "t5", title: "Dubai, 14:00 → Lagos?", meta: "Dubai is UTC+4 all year", check: "return mins(val.time) === mins('11:00');", hint: "Dubai is ahead of Lagos, so subtract.", why: "14:00 − 4 = 10:00 UTC; + 1 = 11:00 WAT." },
            { id: "t6", title: "Los Angeles, 08:00 on 3 March → Lagos?", meta: "3 March: Los Angeles is still on PST (UTC−8)", check: "return mins(val.time) === mins('17:00');", hint: "DST in the US starts on the second Sunday of March, after 3 March.", why: "08:00 PST = 16:00 UTC = 17:00 WAT." },
            { id: "t7", title: "Lagos, 16:00 on 12 August → Toronto?", meta: "August: Toronto is on EDT (UTC−4)", check: "return mins(val.time) === mins('11:00');", hint: "Lagos to UTC first (subtract 1), then to Toronto (subtract 4).", why: "16:00 WAT = 15:00 UTC = 11:00 EDT." },
            { id: "t8", title: "Lagos, 09:00 → Mumbai?", meta: "Mumbai is UTC+5:30 all year", check: "return mins(val.time) === mins('13:30');", hint: "Do not forget the half hour.", why: "09:00 WAT = 08:00 UTC = 13:30 IST." },
          ],
          solution: {
            t1: { time: "15:00" }, t2: { time: "16:00" }, t3: { time: "09:00" }, t4: { time: "10:00" },
            t5: { time: "11:00" }, t6: { time: "17:00" }, t7: { time: "11:00" }, t8: { time: "13:30" },
          },
          hint: "Two steps every time: source time minus its UTC offset gives UTC; UTC plus the target's offset gives the answer.",
          successMessage: "Eight conversions, including the daylight-saving traps. Write both times in every invitation and you will never miss a meeting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 3.9 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l19-difficult",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.9", "3.10"],
    title: "Difficult Conversations, Confidentiality and Boundaries",
    subtitle: "Bad news, pushback and upset clients; keeping confidences; and saying no professionally",
    estimatedMinutes: 45,
    intro:
      "Every VA eventually has to give bad news, push back on extra work or deal with an upset client. Handled well, these moments build more trust than any routine task.",

    atoms: [
      {
        id: "a-va-difficult",
        title: "Handling difficult conversations",
        explain:
          "Difficult conversations include giving bad news (a missed deadline, a mistake you made), pushing back on extra work (scope creep), chasing a late payment, and dealing with an angry client or customer. A simple structure works for all of them. Prepare: know the facts and have a solution or options ready. Raise it early: bad news gets worse with time. Stay calm and respectful; do not take anger personally. Listen first and acknowledge feelings (\"I understand this affects your launch\"). State the facts briefly, without excuses or blame. Own your part (\"I made a mistake in the booking\"). Offer solutions and agree the next steps. Then follow up in writing with what was agreed. Use \"I\" statements (\"I need the documents by Monday to meet the deadline\") rather than \"you\" accusations (\"You always send things late\").",
        mistake:
          "Hiding a problem and hoping to fix it before the client notices. If the fix fails, the client learns about the problem and the hiding at the same time.",
      },
      {
        id: "a-va-confidentiality",
        title: "Confidentiality",
        explain:
          "As a VA you will see private information: the client's emails, finances, contracts, customers, staff matters, health or family details, plans and passwords. Confidentiality means you keep all of it private, during and after the contract, unless the client permits disclosure or the law requires it. Many clients ask you to sign a non-disclosure agreement (NDA), a contract that makes this a legal duty. In practice: never discuss a client's business with friends, family or other clients; never post about client work on social media without permission; do not use real client work in your portfolio unless the client agrees (or you remove everything identifying); keep your screen private in public places; and store and share files only through the client's systems.",
        decision: {
          scenario: "Your client is a well-known musician. At a family party, your cousin asks, \"Is it true he's releasing a new album next month? You must know!\"",
          question: "What do you say?",
          options: [
            { id: "a", text: "\"I can't talk about my clients' work, but I'm enjoying the job.\"", why: "Right. A friendly, firm refusal that reveals nothing, not even a hint." },
            { id: "b", text: "\"I can't say... but keep your ears open next month!\"", whyWrong: "A hint is still a disclosure, and it could spread online." },
            { id: "c", text: "Tell your cousin, since family can be trusted", whyWrong: "Confidentiality covers family too; once shared, you cannot control where it goes." },
            { id: "d", text: "Deny that he is your client", whyWrong: "Lying is unnecessary; simply decline to discuss client work." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-boundaries",
        title: "Professional boundaries",
        explain:
          "Boundaries protect the quality of your work and the relationship. Agree them at the start and hold them politely. Working hours: when you work and how urgent matters are handled outside them. Response times: what the client can expect. Scope: what the package or contract covers, and that anything else is extra work quoted separately (scope creep is when work quietly grows beyond what was agreed). Channels: which channel is for what. Personal matters: you can help with personal tasks if agreed and paid, but you are not on call for everything. To say no professionally: thank them, state the boundary as a fact (not an apology), offer an alternative (a time you can do it, the extra rate, or someone else), and ask for their decision. Hold the boundary consistently: if you answer every 11pm message instantly, the client learns that 11pm is normal.",
        samples: [
          { label: "Apologetic and vague", tone: "bad", text: "So sorry, I don't really work weekends but I'll try my best to do it tonight I guess." },
          { label: "Thanks, boundary, alternative, decision", tone: "good", text: "Thank you for thinking of me. I don't work weekends, but I can start first thing Monday and have options ready by Tuesday noon your time. Shall I go ahead?" },
        ],
      },
      {
        id: "a-va-boundary-lab",
        title: "Holding a boundary: extra work at the weekend",
        explain:
          "Mrs Carter is a good client and you want to keep her. You also want to keep your weekends and be paid for extra work. Write a reply that does both.",
        writingLab: {
          task:
            "Write Zainab's Monday reply. Greet Linda and thank her. Explain that you do not work at weekends (as a fact, not an apology). Explain that travel planning is outside her business administration package but you can do it as extra work at $15 an hour, about 6 hours (so about $90). Offer the timeline: options by Tuesday at 12:00 noon Houston time. Say card details should not be sent by message (she books through her travel account). End with a question asking for her approval, then a sign-off. 90 to 200 words. Do not write \"sorry\" more than once.",
          brief: BOUNDARY_BRIEF,
          doc: BOUNDARY_DOC,
          tests: [
            { label: "Greeting and thanks", check: String.raw`return /^(Hi|Hello|Dear) (Linda|Mrs Carter),?\s*$/m.test(doc) && /thank/i.test(doc);`, fail: "Greet Linda and thank her for thinking of you." },
            { label: "The weekend boundary, stated as a fact", check: String.raw`return /(do not|don't) work (at |on )?weekends?/i.test(doc) && count(doc, /sorry|apologi/gi) <= 1;`, fail: "Say plainly that you do not work at weekends, without apologising repeatedly." },
            { label: "Outside the package, offered as paid extra work", check: String.raw`return /(outside|not (part of|included in|covered by))[^.]*package/i.test(doc) && /\$\s?15/.test(doc) && /6 hours/i.test(doc) && /\$\s?90/.test(doc);`, fail: "Explain it is outside the package and offer it as extra work: $15 an hour, about 6 hours, about $90." },
            { label: "A realistic timeline in her time zone", check: String.raw`return /tuesday/i.test(doc) && /(12:00|noon|12 pm)/i.test(doc) && /houston/i.test(doc);`, fail: "Give the timeline in her time: options by Tuesday at 12:00 noon Houston time." },
            { label: "Card details kept safe", check: String.raw`return /card/i.test(doc) && /(not|never)[^.]*(send|share)/i.test(doc);`, fail: "Say card numbers should not be sent by message; she books through her travel account." },
            { label: "Asks for her decision and signs off, 90 to 200 words", check: String.raw`return /\?/.test(paragraphs(doc).slice(-2).join(' ')) && /(regards|best|thanks)/i.test(doc) && words(doc) >= 90 && words(doc) <= 200;`, fail: "End with a question asking whether to go ahead, then a sign-off; keep it between 90 and 200 words." },
          ],
          solution: BOUNDARY_DONE,
          hint: "Thanks, boundary, alternative, decision: four short moves, in that order.",
          successMessage: "Warm, clear and firm: you keep the client, your weekend and your rate.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l20-practical",
    moduleId: "va-m3-communication",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["3.P"],
    title: "Practical: Five Client Situations",
    subtitle: "A complaint, a meeting request, a delayed delivery, a clarification request and a project update",
    estimatedMinutes: 60,
    intro:
      "These five situations cover most of the messages a VA writes in a week. Write each one as you would for a real client.",

    atoms: [
      {
        id: "a-va-m3-patterns",
        title: "Five patterns to reuse",
        explain:
          "Each situation has a pattern. Complaint: apologise sincerely, acknowledge the impact, offer the fix (with choices, amounts and timing), make the next step easy. Meeting request: thank them, offer two or three specific times with both time zones, the length and the platform, and say what happens next (the invitation). Delayed delivery: say it early, own it, give the reason briefly, a new specific time, and something useful in the meantime. Clarification request: say yes, then ask your questions together in a numbered list. Project update: what is done, what is waiting and why, whether you are on track, and what you will do next, ideally as three or four bullets.",
      },
      {
        id: "a-va-m3-practical",
        title: "Practical: write the five responses",
        explain:
          "Write all five responses for Halo Skincare. They become part of your portfolio as \"client correspondence samples\".",
        writingLab: {
          task:
            "Write the five responses under their headings. 1 Complaint: subject, \"Dear Mrs Uche,\", an apology, both options (replacement within 48 hours, refund within 5 working days) as bullets, no need to return the item. 2 Meeting request: subject, both times with WAT and GMT, 30 minutes, Google Meet, a calendar invitation next. 3 Delayed delivery: subject, an apology, the reason, Monday at 12:00, and something useful in the meantime. 4 Clarification: 3 to 6 numbered questions including one about the deadline. 5 Project update: subject, 120 of 150, the 30 waiting for photos by 14 June, the 20 June launch, as at least three bullets, and your next action. Each response 40 to 160 words.",
          brief: FIVE_BRIEF,
          doc: FIVE_DOC,
          tests: [
            { label: "Five responses, each 40 to 160 words", check: String.raw`const s = headings(2); const parts = [section('1.'), section('2.'), section('3.'), section('4.'), section('5.')]; return s.length === 5 && parts.every((p) => p && words(p) >= 40 && words(p) <= 160);`, fail: "Write all five responses under the five headings, each between 40 and 160 words." },
            { label: "Complaint: apology, both options as bullets, no return needed", check: String.raw`const p = section('1.') || ''; const b = bullets(p).join(' '); return /^Dear Mrs Uche,?\s*$/m.test(p) && /sorry|apologi/i.test(p) && /replacement/i.test(b) && /48 hours/i.test(b) && /refund/i.test(b) && /5 working days/i.test(b) && /(no need|don't need|do not need)[^.]*return/i.test(p);`, fail: "Greet Mrs Uche, apologise, give both options as bullets (48 hours; 5 working days), and say she need not return the bottle." },
            { label: "Meeting: two times in WAT and GMT, 30 minutes, Google Meet, invitation", check: String.raw`const p = section('2.') || ''; return /14:00/.test(p) && /13:00/.test(p) && /10:00/.test(p) && /09:00/.test(p) && /GMT/.test(p) && /WAT/.test(p) && /30/.test(p) && /meet/i.test(p) && /invit/i.test(p);`, fail: "Offer Tuesday 14:00 WAT (13:00 GMT) and Thursday 10:00 WAT (09:00 GMT), 30 minutes on Google Meet, and say you will send an invitation." },
            { label: "Delay: apology, reason, new time and an interim offer", check: String.raw`const p = section('3.') || ''; return /sorry|apologi/i.test(p) && /(export|platform)/i.test(p) && /monday/i.test(p) && /12:00|noon/i.test(p) && /(meantime|before then|today|in the meantime|headline)/i.test(p);`, fail: "Apologise, explain the export failure, give Monday at 12:00, and offer something useful before then." },
            { label: "Clarification: 3 to 6 numbered questions, one about timing", check: String.raw`const n = numbered(section('4.') || ''); return n.length >= 3 && n.length <= 6 && n.some((x) => /(when|deadline|by when)/i.test(x));`, fail: "Ask 3 to 6 numbered questions, including when she needs the list." },
            { label: "Update: progress, what is waiting, the launch and your next step", check: String.raw`const p = section('5.') || ''; return bullets(p).filter((x) => !/^subject:/i.test(x)).length >= 3 && /120/.test(p) && /150/.test(p) && /30/.test(p) && /14 June/i.test(p) && /20 June/i.test(p) && /(I will|I'll)/i.test(p);`, fail: "Use at least three bullets: 120 of 150 done, 30 waiting for photos due 14 June, launch on 20 June; then say what you will do next." },
            { label: "Subjects for the four emails", check: String.raw`return ['1.', '2.', '3.', '5.'].every((h) => words(field(section(h) || '', 'Subject') || '') >= 4);`, fail: "Give responses 1, 2, 3 and 5 a specific subject line of at least four words." },
          ],
          solution: FIVE_DONE,
          hint: "Before each one, name the pattern (complaint, meeting, delay, clarification, update) and follow its steps from the previous atom.",
          successMessage: "Five professional responses for five common situations. Save them as templates; you will use them for years.",
        },
      },
    ],

    task: {
      title: "Module 3 practical: your communication toolkit",
      intro: "Make this module part of how you work every day.",
      prompts: [
        "Save the five responses as email templates in your Gmail or Outlook account, with placeholders for names, dates and amounts.",
        "Add a second time zone to your Google or Outlook calendar for a country you would like clients from.",
        "Record a two-minute video introduction of yourself as a VA on Zoom or Google Meet; check your lighting, camera angle and sound, and redo it until you would be proud to send it.",
        "Write your own boundary message for weekend requests, ready to adapt.",
      ],
      closing: "Module 4 puts these skills to work on the core of the job: an executive's inbox, calendar, travel and meetings.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
