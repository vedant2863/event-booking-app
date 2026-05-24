import { IUser, User } from '../../../shared/models/user.model';
import { RegisterDto } from '../dto/auth.types';

import { BaseRepository } from './BaseRepository';

export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, includeSensitiveFields = false): Promise<IUser | null> {
    const query = this.model.findOne({ email });
    if (includeSensitiveFields) {
      return query.select('+password +refreshToken').exec();
    }
    return query.exec();
  }

  async findById(userId: string, includeSensitiveFields = false): Promise<IUser | null> {
    const query = this.model.findById(userId);
    if (includeSensitiveFields) {
      return query.select('+refreshToken').exec();
    }
    return query.exec();
  }

  async create(dto: RegisterDto): Promise<IUser> {
    return super.create(dto as Partial<IUser>);
  }

  async updateRefreshToken(userId: string, refreshToken?: string): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, { refreshToken }, { new: true }).exec();
  }
}

export const authRepository = new AuthRepository();
