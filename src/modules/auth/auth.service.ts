import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository.js';
import { User } from '../user/user.entity.js';
import { config } from '../../config/index.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { UserResponse } from '../user/user.types.js';

export class AuthService {
  private static generateToken(userId: number, email: string): string {
    return jwt.sign(
      { id: userId, email },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );
  }

  private static formatUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async register(name: string, email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    // Hash the password using configuration-defined salt rounds
    const hashedPassword = await bcrypt.hash(password, config.auth.saltRounds);

    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser.id, newUser.email);

    return {
      user: this.formatUserResponse(newUser),
      token,
    };
  }

  static async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  static async getUserById(id: number): Promise<UserResponse> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return this.formatUserResponse(user);
  }
}
