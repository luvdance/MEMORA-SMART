/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 7 · CUSTOMER SERVICE
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l42-service", [
    q({
      id: "va-q42-01", atom: "a-va-service-basics", d: 2,
      prompt: "\"That's not my department\" breaks which customer service principle?",
      options: ["Ownership", "Speed", "Accuracy", "Brand voice"],
      correct: "a",
      explanation: "Own the problem until it is solved or properly handed over.",
      wrong: { b: "It may be fast, but it abandons the customer.", c: "It may be accurate, but unhelpful.", d: "Not the main issue." },
    }),
    q({
      id: "va-q42-02", atom: "a-va-expectations", d: 2,
      prompt: "What is an SLA in customer support?",
      options: ["Written targets such as first reply to email within 4 working hours", "A type of refund", "A customer's complaint letter", "A social media platform"],
      correct: "a",
      explanation: "A service level agreement sets measurable targets.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q42-03", atom: "a-va-expectations", d: 2,
      prompt: "Which channel do customers expect the fastest reply on?",
      options: ["Live chat", "Email", "Post", "A review site"],
      correct: "a",
      explanation: "Chat is expected within a minute or two.",
      wrong: { b: "Usually within a working day.", c: "Slowest.", d: "Hours to a day." },
    }),
    q({
      id: "va-q42-04", atom: "a-va-sla-desk", d: 2,
      prompt: "An email reports swelling after using a cream. How should it be treated?",
      options: ["As urgent, whatever the channel", "As a normal email within 4 working hours", "As low priority", "It should be ignored"],
      correct: "a",
      explanation: "Safety issues are urgent regardless of channel.",
      wrong: { b: "Safety outranks channel.", c: "Wrong.", d: "Never." },
    }),
  ]),

  ...check("va-l43-inquiries-complaints", [
    q({
      id: "va-q43-01", atom: "a-va-complaints", d: 2,
      prompt: "What does HEARD stand for?",
      options: ["Hear, Empathise, Apologise, Resolve, Diagnose", "Help, Explain, Argue, Refund, Delete", "Hold, Escalate, Answer, Reply, Done", "Hear, Explain, Ask, Repeat, Decide"],
      correct: "a",
      explanation: "The five steps of handling a complaint.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q43-02", atom: "a-va-complaints", d: 2,
      prompt: "Which apology is sincere?",
      options: ["\"I'm sorry your order arrived with the wrong item.\"", "\"We apologise for any inconvenience.\"", "\"Sorry if you were upset.\"", "\"Mistakes happen.\""],
      correct: "a",
      explanation: "Specific and without \"if\" or vague wording.",
      wrong: { b: "Vague and formulaic.", c: "\"If\" doubts their experience.", d: "Dismissive." },
    }),
    q({
      id: "va-q43-03", atom: "a-va-conflict", d: 2,
      prompt: "An angry customer posts publicly. What should you do after replying politely?",
      options: ["Move the conversation to a private channel to solve it", "Argue the facts publicly", "Delete their post", "Ignore further replies"],
      correct: "a",
      explanation: "Private channels protect details and lower the temperature.",
      wrong: { b: "Escalates the conflict.", c: "Looks like censorship.", d: "Abandons the customer." },
    }),
    q({
      id: "va-q43-04", atom: "a-va-inquiries", d: 2,
      prompt: "When you do not know the answer to an inquiry, you should…",
      options: ["Say you will find out and when you will reply, then do it", "Guess", "Ignore the question", "Tell them to search online"],
      correct: "a",
      explanation: "Accuracy plus a clear promise kept.",
      wrong: { b: "Wrong information causes new problems.", c: "Leaves the customer unhappy.", d: "Pushes your job onto them." },
    }),
    q({
      id: "va-q43-05", atom: "a-va-complaints", d: 2,
      prompt: "A customer had to write twice before getting a reply. What should your reply do?",
      options: ["Acknowledge that and apologise for it", "Ignore it", "Blame the spam filter only", "Ask why they wrote twice"],
      correct: "a",
      explanation: "Acknowledging the extra effort shows you heard them.",
      wrong: { b: "They will notice.", c: "Blame is not an apology.", d: "Unhelpful." },
    }),
  ]),

  ...check("va-l44-channels", [
    q({
      id: "va-q44-01", atom: "a-va-chat", d: 2,
      prompt: "What should you do during a pause in a live chat while you check something?",
      options: ["Tell the customer what you are doing, such as \"Let me check that for you, one moment\"", "Say nothing", "End the chat", "Send a long paragraph later"],
      correct: "a",
      explanation: "Customers should never wonder if you are still there.",
      wrong: { b: "Feels like abandonment.", c: "No.", d: "Chat needs short messages." },
    }),
    q({
      id: "va-q44-02", atom: "a-va-phone-support", d: 2,
      prompt: "Before putting a caller on hold, you should…",
      options: ["Ask permission and say how long it will take", "Just press hold", "Hang up and call back", "Ask them to hold for as long as needed"],
      correct: "a",
      explanation: "Permission and a time limit respect the caller.",
      wrong: { b: "Rude.", c: "Unnecessary.", d: "Open-ended holds frustrate callers." },
    }),
    q({
      id: "va-q44-03", atom: "a-va-email-support", d: 2,
      prompt: "How should you use email templates (macros)?",
      options: ["Personalise them with the customer's name, details and a sentence showing you read their message", "Send them unchanged", "Never use templates", "Copy another customer's reply"],
      correct: "a",
      explanation: "Templates save time; personalisation keeps them human.",
      wrong: { b: "Feels robotic and may not fit.", c: "Templates are efficient.", d: "Risks sharing another customer's details." },
    }),
    q({
      id: "va-q44-04", atom: "a-va-chat", d: 2,
      prompt: "How should a live chat end?",
      options: ["Confirm the problem is solved and ask if there is anything else", "Close the window suddenly", "Send a survey only", "Say \"bye\""],
      correct: "a",
      explanation: "Confirm and offer further help.",
      wrong: { b: "Abrupt.", c: "Not enough.", d: "Too abrupt." },
    }),
  ]),

  ...check("va-l45-feedback", [
    q({
      id: "va-q45-01", atom: "a-va-csat-nps", d: 2,
      prompt: "On the NPS scale, which scores are promoters?",
      options: ["9 and 10", "7 and 8", "0 to 6", "5 and above"],
      correct: "a",
      explanation: "9–10 promoters, 7–8 passives, 0–6 detractors.",
      wrong: { b: "Passives.", c: "Detractors.", d: "Not the definition." },
    }),
    q({
      id: "va-q45-02", atom: "a-va-nps-sheet", d: 3,
      prompt: "Out of 20 answers, 10 are promoters and 4 are detractors. What is the NPS?",
      options: ["30", "50", "60", "14"],
      correct: "a",
      explanation: "50% − 20% = 30.",
      wrong: { b: "That is only the promoter share.", c: "Adds instead of subtracts.", d: "Wrong calculation." },
    }),
    q({
      id: "va-q45-03", atom: "a-va-act-feedback", d: 2,
      prompt: "What is the best way to reply to a negative public review?",
      options: ["Thank them, apologise, and invite them to continue privately", "Argue with the facts publicly", "Ignore it", "Post fake positive reviews"],
      correct: "a",
      explanation: "Polite, brief and moving to a private channel.",
      wrong: { b: "Puts off readers.", c: "Looks uncaring.", d: "Dishonest and against platform rules." },
    }),
    q({
      id: "va-q45-04", atom: "a-va-csat-nps", d: 2,
      prompt: "CSAT is usually calculated as…",
      options: ["The percentage of 4 and 5 answers on a 1–5 satisfaction scale", "The average delivery time", "The number of complaints", "Promoters minus detractors"],
      correct: "a",
      explanation: "The share of satisfied responses.",
      wrong: { b: "No.", c: "No.", d: "That is NPS." },
    }),
  ]),

  ...check("va-l46-tickets", [
    q({
      id: "va-q46-01", atom: "a-va-ticket-basics", d: 2,
      prompt: "A ticket is waiting for the customer to send a photo. Its status is…",
      options: ["Pending", "Solved", "New", "Closed"],
      correct: "a",
      explanation: "Pending means waiting for the customer.",
      wrong: { b: "Not fixed yet.", c: "It has been worked on.", d: "Not finished." },
    }),
    q({
      id: "va-q46-02", atom: "a-va-ticket-basics", d: 2,
      prompt: "Which ticket should be Urgent?",
      options: ["A customer reporting a burning reaction to a product", "A question about opening hours", "A suggestion for a new colour", "A request for a catalogue"],
      correct: "a",
      explanation: "Safety issues are urgent.",
      wrong: { b: "Normal.", c: "Low.", d: "Low or normal." },
    }),
    q({
      id: "va-q46-03", atom: "a-va-escalation", d: 2,
      prompt: "What must a good escalation note include?",
      options: ["Ticket and order numbers, the issue, details, what was done and what is needed", "Only \"please help\"", "The customer's full conversation pasted with no summary", "Your opinion of the customer"],
      correct: "a",
      explanation: "The next person should act without re-reading everything.",
      wrong: { b: "Not actionable.", c: "Makes them do the work.", d: "Unprofessional." },
    }),
    q({
      id: "va-q46-04", atom: "a-va-escalation", d: 2,
      prompt: "When should you escalate a ticket?",
      options: ["When policy requires it or the fix is beyond your authority", "Whenever a customer is difficult", "Never", "To avoid work"],
      correct: "a",
      explanation: "Escalation is for authority and expertise, not avoidance.",
      wrong: { b: "Difficult customers are part of the job.", c: "Some issues must be escalated.", d: "No." },
    }),
    q({
      id: "va-q46-05", atom: "a-va-escalation", d: 2,
      prompt: "After escalating a ticket, what should you tell the customer?",
      options: ["That it has been escalated and when they will hear back", "Nothing", "That it is someone else's problem now", "To contact Finance themselves"],
      correct: "a",
      explanation: "Keep the customer informed and follow up.",
      wrong: { b: "Leaves them guessing.", c: "Breaks ownership.", d: "Pushes work onto them." },
    }),
  ]),

  ...check("va-l47-retention-systems", [
    q({
      id: "va-q47-01", atom: "a-va-retention", d: 2,
      prompt: "Which is a proactive retention action?",
      options: ["Telling customers about a delay before they ask", "Waiting for complaints", "Deleting old customers' records", "Raising prices without notice"],
      correct: "a",
      explanation: "Proactive communication builds trust.",
      wrong: { b: "Reactive.", c: "No.", d: "Drives customers away." },
    }),
    q({
      id: "va-q47-02", atom: "a-va-helpdesks", d: 2,
      prompt: "What is a macro in a help desk such as Zendesk?",
      options: ["A saved reply and set of actions applied to a ticket", "A large ticket", "A type of customer", "A billing plan"],
      correct: "a",
      explanation: "Macros speed up common responses.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q47-03", atom: "a-va-helpdesks", d: 2,
      prompt: "Intercom is best known for…",
      options: ["Chat widgets, chatbots and messaging customers in websites and apps", "Spreadsheets", "Video editing", "Accounting"],
      correct: "a",
      explanation: "Intercom is conversation-centred.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q47-04", atom: "a-va-onboarding", d: 2,
      prompt: "What should a new customer's welcome message include?",
      options: ["A warm welcome, the first steps as a short list, key information and who to contact", "Only a discount code", "The full terms and conditions", "Nothing until they complain"],
      correct: "a",
      explanation: "Set them up for success from day one.",
      wrong: { b: "Not enough.", c: "Overwhelming.", d: "Too late." },
    }),
  ]),

  ...check("va-l48-practical", [
    q({
      id: "va-q48-01", atom: "a-va-m7-desk", d: 2,
      prompt: "A journalist asks for a comment on a product. What do you do?",
      options: ["Escalate to the manager immediately; do not comment", "Reply with your own opinion", "Ignore it", "Send the product list"],
      correct: "a",
      explanation: "Press inquiries go to the manager.",
      wrong: { b: "Never speak to the press for a client without authority.", c: "Could cause bad coverage.", d: "Not a reply to the question." },
    }),
    q({
      id: "va-q48-02", atom: "a-va-m7-desk", d: 2,
      prompt: "A ticket says only \"Something is wrong with my order\". The action is…",
      options: ["Ask the customer for details and mark it Pending", "Refund immediately", "Escalate to the manager", "Close it"],
      correct: "a",
      explanation: "You need details before you can help.",
      wrong: { b: "You do not know the problem.", c: "Nothing to escalate yet.", d: "Unhelpful." },
    }),
    q({
      id: "va-q48-03", atom: "a-va-m7-replies", d: 2,
      prompt: "Policy lets you give a 10% goodwill code. A customer demands 30%. You…",
      options: ["Offer 10% and escalate to the manager if they want more", "Give 30%", "Refuse any discount rudely", "Give 50% to end the conversation"],
      correct: "a",
      explanation: "Stay within your authority; escalate exceptions.",
      wrong: { b: "Beyond your authority.", c: "Rude.", d: "Beyond your authority." },
    }),
    q({
      id: "va-q48-04", atom: "a-va-m7-replies", d: 2,
      prompt: "How should you refuse a refund that the policy does not allow?",
      options: ["Politely, explaining the policy and offering a helpful alternative", "Bluntly: \"No refunds\"", "Grant it anyway", "Ignore the request"],
      correct: "a",
      explanation: "A kind no with an alternative keeps goodwill.",
      wrong: { b: "Damages the relationship.", c: "Breaks the policy.", d: "Unprofessional." },
    }),
  ]),
};

export default ASSESSMENTS;
