import pool from '../config/postgresClient';
import type { Mouvement, MouvementCreation } from '../models/mouvement';

const mapMouvement = (ligne: any): Mouvement => ({
  id: ligne.id,
  productId: Number(ligne.productId),
  quantity: Number(ligne.quantity),
  type: ligne.type,
  createdAt: new Date(ligne.createdAt)
});

export default class MovementService {
  async listerTous(): Promise<Mouvement[]> {
    const resultat = await pool.query(
      'SELECT id, product_id AS "productId", quantity, type, created_at AS "createdAt" FROM movements ORDER BY created_at DESC'
    );
    return resultat.rows.map(mapMouvement);
  }

  async creerMouvement(payload: MouvementCreation): Promise<{ mouvement: Mouvement; stock: number } | null> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const produit = await client.query('SELECT quantity FROM products WHERE id = $1 FOR UPDATE', [payload.productId]);

      if (produit.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const stockActuel = Number(produit.rows[0].quantity);
      const variation = payload.type === 'IN' ? payload.quantity : -payload.quantity;
      const stockFinal = stockActuel + variation;

      if (stockFinal < 0) {
        await client.query('ROLLBACK');
        throw new Error('STOCK_NEGATIF');
      }

      await client.query('UPDATE products SET quantity = $1 WHERE id = $2', [stockFinal, payload.productId]);
      const mouvementCree = await client.query(
        'INSERT INTO movements (product_id, quantity, type) VALUES ($1, $2, $3) RETURNING id, product_id AS "productId", quantity, type, created_at AS "createdAt"',
        [payload.productId, payload.quantity, payload.type]
      );

      await client.query('COMMIT');

      return { mouvement: mapMouvement(mouvementCree.rows[0]), stock: stockFinal };
    } catch (erreur) {
      await client.query('ROLLBACK');
      throw erreur;
    } finally {
      client.release();
    }
  }
}
