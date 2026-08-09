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
