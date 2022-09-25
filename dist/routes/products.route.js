"use strict";
/*
 * Plantilla Routes
 * host + /api/products
 */
Object.defineProperty(exports, "__esModule", { value: true });
const categories_controller_1 = require("../controllers/categories.controller");
const subcategories_controller_1 = require("../controllers/subcategories.controller");
const products_controller_1 = require("../controllers/products.controller");
const { Router } = require('express');
const router = Router();
// read categories
router.get('/categories', categories_controller_1.readCategories);
// read subcategories
router.get('/categories/subcategories', subcategories_controller_1.readSubCategories);
// read relevant products
router.get('/relevant', products_controller_1.readRelevantProducts);
// read products
router.post('/', products_controller_1.readProducts);
// read relevant products
router.get('/routes', products_controller_1.readRouteProducts);
exports.default = router;
//# sourceMappingURL=products.route.js.map