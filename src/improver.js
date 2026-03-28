import Anthropic from "@anthropic-ai/sdk";
import { SKILL_DESCRIPTIONS, SKILL_ORDER } from "./rules/constants.js";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }
  return new Anthropic({ apiKey });
}

function stripJsonFence(text) {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function parseJsonSafe(text) {
  const cleaned = stripJsonFence(text);
  return JSON.parse(cleaned);
}

function buildSystemPrompt() {
  return [
    "You are an expert prompt engineer.",
    "Improve the given prompt with surgical edits.",
    "Do not change core intent.",
    "Return valid JSON only."
  ].join(" ");
}

function buildImprovePrompt(promptText, skills) {
  const skillList = skills.map((s) => `- ${s}: ${SKILL_DESCRIPTIONS[s] ?? "Unknown skill"}`).join("\n");
  return `Prompt:\n${promptText}\n\nSkills:\n${skillList}\n\nReturn JSON with this shape:\n{\n  "skills_applied": [{"skill":"name","needed":true,"reason":"...","change":"..."}],\n  "original_prompt":"...",\n  "improved_prompt":"...",\n  "score_before":0,\n  "score_after":0,\n  "score_breakdown": {\n    "before": {"clarity":0,"structure":0,"specificity":0,"output_format":0,"role_definition":0},\n    "after": {"clarity":0,"structure":0,"specificity":0,"output_format":0,"role_definition":0}\n  },\n  "summary":"..."\n}`;
}

function buildDetectPrompt(promptText) {
  return `Pick needed skills from this list only: ${SKILL_ORDER.join(", ")}\n\nPrompt:\n${promptText}\n\nReturn only JSON array of skill names.`;
}

export async function detectSkills(promptText) {
  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [{ role: "user", content: buildDetectPrompt(promptText) }]
  });

  const out = parseJsonSafe(response.content?.[0]?.text ?? "[]");
  if (!Array.isArray(out)) return [];
  return out.filter((s) => SKILL_ORDER.includes(s));
}

export async function improvePrompt(promptText, skills) {
  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2200,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildImprovePrompt(promptText, skills) }]
  });

  return parseJsonSafe(response.content?.[0]?.text ?? "{}");
}
