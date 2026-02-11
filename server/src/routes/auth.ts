import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const router = Router();

router.post('/login', (req: Request, res: Response): void => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain !== config.allowedEmailDomain.toLowerCase()) {
    res.status(403).json({ error: `Only @${config.allowedEmailDomain} emails are allowed` });
    return;
  }

  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '24h' });
  res.json({ token, email });
});

export default router;
