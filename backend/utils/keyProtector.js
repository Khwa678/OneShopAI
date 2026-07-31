const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'docs_playground_secure_master_key_2026';

// Derive 32-byte key from secret
function getDerivedKey(secret) {
  return crypto.createHash('sha256').update(String(secret)).digest();
}

/**
 * Encrypts a plaintext API key string
 * Output format: enc:<iv_hex>:<ciphertext_hex>
 */
function encryptKey(plainTextKey, secret = SECRET_KEY) {
  if (!plainTextKey || plainTextKey.startsWith('enc:')) return plainTextKey;

  const key = getDerivedKey(secret);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainTextKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `enc:${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted key if it starts with 'enc:', otherwise returns key as is
 */
function getDecryptedKey(keyOrEnvVar, secret = SECRET_KEY) {
  if (!keyOrEnvVar) return '';
  const raw = String(keyOrEnvVar).trim();

  if (!raw.startsWith('enc:')) {
    return raw;
  }

  try {
    const parts = raw.split(':');
    if (parts.length !== 3) return raw;

    const iv = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = getDerivedKey(secret);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Key decryption failed, falling back to raw string:', err.message);
    return raw;
  }
}

module.exports = {
  encryptKey,
  getDecryptedKey
};
