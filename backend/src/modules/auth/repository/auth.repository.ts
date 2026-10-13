import { db } from '../../../shared/database/prisma';
import { RegisterDto } from '../types/auth.types';

export class AuthRepository {
  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
    });
  }

  async create(dto: RegisterDto) {
    return db.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: dto.password,
        role: dto.role || 'user',
        isVerified: true,
      },
    });
  }

  async updateRefreshToken(userId: string, refreshToken?: string | null) {
    return db.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateRole(userId: string, role: string) {
    return db.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findAll() {
    return db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async count() {
    return db.user.count();
  }
}

export const authRepository = new AuthRepository();
