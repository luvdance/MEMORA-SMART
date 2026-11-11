/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 1 · INTRODUCTION TO WRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l1-welcome", [
    q({
      id: "cw-q1-01", atom: "a-cw-welcome", d: 1,
      prompt: "What does this course mean by writing that \"does its job\"?",
      options: [
        "Writing that causes the result the brief asks for, for a specific reader",
        "Writing that uses the most advanced vocabulary",
        "Writing that is as long as possible",
        "Writing that a grammar tool marks as error-free",
      ],
      correct: "a",
      explanation: "Professional writing is judged by its result: the reader understands, decides, buys or acts as intended.",
      wrong: { b: "Advanced vocabulary often makes writing harder to read.", c: "Length is not a goal; readers reward the shortest piece that works.", d: "Error-free text can still fail its reader." },
    }),
    q({
      id: "cw-q1-02", atom: "a-cw-welcome-parts", d: 1,
      prompt: "Why does the course start with grammar, style, tone and audience before content and copy?",
      options: [
        "Every kind of writing depends on those foundations",
        "Grammar is the only thing employers test",
        "Content and copy are less important",
        "It is the easiest material, so it comes first",
      ],
      correct: "a",
      explanation: "Content, copy and professional writing all rest on clear, correct sentences aimed at a known reader.",
      wrong: { b: "Employers test much more than grammar.", c: "They are the core of the course; the foundations make them possible.", d: "The order follows how skill is built, not difficulty alone." },
    }),
    q({
      id: "cw-q1-03", atom: "a-cw-welcome-desk", d: 1,
      prompt: "On the Writing Desk, what does a line that starts with \"## \" create?",
      options: ["A heading", "A bullet point", "A new paragraph", "A table row"],
      correct: "a",
      explanation: "\"## \" starts a heading; \"- \" starts a bullet; a blank line starts a new paragraph; \"|\" builds a table row.",
      wrong: { b: "A bullet starts with \"- \".", c: "A blank line starts a new paragraph.", d: "Table rows start with \"|\"." },
    }),
    q({
      id: "cw-q1-04", atom: "a-cw-welcome-desk", d: 2,
      prompt: "The starter template contains the line \"[Write your formal version here]\". What should you do with it?",
      options: [
        "Replace it with your own writing; lines in square brackets are instructions",
        "Leave it in, because the checks need it",
        "Copy it into every section",
        "Turn it into a heading",
      ],
      correct: "a",
      explanation: "Bracketed lines are instructions from the template and never count as your writing.",
      wrong: { b: "The checks ignore bracketed lines, so leaving them in adds nothing.", c: "Repeating the instruction is not writing.", d: "Headings are the \"## \" lines that divide the piece." },
    }),
  ]),

  ...check("cw-l2-disciplines", [
    q({
      id: "cw-q2-01", atom: "a-cw-what-is-writing", d: 1,
      prompt: "Why must writing be clearer than speech?",
      options: [
        "The reader cannot ask the writer what they meant",
        "Writing always uses more formal words",
        "Readers are less intelligent than listeners",
        "Written words are more expensive",
      ],
      correct: "a",
      explanation: "In speech you can see confusion and explain; on the page the text must answer every question alone.",
      wrong: { b: "Much good writing is informal; formality is not the reason.", c: "Nothing to do with intelligence.", d: "Cost is not the issue." },
    }),
    q({
      id: "cw-q2-02", atom: "a-cw-workplace", d: 2,
      prompt: "A team lead's vague email leads to five reply emails asking what she meant. What does this best illustrate?",
      options: [
        "Unclear writing costs time across a whole team",
        "Email is the wrong tool for teams",
        "Her colleagues do not read carefully",
        "Short emails are always bad",
      ],
      correct: "a",
      explanation: "Every missing or vague fact turns into a follow-up message, multiplied by every reader.",
      wrong: { b: "The channel was not the problem; the content was.", c: "The questions show they read it and could not act.", d: "Short emails are fine when they are complete." },
    }),
    q({
      id: "cw-q2-03", atom: "a-cw-copywriting", d: 2,
      prompt: "Which piece is copywriting?",
      options: [
        "\"Book your first cleaning today and get 20% off. Offer ends Sunday.\"",
        "\"How often should you clean your fridge? A simple monthly routine.\"",
        "\"Dear Mr Eze, please find the cleaning schedule for March below.\"",
        "\"The office will be cleaned on Saturday from 9am.\"",
      ],
      correct: "a",
      explanation: "Copy persuades the reader to take an action, here to book, with a reason and a deadline.",
      wrong: { b: "That teaches: content writing.", c: "That gets work done between people: professional writing.", d: "That is an internal notice: professional writing." },
    }),
    q({
      id: "cw-q2-04", atom: "a-cw-professional-writing", d: 2,
      prompt: "How is professional writing mainly judged?",
      options: [
        "By whether the reader understands it first time and can do what is needed",
        "By how many people share it on social media",
        "By how many products it sells",
        "By how long it keeps readers on the page",
      ],
      correct: "a",
      explanation: "Professional writing exists to get a task done: approve, attend, follow, fix.",
      wrong: { b: "Shares measure content reach.", c: "Sales measure copy.", d: "Time on page is a content metric." },
    }),
    q({
      id: "cw-q2-05", atom: "a-cw-three-compared", d: 3,
      prompt: "Which statement about the three disciplines is true?",
      options: [
        "They share the same foundations, and many real pieces mix them",
        "A writer should only ever learn one of them",
        "Copywriting does not need correct grammar",
        "Content writing never includes a call to action",
      ],
      correct: "a",
      explanation: "A product page informs and sells; a proposal is professional and persuasive. The foundations are shared.",
      wrong: { b: "Employers rarely hire a writer who can do only one.", c: "Errors in copy destroy trust and sales.", d: "Content often ends with a small call to action." },
    }),
  ]),

  ...check("cw-l3-process", [
    q({
      id: "cw-q3-01", atom: "a-cw-process", d: 1,
      prompt: "In which stage of the writing process do you decide the reader, purpose and outline?",
      options: ["Planning", "Drafting", "Editing", "Publishing"],
      correct: "a",
      explanation: "Planning answers what the piece must say, to whom and why, before a word of the draft.",
      wrong: { b: "Drafting writes the piece from the plan.", c: "Editing improves an existing draft.", d: "Publishing formats and releases it." },
    }),
    q({
      id: "cw-q3-02", atom: "a-cw-process", d: 2,
      prompt: "Why do professionals edit in passes, big things first?",
      options: [
        "There is no point polishing sentences in a paragraph you may delete",
        "Spelling matters more than structure",
        "Editors are paid by the pass",
        "It makes the draft longer",
      ],
      correct: "a",
      explanation: "Structural changes can remove whole sections; polish those sections last.",
      wrong: { b: "Structure decides whether the piece works at all.", c: "Not the reason.", d: "Editing usually makes a draft shorter." },
    }),
    q({
      id: "cw-q3-03", atom: "a-cw-effective", d: 2,
      prompt: "\"Our lamp lasts a long time\" becomes \"Our lamp gives 12 hours of light from one charge\". Which quality improved?",
      options: ["Concrete", "Courteous", "Coherent", "Concise"],
      correct: "a",
      explanation: "Concrete writing replaces vague claims with specific facts and numbers.",
      wrong: { b: "Courtesy is about respect and tone.", c: "Coherence is about logical order and connection.", d: "The new version is longer; its gain is specificity." },
    }),
    q({
      id: "cw-q3-04", atom: "a-cw-audience-purpose", d: 2,
      prompt: "What is a key message?",
      options: [
        "The one sentence the reader must remember if they forget everything else",
        "The headline of the piece",
        "The last sentence of every piece",
        "A list of all the facts",
      ],
      correct: "a",
      explanation: "Writing the key message before drafting keeps every sentence pointed at it.",
      wrong: { b: "A headline may express it, but the key message is a planning tool.", c: "It can appear anywhere, often first.", d: "A key message is one idea, not all the facts." },
    }),
    q({
      id: "cw-q3-05", atom: "a-cw-audience-purpose", d: 3,
      prompt: "A notice for older residents will be read on phones in a WhatsApp group. Which choice fits that audience best?",
      options: [
        "Short sentences, everyday words and the key facts near the top",
        "A detailed formal letter with background history first",
        "Technical medical terms to sound authoritative",
        "A long paragraph so nothing is left out",
      ],
      correct: "a",
      explanation: "The reader and the place they read decide the style: small screens and a general audience need plain, short, front-loaded text.",
      wrong: { b: "Background first buries what readers need.", c: "Jargon excludes the audience.", d: "Long blocks are hard to read on phones." },
    }),
  ]),

  ...check("cw-l4-careers", [
    q({
      id: "cw-q4-01", atom: "a-cw-mistakes", d: 1,
      prompt: "Which belief is a misconception about writing?",
      options: [
        "Good writers are born, not made",
        "Writing improves with practice and feedback",
        "Plain words can sound professional",
        "Grammar tools do not fix unclear thinking",
      ],
      correct: "a",
      explanation: "Writing is a skill built by practice and feedback, like driving.",
      wrong: { b: "True: that is how the skill is built.", c: "True: plain words read as confident.", d: "True: tools catch errors, not confused ideas." },
    }),
    q({
      id: "cw-q4-02", atom: "a-cw-mistakes", d: 2,
      prompt: "Which is the most common serious writing mistake?",
      options: [
        "Burying the main point at the end",
        "Using contractions such as \"don't\"",
        "Starting a sentence with \"And\"",
        "Using short paragraphs",
      ],
      correct: "a",
      explanation: "Readers who never reach the point never act on it. Put it first.",
      wrong: { b: "Contractions suit many audiences.", c: "Acceptable in modern English when used with care.", d: "Short paragraphs usually help readers." },
    }),
    q({
      id: "cw-q4-03", atom: "a-cw-careers", d: 2,
      prompt: "Which role mainly writes manuals, documentation and standard operating procedures?",
      options: ["Technical writer", "Copywriter", "Social media manager", "Ghostwriter"],
      correct: "a",
      explanation: "Technical writers explain how products and processes work.",
      wrong: { b: "Copywriters persuade.", c: "Social media managers write posts and captions.", d: "Ghostwriters write in another person's name." },
    }),
    q({
      id: "cw-q4-04", atom: "a-cw-m1-practical", d: 3,
      prompt: "\"Only 10 tickets left. Book now and save ₦5,000 before Friday.\" Type and purpose?",
      options: [
        "Copy, to persuade",
        "Content, to educate",
        "Professional, to request approval",
        "Content, to entertain",
      ],
      correct: "a",
      explanation: "Scarcity, a saving, a deadline and an instruction to act: persuasive copy.",
      wrong: { b: "It teaches nothing.", c: "It is addressed to the public, not a colleague.", d: "It exists to sell." },
    }),
    q({
      id: "cw-q4-05", atom: "a-cw-m1-practical", d: 3,
      prompt: "\"Staff must submit timesheets by 5pm every Friday through the HR portal.\" Type and purpose?",
      options: [
        "Professional, to instruct",
        "Copy, to persuade",
        "Content, to entertain",
        "Content, to inform the public",
      ],
      correct: "a",
      explanation: "An internal instruction that gets work done is professional writing.",
      wrong: { b: "Nothing is being sold.", c: "It is not entertainment.", d: "Its readers are staff, not the public." },
    }),
  ]),
};

export default ASSESSMENTS;
