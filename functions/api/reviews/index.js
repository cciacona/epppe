const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

function isAdmin(request, env) {
  const token = env.REVIEWS_ADMIN_TOKEN;
  const header = request.headers.get('authorization') || '';
  return Boolean(token && header === `Bearer ${token}`);
}

function normalizeReview(body) {
  const title = String(body.title || '').trim();
  const text = String(body.body ?? body.comments ?? '').trim();
  const reviewer = String(body.reviewer || '').trim();
  const status = String(body.status || 'Candidate').trim() || 'Candidate';
  const format = String(body.format || body.category || 'Series').trim() || 'Series';
  const category = format;
  const releaseDate = String(body.release_date || '').trim();
  const runtime = String(body.runtime || '').trim();
  const votes = String(body.votes || '').trim();
  const externalUrl = String(body.external_url || '').trim();
  const rating = body.rating === '' || body.rating == null ? null : Number(body.rating);
  const sortOrder = body.sort_order === '' || body.sort_order == null ? 0 : Number(body.sort_order);
  const isPublished = body.is_published ? 1 : 0;

  if (!title) return { error: 'Title is required.' };
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return { error: 'Rating must be a whole number from 1 to 5.' };
  }
  if (!Number.isInteger(sortOrder)) return { error: 'Sort order must be a whole number.' };

  return {
    value: {
      title,
      body: text,
      reviewer: reviewer || null,
      category,
      status,
      format,
      release_date: releaseDate || null,
      runtime: runtime || null,
      votes: votes || null,
      rating,
      external_url: externalUrl || null,
      sort_order: sortOrder,
      is_published: isPublished
    }
  };
}

export async function onRequestGet({ request, env }) {
  const admin = isAdmin(request, env);
  const query = admin
    ? `SELECT id, title, body, reviewer, category, status, format, release_date, runtime, votes, rating, external_url, sort_order, is_published, created_at, updated_at
       FROM reviews
       ORDER BY sort_order DESC, created_at DESC`
    : `SELECT id, title, body, reviewer, category, status, format, release_date, runtime, votes, rating, external_url, sort_order, is_published, created_at, updated_at
       FROM reviews
       WHERE is_published = 1
       ORDER BY sort_order DESC, created_at DESC`;

  const { results } = await env.DB.prepare(query).all();
  return json({ reviews: results || [] });
}

export async function onRequestPost({ request, env }) {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const normalized = normalizeReview(body);
  if (normalized.error) return json({ error: normalized.error }, { status: 400 });

  const review = normalized.value;
  const result = await env.DB.prepare(
    `INSERT INTO reviews (title, body, reviewer, category, status, format, release_date, runtime, votes, rating, external_url, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      review.title,
      review.body,
      review.reviewer,
      review.category,
      review.status,
      review.format,
      review.release_date,
      review.runtime,
      review.votes,
      review.rating,
      review.external_url,
      review.sort_order,
      review.is_published
    )
    .run();

  const created = await env.DB.prepare(
    `SELECT id, title, body, reviewer, category, status, format, release_date, runtime, votes, rating, external_url, sort_order, is_published, created_at, updated_at
     FROM reviews
     WHERE id = ?`
  )
    .bind(result.meta.last_row_id)
    .first();

  return json({ review: created }, { status: 201 });
}
