import mongoose from 'mongoose';

const { Schema } = mongoose;

// Submission status types
export const submissionStatuses = ['submitted', 'under-review', 'approved', 'needs-revision', 'rejected'];

// File attachment schema
const fileSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Rubric scoring schema for real-world tasks
const rubricScoreSchema = new Schema({
  criteria: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  maxScore: {
    type: Number,
    required: true,
    min: 1
  },
  feedback: {
    type: String,
    maxlength: 500
  }
}, { _id: false });

// Peer review schema
const peerReviewSchema = new Schema({
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    maxlength: 1000
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isAnonymous: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Main Submission schema
const submissionSchema = new Schema({
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: submissionStatuses,
    default: 'submitted'
  },

  // Submission content varies by challenge type
  content: {
    // Quiz answers
    answers: {
      type: Schema.Types.Mixed, // Flexible structure for different question types
      default: {}
    },

    // File uploads for real-world tasks
    files: [fileSchema],

    // Text responses
    textResponse: {
      type: String,
      maxlength: 5000
    },

    // URLs for website submissions, portfolio links, etc.
    urls: [{
      type: String,
      validate: {
        validator: function(url) {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid URL format'
      }
    }],

    // Mini-game or boss battle results
    gameResults: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },

  // Grading information
  grading: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    maxScore: {
      type: Number,
      default: 100
    },
    rubricScores: [rubricScoreSchema],
    feedback: {
      type: String,
      maxlength: 2000
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    isAutoGraded: {
      type: Boolean,
      default: false
    }
  },

  // Peer review system
  peerReviews: [peerReviewSchema],

  // XP and badges awarded
  rewards: {
    xpAwarded: {
      type: Number,
      default: 0,
      min: 0
    },
    badgesEarned: [{
      type: String
    }],
    bonusXP: {
      type: Number,
      default: 0,
      min: 0
    },
    bonusReason: String
  },

  // Submission metadata
  metadata: {
    timeSpent: {
      type: Number, // in minutes
      min: 0
    },
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1
    },
    isResubmission: {
      type: Boolean,
      default: false
    },
    originalSubmissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission'
    },
    ipAddress: String,
    userAgent: String,
    completedFromMobile: {
      type: Boolean,
      default: false
    }
  },

  // Comments and communication
  comments: [{
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInstructor: {
      type: Boolean,
      default: false
    }
  }],

  // Flags
  flags: {
    needsAttention: {
      type: Boolean,
      default: false
    },
    isPlagiarism: {
      type: Boolean,
      default: false
    },
    isExemplary: {
      type: Boolean,
      default: false
    },
    requiresFollowup: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
submissionSchema.index({ challengeId: 1, userId: 1 }, { unique: true }); // One submission per user per challenge
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ status: 1, submittedAt: -1 });
submissionSchema.index({ 'grading.gradedBy': 1, 'grading.gradedAt': -1 });
submissionSchema.index({ challengeId: 1, status: 1 });
submissionSchema.index({ 'rewards.xpAwarded': -1 });

// Virtual properties
submissionSchema.virtual('isGraded').get(function() {
  return this.grading && this.grading.score !== undefined;
});

submissionSchema.virtual('averagePeerScore').get(function() {
  if (!this.peerReviews || this.peerReviews.length === 0) return null;

  const scores = this.peerReviews.filter(review => review.score !== undefined);
  if (scores.length === 0) return null;

  const sum = scores.reduce((total, review) => total + review.score, 0);
  return Math.round(sum / scores.length);
});

submissionSchema.virtual('totalFilesSize').get(function() {
  if (!this.content.files || this.content.files.length === 0) return 0;

  return this.content.files.reduce((total, file) => total + file.fileSize, 0);
});

submissionSchema.virtual('daysUntilDue').get(function() {
  // This would need to check the challenge due date
  // Placeholder implementation
  return null;
});

submissionSchema.virtual('isLate').get(function() {
  // This would need to check against challenge due date
  // Placeholder implementation
  return false;
});

// Instance methods
submissionSchema.methods.calculateAutoScore = function() {
  // Only for quiz submissions
  if (!this.content.answers) return 0;

  // This method would be called with challenge data
  // For now, return placeholder
  return 0;
};

submissionSchema.methods.addPeerReview = function(reviewerId, score, feedback, isAnonymous = true) {
  // Check if user already reviewed this submission
  const existingReview = this.peerReviews.find(
    review => review.reviewerId.toString() === reviewerId.toString()
  );

  if (existingReview) {
    // Update existing review
    existingReview.score = score;
    existingReview.feedback = feedback;
    existingReview.submittedAt = new Date();
  } else {
    // Add new review
    this.peerReviews.push({
      reviewerId,
      score,
      feedback,
      isAnonymous,
      submittedAt: new Date()
    });
  }

  return this;
};

submissionSchema.methods.addComment = function(authorId, message, isInstructor = false) {
  this.comments.push({
    authorId,
    message,
    isInstructor,
    timestamp: new Date()
  });

  return this;
};

submissionSchema.methods.updateStatus = function(newStatus, graderId = null) {
  this.status = newStatus;

  if (newStatus === 'approved' || newStatus === 'rejected') {
    this.grading.gradedBy = graderId;
    this.grading.gradedAt = new Date();
  }

  return this;
};

submissionSchema.methods.awardXP = function(baseXP, bonusXP = 0, bonusReason = null) {
  this.rewards.xpAwarded = baseXP;
  if (bonusXP > 0) {
    this.rewards.bonusXP = bonusXP;
    this.rewards.bonusReason = bonusReason;
  }

  return this;
};

submissionSchema.methods.awardBadge = function(badgeId) {
  if (!this.rewards.badgesEarned.includes(badgeId)) {
    this.rewards.badgesEarned.push(badgeId);
  }

  return this;
};

submissionSchema.methods.canBeReviewed = function() {
  return this.status === 'submitted' || this.status === 'under-review';
};

submissionSchema.methods.getPeerReviewStats = function() {
  const reviews = this.peerReviews;

  if (reviews.length === 0) {
    return {
      count: 0,
      averageScore: null,
      averageHelpfulVotes: 0
    };
  }

  const scores = reviews.filter(r => r.score !== undefined).map(r => r.score);
  const totalHelpfulVotes = reviews.reduce((sum, r) => sum + (r.helpfulVotes || 0), 0);

  return {
    count: reviews.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    averageHelpfulVotes: Math.round(totalHelpfulVotes / reviews.length)
  };
};

// Static methods
submissionSchema.statics.findByChallenge = function(challengeId) {
  return this.find({ challengeId })
    .populate('userId', 'profile.name tradeSpecialty progressTier')
    .sort({ submittedAt: -1 });
};

submissionSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('challengeId', 'title week topic type')
    .sort({ submittedAt: -1 });
};

