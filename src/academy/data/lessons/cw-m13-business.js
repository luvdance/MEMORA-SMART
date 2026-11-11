/**
 * CONTENT WRITING · MODULE 13 · BUSINESS AND CORPORATE WRITING
 *
 * Curriculum 13.1 – 13.15 and the practical 13.P. Business writing and
 * corporate communication, formal letters, business email, memos and
 * notices, proposals, executive summaries, reports, agendas and minutes,
 * project documentation, policies and procedures, company profiles,
 * official correspondence, formatting, and clarity, accuracy and
 * professionalism; then a business proposal and a formal corporate email.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s13-business";

/* ── Lesson 47 lab: a formal business letter ───────────────────────────── */
const LETTER_BRIEF = `You work for **Greenfield Logistics Ltd**, 14 Adeola Odeku Street, Victoria Island, Lagos. Write a formal letter from **Mrs Ngozi Eze, Operations Manager**, to **Mr Kunle Ajayi, Procurement Manager, Starline Foods Plc**, 22 Ikorodu Road, Maryland, Lagos.

Purpose: Starline's last three deliveries were late because their warehouse could not receive trucks before 10am. Greenfield proposes moving deliveries to 6am–9am on Tuesdays and Fridays, which needs Starline's warehouse to open at 6am on those days. Greenfield needs a reply by **Friday 14 March** to start the new schedule on **Tuesday 25 March**. Today's date is 5 March 2026. Reference: GL/OPS/031.`;

const LETTER_DOC = `# Formal letter

[Write the complete letter: sender's address, date, reference, recipient's name and address, salutation, subject line, body, complimentary close, name and title.]
`;

const LETTER_DONE = `# Formal letter

Greenfield Logistics Ltd
14 Adeola Odeku Street
Victoria Island, Lagos

5 March 2026

Our ref: GL/OPS/031

Mr Kunle Ajayi
Procurement Manager
Starline Foods Plc
22 Ikorodu Road
Maryland, Lagos

Dear Mr Ajayi,

**Proposed new delivery schedule from 25 March**

I am writing to propose a change to our delivery times that will prevent the delays your team experienced on your last three deliveries.

Each of those deliveries arrived on time at your warehouse but could not be offloaded before 10am, when receiving begins. We therefore propose moving your deliveries to between 6am and 9am on Tuesdays and Fridays, before traffic builds up. This would require your warehouse to open at 6am on those two days.

If you agree, we will start the new schedule on Tuesday 25 March. I would be grateful if you could confirm by Friday 14 March so that we can plan our drivers and routes.

Please contact me on 0803 555 0142 if you would like to discuss the proposal.

Yours sincerely,

Ngozi Eze
Operations Manager
Greenfield Logistics Ltd
`;

/* ── Lesson 48 lab: an internal memo ───────────────────────────────────── */
const MEMO_BRIEF = `You are the **HR Manager, Tolu Bankole**, at Greenfield Logistics. From **Monday 7 April**, staff must clock in and out using the new fingerprint attendance system instead of the paper register. Every staff member must register their fingerprint with HR (Room 4, first floor) between **24 March and 4 April**, 9am to 4pm; registration takes 5 minutes. Staff who have not registered by 4 April will have to be signed in by their supervisor until they do. Questions go to hr@greenfieldlogistics.ng. Today's date: 17 March 2026.`;

const MEMO_DOC = `# Memo

- To:
- From:
- Date:
- Subject:

## Message
[Purpose first, then what staff must do, by when, and where to ask.]
`;

const MEMO_DONE = `# Memo

- To: All staff
- From: Tolu Bankole, HR Manager
- Date: 17 March 2026
- Subject: Register your fingerprint for the new attendance system by 4 April

## Message
From Monday 7 April, we will use a fingerprint attendance system to record when staff clock in and out. The paper register will no longer be used.

Before then, every member of staff must register their fingerprint with HR:

- Where: HR office, Room 4, first floor
- When: 24 March to 4 April, between 9am and 4pm
- How long: about 5 minutes

If you have not registered by 4 April, your supervisor will need to sign you in each day until you do.

Please send any questions to hr@greenfieldlogistics.ng.
`;

/* ── Lesson 49 lab: minutes ────────────────────────────────────────────── */
const MINUTES_BRIEF = `**Your rough notes from the Greenfield Logistics operations meeting, Thursday 20 March 2026, 10am–11am, Conference Room B.**

Present: Ngozi Eze (Ops Manager, chair), Musa Lawal (Fleet Supervisor), Ada Okoro (Customer Service Lead), you (Tolu Bankole, minutes). Apologies: Femi Adeyemi (Finance).

1. Late deliveries in Feb: 18 late out of 420. Mostly Ikorodu Road traffic. Agreed: move Starline deliveries to early morning (letter already sent). Ngozi to confirm with Starline by 14 March — wait no, that's done, Starline confirmed yesterday. New schedule starts 25 March.
2. Two trucks (LND 452 XA and KJA 118 BT) overdue for servicing. Musa to book both services by 28 March.
3. Customer complaints up from 12 in Jan to 19 in Feb. Ada says most are about not knowing where the truck is. Ada to draft a proposal for SMS delivery updates and present it at next meeting.
4. AOB: none.

Next meeting: Thursday 3 April, 10am, Conference Room B.`;

