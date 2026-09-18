import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'twonelab',
    description: 'Twoneworks 공식 기술 자료실 & 엔지니어링 아카이브 — 직접 만들고 검증한 실전 기록.',
    site: context.site,
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>ko-kr</language>`,
  });
}
