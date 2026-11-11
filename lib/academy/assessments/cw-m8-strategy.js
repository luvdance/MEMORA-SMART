/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 8 · CONTENT STRATEGY AND STORYTELLING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l28-strategy", [
    q({
      id: "cw-q28-01", atom: "a-cw-strategy-defined", d: 2,
      prompt: "What does a content strategy answer before \"what to post\"?",
      options: ["Why: which business goal the content serves and for whom", "Which font to use", "How many hashtags", "Which camera to buy"],
      correct: "a",
      explanation: "Strategy starts with the objective and audience.",
      wrong: { b: "Design detail.", c: "Tactical detail.", d: "Equipment." },
    }),
    q({
      id: "cw-q28-02", atom: "a-cw-content-marketing", d: 2,
      prompt: "A comparison guide (\"tutoring centre vs home tutor\") mainly serves which stage?",
      options: ["Consideration", "Awareness", "Retention", "None"],
      correct: "a",
      explanation: "People comparing solutions are in consideration.",
      wrong: { b: "Awareness content introduces the problem.", c: "Retention serves existing customers.", d: "It clearly serves a stage." },
    }),
    q({
      id: "cw-q28-03", atom: "a-cw-business-objectives", d: 2,
      prompt: "Which objective is SMART?",
      options: ["Increase online orders from 200 to 350 a month by 31 December", "Get more customers", "Be the best brand in Nigeria", "Post more often"],
      correct: "a",
      explanation: "Specific, measurable, achievable, relevant and time-bound.",
      wrong: { b: "Not measurable or time-bound.", c: "Not measurable.", d: "An activity, not an objective." },
    }),
    q({
      id: "cw-q28-04", atom: "a-cw-target-audiences", d: 3,
      prompt: "For a secondary-school tutoring service, who is usually the primary target audience?",
      options: ["The parents, who book and pay", "Only the students", "Teachers at the school", "Other tutoring companies"],
      correct: "a",
      explanation: "Target the people who make the buying decision.",
      wrong: { b: "Students use the service but usually do not pay.", c: "Not the buyers.", d: "Competitors." },
    }),
    q({
      id: "cw-q28-05", atom: "a-cw-strategy-personas", d: 2,
      prompt: "How many personas should a small business strategy usually have?",
      options: ["One to three, based on research", "Twenty or more", "None", "One per follower"],
      correct: "a",
      explanation: "A few evidence-based personas keep a team focused.",
      wrong: { b: "Too many to use.", c: "Personas guide decisions.", d: "Impossible and useless." },
    }),
  ]),

  ...check("cw-l29-pillars-story", [
    q({
      id: "cw-q29-01", atom: "a-cw-pillars", d: 2,
      prompt: "What are content pillars?",
      options: ["The three to five core themes a brand consistently creates content about", "The posts with the most likes", "The brand's logo colours", "The writers on the team"],
      correct: "a",
      explanation: "Pillars keep content focused where audience interest meets brand expertise.",
      wrong: { b: "Performance, not themes.", c: "Visual identity.", d: "People." },
    }),
    q({
      id: "cw-q29-02", atom: "a-cw-content-planning", d: 2,
      prompt: "Why plan backwards from the publish date?",
      options: ["Research, drafting, editing and approval all need time before publishing", "Calendars read right to left", "To publish earlier than planned", "It is a legal requirement"],
      correct: "a",
      explanation: "A long guide published on Friday must start well before Thursday.",
      wrong: { b: "Not the reason.", c: "Not the aim.", d: "Not a law." },
    }),
    q({
      id: "cw-q29-03", atom: "a-cw-brand-story", d: 3,
      prompt: "In a strong brand story, who is the hero?",
      options: ["The customer, with the brand as their guide", "The company's profits", "The competitor", "The logo"],
      correct: "a",
      explanation: "Customers care about their own problem being solved.",
      wrong: { b: "Readers do not care about profits.", c: "Not the hero.", d: "Not a character." },
    }),
    q({
      id: "cw-q29-04", atom: "a-cw-narrative", d: 2,
      prompt: "Which line comes after \"Until one day…\" in the story spine?",
      options: ["Because of that…", "Once upon a time…", "And ever since then…", "Every day…"],
      correct: "a",
      explanation: "The turning point leads to consequences.",
      wrong: { b: "That is the first line.", c: "That is the last line.", d: "That comes before the turning point." },
    }),
    q({
      id: "cw-q29-05", atom: "a-cw-business-stories", d: 2,
      prompt: "What must you get before publishing a customer's story?",
      options: ["Their written permission", "Their bank details", "A professional photographer", "A trademark"],
      correct: "a",
      explanation: "Customers' stories are theirs; ask, and protect their privacy if they want.",
      wrong: { b: "Irrelevant and inappropriate.", c: "Optional.", d: "Unrelated." },
    }),
  ]),

  ...check("cw-l30-measure", [
    q({
      id: "cw-q30-01", atom: "a-cw-educational-content", d: 2,
      prompt: "Why do businesses give away knowledge in educational content?",
      options: ["It builds trust and attracts people when they need help, and many still pay for expert help", "It always reduces sales", "Search engines pay for it", "To fill space"],
      correct: "a",
      explanation: "People who learn from you trust you.",
      wrong: { b: "Usually the opposite.", c: "They do not.", d: "Filler fails." },
    }),
    q({
      id: "cw-q30-02", atom: "a-cw-distribution", d: 2,
      prompt: "A brand's email list is which kind of media?",
      options: ["Owned", "Earned", "Paid", "Borrowed"],
      correct: "a",
      explanation: "The brand controls it, and no platform can take it away.",
      wrong: { b: "Earned is coverage others give.", c: "Paid is advertising.", d: "Not a standard category." },
    }),
    q({
      id: "cw-q30-03", atom: "a-cw-measuring", d: 3,
      prompt: "A post had 15,000 impressions and 600 link clicks. What is its CTR?",
      options: ["4%", "0.4%", "40%", "25%"],
      correct: "a",
      explanation: "600 ÷ 15,000 × 100 = 4%.",
      wrong: { b: "Off by a factor of ten.", c: "Off by a factor of ten.", d: "Not the formula." },
    }),
    q({
      id: "cw-q30-04", atom: "a-cw-measuring", d: 2,
      prompt: "Which is usually a vanity metric?",
      options: ["Number of likes", "Bookings from content", "Conversion rate", "Enquiries"],
      correct: "a",
      explanation: "Likes feel good but may not move the business.",
      wrong: { b: "Close to the objective.", c: "Measures action.", d: "Close to the objective." },
    }),
    q({
      id: "cw-q30-05", atom: "a-cw-analytics", d: 3,
      prompt: "What does a UTM tag on a link do?",
      options: ["Shows analytics which post or campaign brought each visitor", "Makes the link shorter", "Hides the link from search engines", "Adds the brand's logo"],
      correct: "a",
      explanation: "It labels traffic sources for reporting.",
      wrong: { b: "That is a link shortener.", c: "It does not hide links.", d: "Unrelated." },
    }),
  ]),

  ...check("cw-l31-strategy-doc", [
    q({
      id: "cw-q31-01", atom: "a-cw-strategy-document", d: 2,
      prompt: "Which pillar should usually have the smallest share?",
      options: ["Promotion", "Education", "Stories", "Trust"],
      correct: "a",
      explanation: "Audiences accept promotion from brands that mostly give value.",
      wrong: { b: "Usually the largest.", c: "Often a solid share.", d: "Often a solid share." },
    }),
    q({
      id: "cw-q31-02", atom: "a-cw-strategy-document", d: 2,
      prompt: "How should a strategy justify its choices?",
      options: ["With evidence from past results and research", "With the writer's preferences", "With competitors' follower counts only", "It does not need to"],
      correct: "a",
      explanation: "Evidence makes a strategy convincing and testable.",
      wrong: { b: "Preferences are not evidence.", c: "Too narrow.", d: "Clients need reasons." },
    }),
    q({
      id: "cw-q31-03", atom: "a-cw-m8-practical", d: 3,
      prompt: "Four pillars are given 40%, 25%, 20% and 25%. What is wrong?",
      options: ["They add up to 110%", "Nothing", "There must be exactly three", "Percentages are not allowed"],
      correct: "a",
      explanation: "Shares of output must total 100%.",
      wrong: { b: "They do not add up.", c: "Three to five is fine.", d: "Shares are useful." },
    }),
    q({
      id: "cw-q31-04", atom: "a-cw-m8-practical", d: 3,
      prompt: "Which KPI is closest to an objective of more bookings?",
      options: ["Bookings from content", "Followers gained", "Post likes", "Hashtag reach"],
      correct: "a",
      explanation: "Prioritise metrics closest to the objective.",
      wrong: { b: "Indirect.", c: "Vanity.", d: "Indirect." },
    }),
  ]),
};

export default ASSESSMENTS;
