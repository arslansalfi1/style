import fs from 'fs/promises';
import path from 'path';

const usersFile = path.join(process.cwd(), 'lib', 'users.json');
const keyFile = path.join(process.cwd(), 'lib', 'access_key.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { username, password, access_key } = req.body;

  if (!username || !password || !access_key) {
    return res.status(400).json({ status: false, message: 'All fields are required' });
  }

  try {
    const keyData = await fs.readFile(keyFile, 'utf-8');
    const parsedKey = JSON.parse(keyData);

    if (access_key !== parsedKey.key) {
      return res.status(401).json({ status: false, message: 'Invalid access key' });
    }

    const data = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(data);

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ status: false, message: 'Username already exists' });
    }

    users.push({ username, password }); // In production, password should be hashed
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');

    return res.status(201).json({ status: true, message: 'Account created successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
  }
}
