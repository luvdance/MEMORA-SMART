/**
 * CONTENT WRITING · MODULE 16 · CV, COVER LETTER AND CAREER COMMUNICATION
 *
 * Curriculum 16.1 – 16.14 and the practical 16.P. Modern CVs, structures and
 * formats, professional summaries, experience, achievement bullets,
 * measurable results, tailoring, cover letters, biographies, LinkedIn,
 * personal branding, application emails, networking messages and
 * statements of interest; then a CV, a tailored cover letter and a
 * LinkedIn About section.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s16-career";

/* The candidate used throughout the module. */
const AMARA = `**Amara Obi** (Enugu, open to Lagos hybrid work; amara.obi.writes@gmail.example; 0806 123 4567)

- BSc Mass Communication, University of Nigeria, Nsukka, 2024: Second Class Upper.
- NYSC, 2024–2025, Coal City FM, Enugu: wrote news scripts for the 7am bulletin; ran the station's Instagram and Facebook pages; followers grew from 2,000 to 9,500 in 10 months after she started a daily "Enugu in 60 seconds" video series; trained 3 interns to write social captions.
- Freelance content writer, 2024–present: 45 blog articles for 6 clients (fintech, food delivery, a dental clinic); one article for a dental clinic reached position 1 on Google for "teeth whitening in Enugu"; that clinic's website enquiries doubled in 3 months.
- Skills: SEO writing, WordPress, Canva, Google Search Console, social media management, interviewing, editing.
- Completed Memora Smart Academy's Content Writing, Copywriting & Professional Communication course (2026).`;

const JOB_AD = `**Job advert: Content Writer, Brightlane Digital (Lagos, hybrid)**

Brightlane Digital is a marketing agency for fintech and e-commerce brands. We are looking for a Content Writer with 1–2 years' experience to write SEO blog articles, social media content and email newsletters for our clients.

You will:
- Research and write SEO-optimised articles that rank
- Plan and write social media content for Instagram and LinkedIn
- Work with designers using Canva and publish on WordPress

You have:
- Experience writing for fintech or e-commerce brands
- Results you can show: traffic, rankings or engagement
- Strong editing skills and attention to detail

Apply by 20 June to careers@brightlane.example with your CV and a cover letter.`;

/* ── Lesson 59 lab: a profile and an experience entry ──────────────────── */
const PROFILE_DOC = `# CV: profile and experience

## Professional summary
[Three or four lines: who you are, your strongest evidence, what you offer this employer.]

## Experience: Coal City FM
- Role, organisation, place, dates:
[Then three bullet points.]
`;

const PROFILE_DONE = `# CV: profile and experience

## Professional summary
Content writer with 2 years' experience writing SEO articles and social media content for fintech, food delivery and healthcare brands. My article for an Enugu dental clinic reached position 1 on Google and helped double its website enquiries in 3 months. Skilled in WordPress, Canva and Google Search Console, and looking to bring results-driven content to Brightlane Digital's clients.

## Experience: Coal City FM
- Role, organisation, place, dates: Social Media and News Writer (NYSC), Coal City FM, Enugu, 2024–2025
- Grew the station's Instagram and Facebook following from 2,000 to 9,500 in 10 months by launching a daily "Enugu in 60 seconds" video series
- Wrote news scripts for the 7am bulletin every weekday
- Trained 3 interns to write social media captions in the station's voice
`;

/* ── Lesson 60 lab: achievement bullets and tailoring ──────────────────── */
const BULLETS_BRIEF = `${AMARA}

**Amara's current freelance bullets (duties, not achievements):**

- Responsible for writing blog articles for clients
- Did SEO for some articles
- Handled social media captions
- Worked with clients on what they wanted

${JOB_AD}`;

const BULLETS_DOC = `# Tailored freelance experience

## Keywords from the job advert
[At least five keywords or phrases from the advert, one per "- " line.]

## Freelance Content Writer, 2024–present
[Four achievement bullets: action verb + what you did + measurable result.]
`;

const BULLETS_DONE = `# Tailored freelance experience

## Keywords from the job advert
- SEO-optimised articles
- fintech
- social media content
- WordPress
- Canva
- results: traffic, rankings or engagement

## Freelance Content Writer, 2024–present
- Wrote 45 SEO-optimised blog articles for 6 clients in fintech, food delivery and healthcare
- Ranked a dental clinic's article at position 1 on Google for "teeth whitening in Enugu", helping double its website enquiries in 3 months
- Published and formatted articles in WordPress, with featured images designed in Canva
- Interviewed experts at all 6 clients, in fintech, food delivery and healthcare, to research each article
`;

