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

export const profile = {
  name: '你的名字',
  role: 'AI Agent 方向研究生',
  tagline: '用大模型构建真正有用的智能体',
  email: 'you@example.com',
  location: '城市 · 中国',
  education: ['计算机科学 · 硕士（在读）', '计算机科学 · 本科'],
  researchInterests: ['AI Agent', '大语言模型应用', '工具调用', '多智能体协作', 'RAG'],
  jobIntention: 'AI 应用 / Agent 方向研发岗位',
  about: [
    '我是计算机专业研究生，研究方向为 AI Agent 与大模型应用，关注如何让大模型在真实场景中可靠地完成任务。',
    '实践中积累了从 Agent 框架搭建、工具调用设计到 RAG 检索增强、性能调优的完整经验。',
  ],
  social: {
    github: 'https://github.com/',
    linkedin: '',
    wechat: '',
  },
  resumeUrl: '/resume.pdf',
  projects: [
    {
      title: '示例项目：多智能体协作框架',
      description: '一个支持角色分工、任务编排与结果合并的多智能体协作框架，用于复杂任务自动化。',
      tags: ['Python', 'LangGraph', 'LLM'],
      highlights: ['支持动态任务编排与多轮工具调用', '内置错误恢复与结果校验机制'],
      github: 'https://github.com/',
      demo: '',
      year: '2025',
      featured: true,
    },
    {
      title: '示例项目：RAG 知识库问答',
      description: '基于向量检索与大模型的文档问答系统，支持多文档问答与引用溯源。',
      tags: ['Python', 'LangChain', 'FAISS'],
      highlights: ['混合检索提升召回率', '答案带引用来源'],
      github: 'https://github.com/',
      year: '2025',
      featured: true,
    },
    {
      title: '示例项目：Agent 评测平台',
      description: '用于量化评测 Agent 任务完成质量与工具调用正确率的平台。',
      tags: ['Python', 'FastAPI', 'Vue'],
      highlights: ['自动化评测流水线', '可视化结果对比'],
      github: 'https://github.com/',
      year: '2024',
      featured: false,
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
      category: 'AI 框架',
      skills: [
        { name: 'LangChain', level: 85 },
        { name: 'LangGraph', level: 80 },
        { name: 'PyTorch', level: 65 },
      ],
    },
    {
      category: '工具与平台',
      skills: [
        { name: 'Docker', level: 75 },
        { name: 'Git', level: 85 },
        { name: 'FastAPI', level: 80 },
      ],
    },
  ],
  publications: [
    {
      title: '示例论文：面向工具调用的 Agent 可靠性研究',
      authors: '你, 合作者等',
      venue: '某会议/期刊',
      year: '2026',
      url: '',
    },
  ],
};

export const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
  { label: '技能', href: '/skills' },
  { label: '研究', href: '/research' },
  { label: '博客', href: '/blog' },
] as const;
