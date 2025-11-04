import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { v4 as uuid } from 'uuid';

const { Schema } = mongoose;

// Trade specialties
export const tradeSpecialties = ['electrician', 'plumber', 'hvac', 'carpenter', 'general'];
export const progressTiers = ['apprentice', 'journeyman', 'master', 'contractor', 'boss'];

// Business profile schema
const businessProfileSchema = new Schema({
  businessName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  llcStatus: {
    filed: { type: Boolean, default: false },
    filingDate: Date,
    documentUrl: String
  },
  banking: {
    accountOpened: { type: Boolean, default: false },
    bankName: String,
    confirmationUrl: String
  },
  insurance: {
    quotesObtained: { type: Boolean, default: false },
    provider: String,
    policyNumber: String,
    coverageAmount: Number
  },
  website: {
    domainRegistered: { type: Boolean, default: false },
    domain: String,
    launched: { type: Boolean, default: false },
    url: String
  },
  licensing: {
    obtained: { type: Boolean, default: false },
    licenseNumber: String,
    expirationDate: Date,
    jurisdiction: String
  }
}, { _id: false });

// Cohort information schema
const cohortSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  name: String,
  startDate: Date,
  endDate: Date,
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: false });

// Badge schema
const badgeSchema = new Schema({
  badgeId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['foundation', 'technical', 'marketing', 'operations', 'mastery'],
    required: true
  },
  earnedDate: {
    type: Date,
    default: Date.now
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }
}, { _id: false });

// Stats schema (extending Habitica-style stats)
const statsSchema = new Schema({
  hp: { type: Number, default: 50, max: 50 },
  mp: { type: Number, default: 50, max: 50 },
  exp: { type: Number, default: 0, min: 0 },
  gp: { type: Number, default: 0, min: 0 }, // Gold pieces
  lvl: { type: Number, default: 1, min: 1 },

  // InTrades specific stats
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 }
  },
  challengesCompleted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // Total time in minutes

  // Business milestones completed
  milestonesCompleted: { type: Number, default: 0 },
  totalMilestones: { type: Number, default: 10 } // Adjust based on curriculum
}, { _id: false });

// Preferences schema
const preferencesSchema = new Schema({
  emailNotifications: {
    challengeReminders: { type: Boolean, default: true },
    gradeNotifications: { type: Boolean, default: true },
    badgeEarned: { type: Boolean, default: true },
    weeklyProgress: { type: Boolean, default: true }
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  language: {
    type: String,
    default: 'en'
  }
}, { _id: false });

// Main User schema
const userSchema = new Schema({
  // Basic authentication info
  auth: {
    local: {
      username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        minlength: 3,
        maxlength: 20
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
      },
      hashedPassword: {
        type: String,
        required: true,
        minlength: 6
      }
    },
    // Social auth (future implementation)
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    },
    timestamps: {
      created: { type: Date, default: Date.now },
      loggedin: { type: Date, default: Date.now }
    }
  },

  // Profile information
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    displayName: String, // Auto-generated from first/last
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    bio: {
      type: String,
      maxlength: 500
    }
  },

  // InTrades specific fields
  tradeSpecialty: {
    type: String,
    enum: tradeSpecialties,
    required: true
  },

  experienceLevel: {
    type: String,
    enum: ['entry', '1-3years', '4-10years', '10plus'],
    required: true
  },

  cohort: cohortSchema,
  businessProfile: businessProfileSchema,

  progressTier: {
    type: String,
    enum: progressTiers,
    default: 'apprentice'
  },

  // Gamification
  stats: statsSchema,
  badges: [badgeSchema],

  // Social features
  studyBuddyId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // System fields
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastActivity: {
    type: Date,
    default: Date.now
  },

  preferences: preferencesSchema,

  // API access
  apiToken: {
    type: String,
    default: uuid,
    unique: true
  },

  // Flags
  flags: {
    tutorial: {
      intro: { type: Boolean, default: false },
      firstChallenge: { type: Boolean, default: false },
      firstSubmission: { type: Boolean, default: false }
    },
    newMessages: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.auth.local.hashedPassword;
      delete ret.apiToken;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ 'auth.local.email': 1 }, { unique: true });
userSchema.index({ 'auth.local.username': 1 }, { unique: true, sparse: true });
userSchema.index({ 'cohort.id': 1 });
userSchema.index({ progressTier: 1 });
userSchema.index({ 'stats.exp': -1 }); // For leaderboards
userSchema.index({ tradeSpecialty: 1 });
userSchema.index({ role: 1 });
userSchema.index({ apiToken: 1 });

