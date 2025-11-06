import { type Request, type Response } from 'express';

import type { DocumentEmplacement } from '../models/emplacement';
import type { EntrepotChamps } from '../models/entrepot';
import EntrepotService from '../services/warehouse.service';
import WarehousePlanService from '../services/warehouse-plan.service';

export default class WarehouseController {
  constructor(
    private readonly entrepotService = new EntrepotService(),
    private readonly planService = new WarehousePlanService()
  ) {}

  listerEntrepots = async (_req: Request, res: Response): Promise<void> => {
    try {
      const entrepots = await this.entrepotService.listerEntrepots();
      res.json(entrepots);
    } catch (_erreur) {
      res.status(500).json({ message: "Lecture des entrepôts impossible." });
    }
  };

  creerEntrepot = async (req: Request, res: Response): Promise<void> => {
    const { name, location } = req.body as EntrepotChamps;

    try {
      const entrepot = await this.entrepotService.creerEntrepot({ name, location });
      res.status(201).json(entrepot);
    } catch (_erreur) {
      res.status(500).json({ message: "Création de l'entrepôt impossible." });
    }
  };

  recupererPlan = async (req: Request, res: Response): Promise<void> => {
    const idEntrepot = Number(req.params.id);

    try {
      const document = await this.planService.recupererPlan(idEntrepot);

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
    const { code, layout = [], metadata } = req.body as {
      code: string;
      layout?: DocumentEmplacement['layout'];
      metadata?: DocumentEmplacement['metadata'];
    };

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

      const planCree = await this.planService.creerPlan(document);
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
      const documentMisAJour = await this.planService.mettreAJourPlan(idEntrepot, miseAJour);

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
