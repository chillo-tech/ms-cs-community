import { Router } from 'express';
import validate from '../../middlewares/requestValidation';
import suggestZodSchema from './suggestions.zod';
import { authToken } from '../../middlewares/jwt';
import suggestController from './suggestions.controller';

const router = Router();

router.use(authToken);

// create new suggestion
router
  .route('/')
  .post(
    validate(suggestZodSchema.createSuggestSchema),
    suggestController.makeSuggestion
  );

export default router;
