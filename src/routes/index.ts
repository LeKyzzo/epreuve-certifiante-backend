import { Router } from 'express';

import locationRoutes from './location.routes';
import movementRoutes from './movement.routes';
import productRoutes from './product.routes';
import warehouseRoutes from './warehouse.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/locations', locationRoutes);
router.use('/movements', movementRoutes);

export default router;
