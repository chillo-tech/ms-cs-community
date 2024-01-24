import { Router } from 'express';
import validate from '@middlewares/requestValidation';
import { authToken } from '@middlewares/jwt';
import suggestionsZodSchema from './suggestions.zod';
import suggestionsController from './suggestions.controller';

const router = Router();

router.use(authToken);

router
  .route('/')
  .post(
    validate(suggestionsZodSchema.createSuggestionsSchema),
    suggestionsController.makeSuggestion
  );

export default router;
