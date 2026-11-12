/**
 * VIRTUAL ASSISTANT · MODULE 4 · ADMINISTRATIVE AND EXECUTIVE ASSISTANCE
 *
 * Curriculum 4.1 – 4.11 and the practical 4.P. The daily admin routine,
 * inbox management (labels, filters, priorities, archiving), calendars and
 * scheduling, travel itineraries, agendas and minutes, documents, data
 * entry and records, confidential information and executive support; then a
 * week as executive assistant to a fictional CEO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s4-admin";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/* ── Lesson 24 lab: travel itinerary ──────────────────────────────────── */
const TRAVEL_BRIEF = `Your executive, **Mrs Adaeze Nwosu** (CEO, Brightwave Foods), must attend the **West Africa Food Summit in Accra, Ghana**, on **Thursday 16 April**, 09:00 to 17:00 at the **Kempinski Hotel Gold Coast City**. She must be back in Lagos for a board meeting on **Friday 17 April at 15:00 WAT**. Her travel policy: economy or business up to **$700 return**, hotels up to **$250 a night**, and she prefers to arrive the evening before an event, before 20:00 local time.

Accra (GMT, UTC+0) is **one hour behind Lagos** (WAT, UTC+1). Flights take about 1 hour 10 minutes. Nigerians do not need a visa for Ghana (ECOWAS); a valid passport is needed.

**Flight options you found (all return, prices per person):**

| Option | Outbound (Lagos → Accra) | Return (Accra → Lagos) | Price |
|---|---|---|---|
| A · Air Peace | Wed 15 Apr, dep 21:30 WAT, arr 21:40 GMT | Fri 17 Apr, dep 08:00 GMT, arr 10:10 WAT | $520 |
| B · Africa World Airlines | Wed 15 Apr, dep 16:00 WAT, arr 16:10 GMT | Fri 17 Apr, dep 09:30 GMT, arr 11:40 WAT | $610 |
| C · Ethiopian (business) | Wed 15 Apr, dep 15:00 WAT, arr 15:10 GMT | Fri 17 Apr, dep 13:00 GMT, arr 15:10 WAT | $980 |

**Hotel options:**
- Kempinski Hotel Gold Coast City (summit venue): $310 a night.
- Movenpick Ambassador Hotel, 10 minutes' drive from the venue: $230 a night.

Booking references (pretend you booked your choices): flight **AWA7Q2**, hotel **MV-55821**. Driver in Accra: **Kwame Asante, +233 24 555 0187**.`;

const TRAVEL_DOC = `# Travel itinerary: Mrs Adaeze Nwosu, Accra, 15–17 April

## Summary

- Flight option:
- Hotel:
- Why:

## Itinerary

| Day | Time | Activity |
|---|---|---|

## Bookings

## Contacts and notes
`;

const TRAVEL_DONE = `# Travel itinerary: Mrs Adaeze Nwosu, Accra, 15–17 April

## Summary

- Flight option: B, Africa World Airlines, $610 return
- Hotel: Movenpick Ambassador Hotel, $230 a night, 2 nights
- Why: Option B is within the $700 limit, arrives before 20:00 and returns well before Friday's 15:00 board meeting. Option A arrives too late; option C is over budget. The Kempinski is over the $250 hotel limit, so the Movenpick, 10 minutes away, is the best choice.

## Itinerary

| Day | Time | Activity |
|---|---|---|
| Wed 15 April | 13:30 WAT | Leave home for Murtala Muhammed Airport, Lagos |
| Wed 15 April | 16:00 WAT | Flight AWA departs Lagos |
| Wed 15 April | 16:10 GMT | Arrive Kotoka Airport, Accra; driver Kwame Asante meets you |
| Wed 15 April | 17:00 GMT | Check in at Movenpick Ambassador Hotel |
| Thu 16 April | 08:30 GMT | Driver to Kempinski Hotel Gold Coast City |
| Thu 16 April | 09:00–17:00 GMT | West Africa Food Summit |
| Fri 17 April | 07:00 GMT | Check out; driver to Kotoka Airport |
| Fri 17 April | 09:30 GMT | Flight departs Accra |
| Fri 17 April | 11:40 WAT | Arrive Lagos; driver to the office for the 15:00 board meeting |

## Bookings

- Flight: Africa World Airlines, booking reference AWA7Q2
- Hotel: Movenpick Ambassador Hotel, confirmation MV-55821, 2 nights (15–17 April)

## Contacts and notes

- Driver in Accra: Kwame Asante, +233 24 555 0187
- Accra is one hour behind Lagos; times above say WAT or GMT.
- No visa needed (ECOWAS); carry your passport.
`;

/* ── Lesson 25 lab: minutes ────────────────────────────────────────────── */
const NOTES_BRIEF = `You took these rough notes at the **Brightwave Foods management meeting** on **Monday 9 March 2026, 10:00–11:00, on Microsoft Teams**. Chair: Mrs Adaeze Nwosu (CEO). Present: Mrs Nwosu, Mr Tunde Bakare (Sales), Ms Halima Garba (Finance), Mr Chidi Okeke (Operations), and you (minutes). Apologies: Mrs Funmi Ade (HR).

> - Q1 sales 8% above target — Tunde. Abuja strongest.
> - Halima: cash flow fine but two distributors owe ₦4.2m total, >60 days. Agreed: Halima to send final reminders by 13 March; if unpaid by 31 March, pass to legal.
> - New Kano warehouse: Chidi says lease ready to sign. DECIDED: CEO approves lease, start 1 May. Chidi to sign by 20 March.
> - Sales wants 2 new reps for the North. Not decided — Funmi absent. Tunde to send a cost proposal to CEO by 18 March.
> - Staff end-of-quarter party: you (VA) to get 3 venue quotes by 16 March.
> - Next meeting Monday 13 April, 10:00, Teams.`;

const MIN_DOC = `# Minutes: Brightwave Foods management meeting

- Date:
- Time:
- Location:
- Chair:

## Attendees

## Apologies

## Discussion and decisions

## Action items

| Action | Owner | Due |
|---|---|---|

## Next meeting
`;

const MIN_DONE = `# Minutes: Brightwave Foods management meeting

- Date: Monday 9 March 2026
- Time: 10:00–11:00
- Location: Microsoft Teams
- Chair: Mrs Adaeze Nwosu (CEO)

## Attendees

- Mrs Adaeze Nwosu (CEO, Chair)
- Mr Tunde Bakare (Sales)
- Ms Halima Garba (Finance)
- Mr Chidi Okeke (Operations)
- Minutes: Virtual Assistant

## Apologies

- Mrs Funmi Ade (HR)

## Discussion and decisions

- Sales: Q1 sales were 8% above target, with Abuja the strongest region.
- Debtors: two distributors owe ₦4.2 million in total, more than 60 days overdue. Decision: final reminders by 13 March; any amount unpaid by 31 March passes to legal.
- Kano warehouse: Decision: the CEO approved the lease, starting 1 May.
- Sales representatives: the request for two new representatives for the North was not decided, because HR was absent. A cost proposal will come to the CEO.
- Staff party: venue quotes will be collected for the end-of-quarter party.

## Action items

| Action | Owner | Due |
|---|---|---|
| Send final payment reminders to the two distributors | Halima Garba | 13 March 2026 |
| Sign the Kano warehouse lease | Chidi Okeke | 20 March 2026 |
| Send the CEO a cost proposal for two new sales representatives | Tunde Bakare | 18 March 2026 |
| Get three venue quotes for the staff party | Virtual Assistant | 16 March 2026 |

## Next meeting

Monday 13 April 2026, 10:00, Microsoft Teams.
`;

