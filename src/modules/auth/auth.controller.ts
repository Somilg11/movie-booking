import type { RequestHandler } from 'express';
import { ZodError } from 'zod';
import { getEnv } from '../../config/env.js';
import { sha256 } from '../../common/utils/hash.js';
import { hashPassword, verifyPassword } from '../../common/utils/password.js';
import { UserModel } from '../users/user.model.js';
import { ClientStatus, UserRole } from '../users/user.types.js';
import { AuthTokenModel } from './auth.model.js';
import { clientSignupSchema, customerSignupSchema, loginSchema } from './auth.schema.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './auth.service.js';

const env = getEnv();

function msFromJwtExpiresIn(expiresIn: string): number {
  // Very small helper for common formats we use.
  // Supports "15m", "7d", "3600" (seconds) as basic cases.
  const m = expiresIn.match(/^(\d+)([smhd])?$/);
  if (!m) return 30 * 24 * 60 * 60 * 1000;
  const value = Number(m[1]);
  const unit = m[2] ?? 's';
  const mult = unit === 's' ? 1000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return value * mult;
}

function publicUser(u: any) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    clientStatus: u.clientStatus
  };
}

export const signupCustomer: RequestHandler = async (req, res, next) => {
  try {
    const input = customerSignupSchema.parse(req.body);

    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await hashPassword(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.CUSTOMER
    });

    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
};

export const signupClient: RequestHandler = async (req, res, next) => {
  try {
    const input = clientSignupSchema.parse(req.body);

    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await hashPassword(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = await UserModel.create({
      name: input.companyName,
      email: input.email,
      passwordHash,
      role: UserRole.CLIENT,
      clientStatus: ClientStatus.PENDING,
      ownerName: input.ownerName,
      companyName: input.companyName,
      phone: input.phone
    });

    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email: input.email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ sub: String(user._id), role: user.role });

    // Session-based refresh token (stored hashed)
    const { refreshToken, jti } = signRefreshToken({ sub: String(user._id) });
    const tokenHash = sha256(refreshToken);

    const refreshTtlMs = msFromJwtExpiresIn(env.JWT_REFRESH_EXPIRES_IN);

    await AuthTokenModel.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + refreshTtlMs)
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: publicUser(user)
    });
  } catch (err) {
    return next(err);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = String(req.body?.refreshToken ?? '');
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });

    // Verify signature + issuer/audience
    const claims = verifyRefreshToken(refreshToken);

    // Check session exists and not revoked
    const tokenHash = sha256(refreshToken);
    const session = await AuthTokenModel.findOne({
      userId: claims.sub,
      tokenHash,
      revokedAt: { $exists: false }
    });

    if (!session) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await UserModel.findById(claims.sub);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = signAccessToken({ sub: String(user._id), role: user.role });

    // Rotate refresh token (industry best practice)
    session.revokedAt = new Date();
    await session.save();

    const { refreshToken: newRefreshToken } = signRefreshToken({ sub: String(user._id) });
    const newHash = sha256(newRefreshToken);
    const refreshTtlMs = msFromJwtExpiresIn(env.JWT_REFRESH_EXPIRES_IN);

    await AuthTokenModel.create({
      userId: user._id,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + refreshTtlMs)
    });

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    // Convert JWT errors to 401
    if (err instanceof ZodError) return next(err);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = String(req.body?.refreshToken ?? '');
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });

    const tokenHash = sha256(refreshToken);
    await AuthTokenModel.updateOne(
      { tokenHash, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } }
    );

    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
};

export const me: RequestHandler = async (req, res) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthenticated' });

  const user = await UserModel.findById(req.auth.id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({ user: publicUser(user) });
};
