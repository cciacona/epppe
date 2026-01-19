/* Main script for rendering and interacting with the ratings table. */

// Global state
let ratingsData = [];

// Inline copy of data.json used as a fallback when the site is loaded via the
// file:// protocol or if fetch fails. This ensures the ratings page works even
// without a web server. Update this array whenever you modify data.json.
const INITIAL_DATA = [
  {
    id: 1,
    title: 'The Witcher 3: Wild Hunt',
    category: 'games',
    rating: 3,
    favorite: true,
    notes: 'One of my all‑time favorite RPGs. Incredible storytelling and open world.',
    description:
      'An epic role‑playing game where you play as Geralt of Rivia, a monster hunter searching for his adopted daughter in a war‑torn world.',
    year: 2015,
    dateAdded: '2024-01-12',
    posterUrl: 'https://img.opencritic.com/game/952/o/8zRAx8ET.jpg',
  },
  {
    id: 2,
    title: 'Blade Runner 2049',
    category: 'movies',
    rating: 3,
    favorite: false,
    notes: 'Stunning visuals and a haunting soundtrack.',
    description:
      "A sequel set thirty years after the original Blade Runner; LAPD officer K uncovers a long‑buried secret that could plunge what's left of society into chaos.",
    year: 2017,
    dateAdded: '2024-02-03',
    posterUrl: 'https://media.themoviedb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
  },
  {
    id: 3,
    title: 'Breaking Bad',
    category: 'tv',
    rating: 3,
    favorite: true,
    notes: 'Perfect character arc and tension.',
    description:
      "A high school chemistry teacher turned methamphetamine manufacturer navigates the criminal underworld to secure his family's future.",
    year: 2008,
    dateAdded: '2024-02-18',
    posterUrl: 'https://media.themoviedb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
  },
  {
    id: 4,
    title: 'Fullmetal Alchemist: Brotherhood',
    category: 'anime',
    rating: 5,
    favorite: true,
    notes: 'Masterpiece of storytelling and world building.',
    description:
      'Two brothers use alchemy in their quest to regain their bodies after a disastrous attempt to revive their deceased mother.',
    year: 2009,
    dateAdded: '2024-03-01',
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-nSWCgQlmOMtj.jpg',
  },
  {
    id: 5,
    title: 'The Hobbit',
    category: 'reading',
    rating: 3,
    favorite: false,
    notes: 'A charming adventure in Middle‑earth.',
    description:
      "Bilbo Baggins, a comfort‑loving hobbit, is unexpectedly swept into an epic quest to reclaim the dwarves' homeland from the dragon Smaug.",
    year: 1937,
    dateAdded: '2024-03-22',
    posterUrl: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
  },
];
let currentSortKey = null;
let currentSortDir = 'asc';
let currentCategoryFilter = 'all';
let currentView = 'grid';

// Utility functions for converting ratings and favorites to symbols
function renderRating(entry) {
  if (entry.category === 'anime') {
    // 5‑star rating
    const filled = '★'.repeat(entry.rating);
    const empty = '☆'.repeat(5 - entry.rating);
    return `<span class="rating-stars" aria-label="${entry.rating} out of 5 stars">${filled}${empty}</span>`;
  } else {
    // 3‑point smiley rating
    let emoji;
    let label;
    let toneClass;
    switch (entry.rating) {
      case 3:
        emoji = '😊';
        label = 'GOOD';
        toneClass = 'rating-good';
        break;
      case 2:
        emoji = '😐';
        label = 'OKAY';
        toneClass = 'rating-okay';
        break;
      default:
        emoji = '😞';
        label = 'BAD';
        toneClass = 'rating-bad';
    }
    return `<span class="rating-badge ${toneClass}" aria-label="${label}">${emoji} ${label}</span>`;
  }
}

function renderFavorite(fav) {
  return fav
    ? '<span class="favorite" aria-label="Favorite">❤️</span>'
    : '<span class="favorite empty" aria-label="Not favorite">○</span>';
}

