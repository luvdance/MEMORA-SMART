/**
 * VIRTUAL ASSISTANT · MODULE 7 · CUSTOMER SERVICE AND CLIENT RELATIONSHIPS
 *
 * Curriculum 7.1 – 7.10 and the practical 7.P. Service fundamentals and
 * expectations, inquiries, complaints and conflict, email, chat and phone
 * support, feedback and satisfaction, tickets and escalation, retention,
 * support systems, onboarding and follow-up; then a ten-inquiry support desk.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s7-customer";

/** NPS survey: 5 promoters, 2 detractors, 10 answers → NPS 30. */
const NPS = {
  A1: "Customer", B1: "Score (0–10)",
  A2: "Order 1101", B2: 10, A3: "Order 1102", B3: 9, A4: "Order 1103", B4: 8, A5: "Order 1104", B5: 7,
  A6: "Order 1105", B6: 10, A7: "Order 1106", B7: 6, A8: "Order 1107", B8: 9, A9: "Order 1108", B9: 3,
  A10: "Order 1109", B10: 10, A11: "Order 1110", B11: 8,
  D1: "Measure", E1: "Result", D2: "NPS",
};

const POLICY = `**Halo Skincare support policy** (online skincare shop, Abuja):

- **Delivery:** Abuja 1–2 working days; other states 3–5 working days. Tracking link sent by SMS when shipped.
- **Damaged or wrong items:** free replacement within 48 hours or a full refund within 5 working days; customer chooses; no need to return the item.
- **Returns:** unopened products within 14 days for a refund; opened products cannot be returned unless faulty.
- **Allergic reactions:** apologise, advise the customer to stop using the product and see a doctor or pharmacist, and **escalate to the manager the same day**. Never give medical advice.
- **Payment problems** (charged twice, payment failed but money deducted): **escalate to Finance (Tier 2)** with the order number and payment reference.
- **Threats of legal action, press or a social media campaign:** escalate to the manager immediately.
- **Discount codes:** VA can issue a 10% goodwill code for delays; anything larger needs the manager.`;

/* ── Lesson 43 lab: complaint reply ───────────────────────────────────── */
const COMPLAINT_BRIEF = `${POLICY}

**The complaint**, from Mrs Bisola Adeyemi (order HS-3307, delivered to Lagos):

> "This is the second time I'm writing. I ordered the vitamin C serum and the moisturiser 9 days ago. The serum arrived but the box contained a body lotion instead of the moisturiser. I paid for express delivery for nothing. Honestly, I'm very disappointed and thinking of never ordering again."

You checked: the warehouse packed the wrong item. Her first email, 3 days ago, was missed because it went to the spam folder.`;

const COMPLAINT_DOC = `# Reply to Mrs Adeyemi

- Subject:

[Your reply.]
`;

const COMPLAINT_DONE = `# Reply to Mrs Adeyemi

- Subject: Your order HS-3307: we're sorry, and here is how we'll fix it

Dear Mrs Adeyemi,

Thank you for writing again, and I am sorry you had to. Your first email went to our spam folder and was missed, and our warehouse packed a body lotion instead of your moisturiser. I understand how disappointing that is, especially after paying for express delivery.

We would like to put it right straight away. Please choose one of these:

- A free replacement moisturiser, shipped within 48 hours.
- A full refund for the moisturiser, paid within 5 working days.

There is no need to return the body lotion; please keep it with our apologies. We have also asked our warehouse team to double-check every order before packing.

Please reply with your choice, and I will arrange it today.

Kind regards,
Tobi Lawal
Customer Care, Halo Skincare
`;

/* ── Lesson 44 lab: live chat ──────────────────────────────────────────── */
const CHAT_BRIEF = `${POLICY}

You are on live chat for Halo Skincare. A customer, **Kemi**, opens a chat. Write your four replies, one under each heading, answering the customer message shown above each heading in the starter.`;

const CHAT_DOC = `# Live chat with Kemi

> **Kemi:** hi

## Reply 1

> **Kemi:** my order hasn't come and it's been 6 days. I'm in Port Harcourt

## Reply 2

> **Kemi:** HS-3412

## Reply 3

> *(You check: order HS-3412 shipped yesterday; it is with the courier and due tomorrow. The tracking link was sent by SMS.)*

## Reply 4

> **Kemi:** ok thanks
`;

const CHAT_DONE = `# Live chat with Kemi

> **Kemi:** hi

## Reply 1

Hi Kemi, thank you for contacting Halo Skincare. My name is Tobi. How can I help you today?

> **Kemi:** my order hasn't come and it's been 6 days. I'm in Port Harcourt

## Reply 2

I'm sorry it hasn't arrived yet, Kemi. I'll check it for you right away. Could you please send me your order number? It starts with HS.

> **Kemi:** HS-3412

## Reply 3

Thank you. I've checked order HS-3412: it shipped yesterday and is with the courier, due tomorrow. Deliveries outside Abuja take 3 to 5 working days, so it is within our usual time. We sent a tracking link to your phone by SMS, so you can follow it.

> *(You check: order HS-3412 shipped yesterday; it is with the courier and due tomorrow. The tracking link was sent by SMS.)*

## Reply 4

You're welcome, Kemi. Is there anything else I can help you with today? Have a lovely day.

> **Kemi:** ok thanks
`;

/* ── Lesson 47 lab: onboarding email and follow-up ─────────────────────── */
const ONBOARD_BRIEF = `You are **Amaka Obi**, VA at **FitHub Studio**, a gym in Lekki. A new member, **Mr Segun Bello**, joined today on the **3-month Gold plan**. Onboarding facts:

- His free **induction session** with a trainer is on **Saturday 9 May at 10:00**; he should bring trainers, a towel and water.
- The **FitHub app** (iPhone and Android) is where he books classes; his login is the email he signed up with.
- Opening hours: Monday to Friday 6:00–22:00, weekends 8:00–18:00.
- Questions: WhatsApp the front desk on **0809 123 4567**.

Write (1) the **welcome email** today and (2) a short **follow-up message** sent 7 days later, after his induction, checking in and inviting feedback.`;

