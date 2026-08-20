export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectSection {
  title: string;
  description: string;
}

export interface Project {
  slug: 'evoagent' | 'oa';
  name: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  tags: string[];
  highlights: string[];
  github: string;
  repositoryPublic: boolean;
  year: string;
  status: string;
  featured: boolean;
  flow: string[];
  metrics: ProjectMetric[];
  challenge: string[];
  build: ProjectSection[];
  proof: string[];
  boundaries: string[];
}

export interface Capability {
  index: string;
  title: string;
  description: string;
  technologies: string[];
  evidence: string;
  href: string;
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  email: string;
  location: string;
  education: string[];
  researchInterests: string[];
  jobIntention: string;
  about: string[];
  social: { github: string; linkedin: string; wechat: string };
  capabilities: Capability[];
  projects: Project[];
  publications: Publication[];
}

export const profile: Profile = {
  name: '朱佳明',
  role: '东华大学计算机硕士 · AI Agent 开发实习方向',
  tagline: '关注智能体编排、可信检索与可审计执行，把大模型能力做成可以验证、复现和交付的系统。',
  email: 'z1030835347@gmail.com',
  location: '上海',
  education: [
    '东华大学（211 双一流）· 计算机科学与技术 · 硕士 · 2025–2028',
    '安徽理工大学 · 软件工程 · 本科 · 2020–2024',
  ],
  researchInterests: ['Agent Runtime', '多智能体协作', '可信 RAG', '评测与可观测性'],
  jobIntention: 'AI Agent 开发实习生',
  about: [
    '我是东华大学计算机科学与技术专业硕士研究生，研究和实践聚焦 AI Agent 与大模型应用。我更关心模型如何在真实系统中稳定完成任务，而不只是生成一次看起来正确的回答。',
    '围绕这个目标，我构建了两个完整项目：EvoAgent 探索可恢复、可评测的代码审查 Agent Runtime；OA Evidence Agent 探索带证据链、Claim 校验与安全边界的医疗研究场景智能体。',
  ],
  social: {
    github: 'https://github.com/JimmyZhu1420',
    linkedin: '',
    wechat: 'Z1030835347',
  },
  capabilities: [
    {
      index: '01',
      title: 'Agent 系统工程',
      description: '从工作流编排到有界 Agent Loop，处理工具调用、上下文预算、记忆、反思、断点恢复与多 Agent 协作。',
      technologies: ['Agent Runtime', 'Tool Registry', 'Memory', 'Checkpoint'],
      evidence: '在 EvoAgent 中落地',
      href: '/projects/evoagent',
    },
    {
      index: '02',
      title: '可信检索与校验',
      description: '让回答携带可追溯来源，并通过混合检索、重排、事实一致性与安全审查减少无证据声明。',
      technologies: ['Hybrid RAG', 'BGE', 'Qdrant', 'Factuality'],
      evidence: '在 OA 中落地',
      href: '/projects/oa',
    },
    {
      index: '03',
      title: '工程化与可观测性',
      description: '把原型补齐为可测试、可复现、可诊断的系统，包括 API、异步任务、审计、指标、CI 与容器化。',
      technologies: ['FastAPI', 'Redis', 'OpenTelemetry', 'Docker'],
      evidence: '贯穿两个项目',
      href: '/projects',
    },
  ],
  projects: [
    {
      slug: 'evoagent',
      name: 'EvoAgent',
      title: '面向 GitHub PR 的可验证多智能体代码审查平台',
      eyebrow: 'AI CODE REVIEW · AGENT RUNTIME',
      tagline: '把一次模型调用扩展为可恢复、可评测、可审计的代码审查控制面。',
      description:
        'EvoAgent 接收 Pull Request Diff，由安全、可靠性、LLM 与动态 Skill Agent 并行审查，再经过质疑、补证、验证与裁决输出结构化报告；反馈可以进入受门禁约束的提示词与 Skill 版本链。',
      tags: ['Python 3.11', 'Agent Runtime', 'Vanilla JS', 'PostgreSQL', 'Redis Streams', 'OpenTelemetry'],
      highlights: [
        '自研有界 Agent Loop：工具参数 Schema 校验、执行预算、checkpoint 与断点续跑',
        'Working / Episodic / Semantic 三层记忆与统一 Context Window 逐轮压缩',
        'Validation + Holdout 隔离回放门禁，支持提示词和声明式 Skill 激活与回滚',
      ],
      github: 'https://github.com/JimmyZhu1420/EvoAgent',
      repositoryPublic: true,
      year: '2026',
      status: '公开源码',
      featured: true,
      flow: ['PR Diff', '任务规划', '并行审查', '证据验证', '报告 / 修复'],
      metrics: [
        { value: '58 / 58', label: '自动化测试通过' },
        { value: '100', label: '受控合成评测 Diff' },
        { value: '6 阶段', label: '多 Agent 复核链路' },
      ],
      challenge: [
        '传统 LLM 代码审查通常是一次性调用：输入过长时缺少上下文管理，执行失败后无法恢复，输出也难以追溯到证据。',
        '当反馈被用于“自动进化”时，还需要回答另一个问题：候选版本是否真的变好，以及它有没有破坏已有能力。',
      ],
      build: [
        {
          title: '有界 Agent Runtime',
          description: '用 Tool Registry 暴露带参数 Schema 的工具，将 Plan / Tool / Observe / Final 限制在步骤与时间预算内，并持久化 checkpoint、观察和执行轨迹。',
        },
        {
          title: '多 Agent 复核协议',
          description: 'Planner 按文件、语言与风险域拆解任务，Security、Reliability、LLM 和动态 Skill 并行工作，再由 Critic、Evidence Agent、Verifier 与 Arbiter 完成补证和裁决。',
        },
        {
          title: '反馈驱动的版本门禁',
          description: '误报、漏报与坏修复反馈进入版本化评测；候选必须在 Validation 获得提升，并通过隔离 Holdout 的非退化检查后才能激活。',
        },
        {
          title: '服务控制面',
          description: '补齐 GitHub Webhook 签名与幂等、RBAC 和租户隔离、Redis Streams 租约与死信队列，以及 OpenTelemetry、Prometheus 和持久化告警。',
        },
      ],
      proof: [
        '58 / 58 项自动化测试通过，覆盖 Runtime、记忆、上下文、评测门禁、提示词 / Skill 进化、多 Agent 协作与服务特性。',
        '100 个受控合成 PR Diff 上，候选方案 F1 为 0.825、高风险召回率 94.74%；这些数字只用于可复现工程回归，不代表真实公开 PR 的生产效果。',
        '自动修复只处理可确定的保守规则，提交到独立分支，并经过编译 / 测试门禁。',
        '公开仓库提供 Docker Compose、本地确定性规则模式与 GitHub Actions，便于复现核心链路。',
      ],
      boundaries: [
        '未配置外部模型时使用确定性的本地规则 Agent，不把规则结果表述为大模型能力。',
        '离线进化证明使用受控合成数据，只证明反馈能够改变行为并通过门禁，不代表外部模型权重提升。',
        '自动修复采用保守白名单，并始终创建新分支，不直接改写源分支。',
      ],
    },
    {
      slug: 'oa',
      name: 'OA Evidence Agent',
      title: '膝骨关节炎证据增强研究型 AI Agent',
      eyebrow: 'EVIDENCE RAG · CLINICAL SAFETY',
      tagline: '让每一步回答都能回到证据、运行轨迹和清晰的研究边界。',
      description:
        'OA 使用 LangGraph 串联 Planner、Executor 与 Reflector，把公开指南 Hybrid RAG、影像观察候选、报告起草、事实一致性校验和安全审查组织成一条可复现、可审计的研究级工作流。',
      tags: ['FastAPI', 'LangGraph', 'Vue 3', 'Hybrid RAG', 'Qdrant', 'BioMedCLIP'],
      highlights: [
        'BGE-small + Dense / BM25 混合检索 + 启发式 Rerank，证据保留机构、年份和来源 URL',
        'BioMedCLIP 只输出研究级图文相似度候选，并显式区分相似度、概率与诊断结论',
        'Factuality 与 Safety 工具标记无证据声明；SQLite 仅保存隐私最小化运行审计',
      ],
      github: 'https://github.com/JimmyZhu1420/osteo-agent',
      repositoryPublic: false,
      year: '2026',
      status: '本地迭代 · 仓库待公开',
      featured: true,
      flow: ['病例输入', '任务规划', '检索 / 影像', '反思校验', '证据 / 报告'],
      metrics: [
        { value: '166 + 1', label: '后端通过 / 跳过' },
        { value: '35 / 35', label: '前端测试通过' },
        { value: '7 个', label: 'Agent 工具' },
      ],
      challenge: [
        '医疗场景中的回答不仅需要“像是正确”，还需要知道证据来自哪里、哪些说法缺乏依据，以及模型当前能力的边界。',
        '文本检索、影像候选、报告生成和安全审查如果彼此割裂，很难形成一条可复现、可解释的执行链。',
      ],
      build: [
        {
          title: 'Plan–Execute–Reflect 工作流',
          description: 'Planner 识别任务类型，Executor 调用受约束工具，Reflector 对证据充分性与安全性进行检查；最多一次有界修订，避免失控循环。',
        },
        {
          title: '可追溯 Hybrid RAG',
          description: '本地 BGE-small 嵌入结合 Dense 与 BM25，再做启发式重排；Evidence Pack 保留机构、年份、标题与官方链接。',
        },
        {
          title: '影像与事实边界',
          description: 'BioMedCLIP 仅对预定义文本候选进行相似度排序；FactualityCheck 标记缺少证据的声明，SafetyCheck 在输出前执行安全审查。',
        },
        {
          title: '隐私最小化可观测性',
          description: '用 Request / Run ID、结构化日志、Server-Timing、健康检查与轻量指标串联运行状态；SQLite 不保存患者问题、影像路径或完整回答。',
        },
      ],
      proof: [
        '2026-08-20 实测后端 166 passed、1 skipped，前端 35 / 35 通过，Ruff 静态检查全绿。',
        '当前语料是 6 条带来源元数据的 NICE / AAOS 项目自撰短摘要，检索评测用于可复现工程回归与错误分析。',
        'BioMedCLIP 工程链路在 CPU 上完成 512 维归一化向量与余弦排序验证。',
        'Docker Compose、GitHub Actions 与能力透明接口共同证明项目可复现，而不把 CI 描述成线上部署。',
      ],
      boundaries: [
        '项目仅用于科研、教学和工程展示，未通过临床验证，不构成诊断或医疗建议。',
        'BioMedCLIP 输出是未经临床任务校准的图文相似度，不是概率、KL 分级或正式影像报告。',
        '文本相关度表示检索排序，不等于证据质量；合成病例检索默认关闭。',
      ],
    },
  ],
  publications: [],
};

export const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '文章', href: '/blog' },
  { label: '关于', href: '/about' },
] as const;

export function getProject(slug: string): Project | undefined {
  return profile.projects.find((project) => project.slug === slug);
}
