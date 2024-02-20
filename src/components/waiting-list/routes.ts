import { Request, Response, NextFunction, Router } from 'express';
import { waitingListController } from './controller';

const waitingListRouter = Router();

waitingListRouter.post('/subscribe', waitingListController.subscribe);

// waitingListRouter.get('/unsubscribe', waitingListController.unsubscribe);

waitingListRouter.route('/video').get(waitingListController.getVideoInfos);

waitingListRouter.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('err', err);
    const count = {
      req: !res,
      res: !req,
      next: !next,
    };
    res.status(500).json({ msg: 'Something went wrong ', count });
  }
);

export { waitingListRouter };
