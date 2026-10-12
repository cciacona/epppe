import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4321';
const preview = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1'], {
	stdio: ['ignore', 'pipe', 'pipe']
});
let output = '';
preview.stdout.on('data', (chunk) => { output += chunk; });
preview.stderr.on('data', (chunk) => { output += chunk; });
let browser;

try {
	let ready = false;
	for (let attempt = 0; attempt < 100; attempt++) {
		if (preview.exitCode !== null) throw new Error('Preview exited: ' + output);
		try { ready = (await fetch(origin)).ok; } catch {}
		if (ready) break;
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
	assert(ready, 'Preview failed to start: ' + output);
	await mkdir('artifacts', { recursive: true });
	browser = await chromium.launch();
	const pages = [
		'/', '/portfolio', '/vault', '/portfolio/composition',
		'/portfolio/composition/outcomes', '/portfolio/composition/artifacts',
		'/portfolio/composition/annotated-bibliography',
		'/portfolio/composition/initial-research-proposal',
		'/portfolio/composition/investigative-field-essay',
		'/portfolio/composition/process-archive', '/admin/reviews'
	];
	for (const width of [1440, 768, 390, 320]) {
		const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
		const page = await context.newPage();
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.route('**/api/reviews', (route) => route.fulfill({ json: { reviews: [] } }));
		await page.route('https://api.mcsrvstat.us/**', (route) => route.fulfill({
			json: { online: true, players: { online: 2, max: 20 } }
		}));
		for (const path of pages) {
			const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
			assert(response?.ok(), width + 'px: ' + path + ' returned ' + response?.status());
			assert.equal(await page.locator('h1').count(), 1, path + ' should have one h1');
			assert.equal(await page.locator('main').count(), 1, path + ' should have one main');
			assert.equal(await page.locator('.site-nav [aria-current="page"]').count(), path.startsWith('/admin') ? 0 : 1);
			const overflow = await page.evaluate(() => ({
				width: innerWidth, scroll: document.documentElement.scrollWidth,
				elements: [...document.querySelectorAll('main *')].filter((el) => {
					const rect = el.getBoundingClientRect();
					return rect.width && (rect.right > innerWidth + 2 || rect.left < -2);
				}).map((el) => ({ tag: el.tagName, class: el.className })).slice(0, 8)
			}));
			assert(overflow.scroll <= overflow.width + 2, width + 'px: horizontal overflow on ' + path + ': ' + JSON.stringify(overflow));
			if (width === 1440 || width === 390) {
				await page.screenshot({ path: 'artifacts/' + (path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')) + '-' + width + '.png', fullPage: true });
			}
			console.log('PASS ' + width + 'px ' + path);
		}
		assert.deepEqual(errors, [], width + 'px browser errors');
		await context.close();
	}

	const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
	const page = await context.newPage();
	let reviews = { reviews: [{
		title: 'Test review <markup>', body: 'Published review text.', category: 'Film',
		rating: 4, external_url: 'https://example.com/review', runtime: '90 min'
	}] };
	await page.route('**/api/reviews', (route) => route.fulfill({ json: reviews }));
	await page.route('https://api.mcsrvstat.us/**', (route) => route.fulfill({
		json: { online: true, players: { online: 2, max: 20 } }
	}));
	await page.goto(origin + '/vault', { waitUntil: 'networkidle' });
	await page.locator('#mc-copy-btn').click();
	assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'play.epppe.net');
	assert.equal(await page.locator('#mc-copy-btn small').innerText(), 'Copied');
	assert.equal(await page.locator('#mc-players').innerText(), '2 / 20 online');
	assert.equal(await page.locator('.review-entry h3').innerText(), 'Test review <markup>');
	assert.equal(await page.locator('.review-entry__rating').innerText(), '4/5');
	assert.equal(await page.locator('#reviews-status').isVisible(), false);
	assert.equal(await page.locator('.review-entry__link a').getAttribute('href'), 'https://example.com/review');

	reviews = { reviews: [] };
	await page.reload({ waitUntil: 'networkidle' });
	assert.equal(await page.locator('#reviews-status').innerText(), 'No published reviews yet.');
	await page.route('**/api/reviews', (route) => route.fulfill({ status: 503, json: { error: 'Unavailable' } }));
	await page.route('https://api.mcsrvstat.us/**', (route) => route.fulfill({ json: { online: false } }));
	await page.reload({ waitUntil: 'networkidle' });
	assert.equal(await page.locator('#reviews-status').innerText(), 'Reviews are unavailable.');
	assert.equal(await page.locator('#mc-players').innerText(), 'Offline');
	await context.close();

	const keyboardContext = await browser.newContext();
	const keyboardPage = await keyboardContext.newPage();
	await keyboardPage.goto(origin);
	await keyboardPage.keyboard.press('Tab');
	assert.equal(await keyboardPage.locator('.skip-link').evaluate((el) => el === document.activeElement), true);
	await keyboardPage.keyboard.press('Enter');
	assert.equal(await keyboardPage.locator('main').evaluate((el) => el === document.activeElement), true);
	await keyboardContext.close();
	console.log('PASS Vault states, clipboard, review rendering, and keyboard skip link');
} finally {
	await browser?.close();
	preview.kill();
}
