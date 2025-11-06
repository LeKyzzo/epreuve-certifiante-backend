import { Router } from 'express';

import {
  creerProduit,
  listerProduits,
  mettreAJourProduit,
  supprimerProduit
} from '../controllers/product.controller';

const router = Router();

router
	.route('/')
	.get(listerProduits)
	.post(creerProduit);

router
	.route('/:id')
	.put(mettreAJourProduit)
	.delete(supprimerProduit);

export default router;
