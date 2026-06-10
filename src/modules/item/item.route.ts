import { Router } from 'express';
import { ItemController } from './item.controller.js';
import { upload } from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { createItemSchema } from './item.validation.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = Router();

router.post(
  '/',
  upload.single('image'),
  validate(createItemSchema),
  catchAsync(ItemController.createItem)
);

router.get('/', catchAsync(ItemController.getItems));

export default router;
