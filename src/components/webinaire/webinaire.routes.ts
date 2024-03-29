import validate from '@middlewares/requestValidation';
import { Router } from 'express';
import webinaireZodSchema from './webinaire.zod';
import { webinaireController } from './webinaire.controller';

const webinaireRouter = Router();

webinaireRouter.post(
  '/:webinaire_id/planning/:planning_id',
  validate(webinaireZodSchema.createWebinaireSchema),
  webinaireController.create
);

export { webinaireRouter };
