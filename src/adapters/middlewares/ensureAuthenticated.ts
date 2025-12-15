import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    jwt.verify(token, secret);
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
