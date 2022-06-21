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
    getUserOrders,
    updateProductComment,
    createProductComment,
    addToWishList,
    readWishList,
    deleteWish,
    deleteUser,
} from '../controllers/user.controller';
import validateImg from '../middlewares/validate.img';
import validateFields from '../middlewares/validate.fields';

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
        validateFields,
    ],
    updateUserPassword
);

router.put(
    '/upload/img/:userId',
    [validateJwt, validateFile, validateImg],
    uploadUserImage
);

router.get('/orders/:userId', [validateJwt], getUserOrders);

router.put(
    '/comment/:commentId',
    [
        validateJwt,
        check('calificacion', 'A rate is required.').not().isEmpty(),
        check(
            'comentario',
            'The comment must be less than 300 characters.'
        ).isLength({ max: 300 }),
        check(
            'comentario',
            'Special characters such as ~!@#$%^&*(){}[]?/ are not allowed.'
        ).matches(/^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ' ]*$/),
        validateFields,
    ],
    updateProductComment
);

router.post(
    '/comment/new',
    [
        validateJwt,
        check(
            'comentario',
            'The comment must be less than 300 characters.'
        ).isLength({ max: 300 }),
        check(
            'comentario',
            'Special characters such as ~!@#$%^&*(){}[]?/ are not allowed.'
        ).matches(/^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ' ]*$/),
        validateFields,
    ],
    createProductComment
);

router.post(
    '/wish/new',
    [
        validateJwt,
        check('idProducto', 'A product id is required.').not().isEmpty(),
        check('idUsuario', 'An user id is required.').not().isEmpty(),
        validateFields,
    ],
    addToWishList
);

router.delete('/wish/:wishId', [validateJwt, validateFields], deleteWish);

router.get('/wish/:userId', readWishList);

router.delete(
    '/:userId',
    [
        validateJwt,
        check('modo', 'An auth modo is required.').not().isEmpty(),
        validateFields,
    ],
    deleteUser
);

export default router;
