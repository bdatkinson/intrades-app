import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  deviceInfo: {
    userAgent: String,
    ip: String,
    deviceId: String,
    platform: String
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isRevoked: {
    type: Boolean,
    default: false,
    index: true
  },
  revokedAt: {
    type: Date
  },
  revokedReason: {
    type: String,
    enum: ['logout', 'password_change', 'security', 'expired', 'manual']
  },
  lastUsed: {
    type: Date
  },
  useCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
RefreshTokenSchema.index({ userId: 1, isRevoked: 1 });
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ expiresAt: 1 });

// Auto-delete expired tokens after 30 days
RefreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

// Instance method to check if token is valid
RefreshTokenSchema.methods.isValid = function() {
  return !this.isRevoked && this.expiresAt > new Date();
};

// Instance method to revoke token
RefreshTokenSchema.methods.revoke = async function(reason = 'manual') {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedReason = reason;
  return this.save();
};

// Static method to revoke all tokens for a user
RefreshTokenSchema.statics.revokeAllForUser = async function(userId, reason = 'manual') {
  return this.updateMany(
    { userId, isRevoked: false },
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason
    }
  );
};

// Static method to clean up expired tokens
RefreshTokenSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result.deletedCount;
};

// Static method to get active tokens for user
RefreshTokenSchema.statics.getActiveTokensForUser = async function(userId) {
  return this.find({
    userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
};

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
