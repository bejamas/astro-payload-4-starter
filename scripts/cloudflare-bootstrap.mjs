import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

// Generate a fresh sample database. Never copy an existing developer database.
const root = path.resolve(import.meta.dirname, '..');
const directory = path.join(root, '.cloudflare-bootstrap');
const secret = randomBytes(48).toString('base64url');
const password = randomBytes(30).toString('base64url');
const email = process.env.CLOUDFLARE_ADMIN_EMAIL;
if (!email)
  throw new Error('Set CLOUDFLARE_ADMIN_EMAIL to the deployment owner.');
await mkdir(directory, { mode: 0o700 }); // Refuse to overwrite an existing bootstrap.
const database = path.join(directory, 'payload.db');
const media = path.join(directory, 'media');
await mkdir(media);
await writeFile(
  path.join(root, '.env.cloudflare.local'),
  `PAYLOAD_SECRET=${secret}\nSEED_ADMIN_EMAIL=${email}\nSEED_ADMIN_PASSWORD=${password}\n`,
  { mode: 0o600, flag: 'wx' },
);
await writeFile(
  path.join(directory, 'secrets.json'),
  JSON.stringify({ PAYLOAD_SECRET: secret }),
  { mode: 0o600 },
);
const child = spawnSync('bun', ['run', 'seed'], {
  cwd: path.join(root, 'apps/cms'),
  env: {
    ...process.env,
    NODE_ENV: 'development',
    CLOUDFLARE_BUILD: '',
    DATABASE_URL: `file:${database}`,
    MEDIA_DIR: media,
    PAYLOAD_SECRET: secret,
    SEED_ADMIN_EMAIL: email,
    SEED_ADMIN_PASSWORD: password,
  },
  stdio: 'inherit',
});
if (child.status) throw new Error('Sample seed failed.');
const db = new DatabaseSync(database);
db.exec(
  "ALTER TABLE media ADD COLUMN prefix text DEFAULT ''; ALTER TABLE media ADD COLUMN _objectkey text;",
);
const identifier = (name) => '"' + name.replaceAll('"', '""') + '"';
const literal = (value) =>
  value === null
    ? 'NULL'
    : typeof value === 'string'
      ? "'" + value.replaceAll("'", "''") + "'"
      : typeof value === 'number' || typeof value === 'bigint'
        ? String(value)
        : (() => {
            throw new Error('Unsupported seed SQL value');
          })();
const schema = db
  .prepare(
    "SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type DESC, name",
  )
  .all();
const tables = schema.filter((row) => row.type === 'table');
const schemaSQL =
  'PRAGMA defer_foreign_keys = ON;\n' +
  schema.map((row) => row.sql + ';').join('\n');
const seen = new Set();
const sorted = [];
function visit(table) {
  if (seen.has(table)) return;
  seen.add(table);
  for (const foreign of db
    .prepare(`PRAGMA foreign_key_list(${identifier(table)})`)
    .all())
    if (foreign.table !== table) visit(foreign.table);
  sorted.push(table);
}
tables.forEach(({ name }) => visit(name));
const dataSQL =
  'PRAGMA defer_foreign_keys = ON;\n' +
  sorted
    .flatMap((name) =>
      db
        .prepare(`SELECT * FROM ${identifier(name)}`)
        .all()
        .map(
          (row) =>
            `INSERT INTO ${identifier(name)} (${Object.keys(row).map(identifier).join(',')}) VALUES (${Object.values(row).map(literal).join(',')});`,
        ),
    )
    .join('\n');
await mkdir(path.join(root, 'apps/cms/cloudflare/migrations'), {
  recursive: true,
});
await writeFile(path.join(directory, 'schema.sql'), schemaSQL + '\n');
await writeFile(path.join(directory, 'seed.sql'), dataSQL + '\n', {
  mode: 0o600,
});
await writeFile(
  path.join(directory, 'uploads.json'),
  JSON.stringify(await readdir(media), null, 2),
  { mode: 0o600 },
);
db.close();
console.log(
  'Fresh seed prepared. Credentials: .env.cloudflare.local (owner-readable only).',
);