/* ── Lesson 28 lab: agenda for the CEO's week ──────────────────────────── */
const AGENDA_BRIEF = `Your fictional CEO this week is **Mr Kunle Adebayo**, founder of **Greenline Solar**, a solar installation company in Lagos. On **Thursday 23 April, 10:00–11:00 WAT, on Google Meet**, he holds the monthly **leadership meeting**. He asks you to prepare the agenda. Topics he gave you:

- April sales and installations (Mrs Yemi Coker, Sales, 15 minutes)
- Inverter supply delays from the Chinese supplier (Mr Ikenna Obi, Operations, 15 minutes)
- Hiring two installers for Abuja (Ms Rita Musa, HR, 10 minutes)
- Customer complaints about installation dates (Mr Ikenna Obi, 10 minutes)

The meeting also opens with a welcome and last month's action items (Mr Adebayo, 5 minutes) and closes with any other business and next steps (5 minutes). Pre-reading: the April sales report (in the shared drive), to be read before the meeting. You will send the agenda on Tuesday 21 April.`;

const AGENDA_DOC = `# Agenda: Greenline Solar leadership meeting

- Date:
- Time:
- Location:
- Chair:
- Objective:

## Items

| Time | Item | Lead |
|---|---|---|

## Pre-reading
`;

const AGENDA_DONE = `# Agenda: Greenline Solar leadership meeting

- Date: Thursday 23 April
- Time: 10:00–11:00 WAT
- Location: Google Meet (link in the calendar invitation)
- Chair: Mr Kunle Adebayo
- Objective: Review April performance and agree actions on supply delays, hiring and installation complaints.

## Items

| Time | Item | Lead |
|---|---|---|
| 10:00 | Welcome and last month's action items | Mr Kunle Adebayo |
| 10:05 | April sales and installations | Mrs Yemi Coker |
| 10:20 | Inverter supply delays from the Chinese supplier | Mr Ikenna Obi |
| 10:35 | Hiring two installers for Abuja | Ms Rita Musa |
| 10:45 | Customer complaints about installation dates | Mr Ikenna Obi |
| 10:55 | Any other business and next steps | Mr Kunle Adebayo |

## Pre-reading

- April sales report (shared drive): please read before the meeting.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 4.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l21-daily-admin",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1"],
    title: "Managing Daily Administrative Responsibilities",
    subtitle: "Routines, task tracking and the urgent–important matrix",
    estimatedMinutes: 35,
    intro:
      "Administrative work is a stream that never stops: messages, requests, bookings, documents. The VAs who thrive are not the fastest; they have a routine and a system.",

    atoms: [
      {
        id: "a-va-routine",
        title: "A daily administrative routine",
        explain:
          "A routine makes sure nothing is forgotten on busy days. Start of day (30 minutes): check the client's inbox, messages and calendar; flag anything urgent; confirm today's meetings and send reminders; update your task list. Core work in focused blocks: the day's planned tasks, longest or most important first. Regular sweeps: check the inbox and messages at set times (for example 9:00, 12:00, 15:00) rather than constantly, unless the client needs instant replies. End of day (20 minutes): update the task list, prepare tomorrow's meetings, and send an end-of-day update: what was done, what is in progress, what you need from the client. Write repeated processes down as SOPs (standard operating procedures): short step-by-step guides such as \"How to process a new order\". SOPs keep quality consistent and let someone cover for you.",
      },
      {
        id: "a-va-task-system",
        title: "One trusted task system",
        explain:
          "Keep every task in one trusted place, not in your head, on sticky notes and in three apps. It can be a project tool (Trello, Asana, ClickUp), a shared Google Sheet or Microsoft To Do, as long as the client can see it. Each task needs a clear action (\"Book Abuja hotel for 14–16 May\", not \"hotel\"), a due date, a priority, and its status. When a request arrives by email, chat or call, capture it in the system at once. Review the whole list daily, and confirm priorities with the client when there is more work than time.",
      },
      {
        id: "a-va-eisenhower",
        title: "Prioritising: urgent versus important",
        explain:
          "The urgent–important (Eisenhower) matrix sorts tasks into four groups. Urgent and important: do now (a flight cancelled today, a contract due by 5pm). Important but not urgent: schedule a time to do it properly (next month's event planning, the filing system). Urgent but not important to you: delegate or route to the right person (a supplier's question that the accountant should answer). Neither urgent nor important: delete or drop (an unsubscribed newsletter, a duplicate request). Importance is judged by the client's goals, not by how loud the request is. Most stress comes from important tasks left until they become urgent, so protect time for the second group.",
        table: {
          caption: "The four groups.",
          headers: ["", "Urgent", "Not urgent"],
          rows: [
            ["Important", "Do now", "Schedule"],
            ["Not important", "Delegate or route", "Delete or drop"],
          ],
        },
      },
      {
        id: "a-va-priority-desk",
        title: "Sorting Monday's tasks",
        explain:
          "Your client runs a fitness studio. It is Monday 9:00 and these tasks are waiting. Sort each into the urgent–important matrix.",
        deskLab: {
          app: "tasks",
          title: "Monday 09:00 · FitHub Studio",
          task: "Choose the action for each task: Do now, Schedule, Delegate or route, or Delete or drop.",
          fields: [{ key: "action", label: "Action", type: "select", options: ["Do now", "Schedule", "Delegate or route", "Delete or drop"] }],
          items: [
            { id: "d1", title: "The trainer for today's 10:00 class has called in sick; 14 members are booked", expect: { action: "Do now" }, why: "Urgent and important: find cover or notify members before 10:00." },
            { id: "d2", title: "Plan the studio's anniversary event next month", expect: { action: "Schedule" }, why: "Important for the business, not due today: block time for it." },
            { id: "d3", title: "A member asks a detailed question about VAT on her invoice", expect: { action: "Delegate or route" }, why: "The accountant should answer tax questions." },
            { id: "d4", title: "A third copy of the same gym-equipment newsletter", expect: { action: "Delete or drop" }, why: "Neither urgent nor important: delete and unsubscribe." },
            { id: "d5", title: "The insurance renewal expires at midnight tonight", expect: { action: "Do now" }, why: "Urgent and important: the studio cannot run uninsured." },
            { id: "d6", title: "Write an SOP for how to onboard new members", expect: { action: "Schedule" }, why: "Important and not urgent: the kind of task that prevents future fires." },
            { id: "d7", title: "The cleaning company asks which day the deep clean should happen; the studio manager decides this", expect: { action: "Delegate or route" }, why: "Route it to the person who decides." },
            { id: "d8", title: "A sales call offering branded pens", expect: { action: "Delete or drop" }, why: "Not needed: politely decline or ignore." },
          ],
          solution: {
            d1: { action: "Do now" }, d2: { action: "Schedule" }, d3: { action: "Delegate or route" }, d4: { action: "Delete or drop" },
            d5: { action: "Do now" }, d6: { action: "Schedule" }, d7: { action: "Delegate or route" }, d8: { action: "Delete or drop" },
          },
          rules: [
            { label: "No more than two tasks marked Do now", check: "return count((r) => r.action === 'Do now') <= 2;", fail: "If everything is \"Do now\", nothing is. Only the truly urgent and important tasks belong there." },
          ],
          hint: "Ask two questions for each: does it matter to the client's goals (important)? Must it happen today (urgent)?",
          successMessage: "Two fires, two important tasks protected, two routed, two dropped: a calm Monday.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 4.2 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l22-inbox",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.2", "4.3"],
    title: "Inbox Management",
    subtitle: "Organising, labelling, filtering, prioritising and archiving a client's email",
    estimatedMinutes: 45,
    intro:
      "Inbox management is the service clients ask VAs for most. Done well, the client opens their email and sees only what needs them.",

    atoms: [
      {
        id: "a-va-inbox-method",
        title: "Organising an inbox: the four Ds",
        explain:
          "Process every email once, with one of four decisions, sometimes called the four Ds. Delete (or archive) what needs no action: notifications, newsletters, confirmations already filed. Do it now if it takes two minutes or less: a quick reply, forwarding an invoice to the accountant. Delegate: forward it to the person who should handle it, with a short note, and track that it is done. Defer: if it takes longer or needs the client, label it for action and add it to the task list with a date. The goal (\"inbox zero\") is not an empty inbox for its own sake, but an inbox where every remaining email is something that still needs attention. Agree with the client which emails you answer yourself, which you draft for their approval, and which only they handle.",
      },
      {
        id: "a-va-labels",
        title: "Labels, folders, flags and archiving",
        explain:
          "Gmail uses labels (an email can have several) and an Archive button that removes an email from the inbox but keeps it, searchable, in All Mail. Outlook uses folders (one place per email), categories (coloured tags, several per email) and flags with due dates; its Archive folder works like Gmail's archive. A simple, effective system: a few action labels (1-Action: client, 2-Waiting for reply, 3-Read later) plus a few reference labels (Clients, Finance/Receipts, Travel). Numbers keep the action labels at the top. Star or flag the client's VIPs. Archive, do not delete, anything that might be needed later: business email is a record. Delete only spam, obvious junk and true duplicates.",
        table: {
          caption: "A simple label system for an executive's inbox.",
          headers: ["Label", "Use for"],
          rows: [
            ["1-Action: Client", "Emails only the client can answer or decide"],
            ["2-Waiting for reply", "You replied and are waiting for someone else"],
            ["3-Read later", "Useful reading with no action"],
            ["Finance", "Invoices, receipts and payment emails (after forwarding to the accountant)"],
            ["Travel", "Bookings, tickets and itineraries"],
          ],
        },
      },
      {
        id: "a-va-filters",
        title: "Filters, rules and search operators",
        explain:
          "Filters (Gmail) and rules (Outlook) act on emails automatically as they arrive: label all receipts from Paystack as Finance and skip the inbox; star anything from the board chairman; send newsletters to Read later. They are built from search operators, which also make you fast at finding any email. In Gmail: from:paystack.com (from a sender or domain), to:, subject:invoice, has:attachment, filename:pdf, \"exact phrase\", before:2026/03/01 and after:, is:unread, label:Finance, and a minus sign to exclude (-from:newsletter). Outlook's search uses similar words (from:, subject:, hasattachments:yes). Test a filter's search first to check what it would catch, so it never hides an important email.",
        decision: {
          scenario: "Your client wants every receipt from Paystack, which always arrives from an address ending @paystack.com with \"Receipt\" in the subject, to skip the inbox and be labelled Finance.",
          question: "Which search should the Gmail filter use?",
          options: [
            { id: "a", text: "from:paystack.com subject:receipt", why: "Right. It catches only receipts from Paystack's domain." },
            { id: "b", text: "receipt", whyWrong: "That would also hide receipts and messages from anyone that contain the word, including customer emails." },
            { id: "c", text: "from:paystack.com", whyWrong: "That would also hide Paystack security alerts and failed-payment notices, which the client should see." },
            { id: "d", text: "has:attachment", whyWrong: "That would hide every email with an attachment." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-inbox-desk",
        title: "Triage an executive's inbox",
        explain:
          "Mrs Nwosu's agreement with you: you answer scheduling and routine supplier questions yourself, forward finance emails to Ms Garba (Finance), and leave for her only what needs her decision. Label and act on each email.",
        deskLab: {
          app: "inbox",
          title: "Adaeze Nwosu · Inbox · Tuesday 08:05",
          task: "For each email, choose its label and your action.",
          brief: "Labels: **1-Action: Client** (needs Mrs Nwosu), **2-Waiting for reply**, **3-Read later**, **Finance**, **Travel**. Agreement: you handle scheduling and routine supplier questions; finance goes to Ms Garba; only decisions go to Mrs Nwosu. Spam is deleted; everything else is archived when done.",
          briefTitle: "Your inbox agreement",
          fields: [
            { key: "label", label: "Label", type: "select", options: ["1-Action: Client", "2-Waiting for reply", "3-Read later", "Finance", "Travel", "None (spam)"] },
            { key: "action", label: "Action", type: "select", options: ["Reply myself now", "Forward to Ms Garba", "Flag for Mrs Nwosu", "Archive", "Delete"] },
          ],
          items: [
            { id: "e1", title: "Can we move Thursday's call to Friday 11:00?", meta: "From: Tunde Bakare (Sales)", expect: { label: "2-Waiting for reply", action: "Reply myself now" }, hint: "Scheduling is yours; after you reply, you wait for his confirmation.", why: "You handle scheduling: reply with her availability, then it waits for his confirmation." },
            { id: "e2", title: "Invoice INV-3381 from Kano Packaging, due 30 April", meta: "From: accounts@kanopackaging.ng", expect: { label: "Finance", action: "Forward to Ms Garba" }, why: "Finance emails go to Ms Garba, labelled Finance." },
            { id: "e3", title: "Partnership proposal: distribute our snacks in your stores?", meta: "From: CEO, Lagos Mart", expect: { label: "1-Action: Client", action: "Flag for Mrs Nwosu" }, why: "A strategic decision only the CEO can make." },
            { id: "e4", title: "Your e-ticket: Lagos → Accra, 15 April", meta: "From: Africa World Airlines", expect: { label: "Travel", action: "Archive" }, why: "Label it Travel and archive: it is a record, with no action needed." },
            { id: "e5", title: "Weekly food industry newsletter", meta: "From: FoodBiz Weekly", expect: { label: "3-Read later", action: "Archive" }, why: "Useful reading, no action: Read later, out of the inbox." },
            { id: "e6", title: "Congratulations! You have won a $500,000 lottery", meta: "From: intl-lotto-claims@winmail.biz", expect: { label: "None (spam)", action: "Delete" }, why: "Spam: delete." },
            { id: "e7", title: "Can you confirm the delivery address for next week's sample order?", meta: "From: Kano Packaging (supplier)", expect: { label: "2-Waiting for reply", action: "Reply myself now" }, hint: "A routine supplier question you can answer.", why: "Routine supplier questions are yours; reply with the office address." },
            { id: "e8", title: "Draft budget for 2027: please approve by Friday", meta: "From: Halima Garba (Finance)", expect: { label: "1-Action: Client", action: "Flag for Mrs Nwosu" }, hint: "Who must approve a budget?", why: "Approving the budget is the CEO's decision, even though it comes from Finance." },
          ],
          solution: {
            e1: { label: "2-Waiting for reply", action: "Reply myself now" }, e2: { label: "Finance", action: "Forward to Ms Garba" }, e3: { label: "1-Action: Client", action: "Flag for Mrs Nwosu" }, e4: { label: "Travel", action: "Archive" },
            e5: { label: "3-Read later", action: "Archive" }, e6: { label: "None (spam)", action: "Delete" }, e7: { label: "2-Waiting for reply", action: "Reply myself now" }, e8: { label: "1-Action: Client", action: "Flag for Mrs Nwosu" },
          },
          rules: [
            { label: "Only real decisions are flagged for Mrs Nwosu (at most three)", check: "return count((r) => r.action === 'Flag for Mrs Nwosu') <= 3;", fail: "You are flagging too much for the CEO. Handle scheduling and routine questions yourself." },
            { label: "Nothing but spam is deleted", check: "return all((r) => r.action !== 'Delete' || r.label === 'None (spam)');", fail: "Archive business email; delete only spam." },
          ],
          hint: "Apply the agreement: yours (scheduling, routine supplier questions), Finance's (invoices and payments), or hers (decisions).",
          successMessage: "Eight emails processed in minutes. Mrs Nwosu opens her inbox and sees only two decisions.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 4.4 – 4.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l23-calendar",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.4", "4.5"],
    title: "Calendar Management and Scheduling",
    subtitle: "Keeping an executive's calendar realistic, and scheduling meetings without clashes",
    estimatedMinutes: 50,
    intro:
      "An executive's calendar is their most valuable resource. Managing it means protecting their time, not just filling empty slots.",

    atoms: [
      {
        id: "a-va-calendar",
        title: "Calendar management",
        explain:
          "Start with the client's preferences, written down: working hours, best times for focus work, meeting-free days, how long meetings usually last, buffer time between meetings, lunch, travel time, and who can book them directly. Then manage the calendar to protect those preferences. Colour-code event types (client meetings, internal, focus time, personal). Block focus time and lunch as real events so others cannot book over them. Add buffers (10–15 minutes) between meetings and travel time before in-person ones. Every event should have a clear title (\"Brightwave × Lagos Mart: partnership call\"), the time zone, the location or video link, the agenda or purpose, and any documents. Review the next day's and next week's calendar daily: spot clashes, missing links, and meetings that need preparation. Google Calendar and Outlook both let you add a secondary time zone and see colleagues' free/busy times.",
      },
      {
        id: "a-va-scheduling",
        title: "Scheduling appointments and meetings",
        explain:
          "To schedule a meeting: confirm the purpose, attendees, length and format (in person, phone, video); check the client's calendar and preferences; offer two or three specific slots in the other person's time zone too; once a slot is chosen, send a calendar invitation (not just an email) with title, time zone, link or address, agenda and dial-in details; and send a reminder the day before for important or external meetings. Scheduling tools such as Calendly or Microsoft Bookings let people pick from the client's available times themselves, which removes the back-and-forth for routine bookings. When rescheduling, apologise briefly, offer new times at once and update the original invitation rather than creating a new one, so everyone's calendar stays correct.",
        mistake:
          "Booking a meeting into the only free hour of a day full of meetings. A calendar with no breaks is technically free and practically impossible. Leave buffers.",
      },
      {
        id: "a-va-calendar-tz",
        title: "Scheduling across time zones",
        explain:
          "When attendees are in different countries, find the overlap of their working hours. Lagos (WAT) and New York in summer (EDT): New York's 9:00–17:00 is 14:00–22:00 in Lagos, so the overlap with a Lagos 9:00–17:00 day is 14:00–17:00 WAT. London in summer is the same as Lagos, so any working hour works. With US Pacific clients the overlap is tiny or nothing, so one side must go early or late: agree who, and do not make it always the other person. Always put both times in the invitation description, and let the calendar's time-zone setting do the conversion for each attendee.",
      },
      {
        id: "a-va-calendar-desk",
        title: "Scheduling Mrs Nwosu's week",
        explain:
          "Place five meetings in Mrs Nwosu's week. The grey blocks are already booked. Choose a day and a start time for each meeting; the week view shows your placements, and clashes turn red. Read each meeting's constraint.",
        deskLab: {
          app: "calendar",
          title: "Adaeze Nwosu · Week of 20 April · times in WAT",
          task: "Choose a day and start time for each meeting. Respect every constraint, keep everything between 09:00 and 17:00 WAT, and do not create any clash.",
          brief: "Her preferences: meetings between **09:00 and 17:00 WAT**; **Wednesday morning (09:00–12:00) is focus time** and is already blocked; lunch **13:00–14:00** daily is blocked. Start times on the hour or half hour.",
          briefTitle: "Calendar preferences",
          calendar: {
            days: DAYS,
            from: "08:00",
            to: "18:00",
            fixed: [
              { day: "Mon", start: "09:00", end: "11:00", title: "Board prep" },
              { day: "Mon", start: "13:00", end: "14:00", title: "Lunch" },
              { day: "Tue", start: "13:00", end: "14:00", title: "Lunch" },
              { day: "Tue", start: "15:00", end: "17:00", title: "Factory visit" },
              { day: "Wed", start: "09:00", end: "12:00", title: "Focus time" },
              { day: "Wed", start: "13:00", end: "14:00", title: "Lunch" },
              { day: "Thu", start: "10:00", end: "11:00", title: "Leadership meeting" },
              { day: "Thu", start: "13:00", end: "14:00", title: "Lunch" },
              { day: "Fri", start: "13:00", end: "14:00", title: "Lunch" },
              { day: "Fri", start: "14:00", end: "17:00", title: "Off-site" },
            ],
          },
          fields: [
            { key: "day", label: "Day", type: "select", options: DAYS },
            { key: "start", label: "Start (WAT)", type: "time" },
          ],
          items: [
            { id: "c1", title: "Partnership call with Lagos Mart CEO", short: "Lagos Mart", meta: "60 min · must be on Monday or Tuesday", duration: 60, check: "return ['Mon', 'Tue'].includes(val.day) && Number.isFinite(mins(val.start));", hint: "Monday or Tuesday only.", why: "Any free hour on Monday or Tuesday that avoids her fixed blocks works." },
            { id: "c2", title: "Investor update with a New York fund", short: "NY investor", meta: "60 min · New York's working day starts at 09:00 EDT (14:00 WAT)", duration: 60, check: "return mins(val.start) >= mins('14:00');", hint: "09:00 in New York in April (EDT) is 14:00 in Lagos.", why: "New York's 09:00 EDT is 14:00 WAT, so the call must start at 14:00 WAT or later." },
            { id: "c3", title: "One-to-one with Ms Garba (Finance)", short: "1:1 Garba", meta: "30 min · Ms Garba is only in on Wednesday and Thursday", duration: 30, check: "return ['Wed', 'Thu'].includes(val.day);", hint: "Wednesday or Thursday, avoiding focus time.", why: "Wednesday afternoon or Thursday, outside focus time, lunch and the leadership meeting." },
            { id: "c4", title: "Interview: Head of Marketing candidate", short: "Interview", meta: "90 min · must be in the morning (finish by 12:00)", duration: 90, check: "return mins(val.start) + 90 <= mins('12:00');", hint: "It must end by 12:00, so start by 10:30.", why: "A 90-minute morning interview must start by 10:30 to end by 12:00." },
            { id: "c5", title: "Weekly sales review with Tunde Bakare", short: "Sales review", meta: "60 min · on Friday", duration: 60, check: "return val.day === 'Fri';", hint: "Friday, before the off-site.", why: "Friday morning or 12:00: the afternoon is the off-site." },
          ],
          rules: [
            { label: "No clashes with booked blocks or with each other", check: "return !clashes();", fail: "Two things overlap: look for red blocks in the week view." },
            { label: "Everything between 09:00 and 17:00 WAT", check: "return placed().length === 5 && within('09:00', '17:00');", fail: "Place all five meetings, each starting and ending between 09:00 and 17:00 WAT." },
          ],
          solution: {
            c1: { day: "Mon", start: "11:00" },
            c2: { day: "Mon", start: "14:00" },
            c3: { day: "Wed", start: "14:00" },
            c4: { day: "Tue", start: "09:00" },
            c5: { day: "Fri", start: "09:00" },
          },
          hint: "Place the most constrained meeting first (the interview needs 90 free minutes before noon; the investor call needs 14:00 or later), then fit the flexible ones around them.",
          successMessage: "A full week, no clashes, focus time and lunch protected, and the New York call in their working hours.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l24-travel",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.6"],
    title: "Travel Research and Itineraries",
    subtitle: "Researching flights and hotels against a policy, and preparing a clear itinerary",
    estimatedMinutes: 50,
    intro:
      "Travel is where small mistakes become expensive: a wrong date, a missed connection, a passport that expires. A VA who plans travel calmly and precisely becomes indispensable.",

    atoms: [
      {
        id: "a-va-travel-research",
        title: "Travel research",
        explain:
          "Start with the requirements: dates and times of the event, where it is, when the traveller must be back, their travel policy (class, budget, preferred airlines), and personal preferences (window or aisle, arrive the night before). Compare flights on Google Flights or Skyscanner and check the airline's own site before booking; compare total journey time, departure and arrival times (in local time), stops, baggage, change and refund rules, and price. For hotels, compare location (distance to the venue on Google Maps), price per night with taxes, reviews, breakfast and cancellation terms (Booking.com, Google Hotels, the hotel's site). Check entry rules: passport validity (many countries require six months), visas (ECOWAS citizens need none within West Africa; the UK, US and Schengen countries need applications weeks in advance), and any health requirements. Present two or three options with a recommendation and the reason.",
      },
      {
        id: "a-va-itinerary",
        title: "Preparing an itinerary",
        explain:
          "An itinerary is one document that holds everything the traveller needs, in time order, readable on a phone. Include: a summary (purpose, dates, destination); a day-by-day schedule of every movement and meeting with times in local time and the time zone stated (\"16:10 GMT\"); flight numbers and booking references; hotel name, address and confirmation number; ground transport and driver contacts; meeting addresses and contacts; and notes (time difference, visa, weather, local currency, emergency numbers). Save it as a PDF and in the shared drive, add the flights and hotel to the calendar, and send it a few days before travel. Keep copies of tickets and confirmations in the Travel label or folder.",
      },
      {
        id: "a-va-travel-lab",
        title: "Planning the Accra trip",
        explain:
          "Choose the flight and hotel that meet Mrs Nwosu's policy and preferences, then write her itinerary.",
        writingLab: {
          task:
            "Summary: the flight option (A, B or C) and hotel you choose, and why (mention the budget and timing). Itinerary: a table with at least 7 rows covering departure, arrival, hotel check-in, the summit, check-out and the return flight, with every time marked WAT or GMT. Bookings: the flight reference AWA7Q2 and hotel confirmation MV-55821. Contacts and notes: the driver's name and number, the time difference, and the passport note.",
          brief: TRAVEL_BRIEF,
          doc: TRAVEL_DOC,
          tests: [
            { label: "Chooses flight B", check: String.raw`const f = field(section('Summary') || '', 'Flight option') || ''; return /\bB\b|africa world/i.test(f) && !/\b(A|C)\b(?! ?frica)/.test(f.replace(/africa world airlines/i, ''));`, fail: "Check each flight against the rules: A arrives after 20:00 (21:40 GMT), C costs $980, over the $700 limit. Only B fits." },
            { label: "Chooses the hotel within policy", check: String.raw`return /movenpick/i.test(field(section('Summary') || '', 'Hotel') || '');`, fail: "The Kempinski is $310 a night, over the $250 limit. Choose the Movenpick." },
            { label: "Explains the choice with budget and timing", check: String.raw`const w = field(section('Summary') || '', 'Why') || ''; return /(\$700|budget|limit|policy)/i.test(w) && /(20:00|arrive|board|15:00)/i.test(w);`, fail: "In \"Why\", mention the budget limit and the timing (arrival before 20:00, back for the board meeting)." },
            { label: "An itinerary table of at least 7 rows, every time with WAT or GMT", check: String.raw`const r = rows(section('Itinerary') || ''); return r.length >= 7 && r.every((x) => /(WAT|GMT)/.test(x[1] || ''));`, fail: "Give at least seven rows, and write WAT or GMT with every time." },
            { label: "Covers flights, check-in, the summit and check-out", check: String.raw`const t = rows(section('Itinerary') || '').map((x) => x.join(' ')).join(' '); return /16:00/.test(t) && /16:10/.test(t) && /check.?in/i.test(t) && /summit/i.test(t) && /check.?out/i.test(t) && /09:30/.test(t) && /11:40/.test(t);`, fail: "Include the outbound flight (16:00 WAT, arrives 16:10 GMT), check-in, the summit, check-out and the return flight (09:30 GMT, arrives 11:40 WAT)." },
            { label: "Booking references", check: String.raw`const b = section('Bookings') || ''; return /AWA7Q2/.test(b) && /MV-55821/.test(b);`, fail: "List the flight reference AWA7Q2 and the hotel confirmation MV-55821." },
            { label: "Driver, time difference and passport", check: String.raw`const n = section('Contacts') || ''; return /kwame asante/i.test(n) && /\+233 ?24 ?555 ?0187/.test(n) && /(one hour|1 hour)/i.test(n) && /passport/i.test(n);`, fail: "Add the driver's name and number, the one-hour time difference and a passport reminder." },
          ],
          solution: TRAVEL_DONE,
          hint: "Test each flight against three rules: price under $700, arrival before 20:00 local time on Wednesday, home before the 15:00 board meeting on Friday.",
          successMessage: "A policy-compliant trip and an itinerary she can follow from her phone without calling you once.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 4.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l25-agendas-minutes",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.7"],
    title: "Agendas and Meeting Minutes",
    subtitle: "Preparing agendas that make meetings work, and minutes that make decisions stick",
    estimatedMinutes: 45,
    intro:
      "Meetings without an agenda wander; meetings without minutes are forgotten. Preparing both is a classic executive-assistant task, and an easy way to show you are excellent.",

    atoms: [
      {
        id: "a-va-agenda",
        title: "Preparing an agenda",
        explain:
          "An agenda tells attendees why they are meeting and what will be covered, so they can prepare. Include: the meeting title, date, time with time zone, location or link and chair; a one-sentence objective (what the meeting must achieve); the items in order, each with a start time or duration and the person who leads it; and any pre-reading with where to find it. Put decisions and the most important items early, while people are fresh. Start with last meeting's action items and end with any other business (AOB) and next steps. Send it with the invitation or 24–48 hours before, with documents attached or linked.",
      },
      {
        id: "a-va-minutes",
        title: "Taking and writing minutes",
        explain:
          "Minutes are the official record of a meeting: not a transcript, but what was decided and who will do what. Before the meeting, prepare a template from the agenda. During it, note attendees and apologies (people who sent their regrets), key points briefly, every decision exactly, and every action with its owner and due date; ask the chair to confirm an action if it is unclear. Afterwards, write the minutes within 24 hours: the header (date, time, place, chair), attendees, apologies, discussion and decisions by agenda item (in neutral, past-tense language, without opinions), an action table (action, owner, due date), and the next meeting. Send them to the chair for approval, then to attendees. Track the action items until they are done.",
        mistake:
          "Writing \"Halima will look into the debts\". Every action needs a specific task, one named owner and a date: \"Halima Garba: send final payment reminders to the two distributors by 13 March.\"",
      },
      {
        id: "a-va-minutes-lab",
        title: "Turning rough notes into minutes",
        explain:
          "Turn your rough notes from the Brightwave management meeting into proper minutes.",
        writingLab: {
          task:
            "Fill the header (date, time, Microsoft Teams, chair). List the four attendees and the minute-taker as bullets, and Mrs Funmi Ade under Apologies. Under Discussion and decisions, write a bullet per topic in full sentences, past tense, including both decisions (the debtor deadline of 31 March and the Kano lease approval starting 1 May) and the undecided sales-rep request. Action items: a table with exactly the four actions from the notes, each with one owner and a due date. Next meeting: Monday 13 April, 10:00.",
          brief: NOTES_BRIEF,
          doc: MIN_DOC,
          tests: [
            { label: "Header complete", check: String.raw`return /9 march/i.test(field(doc, 'Date') || '') && /10:00/.test(field(doc, 'Time') || '') && /teams/i.test(field(doc, 'Location') || '') && /nwosu/i.test(field(doc, 'Chair') || '');`, fail: "Fill in the date, time, location (Microsoft Teams) and chair." },
            { label: "Attendees and apologies", check: String.raw`const a = bullets(section('Attendees') || '').join(' '); const ap = section('Apologies') || ''; return ['nwosu', 'bakare', 'garba', 'okeke'].every((n) => new RegExp(n, 'i').test(a)) && /funmi ade/i.test(ap) && !/funmi/i.test(a);`, fail: "List the four attendees (plus the minute-taker) and put Mrs Funmi Ade under Apologies, not Attendees." },
            { label: "Both decisions recorded", check: String.raw`const d = section('Discussion') || ''; return /31 march/i.test(d) && /legal/i.test(d) && /lease/i.test(d) && /1 may/i.test(d) && /(approv|decision|decided|agreed)/i.test(d);`, fail: "Record the decisions: debts unpaid by 31 March go to legal; the CEO approved the Kano lease starting 1 May." },
            { label: "The undecided item is recorded as not decided", check: String.raw`const d = section('Discussion') || ''; return /(representative|reps?\b)/i.test(d) && /(not decided|no decision|deferred|postponed|was not)/i.test(d);`, fail: "Record that the request for two new sales representatives was not decided (HR was absent)." },
            { label: "Four actions, each with an owner and a due date", check: String.raw`const r = rows(section('Action') || ''); return r.length === 4 && r.every((x) => x[0] && x[1] && /\d{1,2} march/i.test(x[2] || ''));`, fail: "Make a table with the four actions, each with one owner and a due date in March." },
            { label: "The right owners and dates", check: String.raw`const t = rows(section('Action') || '').map((x) => x.join(' | ')).join('\n'); return /garba[^\n]*13 march/i.test(t) && /okeke[^\n]*20 march/i.test(t) && /bakare[^\n]*18 march/i.test(t) && /(assistant|va\b)[^\n]*16 march/i.test(t);`, fail: "Match each action to its owner and date: Garba 13 March, Okeke 20 March, Bakare 18 March, the VA 16 March." },
            { label: "Neutral, past-tense discussion and the next meeting", check: String.raw`const d = section('Discussion') || ''; return /(were|was|approved|agreed)/i.test(d) && !/(I think|in my opinion|great|amazing)/i.test(d) && /13 april/i.test(section('Next meeting') || '');`, fail: "Write the discussion neutrally in the past tense, without opinions, and give the next meeting date (13 April)." },
          ],
          solution: MIN_DONE,
          hint: "Go through the notes line by line and sort each into one of three buckets: a decision, an action (owner and date), or information.",
          successMessage: "Minutes anyone could act on, even someone who missed the meeting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 4.8 – 4.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l26-documents-data",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.8", "4.9"],
    title: "Documents, Data Entry and Record Keeping",
    subtitle: "Professional document formatting, accurate data entry and records that can be trusted",
    estimatedMinutes: 45,
    intro:
      "Clients notice sloppy formatting and wrong data immediately, and forget good work just as quickly. Aim to be forgettably perfect.",

    atoms: [
      {
        id: "a-va-doc-prep",
        title: "Document preparation and formatting",
        explain:
          "Professional documents look consistent. Use the client's template or letterhead when one exists. Use built-in heading styles (Heading 1, Heading 2) rather than making text bold and large by hand: styles keep formatting consistent and build a table of contents automatically. One or two fonts only, a readable size (11–12 pt for body text), consistent spacing, aligned bullets and tables, page numbers, and a date and version on drafts. Proofread with a checklist: names and titles spelled correctly, figures and dates checked against the source, consistent spelling (British or American), headings and numbering in order, no leftover comments or highlighting. Send final documents as PDF and keep the editable original in the shared drive, named with the convention.",
      },
      {
        id: "a-va-data-entry",
        title: "Accurate data entry",
        explain:
          "Data entry means transferring information from a source (forms, business cards, invoices, emails) into a system (a spreadsheet, CRM or database) accurately. Accuracy matters more than speed: one wrong digit in a phone number or invoice amount causes real problems. Follow the system's formats exactly: dates as the system expects (for example YYYY-MM-DD), phone numbers in international format (+234 803 555 0192), names in proper case (Ngozi Okafor, not NGOZI OKAFOR), emails in lower case, one value per cell. Do not invent missing data; mark it as missing. Check your work: compare against the source, use spreadsheet data validation (drop-down lists, date-only cells) where you can, and spot-check a sample of records. Type with all fingers; speed comes from accuracy practised daily (the Academy's Typing Dojo helps).",
      },
      {
        id: "a-va-records",
        title: "Record keeping",
        explain:
          "Good records let the client answer any question quickly and prove what happened. Keep registers (logs) for things that recur: a contacts list, an invoice register, a contracts register with renewal dates, an asset list, a visitor or call log. Each register has the same columns for every entry and one row per item. Record the source and date of changes. Keep records in the shared drive or the client's systems, never only in email or your memory. Follow the client's retention rules (for example, financial records kept for six years in many countries) and dispose of expired records securely. Review registers monthly: renewals coming up, missing information, duplicates.",
      },
      {
        id: "a-va-data-desk",
        title: "Entering contacts into the client's register",
        explain:
          "Mrs Nwosu came back from a trade fair with six business cards. Enter each contact in the register using its formats: names in proper case; email in lower case; phone in international format +234 followed by the number without its first 0, in groups like +234 803 555 0192; and the date met as YYYY-MM-DD (the fair was on 12 March 2026).",
        deskLab: {
          app: "leads",
          title: "Contacts register · Trade fair, 12 March 2026",
          task: "Type each contact's name, email, phone and date met in the register's formats.",
          brief: "Formats: **Name**: proper case (Ngozi Okafor). **Email**: lower case. **Phone**: +234 then the number without its leading 0, spaced as +234 803 555 0192. **Date met**: 2026-03-12 for everyone.",
          briefTitle: "Register formats",
          fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "text" },
            { key: "phone", label: "Phone", type: "text", placeholder: "+234 803 555 0192" },
            { key: "date", label: "Date met", type: "text", placeholder: "YYYY-MM-DD" },
          ],
          items: [
            { id: "b1", title: "Card: CHINEDU OKAFOR · Okafor Agro · C.Okafor@OkaforAgro.com · 0803 555 0192", check: String.raw`return val.name.trim() === 'Chinedu Okafor' && val.email.trim() === 'c.okafor@okaforagro.com' && val.phone.trim() === '+234 803 555 0192' && val.date.trim() === '2026-03-12';`, hint: "Proper case name, lower-case email, +234 803 555 0192, 2026-03-12.", why: "CHINEDU OKAFOR → Chinedu Okafor; the email in lower case; 0803… → +234 803…" },
            { id: "b2", title: "Card: amina bello · Sahel Grains · amina@sahelgrains.ng · 0706 222 4410", check: String.raw`return val.name.trim() === 'Amina Bello' && val.email.trim() === 'amina@sahelgrains.ng' && val.phone.trim() === '+234 706 222 4410' && val.date.trim() === '2026-03-12';`, why: "amina bello → Amina Bello; 0706 → +234 706." },
            { id: "b3", title: "Card: Tolu Adeyemi · FreshPack · Tolu.Adeyemi@FreshPack.NG · 0812 909 3301", check: String.raw`return val.name.trim() === 'Tolu Adeyemi' && val.email.trim() === 'tolu.adeyemi@freshpack.ng' && val.phone.trim() === '+234 812 909 3301' && val.date.trim() === '2026-03-12';`, why: "Emails are not case-sensitive, so store them in lower case." },
            { id: "b4", title: "Card: GRACE EKPO · Cross River Foods · gekpo@crfoods.com · 0901 333 7702", check: String.raw`return val.name.trim() === 'Grace Ekpo' && val.email.trim() === 'gekpo@crfoods.com' && val.phone.trim() === '+234 901 333 7702' && val.date.trim() === '2026-03-12';`, why: "Proper case and the international phone format." },
            { id: "b5", title: "Card: Ibrahim Musa · Kano Dairies · ibrahim.musa@kanodairies.com · 0805 118 2290", check: String.raw`return val.name.trim() === 'Ibrahim Musa' && val.email.trim() === 'ibrahim.musa@kanodairies.com' && val.phone.trim() === '+234 805 118 2290' && val.date.trim() === '2026-03-12';`, why: "Same formats for every row: that is what makes a register searchable." },
            { id: "b6", title: "Card: nkechi obi · Obi Logistics · N.OBI@OBILOGISTICS.COM · 0703 444 9015", check: String.raw`return val.name.trim() === 'Nkechi Obi' && val.email.trim() === 'n.obi@obilogistics.com' && val.phone.trim() === '+234 703 444 9015' && val.date.trim() === '2026-03-12';`, why: "Both the name and the email needed fixing." },
          ],
          solution: {
            b1: { name: "Chinedu Okafor", email: "c.okafor@okaforagro.com", phone: "+234 803 555 0192", date: "2026-03-12" },
            b2: { name: "Amina Bello", email: "amina@sahelgrains.ng", phone: "+234 706 222 4410", date: "2026-03-12" },
            b3: { name: "Tolu Adeyemi", email: "tolu.adeyemi@freshpack.ng", phone: "+234 812 909 3301", date: "2026-03-12" },
            b4: { name: "Grace Ekpo", email: "gekpo@crfoods.com", phone: "+234 901 333 7702", date: "2026-03-12" },
            b5: { name: "Ibrahim Musa", email: "ibrahim.musa@kanodairies.com", phone: "+234 805 118 2290", date: "2026-03-12" },
            b6: { name: "Nkechi Obi", email: "n.obi@obilogistics.com", phone: "+234 703 444 9015", date: "2026-03-12" },
          },
          hint: "Phone numbers: drop the first 0, write +234, then keep the three groups: 0803 555 0192 → +234 803 555 0192.",
          successMessage: "Six clean records in one consistent format: searchable, sortable and ready to import into a CRM.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 4.10 – 4.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l27-confidential-exec",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["4.10", "4.11"],
    title: "Confidential Information and Executive Support",
    subtitle: "Classifying and protecting sensitive information, and supporting an executive's priorities",
    estimatedMinutes: 40,
    intro:
      "An executive assistant sees the most sensitive information in a company and protects the executive's most limited resource: their attention.",

    atoms: [
      {
        id: "a-va-classify",
        title: "Managing confidential information",
        explain:
          "Many organisations classify information into levels. Public: meant for anyone (the website, published price lists). Internal: for staff, harmless but not for outsiders (the staff newsletter, internal procedures). Confidential: could harm the business or people if leaked (contracts, client lists, unreleased plans, financial results before publication). Restricted: the most sensitive, for named people only (salaries and HR files, board papers, acquisition plans, passwords, health information). Handle each level accordingly: share confidential and restricted information only with people who need to know it, through the client's secure systems, never by personal email or WhatsApp; do not print restricted documents unless necessary, and shred them afterwards; label documents; and never leave them on screen in public places. If you share something with the wrong person by mistake, tell the client immediately: fast reporting limits the damage.",
      },
      {
        id: "a-va-exec-support",
        title: "Executive support",
        explain:
          "Executive support means multiplying an executive's effectiveness. Know their priorities: ask what their top three goals are this quarter and use them to judge every request. Gatekeep: protect their time by handling, redirecting or declining requests that do not need them, politely and firmly. Anticipate: prepare before they ask (the briefing note before a meeting, the car before the flight, the reminder before the deadline). Make things decision-ready: when they must decide, give a short summary with the options, your recommendation and the deadline, not a forwarded thread of 40 emails. Manage up: flag problems early with a proposed solution. A briefing note for a meeting usually covers who they are meeting (role, company, history), the purpose, key points and questions, and what the executive wants to achieve.",
        decision: {
          scenario: "A sales rep from an office-supplies company calls for the third time asking to speak to your CEO \"for five minutes\". The CEO does not handle purchasing.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Thank him, explain that purchasing is handled by the operations manager, and offer to pass his details on", why: "Right. Polite, firm gatekeeping that redirects him to the right person." },
            { id: "b", text: "Put him through so he stops calling", whyWrong: "That rewards persistence and wastes the CEO's time." },
            { id: "c", text: "Say the CEO is dead busy and hang up", whyWrong: "Rude: you represent the company." },
            { id: "d", text: "Promise the CEO will call him back", whyWrong: "A promise you cannot keep, and the wrong person." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-classify-desk",
        title: "Classifying and sharing documents",
        explain:
          "Classify each document and choose how it may be shared.",
        deskLab: {
          app: "files",
          title: "Brightwave Foods · Document requests",
          task: "Choose the classification level of each document and how it may be shared.",
          fields: [
            { key: "level", label: "Classification", type: "select", options: ["Public", "Internal", "Confidential", "Restricted"] },
            { key: "share", label: "How it may be shared", type: "select", options: ["Anyone, including on the website", "Staff only, through the company drive", "Named people who need it, through the company drive", "Named people only, never printed or emailed outside the company system"] },
          ],
          items: [
            { id: "x1", title: "The published product price list", expect: { level: "Public", share: "Anyone, including on the website" } },
            { id: "x2", title: "The staff holiday calendar", expect: { level: "Internal", share: "Staff only, through the company drive" } },
            { id: "x3", title: "The signed distribution contract with Lagos Mart", expect: { level: "Confidential", share: "Named people who need it, through the company drive" } },
            { id: "x4", title: "Every employee's salary", expect: { level: "Restricted", share: "Named people only, never printed or emailed outside the company system" } },
            { id: "x5", title: "The plan to acquire a competitor, not yet announced", expect: { level: "Restricted", share: "Named people only, never printed or emailed outside the company system" }, why: "Unannounced acquisitions are among the most sensitive information a company has." },
            { id: "x6", title: "The customer list with phone numbers", expect: { level: "Confidential", share: "Named people who need it, through the company drive" }, why: "Personal data and valuable to competitors: confidential, and protected by data protection law." },
            { id: "x7", title: "The office Wi-Fi guest instructions for visitors", expect: { level: "Internal", share: "Staff only, through the company drive" }, hint: "Harmless, but not for the public website.", why: "Low risk, but there is no reason to publish it." },
          ],
          solution: {
            x1: { level: "Public", share: "Anyone, including on the website" },
            x2: { level: "Internal", share: "Staff only, through the company drive" },
            x3: { level: "Confidential", share: "Named people who need it, through the company drive" },
            x4: { level: "Restricted", share: "Named people only, never printed or emailed outside the company system" },
            x5: { level: "Restricted", share: "Named people only, never printed or emailed outside the company system" },
            x6: { level: "Confidential", share: "Named people who need it, through the company drive" },
            x7: { level: "Internal", share: "Staff only, through the company drive" },
          },
          hint: "Ask: what harm would a leak cause? None (public), little (internal), real harm (confidential), serious harm to people or the company (restricted).",
          successMessage: "Each document matched to its level and its handling: that is how sensitive information stays safe.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l28-practical",
    moduleId: "va-m4-admin",
    sectionId: SECTION_ID,
    order: 8,
    covers: ["4.P"],
    title: "Practical: A Week as Executive Assistant",
    subtitle: "Inbox, calendar and agenda for a fictional CEO",
    estimatedMinutes: 75,
    intro:
      "This week you are executive assistant to Mr Kunle Adebayo, founder of Greenline Solar. Triage his inbox, schedule his week and prepare his leadership meeting agenda. (You planned travel in lesson 24; the itinerary from that lesson completes the practical.)",

    atoms: [
      {
        id: "a-va-m4-inbox",
        title: "Monday: triage Mr Adebayo's inbox",
        explain:
          "His agreement with you: you handle scheduling and routine customer or supplier questions; invoices and payments go to the accountant, Mr Sola Ojo; technical installation questions go to Mr Ikenna Obi (Operations); only decisions and VIPs go to Mr Adebayo.",
        deskLab: {
          app: "inbox",
          title: "Kunle Adebayo · Inbox · Monday 08:00",
          task: "Choose the action for each email, following the agreement.",
          fields: [{ key: "action", label: "Action", type: "select", options: ["Reply myself", "Forward to Mr Ojo (accounts)", "Forward to Mr Obi (operations)", "Flag for Mr Adebayo", "Archive", "Delete as spam"] }],
          items: [
            { id: "i1", title: "Invoice from SunTech Imports for 40 inverters, ₦18.4m, due in 14 days", expect: { action: "Forward to Mr Ojo (accounts)" } },
            { id: "i2", title: "Customer: what size of inverter do I need for a 3-bedroom flat?", expect: { action: "Forward to Mr Obi (operations)" }, why: "A technical sizing question for Operations." },
            { id: "i3", title: "Investor: can Kunle meet on Wednesday or Thursday about the funding round?", expect: { action: "Reply myself" }, hint: "Scheduling is yours, even with investors.", why: "Scheduling is yours: offer times from his calendar (and flag the meeting in his day plan)." },
            { id: "i4", title: "Offer to buy 30% of Greenline Solar from a private equity firm", expect: { action: "Flag for Mr Adebayo" }, why: "A major decision only he can make." },
            { id: "i5", title: "Your Google Workspace receipt for March", expect: { action: "Forward to Mr Ojo (accounts)" }, why: "Receipts go to accounts for the records." },
            { id: "i6", title: "Customer: can my installation move from Tuesday to Thursday?", expect: { action: "Reply myself" }, why: "Routine customer scheduling." },
            { id: "i7", title: "\"Your account will be closed. Verify your BVN here\"", expect: { action: "Delete as spam" } },
            { id: "i8", title: "Monthly solar industry newsletter", expect: { action: "Archive" } },
          ],
          solution: {
            i1: { action: "Forward to Mr Ojo (accounts)" }, i2: { action: "Forward to Mr Obi (operations)" }, i3: { action: "Reply myself" }, i4: { action: "Flag for Mr Adebayo" },
            i5: { action: "Forward to Mr Ojo (accounts)" }, i6: { action: "Reply myself" }, i7: { action: "Delete as spam" }, i8: { action: "Archive" },
          },
          hint: "Who does the agreement say owns each type of email: you, accounts, operations or the CEO?",
          successMessage: "Inbox processed: one decision for the CEO, everything else handled or routed.",
        },
      },
      {
        id: "a-va-m4-week",
        title: "Tuesday: schedule his week",
        explain:
          "Schedule four meetings in Mr Adebayo's week. The leadership meeting is already fixed on Thursday at 10:00.",
        deskLab: {
          app: "calendar",
          title: "Kunle Adebayo · Week of 20 April · WAT",
          task: "Choose a day and start time for each meeting, meeting every constraint, between 09:00 and 17:00, with no clashes.",
          calendar: {
            days: DAYS,
            from: "08:00",
            to: "18:00",
            fixed: [
              { day: "Mon", start: "09:00", end: "12:00", title: "Site visits" },
              { day: "Tue", start: "12:00", end: "13:00", title: "Lunch" },
              { day: "Wed", start: "12:00", end: "13:00", title: "Lunch" },
              { day: "Thu", start: "10:00", end: "11:00", title: "Leadership meeting" },
              { day: "Thu", start: "12:00", end: "13:00", title: "Lunch" },
              { day: "Fri", start: "09:00", end: "17:00", title: "Abuja trip" },
            ],
          },
          fields: [
            { key: "day", label: "Day", type: "select", options: DAYS },
            { key: "start", label: "Start (WAT)", type: "time" },
          ],
          items: [
            { id: "w1", title: "Investor meeting about the funding round", short: "Investor", meta: "60 min · Wednesday or Thursday, as the investor asked", duration: 60, check: "return ['Wed', 'Thu'].includes(val.day);" },
            { id: "w2", title: "Call with SunTech Imports in Shenzhen", short: "SunTech (China)", meta: "30 min · China is 7 hours ahead of Lagos; their office closes at 18:00 China time (11:00 WAT)", duration: 30, check: "return mins(val.start) + 30 <= mins('11:00');", hint: "18:00 in Shenzhen is 11:00 in Lagos, so the call must end by 11:00 WAT.", why: "The call must finish by 11:00 WAT, while their office is open." },
            { id: "w3", title: "Leadership meeting prep with Mrs Coker", short: "Prep", meta: "30 min · must be before the Thursday leadership meeting", duration: 30, check: "const d = dayIndex(val.day); return d >= 0 && (d < 3 || (d === 3 && mins(val.start) + 30 <= mins('10:00')));", hint: "Any time before Thursday 10:00.", why: "Prep must happen before the meeting it prepares for." },
            { id: "w4", title: "Interview: Abuja installer team lead", short: "Interview", meta: "60 min · afternoon (starts at 13:00 or later)", duration: 60, check: "return mins(val.start) >= mins('13:00');" },
          ],
          rules: [
            { label: "No clashes", check: "return !clashes();", fail: "Something overlaps: check the red blocks." },
            { label: "All four placed between 09:00 and 17:00 WAT", check: "return placed().length === 4 && within('09:00', '17:00');", fail: "Place all four meetings within 09:00–17:00 WAT." },
          ],
          solution: {
            w1: { day: "Wed", start: "14:00" },
            w2: { day: "Tue", start: "09:00" },
            w3: { day: "Tue", start: "10:00" },
            w4: { day: "Mon", start: "14:00" },
          },
          hint: "The China call is the hardest: it must end by 11:00 WAT, and Monday morning and Friday are taken.",
          successMessage: "His week is scheduled, including a call nine time zones' worth of thinking away.",
        },
      },
      {
        id: "a-va-m4-agenda",
        title: "Wednesday: the leadership meeting agenda",
        explain:
          "Prepare the agenda for Thursday's leadership meeting, to send on Tuesday with the invitation.",
        writingLab: {
          task:
            "Fill the header: date, time with WAT, Google Meet, chair, and a one-sentence objective. Items: a table of the six items in order (welcome and action items first, AOB last), each with a start time and a lead; the times must fit the given durations, starting at 10:00 and with the last item at 10:55. Pre-reading: the April sales report and where it is.",
          brief: AGENDA_BRIEF,
          doc: AGENDA_DOC,
          tests: [
            { label: "Header with time zone, location, chair and objective", check: String.raw`return /23 april/i.test(field(doc, 'Date') || '') && /10:00/.test(field(doc, 'Time') || '') && /WAT/.test(field(doc, 'Time') || '') && /meet/i.test(field(doc, 'Location') || '') && /adebayo/i.test(field(doc, 'Chair') || '') && words(field(doc, 'Objective') || '') >= 6;`, fail: "Fill the header: Thursday 23 April, 10:00–11:00 WAT, Google Meet, Mr Adebayo, and a one-sentence objective." },
            { label: "Six items, welcome first and AOB last", check: String.raw`const r = rows(section('Items') || ''); return r.length === 6 && /welcome/i.test(r[0][1] || '') && /(any other business|aob)/i.test(r[5][1] || '');`, fail: "List six items: the welcome and action items first, any other business last." },
            { label: "Correct start times for the durations", check: String.raw`const r = rows(section('Items') || ''); const want = ['10:00', '10:05', '10:20', '10:35', '10:45', '10:55']; return r.length === 6 && r.every((x, i) => (x[0] || '').trim().startsWith(want[i]));`, fail: "Work out each start time from the durations: 10:00, 10:05, 10:20, 10:35, 10:45, 10:55 (in the order of the brief)." },
            { label: "A lead for every item", check: String.raw`const r = rows(section('Items') || ''); return r.length === 6 && r.every((x) => /(adebayo|coker|obi|musa)/i.test(x[2] || ''));`, fail: "Name the lead for every item." },
            { label: "Pre-reading with its location", check: String.raw`const p = section('Pre-reading') || ''; return /sales report/i.test(p) && /(shared drive|drive|link)/i.test(p);`, fail: "List the April sales report and where to find it." },
          ],
          solution: AGENDA_DONE,
          hint: "Add each duration to the previous start time: welcome 5 minutes from 10:00 gives 10:05 for sales, and so on.",
          successMessage: "Inbox triaged, week scheduled, agenda ready, travel planned: a complete week of executive support.",
        },
      },
    ],

    task: {
      title: "Module 4 practical: your executive assistant portfolio pack",
      intro: "Collect this week's work into a portfolio pack.",
      prompts: [
        "Recreate the label system from lesson 22 in your own Gmail, and create one filter using search operators.",
        "Build Mr Adebayo's week in a real Google Calendar, with colour coding, video links, agendas in the descriptions and a secondary time zone.",
        "Format the agenda, the minutes and the Accra itinerary as polished Google Docs or Word documents with heading styles, then export them as PDFs.",
        "Write a one-page \"executive preferences\" template you will ask every new executive client to fill in.",
      ],
      closing: "Module 5 deepens your skills in the office applications every client uses: Word, Excel, PowerPoint, Google Workspace and PDFs.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
