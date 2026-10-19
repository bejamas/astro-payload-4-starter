import { platform } from '#platform';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'node:path';
import {
  buildConfig,
  createFolderField,
  createTagField,
  type Access,
  type Field,
} from 'payload';

const authenticated: Access = ({ req }) => Boolean(req.user);
const published: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
const siteURL = process.env.SITE_URL || 'http://localhost:4321';
const cmsURL = process.env.CMS_URL || 'http://localhost:3000';
const secret = process.env.PAYLOAD_SECRET;
const appRoot = process.cwd();
if (!secret || secret.length < 32)
  throw new Error(
    'Set PAYLOAD_SECRET to at least 32 characters. Run bun run setup for local development.',
  );

const href: Field = {
  name: 'href',
  type: 'text',
  required: true,
  defaultValue: '/journal',
  validate: (value: unknown) => {
    if (typeof value !== 'string')
      return 'Enter a URL or a path starting with /.';
    if (/^\/(?!\/)/.test(value) && !value.includes('\\')) return true;
    try {
      return (
        ['https:', 'http:'].includes(new URL(value).protocol) ||
        'Use an http or https URL.'
      );
    } catch {
      return 'Enter a URL or a path starting with /.';
    }
  },
};
const slug: Field = {
  name: 'slug',
  type: 'text',
  unique: true,
  required: true,
  index: true,
  admin: {
    description:
      'Lowercase words separated by hyphens. Use home for the homepage.',
  },
  validate: (value: unknown) =>
    (typeof value === 'string' &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
      !['admin', 'api', 'journal', 'preview', 'robots', 'sitemap'].includes(
        value,
      )) ||
    'Use lowercase words and hyphens, and avoid reserved routes such as journal or preview.',
};
const seo: Field = {
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea', maxLength: 200 },
  ],
};
const contentAccess = {
  read: published,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
};
const previewURL = (
  collection: 'pages' | 'posts',
  data: Record<string, unknown>,
) =>
  `${siteURL}/preview/${collection}/${encodeURIComponent(typeof data.slug === 'string' ? data.slug : '')}`;

export default buildConfig({
  secret,
  serverURL: cmsURL,
  cors: [siteURL],
  csrf: [siteURL, cmsURL],
  admin: {
    user: 'users',
    importMap: { baseDir: path.join(appRoot, 'src') },
    meta: { titleSuffix: '| Fieldnotes CMS' },
  },
  ...platform,
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(
      appRoot,
      '../../packages/content/payload-types.ts',
    ),
  },
  collections: [
    {
      slug: 'users',
      auth: {
        cookies: {
          domain: process.env.PAYLOAD_COOKIE_DOMAIN || undefined,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      admin: { useAsTitle: 'email', group: 'Administration' },
      access: {
        read: authenticated,
        create: authenticated,
        update: authenticated,
        delete: authenticated,
      },
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
        preview: (data) => previewURL('pages', data),
      },
      access: contentAccess,
      versions: { drafts: { autosave: { interval: 800 } } },
      fields: [
        { name: 'title', type: 'text', required: true },
        slug,
        {
          name: 'sections',
          type: 'blocks',
          required: true,
          blocks: [
            {
              slug: 'hero',
              interfaceName: 'HeroBlock',
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'textarea', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'linkLabel', type: 'text' },
                href,
              ],
            },
            {
              slug: 'features',
              interfaceName: 'FeaturesBlock',
              fields: [
                { name: 'heading', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  maxRows: 6,
                  required: true,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                  ],
                },
              ],
            },
            {
              slug: 'content',
              interfaceName: 'ContentBlock',
              fields: [{ name: 'body', type: 'richText', required: true }],
            },
            {
              slug: 'faq',
              interfaceName: 'FAQBlock',
              fields: [
                { name: 'heading', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  required: true,
                  fields: [
                    { name: 'question', type: 'text', required: true },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
              ],
            },
            {
              slug: 'cta',
              interfaceName: 'CTABlock',
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'linkLabel', type: 'text', required: true },
                href,
              ],
            },
          ],
        },
        seo,
      ],
    },
    {
      slug: 'posts',
      access: contentAccess,
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', '_status', 'publishedAt'],
        preview: (data) => previewURL('posts', data),
      },
      versions: { drafts: { autosave: { interval: 800 } } },
      fields: [
        { name: 'title', type: 'text', required: true },
        slug,
        { name: 'excerpt', type: 'textarea', required: true },
        {
          name: 'category',
          type: 'text',
          required: true,
          defaultValue: 'Notes',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          defaultValue: 'Fieldnotes team',
        },
        { name: 'publishedAt', type: 'date', required: true },
        { name: 'cover', type: 'upload', relationTo: 'media' },
        { name: 'body', type: 'richText', required: true },
        seo,
      ],
    },
    {
      slug: 'media',
      admin: { group: 'Library' },
      access: {
        read: () => true,
        create: authenticated,
        update: authenticated,
        delete: authenticated,
      },
      upload: {
        staticDir: path.resolve(appRoot, process.env.MEDIA_DIR || 'media'),
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
        adminThumbnail: process.env.CLOUDFLARE_BUILD ? undefined : 'card',
      },
      fields: [
        { name: 'alt', type: 'text', required: true },
        createFolderField({ relationTo: 'folders' }),
        createTagField({ relationTo: 'tags' }),
      ],
    },
    {
      slug: 'folders',
      folders: true,
      admin: { useAsTitle: 'name', group: 'Library' },
      access: {
        read: authenticated,
        create: authenticated,
        update: authenticated,
        delete: authenticated,
      },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      slug: 'tags',
      tags: true,
      admin: { useAsTitle: 'name', group: 'Library' },
      access: {
        read: authenticated,
        create: authenticated,
        update: authenticated,
        delete: authenticated,
      },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
  globals: [
    {
      slug: 'site-settings',
      access: { read: () => true, update: authenticated },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Fieldnotes',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue:
            'Ideas on design, the web, and making things that matter.',
        },
        {
          name: 'navigation',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }, href],
        },
        {
          name: 'footer',
          type: 'text',
          defaultValue: 'An open notebook for a better web.',
        },
      ],
    },
  ],
});
