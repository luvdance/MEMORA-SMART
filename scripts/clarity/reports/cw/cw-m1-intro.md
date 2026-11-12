# Clarity audit · cw-m1-intro

31 tier A (wording only) · 33 tier B (read each) · 3 rejected by the checks

These edits are already in the module files (uncommitted). Review the diff in VS Code: stage what is good, discard what is not. The paid audit step that produced this report has been removed.

## Welcome: What You Will Write (cw-l1-welcome)

Lesson 1 is a well-organised course welcome. The main problems were very long sentences: a 67-word semicolon chain in the welcome and a 31-word sentence about the live bar. Several course terms were also used without explanation: brief, copy, portfolio, SEO, capstone and template. I split the long sentences, added short plain glosses where each term first appears, and replaced the figure 'the whole road'. Quoted examples, lab headings and answer correctness are unchanged.

### Tier B: read each one

- `cw-l1-welcome|-|intro` · Split a 28-word sentence and replaced the idiom 'runs on'. *(moved to tier B: 'the post' became 'a social media post', which adds a specific detail; it also changes 'runs on' to 'depends on', which is acceptable.)*
  - Before: Every organisation runs on writing: the website that brings customers, the post that starts a conversation, the email that gets a decision, the proposal that wins the contract.
  - After: Every organisation depends on writing. A website brings customers. A social media post starts a conversation. An email gets a decision. A proposal wins the contract.
- `cw-l1-welcome|a-cw-welcome|explain` · Split a 29-word sentence and glossed 'brief'.
  - Before: By the end of this course you will be able to take a brief from a client or an employer and turn it into writing that does its job.
  - After: By the end of this course, you will be able to take a brief from a client or an employer. A brief is the set of instructions and facts for a piece of writing. You will turn that brief into writing that does its job.
- `cw-l1-welcome|a-cw-welcome|explain` · Broke a 67-word semicolon chain into short sentences and glossed SEO and copy.
  - Before: You will write clear, correct English; research and write articles that people finish and search engines find; write websites and social media content; write copy that persuades people to buy, sign up or act, without lying to them; write professional emails, proposals, reports and user guides; edit other people's writing; use AI tools without letting them lower your standards; and price and deliver writing work for clients.
  - After: You will write clear, correct English. You will research and write articles that people read to the end and that search engines such as Google find. Writing so that search engines find your page is called SEO, which stands for search engine optimisation. You will write websites and social media content. You will write copy that persuades people to buy, sign up or act, without lying to them. Copy is writing that sells or persuades. You will write professional emails, proposals, reports and user guides. You will also learn to edit other people's writing, use AI tools without letting them lower your standards, and price and deliver writing work for clients.
- `cw-l1-welcome|a-cw-welcome|explain` · Split the sentence and glossed 'portfolio'.
  - Before: You will finish with a ten-piece portfolio for one business that shows employers and clients exactly what you can do.
  - After: At the end, you will have a portfolio of ten pieces of writing for one business. A portfolio is a collection of your best work. It shows employers and clients exactly what you can do.
- `cw-l1-welcome|a-cw-welcome-roadmap|explain` · Split two ideas and glossed 'capstone'.
  - Before: By Module 20 those pieces become your portfolio, and the capstone asks you to write ten of them for a single business.
  - After: By Module 20, these pieces become your portfolio. In the capstone, which is the final project of the course, you write ten pieces for a single business.
- `cw-l1-welcome|a-cw-welcome-desk|explain` · Fixed 'like a client would', split a sentence and glossed 'template'.
  - Before: The brief, when there is one, gives you the facts, like a client would. The editor is where you write: it starts with a template whose headings divide the piece into parts.
  - After: The brief, when there is one, gives you the facts, as a client would. The editor is where you write. It starts with a template: a ready-made outline whose headings divide the piece into parts.

### Jumps: new teaching needed (a person writes these)

- `cw-q1-03` · The quiz explanation and wrong-answer feedback say that "|" builds a table row, but the Writing Desk lesson teaches only three marks: heading, bullet and blank line. **Add:** Either add one sentence to the Writing Desk explanation about table rows starting with "|", or present table rows in the quiz as a mark the learner will meet later.
- `a-cw-welcome-desk` · The lab task says 'Under the last heading' but never names that heading. The learner must guess which heading in the template it means. **Add:** Name the third heading in the task text exactly as it appears in the template.

