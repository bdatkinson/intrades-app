import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = 10;

/**
 * Generate JWT access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.auth.local.email,
      username: user.auth.local.username,
      role: user.role,
      permissions: user.permissions
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = async(userId, deviceInfo = {}) => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(token, 10);

  const refreshToken = new RefreshToken({
    userId,
    token: hashedToken,
    deviceInfo,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  await refreshToken.save();

  return token; // Return unhashed token to send to client
};

/**
 * Register new user
 */
export const register = async(req, res) => {
  try {
    const {
      email,
      username,
      password,
      name,
      tradeSpecialty,
      phoneNumber,
      cohort
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { 'auth.local.email': email.toLowerCase() },
        { 'auth.local.username': username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email or username'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create new user
    const user = new User({
      auth: {
        local: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          password: hashedPassword
        }
      },
      profile: {
        name,
        phoneNumber,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      },
      tradeSpecialty,
      cohort: cohort || 'default',
      role: 'student', // Default role
      permissions: ['read_challenges', 'submit_challenges']
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id, {
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.auth.local.password;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      message: error.message
    });
  }
};

/**
 * Login user
 */
export const login = async(req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/username and password are required'
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { 'auth.local.email': emailOrUsername.toLowerCase() },
        { 'auth.local.username': emailOrUsername.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.auth.local.password);

    if (!isPasswordValid) {
      // Track failed login attempt
      user.auth.failedLoginAttempts = (user.auth.failedLoginAttempts || 0) + 1;
      user.auth.lastFailedLogin = new Date();

      // Lock account after 5 failed attempts
      if (user.auth.failedLoginAttempts >= 5) {
        user.auth.isLocked = true;
        user.auth.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }

      await user.save();

      return res.status(401).json({
        success: false,
        error: user.auth.isLocked
          ? 'Account locked due to multiple failed login attempts. Try again later.'
          : 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.auth.isLocked && user.auth.lockedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        error: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Reset failed login attempts
    user.auth.failedLoginAttempts = 0;
    user.auth.isLocked = false;
    user.auth.lockedUntil = null;
    user.auth.lastLogin = new Date();

    // Update login streak
    const lastLoginDate = user.stats.lastLoginDate;
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 24 * 60 * 60 * 1000);

    if (!lastLoginDate || lastLoginDate < yesterday) {
      user.stats.loginStreak = 1;
    } else if (lastLoginDate >= yesterday && lastLoginDate < today) {
      user.stats.loginStreak += 1;
      user.stats.longestLoginStreak = Math.max(
        user.stats.loginStreak,
        user.stats.longestLoginStreak || 0
      );
    }

    user.stats.lastLoginDate = new Date();
    user.stats.totalLogins = (user.stats.totalLogins || 0) + 1;

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id, {
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.auth.local.password;
    delete userResponse.__v;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
      message: error.message
    });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async(req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Find all refresh tokens for all users (we need to check hashed tokens)
    const allTokens = await RefreshToken.find({
      expiresAt: { $gt: new Date() },
      isRevoked: false
    });

    let validToken = null;

    // Find matching token
    for (const token of allTokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.token);
      if (isMatch) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    // Get user
    const user = await User.findById(validToken.userId);

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User account is not active'
      });
    }

    // Update token usage
    validToken.lastUsed = new Date();
    validToken.useCount += 1;
    await validToken.save();

    // Generate new access token
    const accessToken = generateAccessToken(user);

    // Optionally rotate refresh token for better security
    let newRefreshToken = refreshToken;

    if (process.env.ROTATE_REFRESH_TOKENS === 'true') {
      // Revoke old token
      validToken.isRevoked = true;
      validToken.revokedAt = new Date();
      await validToken.save();

      // Generate new refresh token
      newRefreshToken = await generateRefreshToken(user._id, {
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }

    res.json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token',
      message: error.message
    });
  }
};

/**
 * Logout user
 */
export const logout = async(req, res) => {
  try {
    const { refreshToken, logoutAll = false } = req.body;

    if (!refreshToken && !logoutAll) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required for logout'
      });
    }

    if (logoutAll) {
      // Revoke all refresh tokens for user
      await RefreshToken.updateMany(
        {
          userId: req.user.userId,
          isRevoked: false
        },
        {
          isRevoked: true,
          revokedAt: new Date()
        }
      );

      return res.json({
        success: true,
        message: 'Logged out from all devices'
      });
    }

    // Find and revoke specific refresh token
    const allTokens = await RefreshToken.find({
      userId: req.user.userId,
      isRevoked: false
    });

    for (const token of allTokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.token);
      if (isMatch) {
        token.isRevoked = true;
        token.revokedAt = new Date();
        await token.save();
        break;
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout',
      message: error.message
    });
  }
};

/**
 * Change password
 */
export const changePassword = async(req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password'
      });
    }

    // Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.auth.local.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password
    user.auth.local.password = hashedPassword;
    user.auth.passwordChangedAt = new Date();

    await user.save();

    // Optionally revoke all refresh tokens
    if (process.env.REVOKE_TOKENS_ON_PASSWORD_CHANGE === 'true') {
      await RefreshToken.updateMany(
        {
          userId,
          isRevoked: false
        },
        {
          isRevoked: true,
          revokedAt: new Date()
        }
      );
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async(req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await User.findOne({ 'auth.local.email': email.toLowerCase() });

    // Don't reveal if user exists or not
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save reset token to user
    user.auth.resetToken = hashedToken;
    user.auth.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // TODO: Send email with reset link
    // In production, send email instead of returning token
    if (process.env.NODE_ENV === 'production') {
      // await emailService.sendPasswordResetEmail(user.auth.local.email, resetToken);
      res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    } else {
      // Development only - return token for testing
      res.json({
        success: true,
        message: 'Password reset token generated',
        data: {
          resetToken, // Remove in production
          resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`
        }
      });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request',
      message: error.message
    });
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async(req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Reset token and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long'
      });
    }

    // Find users with non-expired reset tokens
    const users = await User.find({
      'auth.resetTokenExpires': { $gt: new Date() }
    });

    let validUser = null;

    // Check hashed tokens
    for (const user of users) {
      if (user.auth.resetToken) {
        const isMatch = await bcrypt.compare(token, user.auth.resetToken);
        if (isMatch) {
          validUser = user;
          break;
        }
      }
    }

    if (!validUser) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password and clear reset token
    validUser.auth.local.password = hashedPassword;
    validUser.auth.resetToken = undefined;
    validUser.auth.resetTokenExpires = undefined;
    validUser.auth.passwordChangedAt = new Date();

    await validUser.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: error.message
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async(req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-auth.local.password -__v')
      .populate('cohort', 'name startDate endDate')
      .populate('badges.badgeId', 'name icon rarity');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      message: error.message
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async(req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Fields that can be updated
    const allowedUpdates = [
      'profile.name',
      'profile.bio',
      'profile.phoneNumber',
      'profile.location',
      'profile.website',
      'profile.socialLinks',
      'preferences',
      'notifications'
    ];

    // Filter out non-allowed fields
    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select('-auth.local.password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
};
