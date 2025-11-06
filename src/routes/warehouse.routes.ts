import { Router } from 'express';

import WarehouseController from '../controllers/warehouse.controller';

const router = Router();
const controller = new WarehouseController();

router
  .route('/:id/locations')
  .get(controller.recupererPlan)
  .post(controller.creerPlan)
  .put(controller.mettreAJourPlan);

export default router;