## Writing and Its Three Professions (cw-l2-disciplines)

The lesson is well structured, and its examples are clear. My edits split long sentences and semicolon chains, and replace idioms such as "earn its place" and "headlines that stop people". They also gloss terms the lesson uses without explaining: hybrid work, landing pages, features into benefits, call to action, conversions and mortgage. The main gap is a contradiction about whether content may contain a call to action.

### Tier B: read each one

- `cw-l2-disciplines|-|intro` · Glosses "disciplines" in plain words the first time it appears.
  - Before: and separates the three disciplines of this course.
  - After: and shows the difference between the three kinds of writing, or disciplines, that this course teaches.
- `cw-l2-disciplines|a-cw-workplace|explain` · Glosses remote and hybrid work and splits the sentence.
  - Before: Remote and hybrid work increased this, because many colleagues now meet each other mainly through text.
  - After: Remote work (working from home) and hybrid work (partly from home, partly in the office) have increased this. Many colleagues now meet each other mainly through text.
- `cw-l2-disciplines|a-cw-copywriting|explain` · Glosses "landing pages", which the lesson does not explain.
  - Before: sales pages, landing pages, promotional emails
  - After: sales pages, landing pages (web pages made for one offer), promotional emails
- `cw-l2-disciplines|a-cw-copywriting|explain` · Splits a long list, replaces two idioms, and glosses "features into benefits" and "call to action".
  - Before: A copywriter's core skills are understanding what the customer wants and fears, turning features into benefits, writing headlines that stop people, and asking clearly for the action. Copy is usually short and every word must earn its place.
  - After: A copywriter needs four core skills. First, understand what the customer wants and fears. Second, turn features into benefits: say what the product does for the reader, not only what it has. Third, write headlines that make people stop and read. Fourth, ask clearly for the action. This request is called a call to action, and it usually starts with a verb such as "Order". Copy is usually short, so every word must do useful work.
- `cw-l2-disciplines|a-cw-professional-writing|decision.scenario` · Glosses "mortgages" for readers who may not know the word.
  - Before: explains how mortgages work
  - After: explains how mortgages (bank loans to buy a house) work
- `cw-l2-disciplines|a-cw-three-compared|explain` · Breaks two semicolon chains into short sentences and glosses "conversions".
  - Before: Content informs and earns attention; copy persuades and asks for action; professional writing gets a task done. They also differ in how success is measured: content by readers, time on page and trust; copy by conversions such as sales and sign-ups; professional writing by whether the right thing happens.
  - After: Content informs and earns attention. Copy persuades and asks for action. Professional writing gets a task done. They also differ in how success is measured. Content is measured by the number of readers, the time they spend on the page and the trust it builds. Copy is measured by conversions: the number of readers who take the action, such as buying or signing up. Professional writing is measured by whether the right thing happens.

### Jumps: new teaching needed (a person writes these)

- `a-cw-three-compared` · The lab says Content must have no call to action. Quiz question cw-q2-05 says content often ends with a small call to action. The content explanation says only that content asks for "little or nothing". Learners get conflicting rules. **Add:** In the content-writing atom, add one or two sentences saying when content may end with a small call to action. Explain that the lab asks for none so that the difference from copy is clear.
- `a-cw-three-compared` · The lab asks for an email with a greeting, a clear request and a sign-off. The lesson shows one example email but never explains these three parts. **Add:** Add a short note in the professional-writing atom naming the parts of a simple email: a greeting, the key fact, one clear request with a deadline, and a sign-off with the writer's name.
- `a-cw-professional-writing` · The mortgage decision expects a mixed answer (content plus a copy button). Mixing disciplines is only taught in the next atom. **Add:** Move this decision after the comparison atom, or add one sentence before it saying that real pieces often mix disciplines.

### Used before taught

