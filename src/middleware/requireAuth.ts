import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UserRepository } from '../modules/user/user.repository.js';
import { AppError } from '../errors/AppError.js';

interface JwtPayload {
  id: number;
  email: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new AppError('Unauthorized: Authentication token required', 401));
      return;
    }

    const token = authHeader.split(' ')[1];
    
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
    } catch (jwtErr) {
      next(new AppError('Unauthorized: Invalid or expired token', 401));
      return;
    }

    // Ensure user still exists in DB
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      next(new AppError('Unauthorized: User account no longer exists', 401));
      return;
    }

    // Attach active user session fields
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
