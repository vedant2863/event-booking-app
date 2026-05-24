import { config } from '../../../shared/config/env';
import { ConflictError, UnauthorizedError } from '../../../shared/errors/AppError';
import type { IUser } from '../../../shared/models/user.model';
import { AuthPayload } from '../../../shared/types';
import { generateTokens, tokenVerify } from '../../../shared/utils/token';
import { AuthTokens, LoginDto, RegisterDto } from '../dto/auth.types';
import { AuthRepository } from '../repository/auth.repository';

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    const user = await this.authRepository.create(dto);
    const payload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(payload);
    await this.authRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await this.authRepository.findByEmail(dto.email, true);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const payload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(payload);
    await this.authRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user, tokens };
  }

  async me(userId: string): Promise<IUser | null> {
    return this.authRepository.findById(userId);
  }

  async refresh(token: string): Promise<AuthTokens> {
    let payload: AuthPayload;
    try {
      payload = tokenVerify(token, config.jwt.refreshSecret);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await this.authRepository.findById(payload.userId, true);
    if (!user || user.refreshToken !== token) throw new UnauthorizedError('Token revoked');

    const newPayload: AuthPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(newPayload);
    await this.authRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.updateRefreshToken(userId, undefined);
  }
}