- **call to action** in `cw-l2-disciplines|a-cw-three-compared|writingLab.task` · Gloss added in the copywriting explanation, before the lab uses the term.
- **conversions** in `cw-l2-disciplines|a-cw-three-compared|explain` · Gloss added where the term first appears.
- **landing pages** in `cw-l2-disciplines|a-cw-copywriting|explain` · Short gloss added in brackets.
- **hybrid work** in `cw-l2-disciplines|a-cw-workplace|explain` · Gloss added for remote and hybrid work.
- **mortgage** in `cw-l2-disciplines|a-cw-professional-writing|decision.scenario` · Gloss added in brackets.

<details><summary>Rejected edits</summary>

- `cw-l2-disciplines|a-cw-three-compared|writingLab.task` · second read: The imperative 'End with' breaks the description pattern and makes it unclear that this is part of the copy description.

</details>

## How Professionals Write (cw-l3-process)

The lesson is well structured. The main problems are long sentences in the process and audience explanations and a 73-word lab instruction. Several terms are used without explanation: brief, outline, polish, jargon, reading grade and front-loaded. The edits split the long sentences, gloss those terms where they first appear, and replace a few figures of speech. The lab asks for reading grade 8 or below, but the lesson never explains what a reading grade is or how to check it.

### Tier B: read each one

- `cw-l3-process|a-cw-process|explain` · Split the sentence and glossed 'brief' and 'outline'.
  - Before: Planning: understand the brief, the reader and the purpose, gather facts, and outline the main points in order.
  - After: Planning: understand the brief (the instructions you are given for the piece), the reader and the purpose. Gather the facts. Then outline the main points: write a short list of them in the order you will cover them.
- `cw-l3-process|a-cw-process|explain` · Removed the semicolon and glossed 'polish'.
  - Before: Drafting: write the whole piece quickly from the outline without stopping to polish; a draft only has to exist.
  - After: Drafting: write the whole piece quickly from the outline. Do not stop to polish it (make small improvements). At this stage, a draft only has to exist.
- `cw-l3-process|a-cw-process|explain` · Split a 31-word sentence and glossed 'pass' and 'active'.
  - Before: Editing: improve it in passes, first the big things (is everything needed there, in the right order?), then the sentences (clear, short, active), then the details (spelling, punctuation, facts, names, numbers).
  - After: Editing: improve the draft in passes. A pass is one full reading with one focus. First check the big things: is everything there needed, and is it in the right order? Then check the sentences: are they clear, short and active (saying who does what)? Finally check the details: spelling, punctuation, facts, names and numbers.
- `cw-l3-process|a-cw-process|explain` · Named 'it' as the piece, split long sentences and explained the blank-page image. *(moved to tier B: 'Stare at a blank page' becomes 'cannot start', and 'often' is added.)*
  - Before: Publishing: format it for where it will appear, check it one last time in that place, and send or post it. Beginners try to do all four at once, which is why they stare at a blank page.
  - After: Publishing: format the piece for the place where it will appear. Check it one last time in that place. Then send or post it. Beginners try to do all four stages at once. That is why they often sit in front of a blank page and cannot start.
- `cw-l3-process|a-cw-audience-purpose|explain` · Split at the semicolon, clarified 'large clear facts' and glossed 'jargon'.
  - Before: A notice for older residents on WhatsApp needs short sentences, large clear facts and no jargon; a report for a finance director needs numbers first and a recommendation.
  - After: For example, a notice for older residents on WhatsApp needs short sentences, clear facts that are easy to see, and no jargon (special words that only experts know). A report for a finance director needs the numbers first, and then a recommendation.
- `cw-l3-process|a-cw-audience-purpose|writingLab.task` · Split a 73-word instruction into short steps and glossed 'reading grade'; the labels and numbers are unchanged.
  - Before: Using the brief, write the Audience (at least 8 words, specific), the Purpose (start with one of: inform, educate, persuade, instruct, request or entertain), a Key message of one sentence (25 words or fewer), and then the Draft: a WhatsApp notice of 50 to 120 words in plain English (reading grade 8 or below, no sentence over 25 words) that gives the date, the time, the place and that no appointment is needed.
  - After: Using the brief, write four sections. Audience: describe the readers in at least 8 words, and be specific. Purpose: start with one of these words: inform, educate, persuade, instruct, request or entertain. Key message: write one sentence of 25 words or fewer. Draft: write a WhatsApp notice of 50 to 120 words in plain English. Keep it at reading grade 8 or below (a reading grade is a score for how easy text is to read; a lower number is easier). Do not write any sentence over 25 words. The notice must give the date, the time and the place, and say that no appointment is needed.
