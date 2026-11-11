/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 12 · EMAIL AND DIRECT RESPONSE
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l43-email", [
    q({
      id: "cw-q43-01", atom: "a-cw-email-marketing", d: 2,
      prompt: "Why is email described as an owned channel?",
      options: ["The business controls its list; no platform algorithm decides who sees the message", "Email is free to send forever", "Everyone must read every email", "Email belongs to the government"],
      correct: "a",
      explanation: "The list is the business's own relationship with subscribers.",
      wrong: { b: "Platforms charge at scale.", c: "Untrue.", d: "Untrue." },
    }),
    q({
      id: "cw-q43-02", atom: "a-cw-email-marketing", d: 3,
      prompt: "What must every marketing email include?",
      options: ["A clear sender and an easy way to unsubscribe", "A discount", "At least five images", "A countdown timer"],
      correct: "a",
      explanation: "Permission-based email requires identification and opt-out.",
      wrong: { b: "Not required.", c: "Not required.", d: "Not required, often fake." },
    }),
    q({
      id: "cw-q43-03", atom: "a-cw-email-funnels", d: 2,
      prompt: "An email sent automatically when someone abandons a cart is…",
      options: ["A triggered (automated) email", "A broadcast", "A newsletter", "A press release"],
      correct: "a",
      explanation: "Triggered by a subscriber's action or inaction.",
      wrong: { b: "Broadcasts go to a list at once.", c: "Newsletters are scheduled broadcasts.", d: "Not email marketing." },
    }),
    q({
      id: "cw-q43-04", atom: "a-cw-subject-lines", d: 2,
      prompt: "What should preview text do?",
      options: ["Add new information that works with the subject line", "Repeat the subject line", "Say \"View this email in your browser\"", "Stay empty"],
      correct: "a",
      explanation: "It is the second line a reader sees before opening.",
      wrong: { b: "Wastes the space.", c: "Wastes the space.", d: "The inbox will fill it with random text." },
    }),
    q({
      id: "cw-q43-05", atom: "a-cw-welcome-emails", d: 2,
      prompt: "How many main calls to action should a welcome email have?",
      options: ["One: the most valuable next step", "Five or more", "None", "One per paragraph"],
      correct: "a",
      explanation: "One clear ask gets more action than many competing ones.",
      wrong: { b: "Splits attention.", c: "Wastes the most-opened email.", d: "Too many." },
    }),
  ]),

  ...check("cw-l44-campaign-emails", [
    q({
      id: "cw-q44-01", atom: "a-cw-promo-emails", d: 2,
      prompt: "What is a sensible length for most promotional emails?",
      options: ["Short and scannable, often 75 to 200 words", "At least 2,000 words", "Exactly one word", "As long as possible"],
      correct: "a",
      explanation: "Readers decide quickly whether an offer is for them.",
      wrong: { b: "Too long.", c: "Too short to make an offer.", d: "Length is not persuasion." },
    }),
    q({
      id: "cw-q44-02", atom: "a-cw-newsletters", d: 2,
      prompt: "Which newsletter subject line is strongest?",
      options: ["The 5-minute habit that doubled my savings", "Newsletter #12", "Monthly update", "Kora news"],
      correct: "a",
      explanation: "Write it from the most interesting item, not the issue number.",
      wrong: { b: "Says nothing.", c: "Says nothing.", d: "Says nothing." },
    }),
    q({
      id: "cw-q44-03", atom: "a-cw-abandoned-cart", d: 3,
      prompt: "What should an abandoned cart email mainly do?",
      options: ["Remind them of the item and answer the reasons people hesitate", "Shame them for leaving", "Always offer a large discount", "Invent a stock shortage"],
      correct: "a",
      explanation: "Helpful reminders plus facts about delivery, payment and warranty.",
      wrong: { b: "Damages trust.", c: "Trains customers to abandon carts.", d: "Deceptive." },
    }),
    q({
      id: "cw-q44-04", atom: "a-cw-follow-ups", d: 2,
      prompt: "Why send a post-purchase email that teaches customers to use the product well?",
      options: ["It reduces refunds and increases good reviews", "It is legally required", "It replaces the receipt", "It hides the price"],
      correct: "a",
      explanation: "Customers who succeed with a product stay and recommend it.",
      wrong: { b: "Not required.", c: "Not a replacement.", d: "Unrelated." },
    }),
  ]),

  ...check("cw-l45-retention", [
    q({
      id: "cw-q45-01", atom: "a-cw-retention-emails", d: 2,
      prompt: "What makes a win-back email effective?",
      options: ["Reminding the customer of the value they got and offering something useful", "Writing \"We miss you!\" many times", "A big discount every time", "Threatening to close their account"],
      correct: "a",
      explanation: "Serve the customer rather than beg.",
      wrong: { b: "Begging rarely works.", c: "Erodes margins and value.", d: "Hostile." },
    }),
    q({
      id: "cw-q45-02", atom: "a-cw-personalisation", d: 2,
      prompt: "What does {{first_name|there}} produce for a subscriber with no stored name?",
      options: ["there", "{{first_name}}", "Nothing at all", "An error message"],
      correct: "a",
      explanation: "The fallback after the bar is used when the field is empty.",
      wrong: { b: "The fallback prevents this.", c: "The fallback fills the gap.", d: "No error is shown." },
    }),
    q({
      id: "cw-q45-03", atom: "a-cw-sequences", d: 2,
      prompt: "Why should each email in a sequence stand alone?",
      options: ["Some readers miss earlier emails", "Platforms send them in random order", "So they can all be identical", "To make them longer"],
      correct: "a",
      explanation: "Each must make sense to someone reading only that one.",
      wrong: { b: "Sequences are ordered.", c: "Angles should vary.", d: "Not the aim." },
    }),
    q({
      id: "cw-q45-04", atom: "a-cw-direct-response", d: 2,
      prompt: "Why does a direct-response email include a unique code such as ABUJA25?",
      options: ["To measure exactly how many responses it produced", "To decorate the email", "Because codes are required by law", "To confuse competitors"],
      correct: "a",
      explanation: "Direct response is measurable response.",
      wrong: { b: "Not decoration.", c: "Not a legal requirement.", d: "Not the purpose." },
    }),
  ]),

  ...check("cw-l46-launch-emails", [
    q({
      id: "cw-q46-01", atom: "a-cw-email-metrics", d: 3,
      prompt: "An email was delivered to 10,000 people, opened by 3,000 and clicked by 600. What is the click-to-open rate?",
      options: ["20%", "6%", "30%", "60%"],
      correct: "a",
      explanation: "600 ÷ 3,000 × 100 = 20%.",
      wrong: { b: "That is the CTR (600 ÷ 10,000).", c: "That is the open rate.", d: "Not a valid calculation." },
    }),
    q({
      id: "cw-q46-02", atom: "a-cw-email-metrics", d: 2,
      prompt: "Why is open rate a less reliable metric than it once was?",
      options: ["Some email apps load images automatically, inflating opens", "Nobody opens emails any more", "Platforms stopped reporting it", "Opens are counted twice by law"],
      correct: "a",
      explanation: "Privacy features such as Apple Mail Privacy Protection affect open tracking.",
      wrong: { b: "Untrue.", c: "They still report it.", d: "Untrue." },
    }),
    q({
      id: "cw-q46-03", atom: "a-cw-spam", d: 2,
      prompt: "Which subject line is most likely to be filtered as spam?",
      options: ["!!!100% FREE - ACT NOW!!!", "Your 25% off ends tonight", "Dinner in 30 minutes: here's how", "We're live in Abuja"],
      correct: "a",
      explanation: "Capitals, repeated exclamation marks and spam phrases.",
      wrong: { b: "Clear and honest.", c: "Clear.", d: "Clear." },
    }),
    q({
      id: "cw-q46-04", atom: "a-cw-m12-practical", d: 3,
      prompt: "In a five-email launch, what is the job of the fourth email (proof and objections)?",
      options: ["Remove doubts with reviews and answers to common worries", "Announce the launch for the first time", "Say goodbye", "Repeat the teaser"],
      correct: "a",
      explanation: "Each email has one job; this one removes doubts.",
      wrong: { b: "That is email 2.", c: "Not a job in the sequence.", d: "That is email 1." },
    }),
  ]),
};

export default ASSESSMENTS;
