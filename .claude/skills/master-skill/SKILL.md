---
name: master-skill
description: Analyze the current project and automatically invoke all applicable skills in sequence without asking for confirmation. Use when the user wants a one-shot "apply all relevant skills" pass. Triggers include "run master skill", "/master-skill", and "apply all skills to this project".
---

# Master Skill

Analyze the current project, decide which of the available skills are applicable, then invoke each of them sequentially via the Skill tool. DO NOT ask the user for approval between invocations — the user has pre-authorized this flow by invoking master-skill.

The authoritative list of available skills is in the `<system-reminder>` of this session under "available skills". Do not invoke a skill that does not appear there. The table below describes the skills you can reason about; cross-check each against the current session's available-skills list before invoking.

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

Run these in parallel (use `Read`, `Glob`, `Grep`, and `Bash` as appropriate). ALWAYS exclude `.claude/skills/**` from greps and scans — those are skill definitions, not project code, and matching them causes false positives.

Collect these signals:

- **Repo shape**: `ls` the repo root. Detect monorepos — if multiple sibling directories contain their own manifest files, treat each as its own sub-project.
- **Manifests** (per sub-project if monorepo, else at root):
  - JavaScript/TypeScript: `package.json`
  - Python: `pyproject.toml`, `requirements.txt`, `setup.py`
  - Rust: `Cargo.toml`
  - Go: `go.mod`
  - Ruby: `Gemfile`
  - **Android/JVM**: `build.gradle`, `build.gradle.kts`, `settings.gradle*`, `pom.xml`
  - **.NET**: `*.csproj`, `*.sln`
- **Claude config**: `CLAUDE.md` at root and in each sub-project; `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks/`.
- **Git state**: `git status`, `git diff`, `git diff --cached`, `git log --oneline -10`, current branch name.
- **GitHub PRs**: if a GitHub MCP tool is available, call `mcp__github__list_pull_requests` filtered by `head=<owner>:<current-branch>` and `state=open`. Extract `.number` from the first result if any.
- **SDK usage**: Grep for `from anthropic`, `import anthropic`, `@anthropic-ai/sdk` — BUT exclude `.claude/` and `node_modules/` paths. Only real project source files count.
- **Changed-file sensitivity**: if `git diff` is non-empty, extract the filenames. Mark a change as "sensitive" if any changed path matches regex `(auth|login|session|crypto|password|secret|token|sql|query|db/|database|api/|endpoint|route|webhook)` (case-insensitive) or if the diff contains `SELECT|INSERT|UPDATE|DELETE|exec|eval|dangerouslySet` (case-insensitive).

Collect all signals before deciding. Do not invoke any skill in Step 1.

## Step 2 — Decide Which Skills to Invoke

Apply the rules below in order. A rule fires only if **both** its condition holds AND the skill name appears in this session's available-skills list.

| # | Condition | Skill | Args |
|---|---|---|---|
| 1 | No `CLAUDE.md` at root (non-monorepo) OR no `CLAUDE.md` in any sub-project (monorepo) | `init` | (none) — for monorepos, include a note naming the sub-projects that need it |
| 2 | No `.claude/hooks/session-start.sh` AND at least one supported manifest exists anywhere in the repo | `session-start-hook` | (none) |
| 3 | `git diff` (unstaged or staged) is non-empty, ignoring changes confined to `.claude/skills/**` and to `CLAUDE.md` | `simplify` | (none) |
| 4 | Rule 3 fires AND the diff is marked "sensitive" per Step 1 | `security-review` | (none) |
| 5 | An open PR exists for the current branch (PR number found via MCP) | `review` | `PR #<number>` |
| 6 | SDK grep returned matches in project source (not `.claude/`, not `node_modules/`) | `claude-api` | short summary: `"SDK imports found in: <file list>"` |
| 7 | `.claude/settings.json` is missing OR has no `permissions.allow` key, AND you see evidence in the current session of >=3 denied/awaiting permission prompts | `fewer-permission-prompts` | (none) |

Do NOT auto-invoke these — they require explicit user intent:

- `update-config` — only when user stated a specific config change
- `keybindings-help` — only when user stated a specific keybinding change
- `loop` — only when user stated an interval and target command

If no rules fired, skip to Step 4 with an empty queue.

## Step 3 — Invoke Skills Sequentially

If the queue is empty, report that and stop. Otherwise, for each queued skill:

1. Call the Skill tool with `skill` = the skill name and `args` = the prepared args (if any).
2. Wait for the skill to complete before starting the next.
3. If the invoked skill asks a mid-flow question that can be answered from the signals gathered in Step 1, answer it directly. Only break to ask the user if the decision truly cannot be inferred from project context.

Never invoke skills in parallel — later skills may depend on state produced by earlier ones (e.g. `simplify` edits files that `security-review` should then see).

## Step 4 — Summary Report

Emit a concise report to the user:

- **Signals found** (one-liner each: repo shape, manifests, git, PR, SDK)
- **Skills invoked** (in order) + one-line outcome for each
- **Files created or modified**
- **Skills skipped** + reason (condition not met, or not in available-skills list)
- **User actions still required** (e.g. approve a PR, resolve a merge conflict, enter a secret)
