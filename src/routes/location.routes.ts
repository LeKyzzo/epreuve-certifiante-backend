import { Router } from 'express';

import { verifierBac } from '../controllers/location.controller';

const router = Router();

router.get('/:binCode/exists', verifierBac);

export default router;
