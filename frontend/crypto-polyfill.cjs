// Polyfill Web Crypto API for Node 16.14 (Vite 5 requires getRandomValues)
const { webcrypto } = require('crypto');
if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
  globalThis.crypto = webcrypto;
}
