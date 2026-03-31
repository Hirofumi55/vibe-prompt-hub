type SortKey = 'featured' | 'newest' | 'versatile' | 'practical';

interface PromptCardMeta {
  element: HTMLElement;
  category: string;
  tags: string[];
  recommendedFor: string[];
  featured: boolean;
  updatedAt: string;
  search: string;
}

let initialized = false;

const SORT_OPTIONS = new Set<SortKey>(['featured', 'newest', 'versatile', 'practical']);

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function initPromptsPage() {
  if (initialized) return;

  const page = document.querySelector<HTMLElement>('[data-prompts-page]');
  if (!page) return;
  initialized = true;

  const searchInput = page.querySelector<HTMLInputElement>('[data-filter-search]');
  const sortSelect = page.querySelector<HTMLSelectElement>('[data-filter-sort]');
  const countLabel = page.querySelector<HTMLElement>('[data-filter-count]');
  const activeFilters = page.querySelector<HTMLElement>('[data-active-filters]');
  const clearButton = page.querySelector<HTMLButtonElement>('[data-clear-filters]');
  const emptyState = page.querySelector<HTMLElement>('[data-empty-state]');

  const cards = Array.from(page.querySelectorAll<HTMLElement>('[data-prompt-card]')).map<PromptCardMeta>((element) => ({
    element,
    category: element.dataset.category ?? '',
    tags: (element.dataset.tags ?? '').split('|').filter(Boolean),
    recommendedFor: (element.dataset.recommended ?? '').split('|').filter(Boolean),
    featured: element.dataset.featured === 'true',
    updatedAt: element.dataset.updated ?? '',
    search: (element.dataset.search ?? '').toLowerCase(),
  }));

  const categoryButtons = Array.from(page.querySelectorAll<HTMLButtonElement>('[data-filter-category]'));
  const tagButtons = Array.from(page.querySelectorAll<HTMLButtonElement>('[data-filter-tag]'));

  const state = {
    q: '',
    category: '',
    tag: '',
    sort: 'featured' as SortKey,
  };

  function applyStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    state.q = params.get('q')?.trim() ?? '';
    state.category = params.get('category') ?? '';
    state.tag = params.get('tag') ?? '';
    const requestedSort = params.get('sort') as SortKey | null;
    state.sort = requestedSort && SORT_OPTIONS.has(requestedSort) ? requestedSort : 'featured';
  }

  function syncControls() {
    if (searchInput) searchInput.value = state.q;
    if (sortSelect) sortSelect.value = state.sort;

    categoryButtons.forEach((button) => {
      const isActive = (button.dataset.value ?? '') === state.category;
      button.dataset.active = String(isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    tagButtons.forEach((button) => {
      const isActive = (button.dataset.value ?? '') === state.tag;
      button.dataset.active = String(isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function compareCards(left: PromptCardMeta, right: PromptCardMeta) {
    if (state.sort === 'newest') {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    if (state.sort === 'versatile') {
      return (
        Number(right.recommendedFor.includes('汎用性高')) - Number(left.recommendedFor.includes('汎用性高')) ||
        Number(right.featured) - Number(left.featured) ||
        right.updatedAt.localeCompare(left.updatedAt)
      );
    }

    if (state.sort === 'practical') {
      return (
        Number(right.recommendedFor.includes('実務向け')) - Number(left.recommendedFor.includes('実務向け')) ||
        Number(right.featured) - Number(left.featured) ||
        right.updatedAt.localeCompare(left.updatedAt)
      );
    }

    return Number(right.featured) - Number(left.featured) || right.updatedAt.localeCompare(left.updatedAt);
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.delete('category');
    url.searchParams.delete('tag');
    url.searchParams.delete('sort');

    if (state.q) url.searchParams.set('q', state.q);
    if (state.category) url.searchParams.set('category', state.category);
    if (state.tag) url.searchParams.set('tag', state.tag);
    if (state.sort !== 'featured') url.searchParams.set('sort', state.sort);

    history.replaceState({}, '', `${url.pathname}${url.search}`);
  }

  function renderActiveFilters() {
    if (!activeFilters || !clearButton) return;

    const tokens = [
      state.q ? `検索: ${state.q}` : '',
      state.category ? `カテゴリ: ${state.category}` : '',
      state.tag ? `タグ: ${state.tag}` : '',
      state.sort !== 'featured'
        ? `並び替え: ${state.sort === 'newest' ? '新着順' : state.sort === 'versatile' ? '汎用性高' : '実務向け'}`
        : '',
    ].filter(Boolean);

    activeFilters.innerHTML = tokens.map((token) => `<span class="chip" data-active="true">${escapeHtml(token)}</span>`).join('');
    activeFilters.hidden = tokens.length === 0;
    clearButton.hidden = tokens.length === 0;
  }

  function applyFilters() {
    const normalizedQuery = state.q.trim().toLowerCase();

    const visible = cards
      .filter((card) => {
        const matchesQuery = !normalizedQuery || card.search.includes(normalizedQuery);
        const matchesCategory = !state.category || card.category === state.category;
        const matchesTag = !state.tag || card.tags.includes(state.tag);
        return matchesQuery && matchesCategory && matchesTag;
      })
      .sort(compareCards);

    const visibleIds = new Set(visible.map((card) => card.element.dataset.promptId));

    cards.forEach((card) => {
      const isVisible = visibleIds.has(card.element.dataset.promptId);
      card.element.hidden = !isVisible;
      card.element.classList.toggle('hidden', !isVisible);
    });

    visible.forEach((card, index) => {
      card.element.style.order = String(index);
    });

    countLabel && (countLabel.textContent = `${visible.length}件`);
    emptyState && (emptyState.hidden = visible.length > 0);

    syncControls();
    renderActiveFilters();
    syncUrl();
  }

  applyStateFromUrl();
  applyFilters();

  searchInput?.addEventListener('input', () => {
    state.q = searchInput.value;
    applyFilters();
  });

  sortSelect?.addEventListener('change', () => {
    const next = sortSelect.value as SortKey;
    state.sort = SORT_OPTIONS.has(next) ? next : 'featured';
    applyFilters();
  });

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value ?? '';
      state.category = state.category === value ? '' : value;
      applyFilters();
    });
  });

  tagButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value ?? '';
      state.tag = state.tag === value ? '' : value;
      applyFilters();
    });
  });

  clearButton?.addEventListener('click', () => {
    state.q = '';
    state.category = '';
    state.tag = '';
    state.sort = 'featured';
    applyFilters();
  });

  window.addEventListener('popstate', () => {
    applyStateFromUrl();
    applyFilters();
  });
}
