import fs from 'fs/promises';
import path from 'path';

const keysFile = path.join(process.cwd(), 'lib', 'keys.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { key } = req.body;
  if (!key) return res.status(400).json({ status: false, message: 'Key is required' });

  try {
    const data = await fs.readFile(keysFile, 'utf-8');
    let keys = JSON.parse(data);

    const exists = keys.some(k => k.key === key);
    if (!exists) {
      return res.status(404).json({ status: false, message: 'Key not found' });
    }

    keys = keys.filter(k => k.key !== key);
    await fs.writeFile(keysFile, JSON.stringify(keys, null, 2), 'utf-8');

    return res.status(200).json({ status: true, message: 'Key deleted successfully' });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: err.message });
  }
}
