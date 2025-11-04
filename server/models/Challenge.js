import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

// Challenge types and difficulty levels
export const challengeTypes = ['quiz', 'real-world', 'mini-game', 'boss-battle'];
export const challengeTopics = ['foundation', 'legal', 'finance', 'marketing', 'operations', 'hr', 'scaling'];
export const challengeDifficulties = ['beginner', 'intermediate', 'advanced'];

// Resource schema for challenge materials
const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  url: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Invalid URL for resource']
  },
  type: {
    type: String,
    enum: ['video', 'article', 'tool', 'template', 'document'],
    required: true
  }
}, { _id: false });

// Quiz question schema
const questionSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    maxlength: 300
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false });

// Rubric criteria schema for real-world tasks
const rubricSchema = new Schema({
  criteria: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  }
}, { _id: false });

// Main Challenge schema
const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  topic: {
    type: String,
    required: true,
    enum: challengeTopics
  },
  type: {
    type: String,
    required: true,
    enum: challengeTypes
  },
  difficulty: {
    type: String,
    enum: challengeDifficulties,
    default: 'beginner'
  },
  estimatedTime: {
    type: Number, // in minutes
    min: 5,
    max: 240 // 4 hours max
  },
  xpReward: {
    base: {
      type: Number,
      required: true,
      min: 5,
      max: 100
    },
    bonus: {
      type: Number,
      default: 0,
      min: 0,
      max: 50
    }
  },
  badges: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],

  // Challenge content based on type
  content: {
    instructions: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    resources: [resourceSchema],

    // Quiz-specific content
    quiz: {
      questions: [questionSchema],
      passingScore: {
        type: Number,
        min: 50,
        max: 100,
        default: 70
      },
      timeLimit: Number // in minutes, optional
    },

    // Real-world task content
    realWorldTask: {
      instructions: {
        type: String,
        maxlength: 1000
      },
      submissionTypes: [{
        type: String,
        enum: ['file', 'photo', 'text', 'url']
      }],
      rubric: [rubricSchema],
      maxFileSize: {
        type: Number,
        default: 10 * 1024 * 1024 // 10MB
      }
    },

    // Mini-game content
    miniGame: {
      gameType: {
        type: String,
        enum: ['calculator', 'scenario', 'simulation', 'drag-drop']
      },
      config: Schema.Types.Mixed // Game-specific configuration
    }
  },

  // Challenge management
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Analytics
  completionStats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
challengeSchema.index({ week: 1, type: 1, isActive: 1 });
challengeSchema.index({ topic: 1, difficulty: 1 });
challengeSchema.index({ createdBy: 1 });
challengeSchema.index({ 'xpReward.base': -1 });

// Virtual for total possible XP
challengeSchema.virtual('maxXP').get(function() {
  return this.xpReward.base + this.xpReward.bonus;
});

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
  if (this.completionStats.totalAttempts === 0) return 0;
  // This would need to be calculated based on submission data
  return 0; // Placeholder
});

// Methods
challengeSchema.methods.canUserAccess = function(user) {
  // Check if user has completed prerequisites
  return true; // Placeholder - implement prerequisite checking
};

challengeSchema.methods.calculateScore = function(submission) {
  if (this.type === 'quiz') {
    const totalQuestions = this.content.quiz.questions.length;
    const correctAnswers = submission.content.answers.filter((answer, index) => {
      return answer === this.content.quiz.questions[index].correctAnswer;
    }).length;

    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  if (this.type === 'real-world') {
    // Calculate score based on rubric
    const rubricScores = submission.grading?.rubricScores || [];
    if (rubricScores.length === 0) return 0;

    const totalPossible = rubricScores.reduce((sum, score) => sum + score.maxScore, 0);
    const totalEarned = rubricScores.reduce((sum, score) => sum + score.score, 0);

    return Math.round((totalEarned / totalPossible) * 100);
  }

  return 0; // Default for mini-games and boss battles
};

// Static methods
challengeSchema.statics.getByWeek = function(weekNumber) {
  return this.find({ week: weekNumber, isActive: true }).sort({ createdAt: 1 });
};

challengeSchema.statics.getByTopic = function(topic) {
  return this.find({ topic, isActive: true }).sort({ week: 1, createdAt: 1 });
};

challengeSchema.statics.getForUser = function(userId) {
  // This would check user's progress and return appropriate challenges
  return this.find({ isActive: true }).sort({ week: 1, createdAt: 1 });
};

// Pre-save middleware
challengeSchema.pre('save', function(next) {
  // Validate content based on challenge type
  if (this.type === 'quiz' && (!this.content.quiz || this.content.quiz.questions.length === 0)) {
    return next(new Error('Quiz challenges must have at least one question'));
  }

  if (this.type === 'real-world' && (!this.content.realWorldTask || !this.content.realWorldTask.rubric || this.content.realWorldTask.rubric.length === 0)) {
    return next(new Error('Real-world challenges must have rubric criteria'));
  }

  next();
});

// Post-save middleware to update stats
challengeSchema.post('save', function(doc) {
  console.log(`Challenge "${doc.title}" has been saved`);
});

export default mongoose.model('Challenge', challengeSchema);
