/**
 * VIRTUAL ASSISTANT · MODULE 8 · PROJECT MANAGEMENT AND TASK COORDINATION
 *
 * Curriculum 8.1 – 8.10 and the practical 8.P. Projects, tasks and
 * deliverables, assignment and prioritisation, deadlines and tracking,
 * several projects at once, task lists and workflows, collaboration and
 * accountability, progress reports, urgent work and methodologies; then a
 * project board for a business launch with owners, dates and dependencies.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s8-projects";

const TEAM = ["Ife (designer)", "Musa (photographer)", "Zara (copywriter)", "Kayode (developer)", "You (VA)"];

/* ── Lesson 51 lab: a workflow checklist ──────────────────────────────── */
const SOP_BRIEF = `Your client, **Dr Funke Alade**, runs a nutrition coaching business. Every week she publishes **one blog post** on her website and shares it on Instagram and in her email newsletter. It keeps going wrong: posts go out with typos, without images, or on the wrong day.

How it should work, from your notes of a call with her:
- She writes the draft in Google Docs by **Monday**.
- You proofread it and add headings by **Tuesday**, then send it to her for approval.
- She approves (or comments) by **Wednesday**.
- You create the featured image in Canva and upload the post to WordPress, scheduled for **Thursday at 9:00**.
- You schedule an Instagram post and add the link to the **Friday** newsletter in Mailchimp.
- At the end, you tick the post off in the content tracker sheet.`;

const SOP_DOC = `# Workflow: publishing the weekly blog post

- Purpose:
- Starts when:

## Steps

| # | Step | Owner | Due |
|---|---|---|---|

## Done when
`;

const SOP_DONE = `# Workflow: publishing the weekly blog post

- Purpose: Publish one accurate, well-presented blog post every week, on time, on the website, Instagram and the newsletter.
- Starts when: Dr Alade shares the week's draft in Google Docs.

## Steps

| # | Step | Owner | Due |
|---|---|---|---|
| 1 | Write the draft in Google Docs | Dr Alade | Monday |
| 2 | Proofread the draft and add headings | VA | Tuesday |
| 3 | Send the draft to Dr Alade for approval | VA | Tuesday |
| 4 | Approve the draft or add comments | Dr Alade | Wednesday |
| 5 | Create the featured image in Canva | VA | Wednesday |
| 6 | Upload the post to WordPress and schedule it for Thursday 9:00 | VA | Wednesday |
| 7 | Schedule the Instagram post | VA | Thursday |
| 8 | Add the post link to the Friday newsletter in Mailchimp | VA | Thursday |
| 9 | Tick the post off in the content tracker | VA | Friday |

## Done when

- The post is live on the website on Thursday at 9:00 with its image.
- The Instagram post and the newsletter link are scheduled.
- The content tracker shows the post as published.
`;

/* ── Lesson 52 lab: a status report ───────────────────────────────────── */
const STATUS_BRIEF = `You coordinate the **Lagos Women in Tech Summit** for your client, **Ms Chioma Eze**. The event is on **Saturday 20 June**, for 300 attendees. Today is **Friday 22 May**. Here is where things stand:

- **Venue:** booked and deposit paid. Done.
- **Speakers:** 7 of 8 confirmed; the keynote speaker has not replied to two emails.
- **Registration:** 210 of 300 places taken (target was 240 by now).
- **Sponsors:** 3 sponsors signed, ₦4.5 million of the ₦5 million target.
- **Catering:** quotes received; decision needed from Ms Eze between Taste Buds (₦3,200 per head) and Chop Life (₦2,800 per head, no vegetarian option) by **Wednesday 27 May**.
- **Next week:** send the reminder campaign to boost registration; call the keynote speaker's office.

The overall status is **amber**: on track overall, with two risks (keynote speaker, registrations) that need attention.`;

const STATUS_DOC = `# Weekly status report: Lagos Women in Tech Summit

- Week ending:
- Overall status:

## Done this week

## Next week

## Risks and issues

## Decisions needed
`;

const STATUS_DONE = `# Weekly status report: Lagos Women in Tech Summit

- Week ending: Friday 22 May
- Overall status: Amber: on track overall, with two risks to watch

## Done this week

- Venue booked and deposit paid.
- 7 of 8 speakers confirmed.
- 3 sponsors signed: ₦4.5 million of the ₦5 million target.
- Catering quotes received from two caterers.

## Next week

- Send the reminder campaign to boost registration.
- Call the keynote speaker's office.

## Risks and issues

- Keynote speaker: no reply to two emails. If there is no answer by 29 May, we will invite a backup speaker.
- Registration: 210 of 300 places taken, below the target of 240 for this date. The reminder campaign goes out on Monday.

## Decisions needed

- Catering by Wednesday 27 May: Taste Buds at ₦3,200 per head, or Chop Life at ₦2,800 per head with no vegetarian option. I recommend Taste Buds, so vegetarian guests are catered for.
`;

