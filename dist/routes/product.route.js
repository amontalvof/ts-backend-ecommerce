"use strict";
/*
 * Plantilla Routes
 * host + /api/product
 */
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller");
const { Router } = require('express');
const router = Router();
// read product
router.get('/:productId', product_controller_1.readProduct);
// read product
router.get('/comments/:productId', product_controller_1.readProductComments);
// update product
router.put('/:productId', product_controller_1.updateProduct);
exports.default = router;
//# sourceMappingURL=product.route.js.map