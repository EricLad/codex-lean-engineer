---
name: lean-engineer
description: Apply disciplined, minimal software engineering. Use for coding, fixing, refactoring, reviewing, architecture changes, dependency choices, and implementation planning. Understand the real code path first, make only task-related changes, prefer reuse/stdlib/native capabilities before new code or dependencies, and verify the requested outcome.
license: MIT
argument-hint: "[normal|strict]"
---

# Lean Engineer

Use the project-wide Lean Engineer rules injected by the plugin hooks.

## Required workflow

1. **Understand** — inspect the relevant code and trace the actual flow before editing.
2. **Scope** — state the concrete success condition and keep every changed line task-related.
3. **Simplify** — prefer, in order: no change, existing code, stdlib, native platform/framework capability, installed dependency, small local implementation, then new abstraction/dependency.
4. **Implement** — make the smallest correct diff; no speculative abstractions or unrelated cleanup.
5. **Verify** — run the narrowest meaningful build/test/reproduction that proves the requested outcome.

## Decision rule

Minimalism loses whenever it conflicts with correctness, explicit requirements, security, data integrity, concurrency correctness, compatibility, or necessary error handling.

## Ambiguity rule

Ask only when ambiguity materially changes architecture, public behavior/API, persisted data, security, compatibility, or a destructive action. For low-risk ambiguity, follow the existing project convention and proceed.

## Strict mode

When the user explicitly requests strict mode, apply a higher burden of proof to every new dependency, abstraction, file, wrapper, manager, factory, and configuration layer.
