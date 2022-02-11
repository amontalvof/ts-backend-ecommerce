/*
 * Plantilla Routes
 * host + /api/products
 */

import { readCategories } from '../controllers/categories.controller';
import { readSubCategories } from '../controllers/subcategories.controller';
import {
    readRelevantProducts,
    readRouteProducts,
    readProducts,
} from '../controllers/products.controller';

const { Router } = require('express');

const router = Router();

// read categories
router.get('/categories', readCategories);

// read subcategories
router.get('/categories/subcategories', readSubCategories);

// read relevant products
router.get('/relevant', readRelevantProducts);

// read products
router.post('/', readProducts);

// read relevant products
router.get('/routes', readRouteProducts);

export default router;