const ONBOARD_DOC = `# Onboarding: Mr Segun Bello

## Welcome email
- Subject:

## Follow-up (day 7)
`;

const ONBOARD_DONE = `# Onboarding: Mr Segun Bello

## Welcome email
- Subject: Welcome to FitHub, Segun: your first steps

Dear Mr Bello,

Welcome to FitHub Studio, and thank you for joining us on the 3-month Gold plan. Here is everything you need to get started:

1. Your free induction: Saturday 9 May at 10:00 with one of our trainers. Please bring trainers, a towel and water.
2. Download the FitHub app (iPhone or Android) and log in with the email you signed up with, to book classes.
3. Opening hours: Monday to Friday 6:00–22:00, weekends 8:00–18:00.

If you have any questions, WhatsApp our front desk on 0809 123 4567. We look forward to seeing you on Saturday.

Kind regards,
Amaka Obi
Member Services, FitHub Studio

## Follow-up (day 7)

Hi Segun, it's Amaka from FitHub. I hope you enjoyed your induction on Saturday. How are you finding the gym and the app so far? If there is anything we could do better, or a class you would like us to add, just reply here. We're glad to have you.
`;

/* ── Lesson 48 lab: replies and an escalation note ────────────────────── */
const PRAC_BRIEF = `${POLICY}

From your support desk (previous atom), write:

1. **A reply to ticket T3** (Mr Chukwudi, order HS-3520): *"I opened the toner yesterday and I don't like the smell. I want a refund."*
2. **A reply to ticket T7** (Ms Ladi, order HS-3533, Abuja): *"Ordered 4 days ago, still nothing. This is ridiculous."* You checked: the courier lost the parcel; a new one shipped today and arrives tomorrow.
3. **An escalation note to Finance** for **ticket T5** (Mrs Ojo, order HS-3528): she was charged twice; payment references **PSK-88120** and **PSK-88121**, ₦24,500 each, on 3 May.`;

const PRAC_DOC = `# Support desk responses

## Reply to T3

## Reply to T7

## Escalation note: T5
`;

