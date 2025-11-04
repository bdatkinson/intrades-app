import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const authenticate = async(req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Authorization middleware - check user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access forbidden. Insufficient permissions.',
        requiredRoles: roles
      });
    }

    next();
  };
};

// Optional authentication - adds user info if token present
export const optionalAuth = async(req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};

// Validate user ownership or admin access
export const validateOwnership = async(req, res, next) => {
  try {
    const { userId } = req.params;

    // Admin can access any user's data
    if (req.user.role === 'admin') {
      return next();
    }

    // Users can only access their own data
    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access forbidden. Can only access own data.'
      });
    }

    next();
  } catch (error) {
    console.error('Ownership validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization check failed'
    });
  }
};

// Rate limiting middleware for challenge submissions
export const rateLimitSubmissions = (req, res, next) => {
  // Simple rate limiting - could be enhanced with Redis
  const maxSubmissions = 10; // per hour
  const timeWindow = 60 * 60 * 1000; // 1 hour in milliseconds

  if (!req.session) {
    req.session = {};
  }

  const now = Date.now();
  const userKey = req.user?.userId || req.ip;

  if (!req.session.submissions) {
    req.session.submissions = {};
  }

  if (!req.session.submissions[userKey]) {
    req.session.submissions[userKey] = [];
  }

  const userSubmissions = req.session.submissions[userKey];

  // Remove old submissions outside the time window
  req.session.submissions[userKey] = userSubmissions.filter(
    timestamp => now - timestamp < timeWindow
  );

  if (req.session.submissions[userKey].length >= maxSubmissions) {
    return res.status(429).json({
      success: false,
      error: 'Too many submissions. Please try again later.',
      retryAfter: Math.ceil((req.session.submissions[userKey][0] + timeWindow - now) / 1000)
    });
  }

  // Add current submission
  req.session.submissions[userKey].push(now);

  next();
};