- `cw-l3-process|cw-q3-02|explanation` · Split the sentence and made the reason clear. *(moved to tier B: 'Polish those sections' becomes 'polish the sentences', and an added reason changes what is taught.)*
  - Before: Structural changes can remove whole sections; polish those sections last.
  - After: Changes to the structure can remove whole sections. So polish the sentences last, when you know which sections will stay.
- `cw-l3-process|cw-q3-05|explanation` · Explained the jargon term 'front-loaded'.
  - Before: small screens and a general audience need plain, short, front-loaded text.
  - After: small screens and a general audience need plain, short text with the most important facts first.
- `cw-l3-process|cw-q3-05|whyWrong.c` · Made the effect of jargon concrete. *(moved to tier B: Adds an explanation that narrows 'excludes the audience' to readers who do not know the words.)*
  - Before: Jargon excludes the audience.
  - After: Jargon shuts out readers who do not know the special words.

### Jumps: new teaching needed (a person writes these)

- `a-cw-audience-purpose` · The lab requires plain English at reading grade 8 or below, but the lesson never explains what a reading grade is, how it is measured, or how to lower it. **Add:** Add a short teaching paragraph or example that shows how to lower a reading grade. It should show how to cut long sentences, swap hard words for everyday ones, and check the score in the editor.
- `a-cw-audience-purpose` · The lab asks for a WhatsApp notice, but the lesson shows no example notice and no structure for one, for example what to put first. **Add:** Add a short model notice on a different topic. Label its key message, its facts (date, time, place) and its call to act.
- `a-cw-process` · The lesson says to outline the main points, but it never shows what an outline looks like. **Add:** Add a three- or four-line example outline for a short piece.

### Used before taught

- **brief** in `cw-l3-process|a-cw-process|explain` · Glossed in the edit where it first appears.
- **outline** in `cw-l3-process|a-cw-process|explain` · Glossed in the edit where it first appears.
- **active (sentences)** in `cw-l3-process|a-cw-process|explain` · Glossed as 'saying who does what' in the editing sentence.
- **jargon** in `cw-l3-process|a-cw-audience-purpose|explain` · Glossed in the edit where it first appears.
- **reading grade** in `cw-l3-process|a-cw-audience-purpose|writingLab.task` · Glossed in the lab task edit; the lesson still needs teaching on how to check it.
- **plain English** in `cw-l3-process|a-cw-audience-purpose|writingLab.task` · Add a one-sentence definition (short sentences, everyday words, the reader understands on first reading) in the audience explanation.
- **front-loaded** in `cw-l3-process|cw-q3-05|explanation` · Replaced with 'with the most important facts first'.

<details><summary>Rejected edits</summary>

- `cw-l3-process|cw-q3-03|whyWrong.d` · second read: Specificity is not the same as specific facts, and 'what it gains is specific facts' is awkward English.

</details>

## Mistakes, Myths and Writing Careers (cw-l4-careers)

The main fixes are splitting the long list of mistakes and the long task sentences into short sentences. The edits also spell out PR, SEO, SOP and UX, and gloss jargon, swipe file, freelancer, in-house, brief and scarcity. Some idioms are replaced: "clears both away", "maps" and "Clarity is what experts sound like". Quiz options and quoted text are unchanged. Two small jumps are noted: rewriting before the lesson teaches how, and inform versus educate.

### Tier B: read each one

- `cw-l4-careers|-|task.prompts.4` · Glossed "swipe file" and split the sentence.
  - Before: Keep the collection: you will add to it as a swipe file of examples throughout the course.
  - After: Keep the collection. You will add to it throughout the course. It will become your swipe file: a collection of real examples that you keep and learn from.
- `cw-l4-careers|a-cw-mistakes|explain` · Turned a 45-word semicolon chain into short sentences, glossed jargon and misconceptions, and cut "just".
  - Before: They are: writing without knowing the reader or purpose; burying the main point at the end; long, tangled sentences; vague words instead of specific facts; jargon the reader does not know; missing information (what, when, where, how much); no clear next step; and not editing. The most common misconceptions are just as harmful.
  - After: Here are the eight most common mistakes. The writer does not know the reader or the purpose. The writer hides the main point at the end. The sentences are long and tangled. The words are vague instead of giving specific facts. The text uses jargon (special words of a trade) that the reader does not know. Information is missing: what, when, where or how much. There is no clear next step. The writer does not edit. The most common misconceptions (false beliefs) are equally harmful.