// Build external links based on category and title
function buildLinks(entry) {
  const title = encodeURIComponent(entry.title);
  const links = {};
  if (entry.category === 'movies' || entry.category === 'tv') {
    links.imdb = `https://www.imdb.com/find?q=${title}`;
  }
  if (entry.category === 'anime') {
    links.anilist = `https://anilist.co/search/anime?search=${title}`;
  }
  if (entry.category === 'games') {
    links.opencritic = `https://opencritic.com/search/all/${title}`;
  }
  if (entry.category === 'reading') {
    links.goodreads = `https://www.goodreads.com/search?q=${title}`;
  }
  return links;
}

// Create a table row for a rating entry
function createRow(entry) {
  const tr = document.createElement('tr');
  tr.dataset.id = entry.id;

  const titleTd = document.createElement('td');
  titleTd.textContent = entry.title;
  tr.appendChild(titleTd);

  const categoryTd = document.createElement('td');
  categoryTd.innerHTML = `<span class="category-pill">${capitalize(entry.category)}</span>`;
  tr.appendChild(categoryTd);

  const favoriteTd = document.createElement('td');
  favoriteTd.innerHTML = renderFavorite(entry.favorite);
  tr.appendChild(favoriteTd);

  const ratingTd = document.createElement('td');
  ratingTd.innerHTML = renderRating(entry);
  ratingTd.style.cursor = 'pointer';
  // Show details when rating cell is clicked
  ratingTd.addEventListener('click', () => showDetails(entry));
  tr.appendChild(ratingTd);

  const notesTd = document.createElement('td');
  notesTd.textContent = entry.notes || '';
  notesTd.classList.add('notes');
  tr.appendChild(notesTd);

  const dateAddedTd = document.createElement('td');
  dateAddedTd.textContent = entry.dateAdded || '';
  tr.appendChild(dateAddedTd);

  return tr;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Render the table body
function renderTable() {
  const tbody = document.querySelector('#ratings-body');
  tbody.innerHTML = '';
  getVisibleEntries().forEach((entry) => {
    tbody.appendChild(createRow(entry));
  });
}

function renderGrid() {
  const grid = document.querySelector('#ratings-grid');
  grid.innerHTML = '';
  getVisibleEntries().forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'ratings-card';
    card.innerHTML = `
      <img src="${entry.posterUrl}" alt="Poster for ${entry.title}" loading="lazy" />
      <div class="ratings-card-body">
        <div class="ratings-card-meta">
          <span class="category-pill">${capitalize(entry.category)}</span>
          ${renderFavorite(entry.favorite)}
        </div>
        <h3 class="ratings-card-title">${entry.title}</h3>
        <div class="ratings-card-meta">${renderRating(entry)}</div>
        <p class="ratings-card-notes">${entry.notes || ''}</p>
      </div>
    `;
    card.addEventListener('click', () => showDetails(entry));
    grid.appendChild(card);
  });
}

