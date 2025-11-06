import { Router } from 'express';

import MovementController from '../controllers/movement.controller';
import { authentifier } from '../middlewares/auth.middleware';
import { valider } from '../middlewares/validation.middleware';
import { schemaCreationMouvement } from '../validators/movement.validators';

const router = Router();
const controller = new MovementController();

router
  .route('/')
  .get(controller.lister)
  .post(authentifier, valider(schemaCreationMouvement), controller.creer);

export default router;
