import { Router } from 'express';
import { inscriptionController } from './formations.controller';

const inscriptionRouter = Router();

inscriptionRouter.route('/notify').post(inscriptionController.notifyAll);
inscriptionRouter.route('/inscription').post(inscriptionController.inscrire);

export { inscriptionRouter as formationRouter };

