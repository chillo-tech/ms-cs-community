import { Router } from 'express';
import { inscriptionController } from './inscription.controller';

const inscriptionRouter = Router();

inscriptionRouter.route('/notify').post(inscriptionController.notifyAll);

export { inscriptionRouter };

