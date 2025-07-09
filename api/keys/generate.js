import fs from 'fs/promises';
import path from 'path';

const keysFile = path.join(process.cwd(), 'lib', 'keys.json');

function generateRandomKey(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { key, expiry_time = 0, device_limit = 1, username } = req.body;

  if (!username) {
    return res.status(400).json({ status: false, message: 'Username is required' });
  }

  try {
    // Read existing keys
    const data = await fs.readFile(keysFile, 'utf-8');
    const keys = JSON.parse(data);

    // If key already exists, return error
    if (key && keys.find(k => k.key === key)) {
      return res.status(409).json({ status: false, message: 'Key already exists. Choose a different key or generate random.' });
    }

    const finalKey = key || generateRandomKey(16);

    const newKey = {
      id: Date.now(),
      key: finalKey,
      createdAt: new Date().toISOString(),
      createdBy: username,
      durationHours: Number(expiry_time),     // 0 = unlimited
      deviceLimit: Number(device_limit),      // default 1
      status: 'active',
      connectedDevices: []                    // initially empty
    };

    // Add new key to list
    keys.push(newKey);

    // Write updated keys
    await fs.writeFile(keysFile, JSON.stringify(keys, null, 2), 'utf-8');

    return res.status(201).json({
      status: true,
      message: 'Key generated successfully',
      key: newKey
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
  }
}
