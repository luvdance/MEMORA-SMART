/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 8 · PROJECT MANAGEMENT
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l49-pm-intro", [
    q({
      id: "va-q49-01", atom: "a-va-pm", d: 2,
      prompt: "Which of these is a project rather than ongoing operations?",
      options: ["Launching a new website by 30 May", "Answering customer emails every day", "Paying staff every month", "Checking the inbox each morning"],
      correct: "a",
      explanation: "A project is temporary, with a goal, a start and an end.",
      wrong: { b: "Ongoing operations.", c: "Ongoing operations.", d: "A routine." },
    }),
    q({
      id: "va-q49-02", atom: "a-va-pm", d: 2,
      prompt: "A client adds three new features to a project. What usually happens?",
      options: ["It needs more time or money, because scope, time and cost are linked", "Nothing changes", "The project gets cheaper", "Quality automatically improves"],
      correct: "a",
      explanation: "Changing scope affects time and cost.",
      wrong: { b: "Scope changes have effects.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q49-03", atom: "a-va-pm-terms", d: 2,
      prompt: "\"Store goes live on 30 May\" is a…",
      options: ["Milestone", "Task", "Deliverable", "Dependency"],
      correct: "a",
      explanation: "A point in time marking progress.",
      wrong: { b: "Not an action.", c: "Not a thing handed over.", d: "Not a link between tasks." },
    }),
    q({
      id: "va-q49-04", atom: "a-va-pm-terms", d: 2,
      prompt: "Uploading products cannot start until the photos exist. This is a…",
      options: ["Dependency", "Milestone", "Deliverable", "Methodology"],
      correct: "a",
      explanation: "One task depends on another.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l50-assign-track", [
    q({
      id: "va-q50-01", atom: "a-va-assign", d: 2,
      prompt: "How many owners should each task have?",
      options: ["Exactly one", "The whole team", "None", "Two, to be safe"],
      correct: "a",
      explanation: "One person is responsible, even if others help.",
      wrong: { b: "\"The team\" owns nothing.", c: "Then nobody does it.", d: "Each assumes the other is doing it." },
    }),
    q({
      id: "va-q50-02", atom: "a-va-assign", d: 2,
      prompt: "In MoSCoW, what does \"Won't have this time\" mean?",
      options: ["Agreed to be out of scope for now", "Forgotten", "Must be done first", "Optional if time allows"],
      correct: "a",
      explanation: "An explicit agreement to leave it out of this project.",
      wrong: { b: "It is deliberate.", c: "That is Must.", d: "That is Could." },
    }),
    q({
      id: "va-q50-03", atom: "a-va-deadlines", d: 2,
      prompt: "What does Amber mean in a RAG status?",
      options: ["At risk, but being managed", "Finished", "On track with no issues", "Cancelled"],
      correct: "a",
      explanation: "Green on track, Amber at risk, Red off track.",
      wrong: { b: "No.", c: "That is Green.", d: "No." },
    }),
    q({
      id: "va-q50-04", atom: "a-va-deadlines", d: 3,
      prompt: "How should deadlines for a launch be set?",
      options: ["Work backwards from the launch through the dependencies, with buffers", "Give every task the launch date", "Let each person choose any date", "Set them after the launch"],
      correct: "a",
      explanation: "Backwards planning keeps dependent tasks in order.",
      wrong: { b: "Everything would finish at once, too late.", c: "Ignores dependencies.", d: "Pointless." },
    }),
    q({
      id: "va-q50-05", atom: "a-va-deadlines", d: 2,
      prompt: "A card has been \"In progress\" for three weeks. What should you do?",
      options: ["Ask the owner what is blocking it and record the blocker", "Move it to Done", "Delete it", "Ignore it"],
      correct: "a",
      explanation: "Boards must show real problems.",
      wrong: { b: "Dishonest.", c: "Loses the work.", d: "Hides a problem." },
    }),
  ]),

  ...check("va-l51-workflows", [
    q({
      id: "va-q51-01", atom: "a-va-multi", d: 2,
      prompt: "What helps a VA manage projects for several clients?",
      options: ["One master view of all projects and a weekly review", "Remembering everything", "Working on whichever client messages last", "A separate notebook per day"],
      correct: "a",
      explanation: "A master list plus a regular review catches clashes early.",
      wrong: { b: "Memory fails.", c: "Reactive and risky.", d: "Fragmented." },
    }),
    q({
      id: "va-q51-02", atom: "a-va-multi", d: 2,
      prompt: "Two clients' deadlines clash. What should you do?",
      options: ["Tell them early and agree priorities or new times", "Deliver both late without warning", "Secretly skip one", "Work 48 hours straight"],
      correct: "a",
      explanation: "Early, honest communication.",
      wrong: { b: "Damages both relationships.", c: "Dishonest.", d: "Not sustainable and error-prone." },
    }),
    q({
      id: "va-q51-03", atom: "a-va-workflow", d: 2,
      prompt: "What makes a written workflow useful?",
      options: ["A purpose, a trigger, ordered steps with one owner and a due day each, and a definition of done", "Long paragraphs", "No owners, so anyone can do it", "Steps in any order"],
      correct: "a",
      explanation: "These make it repeatable by anyone.",
      wrong: { b: "Hard to follow.", c: "Then nobody does it.", d: "Order matters." },
    }),
    q({
      id: "va-q51-04", atom: "a-va-workflow", d: 2,
      prompt: "A task happens every Monday. How do you make sure it is never forgotten?",
      options: ["Create a recurring task or template in the project tool", "Rely on memory", "Write it on your hand", "Ask the client to remind you"],
      correct: "a",
      explanation: "Recurring tasks remove reliance on memory.",
      wrong: { b: "Memory fails.", c: "No.", d: "That is your job." },
    }),
  ]),

  ...check("va-l52-reporting", [
    q({
      id: "va-q52-01", atom: "a-va-collab-team", d: 2,
      prompt: "Where should discussion about a task happen?",
      options: ["On the task's card, so the history stays with the work", "In private chats", "In personal email", "Nowhere"],
      correct: "a",
      explanation: "Comments on the card keep everyone informed.",
      wrong: { b: "Scattered and hidden.", c: "Scattered.", d: "Teams need to talk." },
    }),
    q({
      id: "va-q52-02", atom: "a-va-collab-team", d: 2,
      prompt: "When is the best time to follow up on a task?",
      options: ["Before the deadline, offering help", "After the deadline has passed", "Never", "Every hour"],
      correct: "a",
      explanation: "Early follow-up allows time to fix problems.",
      wrong: { b: "Too late to help.", c: "Risky.", d: "Nagging." },
    }),
    q({
      id: "va-q52-03", atom: "a-va-status-report", d: 2,
      prompt: "What is the difference between a risk and an issue?",
      options: ["A risk might happen; an issue has already happened", "They are the same", "An issue is always minor", "A risk is always minor"],
      correct: "a",
      explanation: "Risks are possible; issues are current.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q52-04", atom: "a-va-status-report", d: 2,
      prompt: "Which status line is most useful?",
      options: ["\"210 of 300 registrations, below the 240 target; reminder campaign on Monday\"", "\"Registrations going well\"", "\"Busy week\"", "\"All good\""],
      correct: "a",
      explanation: "Specific, compared with a target, with an action.",
      wrong: { b: "Vague.", c: "Says nothing.", d: "Says nothing and may hide a risk." },
    }),
  ]),

  ...check("va-l53-priorities-methods", [
    q({
      id: "va-q53-01", atom: "a-va-urgent", d: 2,
      prompt: "Your client wants two tasks by 15:00 and you can only do one. What do you do?",
      options: ["Tell her now and ask which comes first", "Pick one yourself", "Try both and deliver both late", "Skip checking to save time"],
      correct: "a",
      explanation: "Make the trade-off visible; the client decides.",
      wrong: { b: "Not your decision.", c: "Two failures.", d: "Errors are costly." },
    }),
    q({
      id: "va-q53-02", atom: "a-va-urgent", d: 2,
      prompt: "What should you ask when a request is labelled urgent?",
      options: ["When exactly it is needed and what happens if it is later", "Nothing; drop everything", "Why they are always urgent, angrily", "Whether you can do it next week"],
      correct: "a",
      explanation: "Many urgent deadlines are flexible once clarified.",
      wrong: { b: "May sacrifice more important work.", c: "Unprofessional.", d: "Ignores the need." },
    }),
    q({
      id: "va-q53-03", atom: "a-va-methods", d: 2,
      prompt: "Which method uses sprints, a backlog and daily stand-ups?",
      options: ["Scrum", "Waterfall", "Kanban", "MoSCoW"],
      correct: "a",
      explanation: "Scrum is the common Agile framework.",
      wrong: { b: "Phases in order.", c: "Continuous flow with WIP limits.", d: "A prioritisation method." },
    }),
    q({
      id: "va-q53-04", atom: "a-va-methods", d: 2,
      prompt: "Organising a conference on a fixed date with a fixed budget suits…",
      options: ["Waterfall", "Scrum", "Kanban", "No planning"],
      correct: "a",
      explanation: "Fixed scope and date suit up-front planning.",
      wrong: { b: "For changing requirements.", c: "For continuous streams.", d: "No." },
    }),
    q({
      id: "va-q53-05", atom: "a-va-methods", d: 2,
      prompt: "What is a WIP limit in Kanban?",
      options: ["A cap on how many tasks can be in progress at once", "A deadline", "A budget", "A type of report"],
      correct: "a",
      explanation: "Limiting work in progress keeps work flowing.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l54-practical", [
    q({
      id: "va-q54-01", atom: "a-va-m8-board", d: 3,
      prompt: "Payments setup depends on the store, due 18 May. Which due date for payments is valid?",
      options: ["21 May", "18 May", "15 May", "1 May"],
      correct: "a",
      explanation: "A dependent task must be due after its dependency.",
      wrong: { b: "Same day as the dependency.", c: "Before it.", d: "Long before it." },
    }),
    q({
      id: "va-q54-02", atom: "a-va-m8-board", d: 2,
      prompt: "The logo was finished on 6 May. What status does it have on 11 May?",
      options: ["Done", "To do", "In progress", "Blocked"],
      correct: "a",
      explanation: "Finished work is Done.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q54-03", atom: "a-va-m8-update", d: 2,
      prompt: "What should be the clearest line in a progress update with a risk?",
      options: ["The decision needed from the client, with a date", "The weather", "A list of every task ever done", "Your working hours"],
      correct: "a",
      explanation: "The client must act on decisions.",
      wrong: { b: "No.", c: "Too much.", d: "Irrelevant." },
    }),
    q({
      id: "va-q54-04", atom: "a-va-m8-update", d: 2,
      prompt: "A missing document could delay payments and the launch. What status fits?",
      options: ["Amber", "Green", "Blue", "None"],
      correct: "a",
      explanation: "At risk and being managed.",
      wrong: { b: "Hides the risk.", c: "Not a RAG colour.", d: "A status is expected." },
    }),
  ]),
};

export default ASSESSMENTS;
