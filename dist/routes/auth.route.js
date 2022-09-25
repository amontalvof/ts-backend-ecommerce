"use strict";
/*
 * User Routes
 * host + /api/auth
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_fields_1 = __importDefault(require("../middlewares/validate.fields"));
const validate_jwt_1 = __importDefault(require("../middlewares/validate.jwt"));
const verify_passwords_match_1 = __importDefault(require("../middlewares/verify.passwords.match"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.check)('regName', 'A full name is required.').not().isEmpty(),
    (0, express_validator_1.check)('regName', 'The full name must be between 3 and 20 characters.').isLength({ min: 3, max: 20 }),
    (0, express_validator_1.check)('regName', 'The full name does not allow numbers or special characters.').matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
    (0, express_validator_1.check)('regEmail', 'An email is required.').not().isEmpty(),
    (0, express_validator_1.check)('regEmail', 'The email has an invalid format.').isEmail(),
    (0, express_validator_1.check)('regPassword1', 'A password is required.').not().isEmpty(),
    (0, express_validator_1.check)('regPassword1', 'The full name must be between 8 and 20 characters.').isLength({ min: 8, max: 20 }),
    (0, express_validator_1.check)('regPassword1', 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    (0, express_validator_1.check)('regPassword2', 'A password is required.').not().isEmpty(),
    (0, express_validator_1.check)('regPassword2').custom((regPassword2, { req }) => (0, verify_passwords_match_1.default)(regPassword2, req)),
    (0, express_validator_1.check)('regTerms', 'The terms of use and privacy policies must be accepted.').isIn([true]),
    validate_fields_1.default,
], auth_controller_1.createUser);
router.post('/login', [
    (0, express_validator_1.check)('logEmail', 'An email is required.').not().isEmpty(),
    (0, express_validator_1.check)('logEmail', 'The email has an invalid format.').isEmail(),
    (0, express_validator_1.check)('logPassword', 'The full name must be between 8 and 20 characters.').isLength({ min: 8, max: 20 }),
    (0, express_validator_1.check)('logPassword', 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    validate_fields_1.default,
], auth_controller_1.loginUser);
router.post('/google', [
    (0, express_validator_1.check)('tokenId', 'An tokenId is required.').not().isEmpty(),
    validate_fields_1.default,
    auth_controller_1.googleSignIn,
]);
router.put('/forgotPassword', [
    (0, express_validator_1.check)('fgpEmail', 'An email is required.').not().isEmpty(),
    (0, express_validator_1.check)('fgpEmail', 'The email has an invalid format.').isEmail(),
    validate_fields_1.default,
    auth_controller_1.forgotPassword,
]);
router.get('/renew', validate_jwt_1.default, auth_controller_1.renewToken);
exports.default = router;
//# sourceMappingURL=auth.route.js.map