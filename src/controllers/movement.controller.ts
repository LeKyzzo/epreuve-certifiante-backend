import { type Request, type Response } from 'express';

import MovementService from '../services/movement.service';
import type { MouvementCreation } from '../models/mouvement';

export default class MovementController {
  constructor(private readonly service = new MovementService()) {}

  lister = async (_req: Request, res: Response): Promise<void> => {
    try {
      const mouvements = await this.service.listerTous();
      res.json(mouvements);
    } catch (_erreur) {
      res.status(500).json({ message: 'Lecture des mouvements impossible.' });
    }
  };

  creer = async (req: Request, res: Response): Promise<void> => {
    const { productId, type, quantity } = req.body as Partial<MouvementCreation>;

    if (!productId || !type || !quantity) {
      res.status(400).json({ message: 'Champs productId, type et quantity obligatoires.' });
      return;
    }

    const genre = String(type).toUpperCase();
    if (genre !== 'IN' && genre !== 'OUT') {
      res.status(400).json({ message: 'Le type doit être IN ou OUT.' });
      return;
    }

    const quantite = Number(quantity);
    if (!Number.isFinite(quantite) || quantite <= 0) {
      res.status(400).json({ message: 'La quantité doit être un entier positif.' });
      return;
    }

    try {
      const resultat = await this.service.creerMouvement({
        productId: Number(productId),
        type: genre,
        quantity: quantite
      });

      if (!resultat) {
        res.status(404).json({ message: 'Produit introuvable.' });
        return;
      }

      res.status(201).json(resultat);
    } catch (erreur: any) {
      if (erreur instanceof Error && erreur.message === 'STOCK_NEGATIF') {
        res.status(400).json({ message: 'Stock négatif interdit.' });
        return;
      }
      res.status(500).json({ message: 'Impossible de créer le mouvement.' });
    }
  };
}
