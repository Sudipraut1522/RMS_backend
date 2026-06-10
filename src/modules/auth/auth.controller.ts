import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AuthController {
  static register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const data = await AuthService.register(name, email, password);
    sendSuccess(res, data, 201, 'User registered successfully');
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    sendSuccess(res, data, 200, 'User logged in successfully');
  };

  static me = async (req: Request, res: Response): Promise<void> => {
    // req.user is set by authentication interceptor middleware
    const userId = (req as any).user.id;
    const user = await AuthService.getUserById(userId);
    sendSuccess(res, user, 200, 'Current user profile retrieved');
  };
}
