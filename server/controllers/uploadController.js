import UploadService from '../services/uploadService.js';
import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import path from 'path';

// Upload files for challenge submission
export const uploadSubmissionFiles = async(req, res) => {
  try {
    const { challengeId, submissionId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      // Clean up uploaded files
      if (process.env.NODE_ENV === 'production') {
        await UploadService.deleteFiles(files.map(f => f.key));
      }

      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Get or create submission
    let submission;
    if (submissionId && submissionId !== 'new') {
      submission = await Submission.findById(submissionId);
      if (!submission) {
        // Clean up uploaded files
        if (process.env.NODE_ENV === 'production') {
          await UploadService.deleteFiles(files.map(f => f.key));
        }

        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      // Verify user owns this submission
      if (submission.userId.toString() !== req.user.userId) {
        // Clean up uploaded files
        if (process.env.NODE_ENV === 'production') {
          await UploadService.deleteFiles(files.map(f => f.key));
        }

        return res.status(403).json({
          success: false,
          error: 'Not authorized to modify this submission'
        });
      }
    } else {
      // Create new submission
      submission = new Submission({
        challengeId,
        userId: req.user.userId,
        content: {
          files: []
        },
        metadata: {
          timeSpent: 0,
          completedFromMobile: false,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        },
        status: 'draft'
      });
    }

    // Process uploaded files
    const fileData = await Promise.all(files.map(async(file) => {
      let fileUrl;

      if (process.env.NODE_ENV === 'production') {
        // Get signed URL for S3 file
        fileUrl = await UploadService.getSignedUrl(file.key, 7200); // 2 hours
      } else {
        // Local file URL
        fileUrl = `/uploads/${file.filename}`;
      }

      return {
        originalName: file.originalname,
        fileName: file.filename || file.key,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        s3Key: file.key || null,
        uploadedAt: new Date()
      };
    }));

    // Add files to submission
    if (!submission.content.files) {
      submission.content.files = [];
    }
    submission.content.files.push(...fileData);

    // Update submission metadata
    submission.metadata.hasFileUploads = true;
    submission.metadata.totalFileSize = submission.content.files.reduce((sum, f) => sum + f.size, 0);
    submission.metadata.fileCount = submission.content.files.length;

    await submission.save();

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        submissionId: submission._id,
        files: fileData,
        totalFiles: submission.content.files.length
      }
    });
  } catch (error) {
    console.error('Error uploading submission files:', error);

    // Clean up uploaded files on error
    if (req.files && process.env.NODE_ENV === 'production') {
      try {
        await UploadService.deleteFiles(req.files.map(f => f.key));
      } catch (deleteError) {
        console.error('Error cleaning up files:', deleteError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload files',
      message: error.message
    });
  }
};

// Get presigned URL for direct browser upload
export const getPresignedUploadUrl = async(req, res) => {
  try {
    const { challengeId } = req.params;
    const { contentType = 'image/jpeg', fileName = 'upload.jpg' } = req.body;

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check user access to challenge
    const user = await User.findById(req.user.userId);
    const access = user.canAccessChallenge(challenge);
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        error: 'Cannot access this challenge',
        reason: access.reason
      });
    }

    // Validate file type
    const ext = path.extname(fileName).toLowerCase();
    const validation = UploadService.validateFile(
      {
        originalname: fileName,
        mimetype: contentType,
        size: 0 // Size will be checked by S3
      },
      'submission'
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
        details: validation.errors
      });
    }

    // Generate presigned POST data
    const presignedData = await UploadService.getPresignedPost({
      contentType,
      userId: req.user.userId,
      challengeId,
      maxSize: 10 * 1024 * 1024 // 10MB
    });

    res.json({
      success: true,
      data: presignedData
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL',
      message: error.message
    });
  }
};

// Get file download URL
export const getFileDownloadUrl = async(req, res) => {
  try {
    const { submissionId, fileId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Check authorization
    const isOwner = submission.userId.toString() === req.user.userId;
    const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';

    if (!isOwner && !isInstructor) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this file'
      });
    }

    // Find file in submission
    const file = submission.content.files?.find(f =>
      f._id.toString() === fileId || f.fileName === fileId
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Generate signed URL for S3 file
    let downloadUrl;
    if (file.s3Key && process.env.NODE_ENV === 'production') {
      downloadUrl = await UploadService.getSignedUrl(file.s3Key, 3600); // 1 hour
    } else {
      downloadUrl = file.url;
    }

    res.json({
      success: true,
      data: {
        url: downloadUrl,
        fileName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        expiresIn: 3600 // seconds
      }
    });
  } catch (error) {
    console.error('Error getting download URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get download URL',
      message: error.message
    });
  }
};

