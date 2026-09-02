import { prisma } from '../../../shared/database/prisma';
import { RegisterDto } from '../dto/auth.types';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async create(dto: RegisterDto) {
    return prisma.user.create({
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
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateRole(userId: string, role: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findAll() {
    return prisma.user.findMany({
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
    return prisma.user.count();
  }
}

export const authRepository = new AuthRepository();
