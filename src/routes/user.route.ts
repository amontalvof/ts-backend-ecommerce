/*
 * User Routes
 * host + /api/user
 */

import { Router } from 'express';
const { readUser, updateUser } = require('../controllers/user.controller');

const router = Router();

router.post('/', readUser);

router.put('/:userId', updateUser);

export default router;
