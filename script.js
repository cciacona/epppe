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
  },
];
let currentSortKey = null;
let currentSortDir = 'asc';
let currentCategoryFilter = 'all';

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
    let statusClass;
    switch (entry.rating) {
      case 3:
        emoji = '😊';
        label = 'GOOD';
        statusClass = 'good';
        break;
      case 2:
        emoji = '😐';
        label = 'OKAY';
        statusClass = 'okay';
        break;
      default:
        emoji = '😞';
        label = 'BAD';
        statusClass = 'bad';
    }
    return `<span class="rating-smiley ${statusClass}" aria-label="${entry.rating} of 3">${emoji}<span class="rating-label">${label}</span></span>`;
  }
}

function renderFavorite(fav) {
  return fav
    ? '<span class="favorite" aria-label="Favorite">❤️</span>'
    : '<span class="favorite favorite--off" aria-label="Not a favorite">○</span>';
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

  return tr;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Render the table body
function renderTable() {
  const tbody = document.querySelector('#ratings-body');
  tbody.innerHTML = '';
  // Filter by category
  let filtered = ratingsData;
  if (currentCategoryFilter !== 'all') {
    filtered = ratingsData.filter((item) => item.category === currentCategoryFilter);
  }
  // Sort if needed
  if (currentSortKey) {
    filtered = filtered.slice().sort((a, b) => {
      let valA = a[currentSortKey];
      let valB = b[currentSortKey];
      // For title and category, compare strings case‑insensitively
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return currentSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return currentSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  filtered.forEach((entry) => {
    tbody.appendChild(createRow(entry));
  });
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
  const header = document.createElement('div');
  header.className = 'modal-header';

  const badges = document.createElement('div');
  badges.className = 'modal-badges';

  const categoryBadge = document.createElement('span');
  categoryBadge.className = 'category-pill';
  categoryBadge.textContent = capitalize(entry.category);
  badges.appendChild(categoryBadge);

  const ratingBadge = document.createElement('div');
  ratingBadge.innerHTML = renderRating(entry);
  badges.appendChild(ratingBadge);

  if (entry.favorite) {
    const favoriteBadge = document.createElement('span');
    favoriteBadge.className = 'favorite';
    favoriteBadge.textContent = '❤️';
    badges.appendChild(favoriteBadge);
  }

  header.appendChild(badges);
  content.appendChild(header);

  const h3 = document.createElement('h3');
  h3.textContent = entry.title;
  content.appendChild(h3);
  // Notes
  if (entry.notes) {
    const notesP = document.createElement('p');
    notesP.innerHTML = `<strong>Notes:</strong> ${entry.notes}`;
    content.appendChild(notesP);
  }
  // Description
  const descSection = document.createElement('div');
  descSection.className = 'modal-section';
  const descP = document.createElement('p');
  descP.innerHTML = `<strong>Description:</strong> ${entry.description || 'No description provided.'}`;
  descSection.appendChild(descP);
  content.appendChild(descSection);
  // External links
  const links = buildLinks(entry);
  if (Object.keys(links).length > 0) {
    const linksDiv = document.createElement('div');
    linksDiv.className = 'modal-section modal-links';
    const label = document.createElement('strong');
    label.textContent = 'Explore more:';
    linksDiv.appendChild(label);
    const list = document.createElement('div');
    let first = true;
    for (const [key, url] of Object.entries(links)) {
      if (!first) list.innerHTML += ' | ';
      list.innerHTML += `<a href="${url}" target="_blank" rel="noopener">${capitalize(key)}</a>`;
      first = false;
    }
    linksDiv.appendChild(list);
    content.appendChild(linksDiv);
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
  renderTable();
}

// Initialize the page
async function initRatingsPage() {
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      ratingsData = await response.json();
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
  renderTable();
}

// Only run init on the ratings page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#ratings-table')) {
    initRatingsPage();
  }
});
