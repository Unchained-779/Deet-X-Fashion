import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { RegisterInput, LoginInput } from './auth.schema';

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw AppError.conflict('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone || null,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);
    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(id: string, email: string, role: string): string {
    return jwt.sign({ id, email, role }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }
}

export const authService = new AuthService();
