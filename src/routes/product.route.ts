/*
 * Plantilla Routes
 * host + /api/product
 */

import { readProduct, updateProduct } from '../controllers/product.controller';

const { Router } = require('express');

const router = Router();

// read product
router.get('/:productId', readProduct);

// update product
router.put('/:productId', updateProduct);

export default router;
