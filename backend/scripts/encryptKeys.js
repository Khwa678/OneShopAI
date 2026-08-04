const { encryptKey, getDecryptedKey } = require('../utils/keyProtector');

const rawKey = process.argv[2];

if (!rawKey) {
  console.log('\n🔒 DocsAI API Key Encryptor Utility');
  console.log('Usage: node scripts/encryptKeys.js "<YOUR_API_KEY>"');
  console.log('Example: node scripts/encryptKeys.js "sk-proj-123456789"\n');
  process.exit(0);
}

const encrypted = encryptKey(rawKey);
const testDecrypted = getDecryptedKey(encrypted);

console.log('\n======================================================');
console.log('🔑 Original API Key :', rawKey);
console.log('🔒 Encrypted String :', encrypted);
console.log('✅ Decryption Test  :', testDecrypted === rawKey ? 'SUCCESSFUL (Verified)' : 'FAILED');
console.log('======================================================');
console.log('Paste the Encrypted String above into your backend/.env file!');
console.log('Example: OPENAI_API_KEY=' + encrypted + '\n');
