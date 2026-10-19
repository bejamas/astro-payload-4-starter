import { parse } from 'jsonc-parser';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const cms = parse(
  await readFile(path.join(root, 'apps/cms/wrangler.jsonc'), 'utf8'),
);
const web = parse(
  await readFile(path.join(root, 'apps/web/wrangler.jsonc'), 'utf8'),
);
if (
  cms.account_id !== web.account_id ||
  (process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_ACCOUNT_ID !== web.account_id)
)
  throw new Error('Cloudflare account IDs must match both configs.');
if (
  cms.vars.SITE_URL !== web.vars.SITE_URL ||
  cms.vars.CMS_URL !== web.vars.SITE_URL
)
  throw new Error('Cloudflare site and CMS must use one public origin.');
if (
  !web.services.some(
    (binding) => binding.binding === 'CMS' && binding.service === cms.name,
  )
)
  throw new Error('The site must bind to the configured CMS Worker.');
const env = {
  ...process.env,
  CLOUDFLARE_ACCOUNT_ID: web.account_id,
  CLOUDFLARE_BUILD: '1',
  SITE_URL: web.vars.SITE_URL,
  CMS_URL: cms.vars.CMS_URL,
};
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status) process.exit(result.status);
}
run('bun', ['run', 'build']);
run('node_modules/.bin/wrangler', [
  'd1',
  'migrations',
  'apply',
  cms.d1_databases[0].database_name,
  '--remote',
  '--config',
  'apps/cms/wrangler.jsonc',
]);
run('node_modules/.bin/wrangler', [
  'deploy',
  '--config',
  'apps/cms/wrangler.jsonc',
]);
run('node_modules/.bin/wrangler', [
  'deploy',
  '--config',
  'apps/web/dist/server/wrangler.json',
]);
console.log(`Deployed ${web.vars.SITE_URL}`);
