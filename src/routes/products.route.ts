/*
 * Plantilla Routes
 * host + /api/products
 */

import { readCategories } from '../controllers/categories.controller';

const { Router } = require('express');

const router = Router();

// read styles
router.get('/categories', readCategories);

export default router;
