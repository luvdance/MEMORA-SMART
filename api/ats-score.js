import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// In-memory rate limit (resets when serverless cold-starts)
const rateLimit = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 5 ATS scans per IP per hour (free tool, must protect)
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
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

  const { cvText, jobDescription } = req.body;

  if (!cvText || cvText.trim().length < 100) {
    return res.status(400).json({
      success: false,
      error: "CV text is too short. Please provide a complete CV (at least 100 characters).",
    });
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) and Nigerian recruitment specialist. You analyze CVs from the perspective of:
1. ATS parsing algorithms (used by 75%+ of Nigerian companies)
2. Modern Nigerian recruiters' best practices
3. Industry-specific keyword optimization

Score the CV on a strict 0-100 scale across these 5 categories:

1. STRUCTURE & FORMATTING (20 points)
   - Clear sections (Contact, Summary, Experience, Education, Skills)
   - Consistent date formatting
   - Logical chronological order
   - No tables/columns that confuse ATS parsers
   - Standard section headings

2. KEYWORDS & RELEVANCE (25 points)
   - Industry-relevant terms
   - Matches job description (if provided)
   - Action verbs (Led, Implemented, Achieved, etc.)
   - Technical skills explicitly named
   - Avoid vague phrases ("hard-working", "team player")

3. ACHIEVEMENTS & METRICS (20 points)
   - Quantified results (numbers, percentages, currency)
   - Specific outcomes vs generic duties
   - Action-Result framework
   - Concrete examples

4. PROFESSIONAL SUMMARY (15 points)
   - Strong opening 2-3 sentences
   - Clear value proposition
   - Tailored to target role
   - No generic objective statements

5. CONTACT & ESSENTIALS (20 points)
   - Email, phone present
   - LinkedIn URL
   - Professional email (not "babyboy23@yahoo.com")
   - Location specified
   - No unnecessary personal info that could trigger bias filters

Return ONLY valid JSON in this exact format (no markdown, no preamble):

{
  "overallScore": 75,
  "rating": "Good" | "Excellent" | "Needs Work" | "Critical",
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
- topImprovements: exactly 5 items, ranked by impact
- Be specific and actionable, not generic
- Use Nigerian context where relevant
- If CV is exceptional (90+) be honest about it
- If CV is poor (under 50) be direct but constructive
- Always include concrete examples in improvements`;

  const userPrompt = jobDescription && jobDescription.trim().length > 20
    ? `Analyze this CV:\n\n${cvText}\n\n---\n\nTarget Job Description:\n\n${jobDescription}`
    : `Analyze this CV:\n\n${cvText}`;

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
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();
    let text = data.content?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();

    const result = JSON.parse(text);

    // Log scan for analytics
    try {
      await db.collection("ats_scans").add({
        score: result.overallScore,
        cvLength: cvText.length,
        hasJobDescription: !!(jobDescription && jobDescription.trim().length > 20),
        ip: ip || "unknown",
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (logErr) {
      console.error("Failed to log scan:", logErr);
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("ATS scoring error:", err);
    return res.status(500).json({
      success: false,
      error: "Could not analyze CV. Please try again or check your CV format.",
    });
  }
}