import { Router } from 'express';
import itemRouter from '../modules/item/item.route.js';
import authRouter from '../modules/auth/auth.route.js';

const router = Router();

router.use('/items', itemRouter);
router.use('/auth', authRouter);

export default router;
