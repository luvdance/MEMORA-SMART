/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 10 · AI AND AUTOMATION
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l62-ai-intro", [
    q({
      id: "va-q62-01", atom: "a-va-genai", d: 2,
      prompt: "What is an AI \"hallucination\"?",
      options: ["A confident but false statement, such as an invented fact or source", "A picture created by AI", "A slow response", "A login error"],
      correct: "a",
      explanation: "LLMs can produce plausible but false content.",
      wrong: { b: "That is image generation.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q62-02", atom: "a-va-genai", d: 2,
      prompt: "Which task suits generative AI best?",
      options: ["Drafting and rewriting text", "Making legal decisions for a client", "Guaranteeing that facts are true", "Knowing the client's private plans without being told"],
      correct: "a",
      explanation: "Drafting, rewriting and summarising are strengths.",
      wrong: { b: "Decisions stay with humans.", c: "It can be wrong.", d: "It only knows what you tell it." },
    }),
    q({
      id: "va-q62-03", atom: "a-va-ai-research", d: 2,
      prompt: "An AI gives a statistic with a link that does not work. What do you do?",
      options: ["Do not use it unless you can verify it in a reliable source", "Use it", "Round it", "Ask the AI to confirm it"],
      correct: "a",
      explanation: "Unverifiable sources are a hallucination warning.",
      wrong: { b: "May be invented.", c: "Still unverified.", d: "Self-confirmation is not verification." },
    }),
    q({
      id: "va-q62-04", atom: "a-va-ai-research", d: 2,
      prompt: "How can AI help research honestly?",
      options: ["Brainstorming, explaining topics and summarising sources you then check", "Providing final facts without checking", "Replacing all sources", "Writing the client's decisions"],
      correct: "a",
      explanation: "AI speeds research; verification stays with you.",
      wrong: { b: "Facts must be verified.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l63-prompts", [
    q({
      id: "va-q63-01", atom: "a-va-prompt-parts", d: 2,
      prompt: "Which part of a prompt gives the AI the facts and background it needs?",
      options: ["Context", "Role", "Format", "Constraints"],
      correct: "a",
      explanation: "Context supplies what the AI cannot know.",
      wrong: { b: "Who the AI acts as.", c: "The shape of the output.", d: "Limits such as tone and length." },
    }),
    q({
      id: "va-q63-02", atom: "a-va-prompt-parts", d: 2,
      prompt: "Why use placeholders such as [Customer name] in prompts?",
      options: ["To keep personal data out of the AI tool", "To confuse the AI", "Because AI cannot read names", "To make the prompt longer"],
      correct: "a",
      explanation: "Protect privacy; fill in the details afterwards.",
      wrong: { b: "No.", c: "It can.", d: "No." },
    }),
    q({
      id: "va-q63-03", atom: "a-va-iterate", d: 2,
      prompt: "The AI's draft is too long and stiff. What is the best next prompt?",
      options: ["\"Make it warmer and under 150 words.\"", "\"Try again.\"", "\"Write a reply.\"", "\"Better.\""],
      correct: "a",
      explanation: "Specific refinements get better results.",
      wrong: { b: "Vague.", c: "Starts over vaguely.", d: "Says nothing." },
    }),
    q({
      id: "va-q63-04", atom: "a-va-iterate", d: 2,
      prompt: "Who is responsible for the final AI-assisted email sent to a client's customer?",
      options: ["You, the VA who edits and sends it", "The AI company", "The customer", "Nobody"],
      correct: "a",
      explanation: "You check and own everything you deliver.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l64-ai-writing", [
    q({
      id: "va-q64-01", atom: "a-va-ai-writing", d: 2,
      prompt: "What should you do with every AI-drafted email before sending?",
      options: ["Check facts, remove generic phrases and make it sound like the client", "Send it immediately", "Add more AI text", "Translate it twice"],
      correct: "a",
      explanation: "Edit for accuracy and voice.",
      wrong: { b: "Unchecked AI text can be wrong.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q64-02", atom: "a-va-ai-summaries", d: 2,
      prompt: "An AI meeting summary says \"agreed to raise prices in July\"; the transcript says prices will be reviewed in July. What do you do?",
      options: ["Correct it to the exact decision from the transcript", "Keep the AI version", "Delete the price point", "Ask the AI if it is sure"],
      correct: "a",
      explanation: "Decisions must be exact.",
      wrong: { b: "It is wrong.", c: "It is an important point.", d: "Check the transcript instead." },
    }),
    q({
      id: "va-q64-03", atom: "a-va-ai-summaries", d: 2,
      prompt: "What must you do before an AI tool records a meeting?",
      options: ["Get the participants' permission", "Nothing", "Turn off everyone's camera", "Tell only the client afterwards"],
      correct: "a",
      explanation: "Consent before recording.",
      wrong: { b: "Consent is needed.", c: "Irrelevant.", d: "Too late." },
    }),
    q({
      id: "va-q64-04", atom: "a-va-ai-summaries", d: 2,
      prompt: "What do AI summaries most often get wrong?",
      options: ["Details: numbers, dates, names and actions", "The general topic", "The language", "The meeting's title"],
      correct: "a",
      explanation: "Check every detail against the source.",
      wrong: { b: "Usually right.", c: "Usually right.", d: "Rarely matters." },
    }),
  ]),

  ...check("va-l65-ai-tasks", [
    q({
      id: "va-q65-01", atom: "a-va-ai-planning", d: 2,
      prompt: "AI produces a task list for a launch. What next?",
      options: ["Adapt it: remove what doesn't apply, add real owners, dates and dependencies", "Use it unchanged", "Delete it", "Send it to the client as final"],
      correct: "a",
      explanation: "AI drafts; you make it real.",
      wrong: { b: "It does not know the client's team.", c: "It is a useful draft.", d: "Unchecked." },
    }),
    q({
      id: "va-q65-02", atom: "a-va-ai-sheets", d: 2,
      prompt: "How should you check an AI-generated formula?",
      options: ["Test it on rows where you already know the answer", "Trust it", "Make it longer", "Ask another AI"],
      correct: "a",
      explanation: "Testing catches wrong ranges and arguments.",
      wrong: { b: "AI often gets details wrong.", c: "No.", d: "Not a test." },
    }),
    q({
      id: "va-q65-03", atom: "a-va-ai-sheets", d: 3,
      prompt: "Channels are in B2:B8 and amounts in C2:C8. Which formula totals WhatsApp orders?",
      options: ["=SUMIF(B2:B8,\"WhatsApp\",C2:C8)", "=SUMIF(C2:C8,\"WhatsApp\",B2:B8)", "=SUM(\"WhatsApp\")", "=COUNTIF(B2:B8,\"WhatsApp\")"],
      correct: "a",
      explanation: "Check the channels, add the amounts.",
      wrong: { b: "Ranges swapped; returns 0.", c: "Not valid.", d: "Counts, does not add." },
    }),
    q({
      id: "va-q65-04", atom: "a-va-ai-support", d: 2,
      prompt: "Which rule applies to AI in customer support?",
      options: ["It answers only from real policies, and sensitive cases go to a human", "It may offer any refund to keep customers happy", "Customers must never reach a person", "Drafts can be sent without review"],
      correct: "a",
      explanation: "Accuracy and human escalation.",
      wrong: { b: "It must not invent remedies.", c: "Humans must be reachable.", d: "Review first." },
    }),
  ]),

  ...check("va-l66-automation", [
    q({
      id: "va-q66-01", atom: "a-va-automation", d: 2,
      prompt: "In an automation, what is the trigger?",
      options: ["The event that starts it", "The last step", "The price of the tool", "The error message"],
      correct: "a",
      explanation: "e.g. a new form response.",
      wrong: { b: "That is an action.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q66-02", atom: "a-va-automation", d: 2,
      prompt: "What does a filter do in a Zap?",
      options: ["Lets it continue only when a condition is true", "Deletes data", "Starts the Zap", "Encrypts emails"],
      correct: "a",
      explanation: "e.g. only orders over ₦100,000.",
      wrong: { b: "No.", c: "That is the trigger.", d: "No." },
    }),
    q({
      id: "va-q66-03", atom: "a-va-automation-practice", d: 2,
      prompt: "What should you do before turning an automation on?",
      options: ["Test it with sample data and check every result", "Nothing", "Tell no one", "Delete the old data"],
      correct: "a",
      explanation: "Testing prevents mistakes at scale.",
      wrong: { b: "Risky.", c: "Document it.", d: "No." },
    }),
    q({
      id: "va-q66-04", atom: "a-va-automation", d: 1,
      prompt: "What does Make call an automation?",
      options: ["A scenario", "A Zap", "A macro", "A pivot"],
      correct: "a",
      explanation: "Zapier calls it a Zap.",
      wrong: { b: "That is Zapier.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q66-05", atom: "a-va-automation-practice", d: 2,
      prompt: "Why do automations need monitoring?",
      options: ["They fail when passwords or form fields change", "They get bored", "They cost nothing", "They never fail"],
      correct: "a",
      explanation: "Watch for error alerts.",
      wrong: { b: "No.", c: "Irrelevant.", d: "They do fail." },
    }),
  ]),

  ...check("va-l67-ai-ethics", [
    q({
      id: "va-q67-01", atom: "a-va-ai-privacy", d: 2,
      prompt: "Can you paste customer names and phone numbers into a free AI chatbot?",
      options: ["Not unless the client has approved that tool for that data; otherwise remove them first", "Yes, always", "Yes, if it saves time", "Only on weekends"],
      correct: "a",
      explanation: "Personal data needs approval and protection.",
      wrong: { b: "Privacy risk.", c: "Time is not a reason.", d: "No." },
    }),
    q({
      id: "va-q67-02", atom: "a-va-ai-ethics", d: 2,
      prompt: "A client asks for AI-written fake reviews. You…",
      options: ["Decline and offer an honest way to collect real reviews", "Write them", "Write fewer", "Ask friends to post them"],
      correct: "a",
      explanation: "Fake reviews are deceptive.",
      wrong: { b: "Deceptive.", c: "Still fake.", d: "Still fake." },
    }),
    q({
      id: "va-q67-03", atom: "a-va-ai-ethics", d: 2,
      prompt: "Why review AI outputs for bias?",
      options: ["AI can reproduce stereotypes, for example in job ads", "AI is always neutral", "Bias makes text shorter", "It is not necessary"],
      correct: "a",
      explanation: "Check for fairness.",
      wrong: { b: "No.", c: "No.", d: "It is." },
    }),
    q({
      id: "va-q67-04", atom: "a-va-ai-privacy", d: 2,
      prompt: "A client has no AI policy. What should you do before using AI on their work?",
      options: ["Ask them", "Use any tool freely", "Hide that you use AI", "Stop working for them"],
      correct: "a",
      explanation: "Agree how AI may be used.",
      wrong: { b: "Risky.", c: "Dishonest.", d: "Unnecessary." },
    }),
  ]),

  ...check("va-l68-practical", [
    q({
      id: "va-q68-01", atom: "a-va-m10-method", d: 2,
      prompt: "In a research note, what should you do with a claim you cannot verify?",
      options: ["Mark it as not verified and exclude it", "Include it in bold", "Change the numbers", "Hide it in a footnote as fact"],
      correct: "a",
      explanation: "Only verified facts are used.",
      wrong: { b: "Unverified.", c: "Fabrication.", d: "Still presented as fact." },
    }),
    q({
      id: "va-q68-02", atom: "a-va-m10-practical", d: 2,
      prompt: "A Zap should send a WhatsApp reminder only for calls within 24 hours. Which step does this?",
      options: ["A filter", "The trigger", "The first action", "The test"],
      correct: "a",
      explanation: "Filters set conditions.",
      wrong: { b: "Starts it.", c: "Runs for all.", d: "Checks it." },
    }),
    q({
      id: "va-q68-03", atom: "a-va-m10-method", d: 2,
      prompt: "What is the right order for an AI-assisted task?",
      options: ["Check it is allowed, remove private data, prompt, refine, verify and edit", "Prompt, send, then check", "Send, then prompt", "Verify first, then decide if AI is allowed"],
      correct: "a",
      explanation: "Permission and privacy first, verification last.",
      wrong: { b: "Checking after sending is too late.", c: "No.", d: "Out of order." },
    }),
    q({
      id: "va-q68-04", atom: "a-va-m10-practical", d: 2,
      prompt: "Why save successful prompts in a library?",
      options: ["To reuse what works and save time", "To sell them to clients' competitors", "Because AI requires it", "It is not useful"],
      correct: "a",
      explanation: "Good prompts are reusable assets.",
      wrong: { b: "Unethical.", c: "No.", d: "It is." },
    }),
  ]),
};

export default ASSESSMENTS;
