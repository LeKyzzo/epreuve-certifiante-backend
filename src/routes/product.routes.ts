import { Router } from 'express';

import ProductController from '../controllers/product.controller';

const router = Router();
const controller = new ProductController();

router
	.route('/')
	.get(controller.lister)
	.post(controller.creer);

router
	.route('/:id')
	.put(controller.mettreAJour)
	.delete(controller.supprimer);

export default router;
