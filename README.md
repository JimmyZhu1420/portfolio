# 朱佳明 · AI Agent 工程作品集

一个面向面试官与技术同行的个人作品集网站。站点重点展示两个可核验的 AI Agent 项目，而不是堆叠技能熟练度：

- [EvoAgent](https://github.com/JimmyZhu1420/EvoAgent)：面向 GitHub PR 的可验证多智能体代码审查平台。
- OA Evidence Agent：面向膝骨关节炎研究场景的证据增强 Agent，公开仓库正在整理。

站点基于 Astro 7、Tailwind CSS 4 与内容集合构建，输出纯静态页面。项目流程图使用原生 HTML/CSS 动效，并支持 `prefers-reduced-motion`。

## 页面

- `/`：个人定位、能力方向、两个代表项目与最新项目笔记
- `/projects`：项目案例索引
- `/projects/evoagent`、`/projects/oa`：问题、系统实现、执行流程、验证证据与能力边界
- `/about`：个人介绍、教育经历、求职方向与有项目证据的能力清单
- `/blog`：真实项目技术笔记
- `/skills`、`/research`：保留的次级入口，不出现在主导航
- `/rss.xml`、`/sitemap-index.xml`：内容订阅与站点地图

## 本地开发

需要 Node.js 22.12 或更高版本。

```bash
npm install
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

验证生产版本：

```bash
npx astro check
npm run build
```

## 内容入口

- `src/data/profile.ts`：个人信息、能力与项目案例数据
- `src/content/blog/`：Markdown 项目笔记；`draft: true` 的文章不会发布
- `src/components/ProjectVisual.astro`：EvoAgent / OA 的轻量架构 walkthrough
- `src/pages/projects/[slug].astro`：从项目数据静态生成详情页
- `public/og-agent-system.png`：社交分享图

## 待发布时处理

域名和简历本轮按需求保持不变。正式上线前再完成以下两项：

1. 将 `astro.config.mjs` 和 `public/robots.txt` 中的 `example.com` 换成正式域名。
2. 用正式文件替换 `public/resume.pdf`。

OA 的最新本地企业化改造目前尚未完整推送到公开仓库；对外展示前，应先把计划公开的版本提交并推送，确保案例页与 GitHub 源码一致。
