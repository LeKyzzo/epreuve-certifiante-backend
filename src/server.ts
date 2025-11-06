import app from './app';
import env from './config/env';
import { testerConnexionMongo, testerConnexionPostgres } from './bdd';

const demarrerServeur = async (): Promise<void> => {
  try {
    await Promise.all([testerConnexionPostgres(), testerConnexionMongo()]);

    app.listen(env.port, () => {
      console.log(`StockLink Core API démarrée sur le port ${env.port}`);
    });
  } catch (erreur) {
    console.error('Impossible de démarrer le serveur:', erreur);
  }
};

void demarrerServeur();
