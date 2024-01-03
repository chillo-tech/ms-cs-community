import { Router } from 'express';
import validate from '@middlewares/requestValidation';
import { authToken } from '@middlewares/jwt';
import newslettersZodSchema from './newsletters.zod';
import newslettersController from './newsletters.controller';

const router = Router();

router.use(authToken);

// create new suggestion
router
  .route('/register')
  .post(
    validate(newslettersZodSchema.createNewslettersUserSchema),
    newslettersController.registerNewUser
  );

router
  .route('/unsubscribe')
  .get(
    validate(newslettersZodSchema.deleteNewslettersUserSchema),
    newslettersController.unsubscribe
  );

export default router;
