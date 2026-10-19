import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, test } from 'node:test';

const cms = process.env.CMS_URL || 'http://localhost:3000';
const site = process.env.SITE_URL || 'http://localhost:4321';
const created = [];
let token;
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `JWT ${token}`,
});
async function api(path, init = {}) {
  return fetch(`${cms}/api/${path}`, {
    ...init,
    signal: AbortSignal.timeout(30_000),
  });
}
async function create(collection, data) {
  const response = await api(collection, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  assert.equal(response.status, 201, await response.clone().text());
  const { doc } = await response.json();
  created.push({ collection, id: doc.id });
  return doc;
}
const hero = (heading) => [{ blockType: 'hero', heading, href: '/journal' }];

before(async () => {
  assert.ok(
    process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD,
    'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env, run bun run seed, and start both apps before testing.',
  );
  const response = await api('users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    }),
  });
  assert.equal(
    response.status,
    200,
    'The seeded editor must be able to log in.',
  );
  token = (await response.json()).token;
  assert.ok(token);
});
after(async () => {
  for (const item of created.reverse()) {
    const response = await api(`${item.collection}/${item.id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    assert.equal(
      response.status,
      200,
      `Could not remove test ${item.collection}/${item.id}`,
    );
  }
});

test('public pages, rich text, media, metadata, and missing routes work', async () => {
  for (const path of [
    '/',
    '/about',
    '/journal',
    '/journal/a-slower-kind-of-web',
  ]) {
    const response = await fetch(`${site}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1[\s>]/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /name="description"/);
    assert.doesNotMatch(html, /astro-island/);
  }
  const article = await (
    await fetch(`${site}/journal/a-slower-kind-of-web`)
  ).text();
  assert.match(article, /The web is good at asking for more/);
  const imageURL = article.match(/class="article-cover" src="([^"]+)"/)?.[1];
  assert.ok(imageURL, 'The uploaded cover should render in the article.');
  const image = await fetch(imageURL);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/webp/);
  for (const path of [
    '/missing-page',
    '/journal/missing-post',
    '/journal?page=-1',
    '/journal?page=999999',
  ]) {
    assert.equal((await fetch(`${site}${path}`)).status, 404, path);
  }
});

test('anonymous users cannot write content or create additional admin users', async () => {
  for (const path of ['pages', 'posts', 'users', 'globals/site-settings']) {
    const response = await api(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    assert.ok(
      [401, 403].includes(response.status),
      `${path}: ${response.status}`,
    );
  }
});

test('drafts stay private, previews require a valid login, and publishing reaches Astro', async () => {
  const slug = `test-page-${randomUUID()}`;
  const draftHeading = `Private draft ${slug}`;
  const page = await create('pages', {
    title: 'Integration test',
    slug,
    sections: hero(draftHeading),
    _status: 'draft',
  });
  assert.equal((await fetch(`${site}/${slug}`)).status, 404);
  const anon = await fetch(`${site}/preview/pages/${slug}`);
  assert.equal(anon.status, 401);
  assert.equal(anon.headers.get('cache-control'), 'no-store');
  assert.equal(anon.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(
    (
      await fetch(`${site}/preview/pages/${slug}`, {
        headers: { Cookie: 'payload-token=invalid' },
      })
    ).status,
    401,
  );
  const preview = await fetch(`${site}/preview/pages/${slug}`, {
    headers: { Cookie: `payload-token=${token}` },
  });
  assert.equal(preview.status, 200);
  assert.match(await preview.text(), new RegExp(draftHeading));
  assert.doesNotMatch(
    await (await fetch(`${site}/sitemap.xml`)).text(),
    new RegExp(slug),
  );
  const publish = await api(`pages/${page.id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ _status: 'published' }),
  });
  assert.equal(publish.status, 200);
  const publicPage = await fetch(`${site}/${slug}`);
  assert.equal(publicPage.status, 200);
  assert.match(await publicPage.text(), new RegExp(draftHeading));
  const revisedHeading = `Unpublished revision ${slug}`;
  const save = await api(`pages/${page.id}?draft=true`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ sections: hero(revisedHeading), _status: 'draft' }),
  });
  assert.equal(save.status, 200);
  const publicHTML = await (await fetch(`${site}/${slug}`)).text();
  assert.match(publicHTML, new RegExp(draftHeading));
  assert.doesNotMatch(publicHTML, new RegExp(revisedHeading));
  const revisedPreview = await fetch(`${site}/preview/pages/${slug}`, {
    headers: { Cookie: `payload-token=${token}` },
  });
  assert.match(await revisedPreview.text(), new RegExp(revisedHeading));
  const republish = await api(`pages/${page.id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({
      sections: hero(revisedHeading),
      _status: 'published',
    }),
  });
  assert.equal(republish.status, 200);
  assert.match(
    await (await fetch(`${site}/${slug}`)).text(),
    new RegExp(revisedHeading),
  );
  assert.match(
    await (await fetch(`${site}/sitemap.xml`)).text(),
    new RegExp(slug),
  );
});

test('post drafts stay off the journal and sitemap', async () => {
  const slug = `test-post-${randomUUID()}`;
  await create('posts', {
    title: 'Private post',
    slug,
    category: 'Notes',
    author: 'Test editor',
    publishedAt: new Date().toISOString(),
    excerpt: slug,
    body: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        direction: 'ltr',
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            direction: 'ltr',
            version: 1,
            textFormat: 0,
            textStyle: '',
            children: [
              {
                type: 'text',
                text: 'Private article body.',
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
          },
        ],
      },
    },
    _status: 'draft',
  });
  assert.equal((await fetch(`${site}/journal/${slug}`)).status, 404);
  assert.doesNotMatch(
    await (await fetch(`${site}/journal`)).text(),
    new RegExp(slug),
  );
  assert.doesNotMatch(
    await (await fetch(`${site}/sitemap.xml`)).text(),
    new RegExp(slug),
  );
  assert.equal((await fetch(`${site}/preview/posts/${slug}`)).status, 401);
  const preview = await fetch(`${site}/preview/posts/${slug}`, {
    headers: { Cookie: `payload-token=${token}` },
  });
  assert.equal(preview.status, 200);
  assert.match(await preview.text(), /Private post/);
});

test('the upload endpoint creates and serves a resized WebP variant', async () => {
  const media = await (await api('media?limit=1')).json();
  const source = await fetch(new URL(media.docs[0].url, cms));
  assert.equal(
    source.status,
    200,
    'The original uploaded file must be readable.',
  );
  const form = new FormData();
  form.append('_payload', JSON.stringify({ alt: 'Integration test image' }));
  form.append('file', await source.blob(), `test-${randomUUID()}.png`);
  const response = await api('media', {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  assert.equal(response.status, 201, await response.clone().text());
  const { doc } = await response.json();
  created.push({ collection: 'media', id: doc.id });
  assert.equal(doc.variants.card.width, 960);
  assert.equal(doc.variants.card.height, 720);
  const variant = await fetch(new URL(doc.variants.card.url, cms));
  assert.equal(variant.status, 200);
  assert.match(variant.headers.get('content-type'), /image\/webp/);
});
