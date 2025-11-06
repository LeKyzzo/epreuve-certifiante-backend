import { type Collection } from 'mongodb';

import mongoClient from '../config/mongoClient';
import type { DocumentEmplacement } from '../models/emplacement';

export default class WarehouseService {
  private collection: Collection<DocumentEmplacement> | null = null;

  private async obtenirCollection(): Promise<Collection<DocumentEmplacement>> {
    if (!this.collection) {
      await mongoClient.connect();
      this.collection = mongoClient.db().collection<DocumentEmplacement>('locations');
      await this.collection.createIndex({ warehouseId: 1 }, { unique: true });
    }

    return this.collection;
  }

  async recupererPlan(warehouseId: number): Promise<DocumentEmplacement | null> {
    const collection = await this.obtenirCollection();
    return collection.findOne({ warehouseId });
  }

  async creerPlan(warehouseId: number, document: DocumentEmplacement): Promise<DocumentEmplacement> {
    const collection = await this.obtenirCollection();
    const insertion = await collection.insertOne({ ...document, warehouseId });
    return { ...document, warehouseId, _id: insertion.insertedId } as DocumentEmplacement;
  }

  async mettreAJourPlan(warehouseId: number, miseAJour: Partial<DocumentEmplacement>): Promise<DocumentEmplacement | null> {
    const collection = await this.obtenirCollection();
    const resultat = await collection.updateOne({ warehouseId }, { $set: miseAJour });

    if (resultat.matchedCount === 0) {
      return null;
    }

    return collection.findOne({ warehouseId });
  }
}
