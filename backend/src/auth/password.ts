import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const HASH_PREFIX = 'scrypt';

export function isPasswordHash(value: string) {
  return value.startsWith(`${HASH_PREFIX}$`);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${HASH_PREFIX}$${salt}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedValue: string) {
  if (!isPasswordHash(storedValue)) {
    const supplied = Buffer.from(password);
    const stored = Buffer.from(storedValue);
    return supplied.length === stored.length && timingSafeEqual(supplied, stored);
  }

  const [, salt, hash] = storedValue.split('$');
  if (!salt || !hash) return false;

  const storedHash = Buffer.from(hash, 'hex');
  const derivedKey = (await scrypt(password, salt, storedHash.length)) as Buffer;
  return storedHash.length === derivedKey.length && timingSafeEqual(storedHash, derivedKey);
}
