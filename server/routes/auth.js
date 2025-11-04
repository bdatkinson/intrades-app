import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username must be 3-20 characters, alphanumeric with _ or -'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('tradeSpecialty').isIn(['electrician', 'plumber', 'hvac', 'carpenter', 'general']).withMessage('Valid trade specialty required'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Valid phone number required')
];

const loginValidation = [
  body('emailOrUsername').notEmpty().withMessage('Email or username required'),
  body('password').notEmpty().withMessage('Password required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];

const updateProfileValidation = [
  body('profile.name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('profile.phoneNumber').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('profile.website').optional().isURL().withMessage('Valid URL required')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Public routes (no authentication required)
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh', refreshToken);
router.post('/password-reset', requestPasswordReset);
router.post('/password-reset/confirm', resetPasswordValidation, handleValidationErrors, resetPassword);

// Protected routes (authentication required)
router.post('/logout', authenticate, logout);
router.post('/change-password', authenticate, changePasswordValidation, handleValidationErrors, changePassword);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfileValidation, handleValidationErrors, updateProfile);

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
