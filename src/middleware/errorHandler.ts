import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { BadRequestError } from '../errors/BadRequestError.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} failed:`, err);

  if (err instanceof BadRequestError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Treat generic validation errors if they bubble up
  if (err.name === 'ValidationError') {
    sendError(res, err.message, 400);
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction ? 'Internal Server Error' : err.message;
  
  sendError(res, responseMessage, 500);
};
