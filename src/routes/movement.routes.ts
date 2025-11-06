import { Router } from 'express';

import MovementController from '../controllers/movement.controller';

const router = Router();
const controller = new MovementController();

router
  .route('/')
  .get(controller.lister)
  .post(controller.creer);

export default router;
