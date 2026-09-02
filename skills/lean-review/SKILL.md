---
name: lean-review
description: Review code or a diff for over-engineering, wrong assumptions, unrelated edits, unnecessary dependencies or abstractions, missed reuse opportunities, and missing verification. Use when the user asks for a focused engineering review or wants to reduce complexity without changing intended behavior.
license: MIT
---

# Lean Review

Review without rewriting by default.

## Composition rule

Lean Review is a **review lens**, not an orchestration layer.

If an external workflow already assigned an authoritative Reviewer, exact review range, severity taxonomy, finding format, batch-review policy, or convergence rule:

- follow that workflow;
- include Lean Review concerns inside the same review pass;
- do not create an automatic second review cycle;
- do not invent a competing finding format;
- do not turn optional simplification/hardening into a blocker without concrete correctness or scope evidence.

Use Lean Review as a standalone pass only when the user or active workflow explicitly requests that review.

## Review order

Check in this order:

1. **Correctness risk** — wrong assumptions, broken ownership/lifetime/threading/data contracts, or symptom-only fixes.
2. **Scope drift** — changes unrelated to the requested behavior.
3. **Reuse misses** — existing helpers, stdlib, framework/platform/native facilities, or installed dependencies that make new code unnecessary.
4. **Speculative complexity** — premature interfaces, factories, managers, wrappers, configuration layers, generic frameworks, or future-proofing without a current consumer.
5. **Verification gap** — no test/build/reproduction proving the requested outcome at the validation level owned by this change.

Report concrete findings with file/line references when available. Rank correctness and safety above code-size reduction. Do not recommend deleting validation, security controls, concurrency protection, or data-loss prevention merely to reduce lines.

When another workflow owns expensive full-suite/integration validation at a later gate, do not call the current change under-verified merely because that later validation has not run yet; judge it against the validation ownership actually assigned to this review stage.
