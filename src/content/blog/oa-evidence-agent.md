---
title: "OA Evidence Agent：让医疗 AI 的证据、边界与运行过程可追溯"
description: "复盘一个基于 LangGraph、Hybrid RAG 与 BioMedCLIP 的膝骨关节炎证据增强 Agent，重点讨论可追溯性、降级透明度与非临床边界。"
pubDate: 2026-08-19
tags: [AI Agent, LangGraph, RAG, BioMedCLIP, 工程实践]
---

## 为什么要做这个项目

医疗场景里的 Agent，难点不只是“能不能回答”，而是回答依据来自哪里、某个模型是否真的启用、失败后发生了什么，以及输出有没有越过安全边界。OA Evidence Agent 是我围绕膝骨关节炎构建的证据增强 AI Agent MVP：它把公开指南检索、研究级影像观察、报告草稿、Claim 级候选支持检查、安全审查和运行审计串成一条可复现链路。

这个项目不追求把 Demo 包装成诊断系统。它更关注一件工程上更重要的事：让使用者看见系统“配置了什么、实际运行了什么、为什么降级、哪些结论不能推出”。

## 有界的 Agent 工作流

主流程由 LangGraph 编排为 Planner → Executor → Reflector → Router。Planner 优先请求 LLM 生成结构化计划；模型未配置、调用失败或计划不合法时，会回到可测试的规则模板。Executor 随后按计划**顺序**调用工具，包括文本检索、影像分析、报告生成和事实检查。某一步异常会写入 Trace，并允许后续步骤继续，因此响应可以明确标记为 degraded，而不是把部分失败伪装成完整成功。

Reflector 始终先运行规则安全检查，再按配置加入 LLM 审查。若回答包含确诊式措辞、绝对治疗建议、缺少免责声明，或影像结果混入 KL 分级、概率、置信度等越界字段，Router 会触发一次修订。最大修订次数固定为 1，避免无界自我循环，也让整条路径容易测试和解释。

## Hybrid RAG 如何保留证据来源

当前知识库由 6 条项目自撰的 NICE、AAOS 公开来源短摘要组成，每条保留发布机构、年份、官方链接和许可说明。文档经过 500/80 的分块后，由本地 BGE-small Adapter 编码；检索同时运行 Dense 与 BM25，两路分数按 0.7/0.3 融合，再做轻量启发式 Rerank，最终生成可点击、可追溯的 Evidence。

Dense 存储默认优先使用 Qdrant。连接、超时等短暂故障会显式回退进程内 memory，并记录 fallback reason；维度、距离或配置错误则直接标记 unavailable，不静默降级。索引还使用 embedding identity 与语料指纹隔离 collection，避免不同模型或旧语料向量混入同一检索结果。

## BioMedCLIP 只做研究观察

影像链路先验证文件容器与大小；DICOM 只提取单帧灰度像素，并转换成无元数据 PNG。BioMedCLIP 分别编码图像和预定义文本候选，对关节间隙、骨赘和软骨下骨硬化候选进行余弦相似度排序。

这里的 similarity 不是概率或医学置信度，结果始终标记为 research_observation_only 与 clinical_validated=false。系统不自动输出 KL 分级、确诊结论或正式影像报告；真实编码器不可用时只返回 unavailable、空观察列表和降级原因，也不会用文件 Hash 伪造医学结果。

## Evidence、Trace 与 Capabilities

每次请求都会关联 request_id 和 run_id。响应不仅包含回答，还包含 Evidence、执行计划、Safety、Trace、failed steps 与 Capabilities。Capabilities 区分 configured backend、active backend 和 fallback reason，防止把配置文件里的模型名当成本次真实运行证据。

SQLite 只保存哈希后的会话标识、状态、耗时、证据与修订计数，以及精简后的 Trace 摘要；问题正文、患者信息、影像路径、完整回答和报告不会进入运行审计。这适合单机 MVP 排障，但不等于病历库、多租户系统或完整合规审计平台。

## 验收结果与边界

当前本地验收中，后端测试为 **166 passed、1 skipped**，唯一跳过项需要外部 Qdrant 服务；前端测试为 **35/35 passed**，后端与工具目录的 Ruff 静态检查全部通过。检索评测只使用少量人工整理查询，报告、安全与回答指标也属于规则化工程诊断。

因此，这些数字证明的是工作流、降级路径、接口契约和界面展示可以稳定回归，并不证明临床准确率、医学有效性或真实环境安全性。对这个项目而言，清楚说明不能证明什么，和展示已经实现什么同样重要。

项目公开仓库正在整理；本文依据当前本地已验收版本撰写。
