export const SKILL_DESCRIPTIONS = {
  clarity: "Remove vague language and make instructions explicit.",
  "role-injection": "Add a clear role/persona for better model behavior.",
  "output-format": "Specify an exact output format (JSON, Markdown, bullets).",
  "chain-of-thought": "Add step-by-step reasoning when tasks need deeper logic.",
  "constraint-guard": "Detect contradictory instructions that confuse the model.",
  "token-trim": "Remove filler and repeated words without changing intent."
};

export const SKILL_ORDER = [
  "role-injection",
  "clarity",
  "output-format",
  "chain-of-thought",
  "constraint-guard",
  "token-trim"
];
