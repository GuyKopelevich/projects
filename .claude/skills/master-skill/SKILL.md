---
name: master-skill
description: Analyze the current project and automatically invoke all applicable skills in sequence without asking for confirmation. Use when the user wants a one-shot "apply all relevant skills" pass. Triggers include "run master skill", "/master-skill", and "apply all skills to this project".
---

# Master Skill

Analyze the current project, decide which of the available skills are applicable, then invoke each of them sequentially via the Skill tool. DO NOT ask the user for approval between invocations — the user has pre-authorized this flow by invoking master-skill.

## Source of Truth for Skill Names

The authoritative list of available skills is the `<system-reminder>` of this session under "available skills". Build a **deduplicated set** from that list (a skill that is installed at both user-level and project-level appears twice — treat as one). Do not invoke any skill whose name is not in that set. The table below describes the skills you can reason about; it is documentation, not the source of truth.

## Safety Guards

- **Never invoke `master-skill` from inside `master-skill`** — that is an infinite loop. Remove it from the queue if it ever appears.
- **Never invoke skills in parallel** — later skills may depend on state produced by earlier ones.
- **If a skill invocation fails**, report the error, continue with the remaining queue, and include the failure in the Step 4 report.

## Known Skills

| Skill | What it does |
|---|---|
| `init` | Create a new `CLAUDE.md` documenting the codebase. |
| `session-start-hook` | Create a `.claude/hooks/session-start.sh` that installs deps for Claude Code on the web, and register it in `.claude/settings.json`. |
| `simplify` | Review the current diff for reuse, quality, and efficiency; fix issues found. |
| `security-review` | Security review of changes on the current branch (SQLi, XSS, command injection, etc). |
| `review` | Review a pull request. |
| `claude-api` | Build/debug/optimize code that uses the Anthropic SDK (`anthropic` / `@anthropic-ai/sdk`): prompt caching, thinking, tool use, batch, files, citations, memory; model migrations. |
| `fewer-permission-prompts` | Scan prior transcripts for repeated read-only Bash/MCP calls and add a prioritized allowlist to `.claude/settings.json`. |
| `update-config` | Edit `settings.json` — permissions, env vars, hooks (SessionStart/PreToolUse/PostToolUse/Stop). Any "from now on when X" behavior requires a hook. |
| `keybindings-help` | Customize `~/.claude/keybindings.json`. |
| `loop` | Run a prompt or slash command on a recurring interval (e.g. `/loop 5m /foo`). |

## Step 1 — Gather Project Signals (parallel)

Run these in parallel (use `Read`, `Glob`, `Grep`, and `Bash` as appropriate). ALWAYS exclude `.claude/skills/**` and `node_modules/**` from greps and scans — those are not project code, and matching them causes false positives.

Collect:

- **Repo shape**: `ls` the repo root. Detect monorepos — if multiple sibling directories contain their own manifest files, treat each as its own sub-project.
- **Manifests** (per sub-project if monorepo, else at root):
  - JS/TS: `package.json`
  - Python: `pyproject.toml`, `requirements.txt`, `setup.py`
  - Rust: `Cargo.toml`
  - Go: `go.mod`
  - Ruby: `Gemfile`
  - Android/JVM: `build.gradle`, `build.gradle.kts`, `settings.gradle*`, `pom.xml`, `build.sbt`
  - .NET: `*.csproj`, `*.sln`
  - PHP: `composer.json`
  - Flutter/Dart: `pubspec.yaml`
  - Swift: `Package.swift`
- **Lockfiles (package-manager hint)**: alongside each `package.json`, note which lockfile is present — `bun.lockb` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, otherwise npm. This becomes an arg to `session-start-hook`.
- **Claude config**: `CLAUDE.md` at root and in each sub-project; `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks/`.
- **Git state**: `git status --short`, `git diff --stat`, `git diff --cached --stat`, `git log --oneline -10`, current branch.
- **GitHub PRs**: if a GitHub MCP tool is available, call `mcp__github__list_pull_requests` with `head=<owner>:<current-branch>` and `state=open`. Extract `.number` from the first result if any. If the MCP call errors, log it and continue — this is not fatal.
- **SDK usage**: Grep for `from anthropic`, `import anthropic`, `@anthropic-ai/sdk`, excluding `.claude/` and `node_modules/`. Only project source files count.
- **Changed-file sensitivity**: if `git diff` is non-empty, extract changed filenames. Mark "sensitive" if any changed path matches `(auth|login|session|crypto|password|secret|token|sql|query|db/|database|api/|endpoint|route|webhook)` (case-insensitive) or the diff content contains `SELECT|INSERT|UPDATE|DELETE|\bexec\b|\beval\b|dangerouslySet` (case-insensitive).

Do not invoke any skill during Step 1.

## Step 2 — Decide Which Skills to Invoke

Evaluate the rules below in order. A rule fires only if its condition holds AND the skill name is in the deduplicated available-skills set. The queue inherits this order (so `init` runs before `session-start-hook`, which runs before `simplify`, etc.).

| # | Condition | Skill | Args |
|---|---|---|---|
| 1 | Non-monorepo: `CLAUDE.md` missing at repo root. Monorepo: at least one sub-project is missing its own `CLAUDE.md`. | `init` | monorepo: `"sub-projects missing CLAUDE.md: <comma-separated list>"` |
| 2 | No `.claude/hooks/session-start.sh` AND at least one supported manifest exists anywhere in the repo | `session-start-hook` | `"package managers detected: <npm/bun/pnpm/yarn/gradle/pip/...>; manifests at: <paths>"` |
| 3 | `git diff` (unstaged or staged) is non-empty, ignoring changes confined to `.claude/skills/**` and to `CLAUDE.md` | `simplify` | (none) |
| 4 | Rule 3 fires AND the diff is marked "sensitive" per Step 1 | `security-review` | (none) |
| 5 | An open PR exists for the current branch | `review` | `"PR #<number>"` |
| 6 | SDK grep returned matches in project source | `claude-api` | `"SDK imports in: <file list>"` |

Never auto-invoke these — require explicit user intent:

- `update-config` — needs a specific config change from the user
- `keybindings-help` — needs a specific keybinding change
- `loop` — needs an interval and target command
- `fewer-permission-prompts` — noisy to auto-run; only on explicit request
- `master-skill` — self-invocation guard

If no rules fired, the queue is empty. Skip to Step 4.

## Step 3 — Announce Then Invoke

Before invoking anything, print a one-paragraph plan to the user:

> **Plan:** I will invoke `<skill1>` (reason: …), then `<skill2>` (reason: …). Files likely to change: `<paths>`.

Then invoke each queued skill sequentially via the Skill tool with `skill=<name>` and `args=<prepared args>`. Wait for each to finish before starting the next.

If the invoked skill asks a mid-flow question, answer from the Step 1 signals when possible. Only break to the user if the decision cannot be inferred.

If the queue is empty, say so and stop — no skills to invoke.

## Step 4 — Summary Report

After every queued skill has completed (or failed), emit a concise report:

- **Signals** (one line each: repo shape, manifests + package managers, git, PR, SDK)
- **Skills invoked** (in order) + one-line outcome or error for each
- **Files created or modified**
- **Skills skipped** + reason (condition not met / not in available-skills set / requires explicit user intent)
- **User actions still required** (e.g. approve a PR, resolve a merge conflict, enter a secret)