/* ── Lesson 54 lab: launch progress update ────────────────────────────── */
const UPDATE_BRIEF = `It is **Monday 18 May**. Write the weekly progress update on the Kora Threads store launch for the owner, **Mrs Ngozi Kalu**. Since you set up the board:

- The logo is done (6 May). The product photoshoot finished on 14 May.
- Zara is writing product descriptions: 25 of 40 done; due 19 May.
- Kayode finished building the Shopify store today (18 May).
- Risk: Paystack has asked for one more business document before payments can go live; Kayode says if it is not sent by **20 May**, payments may not be ready by the 21 May due date, and the launch on **30 May** could slip.
- Decision needed: Mrs Kalu must send the CAC certificate (business registration) to Paystack, or to you to upload, by 20 May.

Overall: **amber**.`;

const UPDATE_DOC = `# Kora Threads launch: weekly update

- Date:
- Overall status:

## Done

## In progress

## Risk

## Decision needed
`;

const UPDATE_DONE = `# Kora Threads launch: weekly update

- Date: Monday 18 May
- Overall status: Amber: on track, with one risk to payments

## Done

- Logo and brand colours (6 May).
- Product photoshoot, all 40 items (14 May).
- Shopify store built (18 May).

## In progress

- Product descriptions: 25 of 40 written, due 19 May.

## Risk

- Paystack needs one more business document before payments can go live. If it is not sent by 20 May, payments may miss their 21 May date and the 30 May launch could slip.

## Decision needed

- Please send the CAC certificate to Paystack, or to me to upload, by Wednesday 20 May.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 8.1 – 8.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l49-pm-intro",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "Projects, Tasks and Deliverables",
    subtitle: "What project management is, and the language every project uses",
    estimatedMinutes: 35,
    intro:
      "Many VAs end up as the person who keeps a client's projects moving: chasing tasks, updating boards, reporting progress. It starts with understanding what a project is.",

    atoms: [
      {
        id: "a-va-pm",
        title: "Introduction to project management",
        explain:
          "A project is temporary work with a clear goal, a start and an end: launching a website, organising a conference, moving an office. (Ongoing work, such as answering customers every day, is operations, not a project.) Project management is planning, organising and tracking that work so it delivers the goal on time, within budget and to the right quality. Every project balances scope (what will be delivered), time and cost: change one and the others are affected, so adding features usually means more time or money. Projects move through stages: initiate (agree the goal and why), plan (tasks, owners, dates, budget), execute (do the work), monitor (track progress and fix problems), and close (deliver, hand over, learn lessons). A VA often supports the project manager or owner by keeping the plan and board up to date, chasing tasks and reporting progress.",
      },
      {
        id: "a-va-pm-terms",
        title: "Tasks, deliverables and milestones",
        explain:
          "A task is one piece of work one person can do, written as an action: \"Write the product descriptions\". A deliverable is something produced and handed over: the finished website, a report, a set of photos. A milestone is a point in time that marks progress, with no work of its own: \"Store goes live\", \"Contracts signed\". A dependency is when one task cannot start or finish until another is done (products cannot be uploaded until the photos exist). Big pieces of work are broken down into tasks small enough to estimate and assign, typically one to five days each; this breakdown is sometimes called a work breakdown structure.",
        table: {
          caption: "The vocabulary of every project.",
          headers: ["Term", "Example from a store launch"],
          rows: [
            ["Project", "Launch the Kora Threads online store by 30 May"],
            ["Task", "Upload 40 products to Shopify"],
            ["Deliverable", "The finished, working online store"],
            ["Milestone", "Store goes live on 30 May"],
            ["Dependency", "Uploading products depends on the photoshoot"],
          ],
        },
      },
      {
        id: "a-va-pm-desk",
        title: "Project, task, deliverable or milestone?",
        explain:
          "Your client is organising a product launch event. Classify each item.",
        deskLab: {
          app: "board",
          title: "Product launch event · items",
          task: "Classify each item as a project, a task, a deliverable or a milestone.",
          boardBy: "kind",
          fields: [{ key: "kind", label: "Type", type: "select", options: ["Project", "Task", "Deliverable", "Milestone"] }],
          items: [
            { id: "p1", title: "Organise the launch event for the new juice range on 12 June", short: "Launch event", expect: { kind: "Project" } },
            { id: "p2", title: "Send invitations to 150 guests", short: "Send invitations", expect: { kind: "Task" } },
            { id: "p3", title: "The printed event programme", short: "Printed programme", expect: { kind: "Deliverable" } },
            { id: "p4", title: "Venue contract signed", short: "Venue signed", expect: { kind: "Milestone" }, why: "A point in time marking progress." },
            { id: "p5", title: "Book the photographer", short: "Book photographer", expect: { kind: "Task" } },
            { id: "p6", title: "Event day: 12 June", short: "Event day", expect: { kind: "Milestone" } },
            { id: "p7", title: "The post-event report with photos and guest feedback", short: "Post-event report", expect: { kind: "Deliverable" } },
            { id: "p8", title: "Confirm the menu with the caterer", short: "Confirm menu", expect: { kind: "Task" } },
          ],
          solution: {
            p1: { kind: "Project" }, p2: { kind: "Task" }, p3: { kind: "Deliverable" }, p4: { kind: "Milestone" },
            p5: { kind: "Task" }, p6: { kind: "Milestone" }, p7: { kind: "Deliverable" }, p8: { kind: "Task" },
          },
          hint: "Ask: is it the whole effort (project), an action (task), a thing handed over (deliverable) or a moment (milestone)?",
          successMessage: "You now speak the language of every project board you will ever use.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 8.3 – 8.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l50-assign-track",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4"],
    title: "Assigning, Prioritising, Deadlines and Tracking",
    subtitle: "One owner per task, MoSCoW priorities, realistic deadlines and boards that show the truth",
    estimatedMinutes: 45,
    intro:
      "Most projects do not fail because the work is hard. They fail because nobody was sure who was doing what, what mattered most, or when it was due.",

    atoms: [
      {
        id: "a-va-assign",
        title: "Task assignment and prioritisation",
        explain:
          "Give every task exactly one owner: the person responsible for getting it done, even if others help. \"The team\" owns nothing. Assign by skill and capacity: the right person who has the time. Write tasks so the owner can act without asking: a clear action, a due date, the expected result and links to what they need. Prioritise with MoSCoW when there is more to do than time allows: Must have (the project fails without it), Should have (important, but the project can go ahead without it), Could have (nice if time allows) and Won't have this time (agreed out of scope). Agree priorities with the client; a VA should never quietly decide that something is not important.",
      },
      {
        id: "a-va-deadlines",
        title: "Setting deadlines and tracking progress",
        explain:
          "Set deadlines by working backwards from the final date (the launch) through the dependencies, giving each task a realistic estimate from the person who will do it, plus a buffer, because tasks usually take longer than hoped. Make deadlines specific (\"Friday 15 May\", not \"next week\") and visible on the board or calendar. Track progress where everyone can see it. A board (Trello, Asana, ClickUp, Monday.com) shows each task as a card in a column: To do, In progress, Done (sometimes Blocked or Review). A Gantt chart or timeline shows tasks as bars across dates, with dependencies linked, which makes the critical path visible: the chain of dependent tasks that decides the end date. Many teams report a RAG status: Green (on track), Amber (at risk, being managed) or Red (off track, needs a decision).",
        mistake:
          "Marking a task \"In progress\" for three weeks. If a card does not move, ask the owner what is blocking it and record the blocker: a board that hides problems is worse than no board.",
      },
      {
        id: "a-va-assign-desk",
        title: "Assigning and prioritising a website project",
        explain:
          "Your client is redesigning her catering company's website, launching in four weeks with a small budget. Assign each task to the right person and set its MoSCoW priority.",
        deskLab: {
          app: "board",
          title: "Website redesign · task list",
          boardBy: "priority",
          task: "Choose the owner and the MoSCoW priority for each task.",
          brief: "**Team:** Tola (web designer), Femi (developer), Ada (copywriter), you (VA). **Must have** for launch: the site works on phones, shows the menu and prices, and takes event inquiries. **Should have:** the photo gallery. **Could have:** a blog. **Won't have this time:** online payments (next year).",
          briefTitle: "The team and the priorities",
          fields: [
            { key: "owner", label: "Owner", type: "select", options: ["Tola (designer)", "Femi (developer)", "Ada (copywriter)", "You (VA)"] },
            { key: "priority", label: "Priority", type: "select", options: ["Must have", "Should have", "Could have", "Won't have this time"] },
          ],
          items: [
            { id: "w1", title: "Design the mobile page layouts", expect: { owner: "Tola (designer)", priority: "Must have" } },
            { id: "w2", title: "Build the event inquiry form", expect: { owner: "Femi (developer)", priority: "Must have" } },
            { id: "w3", title: "Write the menu and price page text", expect: { owner: "Ada (copywriter)", priority: "Must have" } },
            { id: "w4", title: "Collect and resize 30 event photos for the gallery", expect: { owner: "You (VA)", priority: "Should have" } },
            { id: "w5", title: "Write three launch blog posts", expect: { owner: "Ada (copywriter)", priority: "Could have" } },
            { id: "w6", title: "Integrate online card payments", expect: { owner: "Femi (developer)", priority: "Won't have this time" } },
            { id: "w7", title: "Gather the current menu and prices from the client", expect: { owner: "You (VA)", priority: "Must have" }, why: "The menu page depends on it, so it is a must." },
          ],
          solution: {
            w1: { owner: "Tola (designer)", priority: "Must have" }, w2: { owner: "Femi (developer)", priority: "Must have" }, w3: { owner: "Ada (copywriter)", priority: "Must have" },
            w4: { owner: "You (VA)", priority: "Should have" }, w5: { owner: "Ada (copywriter)", priority: "Could have" }, w6: { owner: "Femi (developer)", priority: "Won't have this time" },
            w7: { owner: "You (VA)", priority: "Must have" },
          },
          hint: "Match each task to the skill it needs, then check it against the client's Must / Should / Could / Won't list.",
          successMessage: "Every task has one owner and an agreed priority: the two things most projects are missing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 8.5 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l51-workflows",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6"],
    title: "Multiple Projects, Task Lists and Workflows",
    subtitle: "Juggling several projects without dropping any, and turning repeated work into workflows",
    estimatedMinutes: 40,
    intro:
      "A VA with three clients may be running six projects at once. The answer is not working harder; it is systems.",

    atoms: [
      {
        id: "a-va-multi",
        title: "Managing multiple projects",
        explain:
          "Keep one master view of everything: a personal board or list (in Trello, Asana, ClickUp, Notion or a sheet) with every project and its next deadline, even if each client has their own tool. Colour-code or label by client. Do a weekly review (for example every Friday): check every project, update the boards, list next week's deadlines and spot clashes early. Plan your week with time blocks per client or project. Know your capacity: if two clients' deadlines collide, tell them early and agree priorities rather than delivering both late. Keep each client's information in their own space, so nothing is shared with the wrong client.",
      },
      {
        id: "a-va-workflow",
        title: "Creating task lists and workflows",
        explain:
          "A workflow is the sequence of steps a piece of recurring work moves through, with an owner and timing for each: for example Draft → Proofread → Approve → Publish → Promote. Writing it down (as an SOP or checklist) makes the work consistent, lets anyone do it, and shows where it gets stuck. A good workflow states its purpose, what starts it (the trigger), numbered steps that each begin with a verb and have one owner and a due day, and what \"done\" looks like. In project tools, turn workflows into board columns (Draft, In review, Approved, Published), recurring tasks (every Monday) and templates (a card or project you copy each time with its checklist), so nothing depends on memory.",
      },
      {
        id: "a-va-sop-lab",
        title: "Writing a workflow",
        explain:
          "Write Dr Alade's weekly blog workflow so it never goes wrong again.",
        writingLab: {
          task:
            "Fill in Purpose and Starts when. Steps: a table of at least 7 steps in order, each starting with a verb, each with one owner (Dr Alade or VA) and a due day (Monday to Friday). Include proofreading, approval, the Canva image, scheduling in WordPress for Thursday 9:00, Instagram, the Mailchimp newsletter and the content tracker. Done when: at least two bullets that describe the finished result.",
          brief: SOP_BRIEF,
          doc: SOP_DOC,
          tests: [
            { label: "Purpose and trigger", check: String.raw`return words(field(doc, 'Purpose') || '') >= 6 && words(field(doc, 'Starts when') || '') >= 4;`, fail: "State the workflow's purpose and what starts it." },
            { label: "At least 7 steps, each starting with a verb", check: String.raw`const r = rows(section('Steps') || ''); return r.length >= 7 && r.every((x) => isAction(x[1] || '') || /^(write|proofread|send|approve|create|upload|schedule|add|tick|publish|share|post|review|design|check)/i.test(x[1] || ''));`, fail: "List at least seven steps, each starting with a verb (Write, Proofread, Send…)." },
            { label: "One owner and a due day for every step", check: String.raw`return rows(section('Steps') || '').every((x) => /^(dr alade|va|you)$/i.test((x[2] || '').trim()) && /^(monday|tuesday|wednesday|thursday|friday)$/i.test((x[3] || '').trim()));`, fail: "Give every step one owner (Dr Alade or VA) and a single due day." },
            { label: "Covers every stage of the brief", check: String.raw`const t = rows(section('Steps') || '').map((x) => x[1]).join(' '); return /proofread/i.test(t) && /approv/i.test(t) && /canva|image/i.test(t) && /wordpress/i.test(t) && /instagram/i.test(t) && /(newsletter|mailchimp)/i.test(t) && /tracker/i.test(t);`, fail: "Include proofreading, approval, the image, WordPress, Instagram, the newsletter and the tracker." },
            { label: "Steps in a workable order", check: String.raw`const r = rows(section('Steps') || ''); const i = (re) => r.findIndex((x) => re.test(x[1] || '')); return i(/proofread/i) < i(/approv/i) && i(/approv/i) < i(/wordpress/i) && i(/wordpress/i) <= i(/tracker/i);`, fail: "Put the steps in order: proofread, then approve, then WordPress, and the tracker last." },
            { label: "Done when: the finished result", check: String.raw`return bullets(section('Done when') || '').length >= 2;`, fail: "Describe what \"done\" looks like in at least two bullets." },
          ],
          solution: SOP_DONE,
          hint: "Walk through one week in time order, Monday to Friday, writing each action as one row.",
          successMessage: "A workflow anyone could follow. Next, turn it into a recurring card with a checklist in Trello or Asana.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 8.7 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l52-reporting",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.7", "8.8"],
    title: "Collaboration, Accountability and Progress Reports",
    subtitle: "Keeping a team working together, following up, and reporting progress clearly",
    estimatedMinutes: 40,
    intro:
      "Clients rarely want to read the board themselves. They want a short, honest answer to \"how is it going?\" every week.",

    atoms: [
      {
        id: "a-va-collab-team",
        title: "Team collaboration and accountability",
        explain:
          "Collaboration works when everyone can see the same information. Keep discussion about a task on its card (comments, files, checklists) rather than scattered in private chats, so the history stays with the work. Use @mentions to ask a specific person for something. Agree a rhythm: a short weekly check-in, or a daily stand-up for busy projects (what I did, what I will do, what is blocking me). Accountability means people do what they committed to, and it comes from clear owners, visible dates and consistent follow-up, not from pressure. Follow up before a deadline, not after (\"Your descriptions are due Wednesday; anything you need from me?\"), and when a task slips, ask what is blocking it and help remove the blocker. Record decisions where the team can find them.",
        decision: {
          scenario: "A designer's task is due tomorrow and the card has not moved for a week. You manage the board for the client.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Comment on the card with an @mention: \"Your banner designs are due tomorrow; how is it going, and is anything blocking you?\"", why: "Right. A friendly, visible, specific check before the deadline, offering help." },
            { id: "b", text: "Tell the client the designer is lazy", whyWrong: "You do not know the facts, and blame damages the team." },
            { id: "c", text: "Do nothing until the deadline passes", whyWrong: "Then it is too late to help or warn the client." },
            { id: "d", text: "Send the designer five messages on different apps", whyWrong: "That is nagging, and scatters the conversation." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-status-report",
        title: "Reporting project progress",
        explain:
          "A weekly status report answers \"how is it going?\" in two minutes. Use the same structure every week: the overall status (RAG: Green, Amber or Red) with one line of explanation; what was done this week; what will be done next week; risks and issues (a risk might happen; an issue already has), each with its impact and what is being done; and decisions needed from the client, each with options, your recommendation and a date. Be specific (\"210 of 300 registrations\", not \"registrations are going well\") and honest: Amber or Red early is far better than Green until the day it fails. Keep it short; link to the board for detail.",
      },
      {
        id: "a-va-status-lab",
        title: "Writing a weekly status report",
        explain:
          "Write this week's status report on the summit for Ms Eze.",
        writingLab: {
          task:
            "Header: the week-ending date and the overall status (Amber) with a short explanation. Done this week: at least 3 bullets with figures. Next week: at least 2 bullets. Risks and issues: the keynote speaker and the registrations (210 of 300 against 240), each with what is being done. Decisions needed: the catering choice with both options and prices, the 27 May date and your recommendation. 120 to 260 words.",
          brief: STATUS_BRIEF,
          doc: STATUS_DOC,
          tests: [
            { label: "Week ending and Amber status explained", check: String.raw`return /22 may/i.test(field(doc, 'Week ending') || '') && /amber/i.test(field(doc, 'Overall status') || '') && words(field(doc, 'Overall status') || '') >= 4;`, fail: "Give the week-ending date (22 May) and the overall status, Amber, with a short explanation." },
            { label: "Done this week: three or more specific bullets", check: String.raw`const b = bullets(section('Done') || ''); return b.length >= 3 && b.filter((x) => /\d/.test(x)).length >= 2;`, fail: "List at least three things done this week, with figures (7 of 8 speakers, ₦4.5 million…)." },
            { label: "Next week: at least two actions", check: String.raw`return bullets(section('Next week') || '').length >= 2;`, fail: "List at least two actions for next week." },
            { label: "Both risks with figures and responses", check: String.raw`const r = section('Risks') || ''; return /keynote/i.test(r) && /210/.test(r) && /300/.test(r) && /240/.test(r) && /(will|backup|campaign|call)/i.test(r);`, fail: "Report both risks: the keynote speaker and registrations (210 of 300, target 240), each with what you are doing." },
            { label: "Catering decision: options, date and recommendation", check: String.raw`const d = section('Decisions') || ''; return /taste buds/i.test(d) && /chop life/i.test(d) && /3,?200/.test(d) && /2,?800/.test(d) && /27 may/i.test(d) && /recommend/i.test(d);`, fail: "Set out the catering decision: both caterers with prices, the 27 May deadline and your recommendation." },
            { label: "120 to 260 words", check: String.raw`return words(doc) >= 120 && words(doc) <= 260;`, fail: "Keep the report between 120 and 260 words." },
          ],
          solution: STATUS_DONE,
          hint: "A risk needs three parts: what might happen, the effect, and what you are doing about it.",
          successMessage: "A report the client can read in two minutes, with no surprises hidden in it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l53-priorities-methods",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.9", "8.10"],
    title: "Urgent Work, Competing Priorities and Methodologies",
    subtitle: "Handling clashes between urgent requests, and Waterfall, Scrum and Kanban",
    estimatedMinutes: 40,
    intro:
      "Two clients both say \"urgent\". A project's scope keeps changing. This lesson gives you the tools for both.",

    atoms: [
      {
        id: "a-va-urgent",
        title: "Managing urgent tasks and competing priorities",
        explain:
          "When urgent requests collide, do not silently juggle and hope. Triage: how big is the impact of each, and what is the real deadline (ask: \"When exactly do you need it, and what happens if it is tomorrow morning?\"). Many \"urgent\" requests have flexible deadlines once asked. If two tasks for the same client clash, make the trade-off visible and let the client choose: \"I can finish the investor deck by 3pm or the payroll file by 3pm, but not both; which comes first?\" If two clients clash, honour existing commitments and agreed hours, tell the client whose work will move as early as possible, and offer a specific new time. Protect important, non-urgent work from constant interruptions, and look for patterns: if a client's work is always urgent, propose a better routine with them.",
        decision: {
          scenario: "At 11:00, your client asks for the board presentation by 15:00. You are already finishing her payroll file, also due at 15:00, and you cannot do both.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Tell her straight away that both cannot be done by 15:00, and ask which comes first, offering a time for the other", why: "Right. She has the information and the authority to choose; you keep both commitments honest." },
            { id: "b", text: "Try to do both and deliver both late", whyWrong: "Two late tasks instead of one, and no warning." },
            { id: "c", text: "Decide yourself that the presentation matters more", whyWrong: "Late payroll could hurt staff; the client must choose." },
            { id: "d", text: "Rush both and skip checking", whyWrong: "Errors in payroll or a board deck are worse than a delay." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-methods",
        title: "Project management methodologies",
        explain:
          "A methodology is a way of organising a project. Waterfall plans everything up front and moves through phases in order (requirements, design, build, test, launch); it suits projects with fixed requirements and dates, such as an event or an office move. Agile is a family of approaches that deliver in small pieces and adapt as they learn, suiting work where requirements change, such as software and marketing. Scrum is the most common Agile method: work is planned in sprints of one to four weeks from a prioritised backlog, with a short daily stand-up, a review at the end of each sprint and roles such as the product owner and the Scrum master. Kanban visualises work on a board with columns and limits how many tasks can be in progress at once (a WIP limit), so work flows steadily; it suits continuous streams of work such as support requests or content production. Most small businesses use a simple mix: a Kanban board plus deadlines.",
        table: {
          caption: "Which approach fits?",
          headers: ["Method", "Best for", "Key ideas"],
          rows: [
            ["Waterfall", "Fixed scope and date (events, office moves)", "Phases in order, full plan up front"],
            ["Scrum (Agile)", "Changing requirements (software, product)", "Sprints, backlog, daily stand-up, reviews"],
            ["Kanban", "Continuous flows of work (support, content)", "Board columns, WIP limits, steady flow"],
          ],
        },
      },
      {
        id: "a-va-method-desk",
        title: "Choosing a methodology",
        explain:
          "For each piece of work, choose the approach that fits best.",
        deskLab: {
          app: "tasks",
          title: "Which approach fits?",
          task: "Choose Waterfall, Scrum or Kanban for each piece of work.",
          fields: [{ key: "method", label: "Approach", type: "select", options: ["Waterfall", "Scrum", "Kanban"] }],
          items: [
            { id: "m1", title: "Organising a wedding on a fixed date with a fixed budget", expect: { method: "Waterfall" } },
            { id: "m2", title: "A startup building a mobile app whose features change after every user test", expect: { method: "Scrum" } },
            { id: "m3", title: "The never-ending stream of customer support requests", expect: { method: "Kanban" } },
            { id: "m4", title: "Moving the company to a new office on 1 September", expect: { method: "Waterfall" } },
            { id: "m5", title: "A content team producing social posts and blogs continuously", expect: { method: "Kanban" } },
            { id: "m6", title: "A software team delivering new features every two weeks", expect: { method: "Scrum" } },
          ],
          solution: { m1: { method: "Waterfall" }, m2: { method: "Scrum" }, m3: { method: "Kanban" }, m4: { method: "Waterfall" }, m5: { method: "Kanban" }, m6: { method: "Scrum" } },
          hint: "Fixed scope and date → Waterfall. Changing requirements in cycles → Scrum. A continuous stream → Kanban.",
          successMessage: "You can now recognise how a client's team works, and set up a board that suits it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l54-practical",
    moduleId: "va-m8-projects",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.P"],
    title: "Practical: A Business Launch Board",
    subtitle: "Owners, deadlines, dependencies and progress for an online store launch",
    estimatedMinutes: 75,
    intro:
      "Mrs Ngozi Kalu is launching Kora Threads, an online fashion store, on Saturday 30 May. You coordinate the launch. Build the board, then send her the first weekly update.",

    atoms: [
      {
        id: "a-va-m8-board",
        title: "Build the launch board",
        explain:
          "Set an owner, a status and a due date (YYYY-MM-DD) for every task. Today is Monday 11 May 2026. Dependencies are in each task's details: a task must be due after every task it depends on. The board preview groups the tasks by status.",
        deskLab: {
          app: "board",
          title: "Kora Threads · Store launch · 30 May 2026",
          boardBy: "status",
          task: "Choose each task's owner and status, and type a due date that respects the dependencies and the launch date.",
          brief: "**Today:** Monday 11 May 2026. **Launch:** Saturday 30 May, so everything is due by **29 May**.\n\n**Team:** Ife (designer), Musa (photographer), Zara (copywriter), Kayode (developer), you (VA).\n\n**Progress so far:** the logo and brand colours were finished on 6 May. Musa is in the middle of the photoshoot. Kayode has started building the Shopify store. Nothing else has started.\n\nTasks already finished keep the date they finished; every other task is due after today.",
          briefTitle: "Project facts",
          fields: [
            { key: "owner", label: "Owner", type: "select", options: TEAM },
            { key: "status", label: "Status", type: "select", options: ["To do", "In progress", "Done"] },
            { key: "due", label: "Due (YYYY-MM-DD)", type: "text", placeholder: "2026-05-20" },
          ],
          items: [
            { id: "t1", title: "Design the logo and brand colours", short: "Logo", meta: "Depends on: nothing", deps: [], expect: { owner: "Ife (designer)", status: "Done" }, check: "return date(val.due) === date('2026-05-06');", hint: "It finished on 6 May.", why: "Finished on 6 May: Done, due 2026-05-06." },
            { id: "t2", title: "Photograph all 40 products", short: "Photoshoot", meta: "Depends on: nothing", deps: [], expect: { owner: "Musa (photographer)", status: "In progress" } },
            { id: "t3", title: "Write the 40 product descriptions", short: "Descriptions", meta: "Depends on: the photoshoot", deps: ["t2"], expect: { owner: "Zara (copywriter)", status: "To do" } },
            { id: "t4", title: "Build the Shopify store", short: "Build store", meta: "Depends on: the logo", deps: ["t1"], expect: { owner: "Kayode (developer)", status: "In progress" } },
            { id: "t5", title: "Upload the 40 products to the store", short: "Upload products", meta: "Depends on: the photoshoot, the descriptions and the store", deps: ["t2", "t3", "t4"], expect: { owner: "You (VA)", status: "To do" } },
            { id: "t6", title: "Set up Paystack payments", short: "Payments", meta: "Depends on: the store", deps: ["t4"], expect: { owner: "Kayode (developer)", status: "To do" } },
            { id: "t7", title: "Test the checkout from start to finish", short: "Test checkout", meta: "Depends on: the product upload and payments", deps: ["t5", "t6"], expect: { owner: "You (VA)", status: "To do" } },
            { id: "t8", title: "Schedule the launch posts and email", short: "Launch posts", meta: "Depends on: the checkout test", deps: ["t7"], expect: { owner: "You (VA)", status: "To do" } },
          ],
          rules: [
            { label: "Every due date is a real date in YYYY-MM-DD format", check: "return all((r) => /^\\d{4}-\\d{2}-\\d{2}$/.test(String(r.due || '').trim()) && Number.isFinite(date(r.due)));", fail: "Type every due date as YYYY-MM-DD, for example 2026-05-20." },
            { label: "Unfinished tasks are due after today and by 29 May", check: "return all((r) => r.status === 'Done' || (date(r.due) > date('2026-05-11') && date(r.due) <= date('2026-05-29')));", fail: "Every task not yet done must be due after Monday 11 May and no later than 29 May." },
            { label: "Every task is due after the tasks it depends on", check: "return all((r) => (r.$.deps || []).every((d) => date(r.due) > date(val(d, 'due'))));", fail: "A task is due on or before a task it depends on. Check each task's \"Depends on\" line." },
          ],
          solution: {
            t1: { owner: "Ife (designer)", status: "Done", due: "2026-05-06" },
            t2: { owner: "Musa (photographer)", status: "In progress", due: "2026-05-14" },
            t3: { owner: "Zara (copywriter)", status: "To do", due: "2026-05-19" },
            t4: { owner: "Kayode (developer)", status: "In progress", due: "2026-05-18" },
            t5: { owner: "You (VA)", status: "To do", due: "2026-05-22" },
            t6: { owner: "Kayode (developer)", status: "To do", due: "2026-05-21" },
            t7: { owner: "You (VA)", status: "To do", due: "2026-05-26" },
            t8: { owner: "You (VA)", status: "To do", due: "2026-05-28" },
          },
          hint: "Work backwards from 29 May: launch posts last, then the checkout test, then the upload and payments, and so on, leaving a day or two between dependent tasks.",
          successMessage: "A launch board with an owner, a status and a realistic date for every task, and every dependency in order.",
        },
      },
      {
        id: "a-va-m8-update",
        title: "Send the first weekly update",
        explain:
          "A week later, write Mrs Kalu's progress update from the board.",
        writingLab: {
          task:
            "Header: the date and the overall status (Amber) with a short reason. Done: at least 3 bullets with dates. In progress: the descriptions with the count and due date. Risk: the Paystack document, its effect on the 21 May payments date and the 30 May launch. Decision needed: the CAC certificate by 20 May. 80 to 200 words.",
          brief: UPDATE_BRIEF,
          doc: UPDATE_DOC,
          tests: [
            { label: "Date and Amber status with a reason", check: String.raw`return /18 may/i.test(field(doc, 'Date') || '') && /amber/i.test(field(doc, 'Overall status') || '') && words(field(doc, 'Overall status') || '') >= 4;`, fail: "Give the date (18 May) and the status, Amber, with a short reason." },
            { label: "Done: three items with dates", check: String.raw`const b = bullets(section('Done') || ''); return b.length >= 3 && b.filter((x) => /\d{1,2} may/i.test(x)).length >= 3;`, fail: "List the three finished items, each with its date." },
            { label: "In progress: descriptions with count and due date", check: String.raw`const p = section('In progress') || ''; return /25/.test(p) && /40/.test(p) && /19 may/i.test(p);`, fail: "Report the descriptions: 25 of 40, due 19 May." },
            { label: "Risk with its effect on dates", check: String.raw`const r = section('Risk') || ''; return /paystack/i.test(r) && /20 may/i.test(r) && /21 may/i.test(r) && /30 may/i.test(r);`, fail: "Explain the Paystack risk: the document by 20 May, or payments miss 21 May and the 30 May launch could slip." },
            { label: "A clear decision with a date", check: String.raw`const d = section('Decision') || ''; return /CAC/i.test(d) && /20 may/i.test(d) && /(please|could you)/i.test(d);`, fail: "Ask her clearly to send the CAC certificate by 20 May." },
            { label: "80 to 200 words", check: String.raw`return words(doc) >= 80 && words(doc) <= 200;`, fail: "Keep the update between 80 and 200 words." },
          ],
          solution: UPDATE_DONE,
          hint: "The most important line is the decision: make it impossible to miss.",
          successMessage: "Board built, update sent: the client knows exactly where the launch stands and what she must do.",
        },
      },
    ],

    task: {
      title: "Module 8 practical: build it in a real tool",
      intro: "Recreate the launch board in a project management tool.",
      prompts: [
        "Create a free Trello, Asana or ClickUp account and build the Kora Threads board with columns To do, In progress and Done.",
        "Add every task as a card with its owner, due date, a checklist and its dependencies noted; in Asana or ClickUp, link the dependencies.",
        "Turn Dr Alade's blog workflow into a recurring card or task template.",
        "Take screenshots of the board and save them, with your status report, in your portfolio.",
      ],
      closing: "Module 9 covers social media and digital marketing support: content calendars, graphics, community management and reports.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
