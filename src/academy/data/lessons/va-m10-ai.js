/**
 * VIRTUAL ASSISTANT · MODULE 10 · AI AND AUTOMATION FOR VIRTUAL ASSISTANTS
 *
 * Curriculum 10.1 – 10.10 and the practical 10.P. Artificial intelligence
 * and generative AI, AI for research, prompts, AI-assisted writing and
 * summaries, task lists, spreadsheets and support with AI, workflow
 * automation with Zapier and Make, and ethical, private, fact-checked AI
 * use; then an AI-assisted work pack and an automated workflow.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s10-ai";

/** Orders by channel; WhatsApp total = 412,000. */
const ORDERS = {
  A1: "Order", B1: "Channel", C1: "Amount (₦)",
  A2: "1001", B2: "WhatsApp", C2: 85000,
  A3: "1002", B3: "Website", C3: 120000,
  A4: "1003", B4: "WhatsApp", C4: 47000,
  A5: "1004", B5: "Instagram", C5: 63000,
  A6: "1005", B6: "WhatsApp", C6: 210000,
  A7: "1006", B7: "Website", C7: 38000,
  A8: "1007", B8: "WhatsApp", C8: 70000,
  E1: "Channel", F1: "Total", E2: "WhatsApp", F2: "",
};

/* ── Lesson 63 lab: writing a prompt ──────────────────────────────────── */
const PROMPT_BRIEF = `Your client, **Halo Skincare**, has received this complaint, and you want an AI assistant to draft a reply that you will then edit and check:

> "My order HS-3307 had the wrong item. This is my second email. Very disappointed."

Facts the AI needs: the warehouse packed the wrong item; the first email went to spam; policy is a free replacement within 48 hours or a full refund within 5 working days, customer's choice, no need to return the item. Brand voice: warm, professional, British English, no emojis.

**Privacy rule:** the client allows AI tools for drafting, but you must not paste customers' names, emails, phone numbers or addresses into them.

Write the prompt you would give the AI. Use the five labelled parts below.`;

const PROMPT_DOC = `# Prompt: complaint reply draft

- Role:
- Task:
- Context:
- Format:
- Constraints:
`;

const PROMPT_DONE = `# Prompt: complaint reply draft

- Role: You are an experienced customer care writer for Halo Skincare, an online skincare shop.
- Task: Draft a reply email to a customer whose order HS-3307 contained the wrong item and who has had to write twice.
- Context: Our warehouse packed the wrong item, and the customer's first email went to our spam folder and was missed. Our policy offers a free replacement within 48 hours or a full refund within 5 working days, whichever the customer chooses, and they do not need to return the wrong item.
- Format: A subject line, then the email with a greeting using the placeholder [Customer name], the two options as bullet points, and a sign-off from the Customer Care team.
- Constraints: Warm and professional, British English, no emojis, 120 to 200 words. Apologise sincerely without saying "any inconvenience", and do not offer anything beyond the policy.
`;

/* ── Lesson 64 lab: correcting an AI meeting summary ──────────────────── */
const SUMMARY_BRIEF = `You recorded the **Greenline Solar** sales meeting on Zoom and asked an AI tool to summarise the transcript. **The summary contains errors.** Compare it with the transcript extract and write a corrected summary.

**Transcript extract (Tuesday 12 May, 10:00):**

> **Kunle (CEO):** So, May installations: we've done 14 so far, target is 20.
> **Yemi (Sales):** Lakeview Hotel wants the 20 kW extension. I'll send them the proposal by Friday the 15th.
> **Kunle:** Good. Ikenna, the inverter shipment?
> **Ikenna (Operations):** Delayed. The supplier now says 26 May, not 19 May. I'll find a local backup supplier by Thursday.
> **Kunle:** OK. And we are NOT raising prices this quarter. We review in July.
> **Yemi:** One more thing — the Abuja showroom opening moves to 6 June.
> **Kunle:** Fine. Next meeting, Tuesday 19 May, same time.

**The AI summary (with errors):**

> - Installations: 20 completed in May, meeting the target.
> - Yemi will send the Lakeview proposal (20 kW) by Friday 15 May.
> - Inverter shipment delayed to 19 May.
> - The team agreed to raise prices in July.
> - Abuja showroom opens 6 June.
> - Next meeting: Tuesday 19 May, 10:00.`;

const SUMMARY_DOC = `# Greenline Solar sales meeting, 12 May: summary

## Key points

## Actions

| Action | Owner | Due |
|---|---|---|

## Corrections to the AI summary
`;

const SUMMARY_DONE = `# Greenline Solar sales meeting, 12 May: summary

## Key points

- Installations: 14 completed so far in May, against a target of 20.
- The inverter shipment is delayed to 26 May (it was due on 19 May).
- Prices will not rise this quarter; they will be reviewed in July.
- The Abuja showroom opening moves to 6 June.
- Next meeting: Tuesday 19 May at 10:00.

## Actions

| Action | Owner | Due |
|---|---|---|
| Send the Lakeview Hotel 20 kW extension proposal | Yemi | Friday 15 May |
| Find a local backup inverter supplier | Ikenna | Thursday 14 May |

## Corrections to the AI summary

- Installations were 14, not 20; the target has not been met yet.
- The inverter shipment is now due on 26 May, not 19 May.
- Prices are not being raised; they will only be reviewed in July.
- The AI missed Ikenna's action to find a backup supplier by Thursday.
`;

