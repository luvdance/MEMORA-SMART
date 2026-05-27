const rateLimit = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 5 ATS scans per IP per hour
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

  const { cvText, jobDescription } = req.body;

  if (!cvText || cvText.trim().length < 100) {
    return res.status(400).json({
      success: false,
      error: "CV text is too short. Please provide a complete CV (at least 100 characters).",
    });
  }

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

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(500).json({
        success: false,
        error: `Anthropic API returned ${response.status}: ${errText.substring(0, 200)}`,
      });
    }

    const data = await response.json();
    let text = data.content?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw text:", text.substring(0, 500));
      return res.status(500).json({
        success: false,
        error: "AI returned malformed JSON. Please try again.",
      });
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("ATS scoring error:", err);
    return res.status(500).json({
      success: false,
      error: "Could not analyze CV: " + err.message,
    });
  }
}