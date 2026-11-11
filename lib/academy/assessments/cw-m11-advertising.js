/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 11 · ADVERTISING AND SALES COPY
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l39-ads", [
    q({
      id: "cw-q39-01", atom: "a-cw-advertising-intro", d: 2,
      prompt: "How many main messages should one advertisement carry?",
      options: ["One", "As many as fit", "Three at least", "None; just the logo"],
      correct: "a",
      explanation: "One ad, one message: paid space must be clear.",
      wrong: { b: "Crowded ads say nothing.", c: "Dilutes the message.", d: "A logo alone rarely persuades." },
    }),
    q({
      id: "cw-q39-02", atom: "a-cw-flyers", d: 2,
      prompt: "What is the three-second test for a poster?",
      options: ["After a glance, can you say what is offered and what to do?", "Can you read it in three languages?", "Does it have three colours?", "Is it three pages long?"],
      correct: "a",
      explanation: "Posters are read in passing; clarity wins.",
      wrong: { b: "Not the test.", c: "Design detail.", d: "Posters are one page." },
    }),
    q({
      id: "cw-q39-03", atom: "a-cw-digital-ads", d: 2,
      prompt: "What is A/B testing?",
      options: ["Showing two versions to different people and keeping the one that performs better", "Testing the alphabet", "Writing ads in two languages", "Grading ads A or B"],
      correct: "a",
      explanation: "Digital ads are measurable, so versions can be tested.",
      wrong: { b: "Not related.", c: "Not the meaning.", d: "Not the meaning." },
    }),
    q({
      id: "cw-q39-04", atom: "a-cw-meta-ads", d: 3,
      prompt: "Roughly how much of a Meta ad's primary text shows before \"See more\"?",
      options: ["About 125 characters", "About 30 characters", "About 1,000 characters", "All of it"],
      correct: "a",
      explanation: "The hook must fit in the first 125 or so characters.",
      wrong: { b: "Too short.", c: "Too long.", d: "Longer text is cut." },
    }),
    q({
      id: "cw-q39-05", atom: "a-cw-search-ads", d: 3,
      prompt: "Why must each responsive search ad headline make sense on its own?",
      options: ["Google combines headlines in any order", "Headlines are printed separately", "Search engines read only one word", "It is optional"],
      correct: "a",
      explanation: "Up to three of your headlines appear together in varying combinations.",
      wrong: { b: "Not printed.", c: "Untrue.", d: "It matters." },
    }),
  ]),

  ...check("cw-l40-ecommerce", [
    q({
      id: "cw-q40-01", atom: "a-cw-product-descriptions", d: 2,
      prompt: "Why should you not copy the manufacturer's description?",
      options: ["It is generic, and duplicate text adds little value for search or buyers", "It is always false", "Marketplaces ban numbers", "Manufacturers write too little"],
      correct: "a",
      explanation: "Original, buyer-focused descriptions sell and rank better.",
      wrong: { b: "Not always false.", c: "Untrue.", d: "Not the reason." },
    }),
    q({
      id: "cw-q40-02", atom: "a-cw-ecommerce", d: 2,
      prompt: "What order do marketplace product titles usually follow?",
      options: ["Brand, product name, then key attributes", "Price, then adjectives", "Attributes only", "Slogan, then brand"],
      correct: "a",
      explanation: "Shoppers search and filter by those attributes.",
      wrong: { b: "Not the convention.", c: "Missing brand and name.", d: "Not the convention." },
    }),
    q({
      id: "cw-q40-03", atom: "a-cw-sales-pages", d: 2,
      prompt: "When does a long sales page work?",
      options: ["For considered, higher-priced purchases where each section answers another doubt", "For a ₦200 snack", "Whenever the writer is paid by the word", "Never"],
      correct: "a",
      explanation: "Long copy works when it answers real objections, not when it pads.",
      wrong: { b: "Impulse buys need little copy.", c: "Padding fails.", d: "It works for the right products." },
    }),
    q({
      id: "cw-q40-04", atom: "a-cw-landing-copy", d: 3,
      prompt: "You want to improve a landing page's conversion rate. What is the right way to test?",
      options: ["Change one element at a time and compare results", "Change everything at once", "Add a main menu with many links", "Remove the CTA"],
      correct: "a",
      explanation: "One change at a time tells you what caused the difference.",
      wrong: { b: "You will not know what worked.", c: "Distractions reduce conversion.", d: "No CTA, no conversion." },
    }),
  ]),

  ...check("cw-l41-scripts", [
    q({
      id: "cw-q41-01", atom: "a-cw-promo-offers", d: 2,
      prompt: "On a ₦32,000 product, which saving is clearest?",
      options: ["₦5,000 off", "15.625% off", "A 0.156 discount factor", "Some money off"],
      correct: "a",
      explanation: "For small odd percentages, the naira amount is clearer.",
      wrong: { b: "Hard to grasp.", c: "Meaningless to shoppers.", d: "Vague." },
    }),
    q({
      id: "cw-q41-02", atom: "a-cw-video-scripts", d: 2,
      prompt: "About how many spoken words fit in a 15-second video?",
      options: ["35 to 40", "10", "100", "200"],
      correct: "a",
      explanation: "At about 2.5 words a second.",
      wrong: { b: "Too few.", c: "Far too many.", d: "Far too many." },
    }),
    q({
      id: "cw-q41-03", atom: "a-cw-radio-tv", d: 2,
      prompt: "In a radio script, how should the price ₦27,000 be written?",
      options: ["twenty-seven thousand naira", "₦27k", "27,000 NGN", "N27000"],
      correct: "a",
      explanation: "Write numbers as they will be spoken so the announcer reads them right.",
      wrong: { b: "Ambiguous to read aloud.", c: "Not as spoken.", d: "Not as spoken." },
    }),
    q({
      id: "cw-q41-04", atom: "a-cw-radio-tv", d: 3,
      prompt: "Which body vets advertisements in Nigeria before they are exposed?",
      options: ["ARCON", "NAFDAC", "INEC", "NCC"],
      correct: "a",
      explanation: "The Advertising Regulatory Council of Nigeria.",
      wrong: { b: "Regulates food and drugs (products).", c: "Electoral commission.", d: "Communications regulator." },
    }),
    q({
      id: "cw-q41-05", atom: "a-cw-slogans", d: 2,
      prompt: "Which is the strongest slogan?",
      options: ["Voltra. Power that stays on.", "Quality you can trust.", "The best power products in the world forever.", "We sell batteries."],
      correct: "a",
      explanation: "Short, distinctive, true to the product, brand built in.",
      wrong: { b: "Generic.", c: "Long and unprovable.", d: "A description, not a slogan." },
    }),
  ]),

  ...check("cw-l42-campaign", [
    q({
      id: "cw-q42-01", atom: "a-cw-launch-campaigns", d: 2,
      prompt: "What ties every piece of a launch campaign together?",
      options: ["One campaign idea with consistent offer, dates and voice", "The same text pasted everywhere", "A different offer per channel", "The most expensive channel"],
      correct: "a",
      explanation: "One idea, expressed natively in each channel.",
      wrong: { b: "Each channel needs its own version.", c: "Inconsistent offers confuse.", d: "Not the unifier." },
    }),
    q({
      id: "cw-q42-02", atom: "a-cw-launch-campaigns", d: 2,
      prompt: "What is the main job of the pre-launch phase?",
      options: ["Build anticipation and collect interest, such as a waitlist", "Announce the final price everywhere", "Ask for reviews", "End the offer"],
      correct: "a",
      explanation: "Teasers prepare an audience for launch day.",
      wrong: { b: "That is launch.", c: "That is post-launch.", d: "That is the end." },
    }),
    q({
      id: "cw-q42-03", atom: "a-cw-persuasive-ctas", d: 2,
      prompt: "Across a campaign, what must every CTA share?",
      options: ["The same offer and deadline", "The exact same words", "The same length", "A question mark"],
      correct: "a",
      explanation: "Wording adapts to the channel; the offer stays consistent.",
      wrong: { b: "Channels differ.", c: "Not necessary.", d: "Not necessary." },
    }),
    q({
      id: "cw-q42-04", atom: "a-cw-ad-ethics", d: 3,
      prompt: "Which claim is safest to publish for a power bank?",
      options: ["\"Charges a typical phone about 4 times\" (backed by tests)", "\"The longest-lasting power bank in Nigeria\"", "\"Never runs out\"", "\"100% better than all competitors\""],
      correct: "a",
      explanation: "Specific, qualified and provable.",
      wrong: { b: "Unsupported comparison.", c: "False.", d: "Unprovable." },
    }),
    q({
      id: "cw-q42-05", atom: "a-cw-ad-ethics", d: 2,
      prompt: "Which agency acts against misleading consumer practices in Nigeria?",
      options: ["The FCCPC", "The CBN", "JAMB", "NIPOST"],
      correct: "a",
      explanation: "The Federal Competition and Consumer Protection Commission.",
      wrong: { b: "Central bank.", c: "Exams board.", d: "Postal service." },
    }),
  ]),
};

export default ASSESSMENTS;
