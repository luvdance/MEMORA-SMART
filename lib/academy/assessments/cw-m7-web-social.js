/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 7 · WEBSITE AND SOCIAL MEDIA
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l24-website", [
    q({
      id: "cw-q24-01", atom: "a-cw-homepage", d: 2,
      prompt: "Which three questions must a homepage answer within seconds?",
      options: ["What is this, is it for me, what do I do next?", "Who founded it, when, and where?", "How big is the company, how old, how rich?", "What colour, what font, what logo?"],
      correct: "a",
      explanation: "Visitors decide almost instantly whether to stay.",
      wrong: { b: "Belongs on the About page.", c: "Not what visitors need first.", d: "Design, not content." },
    }),
    q({
      id: "cw-q24-02", atom: "a-cw-about", d: 2,
      prompt: "What makes an About page persuasive?",
      options: ["A story of why the business exists, who it serves, and proof such as numbers and real people", "A detailed list of every year since founding", "Phrases such as \"world-class one-stop shop\"", "As little text as possible"],
      correct: "a",
      explanation: "People want to know who they are trusting.",
      wrong: { b: "History alone is dull.", c: "Empty phrases persuade nobody.", d: "Too little gives no reason to trust." },
    }),
    q({
      id: "cw-q24-03", atom: "a-cw-service-pages", d: 2,
      prompt: "Why give each service its own page?",
      options: ["It can answer that service's specific questions and rank for its own searches", "Search engines require one page per service", "It makes the menu longer", "Clients pay per page"],
      correct: "a",
      explanation: "Specific pages serve specific intents.",
      wrong: { b: "Not a requirement.", c: "Not the reason.", d: "Not the reason." },
    }),
    q({
      id: "cw-q24-04", atom: "a-cw-landing-content", d: 3,
      prompt: "What is \"message match\"?",
      options: ["The landing page repeats the promise of the advert that brought the visitor", "Using the same font as the logo", "Replying to every message", "Matching the price to a competitor"],
      correct: "a",
      explanation: "Visitors must immediately see what they clicked for.",
      wrong: { b: "Design detail.", c: "Customer service.", d: "Pricing." },
    }),
  ]),

  ...check("cw-l25-microcopy", [
    q({
      id: "cw-q25-01", atom: "a-cw-faqs", d: 2,
      prompt: "How should an FAQ answer begin?",
      options: ["With the direct answer, such as \"Yes.\" or the number", "With the company's history", "With \"Thank you for your question\"", "With a link only"],
      correct: "a",
      explanation: "Readers scan for the answer; give it first.",
      wrong: { b: "Irrelevant.", c: "Wastes words.", d: "Answer first, then link if needed." },
    }),
    q({
      id: "cw-q25-02", atom: "a-cw-microcopy", d: 2,
      prompt: "Which error message is best?",
      options: ["\"Enter your email in the form name@example.com.\"", "\"Invalid input.\"", "\"Error 400.\"", "\"You made a mistake.\""],
      correct: "a",
      explanation: "Says how to fix it, with an example, without blame.",
      wrong: { b: "Does not say how to fix it.", c: "A code means nothing to users.", d: "Blames the user and does not help." },
    }),
    q({
      id: "cw-q25-03", atom: "a-cw-ctas", d: 2,
      prompt: "Which button text is strongest?",
      options: ["Start my free trial", "Submit", "Click here", "Learn more"],
      correct: "a",
      explanation: "Verb first, specific value, the user's own decision.",
      wrong: { b: "Says what the system does.", c: "Says nothing.", d: "Vague." },
    }),
    q({
      id: "cw-q25-04", atom: "a-cw-ctas", d: 3,
      prompt: "A page has five equally prominent buttons. What is the likely effect?",
      options: ["Attention is split and fewer people take the main action", "More people act", "Search ranking improves", "Nothing"],
      correct: "a",
      explanation: "One primary CTA per page or screen works best.",
      wrong: { b: "Too much choice reduces action.", c: "Unrelated.", d: "It does have an effect." },
    }),
  ]),

  ...check("cw-l26-social", [
    q({
      id: "cw-q26-01", atom: "a-cw-social-audiences", d: 2,
      prompt: "What should a brand give social media audiences before asking for anything?",
      options: ["Value: something useful, interesting or entertaining", "A discount code in every post", "Its full price list", "Nothing; ask straight away"],
      correct: "a",
      explanation: "Scrollers reward accounts that give first.",
      wrong: { b: "Constant discounts cheapen the brand.", c: "Not engaging.", d: "Hard selling is ignored." },
    }),
    q({
      id: "cw-q26-02", atom: "a-cw-platforms", d: 2,
      prompt: "Why do Instagram CTAs usually say \"link in bio\"?",
      options: ["Links in captions are not clickable", "Bios are more formal", "It is required by law", "Captions cannot contain text"],
      correct: "a",
      explanation: "So the link goes in the profile or in DMs.",
      wrong: { b: "Not the reason.", c: "Not a law.", d: "Captions are text." },
    }),
    q({
      id: "cw-q26-03", atom: "a-cw-captions", d: 2,
      prompt: "Where should a caption's hook go?",
      options: ["In the first line", "In the hashtags", "At the very end", "In a comment"],
      correct: "a",
      explanation: "Often only the first line shows before \"more\".",
      wrong: { b: "Hashtags are for discovery.", c: "Too late.", d: "Few will see it." },
    }),
    q({
      id: "cw-q26-04", atom: "a-cw-edu-promo", d: 2,
      prompt: "What does the rough 80/20 rule on social media suggest?",
      options: ["Most posts give value; a minority promote", "80% of posts should be adverts", "Post 80 times a day", "Use 20 hashtags per post"],
      correct: "a",
      explanation: "Audiences accept promotion from accounts that mostly give.",
      wrong: { b: "The reverse.", c: "Not a frequency rule.", d: "Not a hashtag rule." },
    }),
    q({
      id: "cw-q26-05", atom: "a-cw-social-stories", d: 3,
      prompt: "Which opening is strongest for a behind-the-scenes story post?",
      options: ["\"At 5am, Mama Bisi is already pounding pepper.\"", "\"We would like to tell you about our company.\"", "\"Our story is very interesting.\"", "\"Please read this post.\""],
      correct: "a",
      explanation: "Start in the middle of the action with a concrete detail.",
      wrong: { b: "Announces instead of telling.", c: "Claims rather than shows.", d: "Gives no reason to read." },
    }),
  ]),

  ...check("cw-l27-calendar", [
    q({
      id: "cw-q27-01", atom: "a-cw-social-calendar", d: 2,
      prompt: "What is the main benefit of batch-writing a week of posts?",
      options: ["Posting never depends on daily inspiration", "Posts become longer", "Platforms reward batches", "It removes the need for hooks"],
      correct: "a",
      explanation: "Planning creates consistency.",
      wrong: { b: "Not the point.", c: "Platforms do not know.", d: "Every post still needs a hook." },
    }),
    q({
      id: "cw-q27-02", atom: "a-cw-hooks", d: 2,
      prompt: "Which is a hook?",
      options: ["\"Stop mopping first.\"", "\"Hello everyone, hope you are well.\"", "\"Today we will share something.\"", "\"Post number 45.\""],
      correct: "a",
      explanation: "A bold, specific statement that creates curiosity.",
      wrong: { b: "A warm-up.", c: "Announces.", d: "Meaningless." },
    }),
    q({
      id: "cw-q27-03", atom: "a-cw-hashtags", d: 2,
      prompt: "Why write #CleaningTips rather than #cleaningtips?",
      options: ["Screen readers read capitalised words correctly", "Lowercase hashtags do not work", "It ranks higher", "Platforms require capitals"],
      correct: "a",
      explanation: "Capitalising each word makes hashtags accessible and readable.",
      wrong: { b: "They work.", c: "No ranking effect.", d: "Not required." },
    }),
    q({
      id: "cw-q27-04", atom: "a-cw-engagement", d: 3,
      prompt: "A customer complains publicly about a late delivery. What is the best first reply?",
      options: ["Apologise by name, take responsibility and move details to a private message", "Explain that traffic was bad", "Delete the comment", "Ignore it"],
      correct: "a",
      explanation: "Acknowledge, apologise, act, follow up.",
      wrong: { b: "Excuses anger customers.", c: "Deleting fair criticism destroys trust.", d: "Silence looks like indifference." },
    }),
    q({
      id: "cw-q27-05", atom: "a-cw-repurposing", d: 2,
      prompt: "What is repurposing?",
      options: ["Rewriting one strong piece into versions suited to other formats and platforms", "Copying the same caption everywhere", "Deleting old posts", "Buying content"],
      correct: "a",
      explanation: "Each version is rewritten for its platform.",
      wrong: { b: "That is copying, not repurposing.", c: "Unrelated.", d: "Unrelated." },
    }),
  ]),
};

export default ASSESSMENTS;
