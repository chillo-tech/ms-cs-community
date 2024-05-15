import validate from '@middlewares/requestValidation';
import { Router } from 'express';
import contactUsZodSchema from './contact-us.zod';
import { contactUsController } from './contact-us.controller';

const router = Router();

router.post(
  '/',
  validate(contactUsZodSchema.createContactUsSchema),
  contactUsController.handle
);

export { router };
