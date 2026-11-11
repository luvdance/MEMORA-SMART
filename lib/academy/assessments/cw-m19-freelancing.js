/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 19 · FREELANCING AND THE BUSINESS
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l71-freelance", [
    q({
      id: "cw-q71-01", atom: "a-cw-writing-careers", d: 1,
      prompt: "What is a retainer-based freelance arrangement?",
      options: ["A fixed monthly fee for ongoing work", "A one-off payment for one article", "A full-time salary", "Payment per word only"],
      correct: "a",
      explanation: "Retainers give freelancers steady, predictable income.",
      wrong: { b: "That is a project fee.", c: "That is employment.", d: "That is per-word pricing." },
    }),
    q({
      id: "cw-q71-02", atom: "a-cw-freelance-fundamentals", d: 2,
      prompt: "Why should a new freelancer keep a buffer of savings?",
      options: ["Freelance income is uneven, especially at first", "Banks require it", "Clients ask to see it", "To pay for marketplace fees only"],
      correct: "a",
      explanation: "A buffer covers quiet months and late payments.",
      wrong: { b: "Not required.", c: "Not the reason.", d: "Too narrow." },
    }),
    q({
      id: "cw-q71-03", atom: "a-cw-services", d: 2,
      prompt: "How should a service be described to clients?",
      options: ["By what the client receives, e.g. \"two 1,000-word SEO articles with meta titles\"", "By how hard you work", "By your degree", "By the software you use"],
      correct: "a",
      explanation: "Clients buy outcomes and deliverables.",
      wrong: { b: "Not what they buy.", c: "Not the service.", d: "Secondary." },
    }),
    q({
      id: "cw-q71-04", atom: "a-cw-niches", d: 2,
      prompt: "Why do specialist writers often earn more than generalists?",
      options: ["They know the industry's language and problems, work faster and become the obvious choice", "Specialists work longer hours", "Clients are required to pay specialists more", "Generalists cannot write"],
      correct: "a",
      explanation: "Expertise adds value and trust.",
      wrong: { b: "Not the reason.", c: "No such rule.", d: "Untrue." },
    }),
  ]),

  ...check("cw-l72-briefs", [
    q({
      id: "cw-q72-01", atom: "a-cw-client-requirements", d: 2,
      prompt: "When should you give a client a price?",
      options: ["After you understand the scope: deliverables, quantities, deadline and budget", "In your first reply, before asking anything", "After finishing the work", "Never; let them choose"],
      correct: "a",
      explanation: "You cannot price undefined work.",
      wrong: { b: "Too early.", c: "Too late.", d: "Unprofessional." },
    }),
    q({
      id: "cw-q72-02", atom: "a-cw-client-requirements", d: 3,
      prompt: "A client \"wants something nice for the website\". What is the need behind it likely to be?",
      options: ["A business result, such as more customers or sales, that you should confirm", "Nice adjectives", "As many words as possible", "A new logo"],
      correct: "a",
      explanation: "Find the goal behind the request.",
      wrong: { b: "Not a need.", c: "Not a need.", d: "Not writing." },
    }),
    q({
      id: "cw-q72-03", atom: "a-cw-interpreting-briefs", d: 2,
      prompt: "Why send the final brief back to the client for confirmation?",
      options: ["It becomes the agreed basis of the work and prevents \"that's not what I asked for\"", "To make the project longer", "Clients like reading", "It is required by law"],
      correct: "a",
      explanation: "A confirmed brief protects both sides.",
      wrong: { b: "Not the aim.", c: "Not the reason.", d: "Not required by law." },
    }),
    q({
      id: "cw-q72-04", atom: "a-cw-interpreting-briefs", d: 2,
      prompt: "Which question is easiest for a busy client to answer?",
      options: ["\"Which pages do you need: Home, About, Shop, Product pages, FAQ?\"", "\"What do you want?\"", "\"Tell me everything about your business.\"", "\"What is your content philosophy?\""],
      correct: "a",
      explanation: "Offer options so answering takes seconds.",
      wrong: { b: "Too open.", c: "Too broad.", d: "Too abstract." },
    }),
  ]),

  ...check("cw-l73-pricing", [
    q({
      id: "cw-q73-01", atom: "a-cw-packages", d: 2,
      prompt: "What is the main advantage of fixed service packages?",
      options: ["Easy buying, predictable income and stated limits that prevent scope creep", "Clients pay more hours", "They remove the need for contracts", "They make every client identical"],
      correct: "a",
      explanation: "Clear bundles simplify decisions and protect scope.",
      wrong: { b: "Not the point.", c: "Contracts still matter.", d: "Not the aim." },
    }),
    q({
      id: "cw-q73-02", atom: "a-cw-pricing", d: 3,
      prompt: "Your target income is ₦400,000 a month, costs are ₦80,000, and you can bill 60 hours. What is your target hourly rate?",
      options: ["₦8,000", "₦6,667", "₦4,800", "₦12,000"],
      correct: "a",
      explanation: "(₦400,000 + ₦80,000) ÷ 60 = ₦8,000.",
      wrong: { b: "Ignores costs.", c: "Divides by 100 hours.", d: "Arithmetic error." },
    }),
    q({
      id: "cw-q73-03", atom: "a-cw-pricing", d: 2,
      prompt: "Why can hourly pricing work against an experienced writer?",
      options: ["Getting faster earns them less for the same result", "Hours cannot be counted", "Clients forbid it", "It is illegal"],
      correct: "a",
      explanation: "Project pricing rewards skill and value.",
      wrong: { b: "They can.", c: "Many accept it.", d: "Not illegal." },
    }),
    q({
      id: "cw-q73-04", atom: "a-cw-client-proposals", d: 2,
      prompt: "How should a freelance proposal open?",
      options: ["With the client's goal and challenge in their words", "With your life story", "With the price", "With your rates for every service"],
      correct: "a",
      explanation: "Show you listened before you sell.",
      wrong: { b: "About you, not them.", c: "Too early.", d: "Irrelevant detail." },
    }),
  ]),

  ...check("cw-l74-clients", [
    q({
      id: "cw-q74-01", atom: "a-cw-client-acquisition", d: 2,
      prompt: "Which client source usually brings the best clients?",
      options: ["Referrals from satisfied clients and contacts", "Random cold messages to everyone", "Buying followers", "Spam emails"],
      correct: "a",
      explanation: "Referred clients arrive already trusting you.",
      wrong: { b: "Low response.", c: "Useless.", d: "Damaging." },
    }),
    q({
      id: "cw-q74-02", atom: "a-cw-online-opportunities", d: 2,
      prompt: "Which is a warning sign of a writing job scam?",
      options: ["Being asked to pay a fee to apply or for a starter kit", "A detailed brief", "A named company with a website", "A written contract"],
      correct: "a",
      explanation: "Legitimate clients do not charge writers to work.",
      wrong: { b: "A good sign.", c: "A good sign.", d: "A good sign." },
    }),
    q({
      id: "cw-q74-03", atom: "a-cw-marketplaces", d: 2,
      prompt: "On Fiverr, freelancers mainly…",
      options: ["List fixed-price gigs that clients buy", "Apply only to full-time jobs", "Bid on government tenders", "Write without payment"],
      correct: "a",
      explanation: "On Upwork, freelancers usually send proposals to job posts.",
      wrong: { b: "Not the model.", c: "Not the model.", d: "Untrue." },
    }),
    q({
      id: "cw-q74-04", atom: "a-cw-client-relationships", d: 2,
      prompt: "A deadline will slip by two days. When should you tell the client?",
      options: ["As soon as you know, with a new date", "On the deadline day", "After the deadline", "Never"],
      correct: "a",
      explanation: "Early warnings preserve trust.",
      wrong: { b: "Too late.", c: "Too late.", d: "Unprofessional." },
    }),
    q({
      id: "cw-q74-05", atom: "a-cw-client-relationships", d: 2,
      prompt: "What should you ask for when a project goes well?",
      options: ["Feedback, a testimonial and a referral", "A discount for yourself", "Nothing", "Their bank password"],
      correct: "a",
      explanation: "Testimonials and referrals bring future work.",
      wrong: { b: "Not relevant.", c: "Missed opportunity.", d: "Never." },
    }),
  ]),

  ...check("cw-l75-business", [
    q({
      id: "cw-q75-01", atom: "a-cw-deadlines-revisions", d: 2,
      prompt: "A client asks for a new topic after approving the brief. What is it?",
      options: ["New work, to be quoted separately", "A revision included in the price", "A mistake by the writer", "Nothing to discuss"],
      correct: "a",
      explanation: "Revisions are changes within the agreed brief; new topics are new work.",
      wrong: { b: "Outside the brief.", c: "Not a mistake.", d: "Discuss and quote." },
    }),
    q({
      id: "cw-q75-02", atom: "a-cw-contracts", d: 2,
      prompt: "When does copyright usually pass to the client in freelance writing?",
      options: ["On full payment, as stated in the agreement", "When the writer starts", "Never", "When the first draft is sent"],
      correct: "a",
      explanation: "State ownership terms in your agreement.",
      wrong: { b: "Too early.", c: "Clients usually need ownership.", d: "Too early." },
    }),
    q({
      id: "cw-q75-03", atom: "a-cw-contracts", d: 3,
      prompt: "Why ask for a deposit before starting a one-off project?",
      options: ["It confirms commitment and protects you if the client does not pay", "It doubles your income", "Clients prefer paying twice", "It replaces the contract"],
      correct: "a",
      explanation: "A 50% deposit is a common, fair safeguard.",
      wrong: { b: "Untrue.", c: "Not the reason.", d: "Use both." },
    }),
    q({
      id: "cw-q75-04", atom: "a-cw-sustainable-business", d: 2,
      prompt: "Why avoid one client being most of your income?",
      options: ["Losing that client would cut your income suddenly", "Clients dislike loyalty", "It is illegal", "Taxes are higher"],
      correct: "a",
      explanation: "A mix of clients spreads the risk.",
      wrong: { b: "Untrue.", c: "Not illegal.", d: "Not the reason." },
    }),
  ]),
};

export default ASSESSMENTS;
