import pool from '../config/postgresClient';
import type { Produit, ProduitCreation, ProduitMiseAJour } from '../models/produit';

const mapProduit = (ligne: any): Produit => ({
  id: ligne.id,
  name: ligne.name,
  reference: ligne.reference,
  quantity: Number(ligne.quantity),
  warehouseId: Number(ligne.warehouseId)
});

export default class ProductService {
  async listerTous(): Promise<Produit[]> {
    const resultat = await pool.query(
      'SELECT id, name, reference, quantity, warehouse_id AS "warehouseId" FROM products ORDER BY id'
    );
    return resultat.rows.map(mapProduit);
  }

  async creerProduit(payload: ProduitCreation): Promise<Produit> {
    const resultat = await pool.query(
      'INSERT INTO products (name, reference, quantity, warehouse_id) VALUES ($1, $2, $3, $4) RETURNING id, name, reference, quantity, warehouse_id AS "warehouseId"',
      [payload.name, payload.reference, Number(payload.quantity ?? 0), Number(payload.warehouseId)]
    );
    return mapProduit(resultat.rows[0]);
  }

  async mettreAJourProduit(idProduit: number, payload: ProduitMiseAJour): Promise<Produit | null> {
    const resultat = await pool.query(
      'UPDATE products SET name = $1, reference = $2, quantity = $3, warehouse_id = $4 WHERE id = $5 RETURNING id, name, reference, quantity, warehouse_id AS "warehouseId"',
      [payload.name, payload.reference, Number(payload.quantity), Number(payload.warehouseId), idProduit]
    );

    if (resultat.rowCount === 0) {
      return null;
    }

    return mapProduit(resultat.rows[0]);
  }

  async supprimerProduit(idProduit: number): Promise<boolean> {
    const resultat = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [idProduit]);
    return (resultat.rowCount ?? 0) > 0;
  }
}
