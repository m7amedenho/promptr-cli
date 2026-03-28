import { RULES, autoDetectSkills, normalizeSkills, scorePrompt } from "./rules/index.js";
import { SKILL_ORDER } from "./rules/constants.js";
import { detectSkills as llmDetectSkills, improvePrompt as llmImprovePrompt } from "./improver.js";

function buildSummary(skillsApplied, before, after) {
  const changed = skillsApplied.filter((s) => s.needed).map((s) => s.skill);
  const diff = after - before;

  if (changed.length === 0) {
    return "No major improvements were needed.";
  }

  const deltaText = diff >= 0 ? `+${diff}` : `${diff}`;
  return `Applied ${changed.length} skill(s): ${changed.join(", ")}. Score change: ${deltaText}.`;
}

function runOffline(promptText, skills) {
  const scoreBefore = scorePrompt(promptText);
  let current = promptText;
  const skillsApplied = [];

  for (const skill of skills) {
    const rule = RULES[skill];
    if (!rule) {
      skillsApplied.push({
        skill,
        needed: false,
        reason: "Unknown skill.",
        change: "Skipped"
      });
      continue;
    }

    const result = rule(current);
    skillsApplied.push({
      skill: result.skill,
      needed: result.needed,
      reason: result.reason,
      change: result.change,
      ...(result.warnings ? { warnings: result.warnings } : {})
    });

    if (result.needed) current = result.improved;
  }

  const scoreAfter = scorePrompt(current);
  return {
    mode: "offline",
    skills_applied: skillsApplied,
    original_prompt: promptText,
    improved_prompt: current,
    score_before: scoreBefore.total,
    score_after: scoreAfter.total,
    score_breakdown: {
      before: scoreBefore.breakdown,
      after: scoreAfter.breakdown
    },
    summary: buildSummary(skillsApplied, scoreBefore.total, scoreAfter.total)
  };
}

export async function detectSkills(promptText, useLLM = false) {
  if (!useLLM) return autoDetectSkills(promptText);

  const detected = await llmDetectSkills(promptText);
  const normalized = normalizeSkills(detected);
  return normalized.length > 0 ? normalized : autoDetectSkills(promptText);
}

export async function runEngine(promptText, skills, useLLM = false) {
  const normalized = normalizeSkills(skills);
  const finalSkills = normalized.length > 0 ? normalized : SKILL_ORDER;

  if (!useLLM) return runOffline(promptText, finalSkills);

  const llmResult = await llmImprovePrompt(promptText, finalSkills);
  return {
    mode: "llm",
    ...llmResult
  };
}

export async function runAuto(promptText, useLLM = false) {
  const skills = await detectSkills(promptText, useLLM);
  const result = await runEngine(promptText, skills, useLLM);
  return {
    ...result,
    auto_detected_skills: skills
  };
}
