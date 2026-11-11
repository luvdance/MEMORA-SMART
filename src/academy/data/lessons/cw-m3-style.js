/**
 * CONTENT WRITING · MODULE 3 · WRITING STYLES, TONE AND AUDIENCE AWARENESS
 *
 * Curriculum 3.1 – 3.10 and the practical 3.P. Registers and styles, brand
 * voice and tone, audience analysis and personas, age and background,
 * cultural sensitivity, readability (the Flesch scores the Writing Desk has
 * shown since Module 1 are explained here) and accessibility, storytelling,
 * and one message across platforms.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s3-style";

/* ── Lesson 9 lab: a voice chart and a rewrite ─────────────────────────── */
const VOICE_BRIEF = `**Kora** is a savings app for young professionals in Lagos and Abuja. Its founders describe the brand like this: "We are the smart friend who is good with money. We never lecture, we never use bank jargon, and we celebrate small wins."

This is the app's current notification, written by the bank's legal team:

> "Dear Valued Customer, please be informed that your automated savings instruction has been successfully executed. The sum of ₦5,000 has been credited to your Kora Vault. Thank you for banking with us."`;

const VOICE_DOC = `# Kora brand voice

## Voice chart
[Three lines in the form "- We are …, not …". For example: "- We are friendly, not silly".]

## Rewrite
[The savings notification in Kora's voice. Two or three short sentences.]
`;

const VOICE_DONE = `# Kora brand voice

## Voice chart
- We are friendly, not silly
- We are clear, not full of bank jargon
- We are encouraging, not preachy

## Rewrite
Nice one! You just saved ₦5,000, and it's safe in your Kora Vault. Small wins like this add up fast.
`;

/* ── Lesson 10 lab: a persona and a message for them ───────────────────── */
const PERSONA_BRIEF = `**MediCare Pharmacy**, Ibadan, is launching a medicine reminder service by SMS. Research with 30 customers found:

- Most users of the service will be adults aged 60 to 75 who take two or more medicines daily.
- Many read on basic phones with small screens. Some are helped by a grandchild.
- They trust the pharmacist and dislike "computer talk".
- Their biggest worry is forgetting a dose or taking a double dose.

The IT team wrote this message for them:

> "Leverage our new automated SMS-based adherence solution to optimise your medication compliance. Opt in via the USSD interface to activate notifications."`;

const PERSONA_DOC = `# Writing for MediCare's customers

## Persona
- Name:
- Age:
- Situation:
- Goal:
- Frustration:
- Where they read:

## Rewritten message
[The SMS invitation rewritten for this persona: under 50 words, plain English, one clear instruction.]
`;

const PERSONA_DONE = `# Writing for MediCare's customers

## Persona
- Name: Mama Adunni
- Age: 68
- Situation: retired teacher in Ibadan who takes medicine for blood pressure and diabetes
- Goal: take the right medicine at the right time every day without help
- Frustration: forgets whether she has already taken a dose and fears taking two
- Where they read: SMS on a basic phone, sometimes read aloud by her grandson

## Rewritten message
MediCare can send you a text when it is time to take your medicine. It is free. To start, dial *347*20# and press 1. Your pharmacist, Mr Ojo, can help you if you need it.
`;

/* ── Lesson 11 lab: one message, three styles ──────────────────────────── */
const STYLES_BRIEF = `**GreenRide**, an electric tricycle (keke) company in Kano, is cutting its fares by 20% from Monday 2 June because its charging costs have fallen. The new fare for a standard trip is ₦400 instead of ₦500. Riders can pay with cash or the GreenRide app.`;

const STYLES_DOC = `# GreenRide: one message, three styles

## Formal
[A short notice for GreenRide's business partners and the state transport authority. No contractions.]

## Conversational
[A post for GreenRide's WhatsApp channel, talking to riders as "you".]

## Promotional
[An advertisement of 60 words or fewer that ends with a call to action.]
`;

