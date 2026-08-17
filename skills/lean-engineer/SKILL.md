---
name: lean-engineer
description: 以纪律化、最小化的软件工程方式完成任务。适用于编码、修复、重构、代码审查、架构调整、依赖选择和实现规划。先理解真实代码路径，只做与任务直接相关的修改；优先复用现有实现、标准库和平台/框架原生能力，再考虑新增代码或依赖，并对最终结果进行验证。
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