/* ── Lesson 68 lab: the practical ─────────────────────────────────────── */
const PRAC_BRIEF = `Your client is **Dr Funke Alade**, a nutrition coach. This week, use AI tools to speed up four tasks, then check and edit everything yourself.

1. **Client email.** A prospective client, Mrs Ruth Okoye, asked: *"How much is your 12-week programme and what's included?"* Facts: ₦180,000, or 3 payments of ₦65,000; weekly 45-minute video calls, a personalised meal plan, WhatsApp support on weekdays; the next intake starts **1 June**; a free 20-minute discovery call can be booked at funkealade.example/call.
2. **Prompt.** Record the prompt you used for the email (Role, Task, Context, Format, Constraints).
3. **Research note.** Dr Alade wants three facts on why breakfast matters for children's learning for a blog post. The AI gave you three claims; you checked them. Write a short research note: each finding with its **source** and a **Verified** line (Yes, or No and why). One AI claim — "A 2023 Lagos University study proved children who skip breakfast score 40% lower" — **could not be found in any source**, so it must be marked as not verified and excluded.
4. **Automation.** Every time someone books a discovery call in Calendly, Dr Alade wants their details added to her Google Sheet of leads, a welcome email sent from Gmail, and a WhatsApp reminder for her only if the call is within 24 hours. Design the Zap.`;

const PRAC_DOC = `# AI-assisted work pack: Dr Funke Alade

## 1. Client email
- Subject:

## 2. Prompt used
- Role:
- Task:
- Context:
- Format:
- Constraints:

## 3. Research note

## 4. Automation
- Tool:
- Trigger:
- Action 1:
- Action 2:
- Filter:
- Action 3:
- Test:
`;

