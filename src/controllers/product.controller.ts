import { type Request, type Response } from 'express';

import { obtenirPool } from '../bdd';
import type { Produit, ProduitCreation, ProduitMiseAJour } from '../models/produit';

const pool = obtenirPool();

const mapProduit = (ligne: any): Produit => ({
  id: ligne.id,
  name: ligne.name,
  reference: ligne.reference,
  quantity: Number(ligne.quantity),
  warehouseId: Number(ligne.warehouseId)
});

export const listerProduits = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resultat = await pool.query(
      'SELECT id, name, reference, quantity, warehouse_id AS "warehouseId" FROM products ORDER BY id'
    );
    res.json(resultat.rows.map(mapProduit));
  } catch (erreur) {
    res.status(500).json({ message: 'Lecture des produits impossible.' });
  }
};

export const creerProduit = async (req: Request, res: Response): Promise<void> => {
  const { name, reference, quantity = 0, warehouseId } = req.body as Partial<ProduitCreation>;

  if (!name || !reference || warehouseId === undefined) {
    res.status(400).json({ message: 'Champs name, reference et warehouseId obligatoires.' });
    return;
  }

  try {
    const resultat = await pool.query(
      'INSERT INTO products (name, reference, quantity, warehouse_id) VALUES ($1, $2, $3, $4) RETURNING id, name, reference, quantity, warehouse_id AS "warehouseId"',
      [name, reference, Number(quantity), Number(warehouseId)]
    );

    res.status(201).json(mapProduit(resultat.rows[0]));
  } catch (erreur: any) {
    if (erreur?.code === '23505') {
      res.status(409).json({ message: 'Cette référence existe déjà.' });
      return;
    }
    res.status(500).json({ message: 'Création du produit impossible.' });
  }
};

export const mettreAJourProduit = async (req: Request, res: Response): Promise<void> => {
  const idProduit = Number(req.params.id);
  const { name, reference, quantity, warehouseId } = req.body as Partial<ProduitMiseAJour>;

  if (!name || !reference || quantity === undefined || warehouseId === undefined) {
    res.status(400).json({ message: 'Champs name, reference, quantity et warehouseId obligatoires.' });
    return;
  }

  try {
    const resultat = await pool.query(
      'UPDATE products SET name = $1, reference = $2, quantity = $3, warehouse_id = $4 WHERE id = $5 RETURNING id, name, reference, quantity, warehouse_id AS "warehouseId"',
      [name, reference, Number(quantity), Number(warehouseId), idProduit]
    );

    if (resultat.rowCount === 0) {
      res.status(404).json({ message: 'Produit introuvable.' });
      return;
    }

    res.json(mapProduit(resultat.rows[0]));
  } catch (erreur: any) {
    if (erreur?.code === '23505') {
      res.status(409).json({ message: 'Cette référence existe déjà.' });
      return;
    }
    res.status(500).json({ message: 'Mise à jour du produit impossible.' });
  }
};

export const supprimerProduit = async (req: Request, res: Response): Promise<void> => {
  const idProduit = Number(req.params.id);

  try {
    const resultat = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [idProduit]);

    if (resultat.rowCount === 0) {
      res.status(404).json({ message: 'Produit introuvable.' });
      return;
    }

    res.status(204).send();
  } catch (_erreur) {
    res.status(500).json({ message: 'Suppression du produit impossible.' });
  }
};
