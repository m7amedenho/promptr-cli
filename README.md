# promptr

[![npm version](https://img.shields.io/npm/v/promptr-cli?style=for-the-badge)](https://www.npmjs.com/package/promptr-cli)
[![npm downloads](https://img.shields.io/npm/dm/promptr-cli?style=for-the-badge)](https://www.npmjs.com/package/promptr-cli)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=for-the-badge)](https://nodejs.org)

> Lightweight Prompt Engineering CLI for developers. Improve prompts with offline rules or optional LLM mode.
<pre>
  ```text
  ██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗
  ██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║   ██████╔╝
  ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║   ██╔══██╗
  ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║   ██║  ██║
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝   ╚═╝  ╚═╝
```
</pre>


## What is promptr?

`promptr` is an offline-first CLI that analyzes and improves prompts using practical prompt-engineering skills.

- Fast, local, and deterministic in offline mode
- Deeper rewriting in `--llm` mode (Anthropic)
- Clear before/after scoring and skill-level changes

## Installation

```bash
npm install -g promptr-cli
```

Local development:

```bash
npm install
npm link
promptr skills
```

## Quick Start

```bash
# show skills
promptr skills

# offline auto-improve
promptr improve ./prompt.txt --auto

# offline auto-improve + save
promptr improve ./prompt.txt --auto --save

# manual skill selection
promptr improve ./prompt.txt --skills clarity,output-format,role-injection

# llm mode
promptr improve ./prompt.txt --auto --llm
```

## CLI Reference

### `promptr skills`

Lists all available skills.

```bash
promptr skills
```

### `promptr improve <file>`

Improves a prompt file.

```bash
promptr improve <file> [options]
```

Options:

- `--auto`: auto-detect needed skills
- `--skills <comma-separated>`: apply selected skills only
- `--save`: save output as `<input>.improved.txt`
- `--llm`: use Anthropic-powered mode

## Modes

### Offline mode (default)

Best for speed, privacy, and zero API cost.

```bash
promptr improve ./prompt.txt --auto
```

### LLM mode (`--llm`)

Best for nuanced prompts and deeper rewrites.

```bash
promptr improve ./prompt.txt --auto --llm
```

## Use Both Modes Together (Recommended)

```bash
# Step 1: quick cleanup offline
promptr improve ./prompt.txt --auto --save

# Step 2: deeper refinement with llm
promptr improve ./prompt.improved.txt --auto --llm --save
```

## LLM Setup

Set your Anthropic API key:

```bash
# PowerShell
$env:ANTHROPIC_API_KEY="your_api_key"

# bash/zsh
export ANTHROPIC_API_KEY="your_api_key"
```

## Built With

- Offline engine: custom rule-based prompt optimization
- LLM mode: Anthropic Claude via `@anthropic-ai/sdk`

## Skills

| Skill | Description |
|---|---|
| `clarity` | Remove vague instructions and improve precision |
| `role-injection` | Add a strong role/persona |
| `output-format` | Enforce explicit output structure |
| `chain-of-thought` | Add reasoning guidance for complex tasks |
| `constraint-guard` | Detect contradictory instructions |
| `token-trim` | Remove filler and redundant wording |

## Example

Input:

```text
be helpful and summarize this article and so on. do your best.
```

Run:

```bash
promptr improve ./sample-prompt.txt --auto --save
```

Expected improvements:

- Adds role definition
- Rewrites vague phrases
- Adds clear output format
- Raises prompt quality score

## Author

**Mohamed Hamed**

Built for developers who want fast, practical prompt engineering workflows.
#
