/*
 * Plantilla Routes
 * host + /api/products
 */

import { readCategories } from '../controllers/categories.controller';
import {
    readFreeProducts,
    readRelevantProducts,
} from '../controllers/products.controller';
import { readSubCategories } from '../controllers/subcategories.controller';

const { Router } = require('express');

const router = Router();

// read categories
router.get('/categories', readCategories);

// read subcategories
router.get('/categories/subcategories', readSubCategories);

// read relevant products
router.get('/relevant/:order', readRelevantProducts);

// read free products
router.get('/free', readFreeProducts);

export default router;
