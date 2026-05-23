import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are an expert Chrome Extension generator.

Return ONLY valid JSON in this exact format:
{
  "projectName": "string",
  "description": "string",
  "files": [
    {
      "filename": "string",
      "content": "string"
    }
  ]
}

Rules:
- Must include manifest.json
- Use Chrome Extension Manifest V3
- Do not return markdown
- Do not return explanations
- Return raw JSON only
`;

export async function generateExtensionFromAI(userPrompt: string) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ]
  });

  const rawText = response.choices[0]?.message?.content;

  if (!rawText) {
    throw new Error("Empty response from Groq");
  }

  try {
    const cleaned = rawText
      .trim()
      .replace(/^```json\s*|```$/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Bad JSON:", rawText);
    throw new Error("Failed to parse AI response");
  }
}