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

function normalizeId(id) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
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

export async function onRequestPut({ request, env, params }) {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, { status: 401 });

  const id = normalizeId(params.id);
  if (!id) return json({ error: 'Invalid review ID.' }, { status: 400 });

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
    `UPDATE reviews
     SET title = ?, body = ?, reviewer = ?, category = ?, status = ?, format = ?,
         release_date = ?, runtime = ?, votes = ?, rating = ?, external_url = ?,
         sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
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
      review.is_published,
      id
    )
    .run();

  if (!result.meta.changes) return json({ error: 'Review not found.' }, { status: 404 });

  const updated = await env.DB.prepare(
    `SELECT id, title, body, reviewer, category, status, format, release_date, runtime, votes, rating, external_url, sort_order, is_published, created_at, updated_at
     FROM reviews
     WHERE id = ?`
  )
    .bind(id)
    .first();

  return json({ review: updated });
}

export async function onRequestDelete({ request, env, params }) {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, { status: 401 });

  const id = normalizeId(params.id);
  if (!id) return json({ error: 'Invalid review ID.' }, { status: 400 });

  const result = await env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return json({ error: 'Review not found.' }, { status: 404 });

  return json({ ok: true });
}