const MINUTES_DOC = `# Minutes

[Title line with the meeting, date, time and place.]

## Present

## Apologies

## Discussion and decisions
[One numbered item per agenda point: what was discussed and what was decided.]

## Action points
| Action | Owner | Deadline |
|--------|-------|----------|
|  |  |  |

## Next meeting
`;

const MINUTES_DONE = `# Minutes

Operations meeting, Greenfield Logistics, Thursday 20 March 2026, 10am to 11am, Conference Room B

## Present
Ngozi Eze, Operations Manager (Chair); Musa Lawal, Fleet Supervisor; Ada Okoro, Customer Service Lead; Tolu Bankole (Minutes)

## Apologies
Femi Adeyemi, Finance

## Discussion and decisions
1. Late deliveries: 18 of 420 deliveries in February were late, mainly because of traffic on Ikorodu Road. Starline Foods has confirmed the move to early-morning deliveries, and the new schedule starts on 25 March.
2. Vehicle servicing: the meeting noted that two trucks, LND 452 XA and KJA 118 BT, were overdue for servicing. It was agreed that both would be serviced this month.
3. Customer complaints: complaints rose from 12 in January to 19 in February, mostly because customers do not know where their delivery is. The meeting agreed to consider SMS delivery updates.
4. Any other business: none.

## Action points
| Action | Owner | Deadline |
|--------|-------|----------|
| Start the new Starline delivery schedule | Ngozi Eze | 25 March |
| Book servicing for LND 452 XA and KJA 118 BT | Musa Lawal | 28 March |
| Present a proposal for SMS delivery updates | Ada Okoro | 3 April |

## Next meeting
Thursday 3 April, 10am, Conference Room B
`;

/* ── Lesson 50 lab: the practical, proposal and email ──────────────────── */
const PROP_BRIEF = `**Greenfield Logistics** wants to win a contract to deliver for **Mama's Pride Foods**, a fast-growing snack manufacturer in Ikeja that currently uses three different courier companies and complains about late and lost deliveries.

What Greenfield can offer:
- A dedicated fleet of 4 trucks for Mama's Pride, with 2 backup trucks.
- Deliveries to supermarkets and distributors across Lagos within 24 hours of collection.
- GPS tracking and SMS updates for every delivery.
- A dedicated account manager (Ngozi Eze).
- 96% on-time delivery across all clients in 2025 (internal records).
- Price: ₦4.8 million a month for up to 600 deliveries; ₦7,500 for each extra delivery.
- Contract: 12 months, starting 1 May, with a 60-day trial during which Mama's Pride can end the contract with 14 days' notice.

You are writing (1) the proposal, addressed to **Mrs Halima Bello, Supply Chain Director, Mama's Pride Foods**, and (2) a formal email sending it to her. Proposals must be accepted by **15 April** for a 1 May start.`;

const PROP_DOC = `# Proposal: delivery services for Mama's Pride Foods

## Executive summary

## The challenge

## Our proposed solution

## Why Greenfield

## Pricing
| Item | Cost |
|------|------|
|  |  |

## Timeline and next steps

# Covering email
- Subject:

[The email to Mrs Bello sending the proposal.]
`;

