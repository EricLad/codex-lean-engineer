---
name: lean-review
description: 审查代码或 diff 中的过度设计、错误假设、无关修改、不必要的依赖或抽象、遗漏的复用机会，以及缺失的验证步骤。适用于需要聚焦工程质量审查，或希望在不改变既有行为的前提下降低复杂度的场景。
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
