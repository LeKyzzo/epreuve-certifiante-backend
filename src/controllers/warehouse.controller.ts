import { type Request, type Response } from 'express';

import type { DocumentEmplacement } from '../models/emplacement';
import WarehouseService from '../services/warehouse.service';

export default class WarehouseController {
  constructor(private readonly service = new WarehouseService()) {}

  recupererPlan = async (req: Request, res: Response): Promise<void> => {
    const idEntrepot = Number(req.params.id);

    try {
      const document = await this.service.recupererPlan(idEntrepot);

      if (!document) {
        res.status(404).json({ message: 'Aucune carte pour cet entrepôt.' });
        return;
      }

      res.json(document);
    } catch (_erreur) {
      res.status(500).json({ message: 'Lecture du plan impossible.' });
    }
  };

  creerPlan = async (req: Request, res: Response): Promise<void> => {
    const idEntrepot = Number(req.params.id);
    const { code, layout = [], metadata } = req.body as Partial<DocumentEmplacement>;

    if (!code) {
      res.status(400).json({ message: 'Le champ code est obligatoire.' });
      return;
    }

    try {
      const document: DocumentEmplacement = {
        warehouseId: idEntrepot,
        code,
        layout,
        metadata
      };

      if (metadata === undefined) {
        delete document.metadata;
      }

      const planCree = await this.service.creerPlan(idEntrepot, document);
      res.status(201).json(planCree);
    } catch (erreur: any) {
      if (erreur?.code === 11000) {
        res.status(409).json({ message: 'Un plan existe déjà pour cet entrepôt.' });
        return;
      }
      res.status(500).json({ message: 'Création du plan impossible.' });
    }
  };

  mettreAJourPlan = async (req: Request, res: Response): Promise<void> => {
    const idEntrepot = Number(req.params.id);
    const { code, layout, metadata } = req.body as Partial<DocumentEmplacement>;

    const miseAJour: Partial<DocumentEmplacement> = {};

    if (code !== undefined) {
      miseAJour.code = code;
    }
    if (layout !== undefined) {
      miseAJour.layout = layout;
    }
    if (metadata !== undefined) {
      miseAJour.metadata = metadata;
    }

    if (Object.keys(miseAJour).length === 0) {
      res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
      return;
    }

    try {
      const documentMisAJour = await this.service.mettreAJourPlan(idEntrepot, miseAJour);

      if (!documentMisAJour) {
        res.status(404).json({ message: 'Aucune carte pour cet entrepôt.' });
        return;
      }

      res.json(documentMisAJour);
    } catch (_erreur) {
      res.status(500).json({ message: 'Mise à jour du plan impossible.' });
    }
  };
}
