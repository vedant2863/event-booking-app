import { AdminRepository } from '../repository/admin.repository';

export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getStats(): Promise<Awaited<ReturnType<AdminRepository['getDashboardStats']>>> {
    return this.adminRepository.getDashboardStats();
  }

  async getUsers(
    page: number,
    limit: number
  ): Promise<Awaited<ReturnType<AdminRepository['findUsers']>>> {
    return this.adminRepository.findUsers(page, limit);
  }

  async updateUserRole(
    userId: string,
    role: string
  ): Promise<Awaited<ReturnType<AdminRepository['updateUserRole']>>> {
    return this.adminRepository.updateUserRole(userId, role);
  }

  async getEvents(): Promise<Awaited<ReturnType<AdminRepository['findEvents']>>> {
    return this.adminRepository.findEvents();
  }

  async getBookings(
    page: number,
    limit: number
  ): Promise<Awaited<ReturnType<AdminRepository['findBookings']>>> {
    return this.adminRepository.findBookings(page, limit);
  }
}
