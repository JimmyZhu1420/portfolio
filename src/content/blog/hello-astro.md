---
title: 欢迎来到我的博客
description: 这个博客用来记录我在 AI Agent 方向的思考与实践。
pubDate: 2026-08-01
tags: [随笔]
draft: true
---

## 关于这个博客

这里会记录我在 **AI Agent** 与大模型应用方向的学习、实践与思考。

## 为什么写博客

写下来的东西才真正属于自己。这里既是对自己知识的梳理，也希望能对同行有帮助。

## 技术栈示例

```python
def agent_step(agent, task):
    """单个 Agent 执行步骤示例"""
    result = agent.run(task)
    return result if result.is_valid() else retry(agent, task)
```

> 这是一个占位示例，后续会填充真实内容。
