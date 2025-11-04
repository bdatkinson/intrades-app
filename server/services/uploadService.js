import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const S3_BUCKET = process.env.S3_BUCKET || 'intrades-submissions';

// Allowed file types for different submission types
const fileTypeConfig = {
  image: {
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Images (JPG, PNG, GIF, WebP)'
  },
  document: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Documents (PDF, Word, Excel, Text)'
  },
  video: {
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
    extensions: ['.mp4', '.mov', '.avi', '.webm'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Videos (MP4, MOV, AVI, WebM)'
  },
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    extensions: ['.mp3', '.wav', '.ogg', '.m4a'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Audio (MP3, WAV, OGG, M4A)'
  },
  submission: {
    // Combined allowed types for general submissions
    mimeTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Images and Documents'
  }
};

// File validation function
const validateFile = (fileType = 'submission') => {
  return (req, file, cb) => {
    const config = fileTypeConfig[fileType];

    if (!config) {
      return cb(new Error(`Invalid file type configuration: ${fileType}`));
    }

    // Check MIME type
    if (!config.mimeTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed: ${config.description}`));
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!config.extensions.includes(ext)) {
      return cb(new Error(`Invalid file extension. Allowed: ${config.extensions.join(', ')}`));
    }

    cb(null, true);
  };
};

// Generate unique filename
const generateFileName = (file, userId, challengeId) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(file.originalname).toLowerCase();
  const safeOriginalName = file.originalname
    .replace(ext, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 50);

  return `${userId}/${challengeId}/${timestamp}_${randomString}_${safeOriginalName}${ext}`;
};

// S3 upload configuration
const createS3Storage = (fileType = 'submission') => {
  return multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    acl: 'private', // Keep files private, serve through signed URLs
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        userId: req.user?.userId || 'anonymous',
        challengeId: req.params?.challengeId || 'unknown',
        submissionId: req.params?.submissionId || 'new',
        uploadedAt: new Date().toISOString(),
        originalName: file.originalname,
        fileType: fileType
      });
    },
    key: (req, file, cb) => {
      const userId = req.user?.userId || 'anonymous';
      const challengeId = req.params?.challengeId || 'general';
      const fileName = generateFileName(file, userId, challengeId);
      cb(null, fileName);
    }
  });
};

// Local storage configuration (for development)
const createLocalStorage = (uploadPath = 'uploads') => {
  const fullPath = path.join(process.cwd(), uploadPath);

  // Ensure upload directory exists
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.user?.userId || 'anonymous';
      const challengeId = req.params?.challengeId || 'general';
      const userPath = path.join(fullPath, userId, challengeId);

      // Create user and challenge directories if they don't exist
      if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true });
      }

      cb(null, userPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const ext = path.extname(file.originalname).toLowerCase();
      const safeOriginalName = file.originalname
        .replace(ext, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .substring(0, 50);

      cb(null, `${timestamp}_${randomString}_${safeOriginalName}${ext}`);
    }
  });
};

// Create multer upload instances
export const createUploader = (options = {}) => {
  const {
    fileType = 'submission',
    storage = process.env.NODE_ENV === 'production' ? 's3' : 'local',
    maxFiles = 5
  } = options;

  const config = fileTypeConfig[fileType];

  const multerConfig = {
    storage: storage === 's3'
      ? createS3Storage(fileType)
      : createLocalStorage(),
    fileFilter: validateFile(fileType),
    limits: {
      fileSize: config.maxSize,
      files: maxFiles
    }
  };

  return multer(multerConfig);
};

// Upload service class
class UploadService {
  /**
   * Upload single file
   * @param {string} fieldName - Form field name
   * @param {Object} options - Upload options
   * @returns {Function} Multer middleware
   */
  static uploadSingle(fieldName = 'file', options = {}) {
    const uploader = createUploader(options);
    return uploader.single(fieldName);
  }

  /**
   * Upload multiple files
   * @param {string} fieldName - Form field name
   * @param {number} maxCount - Maximum number of files
   * @param {Object} options - Upload options
   * @returns {Function} Multer middleware
   */
  static uploadMultiple(fieldName = 'files', maxCount = 5, options = {}) {
    const uploader = createUploader({ ...options, maxFiles: maxCount });
    return uploader.array(fieldName, maxCount);
  }

  /**
   * Upload files with different fields
   * @param {Array} fields - Array of field configurations
   * @param {Object} options - Upload options
   * @returns {Function} Multer middleware
   */
  static uploadFields(fields, options = {}) {
    const uploader = createUploader(options);
    return uploader.fields(fields);
  }

  /**
   * Get signed URL for private S3 file
   * @param {string} key - S3 object key
   * @param {number} expires - URL expiration in seconds (default 1 hour)
   * @returns {Promise<string>} Signed URL
   */
  static async getSignedUrl(key, expires = 3600) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: expires
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  }

  /**
   * Delete file from S3
   * @param {string} key - S3 object key
   * @returns {Promise} Delete operation result
   */
  static async deleteFile(key) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    };

    return s3.deleteObject(params).promise();
  }

  /**
   * Delete multiple files from S3
   * @param {Array<string>} keys - Array of S3 object keys
   * @returns {Promise} Delete operation result
   */
  static async deleteFiles(keys) {
    if (!keys || keys.length === 0) {
      return Promise.resolve();
    }

    const params = {
      Bucket: S3_BUCKET,
      Delete: {
        Objects: keys.map(key => ({ Key: key }))
      }
    };

    return s3.deleteObjects(params).promise();
  }

  /**
   * Get file metadata from S3
   * @param {string} key - S3 object key
   * @returns {Promise<Object>} File metadata
   */
  static async getFileMetadata(key) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    };

    return s3.headObject(params).promise();
  }

  /**
   * Copy file within S3
   * @param {string} sourceKey - Source S3 object key
   * @param {string} destinationKey - Destination S3 object key
   * @returns {Promise} Copy operation result
   */
  static async copyFile(sourceKey, destinationKey) {
    const params = {
      Bucket: S3_BUCKET,
      CopySource: `${S3_BUCKET}/${sourceKey}`,
      Key: destinationKey
    };

    return s3.copyObject(params).promise();
  }

  /**
   * Generate presigned POST URL for direct browser uploads
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Presigned POST data
   */
  static async getPresignedPost(options = {}) {
    const {
      key,
      expires = 300, // 5 minutes
      contentType = 'image/jpeg',
      maxSize = 5 * 1024 * 1024, // 5MB
      userId,
      challengeId
    } = options;

    const fileName = key || generateFileName(
      { originalname: 'upload' },
      userId || 'anonymous',
      challengeId || 'general'
    );

    const params = {
      Bucket: S3_BUCKET,
      Expires: expires,
      Fields: {
        key: fileName,
        'Content-Type': contentType
      },
      Conditions: [
        ['content-length-range', 0, maxSize],
        ['starts-with', '$Content-Type', contentType.split('/')[0]]
      ]
    };

    return new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Check if file exists in S3
   * @param {string} key - S3 object key
   * @returns {Promise<boolean>} True if file exists
   */
  static async fileExists(key) {
    try {
      await this.getFileMetadata(key);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file size
   * @param {string} key - S3 object key
   * @returns {Promise<number>} File size in bytes
   */
  static async getFileSize(key) {
    const metadata = await this.getFileMetadata(key);
    return metadata.ContentLength;
  }

  /**
   * Validate file before processing
   * @param {Object} file - File object from multer
   * @param {string} fileType - Expected file type
   * @returns {Object} Validation result
   */
  static validateFile(file, fileType = 'submission') {
    const config = fileTypeConfig[fileType];
    const result = {
      valid: true,
      errors: []
    };

    if (!file) {
      result.valid = false;
      result.errors.push('No file provided');
      return result;
    }

    // Check MIME type
    if (!config.mimeTypes.includes(file.mimetype)) {
      result.valid = false;
      result.errors.push(`Invalid file type. Allowed: ${config.description}`);
    }

    // Check file size
    if (file.size > config.maxSize) {
      result.valid = false;
      result.errors.push(`File too large. Maximum size: ${config.maxSize / (1024 * 1024)}MB`);
    }

    // Check extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!config.extensions.includes(ext)) {
      result.valid = false;
      result.errors.push(`Invalid extension. Allowed: ${config.extensions.join(', ')}`);
    }

    return result;
  }
}

export default UploadService;
