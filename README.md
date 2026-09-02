# Lean Engineer

[English](./README.md) | [简体中文](./README_CN.md)

A Codex-first coding plugin that combines two complementary ideas:

- **Engineering discipline:** expose material assumptions, avoid unrelated edits, define success criteria, and verify the outcome.
- **Implementation minimalism:** YAGNI, reuse first, standard library first, platform/framework-native features before new dependencies, and the smallest correct diff.

For implementation work, the core workflow is:

```text
UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY
```

## What it does

Lean Engineer is an engineering-discipline layer, not a task-orchestration framework.

It keeps implementation focused without overriding an external Controller, task contract, role assignment, approved implementation approach, or validation ownership. If another workflow already decided the architecture, Lean Engineer simplifies **inside that plan** instead of silently replacing it.

Minimalism is deliberately lower priority than correctness, explicit requirements, security, data integrity, concurrency correctness, compatibility, necessary error handling, and explicit task contracts.

## Role-aware subagents

The plugin adapts its hook guidance to the delegated subagent role instead of injecting the same implementation template into every agent.

```text
worker / Developer
  -> UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY

Explorer / scout
  -> LOCATE -> TRACE -> MAP -> REPORT

Reviewer / Integration Reviewer
  -> UNDERSTAND -> CHECK -> REPORT

Bug Investigator
  -> EVIDENCE -> HYPOTHESES -> ROOT CAUSE -> HANDOFF

unknown / default
  -> role-neutral guidance until the delegated prompt clarifies the role
```

Read-only roles are explicitly told not to modify production code. If a generic `agent_type` is used, the plugin can refine the role from the delegated prompt when it explicitly identifies a Developer, Explorer, Reviewer, or Investigator role.

This makes Lean Engineer suitable for use alongside orchestration workflows such as multi-agent development systems: the orchestrator decides **who does what**, while Lean Engineer constrains **how the assigned role behaves**.

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

`strict` still respects external task contracts. It does not authorize a Developer to reopen an already-approved architecture or turn optional hardening into a blocking review issue without concrete evidence.

The plugin also ships a `lean-review` skill for explicit review-only analysis of over-engineering, scope drift, wrong assumptions, reuse misses, and verification gaps. It is intended as a focused review tool, not as an automatic second reviewer for another workflow.

## Codex lifecycle hooks

The plugin registers:

- `SessionStart` — injects the active Lean Engineer rules into new/resumed/cleared/compacted root sessions.
- `SubagentStart` — reads Codex `agent_type` and injects role-appropriate guidance.
- `UserPromptSubmit` — handles mode switches and can refine a generic subagent role from the delegated prompt.

Hook state is stored under Codex's `PLUGIN_DATA` directory and contains only the selected mode.

## Install from the repository marketplace

First add this repository as a Codex marketplace:

```bash
codex plugin marketplace add EricLad/codex-lean-engineer
```

Then launch Codex:

```bash
codex
```

Inside the Codex CLI, open the plugin browser:

```text
/plugins
```

Select the `lean-engineer` marketplace, open **Lean Engineer**, and install it. After installation, start a **new Codex session** so the bundled skills and hooks are loaded.

If the plugin contains hooks, open:

```text
/hooks
```

Review and trust the Lean Engineer hooks before using them.

> Note: current Codex CLI installs marketplace plugins through the interactive `/plugins` browser. `codex plugin add ...` is not a supported installation command.

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
hooks/instructions.js           role-aware Lean Engineer rules
hooks/session-start.js          root SessionStart handler
hooks/subagent-start.js         agent_type-aware SubagentStart handler
hooks/mode-tracker.js           mode switching + prompt role refinement
skills/lean-engineer/SKILL.md   primary coding skill
skills/lean-review/SKILL.md     explicit review-only skill
```

## Design sources

Lean Engineer is an independent implementation inspired by:

- DietrichGebert/ponytail — YAGNI, reuse/stdlib/native-first minimal implementation, and lifecycle-hook activation patterns.
- multica-ai/andrej-karpathy-skills — explicit assumptions, simplicity, surgical changes, and goal-driven verification.

See `NOTICE.md` for attribution details. The rules and hook code in this repository are newly written rather than a concatenation of the two upstream projects.

## License

MIT. See `LICENSE`.
