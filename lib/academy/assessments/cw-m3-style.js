/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 3 · STYLE, TONE AND AUDIENCE
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l9-registers", [
    q({
      id: "cw-q9-01", atom: "a-cw-registers", d: 1,
      prompt: "Which register suits most everyday emails to clients you already work with?",
      options: ["Semi-formal", "Very formal legal language", "Informal slang", "Academic"],
      correct: "a",
      explanation: "Semi-formal is polite and correct but sounds like a professional person talking.",
      wrong: { b: "Too stiff for routine contact.", c: "Too casual for clients.", d: "Academic style is for research." },
    }),
    q({
      id: "cw-q9-02", atom: "a-cw-styles", d: 2,
      prompt: "Which feature is typical of academic writing?",
      options: ["Cautious claims such as \"the results suggest\"", "Frequent contractions", "A call to action", "Emojis"],
      correct: "a",
      explanation: "Academic writing proves carefully and hedges claims to the evidence.",
      wrong: { b: "Contractions are conversational.", c: "Calls to action are persuasive.", d: "Emojis are informal." },
    }),
    q({
      id: "cw-q9-03", atom: "a-cw-brand-voice", d: 2,
      prompt: "What does \"We are confident, not arrogant\" do in a voice chart?",
      options: [
        "Names a trait and marks the line writers must not cross",
        "Lists words the brand must never use",
        "Describes the brand's logo",
        "Sets the price of the product",
      ],
      correct: "a",
      explanation: "Each \"We are X, not Y\" line defines a trait and its limit.",
      wrong: { b: "Word lists are a separate part of the chart.", c: "Voice is about writing, not visuals.", d: "Unrelated to pricing." },
    }),
    q({
      id: "cw-q9-04", atom: "a-cw-tone", d: 3,
      prompt: "A playful brand must tell customers their payments failed because of a system outage. What should change?",
      options: [
        "The tone: calm, clear and helpful, while the voice stays recognisably the brand's",
        "The voice: become a different brand for the day",
        "Nothing: keep the jokes",
        "Stop communicating until it is fixed",
      ],
      correct: "a",
      explanation: "Voice is constant; tone adapts to the situation and the reader's mood.",
      wrong: { b: "Abandoning the voice confuses customers.", c: "Jokes about lost payments anger customers.", d: "Silence makes worried customers more worried." },
    }),
  ]),

  ...check("cw-l10-audience", [
    q({
      id: "cw-q10-01", atom: "a-cw-personas", d: 2,
      prompt: "What should a reader persona be based on?",
      options: ["Evidence about real readers", "The writer's imagination", "The CEO's personal taste", "The most common names in the country"],
      correct: "a",
      explanation: "A persona is a summary of research, not a guess.",
      wrong: { b: "An invented persona leads writing in the wrong direction.", c: "The CEO may not be the reader.", d: "A name is decoration; the evidence is the point." },
    }),
    q({
      id: "cw-q10-02", atom: "a-cw-personas", d: 2,
      prompt: "Which question belongs in audience analysis?",
      options: ["Where and how will they read this?", "What font is fashionable?", "How long can I make it?", "Which synonyms sound impressive?"],
      correct: "a",
      explanation: "Device, place and mood change length, structure and tone.",
      wrong: { b: "Fashion is irrelevant.", c: "Length follows the reader, not the writer's wish.", d: "Impressive words often lose readers." },
    }),
    q({
      id: "cw-q10-03", atom: "a-cw-age-background", d: 3,
      prompt: "You write for a mixed audience of experts and the public. What is the rule?",
      options: [
        "Write for the least expert reader who matters, explaining terms in passing",
        "Write for the experts; others can search the terms",
        "Avoid all numbers",
        "Write two sentences for every one idea",
      ],
      correct: "a",
      explanation: "Experts read plain text quickly; non-experts cannot read jargon at all.",
      wrong: { b: "That excludes most readers.", c: "Numbers help when explained.", d: "Padding is not clarity." },
    }),
    q({
      id: "cw-q10-04", atom: "a-cw-cultural", d: 2,
      prompt: "Which sentence is most inclusive?",
      options: [
        "Applicants should send their CVs by Friday.",
        "Each applicant should send his CV by Friday.",
        "Ladies and gentlemen should send CVs.",
        "Every applicant should send her CV by Friday.",
      ],
      correct: "a",
      explanation: "Plural or \"their\" avoids assuming the reader's gender.",
      wrong: { b: "Assumes all applicants are men.", c: "Unnecessary and excludes some readers.", d: "Assumes all applicants are women." },
    }),
  ]),

  ...check("cw-l11-readability", [
    q({
      id: "cw-q11-01", atom: "a-cw-readability", d: 2,
      prompt: "What two things do the Flesch readability formulas count?",
      options: ["Sentence length and word length in syllables", "Number of paragraphs and headings", "Spelling and grammar errors", "Images and links"],
      correct: "a",
      explanation: "Words per sentence and syllables per word drive both scores.",
      wrong: { b: "Structure is not in the formula.", c: "Errors are not counted.", d: "Images and links are ignored." },
    }),
    q({
      id: "cw-q11-02", atom: "a-cw-readability", d: 2,
      prompt: "A web article scores Flesch–Kincaid grade 8. What does that mean?",
      options: [
        "It is plain English most adults read comfortably",
        "Only university graduates can read it",
        "It has eight errors",
        "It takes eight minutes to read",
      ],
      correct: "a",
      explanation: "Grade 7 to 9 suits most public writing.",
      wrong: { b: "That would be grade 16 or higher.", c: "The score does not count errors.", d: "It measures difficulty, not time." },
    }),
    q({
      id: "cw-q11-03", atom: "a-cw-readability", d: 3,
      prompt: "Which link text is most accessible?",
      options: ["Download the 2026 price list (PDF)", "Click here", "Read more", "Link"],
      correct: "a",
      explanation: "Screen reader users often jump between links, so each link must make sense alone.",
      wrong: { b: "Meaningless out of context.", c: "Does not say what will be read.", d: "Says nothing." },
    }),
    q({
      id: "cw-q11-04", atom: "a-cw-storytelling", d: 2,
      prompt: "What are the three parts of the simplest story structure?",
      options: ["A character, a problem or desire, and a resolution", "A headline, a body and a footer", "Features, prices and a guarantee", "Introduction, method and results"],
      correct: "a",
      explanation: "A relatable person, what they faced, and how it changed.",
      wrong: { b: "That is page layout.", c: "Those are product facts.", d: "That is a research report." },
    }),
    q({
      id: "cw-q11-05", atom: "a-cw-multiplatform", d: 3,
      prompt: "When you adapt one announcement for a partner notice, a WhatsApp post and an advert, what must NOT change?",
      options: ["The core facts: dates, prices and names", "The register", "The length", "The call to action"],
      correct: "a",
      explanation: "Everything else adapts to the platform; the facts stay identical.",
      wrong: { b: "Register changes with the reader.", c: "Length changes with the platform.", d: "The action differs: questions for partners, booking for customers." },
    }),
  ]),
};

export default ASSESSMENTS;
