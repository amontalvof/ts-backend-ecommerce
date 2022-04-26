/*
 * User Routes
 * host + /api/user
 */

import { Router } from 'express';
import { check } from 'express-validator';
import validateFile from '../middlewares/validate.file';
import validateJwt from '../middlewares/validate.jwt';
import verifyPasswordsMatch from '../middlewares/verify.passwords.match';
import {
    readUser,
    verifyUser,
    updateUserPassword,
    uploadUserImage,
} from '../controllers/user.controller';
import validateImg from '../middlewares/validate.img';

const router = Router();

router.post('/', readUser);

router.put('/verify/:userId', verifyUser);

router.put(
    '/update/pass/:userId',
    [
        validateJwt,
        check('updPassword1', 'A password is required.').not().isEmpty(),
        check(
            'updPassword1',
            'The full name must be between 8 and 20 characters.'
        ).isLength({ min: 8, max: 20 }),
        check(
            'updPassword1',
            'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ).matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ),
        check('updPassword2', 'A password is required.').not().isEmpty(),
        check('updPassword2').custom((updPassword2, { req }) =>
            verifyPasswordsMatch(updPassword2, req)
        ),
    ],
    updateUserPassword
);

router.put(
    '/upload/img/:userId',
    [validateJwt, validateFile, validateImg],
    uploadUserImage
);

export default router;
