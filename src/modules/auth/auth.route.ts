import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = Router();

router.post('/register', validate(registerSchema), catchAsync(AuthController.register));
router.post('/login', validate(loginSchema), catchAsync(AuthController.login));
router.get('/me', requireAuth, catchAsync(AuthController.me));

export default router;
