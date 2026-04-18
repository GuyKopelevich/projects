---
name: master-skill
description: Analyze the current project and automatically invoke all applicable skills in sequence without asking for confirmation. Use when the user wants a one-shot "apply all relevant skills" pass. Triggers include "run master skill", "/master-skill", and "apply all skills to this project".
---

# Master Skill

Analyze the current project, decide which of the available skills are applicable, then invoke each of them sequentially via the Skill tool. DO NOT ask the user for approval between invocations — the user has pre-authorized this flow by invoking master-skill.

The authoritative list of available skills is in the `<system-reminder>` of this session under "available skills". Do not invoke a skill that does not appear there. The table below describes the ten skills you can reason about; cross-check each against the current session's available-skills list before invoking.

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

Read in parallel (use `Read`, `Glob`, `Grep`, and `Bash` as appropriate):

- Manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `Gemfile`
- Claude config: `CLAUDE.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/hooks/`
- Git state: `git status`, `git diff`, `git log --oneline -10`, current branch name
- GitHub PRs: `mcp__github__list_pull_requests` for the current branch, if the MCP is available
- SDK usage: Grep for `from anthropic`, `import anthropic`, `@anthropic-ai/sdk`

Collect the signals before deciding anything — do not invoke skills during this step.

## Step 2 — Decide Which Skills to Invoke

Apply the rules below in order. For each row whose condition holds AND whose skill appears in this session's available-skills list, queue the skill.

| Condition | Skill | Args |
|---|---|---|
| No `CLAUDE.md` at the repo root | `init` | (none) |
| `.claude/hooks/session-start.sh` missing AND at least one manifest file exists | `session-start-hook` | (none) |
| `git diff` (unstaged or staged) is non-empty | `simplify` | (none) |
| Changed files touch auth / crypto / DB / external API surface | `security-review` | (none) |
| An open PR exists for the current branch | `review` | PR number |
| Grep found Anthropic SDK imports | `claude-api` | short summary: which files import the SDK |
| `.claude/settings.json` lacks a `permissions.allow` list AND the session history suggests repeated permission prompts | `fewer-permission-prompts` | (none) |

Do NOT auto-invoke these — only run them when the user explicitly asks:

- `update-config` — requires a specific config change from the user
- `keybindings-help` — requires a specific keybinding change
- `loop` — requires an interval and a target command

## Step 3 — Invoke Skills Sequentially

For each queued skill:

1. Call the Skill tool with `skill` = the skill name and `args` = the prepared args (if any).
2. Wait for the skill to complete before starting the next.
3. If the invoked skill asks a mid-flow question that you can answer from the project context gathered in Step 1, answer it directly. Only break to ask the user if the decision truly cannot be inferred.

Never invoke skills in parallel — later skills may depend on the state produced by earlier ones (e.g. `simplify` edits files that `security-review` should then see).

## Step 4 — Summary Report

When every queued skill has completed, emit a concise report to the user:

- Skills invoked (in order) + one-line outcome for each
- Files created or modified
- Skills that were considered and skipped, with the reason
- Any user actions still required (e.g. approve a PR, resolve a merge conflict, enter a secret)
