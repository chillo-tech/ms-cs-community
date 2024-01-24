import { Router } from 'express';
import { backofficeController as backofficeController } from './backoffice.controllers';

const backofficeRouter = Router();

backofficeRouter.get('/avis', backofficeController.getAvis);
backofficeRouter.get('/suggestions', backofficeController.getSuggestions);

export { backofficeRouter };
