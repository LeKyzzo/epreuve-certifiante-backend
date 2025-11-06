import { MongoClient, type Collection } from 'mongodb';
import { Pool } from 'pg';

import env from './config/env';
import type { DocumentEmplacement } from './types/location';

const pool = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  user: env.postgres.user,
  password: env.postgres.password,
  database: env.postgres.database
});

const clientMongo = new MongoClient(env.mongo.uri);
let collectionEmplacements: Collection<DocumentEmplacement> | null = null;

export const obtenirPool = (): Pool => pool;

export const obtenirCollectionEmplacements = async (): Promise<Collection<DocumentEmplacement>> => {
  if (!collectionEmplacements) {
    await clientMongo.connect();
    collectionEmplacements = clientMongo.db().collection<DocumentEmplacement>('locations');
    await collectionEmplacements.createIndex({ warehouseId: 1 }, { unique: true });
  }

  return collectionEmplacements;
};

export const testerConnexionPostgres = async (): Promise<void> => {
  await pool.query('SELECT 1');
};

export const testerConnexionMongo = async (): Promise<void> => {
  await obtenirCollectionEmplacements();
};

export const fermerConnexions = async (): Promise<void> => {
  await pool.end();
  await clientMongo.close();
};
