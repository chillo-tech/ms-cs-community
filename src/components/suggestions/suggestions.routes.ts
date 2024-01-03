import { Router } from 'express';
import validate from '@middlewares/requestValidation';
import suggestionsZodSchema from '@components/suggestions/suggestions.zod';
import { authToken } from '@middlewares/jwt';
import suggestionsController from '@components/suggestions/suggestions.controller';

const router = Router();

router.use(authToken);

// create new suggestion
router
  .route('/')
  .post(
    validate(suggestionsZodSchema.createSuggestionsSchema),
    suggestionsController.makeSuggestion
  );

export default router;
