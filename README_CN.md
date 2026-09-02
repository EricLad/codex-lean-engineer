# Lean Engineer

[English](./README.md) | [简体中文](./README_CN.md)

一个面向 **Codex** 的工程纪律插件，主要结合两类能力：

- **工程约束**：明确关键假设、避免无关修改、定义成功条件，并验证最终结果。
- **实现克制**：遵循 YAGNI、优先复用、优先标准库和平台/框架原生能力，尽量采用最小正确实现。

对于实际编码任务，核心流程是：

```text
UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY
```

## 实现思路

Lean Engineer 是一层**工程行为约束**，不是任务编排框架。

它负责让实现过程保持聚焦，但不会覆盖外部 Controller、Task Contract、角色分配、已经批准的实现方案或验证职责。如果其他工作流已经确定了架构，Lean Engineer 只会在**既定方案内部**寻找更简洁、更直接的实现，而不会擅自替换架构。

“代码更少”永远不会凌驾于以下要求之上：

- 正确性；
- 用户明确需求；
- 安全性；
- 数据完整性；
- 并发正确性；
- 兼容性；
- 必要的错误处理；
- 已经明确的 Task Contract。

## 角色感知的子代理规则

插件会根据被委派子代理的角色注入不同的工程规则，而不是向所有 Agent 注入同一套编码模板。

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
  -> 先使用角色中立规则，等待实际委派 Prompt 明确角色
```

对于只读角色，插件会明确要求其**不要修改生产代码**。

如果 Codex 使用的是通用 `agent_type`，插件还可以根据实际委派 Prompt 进一步识别 Developer、Explorer、Reviewer 或 Investigator，并切换到对应规则。

因此 Lean Engineer 可以和多代理编排工作流同时使用：

```text
编排器
负责：谁来做、任务怎么拆、什么时候 Review / 集成

Lean Engineer
负责：被分配角色应该以什么工程方式执行
```

例如配合 `multi-agent-development` 时，前者负责 FAST / STANDARD / ORCHESTRATED、模型路由、并发、Review、Staging 等流程；Lean Engineer 则约束每个 Agent 在自己的职责范围内保持克制和正确。

## 工作模式

插件支持三种模式：

- `normal`：默认模式。启用工程纪律和最小正确实现原则。
- `strict`：对新增依赖、抽象、Wrapper、文件、Factory、Manager、配置层等提出更高的必要性要求。
- `off`：关闭 Lean Engineer 注入规则。

命令：

```text
/lean-engineer
/lean-engineer normal
/lean-engineer strict
/lean-engineer off
```

简写：

```text
/lean strict
```

`strict` 模式仍然服从外部 Task Contract。它不会允许 Developer 重新打开已经确定的架构决策，也不会在缺乏明确证据的情况下把 Optional Hardening 变成阻塞问题。

插件还提供 `lean-review` Skill，用于专门检查：

- 过度设计；
- Scope 漂移；
- 错误假设；
- 未复用已有能力；
- 不必要的依赖和抽象；
- 验证缺失。

`lean-review` 是一个**Review 视角**，不是额外的编排层。如果外部工作流已经安排 Reviewer，应把 Lean Review 的检查内容合并到同一次 Review 中，而不是自动再增加一轮审查。

## Codex 生命周期 Hook

插件注册以下 Hook：

- `SessionStart`：在新会话、恢复、清空或压缩后的主会话中注入当前 Lean Engineer 规则。
- `SubagentStart`：读取 Codex 的 `agent_type`，向子代理注入对应角色规则。
- `UserPromptSubmit`：处理模式切换，并可根据实际委派 Prompt 进一步修正通用子代理的角色。

插件状态保存在 Codex 的 `PLUGIN_DATA` 目录中，目前只保存所选择的模式。

## 安装

先将仓库添加为 Codex Marketplace：

```bash
codex plugin marketplace add EricLad/codex-lean-engineer
```

然后启动 Codex：

```bash
codex
```

在 Codex CLI 中打开插件浏览器：

```text
/plugins
```

选择 `lean-engineer` Marketplace，打开 **Lean Engineer** 并安装。

安装完成后，建议重新启动一个新的 Codex 会话，使 Skill 和 Hooks 完整加载。

如果插件包含 Hooks，可以打开：

```text
/hooks
```

检查并信任 Lean Engineer 的 Hook 后再使用。

> 当前 Codex CLI 的 Marketplace 插件通过交互式 `/plugins` 浏览器安装，`codex plugin add ...` 不是受支持的安装命令。

## 使用示例

### 默认模式

```text
/lean-engineer normal
```

之后正常让 Codex 开发：

```text
给用户设置页面增加一个自动检查更新选项。
```

Lean Engineer 会尽量让实现遵循：

```text
先理解现有实现
↓
限制修改范围
↓
优先复用现有能力
↓
采用最小正确修改
↓
执行必要验证
```

### Strict 模式

当你希望 Codex 对新增架构、抽象和依赖更加克制时：

```text
/lean-engineer strict
```

适合：

- 防止为了一个小功能创建新的 Service / Manager / Factory；
- 防止重复造已有工具；
- 防止无必要增加第三方依赖；
- 审查 AI 是否存在明显过度设计。

### 关闭

```text
/lean-engineer off
```

### Lean Review

需要单独检查一份 Diff 是否存在过度设计时，可以使用：

```text
$lean-review
检查当前修改是否存在不必要的抽象、重复实现、无关修改或验证缺失。
```

如果当前任务已经由其他多代理工作流安排正式 Reviewer，则不需要额外再运行一轮 Lean Review，除非你明确希望增加专项审查。

## 与外部工作流组合

当外部 Controller 或 Task Contract 已经明确：

```text
Role
Scope
Implementation Approach
Non-goals
Validation ownership
```

Lean Engineer 会将这些内容视为权威边界。

Developer 可以在既定方案内部：

- 复用已有 Helper；
- 使用标准库；
- 使用平台/框架原生能力；
- 减少不必要的代码；
- 避免无关重构。

但如果发现需要改变既定架构，则应该：

```text
发现方案冲突
↓
报告实际代码情况
↓
说明影响和可选方案
↓
交给 Controller 决策
```

而不是自行重新设计。

## 开发与测试

生命周期 Hook 使用 Node.js 18+，没有 npm 第三方依赖。

运行测试：

```bash
npm test
```

## 项目结构

```text
.codex-plugin/plugin.json        Codex 插件清单
.agents/plugins/marketplace.json Marketplace 配置
hooks/hooks.json                 生命周期 Hook 注册
hooks/runtime.js                 模式状态与 Hook 输出
hooks/instructions.js            角色感知的 Lean Engineer 规则
hooks/session-start.js           主会话 SessionStart Hook
hooks/subagent-start.js          基于 agent_type 的子代理 Hook
hooks/mode-tracker.js            模式切换和 Prompt 角色识别
skills/lean-engineer/SKILL.md    主编码 Skill
skills/lean-review/SKILL.md      专项 Review Skill
```

## 设计来源

Lean Engineer 是一个独立实现，其设计思路参考了：

- `DietrichGebert/ponytail`：YAGNI、优先复用 / 标准库 / 原生能力以及生命周期 Hook 激活方式。
- `multica-ai/andrej-karpathy-skills`：明确假设、保持简单、外科手术式修改以及以目标为中心的验证。

具体归属说明见 `NOTICE.md`。本项目的规则和 Hook 代码均为重新实现，并不是对两个上游项目内容的简单拼接。

## License

MIT License，详见 [LICENSE](./LICENSE)。
