/**
 * CONTENT WRITING · MODULE 14 · PROFESSIONAL EMAILS AND WORKPLACE COMMUNICATION
 *
 * Curriculum 14.1 – 14.14 and the practical 14.P. Email etiquette and
 * structure, subject lines, greetings and sign-offs, requests, inquiries and
 * replies, follow-ups, complaints and difficult conversations, apologies and
 * appreciation, clients and colleagues, workplace etiquette, cross-cultural,
 * remote and chat communication; then a collection of workplace emails.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s14-workplace";

/* ── Lesson 51 lab: restructuring a bad email ──────────────────────────── */
const BAD_EMAIL = `**The draft you must fix** (from Bayo, a junior analyst, to his manager, Mrs Adaeze Nwosu):

> Subject: (none)
>
> good morning ma, hope u are good. so i was working on the sales report yesterday and i noticed that some of the figures from the Kano branch dont match what we have in the system, i think maybe they used the old template or something, anyway i have been trying to call them but nobody is picking. also the report is due on friday and i dont think i can finish it if i dont get the right numbers, so i was wondering if u could maybe help me reach the branch manager mr. sani or tell me what to do. thanks. bayo`;

const BAD_DOC = `# The email, rewritten

- Subject:

[The rewritten email: greeting, purpose, the details, a clear request with a deadline, sign-off.]
`;

const BAD_DONE = `# The email, rewritten

- Subject: Kano sales figures do not match: your help needed by Wednesday

Good morning Mrs Nwosu,

I need your help to get the correct Kano branch figures so that I can finish the sales report by Friday.

While preparing the report yesterday, I found that the Kano figures do not match those in our system. I think the branch may have used the old template. I have called the branch several times but have not been able to reach anyone.

Could you please put me in touch with Mr Sani, the branch manager, by Wednesday? With the corrected figures by then, I can still submit the report on Friday.

Thank you,
Bayo Adeleke
Sales Analyst
`;

/* ── Lesson 52 lab: answering an inquiry and following up ──────────────── */
const INQ_BRIEF = `You are **Kemi Ade**, Events Coordinator at **Lakeview Hotel, Abuja**. You received this inquiry yesterday:

> "Good afternoon. I am planning a one-day staff training for 40 people in May. Do you have a meeting room available, and what would it cost? We will need a projector and lunch. Regards, Chinedu Okafor, HR Lead, Bluepeak Insurance."

Facts:
- The Cedar Room seats up to 50 people classroom-style; available on 13, 14 and 21 May.
- Day package: ₦18,000 per person, including the room, projector and screen, Wi-Fi, two tea breaks and a buffet lunch.
- A 20% deposit confirms the booking; the rest is due 7 days before the event.
- You can hold a date for 5 days without a deposit.`;

const INQ_DOC = `# Inquiry reply and follow-up

## Reply
- Subject:

[Your reply to Mr Okafor.]

## Follow-up (sent 4 days later, no reply received)
- Subject:

[A short, polite follow-up.]
`;

const INQ_DONE = `# Inquiry reply and follow-up

## Reply
- Subject: Meeting room for 40 in May: Cedar Room availability and price

Dear Mr Okafor,

Thank you for your inquiry about a one-day staff training at Lakeview Hotel. We would be delighted to host your team.

Our Cedar Room seats up to 50 people classroom-style and is available on 13, 14 and 21 May. Our day package costs ₦18,000 per person and includes:

- The room, a projector and screen, and Wi-Fi
- Two tea breaks
- A buffet lunch

For 40 people, the total would be ₦720,000. A 20% deposit confirms the booking, and the balance is due 7 days before the event.

I can hold one of these dates for you for 5 days without a deposit. Please let me know which date you prefer.

Kind regards,
Kemi Ade
Events Coordinator, Lakeview Hotel

## Follow-up (sent 4 days later, no reply received)
- Subject: Your date hold ends tomorrow: Cedar Room in May

Dear Mr Okafor,

I am following up on my email of Monday about your training day in May. The dates we discussed are still free, and I can hold one for you until tomorrow.

Would you like me to reserve 13, 14 or 21 May? If your plans have changed, a short reply to let me know would be very helpful.

Kind regards,
Kemi Ade
Events Coordinator, Lakeview Hotel
`;

/* ── Lesson 53 lab: replying to a complaint ────────────────────────────── */
const COMP_BRIEF = `You are **Kemi Ade** again. Mr Okafor's training went ahead at Lakeview Hotel on 14 May. Today he wrote:

> "I am very disappointed. Lunch was served 50 minutes late, which pushed our whole programme back, and the projector failed twice. My team lost an hour of training time. This is not what we paid for."

What you found out:
- A kitchen staff shortage delayed lunch; it was the hotel's fault.
- The projector's cable was faulty; a technician replaced it, but only after the second failure.
- The hotel manager has approved a 25% refund of the package (₦180,000) and a free half-day room hire for a future booking.
- From now on, events staff test all equipment the evening before every event, and lunch is confirmed with the kitchen 2 hours before service.`;

