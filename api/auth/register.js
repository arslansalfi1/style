import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqwfdarwdbvlljxfecke.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2ZkYXJ3ZGJ2bGxqeGZlY2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTQzNDQsImV4cCI6MjA2NzYzMDM0NH0.LyJAJ0E6kK8vEv7DjFkGtIQiORP3lFd5nWROeOBCbCw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { access_key, username, password } = req.body;

  if (!access_key || !username || !password) {
    return res.status(400).json({ status: false, message: 'All fields are required' });
  }

  try {
    // Access key check (hardcoded or dynamic)
    if (access_key !== 'your_access_key_here') {
      return res.status(401).json({ status: false, message: 'Invalid access key' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user')
      .select('*')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({ status: false, message: 'Username already exists' });
    }

    // Insert new user
    const { error } = await supabase.from('user').insert([
      { username, password } // You can hash password before saving
    ]);

    if (error) {
      return res.status(500).json({ status: false, message: error.message });
    }

    return res.status(201).json({ status: true, message: 'User registered successfully' });

  } catch (err) {
    return res.status(500).json({ status: false, message: 'Unexpected error', error: err.message });
  }
}