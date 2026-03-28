const FORMAT_PATTERNS = [
  /json|markdown|yaml|xml|csv|table|bullet|numbered list/i,
  /respond with|return only|format/i
];

const TASK_FORMAT_MAP = [
  { pattern: /extract|parse|fields|schema/i, format: "Return only valid JSON." },
  { pattern: /compare|difference|versus|vs\.?/i, format: "Return a markdown table with clear headers." },
  { pattern: /steps|how to|guide|tutorial/i, format: "Return a numbered list of steps." },
  { pattern: /summary|summarize/i, format: "Return 3-5 bullet points." }
];

const DEFAULT_FORMAT = "Return a structured answer with short sections and bullet points where useful.";

export function applyOutputFormat(promptText) {
  if (FORMAT_PATTERNS.some((p) => p.test(promptText))) {
    return {
      skill: "output-format",
      needed: false,
      reason: "Output format already specified.",
      change: "No change needed",
      improved: promptText
    };
  }

  const format = TASK_FORMAT_MAP.find((item) => item.pattern.test(promptText))?.format ?? DEFAULT_FORMAT;
  const improved = `${promptText}\n\nOutput format: ${format}`;

  return {
    skill: "output-format",
    needed: true,
    reason: "Prompt does not define output format.",
    change: `Added format instruction: ${format}`,
    improved
  };
}
