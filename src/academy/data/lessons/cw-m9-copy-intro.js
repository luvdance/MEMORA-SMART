/**
 * CONTENT WRITING · MODULE 9 · INTRODUCTION TO COPYWRITING
 *
 * Curriculum 9.1 – 9.12 and the practical 9.P. What copywriting is, copy
 * versus content, the psychology of persuasion, needs and pain points,
 * features and benefits, buying behaviour, USPs, the customer journey,
 * emotional and rational appeals, trust and social proof, honest urgency
 * and an introduction to frameworks; then persuasive product copy.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s9-copy-intro";

/* ── Lesson 32 lab: pain points from reviews ───────────────────────────── */
const PAIN_BRIEF = `**ChopBox** delivers ready-to-cook ingredient boxes (washed, cut and measured) with recipes for Nigerian dishes in Lagos. Before writing any copy, you read reviews of ChopBox and its competitors. Six comments:

1. "By the time I get home from work at 8pm, the last thing I want is to start cutting vegetables."
2. "I spend ₦15,000 at the market and half the vegetables rot before I use them."
3. "I want my kids to eat proper home food, not noodles again."
4. "Going to the market on Saturday takes my whole morning, and the traffic!"
5. "I'm tired of ordering takeaway. It's expensive and I don't know what's in it."
6. "I never know how much pepper or seasoning to use. My stew is never like my mum's."`;

const PAIN_DOC = `# ChopBox: customer pain points

| Pain point | Customer's words (quote a comment) | Underlying need |
|------------|------------------------------------|-----------------|
|  |  |  |

## The deepest pain
[Which pain point would you lead the copy with, and why? At least 30 words.]
`;

const PAIN_DONE = `# ChopBox: customer pain points

| Pain point | Customer's words (quote a comment) | Underlying need |
|------------|------------------------------------|-----------------|
| No time or energy to prepare food after work | "the last thing I want is to start cutting vegetables" | Time and rest in the evening |
| Wasted money on food that spoils | "half the vegetables rot before I use them" | Value for money and no waste |
| Guilt about feeding the family badly | "I want my kids to eat proper home food" | Being a good parent who feeds the family well |
| Not confident cooking traditional dishes | "My stew is never like my mum's" | Confidence and the taste of home |

## The deepest pain
I would lead with the parents' guilt about not feeding their children proper home food. Time and money matter, but this pain is emotional and personal, so it motivates action. ChopBox can then answer it with the practical benefits: the food is prepared, measured and quick.
`;

/* ── Lesson 33 lab: features to benefits, and a USP ────────────────────── */
const FAB_BRIEF = `**ChopBox** features:

- Ingredients arrive washed, cut and measured
- Step-by-step recipe card with photos for every dish
- Delivered on Sunday or Wednesday, in a cool box
- Choose 3, 4 or 5 dishes a week; skip or cancel any week
- Recipes developed with a Lagos chef, including egusi, efo riro, jollof and okra soup
- From ₦18,000 a week for 3 dishes for a family of four

Competitors: supermarkets (you buy and prepare everything yourself), takeaway apps (food is cooked for you, but costly and not home-made), and market traders (cheapest, but you shop and prepare).`;

const FAB_DOC = `# ChopBox: from features to benefits

| Feature | Benefit to the customer |
|---------|-------------------------|
|  |  |

## USP
[One sentence: what ChopBox offers that the competitors do not.]
`;

const FAB_DONE = `# ChopBox: from features to benefits

| Feature | Benefit to the customer |
|---------|-------------------------|
| Ingredients arrive washed, cut and measured | You get your evenings back: dinner takes 30 minutes, not two hours |
| Step-by-step recipe card with photos | You cook stew that tastes like home, even if you never learned |
| Delivered on Sunday or Wednesday in a cool box | No market trips and no Saturday traffic |
| Skip or cancel any week | You never pay for food you do not need |
| Exact portions for every recipe | Nothing rots in your fridge, so no money goes in the bin |

## USP
ChopBox is the only way to serve real home-cooked Nigerian meals in 30 minutes without going to the market, because everything arrives washed, cut and measured with a chef's recipe.
`;

