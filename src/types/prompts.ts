export const PROMPT_CATEGORIES = [
  'コーディング',
  'コードレビュー',
  'リファクタリング',
  'テスト',
  'バグ調査 / デバッグ',
  '設計 / アーキテクチャ',
  'ドキュメント作成',
  'パフォーマンス改善',
  'セキュリティ確認',
  'Git / PR / コミット支援',
  '要件整理',
  'AIへの指示改善',
] as const;

export const PROMPT_DIFFICULTIES = ['初級', '中級', '上級'] as const;

export const RECOMMENDED_FOR_OPTIONS = [
  '実務向け',
  '汎用性高',
  '初心者向け',
  'スピード重視',
  '設計重視',
  'レビュー重視',
  'チーム開発',
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];
export type PromptDifficulty = (typeof PROMPT_DIFFICULTIES)[number];
export type PromptRecommendedFor = (typeof RECOMMENDED_FOR_OPTIONS)[number];

export interface PromptItem {
  id: string;
  title: string;
  category: PromptCategory;
  summary: string;
  tags: string[];
  prompt: string;
  useCases: string[];
  recommendedFor: PromptRecommendedFor[];
  difficulty: PromptDifficulty;
  isFeatured: boolean;
  updatedAt: string;
  inputExample?: string;
  outputExample?: string;
}
