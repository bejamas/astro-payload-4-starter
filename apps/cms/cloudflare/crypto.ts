import native from 'node:crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

export * from 'node:crypto';

// Hosted Workers cap native PBKDF2 at 100k. Keep Payload's 600k SHA-256
// hashes compatible with Node, including password creation and verification.
export function pbkdf2(
  password: native.BinaryLike,
  salt: native.BinaryLike,
  iterations: number,
  keylen: number,
  digest: string,
  callback: (error: Error | null, key: Buffer) => void,
): void {
  if (iterations <= 100_000 || digest !== 'sha256') {
    native.pbkdf2(password, salt, iterations, keylen, digest, callback);
    return;
  }
  const bytes = (value: native.BinaryLike) =>
    typeof value === 'string'
      ? new TextEncoder().encode(value)
      : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  void pbkdf2Async(sha256, bytes(password), bytes(salt), {
    c: iterations,
    dkLen: keylen,
  }).then(
    (key) => callback(null, Buffer.from(key)),
    (error) =>
      callback(
        error instanceof Error
          ? error
          : new Error('Password derivation failed'),
        Buffer.alloc(0),
      ),
  );
}
export default { ...native, pbkdf2 };
