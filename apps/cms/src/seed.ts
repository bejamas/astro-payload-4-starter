import { getPayload } from 'payload';
import sharp from 'sharp';
import config from './payload.config';
import type { Post } from '../../../packages/content/payload-types';

if (process.env.NODE_ENV === 'production')
  throw new Error('The sample seed is for development only.');
const payload = await getPayload({ config });
const body = (...paragraphs: string[]): Post['body'] => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      textStyle: '',
      children: [
        {
          type: 'text',
          text,
          format: 0,
          detail: 0,
          mode: 'normal',
          style: '',
          version: 1,
        },
      ],
    })),
  },
});

try {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (Boolean(email) !== Boolean(password))
    throw new Error(
      'Set both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, or leave both empty.',
    );
  if (email && password) {
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      overrideAccess: true,
      limit: 1,
    });
    if (!users.docs.length)
      await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: { email, password, name: 'Editor' },
      });
  }

  const samples = [
    {
      slug: 'a-slower-kind-of-web',
      title: 'A slower kind of web.',
      category: 'Perspective',
      excerpt:
        'What happens when we stop designing for the scroll and start designing for attention?',
      background: '#ded7c5',
      ink: '#43584c',
      accent: '#d6e688',
      paragraphs: [
        'The web is good at asking for more. More tabs, more notifications, more things to read later. We wanted to ask a different question: what would a website look like if it respected your attention?',
        'Start with what someone came for. Give the words room. Let a page end. These are small decisions, but together they make a website feel like a place you can spend time in.',
        'Speed still matters. A page should load before you have time to wonder whether it is broken. But the experience after that first second deserves the same care.',
      ],
    },
    {
      slug: 'the-case-for-less',
      title: 'The case for less.',
      category: 'Design',
      excerpt:
        'A few useful constraints can do more for a project than another moodboard.',
      background: '#dabba9',
      ink: '#713f30',
      accent: '#f2d9ad',
      paragraphs: [
        'One typeface. A small palette. Components you can count without opening a spreadsheet. Constraints give a project a point of view before the first page is finished.',
        'Working with fewer parts makes you look more closely at each one. The spacing between two lines becomes a decision. A button has to earn its place.',
        'Keep the parts that help someone understand or act. When a page feels busy, try removing something before you add a new way to organize it.',
      ],
    },
    {
      slug: 'content-comes-first',
      title: 'Give the story a head start.',
      category: 'Practice',
      excerpt:
        'Good content models make space for the people who use them every day.',
      background: '#cbd1db',
      ink: '#3c4d6e',
      accent: '#f1ead8',
      paragraphs: [
        'A content model is an interface. Editors meet it every time they write a headline, upload an image, or try to put a page together before lunch.',
        'Name fields after the things people already know. Explain the choices that matter. Preview the page where the words will actually live.',
        'This starter keeps page sections in Payload and rendering in Astro. Change a heading in the admin, publish, and open the site. The content is there on the next request.',
      ],
    },
  ];
  for (const [index, sample] of samples.entries()) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: sample.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs.length) continue;
    const filename = `${sample.slug}.png`;
    const media = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      overrideAccess: true,
      limit: 1,
    });
    let cover = media.docs[0];
    if (!cover) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="${sample.background}"/><circle cx="600" cy="440" r="280" fill="${sample.ink}"/><path d="M0 700Q300 380 600 700T1200 700V900H0Z" fill="${sample.accent}"/><path d="M0 830Q300 510 600 830T1200 830V900H0Z" fill="${sample.background}"/><circle cx="600" cy="440" r="160" fill="${sample.background}"/><path d="M600 160V720M320 440H880" stroke="${sample.background}" stroke-width="2"/></svg>`;
      const data = await sharp(Buffer.from(svg)).png().toBuffer();
      cover = await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: {
          alt: `Geometric study in ${['green and cream', 'terracotta and peach', 'blue and ivory'][index]}`,
        },
        file: {
          data,
          mimetype: 'image/png',
          name: filename,
          size: data.length,
        },
      });
    }
    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      data: {
        title: sample.title,
        slug: sample.slug,
        excerpt: sample.excerpt,
        category: sample.category,
        author: 'Fieldnotes team',
        publishedAt: new Date(Date.UTC(2026, 9, 16 - index * 3)).toISOString(),
        cover: cover.id,
        body: body(...sample.paragraphs),
        _status: 'published',
      },
    });
  }
  const pages = [
    {
      title: 'Home',
      slug: 'home',
      sections: [
        {
          blockType: 'hero',
          eyebrow: 'An independent notebook',
          heading: 'Make room for\nbetter ideas.',
          description:
            'Notes on design, the web, and the quiet work of making something worthwhile.',
          linkLabel: 'Explore the journal',
          href: '/journal',
        },
        {
          blockType: 'features',
          heading: 'A little less noise.\nA little more substance.',
          items: [
            {
              title: 'Thoughtfully made',
              description:
                'Considered words, useful details, and enough room to take it all in.',
            },
            {
              title: 'Open by default',
              description:
                'Ideas are better when they travel. Take what is useful and make it your own.',
            },
            {
              title: 'Always in progress',
              description:
                'A notebook, not a manifesto. There is room here to change our minds.',
            },
          ],
        },
        {
          blockType: 'faq',
          heading: 'A few things to know.',
          items: [
            {
              question: 'What is Fieldnotes?',
              answer:
                'A sample publication built with Astro, Payload 4, and Bejamas UI. Every section on this page is editable in the CMS.',
            },
            {
              question: 'How do I make it my own?',
              answer:
                'Open the Payload admin, edit the Home page, and publish. Change the colors in globals.css and add components with the Bejamas CLI.',
            },
            {
              question: 'Can I try the new Payload admin?',
              answer:
                'Yes. Open localhost:3000/admin to create your first user, or sign in with the credentials you supplied when seeding.',
            },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Something worth\nspending time with.',
          description: 'Pull up a chair. Start with a story.',
          linkLabel: 'Read the journal',
          href: '/journal',
        },
      ],
      seo: {
        description:
          'An independent notebook on design, the web, and making things that matter.',
      },
    },
    {
      title: 'About',
      slug: 'about',
      sections: [
        {
          blockType: 'hero',
          eyebrow: 'Behind the notebook',
          heading: 'Good work starts\nwith curiosity.',
          description:
            'Fieldnotes is a place to think out loud about the things we make, and why we make them.',
          linkLabel: 'Read our notes',
          href: '/journal',
        },
        {
          blockType: 'content',
          body: body(
            'We are interested in websites that feel like someone thought about them. Clear words, considered interactions, and a structure that helps people find their way.',
            'This is a working starter. The page you are reading comes from Payload. Astro renders the HTML, and Bejamas UI supplies the components. The source is yours to change.',
          ),
        },
      ],
    },
  ] satisfies Array<
    Pick<
      import('../../../packages/content/payload-types').Page,
      'title' | 'slug' | 'sections' | 'seo'
    >
  >;
  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (!existing.docs.length)
      await payload.create({
        collection: 'pages',
        overrideAccess: true,
        data: { ...page, _status: 'published' },
      });
  }
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: true,
  });
  if (!settings.navigation?.length)
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      data: {
        name: 'Fieldnotes',
        description: 'Ideas on design, the web, and making things that matter.',
        navigation: [
          { label: 'Journal', href: '/journal' },
          { label: 'About', href: '/about' },
        ],
        footer: 'An open notebook for a better web.',
      },
    });
  payload.logger.info('Sample content is ready. Existing documents were kept.');
} finally {
  await payload.destroy();
}
