import { Router } from 'express';

import {
  creerPlanEntrepot,
  mettreAJourPlanEntrepot,
  recupererPlanEntrepot
} from '../controllers/warehouse.controller';

const router = Router();

router
  .route('/:id/locations')
  .get(recupererPlanEntrepot)
  .post(creerPlanEntrepot)
  .put(mettreAJourPlanEntrepot);

export default router;