const PRAC_DONE = `# Support desk responses

## Reply to T3

Dear Mr Chukwudi,

Thank you for letting us know, and I'm sorry the toner isn't right for you. Our returns policy allows refunds only on unopened products returned within 14 days, unless a product is faulty, so I'm not able to refund an opened toner that is working as it should.

If you think the smell is not normal for this product, please send me a photo of the bottle and its batch number and I'll check it with our team. I can also suggest a fragrance-free toner from our range if you'd like.

Kind regards,
Tobi Lawal
Customer Care, Halo Skincare

## Reply to T7

Dear Ms Ladi,

I'm sorry your order hasn't arrived; you should have had it within 2 working days. Our courier lost the parcel, so we have sent a new one today, and it will arrive tomorrow. You'll receive the tracking link by SMS.

As an apology for the delay, here is a 10% discount code for your next order: SORRY10.

Kind regards,
Tobi Lawal
Customer Care, Halo Skincare

## Escalation note: T5

- Ticket: T5
- Customer: Mrs Ojo
- Order: HS-3528
- Issue: charged twice for one order
- Details: two payments of ₦24,500 on 3 May, references PSK-88120 and PSK-88121
- Done so far: confirmed only one order exists; told the customer Finance will review within 1 working day
- Needed from Finance: confirm the duplicate charge and refund one payment
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 7.1 – 7.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l42-service",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2"],
    title: "Customer Service Fundamentals and Expectations",
    subtitle: "What good service is, and what customers expect from every channel",
    estimatedMinutes: 35,
    intro:
      "When a VA answers a customer, the customer meets the business. Good service keeps customers; poor service loses them, often for good, and they tell others.",

    atoms: [
      {
        id: "a-va-service-basics",
        title: "Fundamentals of customer service",
        explain:
          "Customer service is helping customers before, during and after a purchase. It matters because keeping a customer costs far less than finding a new one, and one bad experience shared online can cost many sales. Five principles guide it. Speed: reply quickly, even if only to say you are on it. Accuracy: give correct information from the business's policies and knowledge base; never guess. Empathy: understand how the customer feels and say so. Ownership: treat the problem as yours until it is solved or handed over properly; never \"that's not my department\". Consistency: every customer gets the same policies and quality. Write and speak in the brand's voice (friendly, formal, playful) as the client defines it, and use the customer's name.",
      },
      {
        id: "a-va-expectations",
        title: "Understanding customer expectations",
        explain:
          "Customers expect to be heard, helped quickly and told the truth. Speed expectations depend on the channel: live chat within a minute or two, social media within an hour or so, email within a working day, phone answered within a few rings. They expect first-contact resolution: their problem solved in one conversation without repeating themselves. They expect honesty about what you can and cannot do, and clear next steps with times (\"you will receive the refund within 5 working days\"). Businesses often set these as an SLA (service level agreement): written targets such as \"first reply to email within 4 working hours\". Exceed expectations where you can (a proactive update before they ask), but never promise what the policy does not allow.",
      },
      {
        id: "a-va-sla-desk",
        title: "Setting response priorities",
        explain:
          "Halo Skincare's SLA: urgent issues (safety, payment errors, angry public posts) within 15 minutes; live chat within 2 minutes; social media comments and messages within 1 hour; email within 4 working hours. Choose the target for each new message.",
        deskLab: {
          app: "tickets",
          title: "Halo Skincare · New messages · 10:00",
          task: "Choose the response target for each message, from the SLA in the explanation.",
          fields: [{ key: "target", label: "First reply within", type: "select", options: ["15 minutes (urgent)", "2 minutes (live chat)", "1 hour (social media)", "4 working hours (email)"] }],
          items: [
            { id: "s1", title: "Email: \"Do you ship to Kaduna and how long does it take?\"", expect: { target: "4 working hours (email)" } },
            { id: "s2", title: "Live chat: \"Is the vitamin C serum suitable for oily skin?\"", expect: { target: "2 minutes (live chat)" } },
            { id: "s3", title: "Email: \"My face is swelling after using your night cream\"", expect: { target: "15 minutes (urgent)" }, hint: "Is this a safety issue?", why: "A possible allergic reaction is a safety issue, whatever the channel." },
            { id: "s4", title: "Instagram comment: \"Do you have the toner in a bigger size?\"", expect: { target: "1 hour (social media)" } },
            { id: "s5", title: "Email: \"I was charged twice for order HS-3528\"", expect: { target: "15 minutes (urgent)" }, why: "Payment errors are urgent under the SLA." },
            { id: "s6", title: "Public X post tagging the shop: \"Worst service ever, nobody replies!!\"", expect: { target: "15 minutes (urgent)" }, why: "An angry public post can spread fast: urgent." },
            { id: "s7", title: "Facebook message: \"What time do you close on Saturday?\"", expect: { target: "1 hour (social media)" } },
          ],
          solution: {
            s1: { target: "4 working hours (email)" }, s2: { target: "2 minutes (live chat)" }, s3: { target: "15 minutes (urgent)" }, s4: { target: "1 hour (social media)" },
            s5: { target: "15 minutes (urgent)" }, s6: { target: "15 minutes (urgent)" }, s7: { target: "1 hour (social media)" },
          },
          hint: "Check urgency first (safety, money, public anger); only then go by channel.",
          successMessage: "Urgent first, then by channel: that is how a support desk keeps every promise it makes.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 7.3 – 7.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l43-inquiries-complaints",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.3", "7.4"],
    title: "Inquiries, Complaints and Conflict",
    subtitle: "Answering questions completely, and turning complaints into loyalty",
    estimatedMinutes: 45,
    intro:
      "Inquiries are chances to sell; complaints are chances to keep a customer. Both are won or lost in a single reply.",

    atoms: [
      {
        id: "a-va-inquiries",
        title: "Handling customer inquiries",
        explain:
          "An inquiry is a question: about products, prices, delivery, availability or how to do something. Read it fully and answer every question asked, in order. Use accurate information from the business's knowledge base, product pages and policies; if you do not know, say you will find out and when you will reply, then do. Anticipate the next question (if they ask about delivery to Kaduna, give the time and the cost). Be specific: figures, dates and links rather than \"soon\" and \"affordable\". Finish with a helpful next step (\"You can order here…\" or \"Would you like me to reserve one?\"). Save good answers to frequent questions as templates (macros), and suggest new knowledge base articles when the same question keeps coming.",
      },
      {
        id: "a-va-complaints",
        title: "Responding to complaints: HEARD",
        explain:
          "Many support teams use the HEARD method for complaints. Hear: let the customer explain fully; read the whole message. Empathise: show you understand the impact (\"especially after paying for express delivery\"). Apologise sincerely, without excuses or blame (\"I am sorry\", not \"we apologise if you were inconvenienced\"). Resolve: fix it within the policy, offering choices where possible, with exact amounts and times, and make the next step easy. Diagnose: find out why it happened and prevent it (and tell the customer what you changed when it helps). If the customer had to contact you twice, acknowledge that too. Never argue, never blame colleagues or the customer, and never promise what the policy does not allow; escalate when the remedy is beyond your authority.",
        samples: [
          { label: "Defensive", tone: "bad", text: "We apologise for any inconvenience. Our warehouse is very busy at this time. Please return the item and we will look into it." },
          { label: "HEARD", tone: "good", text: "I'm sorry you had to write twice. Our warehouse packed the wrong item, and I understand how disappointing that is after paying for express delivery. Would you prefer a free replacement within 48 hours or a full refund within 5 working days? There's no need to return the lotion." },
        ],
      },
      {
        id: "a-va-conflict",
        title: "Resolving conflict and de-escalating",
        explain:
          "When a customer is angry, the goal is first to lower the temperature, then to solve the problem. Stay calm and do not take it personally: they are angry at the situation. Let them vent without interrupting. Acknowledge feelings and facts (\"You've waited a week and nobody replied; I'd be frustrated too\"). Focus on what you can do, not what you cannot. Offer choices, which give the customer back a sense of control. Use their name and a warm, respectful tone. Move a heated public conversation to a private channel (\"I've sent you a message so we can sort this out\"). If a customer becomes abusive or threatens legal action or a media campaign, stay polite, do not argue, and escalate under the policy.",
        decision: {
          scenario: "A customer writes in capitals: \"YOU PEOPLE ARE THIEVES. I PAID AND NOTHING CAME.\" You can see the order shipped yesterday and is due today.",
          question: "What is the best first reply?",
          options: [
            { id: "a", text: "\"I'm sorry for the worry, and I understand why you're upset. I've checked: your order shipped yesterday and is due today. Here is the tracking link.\"", why: "Right. Acknowledge the feeling, give the facts and a way to check them." },
            { id: "b", text: "\"Please do not use capital letters or call us thieves.\"", whyWrong: "Correcting the customer's tone escalates the conflict." },
            { id: "c", text: "\"It's not our fault; the courier is slow.\"", whyWrong: "Blame and defensiveness make customers angrier." },
            { id: "d", text: "Offer a 50% discount to calm them down", whyWrong: "Beyond policy, and the order is actually on time; facts solve this." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-complaint-lab",
        title: "Replying to a complaint",
        explain:
          "Reply to Mrs Adeyemi using HEARD and Halo Skincare's policy.",
        writingLab: {
          task:
            "Subject: specific, with the order number. \"Dear Mrs Adeyemi,\". Thank her and acknowledge that she had to write twice; apologise sincerely (no \"if\" and no \"any inconvenience\"); explain both causes briefly (spam folder, wrong item packed); empathise about the express delivery. Offer both policy options as bullets with their timings, say she need not return the lotion, say what you changed, and end with an easy next step and a signature. 110 to 230 words.",
          brief: COMPLAINT_BRIEF,
          doc: COMPLAINT_DOC,
          tests: [
            { label: "Subject with the order number", check: String.raw`const s = field(doc, 'Subject') || ''; return /HS-3307/.test(s) && words(s) >= 4;`, fail: "Put the order number HS-3307 in a specific subject line." },
            { label: "Acknowledges the second email and apologises sincerely", check: String.raw`return /^Dear Mrs Adeyemi,?\s*$/m.test(doc) && /(again|twice|second|first email)/i.test(doc) && /(I am sorry|I'm sorry|we are sorry|we're sorry)/i.test(doc) && !/(any inconvenience|if you were)/i.test(doc);`, fail: "Greet her, acknowledge she had to write again, and say \"I am sorry\" (no \"any inconvenience\")." },
            { label: "Explains both causes and empathises", check: String.raw`return /spam/i.test(doc) && /(packed|wrong item|body lotion)/i.test(doc) && /express/i.test(doc);`, fail: "Briefly explain both causes (spam folder, wrong item packed) and acknowledge the express delivery she paid for." },
            { label: "Both policy options as bullets", check: String.raw`const b = bullets(doc).join(' '); return /replacement/i.test(b) && /48 hours/i.test(b) && /refund/i.test(b) && /5 working days/i.test(b);`, fail: "Offer both options as bullets: replacement within 48 hours, or refund within 5 working days." },
            { label: "No return needed, and what has changed", check: String.raw`return /(no need|don't need|do not need|keep it)/i.test(doc) && /(double-check|check every|changed|asked our warehouse)/i.test(doc);`, fail: "Say she does not need to return the lotion, and what you have changed to prevent it." },
            { label: "Easy next step, signature, 110 to 230 words", check: String.raw`return /(reply|let me know)/i.test(doc) && /tobi/i.test(doc) && words(doc) >= 110 && words(doc) <= 230;`, fail: "Ask her to reply with her choice, sign with your name, and keep it between 110 and 230 words." },
          ],
          solution: COMPLAINT_DONE,
          hint: "Go through HEARD in order: one or two sentences for each letter.",
          successMessage: "A complaint turned into a customer who is likely to order again.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 7.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l44-channels",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.5"],
    title: "Support by Email, Chat and Phone",
    subtitle: "The etiquette and structure of each support channel",
    estimatedMinutes: 40,
    intro:
      "The same problem is handled differently by email, in a live chat and on the phone. A good support VA switches between them smoothly.",

    atoms: [
      {
        id: "a-va-email-support",
        title: "Email support",
        explain:
          "Email support replies should be complete enough to solve the issue in one reply. Use the customer's name, reference their order or ticket number, answer every question, give exact next steps with times, and close with a sign-off and your name. Templates (macros) save time, but always personalise them: the customer's name, their details, a sentence that shows you read their message. Keep paragraphs short and use bullets for options or steps. Check the order history and previous messages before replying, so the customer never has to repeat themselves.",
      },
      {
        id: "a-va-chat",
        title: "Live chat support",
        explain:
          "Live chat is fast and conversational. Greet the customer within a minute, with your name and an offer to help. Write short messages, one idea each, and send them as you go so the customer is not left waiting. Ask for the information you need early (the order number). Tell the customer what you are doing during a pause (\"Let me check that for you, one moment\"). Use plain, friendly language and the customer's name, but stay professional: no slang, and emojis only if the brand uses them. Before closing, confirm the problem is solved and ask whether there is anything else. Experienced agents handle two or three chats at once, but never at the expense of quality.",
      },
      {
        id: "a-va-phone-support",
        title: "Phone support",
        explain:
          "On the phone, answer with the business name and your name, and listen without interrupting. Confirm the caller's name and order number early, and repeat key details back. Explain what you are doing during silences, and ask permission before putting someone on hold (\"May I put you on hold for two minutes while I check?\"); return within that time. Summarise the solution and next steps before ending, and ask if there is anything else. Log the call in the ticket with what was agreed, and send a written confirmation by email or SMS for anything important (a refund, a new delivery date).",
        decision: {
          scenario: "During a phone call you need about three minutes to check a customer's refund in the payment system.",
          question: "What do you say?",
          options: [
            { id: "a", text: "\"May I put you on hold for about three minutes while I check your refund?\" Then come back within that time.", why: "Right. Ask permission, give a time, keep the promise." },
            { id: "b", text: "Put them on hold without a word", whyWrong: "Silent holds feel like being abandoned." },
            { id: "c", text: "Ask them to call back tomorrow", whyWrong: "Three minutes does not justify making the customer call again." },
            { id: "d", text: "Guess the refund status to save time", whyWrong: "Wrong information creates a second complaint." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-chat-lab",
        title: "Running a live chat",
        explain:
          "Write your four replies to Kemi. Each reply goes under its heading and answers the customer line shown just above it.",
        writingLab: {
          task:
            "Reply 1: greet Kemi by name, thank her, give your name and offer help. Reply 2: empathise and ask for the order number. Reply 3: thank her, give the order's status (shipped yesterday, due tomorrow), relate it to the 3–5 working days for other states, and mention the SMS tracking link. Reply 4: ask whether there is anything else and close warmly. Keep each reply under 60 words.",
          brief: CHAT_BRIEF,
          doc: CHAT_DOC,
          tests: [
            { label: "Reply 1: greeting, name and offer to help", check: String.raw`const r = section('Reply 1') || ''; const t = r.replace(/^>.*$/gm, ''); return /kemi/i.test(t) && /(my name is|I'm|I am|this is) \w+/i.test(t) && /help/i.test(t) && words(t) >= 8;`, fail: "Greet Kemi by name, introduce yourself and offer to help." },
            { label: "Reply 2: empathy and the order number", check: String.raw`const t = (section('Reply 2') || '').replace(/^>.*$/gm, ''); return /sorry/i.test(t) && /order number/i.test(t) && /\?/.test(t);`, fail: "Say you are sorry it has not arrived, and ask for her order number." },
            { label: "Reply 3: status, delivery time and tracking", check: String.raw`const t = (section('Reply 3') || '').replace(/^>.*$/gm, ''); return /HS-3412/.test(t) && /(shipped|dispatched)/i.test(t) && /tomorrow/i.test(t) && /(3 to 5|3–5|3-5)/.test(t) && /(SMS|text)/i.test(t);`, fail: "Give the status of HS-3412 (shipped, due tomorrow), relate it to 3–5 working days, and mention the SMS tracking link." },
            { label: "Reply 4: anything else, and a warm close", check: String.raw`const t = (section('Reply 4') || '').replace(/^>.*$/gm, ''); return /anything else/i.test(t) && words(t) >= 6;`, fail: "Ask whether there is anything else you can help with, and close warmly." },
            { label: "Short chat messages", check: String.raw`return ['Reply 1', 'Reply 2', 'Reply 3', 'Reply 4'].every((h) => { const t = (section(h) || '').replace(/^>.*$/gm, ''); return words(t) > 0 && words(t) <= 60; });`, fail: "Keep every chat reply under 60 words." },
          ],
          solution: CHAT_DONE,
          hint: "Chat is a conversation: one short purpose per message, the customer's name, and always tell them what you are doing.",
          successMessage: "A complete chat: greeted, helped and closed in four short messages.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l45-feedback",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.6"],
    title: "Customer Feedback and Satisfaction",
    subtitle: "Measuring satisfaction with CSAT and NPS, and acting on what customers say",
    estimatedMinutes: 40,
    intro:
      "What gets measured gets improved. Support teams measure satisfaction constantly, and VAs are often the ones who collect, calculate and report it.",

    atoms: [
      {
        id: "a-va-csat-nps",
        title: "CSAT, NPS and CES",
        explain:
          "Three common satisfaction measures. CSAT (customer satisfaction score) asks \"How satisfied were you with your experience?\" on a 1–5 scale, usually right after a ticket is solved; CSAT is the percentage of 4 and 5 answers. NPS (Net Promoter Score) asks \"How likely are you to recommend us to a friend?\" on a 0–10 scale. Scores of 9–10 are promoters, 7–8 passives and 0–6 detractors; NPS = % promoters − % detractors, so it runs from −100 to +100 (above 0 is good, above 50 excellent). CES (customer effort score) asks how easy it was to get the problem solved. Collect feedback with short surveys (built into help desks, or Google Forms), at the right moment, and ask one open question (\"What could we do better?\").",
      },
      {
        id: "a-va-nps-sheet",
        title: "Calculating NPS",
        explain:
          "Ten customers answered the NPS question. Calculate the score in E2: count the promoters (9 or more), subtract the detractors (6 or less), divide by the number of answers and multiply by 100. =(COUNTIF(B2:B11,\">=9\")-COUNTIF(B2:B11,\"<=6\"))/COUNT(B2:B11)*100",
        exercise: {
          data: { ...NPS },
          rows: 11,
          cols: 5,
          target: "E2",
          expected: 30,
          mustUseFormula: true,
          mustUse: "COUNTIF",
          lockedCells: Object.keys(NPS),
          task: "In E2, calculate the NPS from the scores in B2:B11.",
          hint: "Promoters minus detractors, divided by the number of answers, times 100.",
          successMessage: "NPS 30: five promoters, two detractors, ten answers. Positive, with room to grow.",
        },
      },
      {
        id: "a-va-act-feedback",
        title: "Acting on feedback and replying to reviews",
        explain:
          "Feedback is useful only if someone acts on it. Read every comment, tag it by theme (delivery, packaging, product, staff), and report the themes monthly with counts and examples, so the client can fix the causes. Close the loop: contact unhappy customers personally to put things right, and tell customers when their suggestion was implemented. Reply to public reviews too. Thank positive reviewers by name and mention something specific. For negative reviews, reply publicly, politely and briefly: thank them, apologise, show you take it seriously, and invite them to continue privately (with a contact), then solve it there. Never argue in public, never reveal private order details, and never post fake reviews.",
        decision: {
          scenario: "A one-star Google review says: \"Delivery took 9 days and nobody answered my emails.\"",
          question: "What is the best public reply?",
          options: [
            { id: "a", text: "\"Thank you for telling us, and we're sorry about the delay and the missed emails. That's not the service we aim for. Please message us on 0809 123 4567 so we can put it right.\"", why: "Right. Thanks, apology, seriousness and a private next step, all in public view." },
            { id: "b", text: "\"Our records show you entered the wrong address, so it was your fault.\"", whyWrong: "Arguing in public, and revealing order details, puts off every reader." },
            { id: "c", text: "Ignore it", whyWrong: "Future customers read unanswered complaints as \"they don't care\"." },
            { id: "d", text: "Ask friends to post five-star reviews to bury it", whyWrong: "Fake reviews are dishonest and break platform rules." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 7.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l46-tickets",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.7"],
    title: "Ticket Management and Escalation",
    subtitle: "Statuses, priorities, categories, and escalating the right issues the right way",
    estimatedMinutes: 45,
    intro:
      "A help desk turns every customer message into a ticket so nothing is lost. Managing tickets well, and knowing what to escalate, is the core of a support VA's job.",

    atoms: [
      {
        id: "a-va-ticket-basics",
        title: "Tickets: statuses, priorities and categories",
        explain:
          "A ticket is one customer issue, with its whole conversation, in a help desk. Statuses show where it stands: New (not yet looked at), Open (being worked on), Pending (waiting for the customer's reply), On-hold (waiting for someone inside the business or a third party), Solved (fixed; the customer can reopen it), and Closed. Priority is set by impact and urgency: Urgent (safety, money taken wrongly, threats, many customers affected), High (an order that will miss an important date, an angry repeat contact), Normal (most questions and problems), Low (general feedback, non-urgent requests). Categories or tags (Delivery, Returns, Product question, Payment, Account) let the business see trends. Assign every ticket an owner, update it with every action, and never leave a ticket without a next step.",
        table: {
          caption: "Ticket statuses.",
          headers: ["Status", "Means"],
          rows: [
            ["New", "Arrived, not yet looked at"],
            ["Open", "Someone is working on it"],
            ["Pending", "Waiting for the customer"],
            ["On-hold", "Waiting for a colleague or third party"],
            ["Solved", "Fixed; reopens if the customer replies"],
          ],
        },
      },
      {
        id: "a-va-escalation",
        title: "Escalation",
        explain:
          "Escalation passes a ticket to someone with more knowledge or authority. Support teams are often organised in tiers: Tier 1 (the VA or front-line agent) handles common questions with the knowledge base and macros; Tier 2 (specialists such as Finance or technical staff) handles payment errors, bugs and complex cases; managers handle exceptions to policy, serious complaints, safety issues and legal or media threats. Escalate when the policy says so, when the remedy is beyond your authority, or when you cannot solve it within the SLA, not to avoid a difficult customer. A good escalation note lets the next person act without re-reading everything: ticket and order numbers, customer name, the issue in one line, the details (amounts, references, dates), what you have already done and told the customer, and what you need from them. Tell the customer it has been escalated and when they will hear back, and keep following it until it is solved.",
      },
      {
        id: "a-va-tickets-desk",
        title: "Triage the help desk",
        explain:
          "Set the category, priority and action for each new Halo Skincare ticket, using the support policy.",
        deskLab: {
          app: "tickets",
          title: "Halo Skincare · Help desk · New tickets",
          task: "Choose the category, priority and action for each ticket.",
          brief: POLICY,
          briefTitle: "Support policy",
          fields: [
            { key: "category", label: "Category", type: "select", options: ["Delivery", "Damaged or wrong item", "Returns", "Payment", "Product safety", "Product question"] },
            { key: "priority", label: "Priority", type: "select", options: ["Urgent", "High", "Normal", "Low"] },
            { key: "action", label: "Action", type: "select", options: ["Resolve now (Tier 1)", "Escalate to Finance (Tier 2)", "Escalate to manager", "Ask the customer for details (Pending)"] },
          ],
          items: [
            { id: "k1", title: "\"Is your sunscreen safe for pregnant women?\"", expect: { category: "Product question", priority: "Normal", action: "Escalate to manager" }, hint: "Would answering this be medical advice?", why: "This is close to medical advice: share the ingredient list and advise checking with a doctor, and pass it to the manager rather than answering yourself." },
            { id: "k2", title: "\"My parcel arrived crushed and the cream leaked\" (order HS-3501)", expect: { category: "Damaged or wrong item", priority: "Normal", action: "Resolve now (Tier 1)" }, why: "Covered by policy: offer replacement or refund." },
            { id: "k3", title: "\"Money was deducted but the website says payment failed\" (order HS-3510)", expect: { category: "Payment", priority: "Urgent", action: "Escalate to Finance (Tier 2)" } },
            { id: "k4", title: "\"I have a rash on my neck after the new serum\"", expect: { category: "Product safety", priority: "Urgent", action: "Escalate to manager" }, why: "Allergic reactions: apologise, advise stopping and seeing a doctor or pharmacist, escalate the same day." },
            { id: "k5", title: "\"Where is my order?\" (no order number, no name on the account)", expect: { category: "Delivery", priority: "Normal", action: "Ask the customer for details (Pending)" } },
            { id: "k6", title: "\"I want to return an unopened toner I bought 5 days ago\"", expect: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" }, why: "Within the 14-day unopened policy: straightforward." },
            { id: "k7", title: "\"Third email! If I don't hear back today I'm posting about you everywhere and calling my lawyer\"", expect: { category: "Delivery", priority: "Urgent", action: "Escalate to manager" }, hint: "What does the policy say about threats?", why: "Legal and social media threats go to the manager immediately." },
            { id: "k8", title: "\"My order to Kano is on day 6; I need it for a wedding on Saturday\"", expect: { category: "Delivery", priority: "High", action: "Resolve now (Tier 1)" }, why: "Late for an important date: high priority; check tracking and update the customer." },
          ],
          solution: {
            k1: { category: "Product question", priority: "Normal", action: "Escalate to manager" },
            k2: { category: "Damaged or wrong item", priority: "Normal", action: "Resolve now (Tier 1)" },
            k3: { category: "Payment", priority: "Urgent", action: "Escalate to Finance (Tier 2)" },
            k4: { category: "Product safety", priority: "Urgent", action: "Escalate to manager" },
            k5: { category: "Delivery", priority: "Normal", action: "Ask the customer for details (Pending)" },
            k6: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" },
            k7: { category: "Delivery", priority: "Urgent", action: "Escalate to manager" },
            k8: { category: "Delivery", priority: "High", action: "Resolve now (Tier 1)" },
          },
          hint: "Read the policy's escalation rules first: safety and threats to the manager, payment errors to Finance. Everything else the policy covers, you resolve.",
          successMessage: "Eight tickets triaged: urgent ones escalated within minutes, routine ones solved at Tier 1.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 7.8 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l47-retention-systems",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.8", "7.9", "7.10"],
    title: "Retention, Support Systems and Onboarding",
    subtitle: "Keeping customers, working in Zendesk, Freshdesk and Intercom, and onboarding clients well",
    estimatedMinutes: 45,
    intro:
      "Solving problems is half of customer service. The other half is keeping customers happy before problems happen.",

    atoms: [
      {
        id: "a-va-retention",
        title: "Customer retention and relationship building",
        explain:
          "Retention means keeping customers coming back. Build relationships: remember customers (notes in the CRM or help desk about preferences and past issues), use their names, and personalise messages. Be proactive: tell customers about a delay before they ask, remind them before a subscription renews, check in after a big purchase. Follow up after a problem is solved (\"Did your replacement arrive safely?\"). Reward loyalty where the client allows it (thank-you notes, loyalty discounts, early access). Win back customers who have gone quiet with a friendly message and a reason to return. Track repeat purchases and churn (customers lost) so the client can see whether service is working.",
      },
      {
        id: "a-va-helpdesks",
        title: "Customer support systems: Zendesk, Freshdesk and Intercom",
        explain:
          "Help desks bring every channel (email, chat, social media, phone, WhatsApp) into one shared inbox of tickets, so a team can see who is handling what. Zendesk and Freshdesk are ticket-centred: tickets with statuses, priorities, tags and assignees; macros (saved replies and actions); SLA timers; automations and triggers (auto-reply, auto-assign); a knowledge base of help articles; and reports (response times, CSAT, ticket volumes). Intercom is conversation-centred: a chat widget on the website and app, chatbots that answer common questions, and messages to customers. They all integrate with CRMs and e-commerce platforms, so you can see a customer's orders beside their ticket. You will learn any one in a few days if you know the concepts: tickets, statuses, macros, SLAs, knowledge base and escalation.",
      },
      {
        id: "a-va-onboarding",
        title: "Professional client onboarding and follow-up",
        explain:
          "Onboarding is how a new customer or client is welcomed and set up for success. The first days decide whether they stay. A good onboarding includes: a welcome message the same day, warm and personal; the first steps they need, as a short numbered list (log in, book the first session, what to bring); key information (hours, contacts, how to get help); and a named person to contact. Some businesses add a kick-off call or an induction. Then follow up: a check-in after the first week (\"How are you finding it so far?\") and again after a month, inviting feedback and solving small problems before they grow. Keep a checklist so every new customer gets the same quality.",
      },
      {
        id: "a-va-onboard-lab",
        title: "Welcoming a new member",
        explain:
          "Write FitHub's welcome email for Mr Bello and the day-7 follow-up.",
        writingLab: {
          task:
            "Welcome email: a subject; \"Dear Mr Bello,\"; welcome and thank him, naming the Gold plan; the first steps as a numbered list of at least 3 (the induction with day, date, time and what to bring; the app and how to log in; opening hours); the WhatsApp number for questions; a sign-off with your name. 90 to 200 words. Follow-up: 30 to 80 words, mentioning his induction, asking how he is finding the gym or app (a question), and inviting feedback.",
          brief: ONBOARD_BRIEF,
          doc: ONBOARD_DOC,
          tests: [
            { label: "Welcome: subject, greeting, thanks and plan", check: String.raw`const w = section('Welcome') || ''; return words(field(w, 'Subject') || '') >= 3 && /^Dear Mr Bello,?\s*$/m.test(w) && /welcome/i.test(w) && /thank/i.test(w) && /gold/i.test(w);`, fail: "Add a subject, greet Mr Bello, welcome and thank him, and name the Gold plan." },
            { label: "Welcome: at least three numbered first steps", check: String.raw`const n = numbered(section('Welcome') || ''); const t = n.join(' '); return n.length >= 3 && /9 May/i.test(t) && /10:00/.test(t) && /(towel|trainers|water)/i.test(t) && /app/i.test(t) && /(6:00|22:00)/.test(t);`, fail: "Number the first steps: the induction (Saturday 9 May, 10:00, what to bring), the app and login, and opening hours." },
            { label: "Welcome: help contact and sign-off, 90 to 200 words", check: String.raw`const w = section('Welcome') || ''; return /0809 ?123 ?4567/.test(w) && /amaka/i.test(w) && words(w) >= 90 && words(w) <= 200;`, fail: "Give the WhatsApp number, sign with your name, and keep it between 90 and 200 words." },
            { label: "Follow-up: induction, a question and feedback, 30 to 80 words", check: String.raw`const f = section('Follow-up') || ''; return /induction/i.test(f) && /\?/.test(f) && /(feedback|better|suggest|reply)/i.test(f) && words(f) >= 30 && words(f) <= 80;`, fail: "In 30 to 80 words, mention his induction, ask how he is finding it, and invite feedback." },
          ],
          solution: ONBOARD_DONE,
          hint: "Imagine you are the new member on day one: what do you need to know first, and in what order?",
          successMessage: "A welcome that makes a new member feel looked after, and a follow-up that catches problems early.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l48-practical",
    moduleId: "va-m7-customer",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["7.P"],
    title: "Practical: Run a Support Desk",
    subtitle: "Ten customer inquiries: classify, prioritise, resolve and escalate",
    estimatedMinutes: 75,
    intro:
      "It is Monday at Halo Skincare and the help desk has ten new tickets. Work them as a support VA would: triage all ten, then write the replies and the escalation note.",

    atoms: [
      {
        id: "a-va-m7-desk",
        title: "Triage ten inquiries",
        explain:
          "Classify each ticket, set its priority and decide the action, following the support policy.",
        deskLab: {
          app: "tickets",
          title: "Halo Skincare · Help desk · Monday 09:00",
          task: "For all ten tickets, choose the category, priority and action.",
          brief: POLICY,
          briefTitle: "Support policy",
          fields: [
            { key: "category", label: "Category", type: "select", options: ["Delivery", "Damaged or wrong item", "Returns", "Payment", "Product safety", "Product question"] },
            { key: "priority", label: "Priority", type: "select", options: ["Urgent", "High", "Normal", "Low"] },
            { key: "action", label: "Action", type: "select", options: ["Resolve now (Tier 1)", "Escalate to Finance (Tier 2)", "Escalate to manager", "Ask the customer for details (Pending)"] },
          ],
          items: [
            { id: "T1", title: "T1 · \"Do you deliver to Enugu? How long?\"", expect: { category: "Delivery", priority: "Normal", action: "Resolve now (Tier 1)" } },
            { id: "T2", title: "T2 · \"I received a moisturiser instead of the cleanser I ordered\" (HS-3518)", expect: { category: "Damaged or wrong item", priority: "Normal", action: "Resolve now (Tier 1)" } },
            { id: "T3", title: "T3 · \"I opened the toner yesterday and I don't like the smell. I want a refund\" (HS-3520)", expect: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" }, why: "The policy answers it (opened products are not refundable unless faulty); reply politely and offer to check if it may be faulty." },
            { id: "T4", title: "T4 · \"My eyes are burning after the eye cream\"", expect: { category: "Product safety", priority: "Urgent", action: "Escalate to manager" } },
            { id: "T5", title: "T5 · \"I was charged twice for one order\" (HS-3528)", expect: { category: "Payment", priority: "Urgent", action: "Escalate to Finance (Tier 2)" } },
            { id: "T6", title: "T6 · \"Which serum is best for dark spots?\"", expect: { category: "Product question", priority: "Normal", action: "Resolve now (Tier 1)" }, why: "A product question answered from the product information (not medical advice)." },
            { id: "T7", title: "T7 · \"Ordered 4 days ago in Abuja, still nothing. This is ridiculous\" (HS-3533)", expect: { category: "Delivery", priority: "High", action: "Resolve now (Tier 1)" }, why: "Late beyond the 2-day Abuja promise and the customer is upset: high priority; resolve with a resend and the 10% goodwill code." },
            { id: "T8", title: "T8 · \"Something is wrong with my order\" (no details)", expect: { priority: "Normal", action: "Ask the customer for details (Pending)" }, hint: "You cannot act yet: any category is fine until you know more.", why: "Without details you cannot act: ask for the order number and the problem." },
            { id: "T9", title: "T9 · \"I'm a journalist writing about skincare scams; I want a comment on your vitamin C serum\"", expect: { priority: "Urgent", action: "Escalate to manager" }, hint: "A journalist: what does the policy say about the press?", why: "Press inquiries go to the manager immediately; never comment yourself." },
            { id: "T10", title: "T10 · \"Can I return an unopened sunscreen bought 20 days ago?\"", expect: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" }, why: "Outside the 14-day window: reply kindly that it cannot be refunded." },
          ],
          solution: {
            T1: { category: "Delivery", priority: "Normal", action: "Resolve now (Tier 1)" },
            T2: { category: "Damaged or wrong item", priority: "Normal", action: "Resolve now (Tier 1)" },
            T3: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" },
            T4: { category: "Product safety", priority: "Urgent", action: "Escalate to manager" },
            T5: { category: "Payment", priority: "Urgent", action: "Escalate to Finance (Tier 2)" },
            T6: { category: "Product question", priority: "Normal", action: "Resolve now (Tier 1)" },
            T7: { category: "Delivery", priority: "High", action: "Resolve now (Tier 1)" },
            T8: { category: "Delivery", priority: "Normal", action: "Ask the customer for details (Pending)" },
            T9: { category: "Product question", priority: "Urgent", action: "Escalate to manager" },
            T10: { category: "Returns", priority: "Low", action: "Resolve now (Tier 1)" },
          },
          rules: [
            { label: "Only safety, payment and the press are urgent (three tickets)", check: "return count((r) => r.priority === 'Urgent') === 3;", fail: "Exactly three tickets are urgent under the policy: the safety issue, the payment error and the press inquiry." },
          ],
          hint: "Apply the escalation rules first (safety, payment, press), then set priorities, then resolve the rest from the policy.",
          successMessage: "Ten tickets triaged in minutes, and the three that could hurt the business escalated first.",
        },
      },
      {
        id: "a-va-m7-replies",
        title: "Write the replies and the escalation note",
        explain:
          "Write two customer replies and one escalation note from today's desk.",
        writingLab: {
          task:
            "Reply to T3: greet Mr Chukwudi, show empathy, explain politely that opened products cannot be refunded unless faulty (mention 14 days or unopened), and offer a helpful alternative (check if it is faulty, or suggest another product); sign off. Reply to T7: apologise, explain the lost parcel and that a new one shipped today and arrives tomorrow, and give a 10% discount code; sign off. Escalation note for T5: fields for Ticket, Customer, Order, Issue, Details (both references, the amount and date), Done so far, and Needed from Finance.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "T3: empathy and the policy, politely", check: String.raw`const r = section('Reply to T3') || ''; return /chukwudi/i.test(r) && /sorry/i.test(r) && /(unopened|14 days)/i.test(r) && /faulty/i.test(r);`, fail: "Greet Mr Chukwudi, say you are sorry, and explain the policy (unopened, 14 days, unless faulty)." },
            { label: "T3: a helpful alternative", check: String.raw`const r = section('Reply to T3') || ''; return /(photo|batch|check|suggest|recommend|alternative|fragrance-free)/i.test(r) && words(r) >= 50;`, fail: "Offer something helpful: to check whether it is faulty, or another product." },
            { label: "T7: apology, cause, new delivery and the goodwill code", check: String.raw`const r = section('Reply to T7') || ''; return /(sorry|apologi)/i.test(r) && /(lost|courier)/i.test(r) && /tomorrow/i.test(r) && /10\s?%/.test(r);`, fail: "Apologise, explain the courier lost it, say the new parcel arrives tomorrow, and give a 10% code." },
            { label: "T7 stays within your authority", check: String.raw`return !/(20|25|30|50)\s?%/.test(section('Reply to T7') || '');`, fail: "You can only give 10% under the policy; anything larger needs the manager." },
            { label: "Escalation note: every field", check: String.raw`const n = section('Escalation') || ''; return ['Ticket', 'Customer', 'Order', 'Issue', 'Details', 'Done so far', 'Needed from Finance'].every((f) => (field(n, f) || '').length >= 2);`, fail: "Fill every field of the note: Ticket, Customer, Order, Issue, Details, Done so far, Needed from Finance." },
            { label: "Escalation note: references, amount and date", check: String.raw`const d = field(section('Escalation') || '', 'Details') || ''; return /PSK-88120/.test(d) && /PSK-88121/.test(d) && /24,?500/.test(d) && /3 May/i.test(d);`, fail: "Give Finance both payment references, the amount and the date in Details." },
          ],
          solution: PRAC_DONE,
          hint: "For the escalation note, ask: could Finance act on this without opening the ticket?",
          successMessage: "A day at the support desk: tickets triaged, customers answered within policy, and a clean escalation.",
        },
      },
    ],

    task: {
      title: "Module 7 practical: your support toolkit",
      intro: "Build the tools a support VA uses every day.",
      prompts: [
        "Sign up for a free trial of Freshdesk or Zendesk, create five tickets yourself, and practise statuses, priorities, tags and a macro.",
        "Write five macros (saved replies) for Halo Skincare's most common questions: delivery times, returns, wrong item, tracking, and payment problems.",
        "Write a one-page escalation guide for a client: what goes to whom, and the template for an escalation note.",
        "Find three public one-star reviews of any business and write a professional reply to each.",
      ],
      closing: "Module 8 moves from customers to projects: tasks, deadlines, boards and progress reports.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