/* ── Lesson 61 lab: bio and LinkedIn headline ──────────────────────────── */
const BIO_DOC = `# Personal brand

## LinkedIn headline
[Up to 220 characters.]

## Professional bio
[80 to 130 words, third person, for a conference programme or agency website.]
`;

const BIO_DONE = `# Personal brand

## LinkedIn headline
Content Writer | SEO articles and social media content for fintech and healthcare brands | Helped a clinic double its enquiries

## Professional bio
Amara Obi is a content writer who helps fintech, food delivery and healthcare brands turn their expertise into articles and social media content people read and act on. Since 2024 she has written 45 SEO articles for 6 clients, including one that reached the top position on Google for its keyword and helped a dental clinic double its website enquiries. During her national service at Coal City FM in Enugu, she grew the station's social media following from 2,000 to 9,500 in 10 months. Amara holds a degree in Mass Communication from the University of Nigeria, Nsukka.
`;

/* ── Lesson 62 lab: the practical ──────────────────────────────────────── */
const PRAC_DOC = `# Amara Obi: application pack

## CV
### Contact
### Professional summary
### Experience
### Education
### Skills

## Cover letter

## LinkedIn About
`;

const PRAC_DONE = `# Amara Obi: application pack

## CV
### Contact
Amara Obi · Enugu (open to Lagos hybrid) · 0806 123 4567 · amara.obi.writes@gmail.example

### Professional summary
Content writer with 2 years' experience writing SEO articles and social media content for fintech, food delivery and healthcare brands. My article for a dental clinic reached position 1 on Google and helped double its enquiries in 3 months. Skilled in WordPress, Canva and Google Search Console.

### Experience
**Freelance Content Writer, 2024–present**
- Wrote 45 SEO-optimised blog articles for 6 clients in fintech, food delivery and healthcare
- Ranked a dental clinic's article at position 1 on Google for "teeth whitening in Enugu", helping double its website enquiries in 3 months
- Published and formatted articles in WordPress, with images designed in Canva

**Social Media and News Writer (NYSC), Coal City FM, Enugu, 2024–2025**
- Grew Instagram and Facebook followers from 2,000 to 9,500 in 10 months with a daily video series
- Wrote news scripts for the 7am bulletin every weekday
- Trained 3 interns to write social media captions

### Education
BSc Mass Communication, University of Nigeria, Nsukka, 2024: Second Class Upper
Content Writing, Copywriting & Professional Communication, Memora Smart Academy, 2026

### Skills
SEO writing · WordPress · Canva · Google Search Console · Social media management · Editing · Interviewing

## Cover letter
Dear Hiring Manager,

I am applying for the Content Writer role at Brightlane Digital. I write SEO articles and social media content that get results, and I would love to do that for your fintech and e-commerce clients.

As a freelance writer since 2024, I have written 45 SEO-optimised articles for 6 clients, including a fintech company. One article I wrote for a dental clinic in Enugu reached position 1 on Google for its keyword and helped the clinic double its website enquiries in three months. I research every piece carefully, publish in WordPress and design simple visuals in Canva, which matches the way your team works.

During my national service at Coal City FM, I grew the station's social media following from 2,000 to 9,500 in ten months by launching a daily video series. That taught me to plan content around what an audience actually wants, and to measure whether it works.

I am particularly drawn to Brightlane because you work with fintech and e-commerce brands, where clear and trustworthy content decides whether a nervous reader becomes a customer. I would enjoy doing that work alongside your designers and strategists, and learning from a team that measures every piece.

I would welcome the chance to discuss how I could help Brightlane's clients grow. Thank you for considering my application.

Yours faithfully,
Amara Obi

## LinkedIn About
I help brands turn what they know into content people read, share and act on.

I am a content writer specialising in SEO articles and social media for fintech, food delivery and healthcare brands. Since 2024 I have written 45 articles for 6 clients. One of them, for a dental clinic in Enugu, reached the top of Google for its keyword and helped double the clinic's enquiries in three months.

Before freelancing, I ran social media for Coal City FM during my national service and grew its following from 2,000 to 9,500 in ten months with a daily video series.

I work in WordPress, Canva and Google Search Console, and I love interviewing experts and customers to find the story behind a brand.

I am open to content writing roles and freelance projects. Send me a message, and let's talk about what your audience needs to hear.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 16.1 – 16.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l59-cv",
    moduleId: "cw-m16-career",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3", "16.4"],
    title: "The Modern CV",
    subtitle: "What CVs are for now, structures and formats, profiles and experience",
    estimatedMinutes: 40,
    intro:
      "Your CV is the most important piece of persuasive writing you will ever write for yourself. Everything you have learned applies: know the reader, lead with value, prove every claim.",

    atoms: [
      {
        id: "a-cw-modern-cv",
        title: "Understanding modern CV writing",
        explain:
          "A CV (curriculum vitae; in the US often called a résumé) is a marketing document whose only job is to get you an interview. Recruiters often scan a CV for a few seconds first, and many employers use an applicant tracking system (ATS), software that stores applications and lets recruiters search and filter them by keywords, so the CV must work for both a fast human scan and a keyword search. Modern CVs are short (one page for early-career candidates, two at most for most others), focused on evidence of what you achieved rather than lists of duties, tailored to each job, and easy to read: clear headings, consistent formatting, no tables or text boxes that software cannot read, and saved as PDF unless the employer asks for Word. Leave out what does not help you or what employers should not consider: a photo (unless requested), date of birth, marital status, religion, state of origin and full home address.",
      },
      {
        id: "a-cw-cv-formats",
        title: "CV structures and formats",
        explain:
          "There are three main formats. Reverse chronological: experience listed from most recent backwards; the standard and the one recruiters and ATS software prefer, ideal when you have relevant experience. Skills-based (functional): grouped by skills with experience summarised; useful for career changers or people with gaps, but some recruiters distrust it, so use with care. Hybrid (combination): a strong profile and key skills section at the top, followed by reverse-chronological experience; good for early-career candidates with freelance, NYSC and project work. A typical order: name and contact details (phone, professional email, city, LinkedIn or portfolio link); professional summary; experience (or projects for new graduates); education; skills; and optional sections such as certifications, volunteering or publications. Put your strongest section first after the summary.",
        table: {
          caption: "CV formats compared.",
          headers: ["Format", "Best for", "Watch out for"],
          rows: [
            ["Reverse chronological", "Steady, relevant experience", "Gaps are visible"],
            ["Skills-based", "Career changers, gaps", "Some recruiters distrust it"],
            ["Hybrid", "Early careers with varied experience", "Keep it to one page"],
          ],
        },
        decision: {
          scenario: "A graduate with no full-time job lists NYSC at a radio station only under \"Other information\".",
          question: "What should they do?",
          options: [
            { id: "a", text: "Move it into Experience with a proper title line and achievement bullets", why: "Right. NYSC, internships and freelance work are real experience when described with evidence." },
            { id: "b", text: "Remove it: NYSC is not real work", whyWrong: "It often contains the candidate's best evidence." },
            { id: "c", text: "Mention it only in the cover letter", whyWrong: "Recruiters scanning the CV would miss it." },
            { id: "d", text: "List it under Hobbies", whyWrong: "It is professional experience, not a hobby." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-cv-summary",
        title: "Writing professional summaries",
        explain:
          "The professional summary (or profile) is three or four lines at the top that tell the employer who you are, your strongest evidence and what you offer them. It replaces the old \"career objective\", which talked about what you want. Formula: your professional identity and level (\"Content writer with 2 years' experience…\"); your specialism and the kinds of employer you have served; your single most impressive, measurable achievement; your key tools or skills; and, optionally, the value you bring to this employer. Avoid empty phrases every candidate uses: \"hardworking\", \"team player\", \"results-oriented\", \"seeking a challenging role\". Write it in a consistent style: either without pronouns (\"Content writer with…\") or in the first person; the third person sounds odd on your own CV.",
        samples: [
          { label: "Empty", tone: "bad", text: "Hardworking and results-oriented team player seeking a challenging role in a reputable organisation where I can grow." },
          { label: "Evidence", tone: "good", text: "Content writer with 2 years' experience writing SEO articles for fintech and healthcare brands. My article for a dental clinic reached position 1 on Google and helped double its enquiries in 3 months." },
        ],
      },
      {
        id: "a-cw-describing-experience",
        title: "Describing work experience effectively",
        explain:
          "Each experience entry starts with a line giving your job title, the organisation, the location and the dates (month and year, or year only, consistently). Under it, three to six bullet points describe what you achieved, most impressive first. Include NYSC, internships, freelance work, volunteering and significant student roles: they are real experience when described with evidence. Use the past tense for past roles and the present for your current one. Give enough context for a stranger to understand the scale (\"the station's Instagram and Facebook pages\"). Spend most words on the experience most relevant to the job you are applying for, and fewer on the rest.",
        writingLab: {
          task:
            "From Amara's facts, write her professional summary (three or four sentences, 45 to 90 words) with her identity and experience, at least one measurable achievement, two or more tools, and none of the empty phrases (hardworking, team player, results-oriented, seeking a challenging role). Then write her Coal City FM entry: a title line with role, organisation, place and dates, and three bullets, the strongest first, in the past tense.",
          brief: `${AMARA}\n\n${JOB_AD}`,
          doc: PROFILE_DOC,
          tests: [
            { label: "Summary: three or four sentences, 45 to 90 words", check: "const s = section('Professional summary'); const n = sentences(s).length; return n >= 3 && n <= 4 && words(s) >= 45 && words(s) <= 90;", fail: "Write three or four sentences, 45 to 90 words." },
            { label: "Summary: identity, a measurable achievement and tools", check: String.raw`const s = section('Professional summary') || ''; return /content writer/i.test(s) && /(position 1|double|9,?500|45 )/i.test(s) && ['wordpress', 'canva', 'search console', 'seo'].filter((t) => s.toLowerCase().includes(t)).length >= 2;`, fail: "Say who she is, include one measurable result, and name at least two tools or skills." },
            { label: "No empty phrases", check: String.raw`return !/(hard-?working|team player|results-oriented|challenging role|go-getter|self-motivated)/i.test(section('Professional summary') || '');`, fail: "Remove phrases every candidate uses; replace them with evidence." },
            { label: "Title line with role, organisation, place and dates", check: String.raw`const t = field(section('Experience: Coal City FM'), 'Role, organisation, place, dates') || ''; return /coal city fm/i.test(t) && /enugu/i.test(t) && /2024/.test(t) && words(t) >= 6;`, fail: "Fill the title line: role, Coal City FM, Enugu, 2024–2025." },
            { label: "Three bullets, the follower growth first", check: String.raw`const b = bullets(section('Experience: Coal City FM')).filter((x) => !/^role, organisation/i.test(x)); return b.length >= 3 && /2,?000/.test(b[0]) && /9,?500/.test(b[0]);`, fail: "Write three bullets and lead with the strongest: the growth from 2,000 to 9,500 followers." },
          ],
          solution: PROFILE_DONE,
          hint: "Find Amara's single most impressive number first. The summary is built around it.",
          successMessage: "A summary a recruiter can't skim past, and an NYSC role that reads as the real experience it was.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 16.5 – 16.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l60-achievements",
    moduleId: "cw-m16-career",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.5", "16.6", "16.7"],
    title: "Achievements, Numbers and Tailoring",
    subtitle: "Bullets that prove value, measurable results, and a CV for each job",
    estimatedMinutes: 40,
    intro:
      "Two candidates with the same job title can have completely different CVs: one lists duties, the other proves results. This lesson turns duties into achievements and shows how to tailor a CV to each advert.",

    atoms: [
      {
        id: "a-cw-achievement-bullets",
        title: "Writing achievement-focused bullet points",
        explain:
          "A duty says what you were supposed to do (\"Responsible for writing blog articles\"); an achievement says what you did and what difference it made (\"Wrote 45 SEO-optimised blog articles for 6 clients\"). Write each bullet as: a strong action verb in the past tense + what you did (with scale and context) + the result or impact. Start with varied, specific verbs: wrote, grew, launched, cut, increased, trained, designed, led, organised, ranked, published, reduced, negotiated. Avoid weak openings: \"responsible for\", \"duties included\", \"helped with\", \"worked on\", \"handled\". Keep each bullet to one or two lines, put the most impressive first, and make sure every bullet would survive the question \"How do you know?\" in an interview.",
        samples: [
          { label: "Duty", tone: "bad", text: "Responsible for social media pages." },
          { label: "Achievement", tone: "good", text: "Grew Instagram and Facebook followers from 2,000 to 9,500 in 10 months by launching a daily video series." },
        ],
      },
      {
        id: "a-cw-measurable-results",
        title: "Using measurable results",
        explain:
          "Numbers make achievements credible and memorable. Look for: quantity (45 articles, 6 clients, 3 interns trained); growth (from 2,000 to 9,500 followers); percentages (enquiries doubled; complaints cut by 30%); money (saved ₦400,000; generated ₦2 million in sales); time (reduced turnaround from 5 days to 2); rankings and recognition (position 1 on Google; employee of the month); and scale (served 300 customers a week). If you do not know exact figures, use honest estimates and say so in interviews (\"about 40%\"); never invent numbers, because employers check and a single false claim destroys your credibility. If an achievement truly has no number, show its significance with context (\"chosen by the editor to write the anniversary feature\").",
        decision: {
          scenario: "You helped a client's newsletter grow, but you do not know the exact numbers.",
          question: "What should you write?",
          options: [
            { id: "a", text: "Ask the client for the figures; if unavailable, use an honest estimate you can explain, or describe the result without a number", why: "Right. Real or honestly estimated figures are credible; invented ones are not." },
            { id: "b", text: "Write \"Grew the newsletter by 500%\" because it sounds impressive", whyWrong: "An invented figure can be checked and will damage your credibility." },
            { id: "c", text: "Leave the achievement out entirely", whyWrong: "Describe it honestly instead of losing it." },
            { id: "d", text: "Write \"Responsible for the newsletter\"", whyWrong: "That turns an achievement back into a duty." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-tailored-cv",
        title: "Writing tailored CVs",
        explain:
          "A tailored CV is adapted for each job, because each employer looks for different evidence. Read the advert and highlight the keywords: the job title, required skills, tools, sectors and results it asks for (\"SEO-optimised articles\", \"fintech\", \"WordPress\", \"Canva\", \"traffic, rankings or engagement\"). Then adjust your CV: match your title and summary to the role; reorder bullets so the most relevant evidence comes first; use the advert's exact words where they truthfully describe your experience (this helps both ATS keyword searches and human readers); add relevant experience you had left out; and cut what is irrelevant. Tailoring is not inventing: never claim skills or experience you do not have. Keep a full master CV with everything, and create a tailored copy for each application.",
        writingLab: {
          task:
            "Tailor Amara's freelance experience to Brightlane's advert. First list at least five keywords or phrases from the advert. Then rewrite her four duty bullets as achievement bullets: each starts with a strong past-tense verb (not \"Responsible\", \"Did\", \"Handled\", \"Worked\" or \"Helped\"), at least three include a number, at least three advert keywords appear across the bullets, and every fact comes from Amara's profile (nothing invented).",
          brief: BULLETS_BRIEF,
          doc: BULLETS_DOC,
          tests: [
            { label: "At least five keywords from the advert", check: String.raw`const ad = "seo-optimised articles that rank social media content instagram linkedin email newsletters canva wordpress fintech e-commerce results traffic rankings engagement editing attention to detail content writer research".toLowerCase(); const k = bullets(section('Keywords')); return k.length >= 5 && k.filter((x) => x.toLowerCase().split(/[\s:,]+/).filter((w) => w.length > 3).some((w) => ad.includes(w))).length >= 5;`, fail: "Copy at least five keywords or phrases from the advert, one per line." },
            { label: "Four bullets starting with strong verbs", check: String.raw`const b = bullets(section('Freelance Content Writer')); return b.length >= 4 && b.every((x) => /^[A-Z][a-z]+ed\b|^(Wrote|Grew|Led|Ran|Built|Won|Cut|Made|Sold|Taught|Drew|Set|Kept)\b/.test(x) && !/^(Responsible|Did|Handled|Worked|Helped)\b/.test(x));`, fail: "Start every bullet with a strong past-tense verb such as Wrote, Ranked, Published or Interviewed." },
            { label: "At least three bullets with numbers", check: String.raw`return bullets(section('Freelance Content Writer')).filter((x) => /\d/.test(x)).length >= 3;`, fail: "Use Amara's numbers: 45 articles, 6 clients, position 1, doubled in 3 months." },
            { label: "Advert keywords appear in the bullets", check: String.raw`const t = section('Freelance Content Writer').toLowerCase(); return ['seo', 'fintech', 'wordpress', 'canva', 'social media', 'ranked', 'ranking'].filter((k) => t.includes(k)).length >= 3;`, fail: "Use the advert's words where they truthfully describe Amara's work: SEO, fintech, WordPress, Canva…" },
            { label: "Nothing invented", check: String.raw`const t = section('Freelance Content Writer') || ''; return !/(100 articles|50 clients|tripled|1,000%|award|e-commerce clients|managed a team)/i.test(t);`, fail: "Use only facts from Amara's profile. Tailoring is not inventing." },
          ],
          solution: BULLETS_DONE,
          hint: "For each duty bullet, find the matching fact in Amara's profile and ask: what was the result?",
          successMessage: "Duties turned into evidence, in the employer's own words, and all of it true.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 16.8 – 16.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l61-letters-brand",
    moduleId: "cw-m16-career",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.8", "16.9", "16.10", "16.11"],
    title: "Cover Letters, Bios, LinkedIn and Personal Brand",
    subtitle: "Telling your professional story beyond the CV",
    estimatedMinutes: 40,
    intro:
      "The CV lists the evidence. Cover letters, bios and LinkedIn tell the story around it, in your own voice.",

    atoms: [
      {
        id: "a-cw-cover-letters",
        title: "Cover letter structure and development",
        explain:
          "A cover letter explains why you want this job and why you are a strong fit, connecting your evidence to the employer's needs. Keep it to one page (250 to 400 words). Structure: a salutation (\"Dear Mrs Adeyemi,\" if you can find the name; otherwise \"Dear Hiring Manager,\"); an opening paragraph naming the role and your main reason you are a fit, in one or two sentences, not \"I am writing to apply for the above-mentioned position\"; one or two middle paragraphs that prove two or three of the advert's main requirements with specific achievements; a short paragraph on why this employer (show you know what they do); and a close that asks for the next step and thanks them, with \"Yours sincerely\" (named) or \"Yours faithfully\" (Dear Hiring Manager, in British usage). Write a new letter for each job, and never just repeat the CV.",
        mistake: "Opening with \"I am writing to apply for the above-mentioned position which was advertised in your esteemed organisation.\" Name the role and give your strongest reason in the first sentence.",
      },
      {
        id: "a-cw-bios",
        title: "Writing professional biographies",
        explain:
          "A professional bio is a short paragraph about you, used on company websites, conference programmes, author pages, guest posts, proposals and speaker introductions. It is usually written in the third person (\"Amara Obi is a content writer who…\") so others can use it. Formula: name and professional identity; what you do and for whom; two or three credible achievements or credentials; relevant background (education, past roles); and optionally a human detail or a link. Keep versions of different lengths: a one-line bio (for social profiles), a short bio (50 to 80 words) and a longer bio (100 to 150 words). Update it as your achievements grow, and adjust the emphasis for each audience.",
      },
      {
        id: "a-cw-linkedin",
        title: "LinkedIn profile writing",
        explain:
          "LinkedIn is a searchable professional profile and a publishing platform, so write it for both recruiters searching and people reading. Key parts: the headline (up to 220 characters), which appears everywhere you comment or appear in search, so say what you do, for whom and your value, rather than only \"Graduate\" or \"Open to work\"; the About section (up to 2,600 characters), written in the first person, opening with a hook in the first two lines (they show before \"see more\"), then your specialism, evidence, how you work, and a call to action (\"Send me a message…\"); experience entries with achievement bullets (adapted from your CV); skills (choose those recruiters search for); and featured work (links to your best articles or portfolio). Use keywords naturally, keep the tone professional but human, and add a professional photo.",
        decision: {
          scenario: "Which LinkedIn headline is strongest for Amara?",
          question: "Choose the best headline.",
          options: [
            { id: "a", text: "\"Content Writer | SEO articles and social media for fintech and healthcare brands | Helped a clinic double its enquiries\"", why: "Right. What she does, for whom, and proof, with searchable keywords." },
            { id: "b", text: "\"Graduate\"", whyWrong: "Says nothing about her skills or value." },
            { id: "c", text: "\"Unemployed but hardworking\"", whyWrong: "Leads with a weakness and an empty phrase." },
            { id: "d", text: "\"Looking for any job, please help\"", whyWrong: "Unfocused and does not show value." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-personal-brand",
        title: "Personal branding through written communication",
        explain:
          "Your personal brand is what people think of when they hear your name professionally, and for writers it is shaped mainly by writing. Decide what you want to be known for (a specialism such as fintech content, or healthcare copywriting), and make every public piece of writing consistent with it: your CV, LinkedIn, bio, portfolio, emails and posts. Share useful content regularly (lessons, examples, short articles), comment thoughtfully on others' posts, and showcase results. Keep the same name, photo and headline across platforms. Remember that everything public is part of your brand: careless posts, rude comments or sloppy emails can undo good work. For a writer, every message you send is a writing sample.",
        writingLab: {
          task:
            "Build Amara's personal brand pieces. LinkedIn headline: 220 characters or fewer, naming what she does, for whom, and a proof point, using at least two of these keywords: content writer, SEO, social media, fintech. Professional bio: 80 to 130 words in the third person (no \"I\" or \"my\"), starting with her name and identity, with at least two achievements with numbers, and her education.",
          brief: AMARA,
          doc: BIO_DOC,
          tests: [
            { label: "Headline: 220 characters or fewer, with keywords", check: String.raw`const h = (section('LinkedIn headline') || '').trim(); return h.length >= 30 && h.length <= 220 && ['content writer', 'seo', 'social media', 'fintech'].filter((k) => h.toLowerCase().includes(k)).length >= 2;`, fail: "Write a headline of 220 characters or fewer with at least two keywords." },
            { label: "Headline includes a proof point", check: String.raw`return /(double|position 1|top|9,?500|45 )/i.test(section('LinkedIn headline') || '');`, fail: "Add one proof point, such as the doubled enquiries." },
            { label: "Bio: 80 to 130 words, third person", check: String.raw`const b = section('Professional bio') || ''; return words(b) >= 80 && words(b) <= 130 && !/\b(I|my|me)\b/.test(b) && /^Amara Obi is\b/.test(b.trim());`, fail: "Start \"Amara Obi is…\", write in the third person, 80 to 130 words." },
            { label: "Bio: two numbered achievements and education", check: String.raw`const b = section('Professional bio') || ''; return nums(b).filter((n) => n !== 2024 && n !== 2025 && n !== 2026).length >= 2 && /(university|degree|mass communication)/i.test(b);`, fail: "Include at least two achievements with numbers, and her degree." },
          ],
          solution: BIO_DONE,
          hint: "Write the bio as Amara would be introduced on stage: who she is, what she has done, where she trained.",
          successMessage: "A headline that works in search and a bio anyone can use to introduce Amara.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 16.12 – 16.14 · PRACTICAL 16.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l62-applications",
    moduleId: "cw-m16-career",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.12", "16.13", "16.14", "16.P"],
    title: "Applications, Networking and Your Pack",
    subtitle: "Application emails, networking messages, statements of interest, and the module practical",
    estimatedMinutes: 75,
    intro:
      "The last pieces of career writing get your CV in front of the right person. Then you build a complete application pack.",

    atoms: [
      {
        id: "a-cw-application-emails",
        title: "Job application emails",
        explain:
          "When an advert asks you to apply by email, the email itself is the first writing sample the employer sees. Use the subject line the advert requests, or \"Application: Content Writer, Amara Obi\". Address the named person or \"Dear Hiring Manager\". In three short paragraphs: say which role you are applying for and where you saw it; give one or two sentences on why you are a strong fit, with your best evidence; and list what you have attached (CV and cover letter as PDFs with clear file names, such as Amara-Obi-CV.pdf) and thank them. Sign off with your full name, phone number and LinkedIn or portfolio link. Do not leave the body blank with only attachments, and check that the attachments are actually attached before sending.",
      },
      {
        id: "a-cw-networking",
        title: "Professional networking messages",
        explain:
          "Many jobs and freelance projects come through people you know or reach out to. A networking message (on LinkedIn or by email) should be short, specific and generous. Say who you are in one line, why you are contacting this person in particular (a post they wrote, a shared connection, their work), what you are asking for (small and specific: a 15-minute call, advice on breaking into fintech writing, feedback on one article), and make it easy to say yes or no. Never open with \"Please help me get a job\" or send your CV unasked to a stranger. Follow up once if there is no reply, thank people who help, and give back: share their work, introduce them to others, and help those coming after you.",
        decision: {
          scenario: "Which LinkedIn message to a senior content strategist you have never met is best?",
          question: "Choose the strongest networking message.",
          options: [
            { id: "a", text: "\"Hi Bisi, I'm a content writer in Enugu and really valued your post on fintech SEO. Could I ask you two questions about moving into agency work, in a 15-minute call this month?\"", why: "Right. Brief, specific about why her, a small clear request, and easy to answer." },
            { id: "b", text: "\"Hello ma, please help me get a job at your company.\"", whyWrong: "Asks a stranger for a large favour with no context." },
            { id: "c", text: "Sending your CV with no message", whyWrong: "Unexplained and unsolicited." },
            { id: "d", text: "\"Hi\" and waiting for a reply", whyWrong: "Gives her no reason to respond." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-statements-interest",
        title: "Writing statements of interest",
        explain:
          "A statement of interest (or letter of interest, or personal statement) is used when you are applying for a programme, fellowship, scholarship, internship scheme or an organisation with no advertised role. It explains your interest, your relevant experience and what you want to achieve, and why this organisation or programme. Structure: an opening that states what you are applying for and your central motivation, ideally through a short, specific story; two paragraphs of relevant evidence; what you hope to learn or contribute; and why this programme in particular. Follow any word limit and prompt exactly, answer every question asked, and be genuine: selection panels read hundreds of statements and recognise generic ones instantly.",
      },
      {
        id: "a-cw-m16-practical",
        title: "Practical: CV, tailored cover letter and LinkedIn About",
        explain:
          "Build Amara's complete application pack for Brightlane Digital: a one-page CV, a cover letter tailored to the advert, and her LinkedIn About section. Use only her real facts, mirror the advert's keywords where they are true, and keep each document doing its own job: the CV proves, the cover letter connects, and the About section introduces her in her own voice.",
        writingLab: {
          task:
            "CV: Contact (phone and email; no date of birth, religion or state of origin), a 2 to 4 sentence summary, Experience with both roles as bold title lines and at least five achievement bullets in total (at least four with numbers), Education with the degree, and Skills. Cover letter: \"Dear Hiring Manager,\", the role named in the first paragraph, evidence matching at least two advert requirements (SEO or rankings, fintech, social media, WordPress or Canva), a reason for Brightlane, a closing request, \"Yours faithfully,\" and her name; 220 to 400 words. LinkedIn About: first person, a hook first line of 15 words or fewer, at least two numbers, and a closing invitation; 120 to 260 words.",
          brief: `${AMARA}\n\n${JOB_AD}`,
          doc: PRAC_DOC,
          tests: [
            { label: "CV contact details without personal data employers should not use", check: String.raw`const c = section('Contact') || ''; return /0806/.test(c) && /@/.test(c) && !/(date of birth|religion|state of origin|marital|single|married|christian|muslim)/i.test(section('CV') || '');`, fail: "Give phone and email; leave out date of birth, religion, state of origin and marital status." },
            { label: "CV summary: two to four sentences", check: String.raw`const n = sentences(section('Professional summary')).length; return n >= 2 && n <= 4;`, fail: "Keep the summary to two to four sentences." },
            { label: "CV experience: both roles and five achievement bullets with numbers", check: String.raw`const e = section('Experience') || ''; const b = bullets(e); return /\*\*[^*]*freelance[^*]*\*\*/i.test(e) && /\*\*[^*]*coal city[^*]*\*\*/i.test(e) && b.length >= 5 && b.filter((x) => /\d/.test(x)).length >= 4 && !b.some((x) => /^(Responsible|Duties|Handled|Worked on|Helped with)\b/.test(x));`, fail: "List both roles as **bold** title lines with at least five achievement bullets, four with numbers." },
            { label: "CV education and skills", check: String.raw`return /mass communication/i.test(section('Education') || '') && words(section('Skills')) >= 5;`, fail: "Add the degree under Education and list skills." },
            { label: "Cover letter: structure, tailoring and length", check: String.raw`const l = section('Cover letter') || ''; const first = paragraphs(l)[1] || ''; return /^Dear Hiring Manager,?\s*$/m.test(l) && /content writer/i.test(first) && /brightlane/i.test(l) && ['seo', 'fintech', 'social media', 'wordpress', 'canva', 'position 1', 'ranked'].filter((k) => l.toLowerCase().includes(k)).length >= 3 && /yours faithfully/i.test(l) && /amara obi\s*$/i.test(l.trim()) && words(l) >= 220 && words(l) <= 400 && !/above-mentioned|esteemed/i.test(l);`, fail: "Open with the role, prove the advert's requirements with evidence, mention Brightlane, close with \"Yours faithfully,\" and her name, in 220 to 400 words." },
            { label: "LinkedIn About: first person, hook, numbers and invitation", check: String.raw`const a = section('LinkedIn About') || ''; const first = lines(a)[0] || ''; return /\b(I|my)\b/.test(a) && words(first) <= 15 && nums(a).filter((n) => n < 2000 || n > 2100).length >= 2 && /(message|get in touch|let's talk|contact me|reach out)/i.test(lastSentence(a) + ' ' + sentences(a).slice(-2).join(' ')) && words(a) >= 120 && words(a) <= 260;`, fail: "Write in the first person, open with a short hook, include at least two numbers, end with an invitation, in 120 to 260 words." },
          ],
          solution: PRAC_DONE,
          hint: "Write the CV first; the cover letter then picks the two achievements that match the advert best, and the About section tells the same story in Amara's voice.",
          successMessage: "A complete application pack: proof, connection and introduction. Now build your own from the same template.",
        },
      },
    ],

    task: {
      title: "Module 16 practical: your own application pack",
      intro: "Do for yourself what you just did for Amara.",
      prompts: [
        "Write a full master CV with every role, project and achievement, then list the numbers behind each one.",
        "Find two real job adverts you want. Highlight the keywords and create a tailored one-page CV for each.",
        "Write a tailored cover letter and application email for one of them.",
        "Rewrite your LinkedIn headline and About section, and add three pieces of your best writing from this course to Featured.",
        "Send three thoughtful networking messages to people in roles you want, asking one small, specific question each.",
      ],
      closing: "Part Five begins in Module 17: editing and proofreading, the skills that turn good drafts into professional work.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
