const VAGUE_PHRASES = [
  /\bbe helpful\b/gi,
  /\bdo (your |the )?best\b/gi,
  /\betc\.?\b/gi,
  /\band so on\b/gi,
  /\bas needed\b/gi,
  /\bif necessary\b/gi,
  /\bkind of\b|\bsort of\b/gi,
  /\bmaybe\b|\bperhaps\b/gi
];

export function applyClarity(promptText) {
  const hits = VAGUE_PHRASES.reduce((count, rx) => count + (promptText.match(rx)?.length ?? 0), 0);

  if (hits === 0) {
    return {
      skill: "clarity",
      needed: false,
      reason: "No major vague phrases found.",
      change: "No change needed",
      improved: promptText
    };
  }

  let improved = promptText
    .replace(/\bbe helpful\b/gi, "be accurate and specific")
    .replace(/\bdo (your |the )?best\b/gi, "provide the most accurate result")
    .replace(/\betc\.?\b/gi, "")
    .replace(/\band so on\b/gi, "")
    .replace(/\bkind of\b|\bsort of\b/gi, "")
    .replace(/\bmaybe\b|\bperhaps\b/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    skill: "clarity",
    needed: true,
    reason: `Found ${hits} vague phrase(s).`,
    change: "Rewrote or removed ambiguous wording.",
    improved
  };
}
