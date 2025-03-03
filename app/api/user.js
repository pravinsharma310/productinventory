// pages/api/user.js
import { parse } from 'cookie';

export default function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  if (!cookies.session) return res.status(401).json({ message: 'Not authenticated' });

  const session = JSON.parse(cookies.session);
  res.status(200).json({ user: session });
}
