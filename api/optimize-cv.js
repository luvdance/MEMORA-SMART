const rateLimit = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 5 optimizations per IP per hour
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 5;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    const record = rateLimit.get(ip);
    if (now > record.resetAt) {
      rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    } else if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Try again in an hour.",
      });
    } else {
      record.count++;
    }
  }

  const { cvText, improvements, atsScore, jobDescription } = req.body;

  if (!cvText || cvText.trim().length < 100) {
    return res.status(400).json({
      success: false,
      error: "CV text required (at least 100 characters)",
    });
  }

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
  "hobbies": "Comma-separated 3-5 professional-sounding interests",
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
- Return ONLY the JSON object. No backticks. No commentary.`;

  const userPrompt = jobDescription && jobDescription.trim().length > 20
    ? `Optimize this CV:\n\n${cvText}\n\n---\n\nTailor it toward this target job:\n\n${jobDescription}`
    : `Optimize and structure this CV:\n\n${cvText}\n\nThe candidate's current ATS score is ${atsScore || "unknown"}/100. Rewrite for maximum ATS performance.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(500).json({
        success: false,
        error: `Optimization service error: ${errText.substring(0, 200)}`,
      });
    }

    const data = await response.json();
    let text = data.content?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();

    let optimizedCV;
    try {
      optimizedCV = JSON.parse(text);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw:", text.substring(0, 500));
      return res.status(500).json({
        success: false,
        error: "AI returned malformed CV data. Please try again.",
      });
    }

    // Ensure required arrays exist
    optimizedCV.experience = optimizedCV.experience || [];
    optimizedCV.education = optimizedCV.education || [];
    optimizedCV.certifications = optimizedCV.certifications || [];
    optimizedCV.achievements = optimizedCV.achievements || [];
    optimizedCV.volunteer = optimizedCV.volunteer || [];
    optimizedCV.publications = optimizedCV.publications || [];
    optimizedCV.references = optimizedCV.references || [];

    return res.status(200).json({ success: true, cv: optimizedCV });
  } catch (err) {
    console.error("CV optimization error:", err);
    return res.status(500).json({
      success: false,
      error: "Could not optimize CV: " + err.message,
    });
  }
}