- `cw-l4-careers|a-cw-mistakes|explain` · Split at the semicolon and glossed "voice".
  - Before: AI produces drafts; judgement, facts and voice remain your job (Module 18).
  - After: AI produces drafts. Your judgement, the facts and your voice (your own way of writing) are still your job (Module 18).
- `cw-l4-careers|a-cw-mistakes|decision.options.a.why` · Replaced a figure of speech with a plain statement. *(moved to tier B: Changes the claim: clarity being how experts sound is not the same as experts writing clearly.)*
  - Before: Clarity is what experts sound like.
  - After: Experts write clearly.
- `cw-l4-careers|a-cw-careers|explain` · Glossed "freelancers".
  - Before: Good writers work in almost every sector, as employees or freelancers.
  - After: Good writers work in almost every sector, as employees or as freelancers (self-employed writers who work for several clients).
- `cw-l4-careers|a-cw-careers|explain` · Spelled out SEO and explained "ranks".
  - Before: SEO writers specialise in content that ranks in search engines.
  - After: SEO (search engine optimisation) writers specialise in content that appears high in the results of search engines such as Google.
- `cw-l4-careers|a-cw-careers|explain` · Split the sentence and glossed "in-house".
  - Before: Copywriters write ads, sales pages and campaigns, at agencies or in-house.
  - After: Copywriters write ads, sales pages and campaigns. They work at agencies or in-house (inside one company).
- `cw-l4-careers|a-cw-careers|explain` · Spelled out PR at first use.
  - Before: Communications officers and PR writers
  - After: Communications officers and PR (public relations) writers
- `cw-l4-careers|a-cw-careers|explain` · Spelled out and explained SOPs.
  - Before: documentation and SOPs for technology and industry.
  - After: documentation and SOPs (standard operating procedures: step-by-step instructions for a task) for technology and industry.
- `cw-l4-careers|a-cw-careers|explain` · Spelled out UX at first use.
  - Before: UX writers write the words inside apps and websites.
  - After: UX (user experience) writers write the words inside apps and websites.
