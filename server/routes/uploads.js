import express from 'express';
import { body, param, query } from 'express-validator';
import {
  uploadSubmissionFiles,
  getPresignedUploadUrl,
  getFileDownloadUrl,
  deleteSubmissionFile,
  getSubmissionFiles,
  uploadAvatar,
  getUploadStats
} from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import UploadService from '../services/uploadService.js';

const router = express.Router();

// Validation middleware
const fileValidation = [
  param('submissionId').optional().isMongoId().withMessage('Valid submission ID required'),
  param('challengeId').optional().isMongoId().withMessage('Valid challenge ID required'),
  param('fileId').optional().isMongoId().withMessage('Valid file ID required')
];

const presignedValidation = [
  body('contentType').optional().isString().withMessage('Content type must be string'),
  body('fileName').optional().isString().isLength({ min: 1, max: 255 }).withMessage('Invalid file name')
];

// Configure upload middleware for different routes
const submissionUpload = UploadService.uploadMultiple('files', 5, {
  fileType: 'submission',
  storage: process.env.NODE_ENV === 'production' ? 's3' : 'local'
});

const avatarUpload = UploadService.uploadSingle('avatar', {
  fileType: 'image',
  storage: process.env.NODE_ENV === 'production' ? 's3' : 'local'
});

// Submission file routes
router.post(
  '/challenges/:challengeId/submissions/:submissionId/files',
  authenticate,
  fileValidation,
  submissionUpload,
  uploadSubmissionFiles
);

router.get(
  '/submissions/:submissionId/files',
  authenticate,
  fileValidation,
  getSubmissionFiles
);

router.get(
  '/submissions/:submissionId/files/:fileId/download',
  authenticate,
  fileValidation,
  getFileDownloadUrl
);

router.delete(
  '/submissions/:submissionId/files/:fileId',
  authenticate,
  fileValidation,
  deleteSubmissionFile
);

// Presigned URL for direct browser upload
router.post(
  '/challenges/:challengeId/presigned',
  authenticate,
  fileValidation,
  presignedValidation,
  getPresignedUploadUrl
);

// Avatar upload
router.post(
  '/users/:userId/avatar',
  authenticate,
  avatarUpload,
  uploadAvatar
);

// Upload statistics (admin/instructor)
router.get(
  '/stats',
  authenticate,
  authorize('instructor', 'admin'),
  getUploadStats
);

// Static file serving for local development
if (process.env.NODE_ENV !== 'production') {
  router.use('/uploads', express.static('uploads'));
}

export default router;
