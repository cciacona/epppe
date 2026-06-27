# EPPPE Portfolio

Astro portfolio site configured for Cloudflare Pages, Pages Functions, and a D1-backed reviews catalog.

## Deployed Project

- Production: https://epppe.net
- Alternate host: https://www.epppe.net
- Pages fallback: https://epppe-portfolio.pages.dev
- Latest deployment: https://67bbf4fe.epppe-portfolio.pages.dev
- D1 database: `epppe-reviews`
- Local copy of production review admin token: `.admin-token`

## Local Development

```sh
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run pages:dev
```

`REVIEWS_ADMIN_TOKEN` in `.dev.vars` is used by `/admin/reviews` for create, edit, and delete actions.

## Cloudflare Setup

1. Create the Pages project from this repository.
2. Create the D1 database:

```sh
npx wrangler d1 create epppe-reviews
```

3. Copy the returned `database_id` into `wrangler.jsonc`.
4. Set the production admin token:

```sh
npx wrangler pages secret put REVIEWS_ADMIN_TOKEN --project-name=epppe-portfolio
```

5. Apply the remote migration:

```sh
npm run db:migrate:remote
```

6. Deploy:

```sh
npm run pages:deploy
```

## Routes

- `/` - portfolio
- `/vault` - services, Minecraft status, and published reviews
- `/admin/reviews` - spreadsheet-style review editor
- `/api/reviews` - public `GET`, admin `GET` and `POST`
- `/api/reviews/:id` - admin `PUT` and `DELETE`

## Review Editing

The admin sheet supports inline row editing, selected-row deletion, save-all, CSV export, and CSV/TSV paste import. Use `.admin-token` as the admin token.

For trusted bulk SQL changes, use D1 directly:

```sh
npx wrangler d1 execute epppe-reviews --remote --command "SELECT * FROM reviews;"
npx wrangler d1 execute epppe-reviews --remote --file ./bulk-update.sql
```
