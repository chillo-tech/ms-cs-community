import { staticErrorManagement } from './ErrorManagement';

type TCommonType = keyof typeof staticErrorManagement.CommonErrors;
type TObject = {
  [key: string]: string;
};

class AppError extends Error {
  public readonly commonType: TCommonType;
  public readonly isOperational: boolean;
  public readonly context?: TObject;
  constructor(
    commonType: TCommonType,
    description: string,
    isOperational: boolean,
    context?: TObject
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.commonType = commonType;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this);
  }
}

export { AppError };
