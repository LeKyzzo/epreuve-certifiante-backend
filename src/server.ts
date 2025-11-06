import app from './app';
import env from './config/env';
import mongoClient from './config/mongoClient';
import pool from './config/postgresClient';

const demarrerServeur = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    await mongoClient.connect();
    await mongoClient.db().command({ ping: 1 });

    app.listen(env.port, () => {
      console.log(`StockLink Core API démarrée sur le port ${env.port}`);
    });
  } catch (erreur) {
    console.error('Impossible de démarrer le serveur:', erreur);
  }
};

void demarrerServeur();