const PROP_DONE = `# Proposal: delivery services for Mama's Pride Foods

## Executive summary
Mama's Pride Foods is growing fast, but deliveries split across three couriers are arriving late and going missing. Greenfield Logistics proposes to handle all of your Lagos deliveries with a dedicated fleet of four trucks, 24-hour delivery, GPS tracking and a single account manager, for ₦4.8 million a month. We delivered 96% of our clients' orders on time in 2025. We recommend a 12-month contract from 1 May, starting with a 60-day trial.

## The challenge
Your products now reach supermarkets and distributors across Lagos through three different couriers. With no single point of responsibility, deliveries arrive late, some are lost, and your team spends time chasing updates instead of serving customers.

## Our proposed solution
- A dedicated fleet of 4 trucks for Mama's Pride, with 2 backup trucks
- Delivery to supermarkets and distributors anywhere in Lagos within 24 hours of collection
- GPS tracking and SMS updates for every delivery, so you and your customers always know where an order is
- One dedicated account manager, Ngozi Eze, responsible for your deliveries

## Why Greenfield
We delivered 96% of orders on time across all our clients in 2025. A single, dedicated fleet means one company is accountable for every delivery, and backup trucks mean breakdowns do not become delays.

## Pricing
| Item | Cost |
|------|------|
| Monthly fee, up to 600 deliveries | ₦4,800,000 |
| Each additional delivery | ₦7,500 |

## Timeline and next steps
The contract would run for 12 months from 1 May. During the first 60 days, either party may end it with 14 days' notice, so you can judge our service with little risk. To start on 1 May, we need your acceptance by 15 April. We would be glad to meet your team to answer any questions before then.

# Covering email
- Subject: Delivery services proposal for Mama's Pride Foods

Dear Mrs Bello,

Thank you for speaking with us about your delivery needs. Please find attached our proposal for handling Mama's Pride Foods' deliveries across Lagos.

In summary, we propose a dedicated fleet of four trucks, delivery within 24 hours, GPS tracking with SMS updates and a single account manager, for ₦4.8 million a month, starting with a 60-day trial.

To begin on 1 May, we would need your decision by 15 April. I would be happy to arrange a meeting with your team next week to discuss the proposal.

Yours sincerely,

Ngozi Eze
Operations Manager
Greenfield Logistics Ltd
0803 555 0142
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 13.1 – 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l47-business",
    moduleId: "cw-m13-business",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4"],
    title: "Business Writing, Letters and Email",
    subtitle: "What business writing is, corporate communication, formal letters and business email",
    estimatedMinutes: 40,
    intro:
      "Part Four is professional writing: the documents organisations run on. Readers here are busy and need to act, so the rules are clarity, accuracy and getting to the point.",

    atoms: [
      {
        id: "a-cw-business-writing",
        title: "Introduction to business writing",
        explain:
          "Business writing is the writing organisations use to inform, request, decide, record and agree: letters, emails, memos, notices, proposals, reports, minutes, policies, procedures and profiles. Its readers usually read because they must, and they want to know quickly: what is this about, what do you need from me, and by when? So business writing puts the purpose first (often in the first sentence or the subject line), gives complete and accurate facts, uses a structure the reader recognises, chooses the right level of formality, and ends with a clear action or next step. It is judged by results: the reader understands it the first time, and the right thing happens. Many organisations have house styles and templates; learn and follow them.",
      },
      {
        id: "a-cw-corporate-comms",
        title: "Principles of corporate communication",
        explain:
          "Corporate communication is how an organisation communicates as a whole, internally (with staff) and externally (with customers, partners, investors, regulators, the media and the public). Its principles: consistency (one message, one voice, the same facts in every channel); accuracy (every number and claim checked, because corporate statements can have legal and financial consequences); transparency and honesty, especially in bad news; timeliness (people affected should hear first, and from the organisation, not from rumours); appropriate tone for each audience; and approval (official communication is usually reviewed by managers, legal or communications teams before release). Writers in organisations should know who must approve a document, what is confidential, and who the spokesperson is.",
      },
      {
        id: "a-cw-formal-letters",
        title: "Formal business letters",
        explain:
          "Formal letters are still used for contracts, official requests, complaints, notices, offers of employment and correspondence with government and regulators. The most common modern layout is block format: everything starts at the left margin, with a blank line between parts. The order is: the sender's address (or letterhead); the date (5 March 2026); a reference if used; the recipient's name, title, organisation and address; the salutation; a subject line (often in bold); the body; the complimentary close; a space for the signature; and the writer's name and title. Salutations and closes go in pairs: \"Dear Sir or Madam\" (name unknown) closes with \"Yours faithfully\"; \"Dear Mr Ajayi\" (name known) closes with \"Yours sincerely\". The body states the purpose in the first paragraph, gives the details in the next, and ends with the action required and the deadline.",
        table: {
          caption: "Salutations and complimentary closes (British and Nigerian usage).",
          headers: ["Salutation", "Use when", "Close with"],
          rows: [
            ["Dear Sir or Madam", "You do not know the recipient's name", "Yours faithfully"],
            ["Dear Mr Ajayi / Dear Mrs Eze / Dear Dr Okafor", "You know the name", "Yours sincerely"],
            ["Dear Kunle", "You know them well", "Kind regards / Best regards"],
          ],
        },
        writingLab: {
          task:
            "Write Greenfield's formal letter to Mr Ajayi in block format. Include: the sender's address, the date (5 March 2026), the reference GL/OPS/031, the recipient's name, title, company and address, \"Dear Mr Ajayi,\", a subject line, a body whose first paragraph states the purpose, the proposed times and days, the 14 March reply deadline and the 25 March start, a polite request, the correct complimentary close for a named recipient, and Mrs Eze's name and title. 120 to 260 words; no contractions.",
          brief: LETTER_BRIEF,
          doc: LETTER_DOC,
          tests: [
            { label: "Sender's address, date and reference", check: String.raw`return /Adeola Odeku/i.test(doc) && /5 March 2026/.test(doc) && /GL\/OPS\/031/.test(doc);`, fail: "Start with Greenfield's address, then the date and the reference." },
            { label: "Recipient's name, title, company and address", check: String.raw`return /Mr Kunle Ajayi/.test(doc) && /Procurement Manager/i.test(doc) && /Starline Foods/i.test(doc) && /Ikorodu Road/i.test(doc);`, fail: "Give Mr Ajayi's full name, title, company and address before the salutation." },
            { label: "\"Dear Mr Ajayi,\" and \"Yours sincerely,\"", check: String.raw`return /^Dear Mr Ajayi,?\s*$/m.test(doc) && /^Yours sincerely,?\s*$/m.test(doc) && !/yours faithfully/i.test(doc);`, fail: "A named recipient takes \"Dear Mr Ajayi,\" and closes with \"Yours sincerely,\"." },
            { label: "Purpose in the first paragraph of the body", check: String.raw`const body = doc.split(/^Dear Mr Ajayi,?\s*$/m)[1] || ''; const p = paragraphs(body).filter((x) => words(x) > 8); return p.length >= 3 && /(propos|writing to|request)/i.test(p[0]) && /(deliver|schedule)/i.test(p[0]);`, fail: "Open the body by saying why you are writing: to propose a new delivery schedule." },
            { label: "The facts: 6am, Tuesdays and Fridays, 14 March, 25 March", check: String.raw`return /6\s?am/i.test(doc) && /tuesdays? and fridays?/i.test(doc) && /14 March/.test(doc) && /25 March/.test(doc);`, fail: "Include the times, the days, the 14 March reply deadline and the 25 March start." },
            { label: "Signed with name and title; 120–260 words; no contractions", check: String.raw`return /Ngozi Eze\s*\n\s*Operations Manager/i.test(doc) && words(doc) >= 120 && words(doc) <= 260 && !/\b\w+['’](s|re|ve|ll|d|t)\b/i.test(doc.replace(/Mama['’]s|Starline['’]s|Greenfield['’]s/g, ''));`, fail: "End with Mrs Eze's name and title, keep to 120 to 260 words, and use no contractions." },
          ],
          solution: LETTER_DONE,
          hint: "Build the letter top to bottom in the order of the lesson's layout, then write the body as purpose, details, action.",
          successMessage: "A formal letter laid out correctly, with the purpose first and a clear request with a deadline.",
        },
      },
      {
        id: "a-cw-business-email",
        title: "Business email writing",
        explain:
          "Email is now the main business correspondence, so it must be as clear as a letter but faster to read. A business email has a specific subject line, a greeting suited to the relationship, the purpose in the first one or two sentences, the details in short paragraphs or bullets, a clear request with a deadline, and a sign-off with your name, title and contact details. Use the formal letter conventions when writing to someone senior or external for the first time (\"Dear Mrs Bello\", \"Yours sincerely\" or \"Kind regards\"), and adjust as the relationship develops. Keep one main topic per email so it can be filed and actioned, attach documents rather than pasting long text, and check names, figures and attachments before sending. Module 14 covers workplace email etiquette in depth.",
        decision: {
          scenario: "You are emailing a senior manager at a partner company for the first time to request a meeting.",
          question: "Which opening is most appropriate?",
          options: [
            { id: "a", text: "\"Dear Mr Okafor, I am writing to request a 30-minute meeting next week to discuss our delivery contract.\"", why: "Right. Formal greeting for a first contact, and the purpose in the first sentence." },
            { id: "b", text: "\"Hey boss! Hope you're good 😊\"", whyWrong: "Far too casual for a first contact with a senior external manager." },
            { id: "c", text: "\"Dear Sir, I hope this email finds you well and in good health, and that your family is also well…\"", whyWrong: "Delays the purpose with filler; and you know his name." },
            { id: "d", text: "No greeting, just the request", whyWrong: "Abrupt and impolite in a first email." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 13.5 – 13.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l48-memos",
    moduleId: "cw-m13-business",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.5", "13.6", "13.7", "13.8"],
    title: "Memos, Proposals, Summaries and Reports",
    subtitle: "The internal and decision-making documents of an organisation",
    estimatedMinutes: 45,
    intro:
      "Some documents tell people what to do; others ask them to decide. This lesson covers memos and notices, proposals, executive summaries and business reports.",

    atoms: [
      {
        id: "a-cw-memos",
        title: "Internal memos and notices",
        explain:
          "A memo (memorandum) is a short internal document that informs staff of a decision, change, procedure or request. It has a standard heading block: To, From, Date and Subject (sometimes CC). The subject line states the content and, if there is one, the action (\"Register your fingerprint for the new attendance system by 4 April\"). The body starts with the purpose (what is changing and when), then what staff must do, with details in bullets (where, when, how long), the consequence or exception if relevant, and where to ask questions. There is no greeting or sign-off as in a letter. A notice is a short public version for a noticeboard, intranet or group chat: a headline, the key facts and the action, readable at a glance. Both should be neutral and clear, even when the news is unwelcome.",
        writingLab: {
          task:
            "Write Tolu's memo to all staff. Fill To, From (name and title), Date and a Subject that states both the change and the action with its deadline. Message: start with what is changing and when (7 April); then what staff must do, with the where, when and how long as bullets; the consequence of not registering; and where to send questions. 70 to 160 words, no greeting (\"Dear…\") and no sign-off.",
          brief: MEMO_BRIEF,
          doc: MEMO_DOC,
          tests: [
            { label: "To, From with title, and Date", check: String.raw`return /all staff/i.test(field(doc, 'To') || '') && /Tolu Bankole/i.test(field(doc, 'From') || '') && /HR Manager/i.test(field(doc, 'From') || '') && /17 March 2026/.test(field(doc, 'Date') || '');`, fail: "Fill To (All staff), From (Tolu Bankole, HR Manager) and Date (17 March 2026)." },
            { label: "Subject states the action and the deadline", check: String.raw`const s = field(doc, 'Subject') || ''; return /fingerprint|attendance/i.test(s) && /4 April/i.test(s) && /(register|sign up|enrol)/i.test(s);`, fail: "Make the subject say what staff must do and by when: register… by 4 April." },
            { label: "Opens with the change and its date", check: String.raw`const m = paragraphs(section('Message'))[0] || ''; return /7 April/i.test(m) && /fingerprint/i.test(m);`, fail: "Start the message with what changes and when: the fingerprint system from 7 April." },
            { label: "Where, when and how long as bullets", check: String.raw`const b = bullets(section('Message')).join(' '); return /room 4/i.test(b) && /24 March/i.test(b) && /4 April/i.test(b) && /5 minutes/i.test(b);`, fail: "Put Room 4, the 24 March to 4 April window and the 5 minutes in bullets." },
            { label: "The consequence and where to ask", check: String.raw`const m = section('Message') || ''; return /supervisor/i.test(m) && /hr@greenfieldlogistics\.ng/i.test(m);`, fail: "Say what happens if staff do not register, and give the HR email for questions." },
            { label: "70 to 160 words, no greeting or sign-off", check: String.raw`const m = section('Message') || ''; return words(m) >= 70 && words(m) <= 160 && !/^dear\b/im.test(m) && !/(yours (sincerely|faithfully)|kind regards)/i.test(m);`, fail: "Memos have no \"Dear…\" or sign-off; the heading block replaces them. Keep to 70 to 160 words." },
          ],
          solution: MEMO_DONE,
          hint: "Write the subject line last: once the memo is clear, the subject is its first sentence, shortened.",
          successMessage: "A memo staff can act on from the subject line alone, with the details one glance away.",
        },
      },
      {
        id: "a-cw-proposals",
        title: "Business proposals",
        explain:
          "A business proposal persuades a client or decision-maker to accept a plan: to buy a service, fund a project or approve a change. Solicited proposals answer a request (an RFP, request for proposal), and must follow its required structure exactly; unsolicited proposals are offered without a request and must work harder to establish the need. A typical structure: title; executive summary; the client's challenge or need (in their terms); the proposed solution; why us (evidence, experience, results); scope and deliverables; timeline; pricing; terms; and next steps. Write it about the client, not about you: show you understand their problem before presenting your solution, back every claim with evidence, and make the decision easy, with a clear price and a clear next step. Proposals are persuasive professional writing: the frameworks of Part Three apply, delivered in a formal register.",
      },
      {
        id: "a-cw-exec-summaries",
        title: "Executive summaries",
        explain:
          "An executive summary is a short section at the start of a proposal or report that gives a busy decision-maker everything they need to decide, without reading the rest. It is not an introduction or a teaser; it is the whole document in miniature. For a proposal: the client's problem, the proposed solution, the main benefits and evidence, the cost, and the recommendation or next step. For a report: the purpose, the key findings, the conclusions and the recommendations. Keep it to about 5 to 10% of the document (often one paragraph to one page), write it last, use the document's key numbers, and make sure it stands alone: a reader who reads only the summary should be able to make the right decision.",
        samples: [
          { label: "Not a summary: a teaser", tone: "bad", text: "This proposal will explore the various logistics challenges facing Mama's Pride Foods and present a range of exciting options for consideration." },
          { label: "A real executive summary", tone: "good", text: "Deliveries split across three couriers are arriving late and going missing. We propose handling all of your Lagos deliveries with a dedicated fleet, 24-hour delivery and GPS tracking, for ₦4.8 million a month, starting with a 60-day trial." },
        ],
      },
      {
        id: "a-cw-business-reports",
        title: "Business reports",
        explain:
          "A business report presents information and analysis to help an organisation understand a situation or make a decision. Common reports are progress reports, sales and performance reports, incident reports, research and feasibility reports, and annual reports. A formal report usually has: title page; executive summary; introduction (purpose, scope, method); findings (the evidence, often with tables and charts); conclusions (what the findings mean); recommendations (what should be done); and appendices (detailed data). Reports are objective: present evidence fairly, separate facts from interpretation, and support recommendations with findings. Module 15 teaches report writing in depth; here, know the parts and that the executive summary and recommendations are what decision-makers read first.",
        decision: {
          scenario: "A CEO has five minutes before a board meeting to read your 20-page report on delivery delays.",
          question: "Which part must be strong enough to stand alone?",
          options: [
            { id: "a", text: "The executive summary, with the key findings and recommendations", why: "Right. Busy decision-makers often read only the summary." },
            { id: "b", text: "The appendices", whyWrong: "Appendices hold supporting detail for those who want it." },
            { id: "c", text: "The table of contents", whyWrong: "It shows where things are, not what they say." },
            { id: "d", text: "The method section", whyWrong: "Important for credibility, but not what a five-minute reader needs." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 13.9 – 13.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l49-records",
    moduleId: "cw-m13-business",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.9", "13.10", "13.11", "13.12"],
    title: "Agendas, Minutes, Documentation, Policies and Profiles",
    subtitle: "The documents that record and govern how an organisation works",
    estimatedMinutes: 45,
    intro:
      "Organisations need a written memory: what was decided and who will do what, how projects run, the rules everyone follows, and how the company describes itself.",

    atoms: [
      {
        id: "a-cw-agendas-minutes",
        title: "Meeting agendas and minutes",
        explain:
          "An agenda is sent before a meeting: the meeting's name, date, time, place (or link), purpose, attendees, and a numbered list of items, ideally with the person leading each and the time allowed, ending with any other business (AOB). It lets people prepare. Minutes are the official record afterwards: the meeting details; who was present, who sent apologies, and who chaired and took the minutes; for each agenda item, a short summary of the discussion and the decision; a table of action points with the action, the owner and the deadline; and the date of the next meeting. Minutes record decisions and actions, not every word said; they are written in the past tense and in indirect speech (Module 2), neutrally, without the minute-taker's opinions. Send them within a day or two, and have them approved at the next meeting.",
      },
      {
        id: "a-cw-project-docs",
        title: "Project documentation",
        explain:
          "Project documentation records how a project is planned, run and closed, so everyone works from the same information and the organisation can learn from it. Key documents: the project charter or brief (purpose, objectives, scope, sponsor, budget, key dates); the project plan (tasks, timeline, milestones, owners, dependencies); the RACI chart (who is Responsible, Accountable, Consulted and Informed for each task); status or progress reports (Module 15); the risk register (each risk, its likelihood, impact, owner and response); the change log (requested changes and decisions); meeting minutes; and the closure report with lessons learned. Write them so a new team member could join and understand the project from the documents alone: clear headings, dates, owners, and versions (Module 15).",
      },
      {
        id: "a-cw-policies",
        title: "Policy and procedure documents",
        explain:
          "A policy states an organisation's rule or position and why: what is required, what is not allowed, who it applies to (\"This policy applies to all employees and contractors\"). A procedure explains how to carry out a task that the policy requires, as numbered steps. Policies are written in precise, formal language with clearly defined terms, because they may be relied on in disputes: use \"must\" for requirements and \"may\" for permissions, avoid vague words (\"reasonable\", \"soon\") unless defined, and state consequences. A typical policy contains: title, purpose, scope, definitions, the policy statements, responsibilities, related procedures, consequences of breach, approval and the effective date and review date. Procedures follow the how-to rules from Module 5: one action per numbered step, starting with a verb. Standard operating procedures (SOPs) are covered in Module 15.",
        decision: {
          scenario: "Which sentence belongs in a staff leave policy?",
          question: "Choose the clearest policy statement.",
          options: [
            { id: "a", text: "\"Employees must submit leave requests through the HR portal at least 14 days before the first day of leave.\"", why: "Right. Precise: who, must, what, how and a measurable time." },
            { id: "b", text: "\"Staff should try to apply for leave early if possible.\"", whyWrong: "\"Try\", \"early\" and \"if possible\" are too vague to apply or enforce." },
            { id: "c", text: "\"Leave is very important to us as a caring company!\"", whyWrong: "Promotional, not a rule." },
            { id: "d", text: "\"Leave requests will be dealt with in due course.\"", whyWrong: "Vague and passive: who, how and when?" },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-company-profiles",
        title: "Writing company profiles",
        explain:
          "A company profile introduces an organisation to potential clients, partners, investors and tender committees. It is used in proposals, on websites and as a standalone brochure. It usually covers: who the company is (name, year founded, location, legal status such as Ltd or Plc); what it does (services or products, sectors served); its mission and values; its track record (clients, projects, numbers such as deliveries made or customers served); its team and leadership; certifications, licences and memberships (for example CAC registration, industry licences); and contact details. Write it in the third person (\"Greenfield Logistics provides…\") or first-person plural (\"We provide…\") consistently, lead with what the reader most needs to know, use specific facts rather than adjectives (\"96% on-time delivery in 2025\" rather than \"world-class service\"), and keep it current.",
        writingLab: {
          task:
            "Turn your rough notes into proper minutes. Write the title line (meeting, date, time, place), Present (with roles, chair and minute-taker marked), Apologies, a numbered Discussion and decisions list (one per agenda item, in the past tense, using the corrected information: Starline has confirmed), an Action points table with three rows (action, owner, deadline) and the Next meeting. Leave out the crossed-out thinking from your notes (\"wait no\").",
          brief: MINUTES_BRIEF,
          doc: MINUTES_DOC,
          tests: [
            { label: "Title line with date, time and place", check: String.raw`const t = units(doc.split(/^##/m)[0])[0] || ''; return /20 March 2026/.test(t) && /10\s?am/i.test(t) && /Conference Room B/i.test(t);`, fail: "Under the title, give the meeting, date, time and place." },
            { label: "Present with chair and minute-taker; apologies", check: String.raw`const p = section('Present') || ''; return /ngozi eze/i.test(p) && /chair/i.test(p) && /minutes/i.test(p) && /musa lawal/i.test(p) && /ada okoro/i.test(p) && /femi adeyemi/i.test(section('Apologies') || '');`, fail: "List everyone present with roles, mark the chair and minute-taker, and record Femi's apologies." },
            { label: "Four numbered items, in the past tense", check: String.raw`const n = numbered(section('Discussion and decisions')); return n.length >= 4 && n.filter((x) => /\b(was|were|had|agreed|confirmed|rose|decided|discussed)\b/i.test(x)).length >= 3;`, fail: "Number one item per agenda point and write them in the past tense." },
            { label: "Uses the corrected information, without rough notes", check: String.raw`const d = section('Discussion and decisions') || ''; return /confirmed/i.test(d) && /25 March/.test(d) && !/wait no|that's done|ngozi to confirm/i.test(doc);`, fail: "Record what was actually agreed (Starline confirmed; starts 25 March) and remove the rough thinking." },
            { label: "Three actions with owner and deadline", check: String.raw`const r = rows(section('Action points')).filter((c) => words(c[0]) >= 3 && words(c[1]) >= 2 && /\d/.test(c[2] || '')); const o = r.map((c) => c[1].toLowerCase()).join(' '); return r.length >= 3 && /musa/.test(o) && /ada/.test(o);`, fail: "Each action needs an owner and a dated deadline: Musa's servicing, Ada's SMS proposal, and the Starline start." },
            { label: "Next meeting recorded", check: String.raw`const n = section('Next meeting') || ''; return /3 April/i.test(n) && /10\s?am/i.test(n);`, fail: "Give the next meeting's date, time and place." },
          ],
          solution: MINUTES_DONE,
          hint: "For each item, write one sentence of what was discussed and one of what was decided. Actions go in the table, not the text.",
          successMessage: "Minutes that record decisions and actions, not the noise of the meeting. Anyone absent knows exactly what happens next.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 13.13 – 13.15 · PRACTICAL 13.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l50-proposal",
    moduleId: "cw-m13-business",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.13", "13.14", "13.15", "13.P"],
    title: "Official Correspondence, Formatting and the Proposal",
    subtitle: "Writing officially, formatting professionally, and the module practical",
    estimatedMinutes: 75,
    intro:
      "Official documents carry the organisation's name and sometimes legal weight. This lesson covers official correspondence, professional formatting and the habits of accuracy, then you write a business proposal and the email that sends it.",

    atoms: [
      {
        id: "a-cw-official-correspondence",
        title: "Preparing official correspondence",
        explain:
          "Official correspondence is writing sent on behalf of an organisation to other organisations, government agencies, regulators or the public: letters of offer and appointment, responses to complaints, requests to agencies, notices, confirmations, tender submissions and statements. It is usually on letterhead, has a reference number for tracking, is signed by an authorised person, and is filed. Write it carefully: use the organisation's approved templates and wording, state facts precisely (dates, amounts, names, reference numbers), avoid promises the organisation has not approved, keep the tone formal and courteous even in disputes, and never include confidential information without authority. When writing to government bodies, follow their required formats and address officials by their correct titles. Keep copies, and record when and how each item was sent.",
      },
      {
        id: "a-cw-formatting",
        title: "Formatting professional documents",
        explain:
          "Formatting makes documents easy to read and look professional. Use the organisation's template where one exists. Otherwise: a clean, readable font (Calibri, Arial or Times New Roman at 11 or 12 point); consistent heading styles (use the Heading 1, 2 and 3 styles in Word or Google Docs, which also build an automatic table of contents and help screen readers); left-aligned text with generous margins and line spacing; short paragraphs; numbered lists for steps and bullets for unordered items; tables for comparisons and figures; page numbers; and a title page, version and date for longer documents. Be consistent in dates (5 March 2026), numbers (₦4,800,000 or ₦4.8 million, not both), capitalisation and abbreviations (define each one the first time: \"global positioning system (GPS)\"). Export to PDF for sending so formatting stays fixed.",
      },
      {
        id: "a-cw-professionalism",
        title: "Writing with clarity, accuracy and professionalism",
        explain:
          "Professional documents build or damage an organisation's reputation, so three habits matter. Clarity: purpose first, plain words, one idea per paragraph, and the action and deadline stated. Accuracy: check every name, title, date, figure, calculation, reference number and attachment against the source, and make sure totals add up; one wrong figure in a proposal can cost a contract or create a legal obligation. Professionalism: courteous and respectful tone, even when refusing or complaining; no slang, emojis or sarcasm; no blaming individuals in writing; confidentiality respected; and nothing written that you would not want read aloud in a meeting or in court. Before sending any important document, read it once as the recipient, and, where it matters, ask a colleague to check it.",
        decision: {
          scenario: "Your proposal says \"₦4.8 million a month\" in the summary and \"₦48,000,000 a month\" in the pricing table.",
          question: "What is the risk, and what should you do?",
          options: [
            { id: "a", text: "The figures conflict (₦48 million is ten times more); correct the table to ₦4,800,000 and recheck every figure before sending", why: "Right. An inconsistent price confuses the client and could be held against you. Check every number against the source." },
            { id: "b", text: "No risk: the client will know what you meant", whyWrong: "Clients may rely on what is written, and a wrong figure damages trust." },
            { id: "c", text: "Delete the pricing table", whyWrong: "The client needs clear pricing; fix it instead." },
            { id: "d", text: "Add \"errors and omissions excepted\" and send", whyWrong: "A disclaimer does not excuse a careless, visible error." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-m13-practical",
        title: "Practical: a business proposal and a formal corporate email",
        explain:
          "Write Greenfield Logistics' proposal to Mama's Pride Foods, then the formal email that sends it to Mrs Halima Bello. The proposal must be about the client's problem before it is about Greenfield, back its claims with the evidence in the brief, price clearly, and make the next step and deadline obvious. The email must be short, formal and complete: purpose, a one-sentence summary, the decision deadline, an offer to meet, and a professional signature.",
        writingLab: {
          task:
            "Proposal: an Executive summary (60 to 120 words) that includes the problem, the solution, ₦4.8 million, 96% and the recommendation; The challenge (in the client's terms, without Greenfield's name); Our proposed solution (at least three bullets); Why Greenfield (with the 96% evidence); a Pricing table with both prices; and Timeline and next steps (12 months, 1 May, the 60-day trial and the 15 April deadline). Covering email: a Subject line, \"Dear Mrs Bello,\", the purpose, a one-sentence summary, the 15 April deadline, an offer to meet, \"Yours sincerely\" or \"Kind regards\", and a signature with name, title and company; 70 to 160 words.",
          brief: PROP_BRIEF,
          doc: PROP_DOC,
          tests: [
            { label: "Executive summary: 60–120 words with problem, solution, price, evidence", check: String.raw`const s = section('Executive summary') || ''; return words(s) >= 60 && words(s) <= 120 && /(late|lost|missing)/i.test(s) && /₦\s?4\.8 million|₦\s?4,800,000/i.test(s) && /96\s?%/.test(s) && /(recommend|propose)/i.test(s);`, fail: "Summarise the whole proposal in 60 to 120 words: the problem, the solution, the price, the 96% and the recommendation." },
            { label: "The challenge is about the client", check: String.raw`const c = section('The challenge') || ''; return words(c) >= 30 && /three (different )?couriers|3 couriers/i.test(c) && !/greenfield/i.test(c);`, fail: "Describe Mama's Pride's problem in their terms (three couriers, late and lost deliveries) before mentioning Greenfield." },
            { label: "Solution in bullets; evidence in Why Greenfield", check: String.raw`return bullets(section('Our proposed solution')).length >= 3 && /96\s?%/.test(section('Why Greenfield') || '');`, fail: "List at least three parts of the solution, and support Why Greenfield with the 96% on-time record." },
            { label: "Pricing table with both prices", check: String.raw`const t = rows(section('Pricing')).map((c) => c.join(' ')).join(' '); return /₦\s?4,800,000|₦\s?4\.8 million/i.test(t) && /₦\s?7,500/.test(t);`, fail: "Put the monthly fee and the extra-delivery price in the table." },
            { label: "Timeline and next steps with all the terms", check: String.raw`const t = section('Timeline and next steps') || ''; return /12 months/i.test(t) && /1 May/i.test(t) && /60 days|60-day/i.test(t) && /15 April/i.test(t);`, fail: "Give the 12-month term from 1 May, the 60-day trial and the 15 April deadline." },
            { label: "Covering email: subject, salutation, deadline, close and signature", check: String.raw`const e = doc.split(/^#\s+Covering email/m)[1] || ''; return words(field(e, 'Subject') || '') >= 4 && /^Dear Mrs Bello,?\s*$/m.test(e) && /15 April/.test(e) && /(meet|meeting|call)/i.test(e) && /(yours sincerely|kind regards)/i.test(e) && /Ngozi Eze/.test(e) && /Operations Manager/i.test(e) && words(e) >= 70 && words(e) <= 160;`, fail: "Write the email: subject, \"Dear Mrs Bello,\", purpose, summary, the 15 April deadline, an offer to meet, a formal close and a full signature, in 70 to 160 words." },
          ],
          solution: PROP_DONE,
          hint: "Write the challenge and solution first, then the executive summary last, from what you have written.",
          successMessage: "A proposal a director can decide on from the first paragraph, and an email that sends it properly. Two portfolio pieces.",
        },
      },
    ],

    task: {
      title: "Module 13 practical: a business document pack",
      intro: "Produce the documents a small organisation needs.",
      prompts: [
        "Choose a real organisation you know (a business, church, school or association) and write its one-page company profile.",
        "Write the agenda for one of its meetings, attend or simulate the meeting, and write the minutes with an action table.",
        "Write a short internal policy it needs (for example a social media or leave policy) with a related procedure.",
        "Write a proposal (two to three pages) for a service it could buy or a change it could make, and the email that sends it.",
        "Format everything with heading styles in Word or Google Docs, export to PDF and add the best pieces to your portfolio.",
      ],
      closing: "Module 14 focuses on the writing most professionals do all day: workplace email and messaging.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
