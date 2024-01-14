import { Router } from 'express';
import validate from '@middlewares/requestValidation';
import { authToken } from '@middlewares/jwt';
import newslettersZodSchema from './newsletters.zod';
import {add, unsubscribe} from './newsletters.controller';

const router = Router();

router.use(authToken);

// create new suggestion
router
  .route('/register')
  .post(
    validate(newslettersZodSchema.createNewslettersUserSchema),
    add
  );

router
  .route('/unsubscribe')
  .get(
    validate(newslettersZodSchema.deleteNewslettersUserSchema),
    unsubscribe
  );

export default router;
