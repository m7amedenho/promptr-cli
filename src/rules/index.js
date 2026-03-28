import { applyClarity } from "./clarity.js";
import { applyRoleInjection } from "./role-injection.js";
import { applyOutputFormat } from "./output-format.js";
import { applyChainOfThought } from "./chain-of-thought.js";
import { applyConstraintGuard } from "./constraint-guard.js";
import { applyTokenTrim } from "./token-trim.js";
import { SKILL_ORDER } from "./constants.js";

export const RULES = {
  "role-injection": applyRoleInjection,
  clarity: applyClarity,
  "output-format": applyOutputFormat,
  "chain-of-thought": applyChainOfThought,
  "constraint-guard": applyConstraintGuard,
  "token-trim": applyTokenTrim
};

export function normalizeSkills(skills = []) {
  const valid = new Set(SKILL_ORDER);
  return skills.filter((s) => valid.has(s));
}

export function autoDetectSkills(promptText) {
  const found = [];
  for (const skill of SKILL_ORDER) {
    const result = RULES[skill](promptText);
    if (result.needed) found.push(skill);
  }
  return found;
}

export function scorePrompt(promptText) {
  const text = promptText.toLowerCase();
  const words = promptText.trim().split(/\s+/).filter(Boolean).length;

  let clarity = 20;
  let structure = 20;
  let specificity = 20;
  let output_format = 20;
  let role_definition = 20;

  if (/etc\.|and so on|maybe|perhaps/.test(text)) clarity -= 6;
  if (words < 15) structure -= 8;
  if (!/\n/.test(promptText)) structure -= 2;
  if (!/must|exactly|at least|at most|only|return/.test(text)) specificity -= 6;
  if (!/json|markdown|table|bullet|format|return/.test(text)) output_format -= 10;
  if (!/you are|act as|your role is/.test(text)) role_definition -= 12;

  clarity = Math.max(0, clarity);
  structure = Math.max(0, structure);
  specificity = Math.max(0, specificity);
  output_format = Math.max(0, output_format);
  role_definition = Math.max(0, role_definition);

  const total = clarity + structure + specificity + output_format + role_definition;
  return {
    total,
    breakdown: { clarity, structure, specificity, output_format, role_definition }
  };
}
