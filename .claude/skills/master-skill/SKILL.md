---
name: master-skill
description: Analyzes the current project, selects all applicable skills, and invokes them sequentially. Use when the user wants a one-shot "apply all relevant skills to this repo" pass. Triggers include "run master skill", "/master-skill", "apply all skills", and "dispatch skills". Auto-adapts to newly installed skills without edits to this file.
---

# Master Skill

Orchestrates other skills: gathers project signals once, decides which skills apply, then invokes them sequentially via the Skill tool. Pre-authorized by the user — does not prompt between invocations (exception: safety confirmations in Step 0).

## Contents

- [Arguments](#arguments) — dry-run, force, only, skip
- [Step 0 — Safety Pre-flight](#step-0--safety-pre-flight)
- [Step 1 — Gather Signals](#step-1--gather-signals)
- [Step 2 — Build Queue](#step-2--build-queue)
- [Step 3 — Announce and Invoke](#step-3--announce-and-invoke)
- [Step 4 — Report](#step-4--report)
- [Gotchas](GOTCHAS.md) — mistakes to avoid
- [Evaluations](evaluations.md) — test scenarios A–F

## Arguments

Parse the `args` string (if any) for these tokens, in any order:

- `dry-run` or `plan` — complete Steps 0–2 and print the queue; do NOT invoke anything in Step 3.
- `force` — skip the protected-branch check in Step 0.
- `only=<skill1,skill2,...>` — after Step 2, filter the queue to these names only.
- `skip=<skill1,skill2,...>` — after Step 2, remove these names from the queue.

Unknown args: ignore and continue.

## Source of Truth

The authoritative list of available skills is the `<system-reminder>` "available skills" block already in context (no tool calls, no extra tokens). Build a **deduplicated set** of names from that block (a skill installed at both user and project levels appears twice — treat as one). Never invoke a name outside this set.

## Step 0 — Safety Pre-flight

Run these checks in order. If any fails, stop and report which guard tripped.

1. **In a git repo?** `git rev-parse --show-toplevel`. If non-zero exit → abort with "not a git repo; master-skill only operates inside a git working tree".
2. **Protected branch?** Current branch matches `main|master|trunk|production|release/.*|hotfix/.*` — and `force` is NOT in args — then restrict the queue to read-only skills only: `review`, `security-review`. Report the restriction.
3. **Dirty tree warning (informational)**: count modified + untracked files. Pass the number as context to each skill so they know to be careful. Do not abort.
4. **Huge-diff warning**: if total diff exceeds 500 lines AND the user did not include `force`, mark `simplify` as requiring user confirmation; keep it in the queue but ask inline before invoking.

## Step 1 — Gather Signals (parallel, single batch)

Run these in parallel. Always exclude `.claude/skills/**`, `node_modules/**`, `.git/**`, `dist/**`, `build/**` from file scans.

1. **Repo shape**: `ls` repo root. If ≥2 sibling dirs each contain their own manifest → monorepo; treat each as a sub-project.
2. **Manifests** (check per sub-project if monorepo): `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `Cargo.toml`, `go.mod`, `Gemfile`, `build.gradle*`, `settings.gradle*`, `pom.xml`, `build.sbt`, `*.csproj`, `*.sln`, `composer.json`, `pubspec.yaml`, `Package.swift`.
3. **Package manager** (next to each `package.json`): `bun.lockb`→bun, `pnpm-lock.yaml`→pnpm, `yarn.lock`→yarn, else npm.
4. **Claude config**: `CLAUDE.md` at root and each sub-project; `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks/session-start.sh`.
5. **Git**: `git status --short`, `git diff --stat`, `git diff --cached --stat`, current branch, commit count ahead of default branch.
6. **Open PR**: if a GitHub MCP tool is available, call `mcp__github__list_pull_requests` with `head=<owner>:<branch>`, `state=open`. Take `.number` from the first result. Soft-fail on error.
7. **SDK use**: grep for `from anthropic|import anthropic|@anthropic-ai/sdk` respecting the exclusions above.
8. **Sensitive diff**: if diff non-empty, flag as sensitive when any changed path matches `(auth|login|session|crypto|password|secret|token|sql|query|db/|database|api/|endpoint|route|webhook)` (case-insensitive) OR the diff content contains `SELECT|INSERT|UPDATE|DELETE|\bexec\b|\beval\b|dangerouslySet`.

## Step 2 — Build Queue

Evaluate rules in order. A rule fires only if its condition holds AND the target skill is in the available-skills set.

| # | Condition | Skill | Args to pass |
|---|---|---|---|
| 1 | Non-monorepo: `CLAUDE.md` missing at root. Monorepo: at least one sub-project is missing its own `CLAUDE.md`. | `init` | monorepo: `"sub-projects missing CLAUDE.md: <list>"` |
| 2 | No `.claude/hooks/session-start.sh` AND ≥1 manifest exists | `session-start-hook` | `"package managers: <list>; manifests at: <paths>"` |
| 3 | `git diff` non-empty, ignoring `.claude/skills/**` and `CLAUDE.md` | `simplify` | (none) |
| 4 | Rule 3 fires AND diff is sensitive | `security-review` | (none) |
| 5 | Open PR exists for current branch | `review` | `"PR #<number>"` |
| 6 | SDK grep matched project source | `claude-api` | `"SDK imports in: <files>"` |

**Auto-adapt fallback** — after evaluating the rules above, iterate every remaining name in the available-skills set that has NOT been considered by rules 1–6 and is not in the explicit-intent list below. For each such skill:

1. Read its description from the system-reminder.
2. Extract trigger criteria. Recognize these patterns:
   - `"Use when X"`, `"TRIGGER when: X"`, `"Triggers: X"`, `"trigger: X"`
   - `"when the user ..."`, `"when code imports X"`, `"for <file pattern>"`
3. Match extracted criteria against Step 1 signals (manifests, git state, PR, SDK, sensitive diff, monorepo, etc.).
4. If a criterion matches, queue the skill with a neutral arg summarizing the matching signal (e.g. `"triggered by: SDK imports in src/ai.ts"`).

**Never auto-queue** (explicit user intent required — user must name them in the original master-skill invocation args):
`update-config`, `keybindings-help`, `loop`, `fewer-permission-prompts`, `master-skill`.

**Apply arg filters**: if `only=...` is set, keep only listed skills. If `skip=...` is set, remove listed skills.

## Step 3 — Announce and Invoke

If queue is empty: report "no applicable skills" and stop.

Print a single plan line:
> **Plan:** `skill1` → `skill2` → ... (reasons: one-line per skill)

If `dry-run` or `plan` is in args: stop here; do not invoke.

Otherwise, invoke each queued skill sequentially via the Skill tool (`skill=<name>`, `args=<prepared args>`). Wait for each to complete before the next. If an invoked skill asks a mid-flow question, answer from Step 1 signals when possible; only defer to the user if unresolvable.

If an invocation fails, record the error and continue with the remaining queue. Never leave the working tree in a half-committed state without reporting it.

## Step 4 — Report

One compact block:

- **Signals**: repo shape, manifests+pkgmgrs, git (branch / diff size / ahead), PR, SDK
- **Invoked**: `skill` → outcome or error (one line each, in order)
- **Skipped**: `skill` → reason (rule miss / not in set / explicit-intent-only / arg filter)
- **Follow-ups**: anything the user must do next (approve PR, resolve conflict, enter secret)

## Design Notes

- **Auto-adapt**: the fallback in Step 2 means adding a new skill to `~/.claude/skills/` or `.claude/skills/` picks it up automatically — no edits to this SKILL.md needed, as long as the new skill's description uses a recognizable trigger phrase.
- **Token cost**: this file is ~150 lines; `<system-reminder>` descriptions are free (already in context). The only per-invocation cost is this file plus each invoked skill's own SKILL.md.
- **Third person throughout**: the description and body refer to "master-skill", not "I" or "you".
