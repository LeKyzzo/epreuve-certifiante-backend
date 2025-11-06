import { Router } from 'express';

import { enregistrerMouvement, listerMouvements } from '../controllers/movement.controller';

const router = Router();

router
	.route('/')
	.get(listerMouvements)
	.post(enregistrerMouvement);

export default router;
