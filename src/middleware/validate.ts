import { Request, Response, NextFunction } from 'express';
import { AnyObjectSchema, ValidationError } from 'yup';
import { BadRequestError } from '../errors/BadRequestError.js';

export const validate = (schema: AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      }, { abortEarly: false, stripUnknown: true });

      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const formattedErrors = error.inner.map((err) => ({
          field: err.path?.replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        next(new BadRequestError('Validation failed', formattedErrors));
        return;
      }
      next(error);
    }
  };
};
