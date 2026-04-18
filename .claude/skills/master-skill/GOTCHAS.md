# master-skill Gotchas

Mistakes to avoid when running or extending master-skill. Each entry is based on a real issue observed during testing.

## 1. Do not grep inside `.claude/skills/**`

SKILL.md files themselves may contain example strings like `import anthropic` or SQL snippets. Grepping the whole repo for these patterns matches the skill documentation and produces a false-positive trigger for `claude-api` or `security-review`. Always pass exclusions: `.claude/skills/**`, `node_modules/**`, `.git/**`, `dist/**`, `build/**`.

## 2. Monorepo detection is structural, not nominal

A repo is a monorepo when multiple sibling directories each contain their own manifest (`package.json`, `pyproject.toml`, etc.). The name of the directory doesn't matter. If monorepo → evaluate `CLAUDE.md` per sub-project, not at root only.

## 3. Rule 1 fires if ANY sub-project is missing CLAUDE.md

In a monorepo, rule 1 fires when **at least one** sub-project has no `CLAUDE.md`. Early wording said "no CLAUDE.md in any sub-project" which was read as "all missing". The intent is "at least one missing".

## 4. `simplify` must ignore `.claude/skills/**` and `CLAUDE.md` in the diff

If master-skill is editing its own SKILL.md (self-improvement), or `init` just created a CLAUDE.md, the diff is non-empty but there is no real project code to simplify. Exclude these paths before evaluating rule 3.

## 5. `review` needs a PR number

Rule 5 only fires when `mcp__github__list_pull_requests` returns a non-empty array. Extract `.number` from the first result and pass as `"PR #<number>"`. If the MCP call errors, soft-fail and skip rule 5.

## 6. `session-start-hook` needs to know which package manager to use

Pass the detected package manager(s) in the args — `bun.lockb`→bun, `pnpm-lock.yaml`→pnpm, `yarn.lock`→yarn, else npm. For Gradle repos, mention `gradle`. Without this, the hook script may guess wrong and use `npm ci` where `bun install` was expected.

## 7. Explicit-intent-only skills should not be auto-queued

`update-config`, `keybindings-help`, `loop`, `fewer-permission-prompts` require specific user inputs (a config change, a keybinding, an interval, etc.) that master-skill cannot infer from project signals. Never auto-queue these — the user must name them explicitly.

## 8. `master-skill` self-invocation is an infinite loop

Always filter `master-skill` out of the queue, even if it appears in the available-skills set (duplicates from user + project install are common).

## 9. Protected branches — do not auto-modify files on `main`

The `main`, `master`, `trunk`, `production`, `release/*`, and `hotfix/*` branches must not receive automatic file-modifying skills (`init`, `session-start-hook`, `simplify`). Restrict the queue to read-only skills unless the user passes `force` in args.

## 10. Keep this file and SKILL.md in both user and project locations in sync

The skill is installed at both `~/.claude/skills/master-skill/` and `<repo>/.claude/skills/master-skill/`. Always edit and commit both copies together.
