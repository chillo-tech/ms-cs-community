import { Router } from 'express';
import { frontendDataController } from './frontend-data.controllers';

const frontendDataRouter = Router();

frontendDataRouter.get('/avis', frontendDataController.getAvis);
frontendDataRouter.get('/suggestions', frontendDataController.getSuggestions);

export { frontendDataRouter };
