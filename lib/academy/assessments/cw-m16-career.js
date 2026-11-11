/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 16 · CV AND CAREER COMMUNICATION
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l59-cv", [
    q({
      id: "cw-q59-01", atom: "a-cw-modern-cv", d: 2,
      prompt: "What is an applicant tracking system (ATS)?",
      options: ["Software that stores applications and lets recruiters search them by keywords", "A CV template", "A job board", "A type of interview"],
      correct: "a",
      explanation: "CVs must work for keyword searches as well as human readers.",
      wrong: { b: "Not software for recruiters.", c: "Job boards list jobs.", d: "Not an interview." },
    }),
    q({
      id: "cw-q59-02", atom: "a-cw-modern-cv", d: 2,
      prompt: "Which item should usually be left off a modern CV?",
      options: ["Date of birth and religion", "Professional email", "Achievements with numbers", "Relevant skills"],
      correct: "a",
      explanation: "They do not show ability and can invite bias.",
      wrong: { b: "Needed.", c: "Essential.", d: "Essential." },
    }),
    q({
      id: "cw-q59-03", atom: "a-cw-cv-formats", d: 2,
      prompt: "Which CV format do recruiters and ATS software generally prefer?",
      options: ["Reverse chronological", "A design-heavy infographic", "Skills-only with no dates", "A handwritten CV"],
      correct: "a",
      explanation: "Most recent experience first, clear dates.",
      wrong: { b: "Often unreadable by software.", c: "Recruiters may distrust it.", d: "Not used." },
    }),
    q({
      id: "cw-q59-04", atom: "a-cw-cv-summary", d: 3,
      prompt: "Which professional summary is strongest?",
      options: [
        "\"Accounts officer with 3 years' experience who cut month-end closing from 10 days to 6 at a logistics firm.\"",
        "\"Hardworking team player seeking a challenging role.\"",
        "\"I want to work in a reputable organisation.\"",
        "\"Results-oriented go-getter.\"",
      ],
      correct: "a",
      explanation: "Identity, experience and a measurable achievement.",
      wrong: { b: "Empty phrases.", c: "About what you want, not what you offer.", d: "Empty phrases." },
    }),
    q({
      id: "cw-q59-05", atom: "a-cw-describing-experience", d: 2,
      prompt: "Which tense should bullets for a past role use?",
      options: ["Past tense", "Future tense", "Present continuous", "Any, mixed freely"],
      correct: "a",
      explanation: "Past roles in the past tense; the current role in the present.",
      wrong: { b: "The work is done.", c: "Not for past roles.", d: "Be consistent." },
    }),
  ]),

  ...check("cw-l60-achievements", [
    q({
      id: "cw-q60-01", atom: "a-cw-achievement-bullets", d: 2,
      prompt: "Which is an achievement bullet?",
      options: ["\"Trained 3 interns to write social captions in the station's voice\"", "\"Responsible for interns\"", "\"Duties included training\"", "\"Helped with interns\""],
      correct: "a",
      explanation: "Action verb + what you did + scale.",
      wrong: { b: "A duty.", c: "A duty.", d: "Weak and vague." },
    }),
    q({
      id: "cw-q60-02", atom: "a-cw-measurable-results", d: 2,
      prompt: "You do not know the exact figure for an achievement. What is acceptable?",
      options: ["An honest estimate you can explain, or a description without a number", "Inventing an impressive number", "Leaving every achievement out", "Copying a friend's numbers"],
      correct: "a",
      explanation: "Employers check, and false numbers destroy credibility.",
      wrong: { b: "Dishonest.", c: "Unnecessary.", d: "Dishonest." },
    }),
    q({
      id: "cw-q60-03", atom: "a-cw-tailored-cv", d: 3,
      prompt: "What does tailoring a CV mean?",
      options: ["Reordering and wording true evidence to match each advert's requirements", "Adding skills you do not have", "Changing your job titles to match the advert", "Sending the same CV everywhere"],
      correct: "a",
      explanation: "Tailoring is selecting and wording truthfully, never inventing.",
      wrong: { b: "Dishonest.", c: "Dishonest.", d: "The opposite." },
    }),
    q({
      id: "cw-q60-04", atom: "a-cw-tailored-cv", d: 2,
      prompt: "Why use the advert's exact words where they truthfully apply?",
      options: ["They help ATS keyword searches and show the recruiter a clear match", "Recruiters like copying", "It makes the CV longer", "It is a legal requirement"],
      correct: "a",
      explanation: "Keywords connect your evidence to their needs.",
      wrong: { b: "Not the reason.", c: "Not the aim.", d: "Not required." },
    }),
  ]),

  ...check("cw-l61-letters-brand", [
    q({
      id: "cw-q61-01", atom: "a-cw-cover-letters", d: 2,
      prompt: "Which cover letter opening is strongest?",
      options: [
        "\"I am applying for the Content Writer role because my SEO articles have taken clients to the top of Google.\"",
        "\"I am writing to apply for the above-mentioned position.\"",
        "\"To whom it may concern, please find my CV.\"",
        "\"I need a job urgently.\"",
      ],
      correct: "a",
      explanation: "Name the role and your strongest reason in the first sentence.",
      wrong: { b: "Stock phrase, no reason.", c: "Impersonal and empty.", d: "About your need, not their benefit." },
    }),
    q({
      id: "cw-q61-02", atom: "a-cw-bios", d: 2,
      prompt: "In which person is a professional bio usually written?",
      options: ["Third person", "First person plural", "Second person", "It must be in the future tense"],
      correct: "a",
      explanation: "So others can use it to introduce you.",
      wrong: { b: "That is a company voice.", c: "Not for bios.", d: "Tense is not the point." },
    }),
    q({
      id: "cw-q61-03", atom: "a-cw-linkedin", d: 2,
      prompt: "Why do the first two lines of a LinkedIn About section matter most?",
      options: ["They show before \"see more\"", "LinkedIn deletes the rest", "Recruiters read only those words by law", "They are the headline"],
      correct: "a",
      explanation: "The hook must earn the click to read on.",
      wrong: { b: "It is not deleted.", c: "No such law.", d: "The headline is separate." },
    }),
    q({
      id: "cw-q61-04", atom: "a-cw-personal-brand", d: 3,
      prompt: "For a writer, what shapes personal brand most?",
      options: ["The consistency and quality of everything they write publicly", "The colour of their profile photo", "Their number of followers only", "Their email provider"],
      correct: "a",
      explanation: "Every message is a writing sample.",
      wrong: { b: "Minor.", c: "Followers are not the brand.", d: "Irrelevant." },
    }),
  ]),

  ...check("cw-l62-applications", [
    q({
      id: "cw-q62-01", atom: "a-cw-application-emails", d: 2,
      prompt: "What is wrong with sending a job application email with only attachments and an empty body?",
      options: ["The email is the first writing sample the employer sees", "Nothing", "Attachments are not allowed", "It is too formal"],
      correct: "a",
      explanation: "Write a short, professional body that names the role and your fit.",
      wrong: { b: "It looks careless.", c: "Attachments are expected.", d: "It says nothing at all." },
    }),
    q({
      id: "cw-q62-02", atom: "a-cw-networking", d: 2,
      prompt: "What should a first networking message to a stranger ask for?",
      options: ["Something small and specific, such as a 15-minute call or one piece of advice", "A job immediately", "A large loan", "Nothing; just say hi"],
      correct: "a",
      explanation: "Small, specific requests are easy to say yes to.",
      wrong: { b: "Too much from a stranger.", c: "Inappropriate.", d: "Gives no reason to reply." },
    }),
    q({
      id: "cw-q62-03", atom: "a-cw-statements-interest", d: 2,
      prompt: "When is a statement of interest typically used?",
      options: ["For programmes, fellowships, scholarships or organisations without an advertised role", "Only for retail jobs", "Instead of a CV for every job", "For complaints"],
      correct: "a",
      explanation: "It explains motivation, evidence and fit.",
      wrong: { b: "Not limited to retail.", c: "Not a replacement.", d: "Unrelated." },
    }),
    q({
      id: "cw-q62-04", atom: "a-cw-m16-practical", d: 3,
      prompt: "How do the CV, cover letter and LinkedIn About differ in job?",
      options: ["The CV proves, the cover letter connects to this employer, the About introduces you in your own voice", "They should be identical", "Only the CV matters", "The About should copy the cover letter"],
      correct: "a",
      explanation: "Each document has its own role in the application.",
      wrong: { b: "Repetition wastes each one.", c: "All three are read.", d: "Different audiences and purposes." },
    }),
  ]),
};

export default ASSESSMENTS;
