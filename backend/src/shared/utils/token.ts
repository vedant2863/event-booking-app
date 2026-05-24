import * as jwt from 'jsonwebtoken';

import { AuthTokens } from '../../modules/auth/dto/auth.types';
import { config } from '../config/env';
import { UnauthorizedError } from '../errors/AppError';
import { AuthPayload } from '../types';

export function tokenVerify(token: string, secret: jwt.Secret): AuthPayload {
  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}

export function generateTokens(payload: AuthPayload): AuthTokens {
  const secret: jwt.Secret = config.jwt.secret;
  const refreshSecret: jwt.Secret = config.jwt.refreshSecret;
  const accessOptions: jwt.SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  };
  const refreshOptions: jwt.SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  };

  const accessToken = jwt.sign(payload, secret, accessOptions);
  const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
}
