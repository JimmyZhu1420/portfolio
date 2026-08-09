# 个人博客/作品集网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个用于求职展示的 AI Agent 方向研究生个人网站（Astro 多页面静态站），包含首页、项目、关于、技能、研究、博客六个板块，明亮简洁风格，中文为主，用占位内容搭好雏形。

**Architecture:** Astro 5/6 静态生成多页面站点。内容与展示分离：个人数据集中在 `src/data/profile.ts`（单一类型化配置），博客文章用 Markdown/MDX 存于 `src/content/blog/`（Content Collections + Zod schema 校验）。组件层（Header/Footer/卡片）与页面层分离，Tailwind CSS v4 负责全部样式，暗色模式跟随系统。

**Tech Stack:** Astro（最新版，含 TypeScript）、Tailwind CSS v4、@astrojs/mdx、@astrojs/sitemap、@astrojs/rss、Lucide 图标（或内联 SVG）。

## Global Constraints

- Node >= 20（当前环境 v24.15.0，满足）
- 内容语言：中文为主；界面文案用中文，代码注释用中文
- 主题：明亮简洁风，主色 indigo `#4F46E5`–`#6366F1`，背景 `#FFFFFF` / `#F8FAFC`，文字 `#0F172A`
- 字体：中文系统栈 + Inter + JetBrains Mono（代码）
- 本阶段所有个人内容为占位/示例数据，结构即后续填充模板
- 全部内容经 `src/data/profile.ts` 与 `src/content/blog/` 管理，组件不硬编码内容
- 每次任务结束构建必须通过（`npm run build` 无错误，`npx astro check` 无类型错误）

---

### Task 1: 项目脚手架初始化

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `public/favicon.svg`（由 `create astro` 生成，随后调整）

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 Astro 项目骨架；`src/pages/index.astro` 入口

- [ ] **Step 1: 用官方脚手架创建 Astro 项目**

在当前目录（`e:\code\blog`，已 git init）运行：

```bash
cd "e:/code/blog"
npm create astro@latest -- --template minimal --typescript strict --git false --install --yes 2>&1
```

说明：`--git false` 避免重复初始化 git；使用 minimal 模板（`src/pages/index.astro` + `astro.config.mjs` 最简结构）。

- [ ] **Step 2: 添加 Tailwind 集成**

```bash
npx astro add tailwind -y
```

Expected: 安装 `tailwindcss` 与 `@tailwindcss/vite`，`astro.config.mjs` 出现 `tailwind()` 集成。确认 `astro.config.mjs` 类似：

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwind()] },
});
```

- [ ] **Step 3: 验证开发服务器与构建**

```bash
npm run dev -- --port 4321
```

访问 `http://localhost:4321` 能看到 Astro 默认页。随后：

```bash
npm run build
```

Expected: 构建成功，`dist/` 目录生成。然后 **Commit**：

```bash
git add -A
git commit -m "chore: scaffold Astro project with Tailwind"
```

---

### Task 2: 基础配置、内容集合与数据模型

**Files:**
- Create: `src/content.config.ts`, `src/data/profile.ts`, `src/lib/utils.ts`
- Modify: `astro.config.mjs`（加 sitemap/mdx 集成与 site 配置）, `src/styles/global.css`（初始化 Tailwind 入口）

**Interfaces:**
- Consumes: Task 1 的 Astro 骨架
- Produces:
  - `src/data/profile.ts` 导出 `profile` 对象与类型 `Project`, `SkillCategory`, `Publication`（后续所有页面消费）
  - `src/content.config.ts` 导出 `collections = { blog }`（Task 9 消费）
  - `src/lib/utils.ts` 导出 `cn()` 类名拼接工具（全站消费）

- [ ] **Step 1: 配置 astro.config.mjs**

重写为：

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // TODO 占位域名，部署时替换
  vite: { plugins: [tailwind()] },
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light' },
  },
});
```

- [ ] **Step 2: 安装额外依赖**

```bash
npm install @astrojs/mdx @astrojs/sitemap
```

- [ ] **Step 3: 定义内容集合 `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 4: 创建 `src/lib/utils.ts`**

```ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
```

- [ ] **Step 5: 创建数据模型 `src/data/profile.ts`**

占位数据，全部字段即后续内容模板：

```ts
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
```

