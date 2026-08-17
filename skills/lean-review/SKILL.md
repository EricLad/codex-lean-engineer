---
name: lean-review
description: Review code or a diff for over-engineering, wrong assumptions, unrelated edits, unnecessary dependencies or abstractions, missed reuse opportunities, and missing verification. Use when the user asks for a focused engineering review or wants to reduce complexity without changing intended behavior.
license: MIT
---

# Lean Review

Review without rewriting by default.

Check in this order:

1. **Correctness risk** — wrong assumptions, broken ownership/lifetime/threading/data contracts, or symptom-only fixes.
2. **Scope drift** — changes unrelated to the requested behavior.
3. **Reuse misses** — existing helpers, stdlib, framework/platform/native facilities, or installed dependencies that make new code unnecessary.
4. **Speculative complexity** — premature interfaces, factories, managers, wrappers, configuration layers, generic frameworks, or future-proofing without a current consumer.
5. **Verification gap** — no test/build/reproduction proving the requested outcome.

Report concrete findings with file/line references when available. Rank correctness and safety above code-size reduction. Do not recommend deleting validation, security controls, concurrency protection, or data-loss prevention merely to reduce lines.