submissionSchema.statics.findPendingGrading = function(instructorId = null) {
  const query = {
    status: { $in: ['submitted', 'under-review'] }
  };

  return this.find(query)
    .populate('challengeId', 'title week topic createdBy')
    .populate('userId', 'profile.name tradeSpecialty')
    .sort({ submittedAt: 1 }); // Oldest first for grading queue
};

submissionSchema.statics.getSubmissionStats = function(challengeId = null) {
  const matchStage = challengeId ? { $match: { challengeId: new mongoose.Types.ObjectId(challengeId) } } : { $match: {} };

  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        averageScore: { $avg: '$grading.score' },
        averageXP: { $avg: '$rewards.xpAwarded' }
      }
    }
  ]);
};

submissionSchema.statics.getTopPerformers = function(challengeId, limit = 10) {
  return this.find({
    challengeId,
    'grading.score': { $exists: true }
  })
    .populate('userId', 'profile.name tradeSpecialty progressTier')
    .sort({ 'grading.score': -1, submittedAt: 1 })
    .limit(limit);
};

// Pre-save middleware
submissionSchema.pre('save', function(next) {
  // Auto-grade quiz submissions if answers provided
  if (this.content.answers && !this.grading.score && !this.grading.isAutoGraded) {
    // This would calculate score based on challenge data
    // For now, mark as ready for auto-grading
    this.grading.isAutoGraded = true;
  }

  // Update attempt number for resubmissions
  if (this.isModified('status') && this.status === 'submitted' && !this.isNew) {
    this.metadata.attemptNumber += 1;
    this.metadata.isResubmission = true;
  }

  next();
});

// Post-save middleware
submissionSchema.post('save', function(doc) {
  console.log(`Submission for challenge ${doc.challengeId} by user ${doc.userId} has been ${doc.status}`);
});

// Pre-remove middleware
submissionSchema.pre('remove', function(next) {
  // Clean up associated files if needed
  console.log(`Cleaning up files for submission ${this._id}`);
  next();
});

export default mongoose.model('Submission', submissionSchema);
