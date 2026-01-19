/* Admin editor script for managing rating data. */

// Change this password to restrict access to the edit page.
const ADMIN_PASSWORD = 'changeme';

let ratingsData = [];

// Inline fallback data identical to data.json. This is used if fetching
// data.json fails, such as when the site is opened via the file:// protocol.
const INITIAL_DATA = {
  entries: [
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
  ],
};
let editingEntryId = null;

// Elements
const loginSection = document.getElementById('login-section');
const editSection = document.getElementById('edit-section');
const loginBtn = document.getElementById('login-btn');
const adminPassInput = document.getElementById('admin-pass');
const loginError = document.getElementById('login-error');
const editTableBody = document.querySelector('#edit-table tbody');
const formHeading = document.getElementById('form-heading');
const entryForm = document.getElementById('entry-form');
const entryIdInput = document.getElementById('entry-id');
const titleInput = document.getElementById('title-input');
const categoryInput = document.getElementById('category-input');
const ratingInput = document.getElementById('rating-input');
const favoriteInput = document.getElementById('favorite-input');
const notesInput = document.getElementById('notes-input');
const descriptionInput = document.getElementById('description-input');
const cancelEditBtn = document.getElementById('cancel-edit');
const downloadBtn = document.getElementById('download-json');
const githubOwnerInput = document.getElementById('github-owner');
const githubRepoInput = document.getElementById('github-repo');
const githubBranchInput = document.getElementById('github-branch');
const githubPathInput = document.getElementById('github-path');
const githubTokenInput = document.getElementById('github-token');
const saveGithubSettingsBtn = document.getElementById('save-github-settings');
const publishGithubBtn = document.getElementById('publish-github');
const publishStatus = document.getElementById('publish-status');

const GITHUB_SETTINGS_KEY = 'githubSettings';

// Login handler
loginBtn.addEventListener('click', () => {
  const pass = adminPassInput.value;
  if (pass === ADMIN_PASSWORD) {
    loginSection.style.display = 'none';
    editSection.style.display = 'block';
    loadGithubSettings();
    loadData();
  } else {
    loginError.style.display = 'block';
  }
});

// Load data from data.json
async function loadData() {
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      const data = await res.json();
      ratingsData = normalizeRatingsData(data);
    } else {
      throw new Error('Failed to fetch');
    }
  } catch (err) {
    console.warn('Could not fetch data.json, using inline data.');
    ratingsData = normalizeRatingsData(INITIAL_DATA);
  }
  renderEditTable();
}

