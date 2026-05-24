import OpenAI from "openai";
import {
  extensionProjectSchema
} from "../schemas/extension.schema";

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

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateExtensionFromAI(
  userPrompt: string
) {

  try {

    const response =
      await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },

          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

    const rawText =
      response.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error(
        "Empty response from Groq"
      );
    }

    const cleaned = rawText
      .trim()
      .replace(/^```json\s*|```$/g, "")
      .trim();

    const parsed =
  extensionProjectSchema.parse(
    JSON.parse(cleaned)
  );

return parsed;
  } catch (error: any) {

    console.error(
      "AI generation failed:",
      error.message
    );

    throw new Error(
      "Failed to generate extension"
    );

  }

}