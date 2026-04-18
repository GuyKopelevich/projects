---
name: master-skill
description: Analyze the current project and automatically invoke all applicable skills in sequence without asking for confirmation. Use when the user wants a one-shot "apply all relevant skills" pass. Triggers include "run master skill", "/master-skill", and "apply all skills to this project".
---

# Master Skill

Decide which of the available skills apply to this project and invoke them in order. Do NOT ask the user for approval between invocations — pre-authorized by invoking master-skill.

## Source of Truth

Skill names and descriptions come from the `<system-reminder>` "available skills" block already in the conversation (no extra tool calls, no token cost). Build a **deduplicated set** of names from that block (a skill installed at both user and project level appears twice — treat as one). Never invoke a name outside this set.

## Safety Guards

- Never queue `master-skill` itself (infinite loop).
- Never run queued skills in parallel — later skills may depend on earlier ones' writes.
- If a skill invocation fails, log the error and continue the remaining queue.

## Step 1 — Gather Signals (parallel, single batch)

Run in parallel. Exclude `.claude/skills/**`, `node_modules/**`, `.git/**` from all greps.

1. **Repo shape**: `ls` root. If multiple sibling dirs have their own manifest → monorepo; treat each as a sub-project.
2. **Manifests** (any of): `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `Cargo.toml`, `go.mod`, `Gemfile`, `build.gradle*`, `settings.gradle*`, `pom.xml`, `build.sbt`, `*.csproj`, `*.sln`, `composer.json`, `pubspec.yaml`, `Package.swift`.
3. **Package manager** (next to each `package.json`): `bun.lockb`→bun, `pnpm-lock.yaml`→pnpm, `yarn.lock`→yarn, else npm.
4. **Claude config**: `CLAUDE.md` at root + per sub-project; `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks/session-start.sh`.
5. **Git**: `git status --short`, `git diff --stat`, `git diff --cached --stat`, current branch.
6. **Open PR**: call `mcp__github__list_pull_requests` with `head=<owner>:<branch>`, `state=open` if MCP available. Grab `.number` from first result. Soft-fail on error.
7. **SDK use**: grep for `from anthropic|import anthropic|@anthropic-ai/sdk` in project source (respecting exclusions above).
8. **Sensitive diff**: if diff non-empty, flag sensitive when changed path matches `(auth|login|session|crypto|password|secret|token|sql|query|db/|database|api/|endpoint|route|webhook)` (case-insensitive) OR diff content contains `SELECT|INSERT|UPDATE|DELETE|\bexec\b|\beval\b|dangerouslySet`.

## Step 2 — Build Queue

Evaluate rules in order. A rule fires only if its condition holds AND the skill is in the available-skills set. Preserve rule order when building the queue.

| # | Condition | Skill | Args |
|---|---|---|---|
| 1 | Non-monorepo: `CLAUDE.md` missing at root. Monorepo: at least one sub-project is missing its own `CLAUDE.md`. | `init` | monorepo: `"sub-projects missing CLAUDE.md: <list>"` |
| 2 | No `.claude/hooks/session-start.sh` AND at least one manifest exists anywhere | `session-start-hook` | `"package managers: <list>; manifests at: <paths>"` |
| 3 | `git diff` non-empty, ignoring `.claude/skills/**` and `CLAUDE.md` | `simplify` | (none) |
| 4 | Rule 3 fires AND diff is sensitive | `security-review` | (none) |
| 5 | Open PR for current branch found | `review` | `"PR #<number>"` |
| 6 | SDK grep matched project source | `claude-api` | `"SDK imports in: <files>"` |

**Fallback for new/unknown skills** — after evaluating the rules above, iterate any other name in the available-skills set NOT already considered. Read its description from the system-reminder. If its description trigger criteria match the Step 1 signals (e.g. a description like "when code imports X" matches a grep hit you already have), queue it. Use a neutral arg summarizing the matching signal.

**Never auto-queue** (require explicit user intent in the original invocation args):
`update-config`, `keybindings-help`, `loop`, `fewer-permission-prompts`, `master-skill`.

## Step 3 — Announce and Invoke

If queue empty: tell the user "no applicable skills" and stop.

Otherwise print one line:
> **Plan:** `<skill1>` → `<skill2>` → ... (reasons: ...)

Then invoke each via the Skill tool sequentially (wait for completion before the next). If a queued skill asks a mid-flow question, answer from Step 1 signals when possible.

## Step 4 — Report

One compact block:

- **Signals**: repo shape, manifests+pkgmgrs, git, PR, SDK (one line each)
- **Invoked**: `skill` → one-line outcome (repeat per skill)
- **Skipped**: `skill` → reason (rule miss / not in set / explicit-intent-only)
- **Follow-ups**: anything the user must do next
