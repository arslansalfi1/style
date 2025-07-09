// api/keys/list.js
import { updateExpiredKeys } from '@/lib/updateExpiredKeys';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  try {
    const updatedKeys = await updateExpiredKeys();
    return res.status(200).json({ status: true, keys: updatedKeys });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: err.message });
  }
}