const COMP_DOC = `# Reply to a complaint

- Subject:

[Your reply to Mr Okafor.]
`;

const COMP_DONE = `# Reply to a complaint

- Subject: Our apology for your training day on 14 May

Dear Mr Okafor,

Thank you for telling us about your training day. You are right to be disappointed, and I am sorry. Your team lost valuable training time because of our mistakes.

Lunch was served late because we were short of kitchen staff, and the projector failed because of a faulty cable that we should have found before your event. Neither problem should have affected you.

To make up for this, we will refund 25% of your package, ₦180,000, within 5 working days, and we would like to offer you a free half-day room hire for a future event.

We have also changed how we prepare. Our events team now tests all equipment the evening before every event, and we confirm lunch with the kitchen 2 hours before service.

I hope you will give us the chance to host your team again. Please call me on 0809 444 2210 if you would like to discuss anything.

Yours sincerely,
Kemi Ade
Events Coordinator, Lakeview Hotel
`;

/* ── Lesson 54 lab: the practical ──────────────────────────────────────── */
const SET_BRIEF = `You work as **Project Officer** at **Brightpath NGO**, Kaduna. Your name is **Zainab Musa**. Write five emails for situations from your week.

1. **Request:** ask Mr Danladi Garba in Finance for the Q1 spending figures for the girls' education project; you need them by Thursday 10 April for the donor report.
2. **Follow-up:** you sent a partnership request to Mrs Eunice Okon, Head of Programmes at Hope Schools Network, on 1 April and have had no reply.
3. **Apology:** you sent the wrong version of the workshop schedule to 12 volunteers yesterday; the correct workshop date is Saturday 19 April, not 12 April. Write to the volunteers.
4. **Appreciation:** thank your colleague Ibrahim Sule, who stayed late on Friday to fix the database so the donor report data could be exported.
5. **Declining a request:** your manager, Dr Fatima Bello, asked you to also run the 15 April community meeting; you cannot, because you are leading the donor visit that day. Decline and suggest an alternative (a colleague, Grace Audu, ran the last meeting).`;

const SET_DOC = `# Workplace emails

## Email 1: Request
- Subject:

## Email 2: Follow-up
- Subject:

## Email 3: Apology
- Subject:

## Email 4: Appreciation
- Subject:

## Email 5: Declining a request
- Subject:
`;

