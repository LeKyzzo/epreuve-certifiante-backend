import { Router } from 'express';

import LocationController from '../controllers/location.controller';

const router = Router();
const controller = new LocationController();

router.get('/:binCode/exists', controller.verifier);

export default router;
