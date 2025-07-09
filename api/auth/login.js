import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqwfdarwdbvlljxfecke.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2ZkYXJ3ZGJ2bGxqeGZlY2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTQzNDQsImV4cCI6MjA2NzYzMDM0NH0.LyJAJ0E6kK8vEv7DjFkGtIQiORP3lFd5nWROeOBCbCw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Both fields are required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('username', username)
      .eq('password', password) // In production, you should compare hashed passwords
      .single();

    if (error || !user) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({ status: true, message: 'Login successful', username: user.username });

  } catch (err) {
    return res.status(500).json({ status: false, message: 'Unexpected error', error: err.message });
  }
}