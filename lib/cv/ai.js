/**
 * ATS scoring and AI optimization for the CV builder. SERVER ONLY.
 *
 * Moved from api/ats-score.js and api/optimize-cv.js (prompts unchanged) so
 * both are served by api/cv.js behind the Premium check.
 */

const MODEL = "claude-sonnet-4-6";

async function callClaude(system, userPrompt, maxTokens) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Anthropic API error:", response.status, errText);
    throw new Error(`AI service error (${response.status}). Please try again.`);
  }

  const data = await response.json();
  const text = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(text);
  } catch {
    console.error("JSON parse failed. Raw text:", text.substring(0, 500));
    throw new Error("AI returned malformed data. Please try again.");
  }
}

export async function scoreCv({ cvText, jobDescription }) {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) and Nigerian recruitment specialist. Score the CV on a strict 0-100 scale across these 5 categories:

1. STRUCTURE & FORMATTING (20 points) - Clear sections, consistent formatting, ATS-readable layout
2. KEYWORDS & RELEVANCE (25 points) - Industry-relevant terms, action verbs, matches job description if provided
3. ACHIEVEMENTS & METRICS (20 points) - Quantified results, specific outcomes, concrete examples
4. PROFESSIONAL SUMMARY (15 points) - Strong opening, clear value proposition, tailored to target role
5. CONTACT & ESSENTIALS (20 points) - Email, phone, LinkedIn, professional details

Return ONLY valid JSON in this exact format (no markdown, no preamble):

{
  "overallScore": 75,
  "rating": "Good",
  "categories": {
    "structure": { "score": 18, "max": 20, "feedback": "..." },
    "keywords": { "score": 20, "max": 25, "feedback": "..." },
    "achievements": { "score": 12, "max": 20, "feedback": "..." },
    "summary": { "score": 13, "max": 15, "feedback": "..." },
    "contact": { "score": 12, "max": 20, "feedback": "..." }
  },
  "topImprovements": [
    {
      "title": "Add quantified achievements",
      "description": "Specific actionable advice",
      "example": "Instead of 'managed team', write 'Led team of 8 engineers, delivering 3 projects 20% ahead of schedule'"
    }
  ],
  "strengths": ["List 2-3 things the CV does well"],
  "atsRedFlags": ["List 1-3 critical issues that ATS might fail on"]
}

Rules:
- rating must be one of: "Excellent" (90+), "Good" (70-89), "Needs Work" (50-69), "Critical" (<50)
- topImprovements: exactly 5 items, ranked by impact
- Use Nigerian context where relevant
- Always include concrete examples in improvements`;

  const userPrompt = jobDescription && jobDescription.trim().length > 20
    ? `Analyze this CV:\n\n${cvText}\n\n---\n\nTarget Job Description:\n\n${jobDescription}`
    : `Analyze this CV:\n\n${cvText}`;

  return callClaude(systemPrompt, userPrompt, 2500);
}

/** Added for callers that tailor a CV to a job, where the pull to invent is strongest. */
const TRUTH_RULES = `

TRUTH RULES. These override everything above, including the improvements list:
- A job advert asking for something is NOT evidence the candidate has it. Never add a skill, tool, certification, employer, duty or result the CV does not state.
- Never add a number, percentage, amount, rating, team size or customer count that is not in the CV. If a bullet has no figures, make the wording stronger and leave figures out. Do not estimate.
- Never write "certified", "proficient" or "experienced in" for something the CV does not show.
- Tailor only by choosing what to emphasise and by using the job's wording for things this person really did.
- Return certifications, achievements, volunteer, publications and references exactly as they are in the CV. If there are none, return [].`;

export async function optimizeCv({ cvText, improvements, atsScore, jobDescription, truthful = false }) {
  const systemPrompt = `You are an expert CV writer specializing in the Nigerian job market and ATS optimization. Your job is to take a CV (possibly weak or unstructured) and rewrite it as a polished, ATS-friendly, structured CV.

Apply these specific improvements where applicable: ${JSON.stringify(improvements || [])}

Return ONLY valid JSON in this exact schema (no markdown, no preamble, no backticks):

{
  "name": "Full Name as Title Case",
  "jobTitle": "Target job title",
  "email": "extracted email or empty string",
  "phone": "extracted phone or empty string",
  "address": "extracted location or empty string",
  "linkedin": "extracted LinkedIn URL or empty string",
  "website": "extracted website/portfolio URL or empty string",
  "github": "extracted GitHub URL or empty string",
  "summary": "Rewritten 2-3 sentence professional summary. Strong, specific, achievement-oriented. No generic phrases like 'hardworking team player'.",
  "objective": "Rewritten 1 sentence career objective stating target role and value brought.",
  "experience": [
    {
      "company": "Company name in Title Case",
      "role": "Job title in Title Case",
      "start": "e.g. Jan 2020",
      "end": "e.g. Dec 2022",
      "current": false,
      "responsibilities": "- Action verb + specific achievement with numbers where possible\\n- Another bullet starting with strong verb\\n- 3-4 bullets total per role, quantified where realistic"
    }
  ],
  "education": [
    {
      "school": "School name in Title Case",
      "degree": "Degree name",
      "field": "Field of study",
      "start": "e.g. 2018",
      "end": "e.g. 2022"
    }
  ],
  "skills": "Comma-separated list of 8-12 relevant skills, prioritized by relevance to target role",
  "languages": "Comma-separated with proficiency, e.g. English (Fluent), Yoruba (Native)",
  "hobbies": "The hobbies exactly as written in the CV, comma-separated, or an empty string if there are none. Never add hobbies.",
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing org",
      "issueDate": "",
      "expiryDate": "",
      "noExpiry": false,
      "credentialId": "",
      "credentialUrl": ""
    }
  ],
  "achievements": [],
  "volunteer": [],
  "publications": [],
  "references": []
}

