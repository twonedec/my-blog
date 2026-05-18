// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dadanote.net',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: {
    '/posts/2026-05-16-stock-ai-pipeline':  '/posts/2026-05-18-stock-ai-pipeline/',
    '/posts/2026-05-16-stock-ai-pipeline/': '/posts/2026-05-18-stock-ai-pipeline/',
  },
});