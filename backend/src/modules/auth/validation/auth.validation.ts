import { z } from 'zod';

import { UserRole } from '../../../shared/types';

const registerSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([UserRole.USER, UserRole.ORGANIZER]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export { registerSchema, loginSchema };
