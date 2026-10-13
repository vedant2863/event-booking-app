export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}
