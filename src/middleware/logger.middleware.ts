import { Request, Response, NextFunction } from 'express';

export type CustomError = {
  status: number;
  message: string;
};

const loggerMdw = (err: CustomError, req: Request, res: Response, next: NextFunction) => {

  const isProduction = process.env.NODE_ENV === 'production';

  const currentDate = new Date().toLocaleString();
  let status = 500;
  let message = 'Internal server error';
  let devMessage = 'Internal server error';

  if (err.status && err.message) {
    status = err.status;
    message = err.message;
  }

  if (!isProduction) {
    devMessage = err.message;
  }

  console.log(`[${currentDate}] Status: ${status}. ${devMessage}`);
  res.status(status).send(message);
};

export default loggerMdw;