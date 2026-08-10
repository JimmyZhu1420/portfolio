export interface Project {
  title: string;
  description: string;
  tags: string[];
  highlights: string[];
  github?: string;
  demo?: string;
  year?: string;
  featured?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: Array<{ name: string; level: number }>; // level 1-100
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
  resumeUrl: string;
  projects: Project[];
  skillCategories: SkillCategory[];
  publications: Publication[];
}

export const profile: Profile = {
  name: '朱佳明',
  role: '', // 头衔暂未定，留空则不显示
  tagline: '用大模型构建真正有用的智能体',
  email: 'z1030835347@gmail.com',
  location: '上海',
  education: [
    '东华大学（211 双一流）· 计算机科学与技术 · 硕士 · 2025–2028',
    '安徽理工大学 · 软件工程 · 本科 · 2020–2024',
  ],
  researchInterests: ['AI Agent', '大语言模型应用', '工具调用', '多智能体协作', 'RAG', '事实校验与证据链'],
  jobIntention: 'AI Agent 开发实习生',
  about: [
    '我是东华大学计算机科学与技术专业硕士研究生，研究方向为 AI Agent 与大模型应用，关注如何让大模型在真实业务场景中可靠、可审计地完成任务。',
    '实践上从零搭建过完整的 Agent 系统：从 LangGraph 工作流编排、工具调用与记忆设计，到混合检索增强、事实一致性校验和运行可观测性，跑通了从想法到落地的工程闭环。',
  ],
  social: {
    github: 'https://github.com/JimmyZhu1420',
    linkedin: '',
    wechat: 'Z1030835347',
  },
  resumeUrl: '/resume.pdf',
  projects: [
    {
      title: 'OsteoAgent · 膝骨关节炎证据增强临床 AI Agent',
      description:
        '面向膝骨关节炎场景的证据增强临床智能体 MVP：用 Plan-Execute-Reflect 工作流，把公开指南 RAG、研究级影像观察候选、报告起草、事实一致性校验与安全审查串成一条可复现、可审计的链路。',
      tags: ['FastAPI', 'LangGraph', 'Vue 3', 'Hybrid RAG', 'Qdrant', 'BioMedCLIP'],
      highlights: [
        'LangGraph Plan-Execute-Reflect 工作流：Planner 规划 6 类任务，Reflector 触发最多一次有界修订，避免失控与死循环',
        '可追溯 Hybrid RAG：BGE-small 本地嵌入 + Dense/BM25 混合检索 + 启发式 Rerank，证据携带机构、年份与官方 URL',
        'BioMedCLIP 影像观察候选 + SafetyCheckTool 医疗安全审查 + FactualityCheckTool 无证据声明标记',
        'SQLite 匿名运行审计（Request/run ID、哈希 session、Trace）与 /capabilities 能力透明、可观测',
        '后端 125 项 / 前端 31 项测试全过，Docker Compose 一键复现 + GitHub Actions CI',
      ],
      github: 'https://github.com/JimmyZhu1420/osteo-agent',
      year: '2026',
      featured: true,
    },
    {
      title: 'EvoAgent · PR 代码审查 Agent 服务',
      description:
        '自动审查 GitHub Pull Request 的智能体服务：统一 diff 输入，输出结构化问题、修复建议与测试建议；内置自研 Agent Runtime、分层记忆、提示词评测进化与保守型自动修复。',
      tags: ['Python', 'FastAPI', 'Agent Runtime', 'LLM', 'PostgreSQL', 'Redis'],
      highlights: [
        '自研 Agent Runtime：带 Tool Registry 与参数 Schema 校验的有界 Agent Loop，持久化 checkpoint、执行预算与任务断点续跑',
        'Working/Episodic/Semantic 三层记忆 + 租户级检索、任务归档与过期清理',
        '提示词评测与进化：验证集/隐藏集回放门禁、版本激活与回滚、失败案例回流',
        'GitHub webhook HMAC-SHA256 签名校验 + 幂等投递，独立分支保守型自动修复提交',
        'RBAC 登录、动态 Skill 沙箱、Redis Streams 租约与死信队列、OpenTelemetry + Prometheus',
      ],
      year: '2026',
      featured: true,
    },
  ],
  skillCategories: [
    {
      category: '编程语言',
      skills: [
        { name: 'Python', level: 90 },
        { name: 'TypeScript', level: 70 },
      ],
    },
    {
      category: 'Agent 与 LLM',
      skills: [
        { name: 'LangGraph', level: 85 },
        { name: 'LangChain', level: 80 },
        { name: 'RAG / 混合检索', level: 80 },
        { name: 'Prompt / 结构化输出', level: 85 },
      ],
    },
    {
      category: '后端与工具',
      skills: [
        { name: 'FastAPI', level: 85 },
        { name: 'PostgreSQL / SQLite', level: 75 },
        { name: 'Redis', level: 70 },
        { name: 'Docker', level: 80 },
        { name: 'Git', level: 85 },
      ],
    },
  ],
  publications: [], // 占位：暂无成果，后续补充
};

export const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
  { label: '技能', href: '/skills' },
  { label: '研究', href: '/research' },
  { label: '博客', href: '/blog' },
] as const;
