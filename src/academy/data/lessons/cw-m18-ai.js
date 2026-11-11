/**
 * CONTENT WRITING · MODULE 18 · AI-ASSISTED WRITING AND MODERN WRITING TOOLS
 *
 * Curriculum 18.1 – 18.16 and the practical 18.P. AI in the writing
 * industry, how language models work, ChatGPT, Claude and other assistants,
 * prompting for writers, ideas, research and verification, outlines and
 * drafts, AI editing, improving AI text, spotting generic AI writing,
 * originality and voice, plagiarism and fabrication, copyright and
 * responsible use, human judgement, and grammar and writing tools; then an
 * AI draft fact-checked and rewritten into a human-reviewed article.
 *
 * Labs supply the "AI output" in the brief, so every learner can practise
 * whether or not they have an AI tool. Sources are invented for practice.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s18-ai";

/* ── Lesson 67 lab: an AI-use statement for clients ────────────────────── */
const POLICY_DOC = `# How I use AI in my writing work

## My approach
[One paragraph for clients: what AI does and does not do in your process.]

## My rules
[At least five "- " rules you follow.]
`;

const POLICY_DONE = `# How I use AI in my writing work

## My approach
I use AI assistants such as ChatGPT and Claude as tools, not as writers. They help me brainstorm angles, organise research notes into outlines and spot problems in my drafts. Every piece you receive is researched, written and edited by me, every fact is checked against a reliable source, and the final words are mine.

## My rules
- I never paste confidential client information into an AI tool without the client's permission.
- I check every fact, figure, quote and source an AI tool suggests against a reliable original source.
- I never publish AI output without rewriting and editing it myself.
- I follow each client's own policy on AI use, and I tell clients how I used AI when they ask or when their policy requires it.
- I never use AI to copy another writer's work or imitate a living writer's style for a client.
- I am responsible for everything I deliver, whatever tools I used.
`;

/* ── Lesson 68 lab: a structured prompt ────────────────────────────────── */
const PROMPT_BRIEF = `You are using an AI assistant to help with an outline for **Harvest Hub's** next blog post: how small food traders in Kaduna can reduce losses from spoiled tomatoes during the rainy season. The audience is traders with little formal education who read on phones. Harvest Hub's voice is practical, warm and respectful. You want an outline, not a finished article, and you will check every fact yourself.

Your first attempt was: "write about tomatoes".`;

const PROMPT_DOC = `# A better prompt

- Role:
- Task:
- Context:
- Audience:
- Format:
- Constraints:

## Verification plan
[How you will check what the AI gives you. At least two "- " bullets.]
`;

const PROMPT_DONE = `# A better prompt

- Role: You are an experienced content strategist who writes practical guides for small businesses in Nigeria.
- Task: Create an outline for a blog post on how small food traders can reduce losses from spoiled tomatoes during the rainy season.
- Context: The post is for Harvest Hub, a farm-produce marketplace in Kaduna. Its voice is practical, warm and respectful.
- Audience: Small tomato traders in Kaduna with little formal education, reading on their phones.
- Format: A headline, an introduction idea, five H2 sections with two or three bullet points each, and a closing call to action.
- Constraints: Use simple words, no statistics unless you name a real source I can check, and do not write the full article.

## Verification plan
- Check every storage method and fact in the outline against agricultural extension guides or other reliable sources.
- Ask two tomato traders whether the tips are realistic and affordable before writing the article.
- Remove any statistic or source I cannot find and confirm myself.
`;

/* ── Lesson 69 lab: humanising generic AI text ─────────────────────────── */
const GENERIC_BRIEF = `This paragraph was produced by an AI assistant for **ChopBox** (the meal-kit company from Module 9). The client says it "sounds like every other website". Rewrite it.

> In today's fast-paced world, finding time to cook can be a challenge. That's where ChopBox comes in. We are revolutionizing the way Nigerian families cook by offering a seamless, game-changing meal kit experience. Whether you're a busy professional or a parent, ChopBox empowers you to unlock the power of home cooking. Furthermore, our high-quality ingredients ensure a delightful culinary journey. In conclusion, ChopBox is the perfect solution for your needs.

**Facts you can use:** ingredients arrive washed, cut and measured; dinner in about 30 minutes; recipes by a Lagos chef; egusi, efo riro, jollof and okra soup; from ₦18,000 a week for 3 dishes for a family of four; customer review: "My children ask for my efo riro now." Amaka O., Lagos.`;

const AI_PARA = `In today's fast-paced world, finding time to cook can be a challenge. That's where ChopBox comes in. We are revolutionizing the way Nigerian families cook by offering a seamless, game-changing meal kit experience. Whether you're a busy professional or a parent, ChopBox empowers you to unlock the power of home cooking. Furthermore, our high-quality ingredients ensure a delightful culinary journey. In conclusion, ChopBox is the perfect solution for your needs.`;

