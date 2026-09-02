import bcrypt from 'bcryptjs';

import { config } from '../../../shared/config/env';
import { ConflictError, UnauthorizedError } from '../../../shared/errors/AppError';
import { AuthPayload, UserRole } from '../../../shared/types';
import { generateTokens, tokenVerify } from '../../../shared/utils/token';
import { AuthTokens, LoginDto, RegisterDto } from '../dto/auth.types';
import { AuthRepository } from '../repository/auth.repository';

export interface UserResponse {
  _id: string;
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  private sanitizeUser(user: {
    id: string;
    username: string;
    email: string;
    role: string;
    profileImage: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    return {
      _id: user.id,
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(dto: RegisterDto): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.authRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const tokens = generateTokens(payload);
    await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const tokens = generateTokens(payload);
    await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async me(userId: string): Promise<UserResponse | null> {
    const user = await this.authRepository.findById(userId);
    if (!user) return null;
    return this.sanitizeUser(user);
  }

  async refresh(token: string): Promise<AuthTokens> {
    let payload: AuthPayload;
    try {
      payload = tokenVerify(token, config.jwt.refreshSecret);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await this.authRepository.findById(payload.userId);
    if (!user || user.refreshToken !== token) throw new UnauthorizedError('Token revoked');

    const newPayload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const tokens = generateTokens(newPayload);
    await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.updateRefreshToken(userId, null);
  }
}
