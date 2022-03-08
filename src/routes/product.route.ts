/*
 * Plantilla Routes
 * host + /api/product
 */

import { readProduct } from '../controllers/product.controller';

const { Router } = require('express');

const router = Router();

// read product
router.get('/:productId', readProduct);

export default router;
