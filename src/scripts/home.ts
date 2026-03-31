import { readFavorites, readRecent } from './global';

let initialized = false;

function renderSection(sectionName: 'recent' | 'favorites') {
  const section = document.querySelector<HTMLElement>(`[data-home-section="${sectionName}"]`);
  const grid = section?.querySelector<HTMLElement>('[data-home-grid]');
  const empty = section?.querySelector<HTMLElement>('[data-home-empty]');
  const count = section?.querySelector<HTMLElement>('[data-home-count]');
  const pool = document.querySelector<HTMLElement>('#home-card-pool');

  if (!section || !grid || !empty || !count || !pool) return;

  const ids = (sectionName === 'recent' ? readRecent() : readFavorites()).slice(0, 3);
  const cards = ids
    .map((id) => pool.querySelector<HTMLElement>(`[data-prompt-id="${id}"]`))
    .filter((card): card is HTMLElement => Boolean(card))
    .map((card) => card.cloneNode(true) as HTMLElement);

  grid.replaceChildren(...cards);
  empty.hidden = cards.length > 0;
  count.textContent = cards.length > 0 ? `${cards.length}件` : '0件';
}

function renderHome() {
  renderSection('recent');
  renderSection('favorites');
}

export function initHomePage() {
  if (initialized) return;
  if (!document.querySelector('[data-home-page]')) return;
  initialized = true;

  renderHome();
  window.addEventListener('app:recent-changed', renderHome);
  window.addEventListener('app:favorites-changed', renderHome);
}
