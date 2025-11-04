import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getUserXP,
  getXPLeaderboard,
  simulateXP,
  awardMilestoneXP,
  getTierInfo,
  getXPHistory,
  getXPStats
} from '../controllers/xpController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const userValidation = [
  param('userId').isMongoId().withMessage('Valid user ID required')
];

const challengeValidation = [
  param('challengeId').isMongoId().withMessage('Valid challenge ID required'),
  param('userId').isMongoId().withMessage('Valid user ID required')
];

const simulationValidation = [
  body('score').optional().isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be positive'),
  body('isResubmission').optional().isBoolean().withMessage('isResubmission must be boolean')
];

const milestoneValidation = [
  body('milestone').isString().isIn([
    'llc_filed', 'banking_opened', 'insurance_secured',
    'website_launched', 'first_job_completed'
  ]).withMessage('Invalid milestone'),
  body('note').optional().isString().isLength({ max: 500 }).withMessage('Note too long')
];

const queryValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('cohort').optional().isMongoId().withMessage('Valid cohort ID required'),
  query('tradeSpecialty').optional().isIn(['electrician', 'plumber', 'hvac', 'carpenter', 'general']).withMessage('Invalid trade specialty'),
  query('tier').optional().isIn(['apprentice', 'journeyman', 'master', 'contractor', 'boss']).withMessage('Invalid tier'),
  query('timeframe').optional().isIn(['all', 'weekly', 'monthly']).withMessage('Invalid timeframe')
];

const historyValidation = [
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('Limit must be between 1 and 200'),
  query('startDate').optional().isISO8601().withMessage('Valid start date required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date required')
];

// Public routes (for leaderboards and tier info)
router.get('/leaderboard', queryValidation, getXPLeaderboard);
router.get('/tiers', getTierInfo);
router.get('/tiers/:tier', getTierInfo);

// User-specific routes (authentication required)
router.get('/users/:userId', authenticate, userValidation, getUserXP);
router.get('/users/:userId/history', authenticate, userValidation, historyValidation, getXPHistory);

// XP simulation (for previewing rewards)
router.post('/simulate/:challengeId/:userId',
  authenticate,
  challengeValidation,
  simulationValidation,
  simulateXP
);

// Admin/Instructor routes
router.post('/users/:userId/milestone',
  authenticate,
  authorize('instructor', 'admin'),
  userValidation,
  milestoneValidation,
  awardMilestoneXP
);

router.get('/stats',
  authenticate,
  authorize('instructor', 'admin'),
  queryValidation,
  getXPStats
);

export default router;
