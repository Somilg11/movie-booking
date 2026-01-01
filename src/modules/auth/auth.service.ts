import jwt, { type JwtPayload, type Secret, type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import { getEnv } from '../../config/env.js';
import { randomId } from '../../common/utils/random.js';

export type AccessTokenClaims = {
  sub: string; // user id
  role: string;
};

export type RefreshTokenClaims = {
  sub: string; // user id
  jti: string; // session id
};

const env = getEnv();

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

function baseOptions(): SignOptions {
  return {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE
  };
}

function verifyOptions(): VerifyOptions {
  return {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE
  };
}

export function signAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, accessSecret, {
    ...baseOptions(),
    // jsonwebtoken v9 types are stricter; runtime supports string durations (e.g. "15m")
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any
  });
}

export function signRefreshToken(claims: Omit<RefreshTokenClaims, 'jti'> & { jti?: string }): {
  refreshToken: string;
  jti: string;
} {
  const jti = claims.jti ?? randomId(16);
  const payload: RefreshTokenClaims = {
    sub: claims.sub,
    jti
  };

  const refreshToken = jwt.sign(payload, refreshSecret, {
    ...baseOptions(),
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any
  });

  return { refreshToken, jti };
}

export function verifyAccessToken(token: string): JwtPayload & AccessTokenClaims {
  const decoded = jwt.verify(token, accessSecret, verifyOptions());
  if (typeof decoded === 'string') throw new Error('Invalid access token');
  return decoded as unknown as JwtPayload & AccessTokenClaims;
}

export function verifyRefreshToken(token: string): JwtPayload & RefreshTokenClaims {
  const decoded = jwt.verify(token, refreshSecret, verifyOptions());
  if (typeof decoded === 'string') throw new Error('Invalid refresh token');
  return decoded as unknown as JwtPayload & RefreshTokenClaims;
}
