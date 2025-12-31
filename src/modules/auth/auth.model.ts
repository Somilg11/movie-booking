import mongoose, { type InferSchemaType } from 'mongoose';

/**
 * AuthTokenModel
 *
 * Optional but production-friendly:
 * - Store refresh tokens / sessions
 * - Enable logout (revoke token) and multi-device sessions
 *
 * If you only use stateless short-lived JWT access tokens, you may omit this.
 */

const authTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // Hash this (recommended) if you store raw refresh tokens
    tokenHash: { type: String, required: true, index: true },

    // Helps identify device/session
    userAgent: { type: String },
    ip: { type: String },

    revokedAt: { type: Date },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

// Auto-delete expired sessions
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AuthTokenDoc = InferSchemaType<typeof authTokenSchema> & { _id: mongoose.Types.ObjectId };

export const AuthTokenModel = mongoose.model('AuthToken', authTokenSchema);
