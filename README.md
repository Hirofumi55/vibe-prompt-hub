# バイブコーディング向けプロンプト集

スマホで開いて、そのまま AI に貼れることを最優先にした日本語プロンプト集サイトです。  
コーディング、レビュー、リファクタリング、テスト、設計、デバッグ、ドキュメント作成などのプロンプトをカテゴリ別に整理し、カードタップで即コピーできます。

## 主な特徴

- Astro による完全静的サイト
- TypeScript strict 前提の型安全なデータ設計
- Tailwind CSS ベースのダークモード中心 UI
- ライト / ダーク切替と localStorage 永続化
- キーワード検索、カテゴリ絞り込み、タグ絞り込み、簡易ソート
- カードクリックでプロンプトをコピー
- コピー完了トースト表示
- お気に入り保存、最近使った履歴
- プロンプト詳細ページと関連プロンプト表示
- PWA 対応、ホーム画面追加、オフライン閲覧
- SEO メタ、OGP、構造化データ、sitemap、robots 対応

## 採用技術

- Framework: `Astro`
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- PWA: `@vite-pwa/astro`
- Sitemap: `@astrojs/sitemap`
- E2E Test: `Playwright`
- Font: `@fontsource/m-plus-rounded-1c`
- Data: `src/data/prompts.ts`
- Client-side: 最小限の Vanilla TypeScript

## ディレクトリ構成

```text
.
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ icons/
│  └─ og/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ layouts/
│  ├─ lib/
│  ├─ pages/
│  ├─ scripts/
│  ├─ styles/
│  └─ types/
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
└─ README.md
```

## セットアップ手順

```bash
pnpm install
```

Node.js は `22.12.0` 以上を想定しています。

## 開発サーバ起動方法

```bash
pnpm dev
```

起動後は通常 `http://localhost:4321` で確認できます。

## ビルド方法

```bash
pnpm build
```

以下も確認できます。

```bash
pnpm check
pnpm preview
```

## 自動テスト

```bash
pnpm test:e2e
```

`Playwright` で以下を確認します。

- ホームのカテゴリカードから絞り込み済み一覧へ遷移できること
- 一覧から詳細ページへ遷移できること
- コピーとお気に入り保存が `localStorage` に反映されること

## PWA 確認方法

1. `pnpm build` を実行する
2. `pnpm preview` で本番相当の配信を行う
3. Chrome DevTools の Application タブで manifest / service worker を確認する
4. モバイル表示に切り替え、ホーム画面追加やオフライン時の挙動を確認する

補足:

- service worker は `@vite-pwa/astro` が生成します
- 生成される manifest は `dist/manifest.webmanifest` です
- sitemap は `dist/sitemap-index.xml` に出力されます

## データ追加方法

プロンプトは `src/data/prompts.ts` で管理しています。  
各データは最低限、以下のフィールドを持ちます。

- `id`
- `title`
- `category`
- `summary`
- `tags`
- `prompt`
- `useCases`
- `recommendedFor`
- `difficulty`
- `isFeatured`
- `updatedAt`

追加後は `pnpm build` または `pnpm check` を実行して、型とルート生成を確認してください。

## デプロイ方法

このプロジェクトは完全静的出力です。`dist/` をそのまま静的ホスティングへ配置できます。

### Cloudflare Pages を使う場合

1. Build command: `pnpm build`
2. Output directory: `dist`
3. 必要に応じて `astro.config.mjs` の `site` を本番 URL に合わせる

### GitHub Pages を使う場合

1. `pnpm build` で `dist/` を生成
2. `dist/` を GitHub Pages 用に配信する
3. GitHub Pages の URL に合わせて `astro.config.mjs` の `site` を更新する

## Git運用方針

- `main` ブランチを基本運用とする
- 意味のある単位でコミットする
- コミットメッセージは英語または日本語で統一する
- 少なくとも以下の粒度で履歴を分ける
  - 初期セットアップ
  - デザイン基盤
  - プロンプトデータ
  - 検索 / フィルタ
  - コピー機能
  - テーマ切替
  - PWA
  - SEO
  - README
  - 最終調整

## ローカルで確認したいポイント

- スマホ幅でカードが押しやすいか
- ライト / ダーク切替が自然か
- 検索、カテゴリ、タグ、ソートが直感的か
- コピー成功トーストが即時に出るか
- お気に入りと最近使った履歴が保持されるか
- 詳細ページの余白と行間が十分か
- オフラインページと PWA manifest が正しく出力されるか

## 今後の改善案

- タグの複数選択フィルタ
- 共有導線の強化
- お気に入りの並び替え
- カテゴリ別ランディングページ
- PWA 更新通知のカスタム UI
- プロンプト検索のハイライト表示
