import { prompts } from '../data/prompts';
import type { PromptItem } from '../types/prompts';

const MAX_RECENT_DAYS = 21;

export const latestPromptDate = Math.max(
  ...prompts.map((prompt) => new Date(prompt.updatedAt).getTime()),
);

export function getPromptById(id: string) {
  return prompts.find((prompt) => prompt.id === id);
}

export function getFeaturedPrompts(limit = 6) {
  return prompts.filter((prompt) => prompt.isFeatured).slice(0, limit);
}

export function getCategoryCounts() {
  return prompts.reduce<Record<string, number>>((acc, prompt) => {
    acc[prompt.category] = (acc[prompt.category] ?? 0) + 1;
    return acc;
  }, {});
}

export function getPopularTags(limit = 14) {
  return Object.entries(
    prompts.reduce<Record<string, number>>((acc, prompt) => {
      for (const tag of prompt.tags) {
        acc[tag] = (acc[tag] ?? 0) + 1;
      }
      return acc;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'ja'))
    .slice(0, limit)
    .map(([tag]) => tag);
}

export function isNewPrompt(prompt: Pick<PromptItem, 'updatedAt'>) {
  const diff = latestPromptDate - new Date(prompt.updatedAt).getTime();
  return diff <= MAX_RECENT_DAYS * 24 * 60 * 60 * 1000;
}

export function getRelatedPrompts(currentPrompt: PromptItem, limit = 3) {
  return prompts
    .filter((prompt) => prompt.id !== currentPrompt.id)
    .map((prompt) => ({
      prompt,
      score:
        (prompt.category === currentPrompt.category ? 8 : 0) +
        prompt.tags.filter((tag) => currentPrompt.tags.includes(tag)).length * 2 +
        prompt.recommendedFor.filter((item) => currentPrompt.recommendedFor.includes(item)).length,
    }))
    .sort((left, right) => right.score - left.score || right.prompt.updatedAt.localeCompare(left.prompt.updatedAt))
    .slice(0, limit)
    .map((entry) => entry.prompt);
}

export function buildPromptSearchText(prompt: PromptItem) {
  return [
    prompt.title,
    prompt.category,
    prompt.summary,
    prompt.tags.join(' '),
    prompt.useCases.join(' '),
    prompt.recommendedFor.join(' '),
    prompt.prompt,
  ]
    .join(' ')
    .toLowerCase();
}
