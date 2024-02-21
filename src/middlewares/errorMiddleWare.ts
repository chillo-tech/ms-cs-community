import { AppError } from '@utils/Errors/AppError';
import { staticErrorManagement } from '@utils/Errors/ErrorManagement';
import { ERROR_HTTP_STATUS } from '@utils/Errors/httpErrorStatus';
import { NextFunction, Request, Response } from 'express';

const errorMiddleWareFactory = (context: { endpoint: string }) => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('address :', req.socket.remoteAddress);
    console.log('endpoint :', context.endpoint);
    if (err instanceof AppError) {
      console.log('user error', err.stack);
      switch (err.commonType) {
        case 'badRequest':
        case 'invalidInput':
          return res.status(ERROR_HTTP_STATUS.BAD_REQUEST).json({
            msg: `${err.commonType} ${
              err.message
            } : ${staticErrorManagement.CommonErrors.badRequest()}`,
          });

        case 'notFound':
          return res.status(ERROR_HTTP_STATUS.NOT_FOUND).json({
            msg: `${err.commonType} ${
              err.message
            } : ${staticErrorManagement.CommonErrors.notFound(
              err.context?.ressource
            )}`,
          });

        case 'unauthorized':
          return res.status(ERROR_HTTP_STATUS.UNAUTHORIZED).json({
            msg: `${err.commonType} ${
              err.message
            } : ${staticErrorManagement.CommonErrors.unauthorized(
              err.context?.ressource || context.endpoint
            )}`,
          });

        case 'forbidden':
          return res.status(ERROR_HTTP_STATUS.FORBIDDEN).json({
            msg: `${err.commonType} ${
              err.message
            } : ${staticErrorManagement.CommonErrors.forbidden()}`,
          });

        case 'conflict':
          return res.status(ERROR_HTTP_STATUS.CONFLICT).json({
            msg: `${err.commonType} ${
              err.message
            } : ${staticErrorManagement.CommonErrors.conflict()}`,
          });
        default:
          next(err);
      }
    } else {
      console.log('server error: ', err);
      return res.status(ERROR_HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        msg: 'Erreur interne du serveur',
      });
    }
  };
};

export { errorMiddleWareFactory };
