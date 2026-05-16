import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/env';
import { User } from '../users/user.model';
import { AuthPayload, UserRole } from '../../shared/types';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../shared/errors/AppError';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private generateTokens(payload: AuthPayload): AuthTokens {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await User.findOne({ email: dto.email });
    if (existing) throw new ConflictError('Email already registered');

    const user = await User.create(dto);
    const payload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = this.generateTokens(payload);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  async login(dto: LoginDto) {
    const user = await User.findOne({ email: dto.email }).select('+password +refreshToken');
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const payload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = this.generateTokens(payload);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  async refresh(token: string): Promise<AuthTokens> {
    let payload: AuthPayload;
    try {
      payload = jwt.verify(token, config.jwt.refreshSecret) as AuthPayload;
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) throw new UnauthorizedError('Token revoked');

    const newPayload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = this.generateTokens(newPayload);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }
}

export const authService = new AuthService();