// Virtuals
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

userSchema.virtual('xpProgress').get(function() {
  const tierThresholds = [0, 100, 300, 600, 1000, Infinity];
  const currentTierIndex = progressTiers.indexOf(this.progressTier);
  const currentThreshold = tierThresholds[currentTierIndex];
  const nextThreshold = tierThresholds[currentTierIndex + 1];

  if (nextThreshold === Infinity) {
    return { current: this.stats.exp, max: this.stats.exp, percentage: 100 };
  }

  const progress = this.stats.exp - currentThreshold;
  const max = nextThreshold - currentThreshold;
  const percentage = Math.round((progress / max) * 100);

  return { current: progress, max, percentage };
});

userSchema.virtual('businessProgress').get(function() {
  const milestones = [
    this.businessProfile.llcStatus.filed,
    this.businessProfile.banking.accountOpened,
    this.businessProfile.insurance.quotesObtained,
    this.businessProfile.website.domainRegistered,
    this.businessProfile.website.launched,
    this.businessProfile.licensing.obtained
  ];

  const completed = milestones.filter(Boolean).length;
  return {
    completed,
    total: milestones.length,
    percentage: Math.round((completed / milestones.length) * 100)
  };
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.auth.local.hashedPassword);
};

userSchema.methods.addXP = function(amount, source = 'challenge') {
  this.stats.exp += amount;
  this.checkTierPromotion();

  // Log XP gain
  console.log(`User ${this.profile.firstName} gained ${amount} XP from ${source}`);

  return this.save();
};

userSchema.methods.checkTierPromotion = function() {
  const tierThresholds = [
    { tier: 'apprentice', threshold: 0 },
    { tier: 'journeyman', threshold: 100 },
    { tier: 'master', threshold: 300 },
    { tier: 'contractor', threshold: 600 },
    { tier: 'boss', threshold: 1000 }
  ];

  for (let i = tierThresholds.length - 1; i >= 0; i--) {
    if (this.stats.exp >= tierThresholds[i].threshold) {
      if (this.progressTier !== tierThresholds[i].tier) {
        const oldTier = this.progressTier;
        this.progressTier = tierThresholds[i].tier;

        // Award tier badge
        this.awardBadge(`tier-${tierThresholds[i].tier}`, 'mastery');

        console.log(`User ${this.profile.firstName} promoted from ${oldTier} to ${this.progressTier}`);
      }
      break;
    }
  }
};

userSchema.methods.awardBadge = function(badgeId, category, challengeId = null) {
  // Check if badge already earned
  const existingBadge = this.badges.find(badge => badge.badgeId === badgeId);
  if (existingBadge) return false;

  this.badges.push({
    badgeId,
    category,
    challengeId,
    earnedDate: new Date()
  });

  console.log(`User ${this.profile.firstName} earned badge: ${badgeId}`);
  return true;
};

userSchema.methods.updateStreak = function(completed) {
  if (completed) {
    this.stats.streak.current += 1;
    if (this.stats.streak.current > this.stats.streak.longest) {
      this.stats.streak.longest = this.stats.streak.current;
    }
  } else {
    this.stats.streak.current = 0;
  }
};

userSchema.methods.canAccessChallenge = function(challenge) {
  // Check prerequisites
  if (challenge.prerequisites && challenge.prerequisites.length > 0) {
    // Implementation would check if user completed prerequisite challenges
    return true; // Placeholder
  }

  // Check cohort week
  if (this.cohort && this.cohort.startDate) {
    const weeksSinceStart = Math.floor((Date.now() - this.cohort.startDate) / (7 * 24 * 60 * 60 * 1000));
    return challenge.week <= weeksSinceStart + 1; // Allow current week + 1 week ahead
  }

  return true;
};

// Statics
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ 'auth.local.email': email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ 'auth.local.username': username });
};

userSchema.statics.getLeaderboard = function(cohortId, limit = 50) {
  const query = cohortId ? { 'cohort.id': cohortId } : {};
  return this.find(query)
    .select('profile stats progressTier tradeSpecialty')
    .sort({ 'stats.exp': -1 })
    .limit(limit);
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('auth.local.hashedPassword')) {
    const salt = await bcrypt.genSalt(10);
    this.auth.local.hashedPassword = await bcrypt.hash(this.auth.local.hashedPassword, salt);
  }

  // Set display name
  if (this.isModified('profile.firstName') || this.isModified('profile.lastName')) {
    this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName}`;
  }

  // Update last activity
  this.lastActivity = new Date();

  next();
});

export default mongoose.model('User', userSchema);
