export async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      system: "You are a CV writer. Output plain text only. No markdown. No headings. No hashtags. No asterisks. No labels. Just the content.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  let text = data.content?.[0]?.text || "";

  // Remove ANY line that starts with # (markdown heading)
  text = text.replace(/^#.*$/gm, "").trim();

  return text;
}