const GENERIC_DOC = `# ChopBox, rewritten

## AI version
${AI_PARA}

## Rewrite
[60 to 120 words. Specific, in ChopBox's warm, practical voice.]
`;

const GENERIC_DONE = `# ChopBox, rewritten

## AI version
${AI_PARA}

## Rewrite
It's 7pm, you're tired, and the egusi still needs pounding. ChopBox fixes that. Every week we deliver everything for real Nigerian dinners, from efo riro to jollof, already washed, cut and measured, with a recipe card from a Lagos chef. Dinner is on the table in about 30 minutes. Plans start from ₦18,000 a week for three dishes for a family of four. As one Lagos mum, Amaka, told us: "My children ask for my efo riro now."
`;

/* ── Lesson 70 lab: the practical ──────────────────────────────────────── */
const AI_BRIEF = `You asked an AI assistant for a short article for **Kora** (the savings app) on "how young Nigerians can build an emergency fund". It produced the draft below. Your job: fact-check it against the client's verified sources, then write the polished, human-reviewed version.

**The AI draft**

> **Building an Emergency Fund: Your Ultimate Guide**
>
> In today's fast-paced world, financial security is more important than ever. According to a 2024 study by the Central Bank of Nigeria, 78% of young Nigerians have no emergency savings. Financial experts recommend saving three to six months of essential expenses. As renowned economist Dr Ngozi Adeyemi famously said, "An emergency fund is the foundation of all wealth." Furthermore, keeping your emergency fund in a separate account helps you resist the temptation to spend it. Kora's Vault offers an industry-leading 25% interest rate. In conclusion, start your emergency fund today and unlock the power of financial freedom.

**Verified sources from the client** (practice sources, invented for this exercise)

- **Kora Savings Report 2025 (practice source), https://example.org/kora-report:** among 5,000 Kora users aged 18 to 35, 61% said they could not cover an unexpected ₦100,000 expense from savings.
- **Personal Finance Basics (practice source), https://example.org/finance-basics:** a common guideline is to save three to six months of essential expenses; a separate account makes the money harder to spend on impulse.
- **Kora product sheet:** the Kora Vault pays 12% interest a year; withdrawals take 1 working day.
- The client could find no CBN study with the 78% figure, and no record of a "Dr Ngozi Adeyemi" quotation.`;

const AI_DOC = `# AI draft review

## Fact-check
Verdict must be exactly one of: Verified, Incorrect, Fabricated.

| Claim | Verdict | Action |
|-------|---------|--------|
| CBN study: 78% have no emergency savings |  |  |
| Three to six months of essential expenses |  |  |
| Dr Ngozi Adeyemi quotation |  |  |
| Separate account helps resist spending |  |  |
| Kora Vault pays 25% interest |  |  |

## Final article
[The polished, human-reviewed version: a headline as a "### " line, 180 to 320 words, accurate, specific, and in Kora's voice.]

## AI disclosure note
[One or two sentences for the client describing how AI was used.]
`;

