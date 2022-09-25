"use strict";
/*
 * Plantilla Routes
 * host + /api/plantilla
 */
Object.defineProperty(exports, "__esModule", { value: true });
const plantilla_controller_1 = require("../controllers/plantilla.controller");
const { Router } = require('express');
const router = Router();
// read styles
router.get('/', plantilla_controller_1.readStyles);
exports.default = router;
//# sourceMappingURL=plantilla.route.js.map