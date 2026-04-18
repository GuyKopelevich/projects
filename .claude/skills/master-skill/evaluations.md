# master-skill Evaluations

Six test scenarios that exercise the decision logic. Each scenario has a fixed expected queue; running Step 1 and Step 2 on the scenario should produce exactly that queue.

To re-run: create the described filesystem state inside a temp directory with `git init`, then walk Steps 1 and 2 from SKILL.md by hand (no invocations in Step 3).

## Scenario A — Clean Green Project

**Setup**: `CLAUDE.md` present, `.claude/hooks/session-start.sh` present, `package.json` present, clean working tree, no open PR, no SDK imports.

**Expected queue**: `[]` (empty — nothing to do)

## Scenario B — Brand-New Project

**Setup**: `package.json` present, `index.js` with one line, no `CLAUDE.md`, no `.claude/` config, clean working tree.

**Expected queue**: `[init, session-start-hook]`

Args for `session-start-hook`: `"package managers: npm; manifests at: package.json"` (no lockfile present → default to npm).

## Scenario C — Sensitive Diff

**Setup**: `CLAUDE.md` and `.claude/hooks/session-start.sh` present. `auth.js` modified: old version concatenates user input into a SQL `SELECT`; new version uses a parameterized query.

**Expected queue**: `[simplify, security-review]`

Rule 4 fires because the changed path name matches `auth` AND the diff content contains `SELECT`.

## Scenario D — SDK Imports

**Setup**: `src/ai.ts` contains `import Anthropic from "@anthropic-ai/sdk";`. Everything else green.

**Expected queue**: `[claude-api]`

Args: `"SDK imports in: src/ai.ts"`.

## Scenario E — Monorepo, One Sub Missing CLAUDE.md

**Setup**: Root has no manifest, two sub-projects `pkg-a/` and `pkg-b/` each with `package.json`. Only `pkg-a/CLAUDE.md` exists. Hook present at root.

**Expected queue**: `[init]`

Args: `"sub-projects missing CLAUDE.md: pkg-b"`.

## Scenario F — Self-Match Prevention

**Setup**: Everything green, but a skill file at `.claude/skills/fake-sdk-skill/SKILL.md` contains literal `import anthropic` and `@anthropic-ai/sdk` in its example text.

**Expected queue**: `[]` (empty — the SDK grep must exclude `.claude/skills/**` so the skill file does not trigger rule 6)

## Additional Safety Tests (Step 0)

These test the Step 0 guards, not the rule table.

### G — Not a Git Repo

**Setup**: Run from a tmp directory with no `.git/`.

**Expected**: Abort with "not a git repo" before Step 1.

### H — On `main`, No `force`

**Setup**: On branch `main`, uncommitted changes to `auth.js` (would otherwise match rules 3 + 4).

**Expected queue**: `[security-review]` only (read-only; `simplify` removed because it modifies files).

### I — On `main`, With `force`

**Setup**: Same as H, but args include `force`.

**Expected queue**: `[simplify, security-review]` (full queue restored).

### J — Dry-Run

**Setup**: Scenario B setup, but invoked with `args=dry-run`.

**Expected**: Plan printed as `init → session-start-hook`, Step 3 skipped, no invocations.

### K — `only` Filter

**Setup**: Scenario B setup, args `only=init`.

**Expected queue**: `[init]` (session-start-hook filtered out).
