import { type Request, type Response } from 'express';

import { obtenirPool } from '../bdd';
import type { Mouvement, MouvementCreation } from '../models/mouvement';

const pool = obtenirPool();

const mapMouvement = (ligne: any): Mouvement => ({
  id: ligne.id,
  productId: Number(ligne.productId),
  quantity: Number(ligne.quantity),
  type: ligne.type,
  createdAt: new Date(ligne.createdAt)
});

export const listerMouvements = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resultat = await pool.query(
      'SELECT id, product_id AS "productId", quantity, type, created_at AS "createdAt" FROM movements ORDER BY created_at DESC'
    );
    res.json(resultat.rows.map(mapMouvement));
  } catch (_erreur) {
    res.status(500).json({ message: 'Lecture des mouvements impossible.' });
  }
};

export const enregistrerMouvement = async (req: Request, res: Response): Promise<void> => {
  const { productId, type, quantity } = req.body as Partial<MouvementCreation>;

  if (!productId || !type || !quantity) {
    res.status(400).json({ message: 'Champs productId, type et quantity obligatoires.' });
    return;
  }

  const genre = String(type).toUpperCase();
  if (genre !== 'IN' && genre !== 'OUT') {
    res.status(400).json({ message: 'Le type doit être IN ou OUT.' });
    return;
  }

  const quantite = Number(quantity);
  if (!Number.isFinite(quantite) || quantite <= 0) {
    res.status(400).json({ message: 'La quantité doit être un entier positif.' });
    return;
  }

  const idProduit = Number(productId);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const produit = await client.query('SELECT quantity FROM products WHERE id = $1 FOR UPDATE', [idProduit]);

    if (produit.rowCount === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ message: 'Produit introuvable.' });
      return;
    }

    const stockActuel = Number(produit.rows[0].quantity);
    const variation = genre === 'IN' ? quantite : -quantite;
    const stockFinal = stockActuel + variation;

    if (stockFinal < 0) {
      await client.query('ROLLBACK');
      res.status(400).json({ message: 'Stock négatif interdit.' });
      return;
    }

    await client.query('UPDATE products SET quantity = $1 WHERE id = $2', [stockFinal, idProduit]);
    const mouvementCree = await client.query(
      'INSERT INTO movements (product_id, quantity, type) VALUES ($1, $2, $3) RETURNING id, product_id AS "productId", quantity, type, created_at AS "createdAt"',
      [idProduit, quantite, genre]
    );

    await client.query('COMMIT');
    res.status(201).json({ mouvement: mapMouvement(mouvementCree.rows[0]), stock: stockFinal });
  } catch (_erreur) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Impossible de créer le mouvement.' });
  } finally {
    client.release();
  }
};
