// /api/auth/login.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hqwfdarwdbvlljxfecke.supabase.co',
  'تمہاری_والی_secret_key'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Invalid credentials' });
  }

  return res.status(200).json({ status: true, message: 'Login successful' });
}