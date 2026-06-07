// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dadanote.net',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: {
    '/posts/2026-05-16-stock-ai-pipeline':    '/posts/2026-05-16-dev-001/',
    '/posts/2026-05-16-stock-ai-pipeline/':   '/posts/2026-05-16-dev-001/',
    '/posts/2026-05-18-stock-ai-pipeline':    '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-18-stock-ai-pipeline/':   '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-18-skhynix':              '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-18-skhynix/':             '/posts/2026-05-18-dev-001/',
    '/posts/2026-05-28-viltrox-af50-review':  '/posts/2026-05-28-tech-001/',
    '/posts/2026-05-28-viltrox-af50-review/': '/posts/2026-05-28-tech-001/',
    '/posts/2026-05-28-stock-data-sources-3': '/posts/2026-05-28-dev-001/',
    '/posts/2026-05-28-stock-data-sources-3/':'/posts/2026-05-28-dev-001/',
    '/posts/20260523_weekend_screener':        '/',
    '/posts/20260523_weekend_screener/':       '/',
  },
});