import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

process.loadEnvFile(new URL('../.env', import.meta.url));
const children = new Set();
const run = (app, command) =>
  new Promise((resolve, reject) => {
    const child = spawn('bun', ['run', command, ...process.argv.slice(3)], {
      cwd: fileURLToPath(new URL(`../apps/${app}/`, import.meta.url)),
      env: {
        ...process.env,
        ...(command === 'start'
          ? {
              NODE_ENV: 'production',
              HOST: process.env.HOST || '127.0.0.1',
              PORT:
                new URL(
                  app === 'web'
                    ? process.env.SITE_URL || 'http://localhost:4321'
                    : process.env.CMS_URL || 'http://localhost:3000',
                ).port || (app === 'web' ? '4321' : '3000'),
            }
          : {}),
      },
      stdio: 'inherit',
      detached: process.platform !== 'win32',
    });
    children.add(child);
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      children.delete(child);
      if (code === 0 || signal === 'SIGTERM' || signal === 'SIGINT') resolve();
      else reject(new Error(`${app} ${command} exited with ${code ?? signal}`));
    });
  });
const stop = () => {
  for (const child of children) {
    if (process.platform === 'win32') child.kill('SIGTERM');
    else process.kill(-child.pid, 'SIGTERM');
  }
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
try {
  switch (process.argv[2]) {
    case 'dev':
    case 'start':
      await Promise.race([
        run('cms', process.argv[2]),
        run('web', process.argv[2]),
      ]);
      break;
    case 'build':
      await run('cms', 'build');
      await run('web', 'build');
      break;
    case 'check':
      await run('cms', 'check');
      await run('web', 'check');
      break;
    case 'seed':
      await run('cms', 'seed');
      break;
    case 'generate':
      await run('cms', 'generate:types');
      await run('cms', 'generate:importmap');
      break;
    case 'migrate':
    case 'migrate:create':
      await run('cms', process.argv[2]);
      break;
    default:
      throw new Error('Expected dev, start, build, check, seed, or generate.');
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  stop();
}
