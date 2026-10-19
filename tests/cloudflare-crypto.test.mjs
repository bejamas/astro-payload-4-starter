import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { test } from 'node:test';
import { pbkdf2 } from '../apps/cms/cloudflare/crypto.ts';

for (const iterations of [25_000, 600_000]) {
  test(`Worker password hashing matches Node at ${iterations} iterations`, async () => {
    const password = 'A unicode password — 🌿';
    const salt = Buffer.from('a deterministic test salt');
    const actual = await new Promise((resolve, reject) =>
      pbkdf2(password, salt, iterations, 32, 'sha256', (error, key) =>
        error ? reject(error) : resolve(key),
      ),
    );
    assert.deepEqual(
      actual,
      pbkdf2Sync(password, salt, iterations, 32, 'sha256'),
    );
  });
}
