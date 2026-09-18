// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 글 frontmatter의 updated(없으면 date)로 sitemap lastmod를 채운다.
// → 구글이 "어떤 글이 새로 올라왔/바뀌었는지" 알고 새 글·수정 글을 빨리 재크롤한다.
const POSTS_DIR = fileURLToPath(new URL('./src/content/posts', import.meta.url));
const lastmodByUrl = {};
let latestMod = '';
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const fm = raw.split('---')[1] || '';            // 첫 --- ~ 둘째 --- 사이 = frontmatter
  if (/^draft:\s*true/m.test(fm)) continue;          // 미발행 제외
  const m = fm.match(/^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m)
         || fm.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m);
  if (!m) continue;
  const iso = new Date(m[1] + 'T00:00:00Z').toISOString();
  lastmodByUrl[`https://dadanote.net/posts/${file.replace(/\.md$/, '')}/`] = iso;
  if (iso > latestMod) latestMod = iso;
}

export default defineConfig({
  site: 'https://dadanote.net',
  trailingSlash: 'always',
  integrations: [sitemap({
    serialize(item) {
      // 글은 그 글 날짜, 목록성 페이지(홈·카테고리·archive 등)는 가장 최근 글 날짜
      const lm = lastmodByUrl[item.url] || latestMod;
      if (lm) item.lastmod = lm;
      return item;
    },
  })],
  redirects: {
    // 기존 설정
    '/posts/2026-05-16-stock-ai-pipeline/':   '/posts/2026-05-16-dev-001/',
    '/posts/2026-05-18-stock-ai-pipeline/':   '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-18-skhynix/':             '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-28-viltrox-af50-review/': '/posts/2026-05-28-tech-001/',
    '/posts/2026-05-28-stock-data-sources-3/':'/posts/2026-05-28-dev-001/',
    '/posts/20260523_weekend_screener/':       '/',

    // 구 naver-ID URL → 신 URL (색인된 28개)
    '/posts/2026-03-01-224200650972/': '/posts/2026-05-11-life-001/',
    '/posts/2026-04-05-224241914358/': '/posts/2026-05-11-life-002/',
    '/posts/2026-02-27-224197286948/': '/posts/2026-05-11-tech-001/',
    '/posts/2026-03-04-224204599470/': '/posts/2026-05-12-life-001/',
    '/posts/2026-04-23-224262966459/': '/posts/2026-05-13-travel-001/',
    '/posts/2026-05-05-224275757683/': '/posts/2026-05-13-travel-002/',
    '/posts/2026-03-01-224200428589/': '/posts/2026-05-14-travel-001/',
    '/posts/2026-02-28-224199290337/': '/posts/2026-05-15-travel-001/',
    '/posts/2026-03-30-224234491813/': '/posts/2026-05-15-travel-002/',
    '/posts/2026-03-27-224230921448/': '/posts/2026-05-16-life-001/',
    '/posts/2026-03-20-224223634771/': '/posts/2026-05-16-tech-001/',
    '/posts/2026-03-08-224208533546/': '/posts/2026-05-16-travel-001/',
    '/posts/2026-04-26-224265638068/': '/posts/2026-05-18-travel-002/',
    '/posts/2026-04-29-224269110568/': '/posts/2026-05-19-life-001/',
    '/posts/2026-04-23-224262574107/': '/posts/2026-05-19-travel-001/',
    '/posts/2026-04-23-224262741457/': '/posts/2026-05-20-travel-001/',
    '/posts/2026-02-09-224177448907/': '/posts/2026-05-21-travel-001/',
    '/posts/2026-02-16-224185849214/': '/posts/2026-05-22-travel-001/',
    '/posts/2026-03-16-224218018037/': '/posts/2026-05-23-travel-001/',
    '/posts/2026-05-08-224278861364/': '/posts/2026-05-24-travel-001/',
    '/posts/2026-05-09-224279939814/': '/posts/2026-05-24-travel-002/',
    '/posts/2026-05-09-224280109639/': '/posts/2026-05-25-life-001/',
    '/posts/2026-05-29-001/':          '/posts/2026-05-29-dev-001/',
    '/posts/2026-05-29-002/':          '/posts/2026-05-29-tech-001/',
    '/posts/2026-06-01-dji-mic-mini-review/': '/posts/2026-06-01-tech-001/',
    '/posts/2026-03-21-224224121744/': '/posts/2026-05-23-travel-002/',
    '/posts/2026-04-22-224260660038/': '/posts/2026-05-25-travel-001/',
    '/posts/2026-04-29-224269313126/': '/posts/2026-05-17-travel-001/',
    '/posts/2026-04-29-224269511900/': '/posts/2026-05-17-travel-002/',
    '/posts/2026-03-03-224201930188/': '/posts/2026-05-14-tech-001/',
    '/posts/2026-03-26-224230509277/': '/posts/2026-05-12-tech-001/',
    '/posts/2026-04-29-224269049594/': '/posts/2026-05-14-travel-002/',

    // 통합/삭제된 글 처리 (7개)
    '/posts/2026-02-16-224185756643/': '/posts/2026-05-18-travel-002/',
    '/posts/2026-02-26-224197234507/': '/posts/2026-05-23-travel-001/',
    '/posts/2026-02-21-224190025931/': '/posts/2026-05-14-travel-001/',
    '/posts/2026-04-25-224264685115/': '/posts/2026-05-18-travel-002/',
    '/posts/2026-03-10-224211880753/': '/posts/2026-05-12-life-001/',
    '/posts/2026-03-12-224214300265/': '/posts/2026-05-11-tech-001/',
    '/posts/2026-04-14-224252350477/': '/posts/2026-05-12-tech-001/',
  },
});