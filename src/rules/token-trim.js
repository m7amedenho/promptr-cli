const FILLER_PATTERNS = [
  [/\bplease note that\b/gi, ""],
  [/\bit is important to note that\b/gi, ""],
  [/\bas an ai language model\b/gi, ""],
  [/\bi want you to\b/gi, ""],
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"]
];

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function applyTokenTrim(promptText) {
  const before = countWords(promptText);
  let improved = promptText;

  for (const [pattern, replacement] of FILLER_PATTERNS) {
    improved = improved.replace(pattern, replacement);
  }

  improved = improved
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const after = countWords(improved);
  const saved = before - after;

  if (saved < 3) {
    return {
      skill: "token-trim",
      needed: false,
      reason: "No significant filler found.",
      change: "No change needed",
      improved: promptText
    };
  }

  return {
    skill: "token-trim",
    needed: true,
    reason: "Removed filler words that do not add task value.",
    change: `Removed about ${saved} word(s).`,
    improved
  };
}
