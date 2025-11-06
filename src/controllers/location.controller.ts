import { type Request, type Response } from 'express';

import { type Collection } from 'mongodb';

import mongoClient from '../config/mongoClient';
import type { DocumentEmplacement } from '../models/emplacement';

let collectionEmplacements: Collection<DocumentEmplacement> | null = null;

const obtenirCollectionEmplacements = async (): Promise<Collection<DocumentEmplacement>> => {
  if (!collectionEmplacements) {
    await mongoClient.connect();
    collectionEmplacements = mongoClient
      .db()
      .collection<DocumentEmplacement>('locations');
    await collectionEmplacements.createIndex({ warehouseId: 1 }, { unique: true });
  }

  return collectionEmplacements;
};

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
