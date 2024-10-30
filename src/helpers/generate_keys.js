import { randomBytes } from 'crypto';

const key1 = randomBytes(32).toString('hex');
const key2 = randomBytes(32).toString('hex');
console.table({ key1, key2 })
