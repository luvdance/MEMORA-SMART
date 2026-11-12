/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 9 · SOCIAL MEDIA SUPPORT
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l55-platforms", [
    q({
      id: "va-q55-01", atom: "a-va-platforms", d: 1,
      prompt: "Which platform suits a B2B consulting firm best?",
      options: ["LinkedIn", "TikTok", "Pinterest", "Snapchat"],
      correct: "a",
      explanation: "LinkedIn reaches professionals and businesses.",
      wrong: { b: "Mainly entertainment for younger audiences.", c: "Visual inspiration.", d: "Personal messaging." },
    }),
    q({
      id: "va-q55-02", atom: "a-va-smm", d: 2,
      prompt: "How should a VA get access to a client's Facebook and Instagram?",
      options: ["Through a role in Meta Business Suite", "With the client's personal password", "By creating a copy of the page", "By asking a friend at Meta"],
      correct: "a",
      explanation: "Roles give access the client controls and can remove.",
      wrong: { b: "Insecure.", c: "Wrong.", d: "No." },
    }),
    q({
      id: "va-q55-03", atom: "a-va-smm", d: 2,
      prompt: "What are content pillars?",
      options: ["Three to five recurring themes the brand posts about", "The posts with the most likes", "Paid adverts", "The brand's logo colours"],
      correct: "a",
      explanation: "Pillars such as Educate, Inspire, Promote and Community.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q55-04", atom: "a-va-smm", d: 2,
      prompt: "Which post needs the client's approval before publishing?",
      options: ["An announcement of a price increase", "A scheduled tip post the client already approved in the calendar", "A like on a customer's comment", "A reply with opening hours"],
      correct: "a",
      explanation: "Sensitive changes need explicit approval.",
      wrong: { b: "Already approved.", c: "Routine.", d: "Routine." },
    }),
  ]),

  ...check("va-l56-schedule-graphics", [
    q({
      id: "va-q56-01", atom: "a-va-canva", d: 2,
      prompt: "What size is an Instagram Story or Reel?",
      options: ["1080 × 1920", "1080 × 1080", "1200 × 627", "1280 × 720"],
      correct: "a",
      explanation: "Vertical 9:16.",
      wrong: { b: "Square post.", c: "Link image.", d: "YouTube thumbnail." },
    }),
    q({
      id: "va-q56-02", atom: "a-va-canva", d: 2,
      prompt: "Where should you get images for a client's posts?",
      options: ["The client's own photos or licensed images", "Any image from Google", "A competitor's Instagram", "Screenshots of other brands' ads"],
      correct: "a",
      explanation: "Avoid copyright infringement.",
      wrong: { b: "Usually copyrighted.", c: "Copyrighted and unethical.", d: "Copyrighted." },
    }),
    q({
      id: "va-q56-03", atom: "a-va-scheduling-tools", d: 2,
      prompt: "How should you choose posting times?",
      options: ["From the account's insights on when followers are online", "Always at midnight", "Whenever you finish the post", "Copy another brand's times"],
      correct: "a",
      explanation: "Each audience is different.",
      wrong: { b: "Arbitrary.", c: "Ignores the audience.", d: "Different audience." },
    }),
    q({
      id: "va-q56-04", atom: "a-va-scheduling-tools", d: 2,
      prompt: "What is alt text for?",
      options: ["Describing an image for people using screen readers", "A hidden advert", "A second caption for search engines only", "The image's file name"],
      correct: "a",
      explanation: "Accessibility.",
      wrong: { b: "No.", c: "Accessibility is the purpose.", d: "No." },
    }),
  ]),

  ...check("va-l57-calendars", [
    q({
      id: "va-q57-01", atom: "a-va-calendar-what", d: 2,
      prompt: "Which column belongs in a content calendar?",
      options: ["Status (Idea, Draft, Approved, Scheduled, Published)", "The client's bank balance", "Competitors' passwords", "Your salary"],
      correct: "a",
      explanation: "Status shows where each post is.",
      wrong: { b: "No.", c: "Never.", d: "No." },
    }),
    q({
      id: "va-q57-02", atom: "a-va-content-mix", d: 2,
      prompt: "Why should most posts not be promotional?",
      options: ["A feed that only sells gets ignored; value posts build the audience", "Promotional posts are banned", "Promotions never work", "Platforms delete them"],
      correct: "a",
      explanation: "Balance value and promotion.",
      wrong: { b: "No.", c: "They work in balance.", d: "No." },
    }),
    q({
      id: "va-q57-03", atom: "a-va-content-mix", d: 2,
      prompt: "Which posting rhythm is better?",
      options: ["Three good posts every week, consistently", "Daily for two weeks, then nothing", "Ten posts on one day a month", "Only when there is a sale"],
      correct: "a",
      explanation: "Consistency beats bursts.",
      wrong: { b: "Inconsistent.", c: "Floods the feed.", d: "Too salesy and irregular." },
    }),
    q({
      id: "va-q57-04", atom: "a-va-calendar-what", d: 2,
      prompt: "What does batching mean for social media work?",
      options: ["Writing all captions in one session and designing all graphics in another", "Posting everything at once", "Deleting old posts in groups", "Buying followers in batches"],
      correct: "a",
      explanation: "Similar tasks together save time.",
      wrong: { b: "No.", c: "No.", d: "Never buy followers." },
    }),
  ]),

  ...check("va-l58-community", [
    q({
      id: "va-q58-01", atom: "a-va-responses", d: 2,
      prompt: "A customer complains publicly about a late order. What should you do?",
      options: ["Apologise publicly and move to DM for the order details", "Delete the comment", "Ask for their address publicly", "Ignore it"],
      correct: "a",
      explanation: "Public care, private details.",
      wrong: { b: "Looks like hiding.", c: "Never in public.", d: "Looks uncaring." },
    }),
    q({
      id: "va-q58-02", atom: "a-va-responses", d: 2,
      prompt: "A fake \"support\" account asks followers for card details. What do you do?",
      options: ["Hide or delete it, report it, and warn followers if needed", "Reply politely", "Ignore it", "Like it"],
      correct: "a",
      explanation: "Protect followers from scams.",
      wrong: { b: "Gives it visibility.", c: "Followers may be scammed.", d: "No." },
    }),
    q({
      id: "va-q58-03", atom: "a-va-community", d: 2,
      prompt: "Which should be escalated to the client?",
      options: ["A comment claiming food poisoning", "A question about opening hours", "A compliment", "A spam link"],
      correct: "a",
      explanation: "Safety claims need the client.",
      wrong: { b: "Answer it.", c: "Thank them.", d: "Remove it." },
    }),
    q({
      id: "va-q58-04", atom: "a-va-community", d: 2,
      prompt: "When is deleting a comment appropriate?",
      options: ["For spam, scams or abuse, not genuine criticism", "Whenever it is negative", "Never", "When you disagree"],
      correct: "a",
      explanation: "Criticism deserves an answer.",
      wrong: { b: "Looks like censorship.", c: "Spam should go.", d: "No." },
    }),
  ]),

  ...check("va-l59-analytics", [
    q({
      id: "va-q59-01", atom: "a-va-metrics", d: 2,
      prompt: "What is the difference between reach and impressions?",
      options: ["Reach counts people; impressions count times shown", "They are the same", "Impressions count people", "Reach counts likes"],
      correct: "a",
      explanation: "One person can see a post several times.",
      wrong: { b: "No.", c: "Reversed.", d: "No." },
    }),
    q({
      id: "va-q59-02", atom: "a-va-engagement-sheet", d: 3,
      prompt: "A post reached 4,000 people and got 200 engagements. What is the engagement rate?",
      options: ["5%", "20%", "0.05%", "200%"],
      correct: "a",
      explanation: "200 ÷ 4,000 × 100 = 5%.",
      wrong: { b: "Arithmetic error.", c: "Forgot × 100.", d: "No." },
    }),
    q({
      id: "va-q59-03", atom: "a-va-social-report", d: 2,
      prompt: "What should a monthly social report lead with?",
      options: ["The results tied to the client's goal, honestly", "Only the best numbers", "Likes", "A list of every post"],
      correct: "a",
      explanation: "Goal first, good or bad.",
      wrong: { b: "Hiding drops destroys trust.", c: "A vanity metric.", d: "Too much detail." },
    }),
    q({
      id: "va-q59-04", atom: "a-va-metrics", d: 2,
      prompt: "Why are saves and shares valuable?",
      options: ["They show content people find useful enough to keep or pass on", "They cost money", "They hide the post", "They count as followers"],
      correct: "a",
      explanation: "Strong signals of value.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l60-email-campaigns", [
    q({
      id: "va-q60-01", atom: "a-va-mailchimp", d: 2,
      prompt: "What must every marketing email include?",
      options: ["An unsubscribe link and the business's physical address", "A discount code", "An image", "The recipient's phone number"],
      correct: "a",
      explanation: "Required by email marketing laws.",
      wrong: { b: "Optional.", c: "Optional.", d: "Never." },
    }),
    q({
      id: "va-q60-02", atom: "a-va-mailchimp", d: 2,
      prompt: "What does *|FNAME|* do in Mailchimp?",
      options: ["Inserts each subscriber's first name", "Formats the font", "Adds a footer", "Deletes the subscriber"],
      correct: "a",
      explanation: "A merge tag for personalisation.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q60-03", atom: "a-va-mailchimp", d: 2,
      prompt: "Why keep subject lines under about 50 characters?",
      options: ["Longer ones are cut off on phones", "Mailchimp forbids longer ones", "They load faster", "Spam filters need exactly 50"],
      correct: "a",
      explanation: "Most emails are read on phones.",
      wrong: { b: "Not forbidden.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q60-04", atom: "a-va-campaign-support", d: 2,
      prompt: "What are UTM parameters for?",
      options: ["Tracking which channel brought each website visitor", "Shortening links", "Encrypting emails", "Designing graphics"],
      correct: "a",
      explanation: "Analytics reads them to attribute visits.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q60-05", atom: "a-va-mailchimp", d: 2,
      prompt: "Should you buy an email list to grow a client's audience?",
      options: ["No: only email people who opted in", "Yes, it is faster", "Yes, if it is cheap", "Only for one campaign"],
      correct: "a",
      explanation: "Bought lists break the law and damage deliverability.",
      wrong: { b: "Illegal in many places.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l61-practical", [
    q({
      id: "va-q61-01", atom: "a-va-m9-plan", d: 2,
      prompt: "What should every post in a goal-driven calendar have?",
      options: ["A clear call to action", "At least 30 hashtags", "A discount", "A stock photo"],
      correct: "a",
      explanation: "Tell people what to do next.",
      wrong: { b: "Not needed.", c: "Too salesy.", d: "Own photos are better." },
    }),
    q({
      id: "va-q61-02", atom: "a-va-m9-practical", d: 2,
      prompt: "Followers grew from 2,400 to 2,640. What is the growth?",
      options: ["10%", "24%", "2.4%", "264%"],
      correct: "a",
      explanation: "240 ÷ 2,400 = 10%.",
      wrong: { b: "Arithmetic error.", c: "Arithmetic error.", d: "No." },
    }),
    q({
      id: "va-q61-03", atom: "a-va-m9-plan", d: 2,
      prompt: "What should a graphic brief contain before designing?",
      options: ["Size, main text, visual and call to action", "Only the colour", "The final file", "Nothing"],
      correct: "a",
      explanation: "A brief makes design fast and on target.",
      wrong: { b: "Incomplete.", c: "That is the result.", d: "No." },
    }),
    q({
      id: "va-q61-04", atom: "a-va-m9-practical", d: 2,
      prompt: "Member story videos got the most reach. What is the best recommendation?",
      options: ["Post one member story video each week", "Stop posting videos", "Post only price lists", "Delete the video"],
      correct: "a",
      explanation: "Do more of what works.",
      wrong: { b: "Opposite.", c: "Lowest engagement.", d: "No." },
    }),
  ]),
};

export default ASSESSMENTS;
