import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getBadges,
  getBadge,
  getUserBadges,
  awardBadge,
  checkEligibleBadges,
  initializeBadges,
  getBadgeLeaderboard
} from '../controllers/badgeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const badgeValidation = [
  param('badgeId').isString().isLength({ min: 3, max: 50 }).withMessage('Valid badge ID required'),
  param('userId').isMongoId().withMessage('Valid user ID required')
];

const awardBadgeValidation = [
  body('source').optional().isString().isLength({ max: 100 }).withMessage('Source too long'),
  body('note').optional().isString().isLength({ max: 500 }).withMessage('Note too long')
];

const queryValidation = [
  query('category').optional().isIn(['foundation', 'legal', 'finance', 'marketing', 'operations', 'hr', 'scaling', 'achievement', 'social']).withMessage('Invalid category'),
  query('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary']).withMessage('Invalid rarity'),
  query('active').optional().isBoolean().withMessage('Active must be boolean'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Public routes (no authentication required)
router.get('/', queryValidation, getBadges);
router.get('/leaderboard', queryValidation, getBadgeLeaderboard);
router.get('/:id', getBadge);

// User-specific routes (authentication required)
router.get('/users/:userId', authenticate, getUserBadges);
router.post('/users/:userId/check', authenticate, checkEligibleBadges);

// Admin/Instructor routes
router.post('/users/:userId/award/:badgeId',
  authenticate,
  authorize('instructor', 'admin'),
  badgeValidation,
  awardBadgeValidation,
  awardBadge
);

router.post('/initialize',
  authenticate,
  authorize('admin'),
  initializeBadges
);

export default router;
