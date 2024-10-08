import { Router } from 'express';
import { avisController } from './avis.controller';
import validate from '@middlewares/requestValidation';
import avisZodSchema from './avis.zod';
import { authToken } from '@middlewares/jwt';

const router = Router();
router.use(authToken);

router
  .route('/')
  .post(validate(avisZodSchema.createAvisSchema), avisController.create);

  
router
  .route('/trainings')
  .get(validate(avisZodSchema.getAvisViewSchema), avisController.searchAvisFormation);

export { router };