const STYLES_DONE = `# GreenRide: one message, three styles

## Formal
Dear Partners,

GreenRide will reduce its standard fare by 20%, from ₦500 to ₦400, with effect from Monday 2 June. The reduction reflects lower charging costs following our investment in solar charging stations. Riders may continue to pay in cash or through the GreenRide app. Please direct any questions to the operations office.

Yours faithfully,
GreenRide Management

## Conversational
Good news! From Monday 2 June, your usual GreenRide trip costs ₦400, not ₦500. Our charging costs went down, so we're passing the savings to you. You can still pay cash or use the app. See you on the road!

## Promotional
Same ride. Less money. From Monday 2 June, a GreenRide trip across Kano costs just ₦400. That's 20% off, every trip, every day, with quiet electric kekes and no fuel smell. Pay cash or tap the app. Flag down a GreenRide on Monday.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.1 – 3.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l9-registers",
    moduleId: "cw-m3-style",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3", "3.4"],
    title: "Styles, Voice and Tone",
    subtitle: "Formal to informal, academic to persuasive, and a brand's consistent voice",
    estimatedMinutes: 35,
    intro:
      "The same facts can be written a dozen ways, and the right way depends on who is reading and why. This lesson gives you the controls: register, style, voice and tone.",

    atoms: [
      {
        id: "a-cw-registers",
        title: "Formal, informal and semi-formal writing",
        explain:
          "Register is the level of formality. Formal writing is used for official letters, contracts, reports, legal and government documents, and first contact with senior people. It uses complete sentences, no contractions (do not, not don't), no slang, careful titles (Dear Dr Ahmed) and a restrained, impersonal tone. Informal writing is used with friends, in casual chats and in some social media: contractions, everyday words, short or incomplete sentences, emojis where the platform allows. Semi-formal writing is the workplace default today: most emails to colleagues and clients, newsletters and web content. It is polite and correct, uses contractions sparingly, addresses the reader as you, and sounds like a professional person talking. Choosing the wrong register is a common mistake both ways: a stiff formal email to a teammate sounds cold, and a casual message to a new client sounds careless.",
        table: {
          caption: "One request in three registers.",
          headers: ["Register", "Example", "Where it fits"],
          rows: [
            ["Formal", "I should be grateful if you would send the signed contract by Friday 10 May.", "Official letters, contracts, first contact with senior people"],
            ["Semi-formal", "Could you please send the signed contract by Friday?", "Most work email, clients you know, web content"],
            ["Informal", "Hey, can you send the contract over by Friday?", "Close colleagues, chat, casual social posts"],
          ],
        },
      },
      {
        id: "a-cw-styles",
        title: "Academic, conversational and persuasive writing",
        explain:
          "Style is the overall manner of a piece, shaped by its purpose. Academic writing aims to prove: it is objective, cautious (\"the results suggest\"), heavily referenced, precise with terms, and often long. Conversational writing aims to connect: it reads like speech, uses you and we, contractions, short sentences and questions, and is the default for blogs, social media and most web content. Persuasive writing aims to move the reader to believe or do something: it focuses on the reader's needs, uses benefits, evidence, emotion and a clear call to action. Professional writers move between them. A white paper may be academic in its method section and persuasive in its conclusion; a blog post is conversational but still makes an argument.",
        decision: {
          scenario: "A fintech company asks for a blog post for first-time investors aged 22 to 30 explaining what a treasury bill is.",
          question: "Which style fits best?",
          options: [
            { id: "a", text: "Conversational: talk to the reader as you, use plain words and short sentences, explain with everyday examples", why: "Right. Young first-time investors reading a blog need explanation that feels like a knowledgeable friend talking." },
            { id: "b", text: "Academic: formal, cautious and heavily referenced", whyWrong: "Correct for a research paper, but it would lose a beginner on a blog." },
            { id: "c", text: "Hard persuasion: urge every reader to invest today", whyWrong: "The brief is to explain. Pushing beginners to invest without understanding is also irresponsible." },
            { id: "d", text: "Informal slang throughout", whyWrong: "Too casual for financial content, where the reader needs to trust the writer." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-brand-voice",
        title: "Understanding brand voice",
        explain:
          "Brand voice is the consistent personality an organisation has in writing, whoever writes for it and wherever it appears. A bank might be calm, precise and reassuring; a snack brand playful and bold; a hospital warm, clear and serious. Voice is usually defined in a short voice chart: three or four traits, each written as \"We are X, not Y\", which marks the line not to cross (\"friendly, not silly\"; \"confident, not arrogant\"; \"simple, not childish\"). A good chart also lists words the brand uses and avoids, and an example of each trait. Writers working for a client must learn its voice before writing anything; if the client has no chart, a professional writer drafts one from their best existing material and asks the client to approve it.",
        samples: [
          { label: "No voice: could be any bank", tone: "bad", text: "Dear Valued Customer, please be informed that your transaction has been successfully executed." },
          { label: "A voice: \"the smart friend who is good with money\"", tone: "good", text: "Nice one! You just saved ₦5,000. Small wins like this add up fast." },
        ],
      },
      {
        id: "a-cw-tone",
        title: "Developing a consistent writing tone",
        explain:
          "Voice stays the same; tone changes with the situation, the way your personality stays the same but you speak differently at a wedding and a funeral. A brand with a friendly voice is cheerful when announcing a sale, calm and helpful when a payment fails, and serious and respectful when apologising for a data breach. Four dimensions describe tone: funny to serious, casual to formal, irreverent to respectful, and enthusiastic to matter-of-fact. Keep tone consistent within a piece: a cheerful opening followed by a cold legal paragraph jars the reader. Tone is created by word choice (\"Oops\" versus \"An error occurred\"), sentence length, punctuation (exclamation marks raise energy; use them rarely), contractions, and what you choose to say first.",
        writingLab: {
          task:
            "Write a three-line voice chart for Kora from the founders' description, each line in the form \"We are …, not …\". Then rewrite the legal team's notification in Kora's voice: two or three short sentences (40 words or fewer), talking to the reader as \"you\", with at least one contraction (such as it's or you're), no bank jargon (no \"valued customer\", \"executed\", \"credited\" or \"please be informed\"), and keeping the amount and the Kora Vault.",
          brief: VOICE_BRIEF,
          doc: VOICE_DOC,
          tests: [
            { label: "Three voice traits in the form \"We are …, not …\"", check: String.raw`return bullets(section('Voice chart')).filter((b) => /^we are \w+.*,\s*not\s+\w+/i.test(b)).length >= 3;`, fail: "Write three bullets such as \"- We are friendly, not silly\"." },
            { label: "Rewrite: 40 words or fewer, two or three sentences", check: "const r = section('Rewrite'); const n = sentences(r).length; return words(r) >= 10 && words(r) <= 40 && n >= 2 && n <= 3;", fail: "Keep it to two or three short sentences." },
            { label: "Talks to the reader and uses a contraction", check: String.raw`const r = section('Rewrite') || ''; return you(r) >= 1 && /\b\w+['’](s|re|ve|ll|d|t)\b/i.test(r);`, fail: "Use \"you\" or \"your\", and at least one contraction such as \"it's\" or \"you're\"." },
            { label: "No bank jargon", check: String.raw`return !/valued customer|executed|credited|please be informed|thank you for banking/i.test(section('Rewrite') || '');`, fail: "Remove the legal team's phrases: say what happened the way a friend would." },
            { label: "Keeps the facts: ₦5,000 and the Kora Vault", check: String.raw`const r = section('Rewrite') || ''; return /₦\s?5,?000/.test(r) && /vault/i.test(r);`, fail: "A new voice must not lose the facts: mention the ₦5,000 and the Vault." },
          ],
          solution: VOICE_DONE,
          hint: "Read the founders' description again and imagine that friend texting you about your savings.",
          successMessage: "Same facts, a recognisable personality. That is what clients mean when they ask for \"our voice\".",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.5 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l10-audience",
    moduleId: "cw-m3-style",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.5", "3.6", "3.7"],
    title: "Knowing Your Reader",
    subtitle: "Audience analysis, personas, age and background, and cultural sensitivity",
    estimatedMinutes: 35,
    intro:
      "In Module 1 you learned to name the audience. Now you learn to study it: to build a picture of a real reader so precise that every word choice becomes obvious.",

    atoms: [
      {
        id: "a-cw-personas",
        title: "Audience analysis and reader personas",
        explain:
          "Audience analysis answers five questions before you write. Who are they (age, job, location, language)? What do they already know about the topic, so what must you explain and what would bore them? What do they want or need from this piece? What worries or frustrates them? Where and how will they read it (phone or laptop, rushing or relaxed, alone or aloud to someone)? The answers come from the client's research, customer data, reviews, comments, sales and support staff, and conversations with real readers. A reader persona turns the answers into one realistic, named person you can picture while writing: \"Mama Adunni, 68, retired teacher in Ibadan, takes two medicines, reads SMS on a basic phone, fears taking a double dose.\" A persona must be based on evidence, not guesses; one good persona is worth more than ten vague \"target audiences\".",
        example:
          "Name: Tunde · Age: 27 · Situation: junior accountant in Lagos, first salary job\nGoal: start saving without giving up his social life\nFrustration: bank apps full of jargon and hidden charges\nWhere he reads: phone, on the bus, in short bursts",
      },
      {
        id: "a-cw-age-background",
        title: "Writing for different age groups and professional backgrounds",
        explain:
          "Age affects vocabulary, references, platforms and pace. Teenagers and young adults read on phones, scan fast, respond to direct, energetic writing and see through anything that tries too hard to sound young. Middle-aged professionals are short of time: get to the point, show the benefit, respect their experience. Older readers often prefer complete sentences, clear instructions, slightly more formality, larger formatting and no unexplained technology terms. Children need short sentences, familiar words and concrete examples. Professional background matters as much: an engineer wants specifications and numbers, a lawyer wants precision, a senior executive wants the conclusion and its cost in the first lines, a general reader wants the meaning without the jargon. When writing for a mixed audience, write for the least expert reader who matters, and explain terms in passing (\"a treasury bill, a short loan you make to the government\").",
        decision: {
          scenario: "You are writing about a new hospital booking app. The same news goes to the hospital's board of directors and to patients over 65.",
          question: "What is the best approach?",
          options: [
            { id: "a", text: "Two versions: the board's leads with cost, risk and results; the patients' explains step by step how to book, in plain words", why: "Right. Different readers need different first sentences, vocabulary and detail, even about the same news." },
            { id: "b", text: "One technical version, because the board are the most important readers", whyWrong: "Patients would not understand it, and they are the people who must use the app." },
            { id: "c", text: "One simple version for everyone, with no numbers", whyWrong: "The board needs costs and expected results to make decisions." },
            { id: "d", text: "One version with a glossary of every term at the end", whyWrong: "A glossary does not fix a piece written for the wrong reader." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-cultural",
        title: "Cultural sensitivity in communication",
        explain:
          "Readers come from different religions, ethnic groups, regions, genders, ages, abilities and countries, and careless words can exclude or offend them. Practical rules: avoid stereotypes about any group, even \"positive\" ones; use inclusive language (staff, chair, police officer, they for an unknown person rather than assuming he); describe people as they describe themselves and mention ethnicity, religion or disability only when relevant; be careful with humour, idioms and slang, which rarely travel across cultures; respect religious and national calendars when timing messages (no festive food promotion during a fasting month without care); check that images and examples reflect your real audience; and remember that colours, gestures and numbers carry different meanings in different cultures. For international readers, avoid local idioms (\"the matter is above my pay grade\", \"NEPA took light\") or explain them. When unsure, ask someone from that community to read your draft.",
        mistake: "Writing \"Each manager should submit his report\" for a mixed team. Use \"their report\", or make it plural: \"Managers should submit their reports.\"",
        writingLab: {
          task:
            "Build a persona from MediCare's research, filling every field (Name, Age, Situation, Goal, Frustration, Where they read) with a specific answer. The Age must be between 60 and 75, as the research says. Then rewrite the IT team's message for that persona: under 50 words, reading grade 6 or below, with one clear instruction that starts with a verb (such as \"Dial\" or \"Reply\"), and none of the jargon: leverage, optimise, adherence, compliance, solution, interface, opt in.",
          brief: PERSONA_BRIEF,
          doc: PERSONA_DOC,
          tests: [
            { label: "Every persona field filled with a specific answer", check: String.raw`const s = section('Persona'); return ['Name', 'Age', 'Situation', 'Goal', 'Frustration', 'Where they read'].every((f) => words(field(s, f) || '') >= (f === 'Age' || f === 'Name' ? 1 : 4));`, fail: "Fill every field after its colon. Situation, Goal, Frustration and Where they read need at least four words each." },
            { label: "The persona's age matches the research (60 to 75)", check: "const a = num(field(section('Persona'), 'Age')); return a >= 60 && a <= 75;", fail: "The research says most users are 60 to 75. Personas follow evidence." },
            { label: "Message: under 50 words, grade 6 or below", check: "const m = section('Rewritten message'); return words(m) >= 15 && words(m) < 50 && grade(m) <= 6;", fail: "Shorter sentences and everyday words: this reader is on a small screen and dislikes \"computer talk\"." },
            { label: "One clear instruction that starts with a verb", check: "return sentences(section('Rewritten message')).some((s) => isAction(s.replace(/^(to start|to begin|to join),?\\s*/i, '')));", fail: "Tell the reader exactly what to do, starting with a verb: \"Dial…\", \"Reply…\", \"Ask…\"." },
            { label: "No jargon", check: String.raw`return !/leverage|optimi[sz]e|adherence|compliance|solution|interface|opt in|opt-in|notifications?/i.test(section('Rewritten message') || '');`, fail: "Remove every word on the list. Say what the service does in words Mama Adunni uses." },
          ],
          solution: PERSONA_DONE,
          hint: "Write the persona first, then read your message aloud as if to her. Any word she would ask about must go.",
          successMessage: "A real reader, pictured from evidence, and a message she can act on. That is audience awareness.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.8 – 3.10 · PRACTICAL 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l11-readability",
    moduleId: "cw-m3-style",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.8", "3.9", "3.10", "3.P"],
    title: "Readable, Memorable, Everywhere",
    subtitle: "Readability and accessibility, storytelling, and one message for many platforms",
    estimatedMinutes: 40,
    intro:
      "Since Module 1 the Writing Desk has shown you a reading grade and a reading ease score. Here is what they measure, how to write for every reader including those with disabilities, how stories make messages stick, and how to adapt one message to every platform.",

    atoms: [
      {
        id: "a-cw-readability",
        title: "Clarity, readability and accessibility",
        explain:
          "Readability formulas estimate how hard a text is from two things a computer can count: sentence length and word length (in syllables). The Flesch Reading Ease score runs from 0 to 100, higher being easier: 60 to 70 is plain English, 30 or below is academic. The Flesch–Kincaid grade level converts the same counts into the years of schooling a reader needs: 7 to 9 suits most public writing, and even experts read grade 8 faster than grade 14. The Writing Desk, Hemingway Editor and Microsoft Word all show these scores. They are guides, not judges: short words can still be confusing and a technical term may be necessary. Accessibility goes further, so that everyone, including people with low vision, dyslexia, cognitive disabilities or using screen readers, can read your writing: use headings to structure content, descriptive link text (\"Download the price list\", never \"click here\"), short paragraphs, bullet points for lists, plain language, numerals for numbers, alternative text for images, and no meaning carried by colour alone.",
        table: {
          caption: "Reading the Writing Desk's scores.",
          headers: ["Flesch Reading Ease", "Grade level", "Feels like"],
          rows: [
            ["90–100", "5 or below", "Very easy: children's books, SMS for everyone"],
            ["70–90", "6–7", "Easy: social media, consumer apps"],
            ["60–70", "8–9", "Plain English: news, most web and business writing"],
            ["50–60", "10–12", "Fairly hard: specialist magazines, reports"],
            ["30–50", "13–16", "Hard: academic and legal writing"],
            ["0–30", "17+", "Very hard: research papers, contracts"],
          ],
        },
        decision: {
          scenario: "A government health notice scores grade 15 and reading ease 28.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Rewrite with shorter sentences and everyday words until it is around grade 8, because it must reach everyone", why: "Right. Public information must reach readers of every education level. Long sentences and long words are the two levers." },
            { id: "b", text: "Leave it: health information should sound expert", whyWrong: "If people cannot understand a health notice, it fails at its only job." },
            { id: "c", text: "Add more technical terms so it is precise", whyWrong: "That pushes the grade higher and excludes more readers." },
            { id: "d", text: "Make the font bigger", whyWrong: "Bigger type helps people with low vision, but it does not make complex sentences easier to understand." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-storytelling",
        title: "Emotional connection and storytelling",
        explain:
          "People remember stories far longer than facts, because a story gives facts a person, a problem and a change. The simplest story structure has three parts: a character the reader can relate to, a problem or desire, and a resolution that shows the change. \"Our lamps last 12 hours\" is a fact; \"When the power went off during her final exams, Hauwa studied for six hours by a SunBox lamp, and passed\" is a story the reader feels. Emotional connection comes from specific, sensory detail (the sound of the generator, the heat of the room), honesty, and showing rather than telling (show the relief instead of writing \"she was relieved\"). Use emotion responsibly: it should help the reader understand what is true, not manipulate them into something against their interest. Storytelling returns in depth in Modules 7, 8 and 10.",
        samples: [
          { label: "Fact", tone: "bad", text: "Our solar lamp provides up to 12 hours of illumination on a single charge." },
          { label: "Story", tone: "good", text: "The light went off two nights before Hauwa's final exams. She charged her SunBox in the afternoon sun and studied until midnight. She passed every paper." },
        ],
      },
      {
        id: "a-cw-multiplatform",
        title: "Adapting one message for multiple platforms",
        explain:
          "One message usually has to travel: a fare cut might go out as a formal notice to partners, a WhatsApp post, an Instagram caption, a radio line and a press release. Keep the core facts identical everywhere (dates, prices, names) and change everything else to suit the platform: length (an X post has 280 characters, an email can be longer), register (formal for partners, conversational for customers), structure (a notice leads with the fact; an advert leads with the hook), and the call to action (\"Please direct questions to…\" versus \"Book your ride now\"). Before adapting, write the core message in one sentence. Then for each platform ask: who reads here, in what mood, on what device, and what should they do next?",
      },
      {
        id: "a-cw-m3-practical",
        title: "Practical: one message in three styles",
        explain:
          "Write GreenRide's fare cut three ways. Formal: a notice to business partners and the regulator: a greeting, no contractions, the facts, the reason, and a formal sign-off. Conversational: a WhatsApp post to riders, warm and direct, using you and contractions, grade 7 or below. Promotional: an advertisement that leads with a benefit and ends with a call to action. All three must keep the same facts: 20%, ₦400, ₦500 and Monday 2 June.",
        writingLab: {
          task:
            "Formal: at least 40 words, a greeting starting \"Dear\", a sign-off, no contractions and no exclamation marks. Conversational: 30 to 80 words, at least two uses of \"you\" or \"your\", at least one contraction, reading grade 7 or below. Promotional: 60 words or fewer, talks to the reader, and ends with a call to action that starts with a verb. All three must include ₦400 and Monday 2 June, and must be genuinely different pieces (not one text reused).",
          brief: STYLES_BRIEF,
          doc: STYLES_DOC,
          tests: [
            { label: "Formal: greeting, sign-off, at least 40 words", check: String.raw`const f = section('Formal') || ''; return /^Dear\b/m.test(f) && /(yours (faithfully|sincerely)|kind regards|regards)/i.test(f) && words(f) >= 40;`, fail: "Open with \"Dear …,\", close with \"Yours faithfully,\" or \"Kind regards,\" and write at least 40 words." },
            { label: "Formal: no contractions, no exclamation marks", check: String.raw`const f = section('Formal') || ''; return !/\b\w+['’](s|re|ve|ll|d|t)\b/i.test(f.replace(/GreenRide['’]s/g, '')) && !/!/.test(f);`, fail: "Formal writing uses \"we will\", not \"we'll\", and saves exclamation marks for nothing." },
            { label: "Conversational: 30 to 80 words, \"you\" twice, a contraction, grade 7 or below", check: String.raw`const c = section('Conversational') || ''; return words(c) >= 30 && words(c) <= 80 && you(c) >= 2 && /\b\w+['’](s|re|ve|ll|d|t)\b/i.test(c) && grade(c) <= 7;`, fail: "Talk to the rider: \"your trip\", \"we're passing the savings to you\", short sentences." },
            { label: "Promotional: 60 words or fewer, ending with a call to action that starts with a verb", check: "const p = section('Promotional'); return words(p) >= 15 && words(p) <= 60 && isAction(lastSentence(p));", fail: "Lead with the benefit and end with an instruction such as \"Flag down a GreenRide on Monday.\"" },
            { label: "Every version keeps ₦400 and Monday 2 June", check: String.raw`return ['Formal', 'Conversational', 'Promotional'].every((h) => /₦\s?400/.test(section(h) || '') && /2 June/i.test(section(h) || ''));`, fail: "Core facts never change between platforms. Each version needs ₦400 and Monday 2 June." },
            { label: "Three genuinely different pieces", check: "const f = section('Formal'), c = section('Conversational'), p = section('Promotional'); return overlap(c, f) < 0.4 && overlap(p, f) < 0.4 && overlap(p, c) < 0.4;", fail: "Write each version fresh for its reader rather than editing one version into the next." },
          ],
          solution: STYLES_DONE,
          hint: "Write the core message in one sentence first. Then picture who reads each version, and where.",
          successMessage: "One set of facts, three readers, three styles. You can now control register, tone and style on purpose.",
        },
      },
    ],

    task: {
      title: "Module 3 practical: a style and audience file",
      intro: "Make this a document you will reuse with every client.",
      prompts: [
        "Choose a real local business you know. Write a voice chart for it: three or four \"We are …, not …\" traits, five words it uses and five it avoids.",
        "Talk to three of its customers (or people like them) and build one evidence-based persona.",
        "Write one piece of news for that business in formal, conversational and promotional styles, keeping the facts identical.",
        "Check each version's reading grade on the Writing Desk or Hemingway Editor and adjust it to suit its reader.",
        "Ask someone from the target audience to read the conversational version and tell you, in their words, what it says. Fix whatever they got wrong.",
      ],
      closing: "Part Two begins in Module 4: content writing, starting with research, briefs and structure.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
