import { Router } from 'express';

import ProductController from '../controllers/product.controller';
import { authentifier, verifierAdmin } from '../middlewares/auth.middleware';
import { valider } from '../middlewares/validation.middleware';
import {
	schemaCreationProduit,
	schemaMiseAJourProduit,
	schemaSuppressionProduit
} from '../validators/product.validators';

const router = Router();
const controller = new ProductController();

router
	.route('/')
	.get(controller.lister)
	.post(authentifier, valider(schemaCreationProduit), controller.creer);

router
	.route('/:id')
	.put(authentifier, valider(schemaMiseAJourProduit), controller.mettreAJour)
	.delete(authentifier, verifierAdmin, valider(schemaSuppressionProduit), controller.supprimer);

export default router;