- [ ] **Step 6: 初始化全局样式 `src/styles/global.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Inter', 'PingFang SC', 'Source Han Sans SC', 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-ink: #0f172a;
  --color-paper: #ffffff;
  --color-mist: #f8fafc;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-paper);
}
```

- [ ] **Step 7: 验证类型与构建**

```bash
npx astro check
npm run build
```

Expected: 均通过，`src/pages/index.astro` 仍渲染默认页。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add content collections, profile data model and global styles"
```

---

### Task 3: 基础布局组件（Layout / Header / Footer）

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `public/favicon.svg`, `public/og-default.png`（占位图，可用简单 SVG 生成）

**Interfaces:**
- Consumes: Task 2 的 `profile`、`cn()`
- Produces: `<BaseLayout title description>` 布局组件；`Header`、`Footer` 导航组件；全站路由消费

- [ ] **Step 1: 导航数据结构**

在 `src/data/profile.ts` 末尾追加导航配置（或新建 `src/data/nav.ts`）：

```ts
export const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
  { label: '技能', href: '/skills' },
  { label: '研究', href: '/research' },
  { label: '博客', href: '/blog' },
] as const;
```

- [ ] **Step 2: 创建 `src/layouts/BaseLayout.astro`**

```astro
---
import { cn } from '../lib/utils';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  active?: string;
}

const { title, description = '', active } = Astro.props;
const fullTitle = title ? `${title} · ${'你的名字'}` : '你的名字 · 个人主页';
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <meta name="generator" content={Astro.generator} />
    <script is:inline>
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const set = (d) => document.documentElement.classList.toggle('dark', d);
      set(mql.matches);
      mql.addEventListener('change', (e) => set(e.matches));
    </script>
  </head>
  <body class="min-h-screen antialiased">
    <Header active={active} />
    <main class="mx-auto max-w-4xl px-6 py-16">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: 创建 `src/components/Header.astro`**

```astro
---
import { navItems } from '../data/profile';
import { cn } from '../lib/utils';

interface Props {
  active?: string;
}
const { active } = Astro.props;
---

<header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
  <nav class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
    <a href="/" class="text-lg font-bold tracking-tight">你的名字</a>
    <ul class="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 sm:flex">
      {
        navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class={cn(
                'transition-colors hover:text-slate-900 dark:hover:text-white',
                active === item.href && 'font-semibold text-primary-600 dark:text-primary-500',
              )}
            >
              {item.label}
            </a>
          </li>
        ))
      }
    </ul>
  </nav>
</header>
```

- [ ] **Step 4: 创建 `src/components/Footer.astro`**

```astro
---
import { profile } from '../data/profile';
const year = new Date().getFullYear();
---

<footer class="border-t border-slate-200/70 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
  <p>© {year} {profile.name} · 用 Astro 构建</p>
  <p class="mt-2">
    <a href={`mailto:${profile.email}`} class="underline-offset-2 hover:underline">{profile.email}</a>
  </p>
</footer>
```

- [ ] **Step 5: 创建 `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#4f46e5"/>
  <text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="bold" fill="#fff" text-anchor="middle">A</text>
</svg>
```

- [ ] **Step 6: 替换首页为使用布局**

将 `src/pages/index.astro` 替换为最小占位（Task 5 会做完整首页）：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="首页" description="AI Agent 方向研究生的个人主页" active="/">
  <h1 class="text-3xl font-bold">网站雏形搭建中</h1>
</BaseLayout>
```

- [ ] **Step 7: 验证**

```bash
npx astro check
npm run build
npm run dev -- --port 4321
```

Expected: 页面显示顶部导航 + "网站雏形搭建中" + 页脚；暗色模式跟随系统切换。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add layout, header and footer components"
```

---

### Task 4: 通用内容组件（Section 标题 / 项目卡片 / 技能条）

**Files:**
- Create: `src/components/SectionHeading.astro`, `src/components/ProjectCard.astro`, `src/components/SkillBar.astro`, `src/components/Tag.astro`

**Interfaces:**
- Consumes: Task 2 的 `Project`, `SkillCategory` 类型与 `profile`；Task 3 的 `cn()`
- Produces: `<ProjectCard project={Project} />`, `<SkillBar name level />`, `<Tag>`, `<SectionHeading title description>` — Task 5-8 消费

