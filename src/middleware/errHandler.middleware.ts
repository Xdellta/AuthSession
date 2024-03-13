import { Request, Response, NextFunction } from 'express';

export interface ExtendedError extends Error {
  status?: number;
}

const isProduction = process.env.NODE_ENV === 'production';

const errHandler = (err: ExtendedError, req: Request, res: Response, next: NextFunction) => {

  let status = 500;
  let message, devMessage = 'Internal server error';

  if (err.status && err.message) {
    status = err.status;
    message = err.message;
  }

  if (!isProduction && err.message) {
    devMessage = err.message;
  }

  console.error(`[${status}] ${devMessage}`);
  res.status(status).send(message);
};

export default errHandler;