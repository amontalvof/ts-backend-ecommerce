/*
 * Plantilla Routes
 * host + /api/plantilla
 */

import { readStyles } from '../controllers/plantilla.controller';

const { Router } = require('express');

const router = Router();

// read styles
router.get('/', readStyles);

export default router;
