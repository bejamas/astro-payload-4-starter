import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

process.loadEnvFile(new URL('../.env', import.meta.url));
const command = process.argv.includes('--dev') ? 'dev' : 'start';
const server = spawn(process.execPath, ['scripts/run.mjs', command], {
  stdio: 'inherit',
});
let exited = false;
const stopped = new Promise((resolve) =>
  server.once('exit', () => {
    exited = true;
    resolve();
  }),
);
try {
  const urls = [
    `${process.env.CMS_URL || 'http://localhost:3000'}/api/pages?limit=1`,
    process.env.SITE_URL || 'http://localhost:4321',
  ];
  const deadline = Date.now() + 45_000;
  for (const url of urls) {
    let ready = false;
    while (!ready) {
      if (exited)
        throw new Error(
          'The application servers exited before the checks ran.',
        );
      if (Date.now() > deadline)
        throw new Error(`Server did not become ready: ${url}`);
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(2000),
        });
        ready = response.ok;
        await response.body?.cancel();
      } catch {
        /* Server is still starting. */
      }
      if (!ready) await setTimeout(250);
    }
  }
  const files = (await readdir('tests'))
    .filter((name) => name.endsWith('.test.mjs'))
    .map((name) => `tests/${name}`);
  const tests = spawn(
    process.execPath,
    ['--env-file=.env', '--test', ...files],
    { stdio: 'inherit' },
  );
  const code = await new Promise((resolve, reject) => {
    tests.on('error', reject);
    tests.on('exit', resolve);
  });
  if (code !== 0) process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
  await stopped;
}
