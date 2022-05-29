/*
 * Plantilla Routes
 * host + /api/product
 */

import {
    readProduct,
    readProductComments,
    updateProduct,
} from '../controllers/product.controller';

const { Router } = require('express');

const router = Router();

// read product
router.get('/:productId', readProduct);

// read product
router.get('/comments/:productId', readProductComments);

// update product
router.put('/:productId', updateProduct);

export default router;