- [ ] **Step 1: 创建 `src/components/SectionHeading.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}
const { title, description, href, linkText } = Astro.props;
---

<div class="mb-8">
  <h2 class="text-2xl font-bold tracking-tight">{title}</h2>
  {description && <p class="mt-2 text-slate-600 dark:text-slate-400">{description}</p>}
  {href && (
    <a href={href} class="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
      {linkText ?? '查看全部 →'}
    </a>
  )}
</div>
```

- [ ] **Step 2: 创建 `src/components/Tag.astro`**

```astro
---
interface Props {
  label: string;
}
const { label } = Astro.props;
---
<span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
  {label}
</span>
```

- [ ] **Step 3: 创建 `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '../data/profile';
import Tag from './Tag.astro';

const { project } = Astro.props as { project: Project };
---

<article class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
  <div class="flex items-start justify-between gap-4">
    <h3 class="text-lg font-semibold leading-snug">{project.title}</h3>
    {project.year && <span class="shrink-0 text-sm text-slate-400">{project.year}</span>}
  </div>
  <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
  <ul class="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
    {project.highlights.map((h) => (
      <li class="flex gap-2">
        <span class="text-primary-500">•</span>
        <span>{h}</span>
      </li>
    ))}
  </ul>
  <div class="mt-4 flex flex-wrap gap-1.5">
    {project.tags.map((t) => <Tag label={t} />)}
  </div>
  <div class="mt-5 flex items-center gap-4 text-sm">
    {project.github && (
      <a href={project.github} target="_blank" rel="noopener" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
        GitHub ↗
      </a>
    )}
    {project.demo && (
      <a href={project.demo} target="_blank" rel="noopener" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
        演示 ↗
      </a>
    )}
  </div>
</article>
```

- [ ] **Step 4: 创建 `src/components/SkillBar.astro`**

```astro
---
interface Props {
  name: string;
  level: number;
}
const { name, level } = Astro.props;
---

<div>
  <div class="mb-1 flex items-center justify-between text-sm">
    <span class="font-medium">{name}</span>
    <span class="text-slate-400">{level}%</span>
  </div>
  <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
    <div class="h-full rounded-full bg-primary-500 transition-[width] duration-700" style={`width: ${level}%`}></div>
  </div>
</div>
```

- [ ] **Step 5: 验证**

```bash
npx astro check
npm run build
```

Expected: 通过。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add reusable content components"
```

---

### Task 5: 首页 `/`

**Files:**
- Create: `src/pages/index.astro`（完整重写）

**Interfaces:**
- Consumes: `profile`, `ProjectCard`, `Tag`, `SectionHeading`, `getCollection`(Task 9 定义的 blog 集合，先用空数组兜底)

- [ ] **Step 1: 编写完整首页**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import SectionHeading from '../components/SectionHeading.astro';
import Tag from '../components/Tag.astro';
import { profile } from '../data/profile';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
const featuredProjects = profile.projects.filter((p) => p.featured);
---

<BaseLayout title="首页" description={profile.tagline} active="/">
  <!-- Hero -->
  <section class="py-16 text-center">
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
    <p class="mt-4 text-lg text-primary-600 dark:text-primary-500">{profile.role}</p>
    <p class="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{profile.tagline}</p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      {profile.researchInterests.map((r) => <Tag label={r} />)}
    </div>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <a href="/projects" class="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500">
        查看我的项目
      </a>
      <a href={profile.resumeUrl} class="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium transition-colors hover:border-slate-400 dark:border-slate-700">
        下载简历
      </a>
    </div>
  </section>

  <!-- 精选项目 -->
  <section class="py-10">
    <SectionHeading title="精选项目" description="我正在做的事" href="/projects" />
    <div class="grid gap-6 md:grid-cols-2">
      {featuredProjects.map((p) => <ProjectCard project={p} />)}
    </div>
  </section>

  <!-- 最新文章 -->
  {
    posts.length > 0 && (
      <section class="py-10">
        <SectionHeading title="最新文章" href="/blog" />
        <ul class="divide-y divide-slate-200 dark:divide-slate-800">
          {posts.slice(0, 3).map((post) => (
            <li class="py-4">
              <a href={`/blog/${post.id}`} class="group block">
                <h3 class="font-medium transition-colors group-hover:text-primary-600">{post.data.title}</h3>
                <p class="mt-1 text-sm text-slate-500">
                  {post.data.pubDate.toLocaleDateString('zh-CN')} · {post.data.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }
</BaseLayout>
```

