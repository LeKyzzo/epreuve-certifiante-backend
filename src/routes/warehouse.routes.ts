import { Router } from 'express';

import WarehouseController from '../controllers/warehouse.controller';
import { authentifier } from '../middlewares/auth.middleware';
import { valider } from '../middlewares/validation.middleware';
import {
  schemaCreationEntrepot,
  schemaMiseAJourPlanEntrepot,
  schemaPlanEntrepot
} from '../validators/warehouse.validators';

const router = Router();
const controller = new WarehouseController();

router.get('/', controller.listerEntrepots);

router.post('/', authentifier, valider(schemaCreationEntrepot), controller.creerEntrepot);

router
  .route('/:id/locations')
  .get(controller.recupererPlan)
  .post(authentifier, valider(schemaPlanEntrepot), controller.creerPlan)
  .put(authentifier, valider(schemaMiseAJourPlanEntrepot), controller.mettreAJourPlan);

export default router;
