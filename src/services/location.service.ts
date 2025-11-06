import { type Collection } from 'mongodb';

import mongoClient from '../config/mongoClient';
import type { DocumentEmplacement } from '../models/emplacement';

export default class LocationService {
  private collection: Collection<DocumentEmplacement> | null = null;

  private async obtenirCollection(): Promise<Collection<DocumentEmplacement>> {
    if (!this.collection) {
      await mongoClient.connect();
      this.collection = mongoClient.db().collection<DocumentEmplacement>('locations');
      await this.collection.createIndex({ warehouseId: 1 }, { unique: true });
    }

    return this.collection;
  }

  async verifierBac(binCode: string): Promise<{ existe: boolean; warehouseId: number | null }> {
    const collection = await this.obtenirCollection();
    const document = await collection.findOne(
      { 'layout.racks.levels.bins': binCode },
      { projection: { _id: 0, warehouseId: 1 } }
    );

    return { existe: Boolean(document), warehouseId: document?.warehouseId ?? null };
  }
}
