import { Router } from 'express';

import WarehouseController from '../controllers/warehouse.controller';
import { authentifier, verifierAdmin } from '../middlewares/auth.middleware';
import { valider } from '../middlewares/validation.middleware';
import {
  schemaCreationEntrepot,
  schemaMiseAJourPlanEntrepot,
  schemaPlanEntrepot
} from '../validators/warehouse.validators';

const router = Router();
const controller = new WarehouseController();

router.get('/', authentifier, controller.listerEntrepots);

router.post('/', authentifier, verifierAdmin, valider(schemaCreationEntrepot), controller.creerEntrepot);

router
  .route('/:id/locations')
  .get(authentifier, controller.recupererPlan)
  .post(
    authentifier,
    verifierAdmin,
    valider(schemaPlanEntrepot),
    controller.creerPlan
  )
  .put(
    authentifier,
    verifierAdmin,
    valider(schemaMiseAJourPlanEntrepot),
    controller.mettreAJourPlan
  );

export default router;
