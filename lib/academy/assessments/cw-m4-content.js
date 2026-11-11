/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 4 · INTRODUCTION TO CONTENT WRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l12-content", [
    q({
      id: "cw-q12-01", atom: "a-cw-content-defined", d: 1,
      prompt: "How does content writing mainly differ from copywriting?",
      options: [
        "Content earns trust over time and asks for little; copy asks for an action now",
        "Content is always longer than 5,000 words",
        "Content never appears on websites",
        "Copy never uses facts",
      ],
      correct: "a",
      explanation: "Timing and the ask separate them: value first versus action now.",
      wrong: { b: "Content can be a short post.", c: "Websites are full of content.", d: "Good copy is full of facts." },
    }),
    q({
      id: "cw-q12-02", atom: "a-cw-content-types", d: 2,
      prompt: "Which content type proves results by telling how a real customer solved a problem?",
      options: ["Case study", "Press release", "White paper", "Listicle"],
      correct: "a",
      explanation: "Case studies tell a customer's before-and-after story with evidence.",
      wrong: { b: "Press releases announce news.", c: "White papers build authority on an issue.", d: "Listicles present a list of items." },
    }),
    q({
      id: "cw-q12-03", atom: "a-cw-formats-platforms", d: 2,
      prompt: "What is a carousel?",
      options: ["A set of slides in one post, common on Instagram and LinkedIn", "A long blog post", "An email sequence", "A podcast episode"],
      correct: "a",
      explanation: "Carousels let readers swipe through a short sequence of slides.",
      wrong: { b: "That is a blog post.", c: "That is a sequence of emails.", d: "That is audio content." },
    }),
    q({
      id: "cw-q12-04", atom: "a-cw-content-purposes", d: 2,
      prompt: "\"Five steps to file your tax return online\" is mainly which kind of content?",
      options: ["Educational", "Entertaining", "Informational news", "Promotional copy"],
      correct: "a",
      explanation: "It teaches the reader how to do something.",
      wrong: { b: "Its aim is not amusement.", c: "It teaches a process rather than reporting news.", d: "It does not sell." },
    }),
  ]),

  ...check("cw-l13-research", [
    q({
      id: "cw-q13-01", atom: "a-cw-content-briefs", d: 2,
      prompt: "A client asks you to \"write something about our new product\". What should you do first?",
      options: [
        "Ask for the audience, purpose, platform, length and the action the reader should take",
        "Write 2,000 words and send it",
        "Copy the competitor's article",
        "Refuse the job",
      ],
      correct: "a",
      explanation: "A ten-minute brief conversation prevents a full rewrite.",
      wrong: { b: "Writing blind wastes your time and theirs.", c: "That is plagiarism.", d: "Unnecessary: clarify instead." },
    }),
    q({
      id: "cw-q13-02", atom: "a-cw-research", d: 2,
      prompt: "Why keep research notes with every fact and its source?",
      options: ["So you can cite and re-check each fact", "To make the article longer", "To impress the client", "Because search engines read them"],
      correct: "a",
      explanation: "Traceable facts can be cited, verified and corrected.",
      wrong: { b: "Notes are not published.", c: "Their value is accuracy.", d: "Search engines never see your notes." },
    }),
    q({
      id: "cw-q13-03", atom: "a-cw-sources", d: 3,
      prompt: "In the CRAAP test, a company's report praising its own product mainly raises a question about…",
      options: ["Purpose", "Currency", "Relevance", "Spelling"],
      correct: "a",
      explanation: "A source that exists to sell may be accurate about facts but biased in its claims.",
      wrong: { b: "Currency is about date.", c: "It may be very relevant.", d: "Spelling is not a CRAAP criterion." },
    }),
    q({
      id: "cw-q13-04", atom: "a-cw-fact-checking", d: 3,
      prompt: "A source says 38% of savers used an app. A draft says \"most savers use apps\". Verdict?",
      options: ["Inaccurate: 38% is not most", "Accurate: it is close enough", "Unsupported: no source exists", "Accurate if the article is informal"],
      correct: "a",
      explanation: "Rounding up a minority into \"most\" reverses the meaning of the evidence.",
      wrong: { b: "Close enough is not accurate.", c: "There is a source; it says something different.", d: "Tone does not change facts." },
    }),
    q({
      id: "cw-q13-05", atom: "a-cw-fact-checking", d: 2,
      prompt: "What should you do with a claim that has no reliable source?",
      options: ["Remove it or find a reliable source for it", "Publish it with \"reportedly\"", "Put it in bold", "Attribute it to \"experts\""],
      correct: "a",
      explanation: "A professional writer never publishes a claim they cannot trace.",
      wrong: { b: "Hedging does not make it true.", c: "Formatting does not verify.", d: "Vague attribution is a fabrication." },
    }),
  ]),

  ...check("cw-l14-structure", [
    q({
      id: "cw-q14-01", atom: "a-cw-content-ideas", d: 2,
      prompt: "Which is an angle rather than just a topic?",
      options: [
        "How to save ₦100,000 in six months on a ₦150,000 salary",
        "Savings",
        "Money",
        "Finance tips",
      ],
      correct: "a",
      explanation: "An angle names a specific reader, goal and promise.",
      wrong: { b: "A topic.", c: "A topic.", d: "Still general." },
    }),
    q({
      id: "cw-q14-02", atom: "a-cw-outlines", d: 2,
      prompt: "Why send a client the outline before drafting a long article?",
      options: ["Agreeing the structure first prevents most rewrites", "Clients prefer short documents", "It doubles the fee", "Outlines are what gets published"],
      correct: "a",
      explanation: "Structure is cheap to change in an outline and expensive in a draft.",
      wrong: { b: "Not the reason.", c: "It does not change the fee.", d: "The article is published, not the outline." },
    }),
    q({
      id: "cw-q14-03", atom: "a-cw-intros-conclusions", d: 2,
      prompt: "What are the three moves of a strong introduction?",
      options: ["Hook, problem, promise", "Greeting, history, summary", "Keyword, keyword, keyword", "Question, answer, apology"],
      correct: "a",
      explanation: "Grab the right reader, name their need, tell them what they will get.",
      wrong: { b: "History warms up instead of hooking.", c: "That is keyword stuffing (Module 6).", d: "Not a structure." },
    }),
    q({
      id: "cw-q14-04", atom: "a-cw-intros-conclusions", d: 3,
      prompt: "Which ending is strongest for a how-to article?",
      options: [
        "\"Start today: list three achievements and the story behind each.\"",
        "\"In conclusion, interviews are very important.\"",
        "\"Thank you for reading this article.\"",
        "A repeat of every section in full",
      ],
      correct: "a",
      explanation: "A conclusion sums up briefly and gives one clear next step.",
      wrong: { b: "A cliché with no action.", c: "Adds nothing.", d: "Repetition bores the reader." },
    }),
    q({
      id: "cw-q14-05", atom: "a-cw-long-form", d: 2,
      prompt: "How can you quickly test the structure of a long article?",
      options: ["Read only the headings top to bottom: do they tell the story?", "Count the commas", "Check the word count only", "Read it backwards"],
      correct: "a",
      explanation: "Descriptive headings that tell the story mean scanners can navigate.",
      wrong: { b: "Commas say nothing about structure.", c: "Length is not structure.", d: "Not a structural test." },
    }),
  ]),

  ...check("cw-l15-article", [
    q({
      id: "cw-q15-01", atom: "a-cw-citing", d: 2,
      prompt: "In web content, where should a statistic's source appear?",
      options: [
        "Named in the sentence that uses it, linked, and listed under Sources",
        "Only in a footnote at the bottom",
        "Nowhere; readers trust you",
        "In the headline",
      ],
      correct: "a",
      explanation: "Readers see where it came from at the moment they read the claim.",
      wrong: { b: "Web readers rarely reach footnotes.", c: "Uncited statistics lose trust.", d: "Headlines are for the main promise." },
    }),
    q({
      id: "cw-q15-02", atom: "a-cw-citing", d: 2,
      prompt: "How is a link written in Markdown?",
      options: ["[Text the reader sees](https://address)", "<Text>(https://address)", "{https://address}", "(Text)[https://address]"],
      correct: "a",
      explanation: "Square brackets for the text, round brackets for the address.",
      wrong: { b: "Not Markdown.", c: "Not Markdown.", d: "Brackets reversed." },
    }),
    q({
      id: "cw-q15-03", atom: "a-cw-m4-practical", d: 3,
      prompt: "Which section heading is most descriptive?",
      options: ["Seal it so insects cannot breathe", "Part 2", "More information", "Section B"],
      correct: "a",
      explanation: "It tells the scanner exactly what the section gives them.",
      wrong: { b: "Says nothing.", c: "Says nothing.", d: "Says nothing." },
    }),
    q({
      id: "cw-q15-04", atom: "a-cw-m4-practical", d: 3,
      prompt: "Your notes say \"7 in 10 surveyed customers lost beans to weevils\". Which sentence is accurate?",
      options: [
        "In a survey of 120 customers, 7 in 10 had lost beans to weevils in the past year.",
        "Most Nigerians lose all their beans to weevils.",
        "9 in 10 customers lose beans every month.",
        "Weevils destroy 70% of all grain in Nigeria.",
      ],
      correct: "a",
      explanation: "It keeps the population, the figure and the time frame of the source.",
      wrong: { b: "Changes the population and exaggerates.", c: "Wrong figure and time frame.", d: "Changes what was measured." },
    }),
  ]),
};

export default ASSESSMENTS;
