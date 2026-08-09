# 个人作品集网站

一个面向 **AI Agent 方向研究生**的个人作品集网站，用于展示研究兴趣、代表性项目、技能、论文成果与技术博客。站点基于 [Astro](https://astro.build) 构建，输出静态站点，可部署到任意静态托管平台。

## 技术栈

| 技术 | 说明 |
| :--- | :--- |
| [Astro](https://astro.build) | 站点框架（内容驱动，静态生成） |
| [Tailwind CSS](https://tailwindcss.com) | 样式方案（含 `dark` 暗色模式） |
| [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx) | Markdown / MDX 文章支持 |
| [@astrojs/rss](https://docs.astro.build/en/guides/rss) | 博客 RSS 订阅 |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap) | 站点地图（SEO） |
| [Shiki](https://shiki.style) | 代码高亮 |

## 页面结构

- `/` 首页：个人简介（姓名、身份、标语、研究兴趣标签、操作按钮）、精选项目、最新文章
- `/projects` 项目展示（支持标签筛选）
- `/about` 关于我（求职意向、教育背景、研究兴趣）
- `/skills` 技能清单（技能条）
- `/research` 研究与论文成果
- `/blog` 博客列表
- `/blog/:slug` 文章详情（含目录导航、代码高亮）
- `/404` 自定义 404 页面
- `/rss.xml` / `/sitemap-index.xml` / `/resume.pdf`

## 本地开发

环境要求：**Node.js ≥ 22.12.0**。

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 类型检查（Astro + TS）
npx astro check

# 生产构建（输出到 dist/）
npm run build

# 本地预览生产构建
npm run preview
```

## 项目结构

```text
/
├── public/                  # 静态资源（直接复制到构建产物）
│   ├── resume.pdf           # 简历文件
│   ├── robots.txt           # 搜索引擎爬虫规则（含站点地图地址）
│   ├── favicon.svg / favicon.ico / og-default.png
├── src/
│   ├── data/profile.ts      # ★ 个人信息统一入口（姓名、项目、技能等）
│   ├── content/
│   │   └── blog/            # 博客文章（Markdown）
│   ├── components/          # Header / Footer / ProjectCard 等组件
│   ├── layouts/             # BaseLayout 页面布局
│   ├── pages/               # 路由页面
│   └── styles/global.css    # Tailwind 入口与主题变量
├── astro.config.mjs         # Astro 配置（site 域名、集成）
└── package.json
```

## 部署指南

### 方式一：Vercel（推荐）

1. 将本仓库推送到 GitHub（`git push`）。
2. 打开 [vercel.com](https://vercel.com) 并登录，点击 **Add New → Project**。
3. 导入本仓库，Vercel 会自动识别为 Astro 项目，保持默认配置即可：
   - Framework Preset：`Astro`
   - Build Command：`npm run build`
   - Output Directory：`dist`
4. 点击 **Deploy**，等待构建完成即可获得线上地址。
5. （可选）在项目设置 **Domains** 中添加自定义域名。

### 方式二：GitHub Pages（配合 GitHub Actions）

1. 在仓库 **Settings → Pages** 中，将 **Source** 选择为 `GitHub Actions`。
2. 在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. 提交并推送后，在 **Actions** 中确认构建通过，站点即发布到 `https://<用户名>.github.io/`。

> 注意：若仓库名不是 `<用户名>.github.io`（即部署到 `https://<用户名>.github.io/<仓库名>/`），需在 `astro.config.mjs` 中添加 `base: '/<仓库名>/'`，并同步更新站内所有绝对路径链接与 `site` 域名。

## 内容更新指南

所有个人信息集中在 **`src/data/profile.ts`**，改一个文件即可同步全站。

### 1. 修改个人信息

编辑 `src/data/profile.ts`：

- `name` / `role` / `tagline`：姓名、身份、标语
- `email` / `location` / `social`：联系方式与社交链接
- `about`：关于我的段落
- `education` / `researchInterests` / `jobIntention`：教育、研究兴趣、求职意向
- `projects`：项目列表（`title` / `description` / `tags` / `highlights` / `github` / `demo` / `year` / `featured`）
- `skillCategories`：技能分类与熟练度（`level` 0-100）
- `publications`：论文 / 成果列表

> 提示：页面顶部导航的站点名称与浏览器标题会统一读取 `profile.name`，无需单独修改。

### 2. 新增博客文章

1. 在 `src/content/blog/` 下新建 Markdown 文件，如 `my-post.md`。
2. 文件顶部填写 frontmatter：

```markdown
---
title: 文章标题
description: 一句话摘要（用于列表与 SEO）
pubDate: 2026-08-09
tags: [AI Agent, 教程]
draft: false
---

这里是正文，支持 Markdown 语法与代码高亮。
```

3. 保存后站点会自动在 `/blog` 列表、首页「最新文章」及 `/rss.xml` 中收录。
4. 若暂时不想发布，将 `draft` 设为 `true`。

### 3. 替换简历

直接覆盖 `public/resume.pdf`，保持文件名不变即可。站点首页「下载简历」按钮与 `profile.resumeUrl` 都指向该文件。

### 4. 更换域名

部署前请务必更新以下两处，否则 RSS / 站点地图会指向占位域名：

1. `astro.config.mjs` 中的 `site`：
   ```js
   site: 'https://你的域名.com',
   ```
2. `public/robots.txt` 中的 Sitemap 地址：
   ```
   Sitemap: https://你的域名.com/sitemap-index.xml
   ```

更新后重新 `npm run build`，RSS 与 sitemap 中的链接即会随之刷新。

## 常见问题

- **暗色模式**：跟随系统 `prefers-color-scheme` 自动切换，无需手动配置。
- **本地开发报端口占用**：执行 `npx astro dev stop` 后再重新 `npm run dev`。
- **构建产物**：`npm run build` 输出到 `dist/`，可直接部署该目录。

## License

MIT
