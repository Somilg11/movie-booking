import type { RequestHandler } from 'express';
import { verifyAccessToken } from './auth.service.js';
import { UserModel } from '../users/user.model.js';
import { UserRole, ClientStatus } from '../users/user.types.js';

export type AuthUser = {
  id: string;
  role: UserRole;
  clientStatus?: ClientStatus;
};

declare global {
  // eslint-disable-next-line no-var
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

function getBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.trim().split(/\s+/);
  const type = parts[0];
  const token = parts[1];
  if (type?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = getBearerToken(req.header('authorization'));
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });

    const claims = verifyAccessToken(token);

    const user = await UserModel.findById(claims.sub).select('role clientStatus').lean();
    if (!user) return res.status(401).json({ message: 'Unauthenticated' });

    const authUser: AuthUser = {
      id: String(claims.sub),
      role: user.role as UserRole
    };

    if (user.clientStatus) {
      authUser.clientStatus = user.clientStatus as ClientStatus;
    }

    req.auth = authUser;

    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ message: 'Unauthenticated' });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ message: 'Unauthorized' });
    return next();
  };
}

export const requireApprovedClient: RequestHandler = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthenticated' });
  if (req.auth.role !== UserRole.CLIENT) return res.status(403).json({ message: 'Unauthorized' });
  if (req.auth.clientStatus !== ClientStatus.APPROVED) {
    return res.status(403).json({ message: 'Client not approved' });
  }
  return next();
};

export const authorize = (roles: UserRole[]) => requireRole(...roles);
