/*
 * Plantilla Routes
 * host + /api/slider
 */

import { readSlider } from '../controllers/slider.controller';

const { Router } = require('express');

const router = Router();

// read slider
router.get('/', readSlider);

export default router;