const AI_DONE = `# AI draft review

## Fact-check
Verdict must be exactly one of: Verified, Incorrect, Fabricated.

| Claim | Verdict | Action |
|-------|---------|--------|
| CBN study: 78% have no emergency savings | Fabricated | Replace with the Kora Savings Report figure of 61% |
| Three to six months of essential expenses | Verified | Keep and cite Personal Finance Basics |
| Dr Ngozi Adeyemi quotation | Fabricated | Remove the quotation completely |
| Separate account helps resist spending | Verified | Keep and cite Personal Finance Basics |
| Kora Vault pays 25% interest | Incorrect | Correct it to 12% a year |

## Final article
### How to build your first emergency fund

Your phone screen cracks, your rent goes up, or a relative needs hospital care. Could you pay ₦100,000 tomorrow without borrowing? In the Kora Savings Report 2025, 61% of Kora users aged 18 to 35 said they could not.

An emergency fund is money you keep only for surprises like these. A common guideline, according to Personal Finance Basics, is to build up three to six months of essential expenses: rent, food, transport and bills. That can sound like a lot, so start smaller. Work out one month of essentials, and make that your first target.

Next, keep the money away from your everyday account. Personal Finance Basics notes that a separate account makes savings harder to spend on impulse. A Kora Vault does this for you. It pays 12% interest a year, and withdrawals take one working day, which is quick enough for a real emergency but slow enough to stop a weekend spending spree.

Finally, make saving automatic. Choose a fixed amount to move into your Vault on payday, even if it is only ₦5,000. Small amounts add up when they happen every month.

Open a Kora Vault today and set your first emergency fund goal.

## AI disclosure note
An AI assistant produced a first draft. I fact-checked every claim against Kora's verified sources, removed a fabricated statistic and quotation, corrected the interest rate, and rewrote the article myself.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 18.1 – 18.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l67-ai-intro",
    moduleId: "cw-m18-ai",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2", "18.3", "18.4"],
    title: "AI and the Writing Industry",
    subtitle: "What AI changes, how language models work, and the main assistants",
    estimatedMinutes: 40,
    intro:
      "AI writing assistants are now part of almost every writing job. Writers who use them well are faster; writers who let them write unchecked lose clients. This module teaches the difference.",

    atoms: [
      {
        id: "a-cw-ai-industry",
        title: "Introduction to AI in the writing industry",
        explain:
          "Generative AI tools can now produce fluent text in seconds, and they have changed writing work in three ways. Some routine, low-value writing (generic product descriptions, simple summaries) is now cheaper and partly automated. Writers are expected to be faster, often using AI for research summaries, outlines, first drafts, variations and editing suggestions. And the value of human skills has risen where AI is weak: accurate research and fact-checking, original insight and reporting, real interviews and stories, strategy, brand voice, judgement about audience and ethics, and responsibility for the final result. Clients increasingly want writers who can use AI productively while guaranteeing accuracy and originality. Many organisations now have AI policies that say what is allowed; always ask.",
      },
      {
        id: "a-cw-llms",
        title: "Understanding AI language models",
        explain:
          "AI writing assistants are built on large language models (LLMs). An LLM is trained on enormous amounts of text to predict likely next words (more precisely, tokens, which are pieces of words); further training teaches it to follow instructions and hold conversations. This explains its strengths and weaknesses. It is fluent and fast, good at structure, summaries, variations and common knowledge. But it does not look facts up unless it is connected to search or documents, and even then it can misread them; it can produce confident, plausible statements that are false, a problem called hallucination (invented statistics, sources, quotations and citations are common); its knowledge stops at a training cutoff date; it tends towards generic, average-sounding text; and it can reflect biases in its training data. Treat AI output as a draft from a fast, knowledgeable but unreliable assistant: useful, never authoritative.",
        decision: {
          scenario: "An AI assistant gives you a statistic with a source: \"According to a 2024 CBN study, 78% of young Nigerians have no savings.\"",
          question: "What should you do?",
          options: [
            { id: "a", text: "Find the original CBN report and confirm the figure before using it; if you cannot find it, do not use it", why: "Right. AI can invent statistics and sources that look real. Only the original source counts." },
            { id: "b", text: "Use it: it names a source", whyWrong: "A named source can itself be invented. Verify it exists and says this." },
            { id: "c", text: "Use it but write \"reportedly\"", whyWrong: "Hedging does not make an unverified figure acceptable." },
            { id: "d", text: "Ask the AI if it is sure", whyWrong: "The AI may confidently confirm its own error. Check the original source." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-chatgpt",
        title: "Using ChatGPT for writing assistance",
        explain:
          "ChatGPT, made by OpenAI, is the best-known AI assistant, available on the web and as an app, with free and paid plans. Writers use it to brainstorm topics and angles, summarise long documents, suggest outlines, draft sections to rework, generate headline and subject-line variations, rewrite for different audiences or lengths, and get editing suggestions. Paid plans add stronger models, file uploads and web search with links to sources. Good habits: give it full context (Lesson 68), ask for options rather than one answer, continue the conversation to refine results, ask it to list the sources it used and then check them yourself, and turn off chat history or training settings where you need privacy, according to your client's policy. Never paste confidential client material unless the client has approved that tool.",
      },
      {
        id: "a-cw-claude-others",
        title: "Introduction to Claude and other AI writing assistants",
        explain:
          "Claude, made by Anthropic, is another leading assistant, widely used by writers for long documents, careful editing, following detailed style instructions and working with uploaded files. Google's Gemini is built into Google Workspace (Docs, Gmail) and Microsoft Copilot into Microsoft 365 (Word, Outlook), so many writers meet AI inside the tools they already use. Specialised tools exist for marketing copy, SEO briefs and transcription. Grammarly and other editing tools now include AI rewriting features (Lesson 70). Each tool has different strengths, limits, prices and privacy terms, and they change quickly, so test them on your own tasks and judge the results. Whatever the tool, the same rules apply: you provide the context and judgement, you verify the facts, and you are responsible for the final text.",
        table: {
          caption: "Common AI writing assistants.",
          headers: ["Tool", "Made by", "Often used for"],
          rows: [
            ["ChatGPT", "OpenAI", "Brainstorming, drafting, rewriting, research with web search"],
            ["Claude", "Anthropic", "Long documents, careful editing, following style guides"],
            ["Gemini", "Google", "Writing inside Google Docs and Gmail, search-connected answers"],
            ["Microsoft Copilot", "Microsoft", "Writing inside Word, Outlook and other Microsoft 365 apps"],
          ],
        },
        writingLab: {
          task:
            "Write the statement you will give clients about how you use AI. My approach: one paragraph of 50 to 110 words that names at least one AI tool, says what AI helps with and makes clear that research, final writing and fact-checking are yours. My rules: at least five bullets covering confidentiality, fact-checking, editing AI output, following the client's policy, and taking responsibility for the final work.",
          doc: POLICY_DOC,
          tests: [
            { label: "Approach: 50 to 110 words naming a tool", check: String.raw`const a = section('My approach') || ''; return words(a) >= 50 && words(a) <= 110 && /(chatgpt|claude|gemini|copilot)/i.test(a);`, fail: "Write 50 to 110 words and name at least one tool you use." },
            { label: "Approach: AI assists; the writing and checking are yours", check: String.raw`const a = section('My approach') || ''; return /(brainstorm|outline|ideas|research|draft)/i.test(a) && /(check|verif)/i.test(a) && /\b(I|me|mine|my)\b/.test(a);`, fail: "Say what AI helps with, and that you write, check and own the final work." },
            { label: "Five rules", check: "return bullets(section('My rules')).filter((b) => words(b) >= 6).length >= 5;", fail: "Write at least five rules of six words or more." },
            { label: "Rules cover confidentiality, fact-checking and editing", check: String.raw`const r = section('My rules') || ''; return /confidential|private|client (information|data)/i.test(r) && /(check|verif)/i.test(r) && /(rewrit|edit)/i.test(r);`, fail: "Include rules on confidential information, checking facts and editing AI output." },
            { label: "Rules cover the client's policy and responsibility", check: String.raw`const r = section('My rules') || ''; return /polic/i.test(r) && /responsib/i.test(r);`, fail: "Include following each client's AI policy and taking responsibility for your work." },
          ],
          solution: POLICY_DONE,
          hint: "Imagine a client asking, \"Did a robot write this?\" Your statement is your honest, professional answer.",
          successMessage: "A clear, honest AI policy you can share with any client. Keep it on your portfolio site.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 18.5 – 18.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l68-prompting",
    moduleId: "cw-m18-ai",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.5", "18.6", "18.7", "18.8"],
    title: "Prompting, Ideas, Research and Drafts",
    subtitle: "Getting useful output from AI, and using it at each stage of the writing process",
    estimatedMinutes: 40,
    intro:
      "AI output is only as good as the instructions it receives and the checking it gets afterwards. This lesson covers writing prompts, then using AI for ideas, research and drafts, with the safeguards each needs.",

    atoms: [
      {
        id: "a-cw-prompting",
        title: "Prompt engineering for writers",
        explain:
          "A prompt is the instruction you give an AI tool, and writing good prompts is writing a good brief (Module 4). Vague prompts (\"write about tomatoes\") produce generic text. Strong prompts include: a role (\"You are an experienced content strategist for Nigerian small businesses\"); the task, specific and single (\"Create an outline\", not \"write something\"); context (the client, the purpose, background facts); the audience (who will read it, what they know, where they read); the format (length, structure, headings, bullets); constraints (tone and voice, words to avoid, no statistics without sources); and examples of what good looks like, where you have them. Then iterate: ask for several options, give feedback (\"Shorter, and more practical\"), and ask it to explain or improve one part at a time. Keep useful prompts in a personal library.",
        samples: [
          { label: "Weak prompt", tone: "bad", text: "write about tomatoes" },
          { label: "Strong prompt", tone: "good", text: "You are a content strategist for Nigerian small businesses. Create an outline for a blog post for Harvest Hub on how tomato traders in Kaduna can reduce rainy-season losses. Audience: traders reading on phones. Format: headline, 5 H2 sections with bullets, a call to action. Use simple words, and no statistics without a source I can check." },
        ],
      },
      {
        id: "a-cw-ai-ideas",
        title: "Generating content ideas using AI",
        explain:
          "AI is good at volume and variety, which makes it useful at the idea stage. Ask it for twenty angles on a topic for a specific audience, for questions that audience is likely to ask, for headline variations, for ways to repurpose an article, or for counter-arguments to test your thinking. Then apply your judgement: most suggestions will be generic or obvious, and the value lies in spotting the two or three that are genuinely relevant and fresh, then combining them with what only you know (the client's data, real customer questions, interviews). Check ideas against real evidence of demand (keyword tools, comments, customer conversations; Modules 4 and 6), because AI does not know what your audience actually searches for or cares about this month.",
      },
      {
        id: "a-cw-ai-research",
        title: "Research assistance and information verification",
        explain:
          "AI can speed up research by summarising long documents you provide, explaining unfamiliar topics in simple terms, suggesting what to look for, and (in tools with web search) finding pages to read. It cannot be your source. Every fact, statistic, quotation, date, name and citation must be verified in a reliable original source (Module 4's CRAAP test), because AI tools can invent all of these, or misreport real ones. A safe workflow: use AI to understand and map the topic; ask it to name its sources; open and read those sources yourself; take notes from the sources, not from the AI; and cite the sources, never \"ChatGPT says\". When summarising a document with AI, compare the summary with the document for key points, because summaries can omit or distort important details.",
        decision: {
          scenario: "You ask an AI tool for a quote from a famous Nigerian economist about saving. It gives you a perfect quote with a name.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Search for the quote in a reliable original source; if you cannot find that the person said it, do not use it", why: "Right. AI often invents quotations and attributes them to real or imaginary people." },
            { id: "b", text: "Use it, because it sounds right", whyWrong: "Misattributed quotes damage credibility and can be defamatory." },
            { id: "c", text: "Use it but change a few words", whyWrong: "Still an unverified quotation, now altered." },
            { id: "d", text: "Cite \"AI-generated quote\"", whyWrong: "That is still presenting a fabricated quotation." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-ai-drafts",
        title: "Using AI to develop outlines and drafts",
        explain:
          "AI can turn your notes into a draft outline, suggest an order for your sections, or produce a rough first draft that you then rebuild. Used this way, it can save time on blank-page work. The safest approach is to give the AI your own research notes, outline and key points, so the draft is built on facts you have verified, and then treat whatever it produces as raw material: restructure it, rewrite it in your voice and the brand's voice, add the specific details, examples and evidence only you have, cut the generic parts, and check every claim again. Many clients pay for original human writing and some forbid AI-generated drafts, so follow the brief and the client's policy, and be honest about your process if asked.",
        writingLab: {
          task:
            "Replace the weak prompt \"write about tomatoes\" with a structured prompt for Harvest Hub's outline. Fill all six fields: Role, Task (an outline, not a full article), Context (Harvest Hub and its voice), Audience (the traders and how they read), Format (the outline's parts) and Constraints (simple words; no statistics without a checkable source). Each field at least 8 words. Then write a verification plan of at least two bullets.",
          brief: PROMPT_BRIEF,
          doc: PROMPT_DOC,
          tests: [
            { label: "All six fields filled (8+ words each)", check: String.raw`return ['Role', 'Task', 'Context', 'Audience', 'Format', 'Constraints'].every((f) => words(field(doc, f) || '') >= 8);`, fail: "Fill every field after its colon with at least eight words." },
            { label: "Task asks for an outline, not a full article", check: String.raw`const t = field(doc, 'Task') || ''; return /outline/i.test(t) && /tomato/i.test(t);`, fail: "Ask specifically for an outline about tomato losses." },
            { label: "Context and audience match the brief", check: String.raw`return /harvest hub/i.test(field(doc, 'Context') || '') && /(voice|warm|practical)/i.test(field(doc, 'Context') || '') && /trader/i.test(field(doc, 'Audience') || '') && /phone/i.test(field(doc, 'Audience') || '');`, fail: "Name Harvest Hub and its voice in Context, and the traders reading on phones in Audience." },
            { label: "Constraints: simple language and checkable sources", check: String.raw`const c = field(doc, 'Constraints') || ''; return /(simple|plain)/i.test(c) && /(source|statistic)/i.test(c);`, fail: "Constrain the language (simple words) and the facts (no statistics without a source you can check)." },
            { label: "Verification plan: two or more checks", check: String.raw`const v = bullets(section('Verification plan')); return v.length >= 2 && v.some((x) => /(check|verif|confirm)/i.test(x));`, fail: "List at least two ways you will check the AI's output." },
          ],
          solution: PROMPT_DONE,
          hint: "Write the prompt as if briefing a new freelancer who knows nothing about Harvest Hub.",
          successMessage: "From three words to a full brief. The quality of AI output starts with the quality of the prompt.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 18.9 – 18.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l69-human-voice",
    moduleId: "cw-m18-ai",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.9", "18.10", "18.11", "18.12"],
    title: "Editing With AI and Keeping Your Voice",
    subtitle: "AI editing, improving AI text, spotting generic writing, and staying original",
    estimatedMinutes: 40,
    intro:
      "Readers and clients increasingly recognise unedited AI text, and they trust it less. This lesson shows how to use AI as an editor, how to rewrite AI text, and how to keep a voice of your own.",

    atoms: [
      {
        id: "a-cw-ai-editing",
        title: "AI-assisted editing and proofreading",
        explain:
          "AI tools can act as a second reader: ask them to point out unclear sentences, grammar errors, inconsistencies, missing steps in an argument, jargon for a given audience, or places where the tone changes. Ask for suggestions with explanations rather than a full rewrite, so you stay in control and learn: \"List the five least clear sentences and explain why\" is more useful than \"Rewrite this\". Then judge each suggestion against what you learned in Module 17: AI editors sometimes change meaning, remove deliberate style choices, \"correct\" correct text, make everything sound the same, and introduce errors. Never accept AI changes in bulk. For proofreading, AI is useful but not sufficient: do your own final read on the published form.",
      },
      {
        id: "a-cw-improving-ai",
        title: "Improving AI-generated content",
        explain:
          "When you start from an AI draft, improve it in this order. Check: verify every fact and remove anything you cannot verify. Restructure: put the strongest point first and cut repetition and padding (AI drafts often repeat the same idea in each paragraph). Specify: replace general claims with specific facts, numbers, names, examples and quotes from your research (\"dinner in about 30 minutes\" rather than \"saves time\"). Voice: rewrite in the brand's voice and for the real audience, with natural rhythm. Cut tells: remove the stock phrases listed in the next atom. Then edit and proofread as you would any draft. A useful test: if a sentence could appear unchanged on a competitor's website, it is not finished.",
        decision: {
          scenario: "A client says: \"Your last two articles read like ChatGPT. What happened?\"",
          question: "What is the best way to prevent this?",
          options: [
            { id: "a", text: "Decide the angle yourself, use original research and examples, write the key parts yourself, and edit out generic phrasing", why: "Right. Originality comes from your own thinking, material and voice; AI can assist but not replace them." },
            { id: "b", text: "Use a different AI tool", whyWrong: "The problem is unedited, generic writing, not the brand of tool." },
            { id: "c", text: "Add more adjectives", whyWrong: "Adjectives make generic writing worse." },
            { id: "d", text: "Use an \"AI humaniser\" tool to disguise the text", whyWrong: "Disguising generic text is dishonest and does not add the specific value clients pay for." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-generic-ai",
        title: "Identifying generic and repetitive AI writing",
        explain:
          "Unedited AI text has recognisable habits. Stock phrases: \"In today's fast-paced world\", \"delve into\", \"unlock the power of\", \"game-changer\", \"seamless\", \"revolutionise\", \"a testament to\", \"navigate the complexities\", \"embark on a journey\", \"whether you're a … or a …\", \"Furthermore\", \"Moreover\" and \"In conclusion\". Structural habits: every paragraph the same length, lists of three adjectives, a summary sentence that repeats the paragraph, balanced \"not only… but also\" constructions, and a moral at the end. Content habits: claims with no specifics, no real names, numbers or examples, hedged generalities, and confident invented details. The Writing Desk's style report flags many of these as \"tired or machine-sounding phrases\". These habits are not proof that a person used AI (people wrote clichés long before AI), but they make writing weak either way, so remove them.",
        samples: [
          { label: "Generic", tone: "bad", text: "In today's fast-paced world, ChopBox is revolutionizing the way families cook with a seamless, game-changing experience that unlocks the power of home cooking." },
          { label: "Specific", tone: "good", text: "It's 7pm, you're tired, and the egusi still needs pounding. ChopBox delivers everything washed, cut and measured, so dinner takes about 30 minutes." },
        ],
      },
      {
        id: "a-cw-originality",
        title: "Maintaining originality and personal writing style",
        explain:
          "Your value as a writer is what AI cannot produce: your research, your interviews, your experience, your judgement, your angle and your voice. Protect it. Do the thinking before you open an AI tool: decide your angle and key message yourself. Gather original material: interviews, customer stories, your own observations, the client's data. Write the first draft of important pieces yourself, and use AI to challenge and polish rather than to originate. Keep a swipe file of your own best sentences and notice your natural rhythms and word choices. Read widely and well, because voice comes from reading. And do not imitate a specific living writer's style for a client using AI: it is unoriginal and can raise ethical and legal problems. Clients hire writers for a perspective; make sure there is one.",
        writingLab: {
          task:
            "Rewrite ChopBox's AI paragraph so it no longer sounds generic. 60 to 120 words; none of the tired phrases (the Style report must show zero tired or machine-sounding phrases); at least three specific facts from the brief (such as 30 minutes, ₦18,000, a dish name, washed, cut and measured, the Lagos chef); the customer review; no \"In conclusion\"; and a genuine rewrite rather than an edit of the original.",
          brief: GENERIC_BRIEF,
          doc: GENERIC_DOC,
          tests: [
            { label: "60 to 120 words", check: "const r = section('Rewrite'); return words(r) >= 60 && words(r) <= 120;", fail: "Write 60 to 120 words." },
            { label: "No tired or machine-sounding phrases", check: "return aiTells(section('Rewrite')).length === 0 && !/revolutioniz|empowers|perfect solution|culinary journey|high-quality/i.test(section('Rewrite'));", fail: "Open the Style report and remove every tired phrase it lists." },
            { label: "At least three specific facts", check: String.raw`const r = section('Rewrite') || ''; return [/30 minutes/i, /₦\s?18,?000/, /(egusi|efo riro|jollof|okra)/i, /washed, cut and measured/i, /lagos chef|chef in lagos|a lagos chef/i, /family of four/i].filter((x) => x.test(r)).length >= 3;`, fail: "Replace vague claims with facts: 30 minutes, ₦18,000, dish names, washed, cut and measured…" },
            { label: "Uses the customer review", check: String.raw`return /my children ask for my efo riro/i.test(section('Rewrite') || '');`, fail: "Include Amaka's words: a real customer beats any adjective." },
            { label: "A genuine rewrite", check: "return overlap(section('Rewrite'), section('AI version')) < 0.15;", fail: "Write it fresh rather than editing the AI paragraph." },
          ],
          solution: GENERIC_DONE,
          hint: "Start from a real moment in a customer's evening, then let the facts do the persuading.",
          successMessage: "From \"sounds like every other website\" to specific, human copy. Specifics are what AI cannot invent honestly.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 18.13 – 18.16 · PRACTICAL 18.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l70-responsible-ai",
    moduleId: "cw-m18-ai",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.13", "18.14", "18.15", "18.16", "18.P"],
    title: "Responsible AI, Writing Tools and the Practical",
    subtitle: "Plagiarism and fabrication, copyright, human judgement, editing tools, and the module practical",
    estimatedMinutes: 75,
    intro:
      "The final lesson on AI covers the rules that protect you and your clients, the editing tools every writer should know, and a full AI-assisted workflow done properly.",

    atoms: [
      {
        id: "a-cw-plagiarism",
        title: "Avoiding plagiarism and fabricated information",
        explain:
          "Plagiarism is presenting someone else's words or ideas as your own without credit. AI raises two new risks. AI tools can occasionally reproduce text closely resembling their training data, and they can produce content very similar to what they produce for other users. And they fabricate: invented statistics, studies, sources, quotations, laws, product features and even book titles that look completely real. Protect yourself: verify every factual claim in an original source; never publish a quotation you cannot trace; credit the sources of ideas and data; run important work through a plagiarism checker (for example Grammarly's, Copyscape or Quetext) when a client requires originality; and rewrite AI drafts substantially rather than lightly editing them. Publishing fabricated information can damage a client's reputation, mislead readers about health or money, and expose you to legal claims.",
      },
      {
        id: "a-cw-copyright-ai",
        title: "Copyright, attribution and responsible AI usage",
        explain:
          "Copyright protects original works of authorship. Two questions matter for writers using AI. Ownership: in several countries, including the United States, material generated entirely by AI without meaningful human authorship is not protected by copyright, while the human-authored parts of a work can be; the law is still developing in Nigeria and elsewhere, so check the jurisdiction and, above all, the client's contract, which may require that work is original and owned by the client. Responsibility: you are responsible for what you deliver, including any infringement or errors, whatever tool produced it. Responsible use also means respecting confidentiality (do not paste client data into tools the client has not approved), following the client's AI policy, disclosing AI use when the client or publication requires it, being careful with AI-generated images of real people, and never using AI to produce deceptive content such as fake reviews.",
      },
      {
        id: "a-cw-human-judgement",
        title: "Human judgment versus AI-generated content",
        explain:
          "AI produces plausible text; humans decide whether it is true, right and useful. Human judgement is essential for: knowing the real audience and what will matter to them; choosing the angle and the key message; checking facts and weighing evidence; ethical decisions (honest claims, fair representation, sensitivity to culture and context); brand voice and relationships; anything requiring real experience or original reporting; and accountability, because a person must stand behind the work. A useful division: let AI help with speed and options, and keep for yourself the decisions about truth, purpose, audience and ethics. The more a piece of writing affects people's money, health, safety, rights or reputation, the more human judgement it needs.",
        decision: {
          scenario: "A health clinic asks you to use AI to write 20 articles on medical conditions, quickly, with no expert review.",
          question: "What is the responsible approach?",
          options: [
            { id: "a", text: "Explain that health content needs verified sources and review by a qualified professional before publishing, and build that into the plan", why: "Right. The higher the stakes for readers, the more human expertise and checking the content needs." },
            { id: "b", text: "Generate all 20 with AI and publish them", whyWrong: "AI can produce plausible but wrong medical information that could harm readers." },
            { id: "c", text: "Copy articles from other health websites", whyWrong: "Plagiarism, and still no expert review." },
            { id: "d", text: "Refuse to write health content ever", whyWrong: "Health content can be done well with proper sources and review." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-writing-tools",
        title: "Introduction to grammar and writing tools",
        explain:
          "Professional writers use a small set of tools daily. Google Docs: cloud writing and collaboration, with comments, suggestion mode (tracked changes), version history and built-in spelling and grammar checks. Microsoft Word: the standard for business documents, with Track Changes, comments, styles and Microsoft Editor (grammar, clarity and readability statistics). Grammarly: grammar, spelling, clarity and tone suggestions across browsers and apps, with plagiarism checking and AI features on paid plans. Hemingway Editor: highlights long and hard-to-read sentences, passive voice, adverbs and complex words, and shows a reading grade, much like the Writing Desk's style report. LanguageTool: an open-source grammar and style checker that supports many languages and British and American English. All of them make mistakes and miss context; use them as assistants, accept suggestions one by one, and keep the final decision yours.",
        table: {
          caption: "Writing tools and what each is best for.",
          headers: ["Tool", "Best for"],
          rows: [
            ["Google Docs", "Collaboration, comments, suggestion mode, version history"],
            ["Microsoft Word", "Business documents, Track Changes, styles, Microsoft Editor"],
            ["Grammarly", "Grammar, clarity and tone checks everywhere you write; plagiarism checks"],
            ["Hemingway Editor", "Readability: long sentences, passive voice, adverbs, reading grade"],
            ["LanguageTool", "Grammar and style in many languages; British or American English"],
          ],
        },
      },
      {
        id: "a-cw-m18-practical",
        title: "Practical: from AI draft to human-reviewed article",
        explain:
          "An AI assistant produced a draft for Kora. Do what a professional must: fact-check every claim against the client's verified sources, record your verdicts, then write the polished, human-reviewed article, accurate, specific and in Kora's voice, and a short, honest disclosure note for the client. Afterwards, repeat the exercise with your own AI tool and a real topic (see the module task).",
        writingLab: {
          task:
            "Fact-check: give each claim a verdict (exactly Verified, Incorrect or Fabricated) and an action of at least 4 words. Final article: a \"### \" headline, then 180 to 320 words with the 61% Kora report figure (named), the three-to-six-months guideline (with its source named), the correct 12% interest, no fabricated statistic or quotation, none of the tired phrases, and a closing call to action. Disclosure note: one or two sentences saying an AI produced a first draft and that you checked and rewrote it.",
          brief: AI_BRIEF,
          doc: AI_DOC,
          tests: [
            { label: "Five verdicts with actions", check: String.raw`return rows(section('Fact-check')).filter((c) => /^(verified|incorrect|fabricated)$/i.test(c[1] || '') && words(c[2]) >= 4).length === 5;`, fail: "Give every claim a verdict from the list and an action of four words or more." },
            { label: "Verdicts are right", check: String.raw`const r = rows(section('Fact-check')); const v = (k) => ((r.find((c) => new RegExp(k, 'i').test(c[0])) || [])[1] || '').toLowerCase(); return v('78%') === 'fabricated' && v('three to six') === 'verified' && v('adeyemi') === 'fabricated' && v('separate') === 'verified' && v('25%') === 'incorrect';`, fail: "Compare each claim with the verified sources: two are verified, one is incorrect and two were invented." },
            { label: "Article: headline, 180–320 words, a closing call to action", check: String.raw`const a = section('Final article') || ''; const h = headings(3).filter((x) => words(x) >= 4); const n = words(a); return h.length >= 1 && n >= 180 && n <= 320 && sentences(a).slice(-2).some((s) => isAction(s));`, fail: "Start with a \"### \" headline, write 180 to 320 words, and end with a call to action." },
            { label: "Article uses the verified facts, named", check: String.raw`const a = section('Final article') || ''; return /61\s?%/.test(a) && /kora savings report/i.test(a) && /three to six months/i.test(a) && /personal finance basics/i.test(a) && /12\s?%/.test(a);`, fail: "Use the 61% figure and three-to-six-months guideline with their sources named, and the correct 12% rate." },
            { label: "Nothing fabricated or incorrect remains, and no tired phrases", check: String.raw`const a = section('Final article') || ''; return !/78\s?%|adeyemi|central bank|CBN|25\s?%|industry-leading/i.test(a) && aiTells(a).length === 0;`, fail: "Remove the invented 78% and quotation, the wrong 25%, and every tired phrase." },
            { label: "An honest disclosure note", check: String.raw`const d = section('AI disclosure note') || ''; const n = sentences(d).length; return n >= 1 && n <= 2 && /\bAI\b|assistant/i.test(d) && /(check|verif)/i.test(d) && /(rewr|edit)/i.test(d);`, fail: "In one or two sentences, say an AI produced a first draft and that you checked and rewrote it." },
          ],
          solution: AI_DONE,
          hint: "Fact-check first, line by line against the sources. Then write the article from the sources, not from the AI draft.",
          successMessage: "Two invented claims and a wrong rate caught, and a trustworthy article delivered. This is the standard clients need from writers who use AI.",
        },
      },
    ],

    task: {
      title: "Module 18 practical: an AI-assisted article, done properly",
      intro: "Run the full workflow with a real AI tool and a real topic.",
      prompts: [
        "Choose a topic and client brief. Write a structured prompt (role, task, context, audience, format, constraints) and ask ChatGPT, Claude or another assistant for an outline and a first draft.",
        "Highlight every factual claim in the draft and verify each in an original, reliable source. Record what was verified, wrong or invented.",
        "Rewrite the article from your verified research in your own voice, adding specific examples or an interview the AI could not provide.",
        "Edit it with Hemingway Editor or Grammarly, accepting suggestions one at a time, and proofread the final version yourself.",
        "Write a short note comparing the AI draft and your final version: what AI saved you time on, and what only you could do.",
      ],
      closing: "Part Six begins in Module 19: turning your skills into income, with freelancing and the business of writing.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