- `cw-l4-careers|a-cw-m1-practical|writingLab.successMessage` · Gave the sentence a subject and glossed "brief".
  - Before: Five samples read like a professional: type, purpose, audience and the evidence for each. That habit is the first step of every brief you will ever take.
  - After: You read five samples like a professional. For each one, you found the type, purpose, audience and evidence. This habit is the first step of every brief (a client's instructions for a piece of writing) you will ever take.
- `cw-l4-careers|cw-q4-04|explanation` · Made a full sentence and glossed "scarcity".
  - Before: Scarcity, a saving, a deadline and an instruction to act: persuasive copy.
  - After: It shows scarcity (only a few are left), a saving, a deadline and an instruction to act. This is persuasive copy.

### Jumps: new teaching needed (a person writes these)

- `-` · The task asks the learner to rewrite the worst piece in under 100 words. No lesson so far has shown how to rewrite or shorten a text. **Add:** Add a short worked example before the task: show a weak piece and its rewrite, using the eight mistakes as a checklist.
- `a-cw-m1-practical` · The lab requires a purpose word for Sample C, but the lesson does not show how to choose between 'inform' and 'educate', which are close in meaning. **Add:** Add one sentence or a quick example that shows the difference between inform (give facts or news) and educate (teach how or why).

### Used before taught

- **swipe file** in `cw-l4-careers|-|task.prompts.4` · Gloss added in an edit.
- **jargon** in `cw-l4-careers|a-cw-mistakes|explain` · Gloss added in an edit.
- **voice** in `cw-l4-careers|a-cw-mistakes|explain` · Short gloss added; voice is taught fully in a later module.
- **SEO, PR, SOP, UX** in `cw-l4-careers|a-cw-careers|explain` · Abbreviations spelled out in edits.
- **brief** in `cw-l4-careers|a-cw-m1-practical|writingLab.successMessage` · Gloss added in an edit.
- **scarcity** in `cw-l4-careers|cw-q4-04|explanation` · Gloss added in an edit.

<details><summary>Rejected edits</summary>

- `cw-l4-careers|a-cw-m1-practical|explain` · second read: Lists four things to decide, but the fourth starts 'Then find', which breaks the parallel list and is confusing.

</details>

## New ledger terms

- **brief** → `a-cw-welcome`: The set of instructions and facts a client or employer gives you for a piece of writing.
- **copy** → `a-cw-welcome`: Writing whose purpose is to sell or persuade people to act.
- **seo** → `a-cw-welcome`: Search engine optimisation: writing so that search engines such as Google find your page.
- **portfolio** → `a-cw-welcome`: A collection of your best work that shows employers and clients what you can do.
- **content writing** → `a-cw-welcome-parts`: Writing that informs and educates the reader.
- **copywriting** → `a-cw-welcome-parts`: Writing that persuades the reader to buy, sign up or act.
- **capstone** → `a-cw-welcome-roadmap`: The final project of the course, where you write ten pieces for one business.
- **template** → `a-cw-welcome-desk`: A ready-made outline in the editor, with headings that divide the piece into parts.
- **reading grade** → `a-cw-welcome-desk`: An estimate of how hard a text is to read; a lower number means easier reading.
- **writing** → `a-cw-what-is-writing`: The deliberate arrangement of words so that a specific reader understands, feels or does something specific.
- **features into benefits** → `a-cw-copywriting`: Saying what a product does for the reader, not only what it has.
- **call to action** → `a-cw-copywriting`: A sentence that tells the reader what to do next, usually starting with a verb such as "Order".
- **professional writing** → `a-cw-professional-writing`: Writing that gets work done inside and between organisations, such as emails, reports and proposals.
- **conversion** → `a-cw-three-compared`: A reader who takes the action the copy asks for, such as buying or signing up.
- **writing process** → `a-cw-process`: The four stages professionals follow: plan, draft, edit, publish.
- **planning** → `a-cw-process`: The stage where you understand the brief, reader and purpose, gather facts and outline the main points.
- **drafting** → `a-cw-process`: The stage where you write the whole piece quickly from the outline without polishing.
- **editing in passes** → `a-cw-process`: Improving a draft in several readings: big things first, then sentences, then details.
- **publishing** → `a-cw-process`: The stage where you format the piece for where it will appear, check it there and send or post it.
- **outline** → `a-cw-process`: A short list of the main points in the order you will cover them.
- **7 cs of communication** → `a-cw-effective`: Seven qualities of effective writing: clear, concise, concrete, correct, coherent, complete, courteous.
- **concise** → `a-cw-effective`: Using no unnecessary words.
- **concrete** → `a-cw-effective`: Using specific facts, numbers and examples instead of vague claims.
- **coherent** → `a-cw-effective`: Ideas follow a logical order and connect to each other.
- **complete** → `a-cw-effective`: Answering every question the reader needs answered, such as what, when, where, how much and what next.
- **courteous** → `a-cw-effective`: Respecting the reader in tone and by not wasting their time.
- **audience** → `a-cw-audience-purpose`: The specific person or group you are writing for.
- **purpose** → `a-cw-audience-purpose`: What you want the reader to know, feel or do after reading.
- **key message** → `a-cw-audience-purpose`: The one sentence the reader must remember if they forget everything else.
- **jargon** → `a-cw-audience-purpose`: Special words that only experts know.
- **writing mistakes** → `a-cw-mistakes`: The common ways writing fails, such as hiding the main point or giving no clear next step.
- **misconception** → `a-cw-mistakes`: A false belief about writing, such as "longer is better".
- **freelancer** → `a-cw-careers`: A self-employed writer who works for several clients.
- **seo writer** → `a-cw-careers`: A writer who creates content that appears high in search engine results.
- **technical writer** → `a-cw-careers`: A writer of manuals, documentation and standard operating procedures.
- **ux writer** → `a-cw-careers`: A writer of the words inside apps and websites.
- **ghostwriter** → `a-cw-careers`: A writer who writes books, speeches or posts in someone else's name.
