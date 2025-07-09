// lib/updateExpiredKeys.js
import fs from 'fs/promises';
import path from 'path';

const keysFile = path.join(process.cwd(), 'lib', 'keys.json');

export async function updateExpiredKeys() {
  const now = new Date();
  const data = await fs.readFile(keysFile, 'utf-8');
  const keys = JSON.parse(data);

  let updated = false;

  for (let key of keys) {
    if (
      key.status === 'active' &&
      key.expiry_time > 0 &&
      new Date(key.created_at).getTime() + key.expiry_time * 3600000 < now.getTime()
    ) {
      key.status = 'expired';
      updated = true;
    }
  }

  if (updated) {
    await fs.writeFile(keysFile, JSON.stringify(keys, null, 2), 'utf-8');
  }

  return keys;
}