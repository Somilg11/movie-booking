import mongoose, { type InferSchemaType } from 'mongoose';
import { ClientStatus, UserRole } from './user.types.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.CUSTOMER,
      index: true
    },

    // Only relevant for CLIENT accounts
    clientStatus: {
      type: String,
      enum: Object.values(ClientStatus),
      default: ClientStatus.PENDING,
      index: true
    },

    ownerName: { type: String },
    companyName: { type: String },
    phone: { type: String }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const UserModel = mongoose.model('User', userSchema);
