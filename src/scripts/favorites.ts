import { readFavorites } from './global';

let initialized = false;

function renderFavoritesPage() {
  const page = document.querySelector<HTMLElement>('[data-favorites-page]');
  const grid = page?.querySelector<HTMLElement>('[data-favorites-grid]');
  const empty = page?.querySelector<HTMLElement>('[data-favorites-empty]');
  const count = page?.querySelector<HTMLElement>('[data-favorites-count]');
  const pool = document.querySelector<HTMLElement>('#favorites-card-pool');

  if (!page || !grid || !empty || !count || !pool) return;

  const ids = readFavorites();
  const cards = ids
    .map((id) => pool.querySelector<HTMLElement>(`[data-prompt-id="${id}"]`))
    .filter((card): card is HTMLElement => Boolean(card))
    .map((card) => card.cloneNode(true) as HTMLElement);

  grid.replaceChildren(...cards);
  empty.hidden = cards.length > 0;
  count.textContent = `${cards.length}件`;
}

export function initFavoritesPage() {
  if (initialized) return;
  if (!document.querySelector('[data-favorites-page]')) return;
  initialized = true;

  renderFavoritesPage();
  window.addEventListener('app:favorites-changed', renderFavoritesPage);
}
