/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 14 · WORKPLACE COMMUNICATION
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l51-email-etiquette", [
    q({
      id: "cw-q51-01", atom: "a-cw-email-etiquette", d: 2,
      prompt: "When should you use Cc rather than To?",
      options: ["For people who only need to know, not act", "For your manager always", "For people you dislike", "Never"],
      correct: "a",
      explanation: "To is for those who must act; Cc is for information.",
      wrong: { b: "Only when they need to know.", c: "Not a professional criterion.", d: "Cc has a clear use." },
    }),
    q({
      id: "cw-q51-02", atom: "a-cw-email-structure", d: 2,
      prompt: "What does BLUF mean in email writing?",
      options: ["Bottom line up front: the purpose and request first", "Bold letters used frequently", "Blind list of users forwarded", "Brief, lengthy, usual, formal"],
      correct: "a",
      explanation: "Readers know at once what you need.",
      wrong: { b: "Not BLUF.", c: "Not BLUF.", d: "Not BLUF." },
    }),
    q({
      id: "cw-q51-03", atom: "a-cw-email-subjects", d: 2,
      prompt: "Which subject line is best?",
      options: ["Decision needed by Friday: venue for the June retreat", "Hello", "URGENT!!!", "(no subject)"],
      correct: "a",
      explanation: "Specific, with the action and deadline.",
      wrong: { b: "Says nothing.", c: "Says nothing and alarms.", d: "Never leave it blank." },
    }),
    q({
      id: "cw-q51-04", atom: "a-cw-greetings", d: 2,
      prompt: "Which greeting suits a first email to a senior external client?",
      options: ["Dear Dr Bello,", "Hey!", "Yo Fatima,", "Hi dear,"],
      correct: "a",
      explanation: "Formal greeting with title and surname for first contact.",
      wrong: { b: "Too casual.", c: "Inappropriate.", d: "Over-familiar." },
    }),
  ]),

  ...check("cw-l52-requests", [
    q({
      id: "cw-q52-01", atom: "a-cw-requests", d: 2,
      prompt: "What makes a request email most likely to get a fast yes?",
      options: ["The request first, the reason, a clear deadline and exactly what form you need", "A long explanation before the request", "Many exclamation marks", "Copying their manager"],
      correct: "a",
      explanation: "Make saying yes easy.",
      wrong: { b: "Buries the request.", c: "Pressure, not clarity.", d: "Can feel like pressure." },
    }),
    q({
      id: "cw-q52-02", atom: "a-cw-inquiries", d: 3,
      prompt: "Responding to an inquiry for 25 people at ₦12,000 each, what total should you state?",
      options: ["₦300,000", "₦12,000", "₦250,000", "₦3,000,000"],
      correct: "a",
      explanation: "25 × ₦12,000 = ₦300,000; do the calculation for the client.",
      wrong: { b: "That is per person.", c: "Arithmetic error.", d: "Arithmetic error." },
    }),
    q({
      id: "cw-q52-03", atom: "a-cw-follow-up-emails", d: 2,
      prompt: "Which follow-up opening is best?",
      options: ["\"I am following up on my email of 1 April about the partnership.\"", "\"As per my last email…\"", "\"I have not received any response from you.\"", "\"Why haven't you replied?\""],
      correct: "a",
      explanation: "Gives context without blame.",
      wrong: { b: "Sounds irritated.", c: "Sounds like blame.", d: "Hostile." },
    }),
    q({
      id: "cw-q52-04", atom: "a-cw-follow-up-emails", d: 2,
      prompt: "How long should you usually wait before a first follow-up?",
      options: ["Two to five working days, or just before a deadline", "One hour", "Six months", "Never follow up"],
      correct: "a",
      explanation: "Give people reasonable time, but do not let deadlines pass.",
      wrong: { b: "Too soon.", c: "Too late.", d: "Busy people miss emails." },
    }),
  ]),

  ...check("cw-l53-difficult", [
    q({
      id: "cw-q53-01", atom: "a-cw-complaints", d: 2,
      prompt: "What is wrong with \"We apologise for any inconvenience this may have caused\"?",
      options: ["It sounds automatic, doubts the harm and accepts no responsibility", "It is too short", "It uses \"we\"", "Nothing"],
      correct: "a",
      explanation: "Name the specific problem and own it.",
      wrong: { b: "Length is not the issue.", c: "\"We\" is fine.", d: "It weakens the apology." },
    }),
    q({
      id: "cw-q53-02", atom: "a-cw-complaints", d: 3,
      prompt: "In a complaint response, what is the difference between an explanation and an excuse?",
      options: ["An explanation gives brief context while accepting responsibility; an excuse shifts blame", "There is no difference", "Explanations are longer", "Excuses are more polite"],
      correct: "a",
      explanation: "Context helps; deflection angers.",
      wrong: { b: "They differ.", c: "Length is not the difference.", d: "Excuses sound defensive." },
    }),
    q({
      id: "cw-q53-03", atom: "a-cw-apology-thanks", d: 2,
      prompt: "Which thank-you is most effective?",
      options: ["\"Because you fixed the database on Friday, we sent the donor report on time.\"", "\"Thanks for your hard work.\"", "\"Good job.\"", "\"Thanks.\""],
      correct: "a",
      explanation: "Specific about what they did and its effect.",
      wrong: { b: "Generic.", c: "Generic.", d: "Generic." },
    }),
    q({
      id: "cw-q53-04", atom: "a-cw-clients-colleagues", d: 2,
      prompt: "After agreeing something with a client on a call, what should you do?",
      options: ["Confirm the agreement in writing", "Nothing; calls are enough", "Post it on social media", "Wait for them to write"],
      correct: "a",
      explanation: "\"As discussed, we will…\" prevents misunderstandings.",
      wrong: { b: "Memories differ.", c: "Confidential.", d: "Take responsibility for the record." },
    }),
  ]),

  ...check("cw-l54-workplace", [
    q({
      id: "cw-q54-01", atom: "a-cw-workplace-etiquette", d: 2,
      prompt: "Where should a disagreement with a colleague usually be raised?",
      options: ["Privately and respectfully", "In the whole-company chat", "By copying the CEO", "On social media"],
      correct: "a",
      explanation: "Disagree in private, praise in public.",
      wrong: { b: "Public conflict damages relationships.", c: "Escalates unnecessarily.", d: "Unprofessional." },
    }),
    q({
      id: "cw-q54-02", atom: "a-cw-cross-cultural", d: 2,
      prompt: "Why write \"5 March 2026\" rather than \"05/03/26\" to an international client?",
      options: ["05/03/26 can be read as 3 May in the US", "Slashes are rude", "Short dates are illegal", "It looks longer"],
      correct: "a",
      explanation: "Unambiguous dates prevent costly mistakes.",
      wrong: { b: "Not rude, just ambiguous.", c: "Not illegal.", d: "Not the reason." },
    }),
    q({
      id: "cw-q54-03", atom: "a-cw-remote", d: 2,
      prompt: "In a remote team, what makes a message easy to act on asynchronously?",
      options: ["It stands alone: background, question, options and deadline in one message", "It is one word", "It needs a meeting to explain", "It is sent at midnight"],
      correct: "a",
      explanation: "Colleagues elsewhere can act without a call.",
      wrong: { b: "Lacks context.", c: "Defeats async work.", d: "Timing is not the point." },
    }),
    q({
      id: "cw-q54-04", atom: "a-cw-chat-platforms", d: 2,
      prompt: "Which chat message is most professional?",
      options: ["\"Hi Grace, could you send the volunteer list by 3pm? I need it for name tags. Thanks!\"", "\"Hi\" then \"are you there?\"", "A three-minute voice note", "\"URGENT call me\""],
      correct: "a",
      explanation: "One complete message with the request first.",
      wrong: { b: "Fragments waste time.", c: "Hard to refer back to.", d: "No content." },
    }),
    q({
      id: "cw-q54-05", atom: "a-cw-m14-practical", d: 3,
      prompt: "When declining a request from your manager, what should you include?",
      options: ["Thanks, the reason, and an alternative or solution", "Only \"No\"", "A long list of complaints", "Nothing; just do not reply"],
      correct: "a",
      explanation: "A helpful no keeps trust.",
      wrong: { b: "Abrupt.", c: "Unprofessional.", d: "Unprofessional." },
    }),
  ]),
};

export default ASSESSMENTS;
