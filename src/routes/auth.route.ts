/*
 * User Routes
 * host + /api/auth
 */

import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '../middlewares/validate.fields';
import verifyPasswordsMatch from '../middlewares/verify.passwords.match';
const { createUser } = require('../controllers/auth.controller');

const router = Router();

router.post(
    '/new',
    [
        check('regName', 'A full name is required.').not().isEmpty(),
        check(
            'regName',
            'The full name must be between 3 and 20 characters.'
        ).isLength({ min: 3, max: 20 }),
        check(
            'regName',
            'The full name does not allow numbers or special characters.'
        ).matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
        check('regEmail', 'An email is required.').not().isEmpty(),
        check('regEmail', 'The email has an invalid format.').isEmail(),
        check('regPassword1', 'A password is required.').not().isEmpty(),
        check(
            'regPassword1',
            'The full name must be between 8 and 20 characters.'
        ).isLength({ min: 8, max: 20 }),
        check(
            'regPassword1',
            'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ).matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ),
        check('regPassword2', 'A password is required.').not().isEmpty(),
        check('regPassword2').custom((regPassword2, { req }) =>
            verifyPasswordsMatch(regPassword2, req)
        ),
        check(
            'regTerms',
            'The terms of use and privacy policies must be accepted.'
        ).isIn([true]),
        validateFields,
    ],
    createUser
);

export default router;
