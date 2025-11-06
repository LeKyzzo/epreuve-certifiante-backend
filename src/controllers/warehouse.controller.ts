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

export const recupererPlanEntrepot = async (req: Request, res: Response): Promise<void> => {
  const idEntrepot = Number(req.params.id);

  try {
    const collection = await obtenirCollectionEmplacements();
    const document = await collection.findOne({ warehouseId: idEntrepot });

    if (!document) {
      res.status(404).json({ message: 'Aucune carte pour cet entrepôt.' });
      return;
    }

    res.json(document);
  } catch (_erreur) {
    res.status(500).json({ message: 'Lecture du plan impossible.' });
  }
};

export const creerPlanEntrepot = async (req: Request, res: Response): Promise<void> => {
  const idEntrepot = Number(req.params.id);
  const { code, layout = [], metadata } = req.body as Partial<DocumentEmplacement>;

  if (!code) {
    res.status(400).json({ message: 'Le champ code est obligatoire.' });
    return;
  }

  try {
    const collection = await obtenirCollectionEmplacements();
    const document: DocumentEmplacement = {
      warehouseId: idEntrepot,
      code,
      layout,
      metadata
    };

    if (metadata === undefined) {
      delete document.metadata;
    }

    const insertion = await collection.insertOne(document);
    res.status(201).json({ ...document, _id: insertion.insertedId });
  } catch (erreur: any) {
    if (erreur?.code === 11000) {
      res.status(409).json({ message: 'Un plan existe déjà pour cet entrepôt.' });
      return;
    }
    res.status(500).json({ message: 'Création du plan impossible.' });
  }
};

export const mettreAJourPlanEntrepot = async (req: Request, res: Response): Promise<void> => {
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
    const collection = await obtenirCollectionEmplacements();
    const resultat = await collection.updateOne({ warehouseId: idEntrepot }, { $set: miseAJour });

    if (resultat.matchedCount === 0) {
      res.status(404).json({ message: 'Aucune carte pour cet entrepôt.' });
      return;
    }

    const documentMisAJour = await collection.findOne({ warehouseId: idEntrepot });
    res.json(documentMisAJour);
  } catch (_erreur) {
    res.status(500).json({ message: 'Mise à jour du plan impossible.' });
  }
};
