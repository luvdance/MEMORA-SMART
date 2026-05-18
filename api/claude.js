const rateLimit = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Rate limit: 20 requests per IP per hour
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 20;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    const record = rateLimit.get(ip);
    if (now > record.resetAt) {
      rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    } else if (record.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Try again later." });
    } else {
      record.count++;
    }
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      system: "You are a CV writer. Output plain text only. No markdown. No headings. No hashtags. No asterisks. No labels. Just the content.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  let text = data.content?.[0]?.text || "";
  text = text.replace(/^#.*$/gm, "").trim();

  return res.status(200).json({ text });
}