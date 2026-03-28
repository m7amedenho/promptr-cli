const CONTRADICTIONS = [
  {
    a: /\bbrief|short|concise\b/i,
    b: /\bdetailed|comprehensive|in-depth\b/i,
    issue: "Conflicting length constraints: short vs detailed."
  },
  {
    a: /\balways\b/i,
    b: /\bnever\b/i,
    issue: "Conflicting absolutes: always vs never."
  },
  {
    a: /return only json/i,
    b: /explain|describe why|with reasoning/i,
    issue: "JSON-only output conflicts with explanation request."
  }
];

export function applyConstraintGuard(promptText) {
  const warnings = CONTRADICTIONS
    .filter((rule) => rule.a.test(promptText) && rule.b.test(promptText))
    .map((rule) => rule.issue);

  if (warnings.length === 0) {
    return {
      skill: "constraint-guard",
      needed: false,
      reason: "No contradictions detected.",
      change: "No change needed",
      improved: promptText
    };
  }

  return {
    skill: "constraint-guard",
    needed: true,
    reason: `Detected ${warnings.length} contradictory instruction(s).`,
    change: "Flagged contradictions for manual review.",
    improved: promptText,
    warnings
  };
}
