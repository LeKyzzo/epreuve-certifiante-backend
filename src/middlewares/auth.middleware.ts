import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '../config/env';
import type { JetonPayload } from '../services/auth.service';

export const authentifier = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token manquant.' });
    return;
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as JetonPayload;
    req.utilisateur = payload;
    next();
  } catch (_erreur) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

export const verifierAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.utilisateur || req.utilisateur.role !== 'admin') {
    res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    return;
  }

  next();
};
