import pool from '../config/postgresClient';
import type { Entrepot, EntrepotChamps } from '../models/entrepot';

const mapEntrepot = (ligne: any): Entrepot => ({
  id: ligne.id,
  name: ligne.name,
  location: ligne.location
});

export default class EntrepotService {
  async listerEntrepots(): Promise<Entrepot[]> {
    const resultat = await pool.query('SELECT id, name, location FROM warehouses ORDER BY id');
    return resultat.rows.map(mapEntrepot);
  }

  async creerEntrepot(champs: EntrepotChamps): Promise<Entrepot> {
    const resultat = await pool.query(
      'INSERT INTO warehouses (name, location) VALUES ($1, $2) RETURNING id, name, location',
      [champs.name, champs.location]
    );
    return mapEntrepot(resultat.rows[0]);
  }
}
