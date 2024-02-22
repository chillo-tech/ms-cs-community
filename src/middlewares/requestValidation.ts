import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ErrorMessageOptions, generateErrorMessage } from 'zod-error';

const options: ErrorMessageOptions = {
  maxErrors: 5,
  delimiter: {
    component: ' - ',
  },
  path: {
    enabled: true,
    type: 'breadcrumbs',
    label: 'Path: ',
  },
  code: {
    enabled: false,
  },
  message: {
    enabled: true,
    label: '',
  },
  
};

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const err = error as ZodError;
      return res.status(400).json({
        message: 'something went wront on validation',
        description: generateErrorMessage(err.issues, options),
      });
    }
  };
export default validate;
