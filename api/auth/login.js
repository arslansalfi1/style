import fs from 'fs/promises';
import path from 'path';

const usersFile = path.join(process.cwd(), 'lib', 'users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Username and password required' });
  }

  try {
    const data = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(data);

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid username or password' });
    }

    // Optional: add a token or session here
    return res.status(200).json({ status: true, message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
  }
}