const PRAC_DONE = `# AI-assisted work pack: Dr Funke Alade

## 1. Client email
- Subject: Your 12-week nutrition programme: price and what's included

Dear Mrs Okoye,

Thank you for your interest in my 12-week programme. It costs ₦180,000, or 3 payments of ₦65,000, and includes:

- A 45-minute video call every week
- A personalised meal plan
- WhatsApp support on weekdays

The next intake starts on 1 June. If you would like to talk it through first, you can book a free 20-minute discovery call here: [Book your discovery call](https://funkealade.example/call).

Warm regards,
Dr Funke Alade

## 2. Prompt used
- Role: You are the assistant to a professional nutrition coach, writing warm, clear client emails.
- Task: Draft a reply to a prospective client asking about the price and contents of the 12-week programme.
- Context: The programme costs ₦180,000 or 3 payments of ₦65,000 and includes weekly 45-minute video calls, a personalised meal plan and weekday WhatsApp support. The next intake starts on 1 June, and a free 20-minute discovery call can be booked online.
- Format: A subject line and an email with the inclusions as bullet points and a link to book the discovery call.
- Constraints: Under 150 words, warm and professional, British English, no emojis, use [Client name] instead of the real name.

## 3. Research note

- Finding: Children who eat breakfast tend to concentrate better in morning lessons.
- Source: UK National Health Service (NHS) healthy eating guidance for children
- Verified: Yes

- Finding: School breakfast programmes have been linked to better attendance.
- Source: Peer-reviewed review of school breakfast studies (journal article)
- Verified: Yes

- Finding: A 2023 Lagos University study proved children who skip breakfast score 40% lower.
- Source: None found
- Verified: No. I could not find this study in any source; excluded from the blog post.

## 4. Automation
- Tool: Zapier
- Trigger: Calendly: a new discovery call is booked
- Action 1: Google Sheets: add a row with the person's name, email, phone and call time
- Action 2: Gmail: send the welcome email to the person who booked
- Filter: Only continue if the call starts within 24 hours
- Action 3: WhatsApp: send Dr Alade a reminder
- Test: Book a test call in Calendly and check the new row, the email and the reminder before turning the Zap on
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 10.1 – 10.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l62-ai-intro",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Artificial Intelligence and AI for Research",
    subtitle: "What generative AI is, what it is good and bad at, and using it to research",
    estimatedMinutes: 40,
    intro:
      "AI tools will not replace a good VA, but a VA who uses AI well will replace one who does not. The skill is knowing what to hand to AI and what to check.",

    atoms: [
      {
        id: "a-va-genai",
        title: "Understanding artificial intelligence and generative AI",
        explain:
          "Artificial intelligence (AI) is software that performs tasks that normally need human intelligence, such as understanding language or recognising images. Generative AI creates new content (text, images, audio) from a prompt. Chat assistants such as ChatGPT, Google Gemini, Microsoft Copilot and Claude are built on large language models (LLMs), trained on huge amounts of text to predict the most likely next words. That makes them excellent at drafting, rewriting, summarising, brainstorming, explaining and reformatting. It also explains their limits: they can state false information confidently (called hallucination), including invented facts, quotes, statistics and sources; their knowledge may be out of date unless they search the web; they do not know the client's business unless you tell them; and they have no judgement or accountability. You do. Treat AI as a fast, capable but unreliable junior assistant: it drafts, you decide and check.",
      },
      {
        id: "a-va-ai-research",
        title: "Using AI for research and information gathering",
        explain:
          "AI helps research in specific ways: brainstorming what to look for (\"What should I compare when choosing a CRM for a small clinic?\"), explaining an unfamiliar topic quickly, suggesting search terms, summarising long documents or web pages you provide, and organising findings into a table. Tools with web search (ChatGPT search, Gemini, Copilot, Perplexity) show links to sources; open the sources and check the claims there. Never report a fact, statistic, price, law or quote from AI without verifying it in a reliable source (the CRAAP test from Module 6 still applies). Ask the AI for its sources, and be suspicious when they cannot be found. Note in your report which facts are verified.",
        decision: {
          scenario: "An AI tool tells you that \"a 2023 Lagos University study found 40% of SMEs use VAs\" and gives a link that does not open.",
          question: "What do you do with this statistic?",
          options: [
            { id: "a", text: "Do not use it unless you can find and check the study in a reliable source", why: "Right. A source that cannot be found is a warning sign of a hallucination." },
            { id: "b", text: "Use it; the AI gave a source", whyWrong: "AI can invent studies and links that look real." },
            { id: "c", text: "Use it but round it to 50%", whyWrong: "Changing an unverified number makes it worse." },
            { id: "d", text: "Ask the AI again until it confirms", whyWrong: "The AI confirming itself is not verification." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-ai-desk",
        title: "What should AI do?",
        explain:
          "For each task, decide whether AI is a good fit, a fit only with careful checking, or the wrong tool.",
        deskLab: {
          app: "tasks",
          title: "AI or not?",
          task: "Choose how AI should be used for each task.",
          fields: [{ key: "use", label: "AI use", type: "select", options: ["Good fit", "Use, then verify every fact", "Do not use AI"] }],
          items: [
            { id: "a1", title: "Brainstorm ten ideas for a bakery's Instagram posts", expect: { use: "Good fit" } },
            { id: "a2", title: "Rewrite a rough email into a polite, professional tone", expect: { use: "Good fit" } },
            { id: "a3", title: "Find the current import duty rate on solar panels in Nigeria", expect: { use: "Use, then verify every fact" }, why: "Laws and rates change; confirm on an official source." },
            { id: "a4", title: "Summarise a 20-page market report you provide", expect: { use: "Use, then verify every fact" }, why: "Good at summarising, but check the figures against the report." },
            { id: "a5", title: "Decide whether to accept a supplier's contract on the client's behalf", expect: { use: "Do not use AI" }, why: "A decision with legal consequences belongs to the client (and a lawyer)." },
            { id: "a6", title: "Explain what a CRM pipeline is, so you understand it before a client call", expect: { use: "Good fit" } },
            { id: "a7", title: "Write statistics for a client's blog post", expect: { use: "Use, then verify every fact" }, hint: "AI may invent numbers.", why: "Every statistic must be traced to a real source." },
            { id: "a8", title: "Paste a patient list into a free chatbot to sort it", expect: { use: "Do not use AI" }, why: "Personal health data must not go into public AI tools." },
          ],
          solution: {
            a1: { use: "Good fit" }, a2: { use: "Good fit" }, a3: { use: "Use, then verify every fact" }, a4: { use: "Use, then verify every fact" },
            a5: { use: "Do not use AI" }, a6: { use: "Good fit" }, a7: { use: "Use, then verify every fact" }, a8: { use: "Do not use AI" },
          },
          hint: "Drafting and ideas: good. Facts and figures: verify. Decisions and private data: no.",
          successMessage: "You know what to hand to AI, and what stays with you.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l63-prompts",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3"],
    title: "Writing Effective Prompts",
    subtitle: "Role, task, context, format and constraints, and improving results by iterating",
    estimatedMinutes: 40,
    intro:
      "The quality of AI output depends mostly on the quality of the prompt. Vague prompts get vague, generic answers.",

    atoms: [
      {
        id: "a-va-prompt-parts",
        title: "The parts of a good prompt",
        explain:
          "A strong prompt usually has five parts. Role: who the AI should act as (\"an experienced customer care writer for an online skincare shop\"). Task: exactly what to produce (\"draft a reply email to a customer whose order had the wrong item\"). Context: the facts and background it needs, because it knows nothing about your client (the policy, what happened, the audience). Format: the shape of the output (a subject line, bullets, a table, under 150 words). Constraints: tone, language, length, what to avoid, what not to promise. Examples of good output help too. Use placeholders such as [Customer name] instead of real personal details. The AI cannot read your mind: if a detail matters, put it in.",
        samples: [
          { label: "Vague", tone: "bad", text: "Write a reply to a complaint." },
          { label: "Role, task, context, format, constraints", tone: "good", text: "You are a customer care writer for Halo Skincare. Draft a reply to a customer whose order had the wrong item; our policy is a free replacement in 48 hours or a refund in 5 working days. Subject line plus email, options as bullets. Warm, British English, 120–200 words, use [Customer name]." },
        ],
      },
      {
        id: "a-va-iterate",
        title: "Iterating and refining",
        explain:
          "Treat prompting as a conversation. Read the first answer critically, then refine: \"Shorter, and put the options first\", \"Make it warmer\", \"Use simpler words for a customer who reads English as a second language\", \"Give three subject lines to choose from\". Ask the AI to check its own work against your constraints, or to ask you questions before it starts when the task is complex. Save prompts that work well in a prompt library (a document or your template tool) so you reuse them. Whatever the result, you edit the final version: correct the facts, add the client's personal touches and make sure it sounds like the client, not like a machine.",
        decision: {
          scenario: "The AI's draft reply is accurate but stiff and twice as long as you need.",
          question: "What is the best next step?",
          options: [
            { id: "a", text: "Ask it to make the reply warmer and under 150 words, then edit the result yourself", why: "Right. Refine with specific instructions, then apply your own judgement." },
            { id: "b", text: "Send it as it is", whyWrong: "Stiff, long replies serve the customer badly." },
            { id: "c", text: "Start a new chat with \"write a reply\"", whyWrong: "A vague prompt gives a vague answer; refine instead." },
            { id: "d", text: "Give up on AI for this task", whyWrong: "One specific instruction would fix it." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-prompt-lab",
        title: "Writing a prompt",
        explain:
          "Write the prompt you would give an AI assistant to draft the Halo Skincare reply.",
        writingLab: {
          task:
            "Fill all five parts. Role: who the AI is. Task: what to draft, including the order number. Context: what happened (wrong item, missed first email) and the full policy (48 hours, 5 working days, customer chooses, no return needed). Format: subject line, bullets for the options, a [Customer name] placeholder. Constraints: tone, British English, no emojis, a word range. Do not include the customer's real name, email, phone or address.",
          brief: PROMPT_BRIEF,
          doc: PROMPT_DOC,
          tests: [
            { label: "All five parts filled", check: String.raw`return ['Role', 'Task', 'Context', 'Format', 'Constraints'].every((f) => words(field(doc, f) || '') >= 6);`, fail: "Write at least a full sentence for each part: Role, Task, Context, Format, Constraints." },
            { label: "The task names the order and the problem", check: String.raw`const t = field(doc, 'Task') || ''; return /HS-3307/.test(t) && /(reply|email|draft)/i.test(t) && /(wrong item|wrong product)/i.test(t);`, fail: "Say exactly what to draft: a reply about order HS-3307, which had the wrong item." },
            { label: "The context gives the facts and the full policy", check: String.raw`const c = field(doc, 'Context') || ''; return /(warehouse|packed)/i.test(c) && /spam/i.test(c) && /48 hours/i.test(c) && /5 working days/i.test(c) && /(return)/i.test(c);`, fail: "Give the AI the facts (warehouse error, missed first email) and the whole policy (48 hours, 5 working days, no return needed)." },
            { label: "A clear format with a placeholder", check: String.raw`const f = field(doc, 'Format') || ''; return /subject/i.test(f) && /bullet/i.test(f) && /\[[^\]]*name[^\]]*\]/i.test(f);`, fail: "Ask for a subject line, the options as bullets, and a placeholder such as [Customer name]." },
            { label: "Constraints: tone, language and length", check: String.raw`const c = field(doc, 'Constraints') || ''; return /(warm|professional|friendly)/i.test(c) && /british/i.test(c) && /emoji/i.test(c) && /\d+\s*(to|-|–)\s*\d+\s*words|under \d+ words/i.test(c);`, fail: "Set the tone, British English, no emojis and a word range." },
            { label: "No personal data in the prompt", check: String.raw`return !/@|\+234|\b0[789]\d{2}\b/.test(doc) && !/(Mrs|Mr|Ms) [A-Z][a-z]+/.test(doc);`, fail: "Remove the customer's personal details (names, emails, phone numbers); use a placeholder instead." },
          ],
          solution: PROMPT_DONE,
          hint: "Imagine handing this task to a new colleague who has never heard of Halo Skincare: what would they need to know?",
          successMessage: "A prompt that gets a usable first draft, without exposing anyone's personal data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 10.4 – 10.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l64-ai-writing",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.4", "10.5"],
    title: "AI-Assisted Writing and Summaries",
    subtitle: "Drafting emails and documents with AI, and summarising meetings without losing accuracy",
    estimatedMinutes: 45,
    intro:
      "AI can cut writing and note-taking time in half. It can also put wrong numbers in a client's mouth. The difference is your checking.",

    atoms: [
      {
        id: "a-va-ai-writing",
        title: "AI-assisted email and document writing",
        explain:
          "Use AI to get past the blank page and to polish: draft an email from bullet points, rewrite a message in a different tone (firmer, warmer, simpler), shorten a long paragraph, turn notes into a structured document, suggest subject lines, translate a first draft, or proofread. Copilot in Outlook and Word and Gemini in Gmail and Docs do this inside the tools. Then edit every output: check every fact, name, date and number against the source; remove generic phrases AI overuses (\"I hope this email finds you well\", \"delve\", \"in today's fast-paced world\"); make it sound like the client; and make sure it promises nothing the client has not agreed. Follow the client's policy on AI use, and never send AI text you have not read.",
      },
      {
        id: "a-va-ai-summaries",
        title: "Summarising meetings and documents",
        explain:
          "Meeting tools (Zoom AI Companion, Microsoft Teams Copilot, Otter.ai, Fireflies, Google Meet's notes) can transcribe and summarise calls, and any chat assistant can summarise a document you paste in, if the client allows it. Get permission to record first. AI summaries often get the gist right and the details wrong: they confuse numbers, mix up who said what, turn \"we'll review in July\" into \"we agreed to raise prices in July\", and miss actions. So always compare the summary with the transcript or document for every number, date, name, decision and action; check that every action has an owner and a date; and keep the decisions exact. Your name is on the summary, not the AI's.",
      },
      {
        id: "a-va-summary-lab",
        title: "Correcting an AI meeting summary",
        explain:
          "The AI summary of the Greenline meeting has several errors. Write the corrected summary and list what you corrected.",
        writingLab: {
          task:
            "Key points: at least 5 bullets with the correct facts (14 of 20 installations, inverters delayed to 26 May, no price rise this quarter with a July review, the showroom on 6 June, the next meeting). Actions: a table with both actions, each with owner and due date (Yemi's proposal by Friday 15 May; Ikenna's backup supplier by Thursday 14 May). Corrections: at least 3 bullets listing what the AI got wrong or missed.",
          brief: SUMMARY_BRIEF,
          doc: SUMMARY_DOC,
          tests: [
            { label: "Correct installation figures", check: String.raw`const k = section('Key points') || ''; return /14/.test(k) && /20/.test(k) && !/20 completed/i.test(k);`, fail: "Check the installations: 14 so far, against a target of 20." },
            { label: "Correct inverter date", check: String.raw`return /26 May/i.test(section('Key points') || '');`, fail: "Check the transcript: the shipment is now due on 26 May." },
            { label: "Prices: not rising, reviewed in July", check: String.raw`const k = section('Key points') || ''; return /(not|no)[^.]*(rais|rise|increase)/i.test(k) && /july/i.test(k) && !/agreed to raise/i.test(k);`, fail: "Correct the price point: prices will not rise this quarter; they will be reviewed in July." },
            { label: "Showroom and next meeting", check: String.raw`const k = section('Key points') || ''; return /6 June/i.test(k) && /19 May/i.test(k) && bullets(k).length >= 5;`, fail: "Include the showroom opening (6 June) and the next meeting (19 May), in at least five bullets." },
            { label: "Both actions with owners and dates", check: String.raw`const t = rows(section('Actions') || '').map((x) => x.join(' | ')).join('\n'); return rows(section('Actions') || '').length >= 2 && /yemi[^\n]*15 May/i.test(t) && /ikenna[^\n]*(thursday|14 May)/i.test(t);`, fail: "List both actions: Yemi's proposal by Friday 15 May, and Ikenna's backup supplier by Thursday (14 May)." },
            { label: "Lists the corrections", check: String.raw`const c = bullets(section('Corrections') || ''); const t = c.join(' '); return c.length >= 3 && /14/.test(t) && /26 May/i.test(t) && /(price|rais)/i.test(t);`, fail: "List at least three corrections, including the installations, the inverter date and prices." },
          ],
          solution: SUMMARY_DONE,
          hint: "Go through the AI summary line by line and find each claim in the transcript. Then check the transcript for anything the summary left out.",
          successMessage: "You caught a wrong figure, a wrong date, a wrong decision and a missing action: exactly why AI summaries need a human.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 10.6 – 10.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l65-ai-tasks",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.6", "10.7", "10.8"],
    title: "AI for Tasks, Spreadsheets and Customer Support",
    subtitle: "Planning work, writing formulas and drafting support replies with AI, and checking them",
    estimatedMinutes: 45,
    intro:
      "Three more places where AI saves VAs hours: turning a vague project into a task list, writing spreadsheet formulas, and drafting support replies.",

    atoms: [
      {
        id: "a-va-ai-planning",
        title: "Creating task lists and workflows with AI",
        explain:
          "Give AI a goal and constraints and ask it to break the work down: \"Create a task list for launching an online store in three weeks, grouped by week, with who usually does each task.\" It produces a solid first draft of tasks, checklists, SOP steps and timelines in seconds. Then adapt it to reality: remove what does not apply, add what only you know (the client's team, existing tools, real deadlines), check the order and the dependencies, assign real owners and dates, and move it into the project tool. AI can also turn messy notes into a checklist or draft an SOP from your description of a process.",
      },
      {
        id: "a-va-ai-sheets",
        title: "AI-assisted spreadsheet operations",
        explain:
          "AI is very good at spreadsheets: describe what you want in plain words and ask for the formula, ask it to explain a formula someone else wrote, or ask how to clean messy data (split names, fix dates, remove spaces). Copilot in Excel and Gemini in Google Sheets work inside the sheet. But AI often gets the details wrong: the wrong range, swapped arguments, a function your spreadsheet does not have. Always test an AI formula on rows where you know the answer. Here, an AI suggested =SUMIF(C2:C8,\"WhatsApp\",B2:B8) to total WhatsApp orders, which has its ranges swapped (it checks the amounts for the word and adds the channel names). Write the correct formula in F2.",
        exercise: {
          data: { ...ORDERS },
          rows: 8,
          cols: 6,
          target: "F2",
          expected: 412000,
          mustUseFormula: true,
          mustUse: "SUMIF",
          lockedCells: Object.keys(ORDERS).filter((k) => k !== "F2"),
          task: "In F2, total the WhatsApp orders: check the channels in B2:B8 and add the amounts in C2:C8.",
          hint: "=SUMIF(B2:B8,E2,C2:C8) or =SUMIF(B2:B8,\"WhatsApp\",C2:C8)",
          successMessage: "₦412,000. The AI's version would have returned 0: testing caught it.",
        },
      },
      {
        id: "a-va-ai-support",
        title: "Using AI for customer support",
        explain:
          "In support, AI drafts replies from a ticket (you edit and send), suggests knowledge base articles, summarises long ticket threads, translates messages and powers chatbots that answer common questions from the business's own help articles (Intercom Fin, Zendesk AI, Freshdesk Freddy). Use it within strict rules: the AI must answer only from the business's real policies and never invent a refund, discount or promise; sensitive cases (safety, payment errors, angry or vulnerable customers, legal threats) go to a human; customers should always be able to reach a person; and you review AI drafts before sending, checking the facts and the tone.",
        decision: {
          scenario: "A chatbot you manage told a customer she could get a 50% refund on an opened product. The policy allows no refunds on opened products.",
          question: "What should happen?",
          options: [
            { id: "a", text: "Tell the client, contact the customer politely to correct it (the client decides whether to honour it), and fix the chatbot's knowledge source", why: "Right. Own the error, let the client decide the remedy, and fix the cause." },
            { id: "b", text: "Ignore it and hope the customer forgets", whyWrong: "The customer will expect the refund, and the bot will repeat the mistake." },
            { id: "c", text: "Blame the customer for believing the bot", whyWrong: "The business is responsible for what its chatbot says." },
            { id: "d", text: "Turn off all customer support", whyWrong: "Fix the bot; do not abandon customers." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 10.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l66-automation",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.9"],
    title: "Workflow Automation with Zapier and Make",
    subtitle: "Triggers, actions and filters: making apps do repetitive work by themselves",
    estimatedMinutes: 40,
    intro:
      "If you do the same copy-and-paste task every day, a computer can probably do it for you. Automation is one of the most valuable skills a VA can sell.",

    atoms: [
      {
        id: "a-va-automation",
        title: "Triggers, actions and filters",
        explain:
          "Workflow automation connects apps so that an event in one causes actions in others, with no one copying and pasting. Every automation has a trigger (the event that starts it: a new form response, a new email with an attachment, a new booking, a new paid order) and one or more actions (what happens next: add a row to a sheet, send an email, create a task, post a message). A filter lets it continue only when a condition is true (only orders over ₦100,000; only emails from a certain domain). Zapier calls an automation a Zap; Make (formerly Integromat) calls it a scenario and shows it as a visual flow, often cheaper for complex workflows. Both connect thousands of apps (Gmail, Google Sheets, Calendly, Typeform, Trello, Slack, Shopify, HubSpot, Mailchimp, WhatsApp through business providers).",
        example: "Trigger:  Google Forms: new response (a new inquiry)\nAction 1: Google Sheets: add the inquiry as a new row\nAction 2: Gmail: send the person a thank-you email\nFilter:   only continue if Budget is over ₦500,000\nAction 3: Slack: alert the client about a large inquiry",
      },
      {
        id: "a-va-automation-practice",
        title: "Building automations safely",
        explain:
          "Before automating, do the task by hand a few times so you know exactly what should happen. Map it on paper: trigger, filters, actions, and the data each step needs (name, email, date). Use the client's accounts, connected with their permission. Test with sample data and check every result before turning it on. Name each automation clearly and document what it does, so the client knows it exists. Monitor it: automations fail when a password changes or a form field is renamed, and Zapier and Make send error alerts. Avoid automating anything that needs judgement or could send something embarrassing to many people without review, and check the plan's task limits and costs.",
      },
      {
        id: "a-va-zap-desk",
        title: "Matching triggers to automations",
        explain:
          "Your clients want five automations. For each, choose the trigger and the first action.",
        deskLab: {
          app: "tasks",
          title: "Automation requests",
          task: "Choose the trigger and the first action for each automation.",
          fields: [
            { key: "trigger", label: "Trigger", type: "select", options: ["Typeform: new response", "Gmail: new email with attachment", "Shopify: new paid order", "Calendly: new booking", "Google Sheets: new row"] },
            { key: "action", label: "First action", type: "select", options: ["Google Drive: upload the file", "HubSpot: create a contact", "Trello: create a card", "Google Sheets: add a row", "Gmail: send an email"] },
          ],
          items: [
            { id: "z1", title: "Save every invoice PDF emailed to the accounts inbox into a Drive folder", expect: { trigger: "Gmail: new email with attachment", action: "Google Drive: upload the file" } },
            { id: "z2", title: "Put every website inquiry form submission into the CRM as a contact", expect: { trigger: "Typeform: new response", action: "HubSpot: create a contact" } },
            { id: "z3", title: "Create a packing task on the warehouse board for every paid order", expect: { trigger: "Shopify: new paid order", action: "Trello: create a card" } },
            { id: "z4", title: "Log every new discovery call booking in the leads spreadsheet", expect: { trigger: "Calendly: new booking", action: "Google Sheets: add a row" } },
            { id: "z5", title: "When a new supplier is added to the suppliers sheet, email them the onboarding pack", expect: { trigger: "Google Sheets: new row", action: "Gmail: send an email" } },
          ],
          solution: {
            z1: { trigger: "Gmail: new email with attachment", action: "Google Drive: upload the file" },
            z2: { trigger: "Typeform: new response", action: "HubSpot: create a contact" },
            z3: { trigger: "Shopify: new paid order", action: "Trello: create a card" },
            z4: { trigger: "Calendly: new booking", action: "Google Sheets: add a row" },
            z5: { trigger: "Google Sheets: new row", action: "Gmail: send an email" },
          },
          hint: "The trigger is the event that starts it (\"every…\", \"when…\"); the action is what should happen.",
          successMessage: "Five automations mapped. Build one for real in a free Zapier account.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l67-ai-ethics",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.10"],
    title: "Ethical AI Use, Privacy and Fact-Checking",
    subtitle: "Protecting client data, checking facts and being honest about AI",
    estimatedMinutes: 40,
    intro:
      "Clients trust you with their data and their reputation. Careless AI use can break both in seconds.",

    atoms: [
      {
        id: "a-va-ai-privacy",
        title: "Privacy and confidentiality with AI tools",
        explain:
          "What you type into an AI tool may be stored and, in some free consumer versions, used to train future models, depending on the tool and its settings. So follow three rules. Never paste confidential or personal information (customer names, contact details, health or financial data, passwords, contracts, unreleased plans) into an AI tool unless the client has approved that specific tool for that data, typically a business or enterprise version with data protection terms. Remove or replace identifying details with placeholders ([Customer], [Company]) before using AI. And follow the client's AI policy; if they have none, ask before using AI on their work. Data protection laws (Nigeria's NDPA, the EU and UK GDPR) apply to personal data you put into AI tools just as they do anywhere else.",
      },
      {
        id: "a-va-ai-ethics",
        title: "Fact-checking, bias, honesty and copyright",
        explain:
          "Fact-check everything AI produces that will be used: numbers, names, dates, quotes, laws, prices and sources, against the original or a reliable source. Watch for bias: AI can reproduce stereotypes (for example in job descriptions or images), so review outputs for fairness. Be honest: do not pass off AI work as specially researched if it was not, follow the client's policy on disclosing AI use, and never use AI to create fake reviews, fake testimonials or deceptive content. Respect copyright: do not ask AI to copy other people's work, and check the client's position on AI-generated images. You remain responsible for everything you deliver, whoever or whatever drafted it.",
        decision: {
          scenario: "A client asks you to use AI to write ten five-star Google reviews \"from customers\" to boost her new shop.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Decline politely, explain that fake reviews are deceptive and break Google's rules, and offer to set up a way to ask real customers for reviews", why: "Right. Refuse the deception and offer an honest alternative that works." },
            { id: "b", text: "Write them, since the client asked", whyWrong: "Fake reviews deceive customers and can get the business penalised." },
            { id: "c", text: "Write five instead of ten", whyWrong: "Fewer fake reviews are still fake." },
            { id: "d", text: "Ask friends to post them", whyWrong: "Still fake reviews." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-ethics-desk",
        title: "Is this AI use acceptable?",
        explain:
          "Your client allows a free AI chat tool for drafting only, and has not approved any AI tool for personal or confidential data. Decide for each request.",
        deskLab: {
          app: "tasks",
          title: "AI requests under the client's policy",
          task: "Decide whether each AI use is acceptable as it is, acceptable after removing personal or confidential details, or not acceptable.",
          fields: [{ key: "verdict", label: "Verdict", type: "select", options: ["Acceptable as it is", "Acceptable after removing personal details", "Not acceptable"] }],
          items: [
            { id: "e1", title: "Ask AI to suggest five subject lines for a newsletter about a new product", expect: { verdict: "Acceptable as it is" } },
            { id: "e2", title: "Paste a customer's complaint, with her name, phone and address, to draft a reply", expect: { verdict: "Acceptable after removing personal details" }, why: "Replace the details with placeholders, then draft." },
            { id: "e3", title: "Paste the client's unreleased acquisition plan to summarise it", expect: { verdict: "Not acceptable" }, why: "Highly confidential business information in an unapproved tool." },
            { id: "e4", title: "Use AI to write fake customer testimonials for the website", expect: { verdict: "Not acceptable" } },
            { id: "e5", title: "Ask AI to explain how VLOOKUP works", expect: { verdict: "Acceptable as it is" } },
            { id: "e6", title: "Paste meeting notes that name staff and their salaries to make action points", expect: { verdict: "Acceptable after removing personal details" }, hint: "Salaries are personal; the action points are not.", why: "Remove names and salaries; the AI only needs the actions." },
            { id: "e7", title: "Upload the staff medical records spreadsheet to analyse sick days", expect: { verdict: "Not acceptable" } },
            { id: "e8", title: "Publish AI-written statistics in a client report without checking them", expect: { verdict: "Not acceptable" }, why: "Unchecked AI facts can be invented." },
          ],
          solution: {
            e1: { verdict: "Acceptable as it is" }, e2: { verdict: "Acceptable after removing personal details" }, e3: { verdict: "Not acceptable" }, e4: { verdict: "Not acceptable" },
            e5: { verdict: "Acceptable as it is" }, e6: { verdict: "Acceptable after removing personal details" }, e7: { verdict: "Not acceptable" }, e8: { verdict: "Not acceptable" },
          },
          hint: "Ask: is there personal or confidential data? Can it be removed and still do the job? Is the use honest?",
          successMessage: "Using AI fast and safely: that combination is what clients will pay more for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 10.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l68-practical",
    moduleId: "va-m10-ai",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["10.P"],
    title: "Practical: An AI-Assisted Work Pack",
    subtitle: "A client email, its prompt, a verified research note and an automated workflow",
    estimatedMinutes: 75,
    intro:
      "Use AI tools for real on four tasks for Dr Funke Alade, then check, edit and document everything as a professional would.",

    atoms: [
      {
        id: "a-va-m10-method",
        title: "A professional AI workflow",
        explain:
          "For any AI-assisted task: decide whether AI is appropriate and allowed; remove personal and confidential data; write a structured prompt; refine the output; then check every fact against the source and edit the result into the client's voice. Keep the prompts that work. For research, record each finding with its source and whether you verified it, and exclude anything you could not verify. For automation, map the trigger, actions and filters, test with sample data, and document it for the client.",
      },
      {
        id: "a-va-m10-practical",
        title: "Practical: the work pack",
        explain:
          "Do the four tasks with a real AI tool, then write up the final, checked versions here. When it passes, build the Zap in a free Zapier account if you can, and screenshot it for your portfolio.",
        writingLab: {
          task:
            "1 Email: a subject, \"Dear Mrs Okoye,\", the price with the instalment option, the three inclusions as bullets, the 1 June intake and a link to funkealade.example/call whose text starts with a verb; 70 to 160 words. 2 Prompt: all five parts, with a placeholder instead of the real name. 3 Research note: three findings, each with Finding, Source and Verified; the Lagos University claim marked \"No\" and excluded. 4 Automation: the tool, the Calendly trigger, the Sheets and Gmail actions, a 24-hour filter, the WhatsApp action and a test step.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Email: facts, inclusions and the call link", check: String.raw`const e = section('1.') || ''; const l = links(e); return /^Dear Mrs Okoye,?\s*$/m.test(e) && /180,?000/.test(e) && /65,?000/.test(e) && bullets(e).filter((x) => !/^subject:/i.test(x)).length >= 3 && /1 June/i.test(e) && l.some((x) => /funkealade\.example\/call/.test(x.url) && isAction(x.text));`, fail: "In the email, greet Mrs Okoye; give ₦180,000 or 3 × ₦65,000; list the three inclusions as bullets; mention 1 June; and link to the discovery call with link text starting with a verb." },
            { label: "Email: 70 to 160 words", check: String.raw`const w = words(section('1.') || ''); return w >= 70 && w <= 160;`, fail: "Keep the email between 70 and 160 words." },
            { label: "Prompt: five parts, no real name", check: String.raw`const p = section('2.') || ''; return ['Role', 'Task', 'Context', 'Format', 'Constraints'].every((f) => words(field(p, f) || '') >= 5) && !/okoye/i.test(p) && /180,?000/.test(p);`, fail: "Fill all five prompt parts (with the programme facts in Context), and leave out the client's real name." },
            { label: "Research: three findings with sources and verification", check: String.raw`const r = section('3.') || ''; const f = r.split('\n').filter((l) => /^[-*]\s*Finding:/i.test(l)).length; const s = r.split('\n').filter((l) => /^[-*]\s*Source:/i.test(l)).length; const v = r.split('\n').filter((l) => /^[-*]\s*Verified:/i.test(l)).length; return f >= 3 && s >= 3 && v >= 3;`, fail: "Give three findings, each with a Finding, a Source and a Verified line." },
            { label: "The unverifiable claim is marked and excluded", check: String.raw`const r = section('3.') || ''; const i = r.search(/Lagos University/i); const after = i >= 0 ? r.slice(i, i + 400) : ''; return i >= 0 && /Verified:\s*No/i.test(after) && /(exclud|not use|removed|left out)/i.test(after);`, fail: "Mark the Lagos University claim \"Verified: No\" and say it is excluded." },
            { label: "Automation: trigger, actions, filter and test", check: String.raw`const a = section('4.') || ''; return /(zapier|make)/i.test(field(a, 'Tool') || '') && /calendly/i.test(field(a, 'Trigger') || '') && /sheet/i.test(field(a, 'Action 1') || '') && /gmail|email/i.test(field(a, 'Action 2') || '') && /24 hours/i.test(field(a, 'Filter') || '') && /whatsapp/i.test(field(a, 'Action 3') || '') && words(field(a, 'Test') || '') >= 6;`, fail: "Design the automation: Zapier or Make, the Calendly trigger, the Sheets row, the Gmail email, the 24-hour filter, the WhatsApp reminder, and how you will test it." },
          ],
          solution: PRAC_DONE,
          hint: "For the research note, the most important line is the one that says what you did not use and why.",
          successMessage: "AI used where it helps, everything checked, nothing invented, and repetitive work automated.",
        },
      },
    ],

    task: {
      title: "Module 10 practical: use the tools for real",
      intro: "Practise with real AI and automation tools.",
      prompts: [
        "Use ChatGPT, Gemini, Copilot or Claude to draft the Okoye email from your prompt; compare its draft with your final version and note what you changed.",
        "Start a prompt library document with your five best prompts for VA tasks.",
        "Create a free Zapier or Make account and build one simple automation for yourself: for example, Google Form responses into a Google Sheet with an email notification.",
        "Write a one-page AI use policy you can offer clients: which tools, what data is never entered, and how outputs are checked.",
      ],
      closing: "Module 11 turns your skills into a business: niche, packages, pricing, proposals, profiles and clients.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