// Render the editable table
function renderEditTable() {
  editTableBody.innerHTML = '';
  ratingsData.forEach((entry) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.title}</td>
      <td>${capitalize(entry.category)}</td>
      <td>${entry.favorite ? '❤️' : ''}</td>
      <td>${entry.rating}</td>
      <td>${entry.notes || ''}</td>
      <td>
        <button class="btn" data-action="edit" data-id="${entry.id}">Edit</button>
        <button class="btn" data-action="delete" data-id="${entry.id}">Delete</button>
      </td>
    `;
    editTableBody.appendChild(tr);
  });
  // Attach event listeners for edit and delete
  editTableBody.querySelectorAll('button').forEach((btn) => {
    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id, 10);
    if (action === 'edit') {
      btn.addEventListener('click', () => startEdit(id));
    } else if (action === 'delete') {
      btn.addEventListener('click', () => deleteEntry(id));
    }
  });
}

// Start editing an existing entry
function startEdit(id) {
  const entry = ratingsData.find((item) => item.id === id);
  if (!entry) return;
  editingEntryId = id;
  entryIdInput.value = id;
  titleInput.value = entry.title;
  categoryInput.value = entry.category;
  ratingInput.value = entry.rating;
  favoriteInput.checked = entry.favorite;
  notesInput.value = entry.notes || '';
  descriptionInput.value = entry.description || '';
  formHeading.textContent = 'Edit Entry';
  cancelEditBtn.style.display = 'inline-block';
}

// Cancel editing
cancelEditBtn.addEventListener('click', () => {
  editingEntryId = null;
  entryForm.reset();
  formHeading.textContent = 'Add Entry';
  cancelEditBtn.style.display = 'none';
});

// Handle form submission
entryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const rating = parseInt(ratingInput.value, 10);
  const favorite = favoriteInput.checked;
  const notes = notesInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!title || !category || !rating) {
    return;
  }
  if (editingEntryId) {
    // Update existing
    const idx = ratingsData.findIndex((item) => item.id === editingEntryId);
    if (idx !== -1) {
      ratingsData[idx] = {
        ...ratingsData[idx],
        title,
        category,
        rating,
        favorite,
        notes,
        description,
      };
    }
  } else {
    // Add new entry with new id
    const newId = ratingsData.length > 0 ? Math.max(...ratingsData.map((e) => e.id)) + 1 : 1;
    ratingsData.push({
      id: newId,
      title,
      category,
      rating,
      favorite,
      notes,
      description,
    });
  }
  // Reset form and state
  entryForm.reset();
  editingEntryId = null;
  formHeading.textContent = 'Add Entry';
  cancelEditBtn.style.display = 'none';
  renderEditTable();
});

// Delete an entry
function deleteEntry(id) {
  if (!confirm('Delete this entry?')) return;
  ratingsData = ratingsData.filter((item) => item.id !== id);
  // If we were editing this entry, cancel editing
  if (editingEntryId === id) {
    editingEntryId = null;
    entryForm.reset();
    formHeading.textContent = 'Add Entry';
    cancelEditBtn.style.display = 'none';
  }
  renderEditTable();
}

// Download JSON representation of the data
downloadBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(buildRatingsPayload(), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeRatingsData(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.entries)) {
    return payload.entries;
  }
  return [];
}

function buildRatingsPayload() {
  return {
    entries: ratingsData,
  };
}

function loadGithubSettings() {
  const storedSettings = localStorage.getItem(GITHUB_SETTINGS_KEY);
  if (!storedSettings) return;
  try {
    const settings = JSON.parse(storedSettings);
    githubOwnerInput.value = settings.owner || '';
    githubRepoInput.value = settings.repo || '';
    githubBranchInput.value = settings.branch || 'main';
    githubPathInput.value = settings.path || 'data.json';
    githubTokenInput.value = '';
  } catch (error) {
    console.warn('Failed to parse stored GitHub settings.');
  }
}

function getGithubSettings() {
  return {
    owner: githubOwnerInput.value.trim(),
    repo: githubRepoInput.value.trim(),
    branch: githubBranchInput.value.trim() || 'main',
    path: githubPathInput.value.trim() || 'data.json',
    token: githubTokenInput.value.trim(),
  };
}

function setPublishStatus(message, status = 'info') {
  publishStatus.textContent = message;
  publishStatus.dataset.status = status;
}

function encodeContentBase64(content) {
  return btoa(unescape(encodeURIComponent(content)));
}

function encodePath(path) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

saveGithubSettingsBtn.addEventListener('click', () => {
  const settings = getGithubSettings();
  const { owner, repo, branch, path } = settings;
  localStorage.setItem(
    GITHUB_SETTINGS_KEY,
    JSON.stringify({
      owner,
      repo,
      branch,
      path,
    })
  );
  setPublishStatus('Repo settings saved locally. Token stays in memory only.', 'success');
});

publishGithubBtn.addEventListener('click', async () => {
  const settings = getGithubSettings();
  if (!settings.owner || !settings.repo || !settings.token) {
    setPublishStatus('Owner, repo, and token are required before publishing.', 'error');
    return;
  }
  setPublishStatus('Publishing to GitHub...', 'info');
  try {
    await publishToGithub(settings);
    setPublishStatus('Published successfully. Refresh the site to see changes.', 'success');
  } catch (error) {
    console.error(error);
    setPublishStatus(`Publish failed: ${error.message}`, 'error');
  }
});

async function publishToGithub(settings) {
  const { owner, repo, branch, path, token } = settings;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePath(path)}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  };
  let existingSha = null;
  const lookupResponse = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, {
    headers,
  });
  if (lookupResponse.ok) {
    const data = await lookupResponse.json();
    existingSha = data.sha;
  } else if (lookupResponse.status !== 404) {
    throw new Error('Unable to read the existing data.json file.');
  }

  const content = JSON.stringify(buildRatingsPayload(), null, 2);
  const payload = {
    message: 'Update review data via admin editor',
    content: encodeContentBase64(content),
    branch,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  const publishResponse = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (!publishResponse.ok) {
    const errorBody = await publishResponse.json().catch(() => ({}));
    const message = errorBody.message || 'GitHub rejected the update.';
    throw new Error(message);
  }
}
