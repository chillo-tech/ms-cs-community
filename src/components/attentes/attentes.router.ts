import { Router } from 'express';
import { attentesController } from './attentes.controller';
import { authToken } from '@middlewares/jwt';
import validate from '@middlewares/requestValidation';
import attenteZodSchema from './attentes.zod';

const attentesRouter = Router();

attentesRouter.use(authToken);

attentesRouter
  .route('/')
  .post(
    validate(attenteZodSchema.createAttenteSchema),
    attentesController.create
  );

export { attentesRouter };
