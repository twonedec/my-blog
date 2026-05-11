// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 나중에 실제 도메인으로 변경하세요
  site: 'https://dadanote.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});