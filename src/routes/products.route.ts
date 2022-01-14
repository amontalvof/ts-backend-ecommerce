/*
 * Plantilla Routes
 * host + /api/products
 */

import { readCategories } from '../controllers/categories.controller';
import { readSubCategories } from '../controllers/subcategories.controller';

const { Router } = require('express');

const router = Router();

// read categories
router.get('/categories', readCategories);

// read subcategories
router.get('/categories/subcategories', readSubCategories);

export default router;
