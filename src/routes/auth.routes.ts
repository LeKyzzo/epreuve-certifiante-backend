import { Router } from 'express';

import AuthController from '../controllers/auth.controller';
import { valider } from '../middlewares/validation.middleware';
import { schemaConnexion, schemaInscription } from '../validators/auth.validators';

const router = Router();
const controller = new AuthController();

router.post('/register', valider(schemaInscription), controller.inscrire);
router.post('/login', valider(schemaConnexion), controller.connecter);

export default router;
