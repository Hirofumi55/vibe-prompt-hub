import type { PromptCategory } from '../types/prompts';

export const SITE = {
  name: 'バイブコーディング向けプロンプト集',
  shortName: 'Prompt Hub',
  description:
    '実務でそのまま使える日本語プロンプトを、コーディング、レビュー、テスト、設計、デバッグなどのカテゴリ別に整理した静的PWAサイト。',
  origin: 'https://vibe-prompt-hub.pages.dev',
  ogImage: '/og/cover.svg',
  locale: 'ja_JP',
  themeColor: '#0b1020',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'ホーム' },
  { href: '/prompts/', label: 'プロンプト' },
  { href: '/favorites/', label: 'お気に入り' },
  { href: '/about/', label: '使い方' },
] as const;

export const CATEGORY_META: Record<
  PromptCategory,
  { icon: string; description: string; helper: string }
> = {
  コーディング: {
    icon: 'code',
    description: '実装の着手を早くし、既存コードに沿った提案を得るためのカテゴリ。',
    helper: '仕様を受け取って手を動かす前に使う',
  },
  コードレビュー: {
    icon: 'scan-search',
    description: '差分や既存コードを多面的に点検し、修正案まで引き出すレビュー用カテゴリ。',
    helper: 'PR前後の品質確認に便利',
  },
  リファクタリング: {
    icon: 'wand',
    description: '安全に小さく改善しながら、責務分離や命名整理を進めるためのカテゴリ。',
    helper: '壊さず改善したい時に使う',
  },
  テスト: {
    icon: 'flask',
    description: '単体テスト、E2E観点、抜け漏れ確認まで幅広くカバーするカテゴリ。',
    helper: '実装後の品質担保におすすめ',
  },
  'バグ調査 / デバッグ': {
    icon: 'bug',
    description: '再現手順、ログ、仮説整理を通じて原因特定を速めるデバッグ向けカテゴリ。',
    helper: '不具合の切り分けを最短化する',
  },
  '設計 / アーキテクチャ': {
    icon: 'layers',
    description: '要件整理から構成案、API設計、責務分離まで設計の骨組みを固めるカテゴリ。',
    helper: '実装前に設計を固めたい時に使う',
  },
  'ドキュメント作成': {
    icon: 'file-text',
    description: 'README、仕様メモ、リリースノートなどを読みやすく整えるカテゴリ。',
    helper: '説明責任が必要な場面に強い',
  },
  パフォーマンス改善: {
    icon: 'gauge',
    description: '計測、ボトルネック特定、改善案整理を支援するパフォーマンス改善カテゴリ。',
    helper: '重い原因を見極めてから改善する',
  },
  セキュリティ確認: {
    icon: 'shield',
    description: '認可、入力検証、フロント実装の安全性を点検するためのカテゴリ。',
    helper: 'リリース前の最終確認にも有効',
  },
  'Git / PR / コミット支援': {
    icon: 'git-branch',
    description: 'コミットメッセージ、PR本文、競合解消方針などチーム開発を助けるカテゴリ。',
    helper: '共有品質を底上げしたい時に使う',
  },
  要件整理: {
    icon: 'list-checks',
    description: '曖昧な要求を論点分解し、確認事項と優先順位を整理するカテゴリ。',
    helper: '手戻りを減らしたい時に便利',
  },
  'AIへの指示改善': {
    icon: 'sparkles',
    description: '曖昧な指示を改善し、出力形式や確認ポイントを明確化するカテゴリ。',
    helper: 'AIの回答品質を安定させる',
  },
};
