import { errorMiddleWareFactory } from '@middlewares/errorMiddleWare';
import { Router } from 'express';
import { waitingListController } from './controller';
import validate from '@middlewares/requestValidation';
import waitingListZodSchema from './zod';

const waitingListRouter = Router();

waitingListRouter.post(
  '/subscribe',
  validate(waitingListZodSchema.subscribetoWaitingList),
  waitingListController.subscribe
);

waitingListRouter
  .route('/video')
  .get(
    validate(waitingListZodSchema.getVideoSchema),
    waitingListController.getVideoInfos
  );

waitingListRouter.use(errorMiddleWareFactory({ endpoint: 'waiting-list' }));

export { waitingListRouter };
