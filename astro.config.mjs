// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 글 frontmatter의 updated(없으면 date)로 sitemap lastmod를 채운다.
// → 구글이 "어떤 글이 새로 올라왔/바뀌었는지" 알고 새 글·수정 글을 빨리 재크롤한다.
const POSTS_DIR = fileURLToPath(new URL('./src/content/posts', import.meta.url));
const lastmodByUrl = {};
let latestMod = '';
if (fs.existsSync(POSTS_DIR)) {
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const fm = raw.split('---')[1] || '';
    if (/^draft:\s*true/m.test(fm)) continue;
    const m = fm.match(/^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m)
           || fm.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m);
    if (!m) continue;
    const iso = new Date(m[1] + 'T00:00:00Z').toISOString();
    lastmodByUrl[`https://dadanote.net/posts/${file.replace(/\.md$/, '')}/`] = iso;
    if (iso > latestMod) latestMod = iso;
  }
}

export default defineConfig({
  site: 'https://dadanote.net',
  trailingSlash: 'always',
  markdown: {
    gfm: false,
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
  },
  integrations: [sitemap({
    serialize(item) {
      const lm = lastmodByUrl[item.url] || latestMod;
      if (lm) item.lastmod = lm;
      return item;
    },
  })],
  redirects: {
    '/dev-quant/': '/side-income/',
    '/tech-gear/': '/side-income/',
    '/travel-kids/': '/side-income/',
    '/life-policy/': '/side-income/',
    '/sitemap.xml': '/sitemap-index.xml',
  },
});