"use strict";
/*
 * Plantilla Routes
 * host + /api/slider
 */
Object.defineProperty(exports, "__esModule", { value: true });
const slider_controller_1 = require("../controllers/slider.controller");
const { Router } = require('express');
const router = Router();
// read slider
router.get('/', slider_controller_1.readSlider);
exports.default = router;
//# sourceMappingURL=slider.route.js.map