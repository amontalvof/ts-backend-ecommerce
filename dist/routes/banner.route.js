"use strict";
/*
 * Plantilla Routes
 * host + /api/slider
 */
Object.defineProperty(exports, "__esModule", { value: true });
const banner_controller_1 = require("../controllers/banner.controller");
const { Router } = require('express');
const router = Router();
// read slider
router.get('/', banner_controller_1.readBanner);
exports.default = router;
//# sourceMappingURL=banner.route.js.map