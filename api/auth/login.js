// /api/auth/login.js

import { users } from '../../lib/users.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: false, message: 'Username and password required' });
    }

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({ status: true, message: 'Login successful' });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
}