export interface NiveauBacs {
  level: number;
  bins: string[];
}

export interface RackEntrepot {
  rack: string;
  levels: NiveauBacs[];
}

export interface AlleEntrepot {
  aisle: string;
  racks: RackEntrepot[];
}

import type { ObjectId } from 'mongodb';

export interface DocumentEmplacement {
  warehouseId: number;
  code: string;
  layout: AlleEntrepot[];
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: ObjectId;
}
