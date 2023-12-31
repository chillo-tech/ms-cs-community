import { Router } from 'express';
import validate from '../../middlewares/requestValidation';
import suggestionsZodSchema from './suggestions.zod';
import { authToken } from '../../middlewares/jwt';
import suggestionsController from './suggestions.controller';

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
