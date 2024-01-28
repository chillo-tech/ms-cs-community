import { Router } from 'express';
import { inscriptionController } from './formations.controller';

const inscriptionRouter = Router();

inscriptionRouter.route('/notify').post(inscriptionController.notifyAll);

export { inscriptionRouter as formationRouter };