function getVisibleEntries() {
  let filtered = ratingsData;
  if (currentCategoryFilter !== 'all') {
    filtered = ratingsData.filter((item) => item.category === currentCategoryFilter);
  }
  if (currentSortKey) {
    filtered = filtered.slice().sort((a, b) => {
      let valA = a[currentSortKey];
      let valB = b[currentSortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return currentSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return currentSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return filtered;
}

function setView(view) {
  currentView = view;
  document.querySelectorAll('.view-button').forEach((btn) => {
    const isActive = btn.dataset.view === view;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  renderView();
}

function renderView() {
  const grid = document.querySelector('#ratings-grid');
  const tableWrapper = document.querySelector('#ratings-table-wrapper');
  const isGrid = currentView === 'grid';
  grid.hidden = !isGrid;
  tableWrapper.hidden = isGrid;
  grid.classList.toggle('is-hidden', !isGrid);
  tableWrapper.classList.toggle('is-hidden', isGrid);
  if (isGrid) {
    renderGrid();
  } else {
    renderTable();
  }
}

// Handle sorting when clicking a column header
function handleSort(event) {
  const key = event.target.dataset.key;
  if (!key) return;
  if (currentSortKey === key) {
    // Toggle direction
    currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortKey = key;
    currentSortDir = 'asc';
  }
  // Update header classes
  document.querySelectorAll('th').forEach((th) => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.key === currentSortKey) {
      th.classList.add(currentSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
  renderTable();
}

// Show details modal for a rating entry
function showDetails(entry) {
  const modal = document.querySelector('#detail-modal');
  const content = modal.querySelector('.modal-content');
  content.innerHTML = '';
  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-button';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  content.appendChild(closeBtn);
  const headerWrap = document.createElement('div');
  headerWrap.className = 'modal-header';
  const titleWrap = document.createElement('div');
  const meta = document.createElement('div');
  meta.className = 'modal-meta';
  meta.innerHTML = `
    <span class="category-pill">${capitalize(entry.category)}</span>
    ${renderRating(entry)}
  `;
  titleWrap.appendChild(meta);
  const h3 = document.createElement('h3');
  h3.textContent = entry.title;
  titleWrap.appendChild(h3);
  headerWrap.appendChild(titleWrap);
  const favWrap = document.createElement('div');
  favWrap.innerHTML = renderFavorite(entry.favorite);
  headerWrap.appendChild(favWrap);
  content.appendChild(headerWrap);
  // Notes
  if (entry.notes) {
    const notesP = document.createElement('p');
    notesP.innerHTML = `<strong>Notes:</strong> ${entry.notes}`;
    content.appendChild(notesP);
  }
  // Description
  const descP = document.createElement('p');
  descP.innerHTML = `<strong>Description:</strong> ${entry.description || 'No description provided.'}`;
  content.appendChild(descP);
  // Date added
  if (entry.dateAdded) {
    const dateP = document.createElement('p');
    dateP.innerHTML = `<strong>Date added:</strong> ${entry.dateAdded}`;
    content.appendChild(dateP);
  }
  // External links
  const links = buildLinks(entry);
  if (Object.keys(links).length > 0) {
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    const [primaryKey, primaryUrl] = Object.entries(links)[0];
    actions.innerHTML = `
      <a class="btn" href="${primaryUrl}" target="_blank" rel="noopener">
        View on ${capitalize(primaryKey)} ↗
      </a>
    `;
    if (Object.keys(links).length > 1) {
      const extra = document.createElement('p');
      extra.innerHTML = `<strong>Explore more:</strong> ${Object.entries(links)
        .slice(1)
        .map(
          ([key, url]) =>
            `<a href="${url}" target="_blank" rel="noopener">${capitalize(key)}</a>`
        )
        .join(' | ')}`;
      actions.appendChild(extra);
    }
    content.appendChild(actions);
  }
  modal.classList.add('active');
}

// Change category filter
function setCategory(category) {
  currentCategoryFilter = category;
  // Update active class on filter buttons
  document.querySelectorAll('.filter-button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  renderView();
}

function normalizeRatingsData(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.entries)) return payload.entries;
  return [];
}

// Initialize the page
async function initRatingsPage() {
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      ratingsData = normalizeRatingsData(await response.json());
    } else {
      throw new Error('Fetch failed');
    }
  } catch (err) {
    console.warn('Could not fetch data.json, using inline data.');
    ratingsData = INITIAL_DATA.slice();
  }
  // Attach event listeners to headers for sorting
  document.querySelectorAll('th').forEach((th) => {
    th.addEventListener('click', handleSort);
  });
  // Attach category filter buttons
  document.querySelectorAll('.filter-button').forEach((btn) => {
    btn.addEventListener('click', () => setCategory(btn.dataset.category));
  });
  document.querySelectorAll('.view-button').forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
  renderView();
}

// Only run init on the ratings page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#ratings-table')) {
    initRatingsPage();
  }
});