- [ ] **Step 2: 验证**

```bash
npx astro check
npm run build
```

Expected: 首页展示 Hero、精选项目卡片、技能标签；博客区在无文章时不渲染。然后 **Commit**：

```bash
git add -A
git commit -m "feat: build home page with hero and featured sections"
```

---

### Task 6: 项目展示页 `/projects`

**Files:**
- Create: `src/pages/projects/index.astro`, `src/components/ProjectFilter.astro`（客户端筛选）

**Interfaces:**
- Consumes: `profile.projects`, `ProjectCard`, `Tag`

- [ ] **Step 1: 编写项目页**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import SectionHeading from '../../components/SectionHeading.astro';
import { profile } from '../../data/profile';

const allTags = [...new Set(profile.projects.flatMap((p) => p.tags))];
---

<BaseLayout title="项目" description="我的代表性项目" active="/projects">
  <SectionHeading title="项目展示" description="我的代表性工作" />

  <div class="mb-8 flex flex-wrap gap-2" id="filter-bar">
    <button data-filter="全部" class="filter-btn rounded-full px-4 py-1.5 text-sm font-medium bg-primary-600 text-white">全部</button>
    {allTags.map((t) => (
      <button data-filter={t} class="filter-btn rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300">
        {t}
      </button>
    ))}
  </div>

  <div class="grid gap-6 md:grid-cols-2" id="project-grid">
    {profile.projects.map((p) => (
      <div class="project-card" data-tags={p.tags.join(',')}>
        <ProjectCard project={p} />
      </div>
    ))}
  </div>

  <script>
    const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    const cards = document.querySelectorAll<HTMLElement>('.project-card');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter!;
        buttons.forEach((b) => {
          const isActive = b.dataset.filter === filter;
          b.classList.toggle('bg-primary-600', isActive);
          b.classList.toggle('text-white', isActive);
          b.classList.remove('border-primary-500', 'text-primary-600');
        });
        cards.forEach((card) => {
          const tags = card.dataset.tags!.split(',');
          card.style.display = filter === '全部' || tags.includes(filter) ? '' : 'none';
        });
      });
    });
  </script>
</BaseLayout>
```

- [ ] **Step 2: 验证**

```bash
npx astro check
npm run build
```

Expected: 项目页显示项目卡片网格；点击标签筛选生效（首次构建无文章，仍应显示全部项目）。然后 **Commit**：

```bash
git add -A
git commit -m "feat: build projects page with tag filtering"
```

---

### Task 7: 关于页 `/about` 与技能页 `/skills`

**Files:**
- Create: `src/pages/about.astro`, `src/pages/skills.astro`

**Interfaces:**
- Consumes: `profile`（education, about, researchInterests, jobIntention）, `SkillBar`, `Tag`

- [ ] **Step 1: 编写 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import Tag from '../components/Tag.astro';
import { profile } from '../data/profile';
---

<BaseLayout title="关于我" description="我的教育背景与研究兴趣" active="/about">
  <SectionHeading title="关于我" description={profile.role} />

  <div class="space-y-6 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
    {profile.about.map((p) => <p>{p}</p>)}
  </div>

  <section class="mt-12">
    <h2 class="mb-4 text-xl font-bold">求职意向</h2>
    <p class="text-slate-700 dark:text-slate-300">{profile.jobIntention}</p>
  </section>

  <section class="mt-12">
    <h2 class="mb-4 text-xl font-bold">教育背景</h2>
    <ul class="space-y-3">
      {profile.education.map((e) => (
        <li class="flex items-center gap-3">
          <span class="h-2 w-2 rounded-full bg-primary-500"></span>
          <span class="text-slate-700 dark:text-slate-300">{e}</span>
        </li>
      ))}
    </ul>
  </section>

  <section class="mt-12">
    <h2 class="mb-4 text-xl font-bold">研究兴趣</h2>
    <div class="flex flex-wrap gap-2">
      {profile.researchInterests.map((r) => <Tag label={r} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 编写 `src/pages/skills.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import SkillBar from '../components/SkillBar.astro';
import { profile } from '../data/profile';
---

