import { type Request, type Response } from 'express';

import ProductService from '../services/product.service';
import type { ProduitCreation, ProduitMiseAJour } from '../models/produit';

export default class ProductController {
  constructor(private readonly service = new ProductService()) {}

  lister = async (_req: Request, res: Response): Promise<void> => {
    try {
      const produits = await this.service.listerTous();
      res.json(produits);
    } catch (erreur) {
      res.status(500).json({ message: 'Lecture des produits impossible.' });
    }
  };

  creer = async (req: Request, res: Response): Promise<void> => {
    const { name, reference, quantity = 0, warehouseId } = req.body as Partial<ProduitCreation>;

    if (!name || !reference || warehouseId === undefined) {
      res.status(400).json({ message: 'Champs name, reference et warehouseId obligatoires.' });
      return;
    }

    try {
      const produit = await this.service.creerProduit({
        name,
        reference,
        quantity,
        warehouseId
      });
      res.status(201).json(produit);
    } catch (erreur: any) {
      if (erreur?.code === '23505') {
        res.status(409).json({ message: 'Cette référence existe déjà.' });
        return;
      }
      res.status(500).json({ message: 'Création du produit impossible.' });
    }
  };

  mettreAJour = async (req: Request, res: Response): Promise<void> => {
    const idProduit = Number(req.params.id);
    const { name, reference, quantity, warehouseId } = req.body as Partial<ProduitMiseAJour>;

    if (!name || !reference || quantity === undefined || warehouseId === undefined) {
      res.status(400).json({ message: 'Champs name, reference, quantity et warehouseId obligatoires.' });
      return;
    }

    try {
      const produit = await this.service.mettreAJourProduit(idProduit, {
        name,
        reference,
        quantity,
        warehouseId
      });

      if (!produit) {
        res.status(404).json({ message: 'Produit introuvable.' });
        return;
      }

      res.json(produit);
    } catch (erreur: any) {
      if (erreur?.code === '23505') {
        res.status(409).json({ message: 'Cette référence existe déjà.' });
        return;
      }
      res.status(500).json({ message: 'Mise à jour du produit impossible.' });
    }
  };

  supprimer = async (req: Request, res: Response): Promise<void> => {
    const idProduit = Number(req.params.id);

    try {
      const supprime = await this.service.supprimerProduit(idProduit);

      if (!supprime) {
        res.status(404).json({ message: 'Produit introuvable.' });
        return;
      }

      res.status(204).send();
    } catch (_erreur) {
      res.status(500).json({ message: 'Suppression du produit impossible.' });
    }
  };
}