/* ── Lesson 34 lab: the practical, persuasive product copy ─────────────── */
const COPY_BRIEF = `**The client's basic product description (what you must improve):**

> "AquaPure Water Filter. 4-stage filtration. 10-litre tank. Filter lasts 6 months. Price ₦45,000. Available in white. Contact us to order."

**Facts you can use:**

- Removes sediment, rust, chlorine taste and over 99% of bacteria (tested by an independent lab, report on the website).
- No electricity needed; fills from any tap or borehole water.
- Replacement filter: ₦8,000 every 6 months, so filtered water costs under ₦45 a day.
- A family of four spends about ₦2,000 a week on sachet and bottled water.
- 2,300 units sold since 2024; rated 4.7 out of 5 from 610 reviews.
- Review: "We stopped buying bottled water in March. The kids say it tastes better too." Funmi O., Ibadan.
- Free delivery and installation in Lagos and Ibadan this month (ends 30 November).
- 30-day money-back guarantee.`;

const COPY_DOC = `# AquaPure product page

## Headline

## Subheadline

## Body
[The persuasive copy: problem, benefits, proof.]

## Offer
[What they get, the honest deadline and the guarantee.]

## Call to action
`;

const COPY_DONE = `# AquaPure product page

## Headline
Clean, safe drinking water from your own tap

## Subheadline
Stop paying for sachet and bottled water. AquaPure filters your tap or borehole water for under ₦45 a day.

## Body
Every week, a family of four spends about ₦2,000 on sachet and bottled water, and still worries about what is in the borehole water they cook with.

AquaPure gives you clean water at home, without electricity. Its 4-stage filter removes sediment, rust and the taste of chlorine, and an independent lab found it removes over 99% of bacteria. Fill the 10-litre tank from any tap, and your family has safe water all day.

You save money, too. After you buy the filter, a ₦8,000 replacement every six months means your water costs less than ₦45 a day.

More than 2,300 families already drink AquaPure water, and they rate it 4.7 out of 5. "We stopped buying bottled water in March. The kids say it tastes better too," says Funmi O. from Ibadan.

## Offer
Get AquaPure for ₦45,000, with free delivery and installation in Lagos and Ibadan until 30 November. If you are not happy within 30 days, return it for a full refund.

## Call to action
Order your AquaPure today
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 9.1 – 9.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l32-copy",
    moduleId: "cw-m9-copy-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3", "9.4"],
    title: "What Copywriting Is and Why People Act",
    subtitle: "Copy versus content, the psychology of persuasion, and customer pain points",
    estimatedMinutes: 40,
    intro:
      "Part Three is about copywriting: writing that asks people to act. Persuasion is not trickery; it is understanding people well enough to show them, honestly, why acting is in their interest.",

    atoms: [
      {
        id: "a-cw-copy-defined",
        title: "What is copywriting?",
        explain:
          "Copywriting is writing that persuades a specific reader to take a specific action: buy, book, sign up, download, call, donate, subscribe. You met the definition in Module 1. Now the details. Copy appears in adverts, product pages, landing pages, sales pages, emails, social media ads, packaging, billboards, radio and video scripts, slogans and the text on buttons. Its success is measurable: the conversion rate (Module 8) shows what share of readers act. Copywriters are paid for results, so they test versions against each other and keep what works. Good copy is clear before clever, about the reader rather than the company, specific rather than vague, and honest, because copy that misleads may sell once but destroys trust and can break advertising law.",
      },
      {
        id: "a-cw-copy-vs-content",
        title: "Copywriting versus content writing",
        explain:
          "Content earns attention over time by giving value; copy converts attention into action now. They differ in length (copy is usually shorter, though long sales pages exist), in structure (copy follows persuasion frameworks; content follows the logic of the topic), in tone (copy is more direct and benefit-focused), and in measurement (conversions versus engagement and traffic). They work together: content attracts and educates, and copy (the headline, the CTA, the offer) asks for the action. Many jobs require both, for example a blog post (content) that ends with a persuasive call to action (copy), or a product page that informs and sells.",
        table: {
          caption: "Content and copy compared.",
          headers: ["", "Content writing", "Copywriting"],
          rows: [
            ["Goal", "Attract, inform, build trust", "Persuade a reader to act now"],
            ["Typical length", "Medium to long", "Short to medium (long for sales pages)"],
            ["Structure", "Follows the topic", "Follows a persuasion framework"],
            ["Success measure", "Traffic, engagement, time on page", "Clicks, sign-ups, sales"],
          ],
        },
      },
      {
        id: "a-cw-persuasion",
        title: "The psychology of persuasion",
        explain:
          "People decide with emotion and justify with reason, and they take mental shortcuts when deciding quickly. The psychologist Robert Cialdini described seven principles that copywriters use. Reciprocity: people want to return a favour, so free value (a guide, a sample) makes them open to you. Commitment and consistency: people act in line with what they have already said or done, so small first steps (a free quiz) lead to bigger ones. Social proof: people follow others like them (reviews, numbers, testimonials). Authority: people trust experts and credentials. Liking: people say yes to those they like and who are like them. Scarcity: people value what is limited, if the limit is real. Unity: people favour those who share their identity (\"for Lagos mums\"). Used honestly, these help people make decisions that are good for them; used to deceive, they are manipulation, and this course does not teach them that way.",
        table: {
          caption: "Cialdini's principles in copy.",
          headers: ["Principle", "Honest use in copy"],
          rows: [
            ["Reciprocity", "A free, genuinely useful guide or sample"],
            ["Commitment", "A small first step: a free quiz or trial"],
            ["Social proof", "Real reviews, ratings and customer numbers"],
            ["Authority", "Real credentials, lab tests, expert endorsement"],
            ["Liking", "A warm, human voice and a real founder story"],
            ["Scarcity", "A real deadline or limited stock, stated truthfully"],
            ["Unity", "Speaking to a shared identity: \"for Lagos mums\""],
          ],
        },
        decision: {
          scenario: "A bakery adds to its page: \"4.8 stars from 1,200 Lagos customers\".",
          question: "Which principle is it using?",
          options: [
            { id: "a", text: "Social proof", why: "Right. Real ratings from many people like the reader reassure them that the choice is safe." },
            { id: "b", text: "Scarcity", whyWrong: "Nothing is limited." },
            { id: "c", text: "Reciprocity", whyWrong: "Nothing is given away." },
            { id: "d", text: "Commitment", whyWrong: "No first step is asked of the reader." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-pain-points",
        title: "Understanding customer needs and pain points",
        explain:
          "People buy to solve problems or reach desires, so copy starts with the customer's pain points: the specific frustrations, worries and costs they live with. Pain points come in four kinds: financial (spending too much), productivity (wasting time and effort), process (something is complicated or inconvenient) and emotional (guilt, fear, embarrassment, stress). Find them in the customer's own words: reviews (of the client and competitors), comments, support messages, sales calls, forums and interviews. Write them down exactly, because the customer's words make the best copy (\"the last thing I want is to start cutting vegetables\"). Behind each pain point is a need: the outcome they really want. The deepest pain is usually emotional, and copy that names it accurately makes the reader feel understood.",
        writingLab: {
          task:
            "Map ChopBox's pain points from the six comments. Write at least four rows: the pain point in your own words, an exact quote from one of the comments (in quotation marks), and the underlying need. Cover at least three kinds of pain (time, money, emotion or confidence). Then choose the deepest pain to lead the copy with and explain why in at least 30 words.",
          brief: PAIN_BRIEF,
          doc: PAIN_DOC,
          tests: [
            { label: "At least four complete rows", check: "return rows(doc).filter((c) => words(c[0]) >= 4 && words(c[1]) >= 4 && words(c[2]) >= 3).length >= 4;", fail: "Fill four rows: a pain point, a quote and a need." },
            { label: "Every quote is the customer's real words", check: String.raw`const src = "By the time I get home from work at 8pm, the last thing I want is to start cutting vegetables. I spend ₦15,000 at the market and half the vegetables rot before I use them. I want my kids to eat proper home food, not noodles again. Going to the market on Saturday takes my whole morning, and the traffic! I'm tired of ordering takeaway. It's expensive and I don't know what's in it. I never know how much pepper or seasoning to use. My stew is never like my mum's.".toLowerCase().replace(/[’]/g, "'"); const r = rows(doc).filter((c) => words(c[1]) >= 4); return r.length >= 4 && r.every((c) => src.includes(c[1].replace(/^["“']|["”']$/g, '').replace(/[’]/g, "'").replace(/\.$/, '').toLowerCase()));`, fail: "Copy each quote exactly from a comment, inside quotation marks. The customer's words are the evidence." },
            { label: "At least three kinds of pain", check: String.raw`const t = rows(doc).map((c) => c.join(' ')).join(' ').toLowerCase(); return [/(time|evening|tired|energy|morning|traffic)/, /(money|₦|waste|rot|expensive|cost)/, /(kids|children|family|parent|guilt)/, /(confiden|stew|mum|taste|seasoning)/].filter((r) => r.test(t)).length >= 3;`, fail: "Cover different kinds of pain: time, money, emotion and confidence." },
            { label: "The deepest pain is chosen and explained (30+ words)", check: "return words(section('The deepest pain')) >= 30;", fail: "Say which pain you would lead with, and why it motivates action." },
          ],
          solution: PAIN_DONE,
          hint: "Read each comment and ask: what does this person really want that they are not getting?",
          successMessage: "Pain points in the customer's own words. Every line of good copy starts here.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 9.5 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l33-benefits",
    moduleId: "cw-m9-copy-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.5", "9.6", "9.7", "9.8"],
    title: "Benefits, Buying Behaviour and the USP",
    subtitle: "Turning features into benefits, how people buy, what makes an offer unique, and the journey",
    estimatedMinutes: 40,
    intro:
      "Customers do not buy products; they buy better versions of their lives. This lesson shows how to translate what a product is into what it does for the buyer, why people buy the way they do, and what makes one offer stand out.",

    atoms: [
      {
        id: "a-cw-features-benefits",
        title: "Features versus benefits",
        explain:
          "A feature is what a product is or has: a 10-litre tank, a 4-stage filter, ingredients cut and measured. A benefit is what that feature does for the customer: safe water all day, no worry about bacteria, dinner in 30 minutes. Customers care about benefits, but they believe them because of features, so good copy uses both: the benefit first, then the feature as proof. A quick test is \"so what?\": state the feature, ask \"so what?\" until you reach something the customer feels. \"Washed, cut and measured\" → so what? → \"no preparation\" → so what? → \"you get your evenings back\". Specific benefits beat general ones: \"dinner in 30 minutes\" beats \"saves time\".",
        samples: [
          { label: "Features only", tone: "bad", text: "4-stage filtration. 10-litre tank. Filter lasts 6 months." },
          { label: "Benefit, backed by the feature", tone: "good", text: "Safe drinking water all day from your own tap: a 4-stage filter removes rust, sediment and over 99% of bacteria." },
        ],
      },
      {
        id: "a-cw-buying-behaviour",
        title: "Understanding buying behaviour",
        explain:
          "Buying usually follows five stages: recognising a need, searching for information, comparing options, deciding, and evaluating after purchase. How long each stage takes depends on the product. Low-involvement purchases (a soft drink, a phone top-up) are quick and habitual, driven by convenience and brand familiarity. High-involvement purchases (a water filter, a car, a course) take time, research and reassurance, because the risk is higher. Other influences: price sensitivity, trust, family and friends (in Nigeria, a WhatsApp recommendation from a friend can outweigh any advert), and fear of making the wrong choice. Copy must answer the questions of the stage the reader is in, reduce perceived risk (guarantees, reviews, clear returns), and make the next step easy.",
      },
      {
        id: "a-cw-usp",
        title: "Identifying unique selling propositions (USPs)",
        explain:
          "A unique selling proposition (USP) is the specific reason a customer should choose this offer over every alternative, including doing nothing. To find it, list the customer's most important needs, list what each competitor offers (including the do-it-yourself option), and find where your offer meets a need that no competitor meets as well. A strong USP is specific, important to the customer, true, and provable: \"real home-cooked Nigerian meals in 30 minutes without going to the market\" rather than \"quality service\". It can be built from a combination of features (speed plus home cooking plus no shopping), a guarantee, a niche (only for nursing mothers), or a method. Write it as one sentence; the rest of the copy proves it.",
        decision: {
          scenario: "Which is the strongest USP for a laundry service in Port Harcourt?",
          question: "Choose the best USP.",
          options: [
            { id: "a", text: "\"Picked up from your door and returned ironed within 24 hours, or it's free.\"", why: "Right. Specific, important to busy customers, different from competitors, and backed by a promise." },
            { id: "b", text: "\"Quality laundry service.\"", whyWrong: "Every competitor could say it, and it proves nothing." },
            { id: "c", text: "\"We are the best in Port Harcourt.\"", whyWrong: "An unprovable claim, not a reason." },
            { id: "d", text: "\"Founded in 2023.\"", whyWrong: "A fact about the company, not a reason for the customer." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-journey-copy",
        title: "Writing for different stages of the customer journey",
        explain:
          "Readers arrive with different levels of awareness, and copy must meet them where they are. The copywriter Eugene Schwartz described five levels. Unaware: they do not know they have a problem, so start with a story or a surprising fact. Problem-aware: they feel the pain but do not know a solution exists, so name the pain precisely and introduce the solution. Solution-aware: they know solutions exist but not yours, so show why your solution is best (your USP). Product-aware: they know your product but have not bought, so give proof, answer objections and make an offer. Most aware: they are ready, so give the offer and the CTA quickly. A Facebook ad to strangers and an email to last week's visitors need very different copy for the same product.",
        table: {
          caption: "Copy for each level of awareness.",
          headers: ["Reader is…", "Lead with…", "Example opening"],
          rows: [
            ["Unaware", "A story or surprising fact", "\"A family of four spends ₦100,000 a year on bottled water.\""],
            ["Problem-aware", "The pain, named precisely", "\"Worried about what's in your borehole water?\""],
            ["Solution-aware", "Why yours is the best solution", "\"Unlike electric filters, AquaPure needs no power.\""],
            ["Product-aware", "Proof, objections, an offer", "\"2,300 families, 4.7 stars, and a 30-day guarantee.\""],
            ["Most aware", "The offer and the CTA", "\"Free installation ends Sunday. Order now.\""],
          ],
        },
        writingLab: {
          task:
            "Turn ChopBox's features into benefits. Write at least five rows: the feature, then a benefit that says what it does for the customer, talking to them as \"you\" (each benefit at least 6 words, and no benefit simply repeating its feature). Then write ChopBox's USP in one sentence that says what it offers that supermarkets, takeaway apps and markets do not.",
          brief: FAB_BRIEF,
          doc: FAB_DOC,
          tests: [
            { label: "At least five feature-benefit rows", check: "return rows(doc).filter((c) => words(c[0]) >= 3 && words(c[1]) >= 6).length >= 5;", fail: "Write five rows: a feature, then a benefit of six words or more." },
            { label: "Benefits speak to the customer", check: "const r = rows(doc).filter((c) => words(c[1]) >= 6); return r.length >= 5 && r.filter((c) => you(c[1]) >= 1).length >= 4;", fail: "Write benefits to the reader: \"You get your evenings back\"." },
            { label: "Benefits are not features repeated", check: "const r = rows(doc).filter((c) => words(c[1]) >= 6); return r.length >= 5 && r.every((c) => overlap(c[1], c[0]) < 0.5);", fail: "Ask \"so what?\" about each feature and write what the customer gains." },
            { label: "USP: one sentence, specific, different from the alternatives", check: String.raw`const u = section('USP') || ''; return sentences(u).length === 1 && words(u) >= 12 && /(market|shop|takeaway|cook|30 minutes|home)/i.test(u) && !/(quality|best|leading|world-class)/i.test(u);`, fail: "In one specific sentence, say what ChopBox gives that the alternatives do not, without \"quality\" or \"best\"." },
          ],
          solution: FAB_DONE,
          hint: "For each feature, ask \"so what?\" twice and write the second answer.",
          successMessage: "Features turned into reasons to buy, and one sentence that says why ChopBox and not anyone else.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 9.9 – 9.12 · PRACTICAL 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l34-appeals",
    moduleId: "cw-m9-copy-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.9", "9.10", "9.11", "9.12", "9.P"],
    title: "Appeals, Proof, Urgency and Your First Sales Copy",
    subtitle: "Emotion and reason, trust and social proof, honest urgency, frameworks, and the practical",
    estimatedMinutes: 60,
    intro:
      "Persuasive copy works on the heart and the head, earns trust with proof, and gives an honest reason to act now. This lesson covers all three, introduces the frameworks of Module 10, and ends with your first full piece of sales copy.",

    atoms: [
      {
        id: "a-cw-appeals",
        title: "Emotional and rational appeals",
        explain:
          "Emotional appeals connect with feelings: security, love for family, pride, fear of missing out, relief, belonging, ambition. Rational appeals give logical reasons: price, savings, specifications, test results, comparisons, guarantees. People usually decide emotionally and then justify the decision with reasons, so strong copy uses both: emotion to make the reader care and reason to let them say yes. A water filter's emotional appeal is a safe, healthy family; its rational appeal is under ₦45 a day compared with ₦2,000 a week on bottled water. Match the balance to the product and reader: a hospital or insurance product needs strong rational proof; a gift or fashion item leans emotional. Never invent emotion that the product does not justify, and never use fear dishonestly.",
      },
      {
        id: "a-cw-trust",
        title: "Trust, credibility and social proof",
        explain:
          "People will not act on copy they do not believe. Build credibility with: specific facts instead of superlatives (\"removes over 99% of bacteria\" rather than \"the best filter\"); evidence (independent test results, certifications, awards, years in business); social proof (customer numbers, ratings with the number of reviews, testimonials with a name and location, case studies, logos of clients, media mentions); authority (expert endorsements, credentials); and risk reversal (guarantees, free trials, easy returns). Testimonials work best when they are specific, describe a before and after, and come from someone like the reader. All proof must be real: invented reviews or ratings are deceptive and illegal under consumer protection rules in Nigeria and most countries.",
        samples: [
          { label: "Claim without proof", tone: "bad", text: "The best and most trusted water filter in Nigeria!" },
          { label: "Proof", tone: "good", text: "Tested by an independent lab: removes over 99% of bacteria. Rated 4.7 out of 5 by 610 customers." },
        ],
      },
      {
        id: "a-cw-urgency",
        title: "Creating urgency without manipulation",
        explain:
          "Urgency gives the reader a reason to act now rather than later, which matters because \"later\" usually means never. Honest urgency is based on something true: a real deadline (an offer ends on 30 November), real limited stock or places (a class has 20 seats), a seasonal reason (order before the holidays), or the cost of waiting (every week without a filter costs ₦2,000 in bottled water). Manipulative urgency is false or pressuring: fake countdown timers that reset, \"only 2 left\" when there are hundreds, deadlines that are extended every week, or shaming the reader for hesitating. False urgency is deceptive, can break advertising rules, and destroys trust once customers notice. State the reason for the deadline, and keep it.",
        decision: {
          scenario: "A client asks you to add \"Only 3 left in stock!\" to a product page. They have 400 units in the warehouse.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Refuse the false claim and suggest honest urgency: a real deadline on an offer, or the cost of waiting", why: "Right. False scarcity is deceptive and risks the client's reputation and legal trouble. Real urgency works without lying." },
            { id: "b", text: "Add it: everyone does it", whyWrong: "It is a false claim. Common practice does not make it honest or legal." },
            { id: "c", text: "Write \"Only a few left\" instead", whyWrong: "Still false with 400 units in stock." },
            { id: "d", text: "Add a countdown timer that resets", whyWrong: "That is also fake urgency." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-frameworks-intro",
        title: "Introduction to copywriting frameworks",
        explain:
          "A copywriting framework is a proven order for persuasive information, so you do not start every piece from a blank page. Each follows how a reader moves from attention to action. You will practise five in Module 10: AIDA (Attention, Interest, Desire, Action), the classic structure for ads and pages; PAS (Problem, Agitation, Solution), which starts from pain; BAB (Before, After, Bridge), which contrasts two states; FAB (Features, Advantages, Benefits), which turns specifications into reasons; and the 4Ps (Promise, Picture, Proof, Push). Frameworks are scaffolds, not formulas: they tell you what to include and in what order, but every sentence still has to be specific, true and written for the reader. For the practical below, a simple structure is enough: headline, the problem, the benefits with proof, the offer, and the call to action.",
      },
      {
        id: "a-cw-m9-practical",
        title: "Practical: from product description to persuasive copy",
        explain:
          "Transform AquaPure's basic description into persuasive product-page copy. Lead with the benefit, name the problem, prove the benefits with facts, combine an emotional and a rational appeal, add social proof, make an honest offer with its real deadline and guarantee, and end with a clear call to action. Use only the facts in the brief: no invented claims.",
        writingLab: {
          task:
            "Headline: a benefit in 12 words or fewer (not the product name alone). Subheadline: one or two sentences. Body: 100 to 220 words that name the problem, give at least three benefits backed by facts, include an emotional appeal (family, safety or worry) and a rational one (cost or savings with a number), and quote the review. Offer: the price, the free delivery deadline (30 November) and the 30-day guarantee. Call to action: 2 to 6 words starting with a verb. Talk to the reader more than about the company, and invent nothing: no \"only X left\" and no claims not in the brief.",
          brief: COPY_BRIEF,
          doc: COPY_DOC,
          tests: [
            { label: "Headline: a benefit in 12 words or fewer", check: String.raw`const h = section('Headline') || ''; return words(h) >= 3 && words(h) <= 12 && !/^aquapure( water filter)?\.?$/i.test(h.trim());`, fail: "Lead with what the reader gets, not the product name." },
            { label: "Body: 100 to 220 words with a problem and a cost comparison", check: String.raw`const b = section('Body') || ''; return words(b) >= 100 && words(b) <= 220 && /(₦\s?2,?000|bottled|sachet)/i.test(b) && /₦\s?45\b|45 a day/i.test(b);`, fail: "Name the problem (spending on bottled water) and compare it with the cost per day." },
            { label: "Emotional appeal and proof (lab test, rating or customers)", check: String.raw`const b = section('Body') || ''; return /(family|kids|children|safe|worry|health)/i.test(b) && /(99\s?%|4\.7|2,?300|610)/.test(b);`, fail: "Speak to the family's safety, and prove it with the lab result, the rating or the customer number." },
            { label: "Quotes the customer review", check: String.raw`return /stopped buying bottled water/i.test(section('Body') || '') && /funmi/i.test(section('Body') || '');`, fail: "Use Funmi's testimonial, with her name." },
            { label: "Offer: price, real deadline and guarantee", check: String.raw`const o = section('Offer') || ''; return /₦\s?45,?000/.test(o) && /30 november/i.test(o) && /30[- ]day/i.test(o);`, fail: "State the price, the 30 November deadline for free delivery and installation, and the 30-day guarantee." },
            { label: "CTA: 2 to 6 words starting with a verb", check: String.raw`const c = (section('Call to action') || '').trim(); return words(c) >= 2 && words(c) <= 6 && isAction(c);`, fail: "End with a short instruction such as \"Order your AquaPure today\"." },
            { label: "Reader-focused, and nothing invented", check: String.raw`return you(doc) > self(doc) && !/(only \d+ left|limited stock|best in nigeria|number one|no\. ?1|doctor recommended|100%)/i.test(doc);`, fail: "Use \"you\" more than \"we\", and remove claims that are not in the brief." },
          ],
          solution: COPY_DONE,
          hint: "Write the headline from the customer's outcome, then make every sentence in the body either a benefit or the proof of one.",
          successMessage: "A spec sheet turned into copy: a benefit-led headline, a real problem, proof, an honest offer and a clear next step.",
        },
      },
    ],

    task: {
      title: "Module 9 practical: rewrite three real product descriptions",
      intro: "Find real, weak product descriptions and make them sell, honestly.",
      prompts: [
        "Choose three products sold online by small Nigerian businesses (on Instagram, Jumia, Jiji or a small website) whose descriptions list only features.",
        "For each, read the reviews and comments and write down three pain points in the customers' own words.",
        "Write a features-to-benefits table and a one-sentence USP for each product.",
        "Rewrite each description with a benefit headline, proof, an honest reason to act now and a clear CTA.",
        "Show the before-and-after pairs to three people in the target audience and ask which version they would buy from, and why.",
      ],
      closing: "Module 10 gives you the frameworks professional copywriters use every day: AIDA, PAS, BAB, FAB and the 4Ps.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
