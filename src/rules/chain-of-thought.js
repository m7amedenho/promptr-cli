const HAS_COT = [
  /think step by step/i,
  /reason step by step/i,
  /show your reasoning/i,
  /before answering/i
];

const NEEDS_COT = [
  /analy|debug|evaluate|assess|reason|justify/i,
  /plan|strategy|design/i,
  /math|calculate|compute/i,
  /compare|tradeoff|decision/i
];

const SKIP_COT = [
  /translate|paraphrase|rewrite|format|convert/i,
  /simple list|extract only/i
];

export function applyChainOfThought(promptText) {
  if (HAS_COT.some((p) => p.test(promptText))) {
    return {
      skill: "chain-of-thought",
      needed: false,
      reason: "Reasoning instruction already present.",
      change: "No change needed",
      improved: promptText
    };
  }

  if (SKIP_COT.some((p) => p.test(promptText)) || !NEEDS_COT.some((p) => p.test(promptText))) {
    return {
      skill: "chain-of-thought",
      needed: false,
      reason: "Task does not strongly benefit from explicit reasoning steps.",
      change: "No change needed",
      improved: promptText
    };
  }

  const instruction = "Think through the task step by step internally, then provide the final answer clearly.";
  const improved = `${promptText}\n\n${instruction}`;

  return {
    skill: "chain-of-thought",
    needed: true,
    reason: "Task appears reasoning-heavy.",
    change: "Added step-by-step reasoning instruction.",
    improved
  };
}
