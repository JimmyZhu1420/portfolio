---
title: AI Agent 入门：从 LLM 到智能体
description: 简述智能体（Agent）的核心概念、系统组成与一个最小实现。
pubDate: 2026-08-05
tags: [AI Agent, 教程]
---

## 什么是 AI Agent

AI Agent 是能够**自主感知、决策并采取行动**以完成目标的系统，其核心是让大模型（LLM）作为“大脑”，配合工具与循环机制在真实任务中工作。

## 核心组成

- **规划（Planning）**：拆解目标、制定步骤
- **工具调用（Tool Use）**：调用搜索、代码执行、API 等外部能力
- **记忆（Memory）**：短期对话记忆与长期知识存储
- **反思（Reflection）**：根据结果自我纠正

## 最小实现示例

```python
from openai import OpenAI

client = OpenAI()

def run_agent(task: str) -> str:
    # 简化示例：仅展示循环思想
    messages = [{"role": "user", "content": task}]
    for _ in range(3):
        resp = client.chat.completions.create(model="gpt-4o", messages=messages)
        reply = resp.choices[0].message.content
        if "[DONE]" in reply:
            return reply.replace("[DONE]", "").strip()
        messages.append({"role": "assistant", "content": reply})
    return "达到最大轮次"
```

> 占位示例文章，后续替换为你的真实内容。
