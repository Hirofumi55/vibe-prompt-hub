const STORAGE_KEYS = {
  theme: 'prompt-hub:theme',
  favorites: 'prompt-hub:favorites',
  recent: 'prompt-hub:recent',
} as const;

type Theme = 'light' | 'dark';
type ToastTone = 'success' | 'error' | 'info';

let initialized = false;
let toastTimer: number | undefined;

function readIds(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // noop
  }
}

function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getThemeColor(theme: Theme) {
  return theme === 'dark' ? '#0b1020' : '#f8f6ff';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]:not([media])').forEach((meta) => {
    meta.content = getThemeColor(theme);
  });
  syncThemeButtons(theme);
}

function syncThemeButtons(theme: Theme) {
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    const sun = button.querySelector<HTMLElement>('[data-theme-icon="sun"]');
    const moon = button.querySelector<HTMLElement>('[data-theme-icon="moon"]');
    const label = button.querySelector<HTMLElement>('[data-theme-label]');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    sun?.classList.toggle('hidden', theme === 'dark');
    moon?.classList.toggle('hidden', theme !== 'dark');
    label && (label.textContent = nextTheme === 'light' ? 'ライト表示' : 'ダーク表示');
    button.setAttribute('aria-label', `${nextTheme === 'light' ? 'ライト' : 'ダーク'}モードに切り替える`);
  });
}

function syncFavoriteButtons() {
  const favorites = new Set(readFavorites());

  document.querySelectorAll<HTMLButtonElement>('[data-favorite-button]').forEach((button) => {
    const promptId = button.dataset.promptId;
    const promptTitle = button.dataset.promptTitle ?? 'このプロンプト';
    const isActive = Boolean(promptId && favorites.has(promptId));
    const label = button.querySelector<HTMLElement>('[data-favorite-label]');

    button.setAttribute('aria-pressed', String(isActive));
    button.setAttribute(
      'aria-label',
      isActive ? `${promptTitle} をお気に入りから外す` : `${promptTitle} をお気に入りに追加する`,
    );
    label && (label.textContent = isActive ? '保存済み' : 'お気に入り');
    button.classList.toggle('border-accent/50', isActive);
    button.classList.toggle('bg-accent/15', isActive);
    button.classList.toggle('text-text', isActive);
  });
}

function setFavorites(next: string[]) {
  writeIds(STORAGE_KEYS.favorites, next);
  syncFavoriteButtons();
  window.dispatchEvent(new CustomEvent('app:favorites-changed'));
}

function pushRecent(promptId: string) {
  const next = [promptId, ...readRecent().filter((id) => id !== promptId)].slice(0, 8);
  writeIds(STORAGE_KEYS.recent, next);
  window.dispatchEvent(new CustomEvent('app:recent-changed'));
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function toastIcon(tone: ToastTone) {
  if (tone === 'error') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <path d="m18 6-12 12"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    `;
  }

  if (tone === 'info') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 17v-5"></path>
        <path d="M12 7h.01"></path>
        <circle cx="12" cy="12" r="9"></circle>
      </svg>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  `;
}

export function showToast(message: string, tone: ToastTone = 'success') {
  const toast = document.querySelector<HTMLDivElement>('#app-toast');
  const icon = document.querySelector<HTMLSpanElement>('#app-toast-icon');
  const label = document.querySelector<HTMLParagraphElement>('#app-toast-message');
  if (!toast || !icon || !label) return;

  label.textContent = message;
  icon.innerHTML = toastIcon(tone);

  icon.className = 'flex h-10 w-10 items-center justify-center rounded-full';
  if (tone === 'error') {
    icon.classList.add('bg-rose-500/15', 'text-rose-400');
  } else if (tone === 'info') {
    icon.classList.add('bg-sky-500/15', 'text-sky-400');
  } else {
    icon.classList.add('bg-accent/15', 'text-accent');
  }

  toast.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

export function readFavorites() {
  return readIds(STORAGE_KEYS.favorites);
}

export function readRecent() {
  return readIds(STORAGE_KEYS.recent);
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const themeButton = target.closest<HTMLElement>('[data-theme-toggle]');
  if (themeButton) {
    const nextTheme: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    applyTheme(nextTheme);
    showToast(`${nextTheme === 'dark' ? 'ダーク' : 'ライト'}モードに切り替えました`, 'info');
    return;
  }

  const favoriteButton = target.closest<HTMLButtonElement>('[data-favorite-button]');
  if (favoriteButton) {
    event.preventDefault();
    const promptId = favoriteButton.dataset.promptId;
    const promptTitle = favoriteButton.dataset.promptTitle ?? 'このプロンプト';
    if (!promptId) return;

    const favorites = new Set(readFavorites());
    const exists = favorites.has(promptId);
    exists ? favorites.delete(promptId) : favorites.add(promptId);
    setFavorites(Array.from(favorites));
    showToast(exists ? `${promptTitle} をお気に入りから外しました` : `${promptTitle} をお気に入りに追加しました`, 'info');
    return;
  }

  const copyButton = target.closest<HTMLButtonElement>('[data-copy-prompt]');
  if (copyButton) {
    event.preventDefault();
    const text = copyButton.dataset.copyText;
    const promptId = copyButton.dataset.promptId;
    const promptTitle = copyButton.dataset.promptTitle ?? 'プロンプト';
    if (!text) return;

    void copyToClipboard(text)
      .then(() => {
        promptId && pushRecent(promptId);
        showToast(`${promptTitle} をコピーしました`, 'success');

        copyButton.dataset.copied = 'true';
        const indicator = copyButton.querySelector<HTMLElement>('.copy-indicator');
        indicator?.classList.add('border-accent/60', 'bg-accent/10', 'text-accent', 'scale-105');
        window.setTimeout(() => {
          delete copyButton.dataset.copied;
          indicator?.classList.remove('border-accent/60', 'bg-accent/10', 'text-accent', 'scale-105');
        }, 1400);
      })
      .catch(() => {
        showToast('コピーに失敗しました。長押しまたは選択コピーをお試しください。', 'error');
      });
  }
}

export function initGlobalUi() {
  if (initialized) return;
  initialized = true;

  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : prefersDark ? 'dark' : 'light');
  syncFavoriteButtons();

  document.addEventListener('click', handleDocumentClick);
}