const SET_DONE = `# Workplace emails

## Email 1: Request
- Subject: Q1 spending figures for the girls' education project, by Thursday

Dear Mr Garba,

Could you please send me the Q1 spending figures for the girls' education project by Thursday 10 April? I need them to complete the donor report, which is due the following week.

A spreadsheet export from the finance system would be ideal. Please let me know if anything is unclear.

Thank you,
Zainab Musa
Project Officer, Brightpath NGO

## Email 2: Follow-up
- Subject: Following up: partnership with Hope Schools Network

Dear Mrs Okon,

I am following up on my email of 1 April about a possible partnership between Brightpath and Hope Schools Network on girls' education in Kaduna.

I know how busy this term is. Would a 20-minute call next week be convenient to discuss the idea? I am happy to work around your schedule.

Kind regards,
Zainab Musa
Project Officer, Brightpath NGO

## Email 3: Apology
- Subject: Correction: the workshop is on Saturday 19 April

Dear volunteers,

I am sorry: yesterday I sent you the wrong version of the workshop schedule. The workshop is on Saturday 19 April, not 12 April. The time and venue are unchanged.

I have attached the correct schedule. Please update your calendars, and accept my apologies for any confusion.

Thank you,
Zainab Musa
Project Officer, Brightpath NGO

## Email 4: Appreciation
- Subject: Thank you for fixing the database on Friday

Hi Ibrahim,

Thank you for staying late on Friday to fix the database. Because of your work, we could export the data for the donor report on time, and the team did not lose a day.

I really appreciate it, and I have told Dr Bello how much you helped.

Best regards,
Zainab

## Email 5: Declining a request
- Subject: Community meeting on 15 April

Dear Dr Bello,

Thank you for asking me to run the community meeting on 15 April. Unfortunately, I cannot, because I will be leading the donor visit that day.

Grace Audu ran the last community meeting very well. Would you like me to ask her if she is available? I can also brief her beforehand and share my notes.

Kind regards,
Zainab Musa
Project Officer, Brightpath NGO
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 14.1 – 14.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l51-email-etiquette",
    moduleId: "cw-m14-workplace",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3", "14.4"],
    title: "Email Etiquette and Structure",
    subtitle: "Professional etiquette, structure, subject lines, greetings and sign-offs",
    estimatedMinutes: 40,
    intro:
      "Most professionals write dozens of emails a day, and colleagues judge them by those emails. This lesson covers the conventions that make an email easy to read and act on.",

    atoms: [
      {
        id: "a-cw-email-etiquette",
        title: "Professional email etiquette",
        explain:
          "Email etiquette is the set of conventions that make email respectful and efficient. Use a professional address (firstname.lastname@, not sweetboy@). Write in full sentences with standard capitalisation and punctuation; no text-speak (\"u\", \"pls\"), and few or no emojis with people you do not know well. Keep a polite, neutral tone, because tone is easily misread in writing: read your email as the recipient before sending, and never send while angry. Use To for people who must act, Cc for people who only need to know, and Bcc rarely (for large external lists, to protect addresses). Use Reply All only when everyone needs your reply. Reply within one working day, even if only to say when you will answer fully. Check names, attachments and recipients before you press send, and remember that email is permanent and can be forwarded.",
      },
      {
        id: "a-cw-email-structure",
        title: "Structuring effective emails",
        explain:
          "A clear work email follows a simple structure, sometimes called BLUF (bottom line up front). Greeting. Purpose and request in the first one or two sentences, so the reader knows immediately what you need. Context and details in short paragraphs or bullets: the background, the facts, options, anything they need to act. The specific request again, with a deadline and the reason for it (\"by Wednesday, so I can submit the report on Friday\"). Sign-off and signature. Keep emails short enough to read without scrolling on a phone where possible; if an email needs many paragraphs, consider a call or a document attached with a short summary. One topic per email, so it can be actioned and found later.",
        samples: [
          { label: "Request buried at the end", tone: "bad", text: "so i was working on the sales report yesterday and i noticed that some of the figures… anyway… so i was wondering if u could maybe help me reach the branch manager" },
          { label: "Bottom line up front", tone: "good", text: "I need your help to get the correct Kano branch figures so I can finish the sales report by Friday. Could you put me in touch with Mr Sani by Wednesday?" },
        ],
      },
      {
        id: "a-cw-email-subjects",
        title: "Writing appropriate subject lines",
        explain:
          "In a busy inbox, the subject line decides when (and whether) an email is read, and later how it is found. A good work subject line is specific, summarises the content or the request, and includes any deadline: \"Kano sales figures do not match: your help needed by Wednesday\" rather than \"Hello\", \"Urgent!!!\", \"Report\" or no subject at all. Useful prefixes, used sparingly and only if your workplace uses them: \"Action required:\", \"For information:\", \"Decision needed:\". Update the subject when a thread changes topic, and never leave it blank. Keep it under about 60 characters so it shows fully on most screens.",
        decision: {
          scenario: "You need your manager to approve a ₦250,000 purchase of laptops by Thursday.",
          question: "Which subject line is best?",
          options: [
            { id: "a", text: "Approval needed by Thursday: ₦250,000 for two laptops", why: "Right. Specific, states the action, the deadline and the amount." },
            { id: "b", text: "URGENT!!!", whyWrong: "Says nothing about the content and looks like panic." },
            { id: "c", text: "Hello", whyWrong: "Tells the reader nothing." },
            { id: "d", text: "Laptops", whyWrong: "Too vague: is it news, a question or a request?" },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-greetings",
        title: "Greetings, introductions and sign-offs",
        explain:
          "Match greetings to the relationship and the culture. Formal (first contact, senior or external people): \"Dear Mrs Nwosu,\" or \"Dear Dr Bello,\". Semi-formal (colleagues you know): \"Good morning Adaeze,\" or \"Hello Musa,\". Informal (close teammates, quick exchanges): \"Hi Ibrahim,\". In Nigerian workplaces, titles and greetings of respect (\"Good morning ma\", \"Sir\") are common, but in writing, \"Dear Mrs Nwosu\" or \"Good morning Mrs Nwosu\" is clearer and more professional. When writing to someone for the first time, introduce yourself in one line (\"I am Kemi Ade, Events Coordinator at Lakeview Hotel.\"). Sign off to match the greeting: \"Yours sincerely\" (formal), \"Kind regards\" or \"Best regards\" (most work email), \"Thanks\" or \"Thank you\" (when you have asked for something). Add a signature block: name, title, organisation and phone number.",
        writingLab: {
          task:
            "Rewrite Bayo's email so his manager can act on it in seconds. Subject: specific, with the deadline. A greeting with her title and name (\"Good morning Mrs Nwosu,\" or \"Dear Mrs Nwosu,\"). The purpose and request in the first paragraph. The details in a separate paragraph. A clear request with a deadline before Friday and the reason. A sign-off and a signature with Bayo's name and title. Standard capitals and punctuation, no text-speak (u, pls, ma), 80 to 170 words.",
          brief: BAD_EMAIL,
          doc: BAD_DOC,
          tests: [
            { label: "A specific subject line with a deadline", check: String.raw`const s = field(doc, 'Subject') || ''; return words(s) >= 5 && s.length <= 70 && /(kano|figures|report)/i.test(s) && /(monday|tuesday|wednesday|thursday|friday|by)/i.test(s);`, fail: "Summarise the issue and the deadline in the subject, in 70 characters or fewer." },
            { label: "Greeting with title and name", check: String.raw`return /^(Dear|Good morning|Good afternoon|Hello) Mrs Nwosu,?\s*$/m.test(doc);`, fail: "Greet her with title and surname, such as \"Good morning Mrs Nwosu,\"." },
            { label: "Purpose and request in the first paragraph", check: String.raw`const body = doc.split(/^(?:Dear|Good morning|Good afternoon|Hello) Mrs Nwosu,?\s*$/m)[1] || ''; const p = paragraphs(body)[0] || ''; return /(help|need|could you|please)/i.test(p) && /(report|figures)/i.test(p) && words(p) <= 45;`, fail: "Start the body with what you need and why, in one or two sentences." },
            { label: "Request with a deadline before Friday and the reason", check: String.raw`return /(could you|please|would you)[^.?]*(mr sani|branch manager)[^.?]*\b(monday|tuesday|wednesday|thursday)\b/i.test(doc) && /friday/i.test(doc);`, fail: "Ask her to connect you with Mr Sani by a day before Friday, and say it is so you can submit on Friday." },
            { label: "Sign-off with name and title", check: String.raw`return /(thank you|thanks|kind regards|best regards)[\s\S]*Bayo\s+\w+[\s\S]*(analyst)/i.test(doc);`, fail: "Close with a sign-off, then Bayo's full name and title." },
            { label: "Standard English, 80 to 170 words", check: String.raw`return !/\b(u|pls|plz|ma|dont|cant|im)\b/.test(doc) && !/^i\s/m.test(doc) && words(doc) >= 80 && words(doc) <= 170;`, fail: "Use capitals and full words (you, please, don't), and keep it to 80 to 170 words." },
          ],
          solution: BAD_DONE,
          hint: "Write the last line of Bayo's draft (what he needs) as your first sentence.",
          successMessage: "The same facts, now readable in ten seconds: what he needs, why, and by when.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 14.5 – 14.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l52-requests",
    moduleId: "cw-m14-workplace",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.5", "14.6", "14.7"],
    title: "Requests, Inquiries and Follow-ups",
    subtitle: "Asking for things, answering questions and chasing politely",
    estimatedMinutes: 40,
    intro:
      "Three of the most frequent workplace emails: asking for something, answering someone's question, and following up when nothing has happened.",

    atoms: [
      {
        id: "a-cw-requests",
        title: "Requesting information professionally",
        explain:
          "A request email gets results when it makes saying yes easy. State the request in the first sentence (\"Could you please send me the Q1 spending figures for the girls' education project?\"). Say why you need it and by when, because a reason and a deadline get priority (\"by Thursday 10 April, for the donor report\"). Be precise about what you need and in what form (\"a spreadsheet export\"). Make it easy: attach what they need, offer to help, and keep it short. Use polite modal forms (could you, would you be able to, I would be grateful if) rather than commands, but stay direct: politeness does not mean vagueness. Thank them in advance, and follow up if the deadline approaches.",
      },
      {
        id: "a-cw-inquiries",
        title: "Making inquiries and responding to inquiries",
        explain:
          "An inquiry asks for information before a decision: prices, availability, terms. When making one, say who you are, what you need, the key details (numbers, dates, requirements) and when you need an answer. When responding to one, remember that a fast, complete, helpful answer often wins the business. Thank them; answer every question they asked, in the order they asked it; give the specific details (availability, what is included, the total price for their numbers, payment terms); anticipate the next question; make the next step easy (\"I can hold a date for you for 5 days\"); and close warmly. Calculate totals for the client rather than making them do it, and check the figures.",
        decision: {
          scenario: "A client asks for the cost of hosting 40 people at ₦18,000 per person.",
          question: "What should your reply include?",
          options: [
            { id: "a", text: "The per-person price, what it includes, and the total (₦720,000), plus how to book", why: "Right. Answer completely and do the calculation for the client." },
            { id: "b", text: "Only \"₦18,000 per person\"", whyWrong: "Correct but incomplete: what is included, the total and the next step are missing." },
            { id: "c", text: "\"Please call us for pricing\"", whyWrong: "Makes the client do extra work; they may go elsewhere." },
            { id: "d", text: "A full price list for every service the hotel offers", whyWrong: "Buries the answer they asked for." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-follow-up-emails",
        title: "Writing follow-up emails",
        explain:
          "Follow-ups are necessary because busy people miss emails, not usually because they are ignoring you. Wait a sensible time (two to five working days, or just before a deadline). Reply in the same thread or refer to the earlier email by date (\"I am following up on my email of 1 April about…\") so they have the context. Restate the key point briefly, make the next step even easier (a specific question, two options, a short call), and give a reason to reply now if one is true (\"I can hold the date until tomorrow\"). Stay friendly: never \"As per my last email\" or \"I have not received a response\", which sound like blame. If there is still no reply after two or three follow-ups, try another channel or close the loop politely.",
        writingLab: {
          task:
            "Reply to Mr Okafor's inquiry, then write the follow-up you send four days later. Reply: a specific subject; \"Dear Mr Okafor,\"; thanks; the room, its capacity and the three available dates; the package price and what it includes (as bullets); the total for 40 people calculated for him; the deposit terms; the 5-day hold offer and a question that makes the next step easy; a sign-off with name and title. Follow-up: a subject, a reference to the earlier email, a reason to reply now, one easy question, and no blaming phrases; 40 to 100 words.",
          brief: INQ_BRIEF,
          doc: INQ_DOC,
          tests: [
            { label: "Reply: subject, greeting and thanks", check: String.raw`const r = section('Reply') || ''; return words(field(r, 'Subject') || '') >= 4 && /^Dear Mr Okafor,?\s*$/m.test(r) && /thank/i.test(r);`, fail: "Give the reply a specific subject, greet Mr Okafor formally and thank him." },
            { label: "Reply answers every question: room, dates, price and inclusions", check: String.raw`const r = section('Reply') || ''; return /cedar room/i.test(r) && /50/.test(r) && /13/.test(r) && /14/.test(r) && /21 May/i.test(r) && /₦\s?18,?000/.test(r) && bullets(r).length >= 2 && /projector/i.test(r) && /lunch/i.test(r);`, fail: "Answer both his questions: the room, capacity and dates, and the price with what it includes as bullets (projector and lunch)." },
            { label: "Reply gives the correct total and the terms", check: String.raw`const r = section('Reply') || ''; return /₦\s?720,?000/.test(r) && /20\s?%/.test(r) && /7 days/i.test(r);`, fail: "Calculate the total for 40 people (40 × ₦18,000), and give the 20% deposit and 7-day balance terms." },
            { label: "Reply offers the hold and makes the next step easy", check: String.raw`const r = section('Reply') || ''; return /5 days/i.test(r) && /(which date|let me know|would you like)/i.test(r) && /Kemi Ade/.test(r);`, fail: "Offer to hold a date for 5 days, ask which date he prefers, and sign with your name." },
            { label: "Follow-up: refers back, gives a reason, asks one easy question", check: String.raw`const f = section('Follow-up') || ''; const b = f.replace(/^- Subject:.*$/m, ''); return words(field(f, 'Subject') || '') >= 3 && /(following up|my email of|my email on|earlier email)/i.test(b) && /(tomorrow|until|hold)/i.test(b) && /\?/.test(b) && words(b) >= 40 && words(b) <= 100;`, fail: "Refer to your earlier email, give a true reason to reply now (the hold ends), ask one easy question, in 40 to 100 words." },
            { label: "Follow-up has no blaming phrases", check: String.raw`return !/(as per my (last|previous) email|i have not received|you have not replied|still waiting)/i.test(section('Follow-up') || '');`, fail: "Remove phrases that sound like blame, such as \"As per my last email\"." },
          ],
          solution: INQ_DONE,
          hint: "List his questions first (room? cost? projector? lunch?) and make sure your reply answers each.",
          successMessage: "A reply that answers everything and makes booking easy, and a follow-up that nudges without nagging.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 14.8 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l53-difficult",
    moduleId: "cw-m14-workplace",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.8", "14.9", "14.10"],
    title: "Complaints, Apologies and Appreciation",
    subtitle: "Difficult conversations in writing, saying sorry and thank you, clients and colleagues",
    estimatedMinutes: 40,
    intro:
      "The emails that test a professional most are the emotional ones: an angry client, a mistake to own, a colleague to thank. Each has a structure that works.",

    atoms: [
      {
        id: "a-cw-complaints",
        title: "Handling complaints and difficult conversations",
        explain:
          "When responding to a complaint, follow five steps. Acknowledge: thank them for telling you and show you understand the impact on them (\"Your team lost valuable training time\"). Apologise sincerely and take responsibility where it is yours, without \"but\", \"if\" or blaming staff (\"I am sorry\", not \"We apologise if you were inconvenienced\"). Explain briefly what happened, as context, not excuse. Put it right: say exactly what you will do, with amounts and dates. Prevent: say what you have changed so it does not happen again. Then invite them back and give a direct contact. For other difficult conversations (raising a problem with a colleague, giving bad news, saying no to a client), use the same principles: be calm, factual, specific, respectful and focused on solutions. If a conversation is very emotional or complex, follow the email with a call, or call first and confirm in writing.",
        table: {
          caption: "The five steps of a complaint response.",
          headers: ["Step", "Example"],
          rows: [
            ["Acknowledge", "You are right to be disappointed; your team lost training time."],
            ["Apologise", "I am sorry."],
            ["Explain (not excuse)", "We were short of kitchen staff, and a projector cable was faulty."],
            ["Put it right", "We will refund ₦180,000 within 5 working days."],
            ["Prevent", "We now test all equipment the evening before every event."],
          ],
        },
        mistake: "\"We apologise for any inconvenience this may have caused.\" It sounds automatic, doubts the harm (\"may have\") and accepts no responsibility. Name the specific problem and own it.",
      },
      {
        id: "a-cw-apology-thanks",
        title: "Writing apology and appreciation emails",
        explain:
          "A good apology is prompt, specific and short. Say what went wrong in one sentence, apologise once (\"I am sorry: I sent the wrong version of the schedule\"), give the correct information immediately, say what the reader should do, and, if relevant, what you will do differently. Do not over-apologise or explain at length; the reader wants the correction. Appreciation emails are often forgotten and highly valued. Be specific about what the person did and its effect (\"Because you fixed the database on Friday, we exported the donor data on time\"), send it soon after, and, where appropriate, copy or tell their manager. A specific thank-you builds relationships far more than a general \"thanks for your hard work\".",
        decision: {
          scenario: "You sent 12 volunteers the wrong workshop date yesterday.",
          question: "What is the best apology email opening?",
          options: [
            { id: "a", text: "\"I am sorry: yesterday I sent you the wrong version of the schedule. The workshop is on Saturday 19 April, not 12 April.\"", why: "Right. Short, owns the mistake, and gives the correction immediately." },
            { id: "b", text: "\"Due to an unforeseen technical issue with the document management process, an incorrect file may have been circulated.\"", whyWrong: "Vague, passive and hides responsibility; the correct date is missing." },
            { id: "c", text: "Three paragraphs explaining how the mistake happened before the correct date", whyWrong: "Readers need the correction first." },
            { id: "d", text: "Send nothing and hope they notice", whyWrong: "Volunteers will arrive on the wrong day." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-clients-colleagues",
        title: "Communicating with clients and colleagues",
        explain:
          "Clients and colleagues need different emphasis. With clients: be more formal at first, respond promptly, manage expectations (say what you will do and when, then do it), confirm agreements in writing after calls (\"As discussed, we will…\"), never criticise your own colleagues or company, and protect confidential information. With colleagues: be clear and collaborative, assume good intent, give context so they can help, credit their work, and keep disagreements professional and private. With your manager: lead with what they need to decide, flag problems early with a proposed solution, and keep updates brief. With people more senior than you, a little extra formality and complete information show respect for their time.",
        writingLab: {
          task:
            "Reply to Mr Okafor's complaint. Subject: specific. \"Dear Mr Okafor,\". Follow all five steps: acknowledge the impact; apologise sincerely (\"I am sorry\" or \"We are sorry\", with no \"if\" and no \"any inconvenience\"); explain both causes briefly; put it right with the refund amount and timing and the free half-day; say what has changed to prevent it. End by inviting him back with a direct phone number, then a formal sign-off with your name and title. 120 to 240 words. Do not blame individual staff.",
          brief: COMP_BRIEF,
          doc: COMP_DOC,
          tests: [
            { label: "Subject and formal greeting", check: String.raw`return words(field(doc, 'Subject') || '') >= 4 && /^Dear Mr Okafor,?\s*$/m.test(doc);`, fail: "Give a specific subject and greet him formally." },
            { label: "Acknowledges the impact and apologises sincerely", check: String.raw`return /(lost|disappoint|delay)/i.test(doc) && /\b(I am|I'm|we are|we're) (very |truly )?sorry\b/i.test(doc) && !/apologi[sz]e (for any|if)|any inconvenience|may have caused/i.test(doc);`, fail: "Name the impact and say \"I am sorry\", without \"if\" or \"any inconvenience\"." },
            { label: "Explains both causes briefly", check: String.raw`return /(staff|kitchen)/i.test(doc) && /(cable|projector)/i.test(doc);`, fail: "Briefly explain why lunch was late and why the projector failed." },
            { label: "Puts it right: ₦180,000 refund with timing, and the free half-day", check: String.raw`return /₦\s?180,?000/.test(doc) && /(within|by) [^.]*\b(days?|working days?|\d+ \w+)\b/i.test(doc) && /half[- ]day/i.test(doc);`, fail: "State the ₦180,000 refund, when it will arrive, and the free half-day room hire." },
            { label: "Says what has changed to prevent it", check: String.raw`return /(evening before|test(s|ing)? all equipment)/i.test(doc) && /2 hours/i.test(doc);`, fail: "Explain the two changes: equipment tested the evening before, lunch confirmed 2 hours ahead." },
            { label: "Invites him back, direct contact, formal close; no blame; 120–240 words", check: String.raw`return /\d{4}\s?\d{3}\s?\d{4}/.test(doc) && /(yours sincerely|kind regards)/i.test(doc) && /Kemi Ade/.test(doc) && !/(the chef|the technician) (was|is) (lazy|careless|to blame)|their fault/i.test(doc) && words(doc) >= 120 && words(doc) <= 240;`, fail: "Invite him back with a phone number, close formally with your name, avoid blaming staff, and keep to 120 to 240 words." },
          ],
          solution: COMP_DONE,
          hint: "Use the five-step table as your paragraph plan: one short paragraph per step.",
          successMessage: "An apology that owns the problem, makes it right and shows it will not happen again. That is how angry clients become loyal ones.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 14.11 – 14.14 · PRACTICAL 14.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l54-workplace",
    moduleId: "cw-m14-workplace",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.11", "14.12", "14.13", "14.14", "14.P"],
    title: "Workplace, Cross-Cultural and Remote Communication",
    subtitle: "Etiquette at work, across cultures, at a distance and in chat, and the practical",
    estimatedMinutes: 60,
    intro:
      "Work now happens across offices, cultures, time zones and chat apps. This lesson covers the habits that keep communication clear in all of them, then you write five emails for a working week.",

    atoms: [
      {
        id: "a-cw-workplace-etiquette",
        title: "Workplace communication etiquette",
        explain:
          "Beyond email, workplace communication has shared expectations. Respect hierarchy and channels: raise issues with the right person first, and do not copy senior people to pressure colleagues. Keep confidential matters (pay, performance, personal information, client data) out of group channels. Respond in reasonable time, and say when you will reply if you cannot yet. Disagree respectfully and in private where possible; praise in public. Be inclusive in group communication (do not leave people out of threads they need). Respect working hours: avoid non-urgent messages late at night or on weekends, or schedule them to send in the morning. Write as if your message could be forwarded, because it can.",
      },
      {
        id: "a-cw-cross-cultural",
        title: "Cross-cultural professional communication",
        explain:
          "Colleagues and clients from different cultures, regions and countries may expect different levels of formality, directness and relationship-building. Some cultures prefer direct, brief messages; others expect greetings, courtesy and context before business. Some value titles and seniority strongly; others use first names with everyone. In practice: start more formally and follow the other person's lead; avoid idioms, slang and local expressions that may not translate (\"the matter is on ground\", \"well done sir\", \"no shaking\"); write dates unambiguously (5 March 2026, not 05/03/26, which Americans read as 3 May); state time zones for meetings (2pm WAT); be careful with humour; respect religious and public holidays; and confirm understanding of important points in writing. When working in another language, keep sentences short and simple.",
        decision: {
          scenario: "You are scheduling a call with a client in London from Lagos.",
          question: "Which line is clearest?",
          options: [
            { id: "a", text: "\"Would Tuesday 8 April at 2pm WAT (2pm BST in London) suit you?\"", why: "Right. Unambiguous date, time and both time zones." },
            { id: "b", text: "\"Let's talk 08/04 at 2.\"", whyWrong: "The date format is ambiguous internationally, and 2am or 2pm and the time zone are unclear." },
            { id: "c", text: "\"We can talk anytime, no shaking.\"", whyWrong: "A local expression the client may not understand, and no time is proposed." },
            { id: "d", text: "\"Next week sometime.\"", whyWrong: "Too vague to schedule." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-remote",
        title: "Written communication in remote workplaces",
        explain:
          "In remote and hybrid teams, writing replaces many conversations, so it must carry more context. Write messages that stand alone: background, the question, options and a deadline in one message, so colleagues in other locations or time zones can act without a meeting. Use asynchronous communication (people reply when they can) for most things, and save calls for complex or sensitive matters. Document decisions in a shared place (a channel, a document, a project tool) so they are not lost in private chats. Give regular, brief status updates. Be explicit about tone, since there are no facial expressions: a short \"Thanks, this is great\" prevents worry. Set and respect availability (working hours, status, out-of-office messages).",
      },
      {
        id: "a-cw-chat-platforms",
        title: "Professional messaging on workplace platforms",
        explain:
          "Workplace chat tools (Slack, Microsoft Teams, Google Chat, and WhatsApp in many Nigerian organisations) are faster and more informal than email, but they are still work records. Good practice: use the right channel (team channel for team matters, direct message for one person, email for formal or external communication); keep threads on topic and reply in threads; write one complete message rather than several fragments (\"Hi\" … \"are you there\" … \"I need something\"); put the request first; use mentions (@name) only when someone must act; react with emoji to acknowledge without adding noise; avoid voice notes for anything people need to refer back to; and move sensitive or long discussions to a call or email. Decisions made in chat should be confirmed in a summary message or document.",
        samples: [
          { label: "Fragments", tone: "bad", text: "Hi\n\nAre you there?\n\nPlease I need something urgently" },
          { label: "One complete message", tone: "good", text: "Hi Grace, could you send me the volunteer list for Saturday's workshop by 3pm today? I need it to print name tags. Thanks!" },
        ],
      },
      {
        id: "a-cw-m14-practical",
        title: "Practical: a collection of workplace emails",
        explain:
          "Write the five emails from Zainab Musa's week at Brightpath NGO: a request, a follow-up, an apology, an appreciation and a polite refusal. Each needs a specific subject, a greeting suited to the relationship, the purpose first, the right details, a clear next step where one is needed, and a sign-off. These five situations cover most of the emails you will write in any job.",
        writingLab: {
          task:
            "Write the five emails, each under its heading with a \"- Subject:\" line, a greeting, a body and a sign-off with Zainab's name. Each email 40 to 130 words. Email 1 (request): the figures, why, and the Thursday 10 April deadline. Email 2 (follow-up): refers to 1 April, asks one easy question, no blaming phrases. Email 3 (apology): says sorry and gives the correct date (19 April) in the first two sentences. Email 4 (appreciation): names what Ibrahim did and its effect. Email 5 (declining): thanks Dr Bello, gives the reason, and suggests Grace Audu as an alternative.",
          brief: SET_BRIEF,
          doc: SET_DOC,
          tests: [
            { label: "Five emails, each with subject, greeting, sign-off and 40–130 words", check: String.raw`const e = sections('Email '); return e.length === 5 && e.every((x) => words(field(x.text, 'Subject') || '') >= 3 && /^(Dear|Hi|Hello|Good (morning|afternoon))\b.*,\s*$/m.test(x.text) && /zainab/i.test(x.text.split('\n').slice(-3).join(' ')) && words(x.text) >= 40 && words(x.text) <= 130);`, fail: "Each email needs a subject, a greeting line ending in a comma, a sign-off with Zainab's name, and 40 to 130 words." },
            { label: "Request: the figures, the reason and the deadline", check: String.raw`const e = sections('Email ')[0] || { text: '' }; return /Q1/i.test(e.text) && /donor report/i.test(e.text) && /10 April/i.test(e.text) && /(could you|would you|please)/i.test(e.text);`, fail: "Ask politely for the Q1 figures, say they are for the donor report, and give the 10 April deadline." },
            { label: "Follow-up: refers back, asks one question, no blame", check: String.raw`const e = sections('Email ')[1] || { text: '' }; return /1 April/i.test(e.text) && /\?/.test(e.text) && !/(as per my|have not (received|replied)|still waiting)/i.test(e.text);`, fail: "Refer to your email of 1 April, ask one easy question, and avoid blaming phrases." },
            { label: "Apology: sorry and the correct date up front", check: String.raw`const e = sections('Email ')[2] || { text: '' }; const body = e.text.split(/\n\s*\n/).slice(2).join(' '); const first = sentences(body).slice(0, 2).join(' '); return /sorry|apologi/i.test(first) && /19 April/.test(first);`, fail: "Say sorry and give the correct date, 19 April, in the first two sentences of the body." },
            { label: "Appreciation: what Ibrahim did and its effect", check: String.raw`const e = sections('Email ')[3] || { text: '' }; return /ibrahim/i.test(e.text) && /database/i.test(e.text) && /(because|so that|thanks to|meant)/i.test(e.text) && /thank/i.test(e.text);`, fail: "Thank Ibrahim specifically for fixing the database and say what it made possible." },
            { label: "Declining: thanks, reason and an alternative", check: String.raw`const e = sections('Email ')[4] || { text: '' }; return /thank/i.test(e.text) && /donor visit/i.test(e.text) && /grace audu/i.test(e.text) && /15 April/i.test(e.text);`, fail: "Thank Dr Bello, explain the donor visit on 15 April, and suggest Grace Audu." },
          ],
          solution: SET_DONE,
          hint: "Before each email, decide the relationship (manager, colleague, external, group) and choose the greeting and sign-off to match.",
          successMessage: "Five emails that cover most of working life: asking, chasing, apologising, thanking and saying no, all done professionally.",
        },
      },
    ],

    task: {
      title: "Module 14 practical: your own email templates",
      intro: "Build a personal set of tested emails you can adapt at work.",
      prompts: [
        "Look through your own sent emails or messages from the last month and pick five that could have been clearer. Rewrite each using the structure from this module.",
        "Write template emails for: a request, an inquiry reply, a follow-up, a complaint response, an apology, a thank-you and a polite refusal.",
        "Write a short guide for a team chat channel: what goes in the channel, what goes in email, response times and how decisions are recorded.",
        "Ask a colleague or friend to read two of your emails and tell you the request in one sentence. Fix any email where they get it wrong.",
        "Save the templates in a document you can reuse.",
      ],
      closing: "Module 15 moves to longer professional documents: reports, project proposals and technical documentation.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
