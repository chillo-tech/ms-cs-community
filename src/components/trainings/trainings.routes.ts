import validate from '@middlewares/requestValidation';
import { Router } from 'express';
import TrainingZodSchema from './trainings.zod';
import { trainingController } from './trainings.controller';

const trainingsRouter = Router();

trainingsRouter.post(
  '/:id',
  validate(TrainingZodSchema.createtrainingSchema),
  trainingController.create
);

export { trainingsRouter };
