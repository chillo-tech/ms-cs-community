import { Router } from 'express';
import { getAvisAndSuggestions } from './frontend-data.controllers';

const frontendDataRouter = Router();

frontendDataRouter.get('/avis-suggestions', getAvisAndSuggestions);

export { frontendDataRouter };
