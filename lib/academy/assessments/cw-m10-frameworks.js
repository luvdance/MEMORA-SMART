/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 10 · COPYWRITING FRAMEWORKS
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l35-aida-pas-bab", [
    q({
      id: "cw-q35-01", atom: "a-cw-aida", d: 2,
      prompt: "In AIDA, where do benefits, a picture of the result and proof mainly belong?",
      options: ["Desire", "Attention", "Interest", "Action"],
      correct: "a",
      explanation: "Desire makes the reader want it; it is the stage writers most often rush.",
      wrong: { b: "Attention stops the reader.", c: "Interest keeps them reading.", d: "Action tells them what to do." },
    }),
    q({
      id: "cw-q35-02", atom: "a-cw-pas", d: 2,
      prompt: "What does the Agitation stage of PAS do?",
      options: ["Makes the reader feel the real cost of the problem", "Introduces the product", "Gives the price", "Thanks the reader"],
      correct: "a",
      explanation: "It shows what the problem costs and what happens if it continues, honestly.",
      wrong: { b: "That is the Solution.", c: "Part of the Solution or offer.", d: "Not a stage." },
    }),
    q({
      id: "cw-q35-03", atom: "a-cw-pas", d: 3,
      prompt: "Which agitation crosses the line into manipulation?",
      options: ["\"Without this supplement, your children will fall seriously ill.\"", "\"Each month you wait costs another ₦30,000 in unused membership.\"", "\"Late payments mean late fees.\"", "\"Every week of guessing costs you time.\""],
      correct: "a",
      explanation: "An invented, frightening health claim exploits fear beyond the facts.",
      wrong: { b: "A real, proportionate cost.", c: "A real consequence.", d: "A real, mild consequence." },
    }),
    q({
      id: "cw-q35-04", atom: "a-cw-bab", d: 2,
      prompt: "In BAB, what is the Bridge?",
      options: ["How the product takes the reader from Before to After", "The headline", "The guarantee only", "The reader's current situation"],
      correct: "a",
      explanation: "The Bridge connects the two pictures and asks for action.",
      wrong: { b: "Not specifically.", c: "It may include one but is more.", d: "That is Before." },
    }),
  ]),

  ...check("cw-l36-fab-4ps", [
    q({
      id: "cw-q36-01", atom: "a-cw-fab", d: 2,
      prompt: "\"No equipment needed\" → \"works in any small room\" → \"start tonight without spending on gear\". What is \"works in any small room\"?",
      options: ["The advantage", "The feature", "The benefit", "The proof"],
      correct: "a",
      explanation: "Feature → advantage (what it does) → benefit (what you gain).",
      wrong: { b: "The feature is \"no equipment needed\".", c: "The benefit is starting tonight without spending.", d: "No evidence is given." },
    }),
    q({
      id: "cw-q36-02", atom: "a-cw-4ps", d: 2,
      prompt: "What are the 4Ps?",
      options: ["Promise, Picture, Proof, Push", "Product, Price, Place, Promotion", "Problem, Pain, Product, Payment", "Plan, Publish, Promote, Profit"],
      correct: "a",
      explanation: "The copywriting 4Ps (not the marketing mix).",
      wrong: { b: "That is the marketing mix.", c: "Not the framework.", d: "Not the framework." },
    }),
    q({
      id: "cw-q36-03", atom: "a-cw-story-selling", d: 2,
      prompt: "Why does story-based selling lower resistance?",
      options: ["Readers argue with claims but rarely with someone's experience", "Stories are always shorter", "Stories need no proof", "Search engines prefer stories"],
      correct: "a",
      explanation: "Seeing someone like them succeed shows value instead of claiming it.",
      wrong: { b: "Not always.", c: "Stories should be true and permitted.", d: "Not the reason." },
    }),
    q({
      id: "cw-q36-04", atom: "a-cw-problem-solution", d: 3,
      prompt: "When is problem-solution better than PAS?",
      options: ["For serious or B2B topics where agitation would feel manipulative", "Never", "Only in songs", "When there is no product"],
      correct: "a",
      explanation: "It is calmer and more factual.",
      wrong: { b: "It has clear uses.", c: "Not relevant.", d: "There must be a solution." },
    }),
  ]),

  ...check("cw-l37-headlines", [
    q({
      id: "cw-q37-01", atom: "a-cw-power-headlines", d: 2,
      prompt: "Which headline uses the \"result without pain\" formula?",
      options: ["Get Fit Without Traffic or a ₦30,000 Membership", "How to Get Fit at Home", "Too Busy for the Gym?", "3 Reasons Workers Quit"],
      correct: "a",
      explanation: "A desired result minus the thing the reader dreads.",
      wrong: { b: "How-to formula.", c: "Question formula.", d: "Number formula." },
    }),
    q({
      id: "cw-q37-02", atom: "a-cw-power-headlines", d: 2,
      prompt: "Why do copywriters write many headlines for one piece?",
      options: ["To choose and test the strongest; the headline carries most of the work", "Clients pay per headline", "To use all of them on one page", "It is a legal requirement"],
      correct: "a",
      explanation: "Far more people read the headline than the body.",
      wrong: { b: "Not the reason.", c: "One headline per piece.", d: "No such law." },
    }),
    q({
      id: "cw-q37-03", atom: "a-cw-effective-hooks", d: 2,
      prompt: "How long should a spoken video-ad hook usually be?",
      options: ["About 12 words or fewer", "50 words", "A full paragraph", "Exactly one word"],
      correct: "a",
      explanation: "The first three seconds decide whether anyone watches.",
      wrong: { b: "Too long.", c: "Too long.", d: "Usually too little." },
    }),
    q({
      id: "cw-q37-04", atom: "a-cw-persuasive-language", d: 3,
      prompt: "\"No traffic, no machines, no one watching\" uses which technique?",
      options: ["The rule of three", "Passive voice", "Jargon", "Scarcity"],
      correct: "a",
      explanation: "Three parallel items create rhythm and memorability.",
      wrong: { b: "No passive here.", c: "Plain words.", d: "Nothing is limited." },
    }),
  ]),

  ...check("cw-l38-offers", [
    q({
      id: "cw-q38-01", atom: "a-cw-strong-ctas", d: 2,
      prompt: "Which CTA suits a cold audience that has never heard of the product?",
      options: ["Watch the 1-minute demo", "Buy the annual plan now", "Upgrade to premium", "Renew your subscription"],
      correct: "a",
      explanation: "Cold readers are ready for a small first step.",
      wrong: { b: "Too big a step.", c: "For existing users.", d: "For existing customers." },
    }),
    q({
      id: "cw-q38-02", atom: "a-cw-objections", d: 2,
      prompt: "How should copy treat the objection \"It's too expensive\"?",
      options: ["Acknowledge it and answer with value comparisons and payment options", "Ignore it", "Say \"No excuses!\"", "Lower the price in the copy without permission"],
      correct: "a",
      explanation: "Reasonable doubts deserve honest answers.",
      wrong: { b: "Unanswered objections stop sales.", c: "Dismissive.", d: "Not the writer's decision." },
    }),
    q({
      id: "cw-q38-03", atom: "a-cw-offers", d: 2,
      prompt: "What is risk reversal?",
      options: ["Removing the buyer's risk, e.g. a free trial or money-back guarantee", "Raising the price", "Hiding the terms", "Adding a countdown timer"],
      correct: "a",
      explanation: "It makes saying yes safe.",
      wrong: { b: "Adds risk.", c: "Deceptive.", d: "Urgency, and often fake." },
    }),
    q({
      id: "cw-q38-04", atom: "a-cw-offers", d: 3,
      prompt: "Which offer element is deceptive?",
      options: ["\"Was ₦90,000, now ₦45,000\" when it never sold at ₦90,000", "A real 30-day guarantee", "A yearly price that saves three months", "Free delivery until a real date"],
      correct: "a",
      explanation: "Inflated \"was\" prices invent value.",
      wrong: { b: "Honest.", c: "Honest.", d: "Honest." },
    }),
    q({
      id: "cw-q38-05", atom: "a-cw-m10-practical", d: 3,
      prompt: "Why write the same advert in three frameworks?",
      options: ["To test which structure persuades this audience best", "To use all three in one advert", "Because frameworks must always be combined", "To make the advert longer"],
      correct: "a",
      explanation: "Versions let a client test and keep the winner.",
      wrong: { b: "Each is a separate advert.", c: "Not a rule.", d: "Length is not the goal." },
    }),
  ]),
};

export default ASSESSMENTS;
