// /api/auth/login.js

import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: false, message: 'Username and password required' });
    }

    const usersFile = path.join(process.cwd(), 'lib', 'users.json');
    const fileData = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(fileData);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({ status: true, message: 'Login successful' });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: err.message });
  }
}
