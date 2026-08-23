// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolio-jim-40ea.vercel.app',
  vite: { plugins: [tailwind()] },
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light' },
  },
});
