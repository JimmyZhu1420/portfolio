---
title: EvoAgent：让代码审查 Agent 的结论可验证、可演进
description: 从 PR Diff 输入到六阶段多智能体协作，记录 EvoAgent 如何用证据门禁和受控回放构建可靠的代码审查闭环。
pubDate: 2026-08-20
tags: [AI Agent, 多智能体, 代码审查, 工程实践]
draft: false
---

## 为什么做 EvoAgent

代码审查并不只是在 Diff 中寻找可疑字符串。规则引擎稳定，却难以覆盖上下文；LLM 能理解语义，却可能给出位置错误、证据不足或不可复现的结论。我希望做的不是一个“把 Diff 发给模型”的包装器，而是一套能约束执行、复核证据、记录失败并从反馈中安全演进的审查系统。

EvoAgent 接受手动提交的 unified diff，也能接收 GitHub `pull_request` 的 `opened`、`reopened` 和 `synchronize` 事件。Webhook 先经过 HMAC-SHA256 签名与 delivery 幂等校验，再下载 Diff、创建异步任务。任务按照 `PENDING → PLANNING → EXECUTING → REVIEWING → SUCCESS` 流转；自研 Agent Runtime 为节点设置步骤、时间、重试和取消预算，并持久化 checkpoint，让失败任务能够从已完成节点继续。

## 六阶段协作，而不是一次模型调用

一次审查会经过六个明确阶段：

1. **Planner** 根据文件、语言和风险域拆分任务；
2. **Specialists** 并行运行 Security、Reliability、OpenAI-compatible LLM 与动态 Skill；
3. **Critic / Reflection** 质疑初审结论，并把修订要求交回原 Agent；
4. **Evidence Agent** 独立检查问题是否真的落在新增行上；
5. **Verifier** 同时检查证据、置信度和修复建议的安全性；
6. **Arbiter** 丢弃未通过门禁的发现，合并冲突后生成最终报告。

LLM Specialist 也不能随意调用能力。Tool Registry 只暴露 Diff 搜索、新增行读取、变更文件列表和仓库记忆检索，并在执行前校验参数 Schema。Context Manager 把任务、工具、质疑反馈、历史记忆、Observation 与风险排序后的 Diff 放入统一预算，避免 Agent Loop 每轮无界增长。

## 证据先于结论

Critic 会检查定位是否属于新增行、引用证据能否匹配源代码，以及解释、修复和测试建议是否足够具体。高影响结论还需要独立证据。Evidence Agent 随后重新读取对应行；Verifier 只有在质疑通过、证据可复现、修复建议安全且置信度达到阈值时才批准。最终报告因此不仅包含严重级别，还包含文件、行号、原始证据、修复方案和回归测试建议。

自动修复同样保持保守。目前仅处理调试输出、`shell=True` 和 Python 硬编码凭据三类确定性规则；修改需通过编译及已配置的测试门禁，并提交到新的修复分支和 Draft PR，不直接改写原分支。

## “演进”到底改变什么

用户可以回流误报、漏报和坏修复。系统据此生成候选 Prompt，或生成无主机权限的声明式 Skill artifact。候选必须在 Validation 上获得最小提升，并通过受保护指标与隔离 Holdout 的非退化门禁；样本不足、未配置模型或评测失败时只保存为 `deferred`，不会进入审查链路。版本、指标、数据指纹、激活决定都被持久化，因此可以审计和回滚。

这里的“演进”指 **Prompt 与受限规则 Skill 的版本演进**，不是训练 LLM，也不是修改模型权重。声明式 Skill 只允许在新增行上做受限字面匹配，不支持任意 Python、正则执行或主机权限。

## 评测结果与边界

当前测试套件包含 14 个测试文件，我在本地完整运行得到 **58/58 tests passed**。受控端到端评测包含 **100 个合成 PR Diff**：40 个风险样本、60 个干净样本，并按仓库隔离为 8 个 Validation 仓库和 2 个 Holdout 仓库。候选方案在该数据上的 F1 为 **0.825**，基线为 **0.7143**；高风险召回率 **94.74%**、干净样本准确率 **91.67%**、执行成功率 **100%**、安全修复率 **78.79%**、端到端安全修复率 **65%**。

这些数据被明确标记为 `synthetic-controlled`，只用于验证评测框架和目标指标形态，**不能代表公开 PR 或生产环境效果**；生产来源门禁也刻意保持失败。Docker Compose 配置目前用于本地集成与演示，尚未经过容量、高可用和生产安全验证。默认未配置 LLM 时，系统会退回确定性的本地规则审查器。

项目源码：[JimmyZhu1420/EvoAgent](https://github.com/JimmyZhu1420/EvoAgent)
