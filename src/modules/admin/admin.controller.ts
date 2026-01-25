import type { RequestHandler } from 'express';
import { UserModel } from '../users/user.model.js';
import { ClientStatus, UserRole } from '../users/user.types.js';

export const approveClient: RequestHandler = async (req, res) => {
  const { clientId } = req.params;

  const user = await UserModel.findById(clientId);
  if (!user) return res.status(404).json({ message: 'Client not found' });
  if (user.role !== UserRole.CLIENT) return res.status(400).json({ message: 'User is not a client' });

  user.clientStatus = ClientStatus.APPROVED;
  await user.save();

  return res.status(200).json({
    message: 'Client approved',
    client: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      clientStatus: user.clientStatus
    }
  });
};

export const rejectClient: RequestHandler = async (req, res) => {
  const { clientId } = req.params;

  const user = await UserModel.findById(clientId);
  if (!user) return res.status(404).json({ message: 'Client not found' });
  if (user.role !== UserRole.CLIENT) return res.status(400).json({ message: 'User is not a client' });

  user.clientStatus = ClientStatus.REJECTED;
  await user.save();

  return res.status(200).json({
    message: 'Client rejected',
    client: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      clientStatus: user.clientStatus
    }
  });
};

export const listUsers: RequestHandler = async (req, res) => {
  const { role, status, email, page = 1, limit = 20 } = req.query;

  const query: any = {};
  if (role) query.role = role;
  if (status) query.clientStatus = status;
  if (email) query.email = { $regex: email, $options: 'i' };

  const users = await UserModel.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-password');

  const total = await UserModel.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    total,
    data: { users }
  });
};
