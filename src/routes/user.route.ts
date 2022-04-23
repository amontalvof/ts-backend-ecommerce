/*
 * User Routes
 * host + /api/user
 */

import { Router } from 'express';
import { uploadUserImage } from '../controllers/user.controller';
import validateFile from '../middlewares/validate.file';
import validateJwt from '../middlewares/validate.jwt';
const { readUser, updateUser } = require('../controllers/user.controller');

const router = Router();

router.post('/', readUser);

router.put('/:userId', updateUser);

router.put('/upload/img/:userId', [validateJwt, validateFile], uploadUserImage);

export default router;
