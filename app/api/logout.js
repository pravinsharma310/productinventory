// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    serialize('session', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })
  );

  res.status(200).json({ message: 'Logged out' });
}
