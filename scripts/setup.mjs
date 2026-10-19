import { randomBytes } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

try {
  await access(new URL('../.env', import.meta.url));
  console.info('.env already exists. Kept its values.');
} catch {
  const template = await readFile(
    new URL('../.env.example', import.meta.url),
    'utf8',
  );
  await writeFile(
    new URL('../.env', import.meta.url),
    template.replace(
      'PAYLOAD_SECRET=',
      `PAYLOAD_SECRET=${randomBytes(32).toString('hex')}`,
    ),
    { flag: 'wx', mode: 0o600 },
  );
  console.info('Created .env with a random Payload secret.');
}
await mkdir(new URL('../apps/cms/data/', import.meta.url), { recursive: true });
await mkdir(new URL('../apps/cms/media/', import.meta.url), {
  recursive: true,
});
