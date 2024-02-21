import { errorMiddleWareFactory } from '@middlewares/errorMiddleWare';
import { Router } from 'express';
import { waitingListController } from './controller';

const waitingListRouter = Router();

waitingListRouter.post('/subscribe', waitingListController.subscribe);

waitingListRouter.route('/video').get(waitingListController.getVideoInfos);

waitingListRouter.use(errorMiddleWareFactory({ endpoint: 'waiting-list' }));

export { waitingListRouter };
