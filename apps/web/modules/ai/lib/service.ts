import { TTemplate } from "@formbricks/types/templates";
import { getOrganizationAIKeys } from "@/modules/survey/lib/organization";
import { decryptAIConfig } from "./crypto";

const SYSTEM_PROMPT = `You are an expert survey designer for CohbyForms.
Your task is to generate a survey template based on the user's prompt.
You MUST return ONLY a JSON object that matches the TTemplate structure.

Rules:
1. Use CUID-compatible strings for IDs (e.g., "clm1234567890abcdefghijklm").
2. Ensure at least one block with elements.
3. Elements can be: openText, multipleChoiceSingle, multipleChoiceMulti, nps, rating, cta, consent, pictureSelection, date, address, ranking, contactInfo.
4. Headlines and subheaders must be of type TI18nString: { "default": "text" }.

Expected JSON structure:
{
  "name": "Survey Name",
  "description": "Short description",
  "preset": {
    "name": "Preset Name",
    "welcomeCard": { "enabled": true, "headline": { "default": "Welcome!" }, "subheader": { "default": "Please take a moment..." }, "buttonLabel": { "default": "Start" } },
    "blocks": [
      {
        "id": "block_id",
        "name": "Block 1",
        "elements": [
          { "id": "el_1", "type": "openText", "headline": { "default": "What is your name?" }, "required": true }
        ]
      }
    ],
    "endings": [
      { "id": "end_1", "type": "endScreen", "headline": { "default": "Thank you!" }, "subheader": { "default": "We appreciate your feedback." } }
    ],
    "hiddenFields": { "enabled": false, "fieldIds": [] }
  }
}`;

export const generateSurveyFromPrompt = async (
  organizationId: string,
  prompt: string,
  providerId?: "openai" | "anthropic" | "google"
): Promise<TTemplate> => {
  const organizationAIKeys = await getOrganizationAIKeys(organizationId);
  if (!organizationAIKeys || !organizationAIKeys.aiConfig) {
    throw new Error("AI configuration not found for this organization. Please set up your API keys.");
  }

  const aiConfig = decryptAIConfig(organizationAIKeys.aiConfig as any);
  const provider =
    aiConfig.providers.find((p) => (providerId ? p.id === providerId : true)) || aiConfig.providers[0];

  if (!provider) {
    throw new Error("No AI provider configured. Please add an API key in settings.");
  }

  let generatedTemplate: TTemplate;

  if (provider.id === "openai") {
    generatedTemplate = await callOpenAI(provider.apiKey, provider.baseUrl, prompt);
  } else if (provider.id === "anthropic") {
    generatedTemplate = await callAnthropic(provider.apiKey, prompt);
  } else if (provider.id === "google") {
    generatedTemplate = await callGoogle(provider.apiKey, prompt);
  } else {
    throw new Error(`Unsupported AI provider: ${provider.id}`);
  }

  return generatedTemplate;
};

const callOpenAI = async (
  apiKey: string,
  baseUrl: string | undefined,
  prompt: string
): Promise<TTemplate> => {
  const url = baseUrl || "https://api.openai.com/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const callAnthropic = async (apiKey: string, prompt: string): Promise<TTemplate> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.content[0].text);
};

const callGoogle = async (apiKey: string, prompt: string): Promise<TTemplate> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Prompt: ${prompt}` }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google AI error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  // Gemini sometimes wraps JSON in markdown code blocks
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Google AI failed to generate a valid JSON template.");
  return JSON.parse(jsonMatch[0]);
};