<BaseLayout title="技能" description="我的技术栈" active="/skills">
  <SectionHeading title="技能清单" description="我的技术栈" />

  <div class="grid gap-10 md:grid-cols-2">
    {profile.skillCategories.map((cat) => (
      <section>
        <h2 class="mb-5 text-xl font-bold">{cat.category}</h2>
        <div class="space-y-5">
          {cat.skills.map((s) => <SkillBar name={s.name} level={s.level} />)}
        </div>
      </section>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 3: 验证**

```bash
npx astro check
npm run build
```

Expected: 两页正常渲染。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add about and skills pages"
```

---

### Task 8: 研究/论文页 `/research`

**Files:**
- Create: `src/pages/research.astro`

**Interfaces:**
- Consumes: `profile.publications`, `profile.researchInterests`

- [ ] **Step 1: 编写研究页**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import Tag from '../components/Tag.astro';
import { profile } from '../data/profile';
---

<BaseLayout title="研究" description="研究兴趣与成果" active="/research">
  <SectionHeading title="研究" description="AI Agent 与大模型应用方向" />

  <section class="mb-12">
    <h2 class="mb-4 text-xl font-bold">研究兴趣</h2>
    <div class="flex flex-wrap gap-2">
      {profile.researchInterests.map((r) => <Tag label={r} />)}
    </div>
  </section>

  <section>
    <h2 class="mb-6 text-xl font-bold">论文 / 成果</h2>
    {
      profile.publications.length > 0 ? (
        <ul class="space-y-4">
          {profile.publications.map((pub) => (
            <li class="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 class="font-semibold">
                {pub.url ? <a href={pub.url} target="_blank" rel="noopener" class="hover:text-primary-600">{pub.title} ↗</a> : pub.title}
              </h3>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{pub.authors}</p>
              <p class="mt-1 text-sm text-slate-500">{pub.venue} · {pub.year}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p class="text-slate-500">暂无研究成果，将陆续补充。</p>
      )
    }
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证**

```bash
npx astro check
npm run build
```

Expected: 正常渲染。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add research page"
```

---

### Task 9: 博客系统（列表 + 文章页）

**Files:**
- Create: `src/content/blog/hello-astro.md`, `src/content/blog/ai-agent-intro.md`（示例文章）, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`

**Interfaces:**
- Consumes: Task 2 的 `collections.blog`
- Produces: 博客列表路由 `/blog` 与文章路由 `/blog/:slug`，首页 Task 5 与页脚可跳转

- [ ] **Step 1: 创建示例文章 `src/content/blog/hello-astro.md`**

```md
---
title: 欢迎来到我的博客
description: 这个博客用来记录我在 AI Agent 方向的思考与实践。
pubDate: 2026-08-01
tags: [随笔]
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
```

- [ ] **Step 2: 创建示例文章 `src/content/blog/ai-agent-intro.md`**

```md
---
title: AI Agent 入门：从 LLM 到智能体
description: 简述智能体（Agent）的核心概念、系统组成与一个最小实现。
pubDate: 2026-08-05
tags: [AI Agent, 教程]
---

## 什么是 AI Agent

AI Agent 是能够**自主感知、决策并采取行动**以完成目标的系统，其核心是让大模型（LLM）作为"大脑"，配合工具与循环机制在真实任务中工作。

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
```

- [ ] **Step 3: 创建博客列表页 `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SectionHeading from '../../components/SectionHeading.astro';
import Tag from '../../components/Tag.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BaseLayout title="博客" description="技术与思考文章" active="/blog">
  <SectionHeading title="博客" description="记录思考与实践" />
  <ul class="space-y-2">
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.id}`} class="group block rounded-xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
          <h2 class="text-lg font-semibold group-hover:text-primary-600">{post.data.title}</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{post.data.description}</p>
          <div class="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>{post.data.pubDate.toLocaleDateString('zh-CN')}</span>
            <div class="flex gap-1.5">
              {post.data.tags.map((t) => <Tag label={t} />)}
            </div>
          </div>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 4: 创建文章详情页 `src/pages/blog/[...slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Tag from '../../components/Tag.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="mx-auto max-w-3xl">
    <header class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight">{post.data.title}</h1>
      <div class="mt-3 flex items-center gap-3 text-sm text-slate-500">
        <time>{post.data.pubDate.toLocaleDateString('zh-CN')}</time>
        <div class="flex gap-1.5">
          {post.data.tags.map((t) => <Tag label={t} />)}
        </div>
      </div>
    </header>

    {
      headings.length > 1 && (
        <nav class="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="mb-2 font-semibold">目录</p>
          <ul class="space-y-1">
            {headings.filter((h) => h.depth <= 2).map((h) => (
              <li>
                <a href={`#${h.slug}`} class="text-slate-600 hover:text-primary-600 dark:text-slate-400">
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )
    }

    <div class="prose prose-slate max-w-none dark:prose-invert">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 5: 安装 Markdown 排版样式（@tailwindcss/typography）**

```bash
npm install @tailwindcss/typography
```

并在 `src/styles/global.css` 顶部引入插件（Tailwind 4 方式）：

```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 6: 验证**

```bash
npx astro check
npm run build
npm run dev -- --port 4321
```

Expected: `/blog` 列出两篇文章，点击进入文章页显示正文、代码高亮与目录导航；首页"最新文章"区出现文章。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add blog system with sample posts"
```

---

### Task 10: SEO / RSS / 简历占位 / 部署配置

**Files:**
- Create: `public/resume.pdf`（占位 PDF，可用最小合法 PDF 文件）, `src/pages/rss.xml.js`, `src/pages/404.astro`, `public/robots.txt`
- Modify: `astro.config.mjs`（site 已配）、`src/data/profile.ts`（social 已含）

**Interfaces:**
- Consumes: Task 2 的 blog collection 与 `profile`
- Produces: `/rss.xml`、`/404`、robots 与 SEO 元信息，供部署与分享

- [ ] **Step 1: 创建 RSS 端点 `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  return rss({
    title: '我的博客',
    description: 'AI Agent 方向研究生的技术博客',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>zh-cn</language>',
  });
}
```

- [ ] **Step 2: 创建 404 页 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="页面不存在">
  <div class="py-24 text-center">
    <p class="text-5xl font-bold text-primary-500">404</p>
    <h1 class="mt-4 text-2xl font-bold">页面不存在</h1>
    <p class="mt-2 text-slate-500">你访问的页面不存在或已被移动。</p>
    <a href="/" class="mt-8 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500">返回首页</a>
  </div>
</BaseLayout>
```

- [ ] **Step 3: 创建 `public/robots.txt`**

```txt
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap-index.xml
```

（`example.com` 部署后替换为真实域名。）

- [ ] **Step 4: 创建占位简历 `public/resume.pdf`**

用最小合法 PDF 文件占位（保留后续替换入口）：

```bash
cat > public/resume.pdf << 'EOF'
%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF
EOF
```

（或用任意真实占位 PDF 文件替换。）

- [ ] **Step 5: 验证与完整构建**

```bash
npx astro check
npm run build
```

Expected: 构建通过，`dist/` 含 `rss.xml`、`404.html`、`robots.txt`。然后 **Commit**：

```bash
git add -A
git commit -m "feat: add RSS, 404, robots and resume placeholder"
```

---

### Task 11: 本地预览与最终检查

**Files:**
- 无新增；可能根据预览微调样式

**Interfaces:**
- Consumes: 全部页面

- [ ] **Step 1: 启动开发服务器并逐页检查**

```bash
npm run dev -- --port 4321
```

逐页检查：`/`、`/projects`、`/about`、`/skills`、`/research`、`/blog`、`/blog/hello-astro`、`/404`。确认：
- 导航高亮正确、暗色模式正常切换
- 项目筛选交互可用
- 文章代码高亮与目录可用
- 移动端宽度（<768px）下布局正常

- [ ] **Step 2: 生产构建预览**

```bash
npm run preview
```

Expected: `http://localhost:4321` 下生产包可访问。然后 **Commit**（如有微调）：

```bash
git add -A
git commit -m "chore: final preview and polish"
```

---

## 完成标准

- [ ] `npm run build` 与 `npx astro check` 全绿
- [ ] 六个板块全部可访问，占位内容填充完整
- [ ] 首页 / 项目页 / 博客三大重点页打磨到位
- [ ] 部署说明写进 README（`README.md` 记录 Vercel/GitHub Pages 部署步骤与内容更新指南）