CRITICAL RULES:
- EXTRACT all real info from the user's CV. Don't invent details that aren't there.
- REWRITE weak text into strong, achievement-oriented prose. Quantify where realistic.
- Apply the listed improvements where they fit naturally.
- If the user mentioned a target job description, tailor the summary/objective/skills emphasis toward it.
- Use Nigerian context (e.g. NYSC, Nigerian companies) where relevant.
- For responsibilities: each bullet starts with a strong action verb (Led, Designed, Implemented, Delivered, Built, Achieved). Use newline + "- " separators.
- Apply Title Case to names, companies, schools, job titles.
- Format dates as "Jan 2020" or "2020" — never raw numbers.
- For empty arrays (achievements, volunteer, publications, references), return [] not omitted.
- Return ONLY the JSON object. No backticks. No commentary.${truthful ? TRUTH_RULES : ""}`;

  const userPrompt = jobDescription && jobDescription.trim().length > 20
    ? `Optimize this CV:\n\n${cvText}\n\n---\n\nTailor it toward this target job:\n\n${jobDescription}`
    : `Optimize and structure this CV:\n\n${cvText}\n\nThe candidate's current ATS score is ${atsScore || "unknown"}/100. Rewrite for maximum ATS performance.`;

  const optimizedCV = await callClaude(systemPrompt, userPrompt, 4000);

  // Ensure required arrays exist
  for (const key of ["experience", "education", "certifications", "achievements", "volunteer", "publications", "references"]) {
    optimizedCV[key] = Array.isArray(optimizedCV[key]) ? optimizedCV[key] : [];
  }
  return optimizedCV;
}

// ── BUILDER ASSISTANT ──
// One instruction in, a patch of only the changed fields out, so a small fix
// costs a small reply. The browser sends the CV already compacted (no photo,
// no empty fields) and applies the patch with applyAssistPatch.
const ASSIST_SYSTEM = `You edit a CV stored as JSON for a CV builder. You get the current CV, the user's request, and sometimes text from a document they uploaded. Return ONLY a JSON object, no markdown:

{"set": { ...only the fields you change... }, "note": "one short plain sentence saying what you changed, or what you need from the user"}

Fields:
- Text: name, jobTitle, email, phone, address, linkedin, website, github, summary, skills, languages, hobbies, dateOfBirth, gender, maritalStatus, nationality, stateOfOrigin, lga, placeOfBirth, religion, nin
- Lists (items use only these keys):
  experience {company, role, start, end, current, responsibilities}
  education {school, degree, field, start, end}
  certifications {name, issuer, issueDate, expiryDate, noExpiry, credentialId, credentialUrl}
  achievements {title, date, description}
  volunteer {organization, role, start, end, description}
  references {name, title, company, email, phone}
  publications {title, journal, date, url, description}

Changing a list, use the cheapest form:
- edit items by index: "experience": {"1": {"end": "Mar 2024"}}
- add items: "experience": {"+": [{...}]}
- remove items by index: "experience": {"-": [2]}
- replace the whole list: "experience": [...] (when filling from details or reordering)

Rules:
- Change only what the request asks for. Leave every other field out of "set".
- Never invent facts: no employers, dates, figures, skills or credentials the user did not give. You may improve wording when asked.
- responsibilities: bullets as "- Verb ...\n- Verb ...". skills, languages, hobbies: comma-separated.
- Dates like "Jan 2020" or "2020". Title Case for names, companies, schools and job titles. "current": true means the role has no end date.
- If the request is unclear or not about this CV, return {"set": {}, "note": "<a short question>"}.
- Notes are plain and brief. Do not mention AI, JSON or fields by their key names.`;

export async function assistCv({ cv, instruction, documentText, previous }) {
  const parts = [`Current CV:\n${JSON.stringify(cv)}`];
  if (previous?.instruction) {
    parts.push(`Previous request: ${previous.instruction}\nYour previous note: ${previous.note || ""}`);
  }
  if (documentText) parts.push(`Uploaded document text:\n${documentText}`);
  parts.push(`Request: ${instruction}`);

  const out = await callClaude(ASSIST_SYSTEM, parts.join("\n\n"), 3000);
  return {
    set: out && typeof out.set === "object" && !Array.isArray(out.set) ? out.set : {},
    note: typeof out?.note === "string" ? out.note.slice(0, 400) : "",
  };
}
