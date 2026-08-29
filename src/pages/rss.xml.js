import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: `${profile.brandName}的项目笔记`,
    description: '记录 AI Agent 工程中的架构选择、验证证据与失败边界',
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