// Delete uploaded file
export const deleteSubmissionFile = async(req, res) => {
  try {
    const { submissionId, fileId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Verify user owns this submission
    if (submission.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this submission'
      });
    }

    // Find file index
    const fileIndex = submission.content.files?.findIndex(f =>
      f._id.toString() === fileId || f.fileName === fileId
    );

    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    const file = submission.content.files[fileIndex];

    // Delete from S3 if applicable
    if (file.s3Key && process.env.NODE_ENV === 'production') {
      try {
        await UploadService.deleteFile(file.s3Key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
      }
    }

    // Remove from submission
    submission.content.files.splice(fileIndex, 1);

    // Update metadata
    submission.metadata.totalFileSize = submission.content.files.reduce((sum, f) => sum + f.size, 0);
    submission.metadata.fileCount = submission.content.files.length;
    submission.metadata.hasFileUploads = submission.content.files.length > 0;

    await submission.save();

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: {
        remainingFiles: submission.content.files.length
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
      message: error.message
    });
  }
};

// Get submission files list
export const getSubmissionFiles = async(req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .populate('challengeId', 'title type')
      .populate('userId', 'profile.name');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Check authorization
    const isOwner = submission.userId._id.toString() === req.user.userId;
    const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin';

    if (!isOwner && !isInstructor) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these files'
      });
    }

    // Generate signed URLs for S3 files
    const filesWithUrls = await Promise.all(
      (submission.content.files || []).map(async(file) => {
        let url = file.url;

        if (file.s3Key && process.env.NODE_ENV === 'production') {
          url = await UploadService.getSignedUrl(file.s3Key, 3600);
        }

        return {
          id: file._id,
          originalName: file.originalName,
          fileName: file.fileName,
          mimeType: file.mimeType,
          size: file.size,
          url,
          uploadedAt: file.uploadedAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        submission: {
          id: submission._id,
          challenge: submission.challengeId,
          user: submission.userId,
          status: submission.status
        },
        files: filesWithUrls,
        metadata: {
          totalFiles: filesWithUrls.length,
          totalSize: submission.metadata.totalFileSize,
          hasFileUploads: submission.metadata.hasFileUploads
        }
      }
    });
  } catch (error) {
    console.error('Error getting submission files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get submission files',
      message: error.message
    });
  }
};

// Upload avatar image
export const uploadAvatar = async(req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Verify user exists and matches authenticated user
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this avatar'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete old avatar if exists
    if (user.profile.avatarS3Key && process.env.NODE_ENV === 'production') {
      try {
        await UploadService.deleteFile(user.profile.avatarS3Key);
      } catch (deleteError) {
        console.error('Error deleting old avatar:', deleteError);
      }
    }

    // Get avatar URL
    let avatarUrl;
    if (process.env.NODE_ENV === 'production') {
      avatarUrl = await UploadService.getSignedUrl(file.key, 86400); // 24 hours
      user.profile.avatarS3Key = file.key;
    } else {
      avatarUrl = `/uploads/${file.filename}`;
    }

    // Update user profile
    user.profile.avatar = avatarUrl;
    user.profile.avatarUploadedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl,
        uploadedAt: user.profile.avatarUploadedAt
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);

    // Clean up uploaded file on error
    if (req.file && process.env.NODE_ENV === 'production') {
      try {
        await UploadService.deleteFile(req.file.key);
      } catch (deleteError) {
        console.error('Error cleaning up avatar:', deleteError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar',
      message: error.message
    });
  }
};

// Get upload statistics
export const getUploadStats = async(req, res) => {
  try {
    const { userId, challengeId } = req.query;

    // Build query
    const query = {};
    if (userId) query.userId = userId;
    if (challengeId) query.challengeId = challengeId;

    // Get submissions with files
    const submissions = await Submission.find({
      ...query,
      'metadata.hasFileUploads': true
    });

    // Calculate statistics
    const stats = {
      totalSubmissions: submissions.length,
      totalFiles: 0,
      totalSize: 0,
      fileTypes: {},
      averageFilesPerSubmission: 0,
      largestFile: null,
      mostRecentUpload: null
    };

    submissions.forEach(submission => {
      if (submission.content.files) {
        stats.totalFiles += submission.content.files.length;
        stats.totalSize += submission.metadata.totalFileSize || 0;

        submission.content.files.forEach(file => {
          const ext = path.extname(file.originalName).toLowerCase();
          stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;

          if (!stats.largestFile || file.size > stats.largestFile.size) {
            stats.largestFile = {
              name: file.originalName,
              size: file.size,
              submissionId: submission._id
            };
          }

          if (!stats.mostRecentUpload || file.uploadedAt > stats.mostRecentUpload.uploadedAt) {
            stats.mostRecentUpload = {
              name: file.originalName,
              uploadedAt: file.uploadedAt,
              submissionId: submission._id
            };
          }
        });
      }
    });

    if (stats.totalSubmissions > 0) {
      stats.averageFilesPerSubmission = Math.round(stats.totalFiles / stats.totalSubmissions * 10) / 10;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting upload statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upload statistics',
      message: error.message
    });
  }
};
