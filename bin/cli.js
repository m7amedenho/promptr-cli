#!/usr/bin/env node

import fs from "node:fs";
import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { runAuto, runEngine } from "../src/engine.js";
import { SKILL_DESCRIPTIONS } from "../src/rules/constants.js";

function printScore(label, score) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const full = Math.round(safeScore / 5);
  const bar = "#".repeat(full) + "-".repeat(20 - full);
  const color = safeScore >= 80 ? chalk.green : safeScore >= 60 ? chalk.yellow : chalk.red;
  console.log(`  ${label.padEnd(10)} ${color(bar)} ${color(`${safeScore}/100`)}`);
}

function printBreakdown(title, breakdown) {
  if (!breakdown) return;
  console.log(`\n  ${title}:`);
  for (const [k, v] of Object.entries(breakdown)) {
    console.log(`    ${k.padEnd(16)} ${v}/20`);
  }
}

function printResult(result) {
  console.log(`\nMode: ${result.mode}`);
  printScore("Before", result.score_before);
  printScore("After", result.score_after);

  if (result.score_breakdown) {
    printBreakdown("Before", result.score_breakdown.before);
    printBreakdown("After", result.score_breakdown.after);
  }

  console.log("\nSkills:");
  for (const s of result.skills_applied ?? []) {
    const icon = s.needed ? "+" : "-";
    console.log(`  ${icon} ${s.skill}: ${s.reason}`);
    if (s.needed && s.change) console.log(`    -> ${s.change}`);
    if (s.warnings) {
      for (const w of s.warnings) console.log(`    ! ${w}`);
    }
  }

  console.log(`\nSummary: ${result.summary ?? "No summary"}`);
  console.log("\nImproved Prompt:\n");
  console.log(result.improved_prompt ?? "");
}

program.name("promptr").description("Offline-first prompt improver CLI").version("1.0.0");

program
  .command("skills")
  .description("List available skills")
  .action(() => {
    console.log("Available skills:\n");
    for (const [name, desc] of Object.entries(SKILL_DESCRIPTIONS)) {
      console.log(`- ${name}: ${desc}`);
    }
  });

program
  .command("improve <file>")
  .description("Improve a prompt file")
  .option("--skills <skills>", "Comma-separated skills")
  .option("--auto", "Auto-detect needed skills", false)
  .option("--llm", "Use LLM mode (requires ANTHROPIC_API_KEY)", false)
  .option("--save", "Save improved prompt to <input>.improved.txt", false)
  .action(async (file, options) => {
    if (!fs.existsSync(file)) {
      console.error(chalk.red(`File not found: ${file}`));
      process.exit(1);
    }

    if (options.llm && !process.env.ANTHROPIC_API_KEY) {
      console.error(chalk.red("ANTHROPIC_API_KEY is required with --llm."));
      process.exit(1);
    }

    const promptText = fs.readFileSync(file, "utf8").trim();
    const spinner = ora("Processing prompt...").start();

    try {
      let result;
      if (options.auto || !options.skills) {
        result = await runAuto(promptText, options.llm);
      } else {
        const skills = options.skills.split(",").map((s) => s.trim());
        result = await runEngine(promptText, skills, options.llm);
      }

      spinner.succeed("Done.");
      printResult(result);

      if (options.save) {
        const out = file.replace(/(\.[^.]*)?$/, ".improved.txt");
        fs.writeFileSync(out, result.improved_prompt ?? "", "utf8");
        console.log(chalk.green(`\nSaved: ${out}`));
      }
    } catch (error) {
      spinner.fail("Failed.");
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program.parse();
