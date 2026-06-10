import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { UserRole } from '../modules/user/user.entity.js';

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user || !roles.includes(user.role)) {
      next(new AppError('Forbidden: You do not have permission to perform this action', 403));
      return;
    }
    
    next();
  };
};
