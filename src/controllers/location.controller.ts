import { type Request, type Response } from 'express';

import { obtenirCollectionEmplacements } from '../bdd';

export const verifierBac = async (req: Request, res: Response): Promise<void> => {
  const { binCode } = req.params;

  try {
    const collection = await obtenirCollectionEmplacements();
    const document = await collection.findOne(
      { 'layout.racks.levels.bins': binCode },
      { projection: { _id: 0, warehouseId: 1 } }
    );

    res.json({ existe: Boolean(document), warehouseId: document?.warehouseId ?? null });
  } catch (_erreur) {
    res.status(500).json({ message: 'Recherche du bac impossible.' });
  }
};
