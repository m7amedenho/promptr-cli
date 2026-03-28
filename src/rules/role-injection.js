const ROLE_PATTERNS = [
  /you are (a|an|the)/i,
  /act as (a|an|the)/i,
  /your role is/i
];

const TASK_ROLE_MAP = [
  { pattern: /debug|refactor|code|function|program/i, role: "You are a senior software engineer focused on correctness and maintainability." },
  { pattern: /summar/i, role: "You are an expert summarizer who extracts key points clearly." },
  { pattern: /translate/i, role: "You are a professional translator preserving intent and tone." },
  { pattern: /analy|review|evaluate/i, role: "You are a critical analyst who provides precise, evidence-based reasoning." }
];

const DEFAULT_ROLE = "You are an expert AI assistant that follows instructions precisely.";

export function applyRoleInjection(promptText) {
  if (ROLE_PATTERNS.some((p) => p.test(promptText))) {
    return {
      skill: "role-injection",
      needed: false,
      reason: "Role/persona already exists.",
      change: "No change needed",
      improved: promptText
    };
  }

  const role = TASK_ROLE_MAP.find((item) => item.pattern.test(promptText))?.role ?? DEFAULT_ROLE;
  const improved = `${role}\n\n${promptText}`;

  return {
    skill: "role-injection",
    needed: true,
    reason: "Prompt has no explicit role/persona.",
    change: `Added role: ${role}`,
    improved
  };
}
