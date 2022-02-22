/*
 * Plantilla Routes
 * host + /api/slider
 */

import { readBanner } from '../controllers/banner.controller';

const { Router } = require('express');

const router = Router();

// read slider
router.get('/', readBanner);

export default router;
