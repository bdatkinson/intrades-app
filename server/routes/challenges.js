import express from 'express';
import { body } from 'express-validator';
import {
  getChallenges,
  getUserChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  submitChallenge,
  getChallengeSubmissions,
  gradeSubmission,
  getChallengeAnalytics
} from '../controllers/challengeController.js';

const router = express.Router();

// Challenge validation middleware
const challengeValidation = [
  body('title').isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('week').isInt({ min: 1, max: 8 }).withMessage('Week must be between 1 and 8'),
  body('topic').isIn(['foundation', 'legal', 'finance', 'marketing', 'operations', 'hr', 'scaling']).withMessage('Invalid topic'),
  body('type').isIn(['quiz', 'real-world', 'mini-game', 'boss-battle']).withMessage('Invalid challenge type'),
  body('xpReward.base').isInt({ min: 5, max: 100 }).withMessage('Base XP must be between 5-100'),
  body('xpReward.bonus').optional().isInt({ min: 0, max: 50 }).withMessage('Bonus XP must be between 0-50')
];

// Submission validation middleware
const submissionValidation = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('content').notEmpty().withMessage('Submission content is required'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be positive number')
];

// Grading validation middleware
const gradingValidation = [
  body('score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0-100'),
  body('feedback').optional().isLength({ max: 2000 }).withMessage('Feedback too long'),
  body('xpAwarded').optional().isInt({ min: 0 }).withMessage('XP must be positive')
];

// Public routes
router.get('/', getChallenges);
router.get('/users/:userId', getUserChallenges);
router.get('/:id', getChallenge);

// Protected routes (authentication middleware would be added here)
router.post('/', challengeValidation, createChallenge);
router.put('/:id', challengeValidation, updateChallenge);
router.delete('/:id', deleteChallenge);

// Submission routes
router.post('/:id/submit', submissionValidation, submitChallenge);
router.get('/:id/submissions', getChallengeSubmissions);
router.post('/submissions/:submissionId/grade', gradingValidation, gradeSubmission);

// Analytics routes
router.get('/:id/analytics', getChallengeAnalytics);

export default router;
