import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://vibe-prompt-hub.pages.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: ['favicon.svg', 'icons/*.png', 'og/*.svg'],
      manifest: {
        name: 'バイブコーディング向けプロンプト集',
        short_name: 'Prompt Hub',
        description:
          'コーディング、レビュー、リファクタリング、設計、デバッグまで実務でそのまま使える日本語プロンプト集。',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        start_url: '/',
        scope: '/',
        lang: 'ja',
        orientation: 'portrait',
        categories: ['productivity', 'developer', 'education'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'プロンプトを探す',
            short_name: '検索',
            description: 'カテゴリやタグからプロンプトを探す',
            url: '/prompts/',
          },
          {
            name: 'お気に入りを見る',
            short_name: 'お気に入り',
            description: '保存したプロンプトを確認する',
            url: '/favorites/',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,txt,xml}'],
        navigateFallbackDenylist: [/^\/(?!$)/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
