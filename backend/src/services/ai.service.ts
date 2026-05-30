import OpenAI from "openai";
import {
  ExtensionProject,
  extensionProjectSchema,
  formatZodErrors,
} from "../schemas/extension.schema";
import {
  EXTENSION_SYSTEM_PROMPT,
  buildUserPrompt,
  buildRepairPrompt,
} from "../prompts/extension.prompt";
import { extractJsonFromText } from "../utils/jsonExtract";
import { mechanicallyRepairJson, safeJsonParse } from "../utils/jsonRepair";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_GENERATION_ATTEMPTS = 3;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  return client;
}

async function callGroq(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  temperature = 0.15
): Promise<string> {
  const groq = getClient();
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature,
    messages,
  });

  const rawText = response.choices[0]?.message?.content;
  if (!rawText) {
    throw new Error("Empty response from Groq");
  }

  return rawText;
}

function parseAndValidate(rawText: string): ExtensionProject {
  const attempts = [
    () => extractJsonFromText(rawText),
    () => mechanicallyRepairJson(rawText),
  ];

  let lastParseError = "Unknown parse error";
  let lastZodError = "";

  for (const getJson of attempts) {
    const jsonText = getJson();
    const parsed = safeJsonParse(jsonText);

    if (!parsed.success) {
      lastParseError = "error" in parsed ? parsed.error : "Invalid JSON";
      continue;
    }

    const validated = extensionProjectSchema.safeParse(parsed.data);
    if (validated.success) {
      return validated.data;
    }

    lastZodError = formatZodErrors(validated.error);
  }

  throw new Error(
    lastZodError
      ? `Validation failed: ${lastZodError}`
      : `JSON parse failed: ${lastParseError}`
  );
}

async function repairWithAI(
  userPrompt: string,
  invalidOutput: string,
  validationErrors: string
): Promise<ExtensionProject> {
  console.log("🔧 Attempting AI repair for invalid extension output…");

  const repairedRaw = await callGroq(
    [
      { role: "system", content: EXTENSION_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildRepairPrompt(userPrompt, invalidOutput, validationErrors),
      },
    ],
    0.1
  );

  return parseAndValidate(repairedRaw);
}

export async function generateExtensionFromAI(
  userPrompt: string,
  options?: { priority?: boolean }
): Promise<ExtensionProject> {
  const priority = options?.priority ?? false;
  const errors: string[] = [];
  let lastRaw = "";

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      console.log(`🔄 Groq generation attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);

      lastRaw = await generateRaw(userPrompt, priority);

      try {
        const project = parseAndValidate(lastRaw);
        console.log("✅ Extension validated:", project.projectName);
        return project;
      } catch (validationError) {
        const message =
          validationError instanceof Error
            ? validationError.message
            : "Validation failed";

        errors.push(`Attempt ${attempt} validation: ${message}`);
        console.warn(`⚠️ ${message}`);

        try {
          const repaired = await repairWithAI(
            userPrompt,
            lastRaw,
            message
          );
          console.log("✅ AI repair succeeded");
          return repaired;
        } catch (repairError) {
          const repairMsg =
            repairError instanceof Error
              ? repairError.message
              : "Repair failed";
          errors.push(`Attempt ${attempt} repair: ${repairMsg}`);
          console.warn(`⚠️ Repair failed: ${repairMsg}`);
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Generation failed";
      errors.push(`Attempt ${attempt} API: ${msg}`);
      console.error(`❌ Attempt ${attempt} failed:`, msg);

      if (attempt === MAX_GENERATION_ATTEMPTS) {
        break;
      }
    }
  }

  throw new Error(
    `Failed to generate a valid extension after ${MAX_GENERATION_ATTEMPTS} attempts. ${errors.join(" | ")}`
  );
}

async function generateRaw(
  userPrompt: string,
  priority = false
): Promise<string> {
  return callGroq(
    [
      { role: "system", content: EXTENSION_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(userPrompt) },
    ],
    priority ? 0.1 : 0.2
  );
}

export async function generateChatCompletion(
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
  return callGroq(messages, 0.4);
}
