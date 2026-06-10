import { AppError } from './AppError.js';

export class BadRequestError extends AppError {
  public errors?: any[];

  constructor(message = 'Bad Request', errors?: any[]) {
    super(message, 400);
    this.errors = errors;
  }
}
