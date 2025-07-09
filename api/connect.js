import fs from 'fs/promises';
import path from 'path';

const keysFile = path.join(process.cwd(), 'lib', 'keys.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ status: false, message: 'Key is required' });
  }

  try {
    const data = await fs.readFile(keysFile, 'utf-8');
    const keys = JSON.parse(data);

    // تلاش کریں کہ کی active ہے یا نہیں
    const foundKey = keys.find(k => k.key === key && k.status === 'active');

    if (foundKey) {
      // کی ویلڈ ہے
      return res.status(200).json({
        status: true,
        license: foundKey.key,
        panel_name: "Impossible Panel"
      });
    } else {
      // کی ان ویلڈ ہے
      return res.status(401).json({
        status: false,
        message: "Access Denied",
        error: "Invalid Key"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}
