"use strict";
/*
 * User Routes
 * host + /api/user
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_file_1 = __importDefault(require("../middlewares/validate.file"));
const validate_jwt_1 = __importDefault(require("../middlewares/validate.jwt"));
const verify_passwords_match_1 = __importDefault(require("../middlewares/verify.passwords.match"));
const user_controller_1 = require("../controllers/user.controller");
const validate_img_1 = __importDefault(require("../middlewares/validate.img"));
const validate_fields_1 = __importDefault(require("../middlewares/validate.fields"));
const router = (0, express_1.Router)();
router.post('/', user_controller_1.readUser);
router.put('/verify/:userId', user_controller_1.verifyUser);
router.put('/update/pass/:userId', [
    validate_jwt_1.default,
    (0, express_validator_1.check)('updPassword1', 'A password is required.').not().isEmpty(),
    (0, express_validator_1.check)('updPassword1', 'The full name must be between 8 and 20 characters.').isLength({ min: 8, max: 20 }),
    (0, express_validator_1.check)('updPassword1', 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    (0, express_validator_1.check)('updPassword2', 'A password is required.').not().isEmpty(),
    (0, express_validator_1.check)('updPassword2').custom((updPassword2, { req }) => (0, verify_passwords_match_1.default)(updPassword2, req)),
    validate_fields_1.default,
], user_controller_1.updateUserPassword);
router.put('/upload/img/:userId', [validate_jwt_1.default, validate_file_1.default, validate_img_1.default], user_controller_1.uploadUserImage);
router.get('/orders/:userId', [validate_jwt_1.default, validate_fields_1.default], user_controller_1.getUserOrders);
router.put('/comment/:commentId', [
    validate_jwt_1.default,
    (0, express_validator_1.check)('calificacion', 'A rate is required.').not().isEmpty(),
    (0, express_validator_1.check)('comentario', 'The comment must be less than 300 characters.').isLength({ max: 300 }),
    (0, express_validator_1.check)('comentario', 'Special characters such as ~!@#$%^&*(){}[]?/ are not allowed.').matches(/^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ' ]*$/),
    validate_fields_1.default,
], user_controller_1.updateProductComment);
router.post('/comment/new', [
    validate_jwt_1.default,
    (0, express_validator_1.check)('comentario', 'The comment must be less than 300 characters.').isLength({ max: 300 }),
    (0, express_validator_1.check)('comentario', 'Special characters such as ~!@#$%^&*(){}[]?/ are not allowed.').matches(/^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ' ]*$/),
    validate_fields_1.default,
], user_controller_1.createProductComment);
router.post('/wish/new', [
    validate_jwt_1.default,
    (0, express_validator_1.check)('idProducto', 'A product id is required.').not().isEmpty(),
    (0, express_validator_1.check)('idUsuario', 'An user id is required.').not().isEmpty(),
    validate_fields_1.default,
], user_controller_1.addToWishList);
router.delete('/wish/:wishId', [validate_jwt_1.default, validate_fields_1.default], user_controller_1.deleteWish);
router.get('/wish/:userId', [validate_jwt_1.default, validate_fields_1.default], user_controller_1.readWishList);
router.delete('/:userId', [
    validate_jwt_1.default,
    (0, express_validator_1.check)('modo', 'An auth modo is required.').not().isEmpty(),
    validate_fields_1.default,
], user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map