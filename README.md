# Lean Engineer

A Codex-first coding plugin that combines two complementary ideas:

- **Engineering discipline:** expose material assumptions, avoid unrelated edits, define success criteria, and verify the outcome.
- **Implementation minimalism:** YAGNI, reuse first, standard library first, platform/framework-native features before new dependencies, and the smallest correct diff.

The result is one workflow:

```text
UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY
```

## Why this exists

Coding agents fail in two common ways at once: they can make unverified assumptions, and they can over-build the resulting solution. Lean Engineer treats those as one problem. It first constrains understanding and scope, then constrains implementation complexity, then requires evidence that the change works.

Minimalism is deliberately lower priority than correctness, explicit requirements, security, data integrity, concurrency correctness, compatibility, and necessary error handling.

## Modes

- `normal` (default): disciplined workflow + minimal correct implementation.
- `strict`: stronger burden of proof for new dependencies, abstractions, wrappers, files, factories, managers, and configuration layers.
- `off`: disables injected Lean Engineer guidance for the current plugin state.

Commands:

```text
/lean-engineer
/lean-engineer normal
/lean-engineer strict
/lean-engineer off
```

Short alias:

```text
/lean strict
```

The plugin also ships a `lean-review` skill for review-only analysis of over-engineering, scope drift, wrong assumptions, reuse misses, and verification gaps.

## Codex lifecycle hooks

The plugin registers:

- `SessionStart` — injects the active rules into new/resumed/cleared/compacted sessions.
- `SubagentStart` — injects the same rules into subagents.
- `UserPromptSubmit` — handles mode switches and re-injects the active rules when the mode changes.

Hook state is stored under Codex's `PLUGIN_DATA` directory and contains only the selected mode.

## Install from the repository marketplace

```bash
codex plugin marketplace add EricLad/codex-lean-engineer
codex plugin add lean-engineer@lean-engineer
```

Then start Codex, open `/hooks`, review/trust the bundled hooks, and start a new session.

## Development

Requires Node.js 18+ only for the lifecycle hook scripts. No npm dependencies are used.

```bash
npm test
```

## Project layout

```text
.codex-plugin/plugin.json       Codex plugin manifest
.agents/plugins/marketplace.json repository marketplace entry
hooks/hooks.json                lifecycle hook registration
hooks/runtime.js                persistent mode state + hook output
hooks/instructions.js           always-on engineering rules
hooks/session-start.js          SessionStart handler
hooks/subagent-start.js         SubagentStart handler
hooks/mode-tracker.js           UserPromptSubmit mode handler
skills/lean-engineer/SKILL.md   primary coding skill
skills/lean-review/SKILL.md     review-only skill
```

## Design sources

Lean Engineer is an independent implementation inspired by:

- DietrichGebert/ponytail — YAGNI, reuse/stdlib/native-first minimal implementation, and lifecycle-hook activation patterns.
- multica-ai/andrej-karpathy-skills — explicit assumptions, simplicity, surgical changes, and goal-driven verification.

See `NOTICE.md` for attribution details. The rules and hook code in this repository are newly written rather than a concatenation of the two upstream projects.

## License

MIT. See `LICENSE`.
