/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 9 · INTRODUCTION TO COPYWRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l32-copy", [
    q({
      id: "cw-q32-01", atom: "a-cw-copy-defined", d: 1,
      prompt: "How is copy usually measured?",
      options: ["By conversions: how many readers take the action", "By word count", "By the number of adjectives", "By how formal it sounds"],
      correct: "a",
      explanation: "Copy exists to cause an action, so action is the measure.",
      wrong: { b: "Length is not success.", c: "Adjectives are not results.", d: "Formality is not a measure." },
    }),
    q({
      id: "cw-q32-02", atom: "a-cw-copy-vs-content", d: 2,
      prompt: "A blog post ends with \"Book your free consultation\". What is that final line?",
      options: ["Copy: a call to action inside content", "Content: it teaches", "Professional writing", "An editorial"],
      correct: "a",
      explanation: "Content and copy often work together in one piece.",
      wrong: { b: "That line asks for action.", c: "Not internal work writing.", d: "Not an opinion piece." },
    }),
    q({
      id: "cw-q32-03", atom: "a-cw-persuasion", d: 2,
      prompt: "A free budgeting template that leads people to try a paid app uses which principle?",
      options: ["Reciprocity", "Scarcity", "Authority", "Unity"],
      correct: "a",
      explanation: "Giving genuine value first makes people open to returning the favour.",
      wrong: { b: "Nothing is limited.", c: "No expert credential.", d: "No shared identity." },
    }),
    q({
      id: "cw-q32-04", atom: "a-cw-pain-points", d: 2,
      prompt: "Where do the best descriptions of pain points come from?",
      options: ["Customers' own words in reviews, comments and interviews", "The writer's imagination", "The company's mission statement", "A thesaurus"],
      correct: "a",
      explanation: "Customers' words make copy feel like it understands them.",
      wrong: { b: "Guesses miss the real pain.", c: "That is the company's view.", d: "Not a source of customer insight." },
    }),
    q({
      id: "cw-q32-05", atom: "a-cw-pain-points", d: 3,
      prompt: "\"I feel embarrassed when guests visit and my house is a mess\" is mainly which kind of pain point?",
      options: ["Emotional", "Financial", "Process", "Productivity"],
      correct: "a",
      explanation: "Embarrassment is an emotional pain.",
      wrong: { b: "No money is mentioned.", c: "Not about a complicated process.", d: "Not about wasted time." },
    }),
  ]),

  ...check("cw-l33-benefits", [
    q({
      id: "cw-q33-01", atom: "a-cw-features-benefits", d: 2,
      prompt: "Which is a benefit?",
      options: ["You get dinner on the table in 30 minutes", "Ingredients are pre-cut", "Delivered in a cool box", "Recipe card included"],
      correct: "a",
      explanation: "A benefit is what the feature does for the customer.",
      wrong: { b: "A feature.", c: "A feature.", d: "A feature." },
    }),
    q({
      id: "cw-q33-02", atom: "a-cw-features-benefits", d: 2,
      prompt: "What is the \"so what?\" test?",
      options: ["Asking \"so what?\" about a feature until you reach what the customer gains", "Checking spelling", "Testing a website's speed", "Asking customers for money"],
      correct: "a",
      explanation: "It turns features into felt benefits.",
      wrong: { b: "Not related.", c: "Not related.", d: "Not related." },
    }),
    q({
      id: "cw-q33-03", atom: "a-cw-buying-behaviour", d: 3,
      prompt: "Why does a ₦45,000 water filter need more reassurance in its copy than a ₦200 drink?",
      options: ["It is a high-involvement purchase with more perceived risk", "Expensive products need longer headlines by law", "Drinks never need copy", "People only read expensive copy"],
      correct: "a",
      explanation: "Higher risk means more research and a greater need for proof and guarantees.",
      wrong: { b: "No such law.", c: "They do.", d: "Untrue." },
    }),
    q({
      id: "cw-q33-04", atom: "a-cw-usp", d: 2,
      prompt: "Which is a strong USP?",
      options: ["\"Delivered within 24 hours, or your delivery is free.\"", "\"Quality you can trust.\"", "\"The best prices.\"", "\"Established company.\""],
      correct: "a",
      explanation: "Specific, important, different and provable.",
      wrong: { b: "Generic.", c: "Unprovable.", d: "Not a reason to choose." },
    }),
    q({
      id: "cw-q33-05", atom: "a-cw-journey-copy", d: 3,
      prompt: "A reader visited your product page yesterday but did not buy. Which level of awareness are they at?",
      options: ["Product-aware: give proof, answer objections and make an offer", "Unaware", "Problem-aware", "They cannot be persuaded"],
      correct: "a",
      explanation: "They know your product; they need reasons and reassurance to act.",
      wrong: { b: "They already know you.", c: "They know more than the problem.", d: "They are close to buying." },
    }),
  ]),

  ...check("cw-l34-appeals", [
    q({
      id: "cw-q34-01", atom: "a-cw-appeals", d: 2,
      prompt: "\"Under ₦45 a day, compared with ₦2,000 a week on bottled water\" is which kind of appeal?",
      options: ["Rational", "Emotional", "Scarcity", "Authority"],
      correct: "a",
      explanation: "A logical, numerical reason.",
      wrong: { b: "It appeals to reason, not feeling.", c: "Nothing is limited.", d: "No expert is cited." },
    }),
    q({
      id: "cw-q34-02", atom: "a-cw-trust", d: 2,
      prompt: "Which testimonial is most credible?",
      options: [
        "\"We stopped buying bottled water in March.\" Funmi O., Ibadan",
        "\"Great product!!!\" Anonymous",
        "\"Best ever.\" A customer",
        "\"Five stars.\" No name",
      ],
      correct: "a",
      explanation: "Specific result, a name and a location from someone like the reader.",
      wrong: { b: "Vague and anonymous.", c: "Vague.", d: "Says nothing." },
    }),
    q({
      id: "cw-q34-03", atom: "a-cw-urgency", d: 3,
      prompt: "Which is honest urgency?",
      options: [
        "\"Free installation ends on 30 November.\" (and it does)",
        "A countdown timer that resets for every visitor",
        "\"Only 2 left!\" with 400 in stock",
        "\"Last chance ever!\" every week",
      ],
      correct: "a",
      explanation: "A real deadline that is kept.",
      wrong: { b: "Fake urgency.", c: "False scarcity.", d: "A deadline that never ends is false." },
    }),
    q({
      id: "cw-q34-04", atom: "a-cw-frameworks-intro", d: 2,
      prompt: "What does AIDA stand for?",
      options: ["Attention, Interest, Desire, Action", "Ask, Inform, Decide, Act", "Audience, Idea, Draft, Approve", "Advert, Image, Detail, Address"],
      correct: "a",
      explanation: "The classic persuasion sequence (Module 10).",
      wrong: { b: "Not AIDA.", c: "Not AIDA.", d: "Not AIDA." },
    }),
    q({
      id: "cw-q34-05", atom: "a-cw-m9-practical", d: 3,
      prompt: "Which headline best transforms \"AquaPure Water Filter. 4-stage filtration.\"?",
      options: ["Clean, safe drinking water from your own tap", "AquaPure Water Filter", "4-stage filtration technology", "Buy now!!!"],
      correct: "a",
      explanation: "It leads with the customer's outcome.",
      wrong: { b: "Product name only.", c: "A feature.", d: "A command with no reason." },
    }),
  ]),
};

export default ASSESSMENTS;
