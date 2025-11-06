import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

export const valider = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const resultat = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    req.body = resultat.body ?? req.body;
    req.params = resultat.params ?? req.params;
    req.query = resultat.query ?? req.query;

    next();
  } catch (erreur) {
    if (erreur instanceof ZodError) {
      res.status(400).json({
        message: 'Validation invalide.',
        details: erreur.errors.map((detail) => ({ chemin: detail.path.join('.'), message: detail.message }))
      });
      return;
    }

    res.status(400).json({ message: 'Requête invalide.' });
  }
};
