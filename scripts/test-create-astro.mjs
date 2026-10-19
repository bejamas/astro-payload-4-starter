import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createServer as createPortServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const directory = await mkdtemp(path.join(tmpdir(), 'astro-payload-create-'));
const project = path.join(directory, 'my-publication');
// Serve the checked-out commit so pull requests test their own template files.
const archive = execFileSync(
  'git',
  ['archive', '--format=tar.gz', '--prefix=starter/', 'HEAD'],
  { cwd: root, maxBuffer: 10_000_000 },
);
const server = createServer((request, response) => {
  if (request.url !== '/starter.tar.gz') {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'application/gzip' });
  response.end(archive);
});
const env = { ...process.env };
for (const key of [
  'PAYLOAD_SECRET',
  'DATABASE_URL',
  'MEDIA_DIR',
  'PAYLOAD_COOKIE_DOMAIN',
  'CLOUDFLARE_BUILD',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'DEPLOYMENT_TARGET',
  'NODE_ENV',
])
  delete env[key];
env.SEED_ADMIN_EMAIL = 'scaffold@example.test';
env.SEED_ADMIN_PASSWORD = randomBytes(24).toString('hex');

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return address.port;
}
async function freePorts() {
  const probes = [createPortServer(), createPortServer()];
  const ports = await Promise.all(probes.map(listen));
  await Promise.all(
    probes.map(
      (probe) =>
        new Promise((resolve, reject) =>
          probe.close((error) => (error ? reject(error) : resolve())),
        ),
    ),
  );
  return ports;
}
async function run(args, cwd) {
  console.info(`Running bun ${args.join(' ')}`);
  const child = spawn('bun', args, { cwd, env, stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) =>
      code === 0
        ? resolve()
        : reject(new Error(`bun ${args[0]} failed: ${code ?? signal}`)),
    );
  });
}

try {
  const port = await listen(server);
  await run(
    [
      'create',
      'astro@latest',
      'my-publication',
      '--template',
      `http://127.0.0.1:${port}/starter.tar.gz`,
      '--install',
      '--no-git',
      '--no-ai',
      '--yes',
      '--skip-houston',
    ],
    directory,
  );
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  const pkg = JSON.parse(
    await readFile(path.join(project, 'package.json'), 'utf8'),
  );
  assert.equal(pkg.name, 'my-publication');
  assert.deepEqual(pkg.workspaces, ['apps/*', 'packages/*']);
  for (const file of [
    'apps/web/astro.config.mjs',
    'apps/cms/src/payload.config.ts',
    'packages/content/payload-types.ts',
    '.env.example',
  ])
    await access(path.join(project, file));
  for (const file of [
    '.env',
    '.env.cloudflare.local',
    '.cloudflare-bootstrap',
    'apps/cms/data',
    'AGENTS.md',
  ]) {
    await assert.rejects(access(path.join(project, file)), { code: 'ENOENT' });
  }
  const readme = await readFile(path.join(project, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /ASTRO:REMOVE|bun create astro|npm create astro/);
  assert.match(readme, /bun run setup/);
  const [cmsPort, sitePort] = await freePorts();
  env.CMS_URL = `http://127.0.0.1:${cmsPort}`;
  env.SITE_URL = `http://127.0.0.1:${sitePort}`;
  for (const command of ['setup', 'seed', 'check'])
    await run(['run', command], project);
  await run(['run', 'smoke', '--dev'], project);
  for (const command of ['build', 'smoke'])
    await run(['run', command], project);
  console.info('create-astro generated a working Astro + Payload project.');
} finally {
  if (server.listening) server.close();
  await rm(directory, { recursive: true, force: true });
}
