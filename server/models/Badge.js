import mongoose from 'mongoose';

// Badge categories aligned with curriculum topics
export const badgeCategories = [
  'foundation',
  'legal',
  'finance',
  'marketing',
  'operations',
  'hr',
  'scaling',
  'achievement', // Special category for milestones
  'social'       // Community and peer interaction badges
];

// Badge rarities affecting display and prestige
export const badgeRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// Comprehensive badge definitions for InTrades curriculum
export const badgeDefinitions = {
  // Foundation Badges (Week 1)
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first challenge in the InTrades program',
    category: 'foundation',
    rarity: 'common',
    icon: '👶',
    criteria: {
      type: 'challenge_completion',
      requirement: { count: 1 }
    }
  },
  'foundation-explorer': {
    id: 'foundation-explorer',
    name: 'Foundation Explorer',
    description: 'Complete all Foundation challenges',
    category: 'foundation',
    rarity: 'uncommon',
    icon: '🏗️',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'foundation', percentage: 100 }
    }
  },
  'entrepreneur-mindset': {
    id: 'entrepreneur-mindset',
    name: 'Entrepreneur Mindset',
    description: 'Score 90% or higher on entrepreneurship assessment',
    category: 'foundation',
    rarity: 'rare',
    icon: '🧠',
    criteria: {
      type: 'challenge_score',
      requirement: { topic: 'foundation', minScore: 90 }
    }
  },

  // Legal Badges (Week 2)
  'legal-eagle': {
    id: 'legal-eagle',
    name: 'Legal Eagle',
    description: 'Master business structure and legal requirements',
    category: 'legal',
    rarity: 'uncommon',
    icon: '⚖️',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'legal', percentage: 100 }
    }
  },
  'llc-champion': {
    id: 'llc-champion',
    name: 'LLC Champion',
    description: 'Successfully file LLC documentation',
    category: 'legal',
    rarity: 'rare',
    icon: '📋',
    criteria: {
      type: 'business_milestone',
      requirement: { milestone: 'llc_filed' }
    }
  },
  'permit-master': {
    id: 'permit-master',
    name: 'Permit Master',
    description: 'Complete permit and licensing challenges',
    category: 'legal',
    rarity: 'uncommon',
    icon: '📜',
    criteria: {
      type: 'challenge_type',
      requirement: { type: 'real-world', topic: 'legal', count: 3 }
    }
  },

  // Finance Badges (Week 3)
  'money-manager': {
    id: 'money-manager',
    name: 'Money Manager',
    description: 'Excel at financial planning and budgeting',
    category: 'finance',
    rarity: 'uncommon',
    icon: '💰',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'finance', percentage: 100 }
    }
  },
  'banking-pro': {
    id: 'banking-pro',
    name: 'Banking Pro',
    description: 'Open business banking account',
    category: 'finance',
    rarity: 'rare',
    icon: '🏦',
    criteria: {
      type: 'business_milestone',
      requirement: { milestone: 'banking_opened' }
    }
  },
  'pricing-wizard': {
    id: 'pricing-wizard',
    name: 'Pricing Wizard',
    description: 'Master labor burden and markup calculations',
    category: 'finance',
    rarity: 'rare',
    icon: '🧮',
    criteria: {
      type: 'calculator_usage',
      requirement: { tool: 'pricing_calculator', sessions: 5 }
    }
  },

  // Marketing Badges (Week 4)
  'brand-builder': {
    id: 'brand-builder',
    name: 'Brand Builder',
    description: 'Create compelling business branding',
    category: 'marketing',
    rarity: 'uncommon',
    icon: '🎨',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'marketing', percentage: 100 }
    }
  },
  'digital-pioneer': {
    id: 'digital-pioneer',
    name: 'Digital Pioneer',
    description: 'Launch business website',
    category: 'marketing',
    rarity: 'epic',
    icon: '🌐',
    criteria: {
      type: 'business_milestone',
      requirement: { milestone: 'website_launched' }
    }
  },
  'social-media-savvy': {
    id: 'social-media-savvy',
    name: 'Social Media Savvy',
    description: 'Complete social media marketing challenges',
    category: 'marketing',
    rarity: 'uncommon',
    icon: '📱',
    criteria: {
      type: 'challenge_tag',
      requirement: { tag: 'social_media', count: 3 }
    }
  },

  // Operations Badges (Week 5)
  'operations-expert': {
    id: 'operations-expert',
    name: 'Operations Expert',
    description: 'Master day-to-day business operations',
    category: 'operations',
    rarity: 'uncommon',
    icon: '⚙️',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'operations', percentage: 100 }
    }
  },
  'first-job': {
    id: 'first-job',
    name: 'First Job Completed',
    description: 'Successfully complete your first paid job',
    category: 'operations',
    rarity: 'legendary',
    icon: '🎯',
    criteria: {
      type: 'business_milestone',
      requirement: { milestone: 'first_job_completed' }
    }
  },
  'quality-assurance': {
    id: 'quality-assurance',
    name: 'Quality Assurance',
    description: 'Maintain high standards in all work submissions',
    category: 'operations',
    rarity: 'rare',
    icon: '✅',
    criteria: {
      type: 'average_score',
      requirement: { minScore: 95, challengeCount: 10 }
    }
  },

  // HR Badges (Week 6)
  'team-builder': {
    id: 'team-builder',
    name: 'Team Builder',
    description: 'Learn hiring and team management',
    category: 'hr',
    rarity: 'uncommon',
    icon: '👥',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'hr', percentage: 100 }
    }
  },
  'safety-first': {
    id: 'safety-first',
    name: 'Safety First',
    description: 'Master workplace safety protocols',
    category: 'hr',
    rarity: 'rare',
    icon: '🦺',
    criteria: {
      type: 'challenge_tag',
      requirement: { tag: 'safety', count: 5 }
    }
  },
  'insurance-guru': {
    id: 'insurance-guru',
    name: 'Insurance Guru',
    description: 'Secure comprehensive business insurance',
    category: 'hr',
    rarity: 'epic',
    icon: '🛡️',
    criteria: {
      type: 'business_milestone',
      requirement: { milestone: 'insurance_secured' }
    }
  },

  // Scaling Badges (Week 7)
  'growth-hacker': {
    id: 'growth-hacker',
    name: 'Growth Hacker',
    description: 'Master business growth strategies',
    category: 'scaling',
    rarity: 'uncommon',
    icon: '📈',
    criteria: {
      type: 'topic_completion',
      requirement: { topic: 'scaling', percentage: 100 }
    }
  },
  'systems-architect': {
    id: 'systems-architect',
    name: 'Systems Architect',
    description: 'Build scalable business systems',
    category: 'scaling',
    rarity: 'rare',
    icon: '🏗️',
    criteria: {
      type: 'challenge_type',
      requirement: { type: 'real-world', topic: 'scaling', count: 4 }
    }
  },

  // Achievement Badges (Performance-based)
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete challenges in record time',
    category: 'achievement',
    rarity: 'rare',
    icon: '⚡',
    criteria: {
      type: 'completion_time',
      requirement: { maxTime: 300, count: 5 } // 5 minutes or less, 5 times
    }
  },
  'perfectionist': {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve perfect scores on 10 challenges',
    category: 'achievement',
    rarity: 'epic',
    icon: '💯',
    criteria: {
      type: 'perfect_scores',
      requirement: { count: 10 }
    }
  },
  'streak-master': {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain 14-day completion streak',
    category: 'achievement',
    rarity: 'epic',
    icon: '🔥',
    criteria: {
      type: 'streak',
      requirement: { days: 14 }
    }
  },
  'comeback-kid': {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Improve failing grade to passing score',
    category: 'achievement',
    rarity: 'uncommon',
    icon: '💪',
    criteria: {
      type: 'improvement',
      requirement: { fromScore: 60, toScore: 85 }
    }
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete challenges ahead of schedule',
    category: 'achievement',
    rarity: 'uncommon',
    icon: '🐦',
    criteria: {
      type: 'early_completion',
      requirement: { daysEarly: 2, count: 5 }
    }
  },

  // Social Badges (Community interaction)
  'helpful-peer': {
    id: 'helpful-peer',
    name: 'Helpful Peer',
    description: 'Provide constructive feedback on peer submissions',
    category: 'social',
    rarity: 'uncommon',
    icon: '🤝',
    criteria: {
      type: 'peer_reviews',
      requirement: { count: 10, avgRating: 4.0 }
    }
  },
  'study-buddy': {
    id: 'study-buddy',
    name: 'Study Buddy',
    description: 'Form lasting study partnerships',
    category: 'social',
    rarity: 'rare',
    icon: '👯',
    criteria: {
      type: 'study_partnerships',
      requirement: { partnerships: 3, duration: 7 }
    }
  },
  'mentor': {
    id: 'mentor',
    name: 'Mentor',
    description: 'Guide newer students through challenges',
    category: 'social',
    rarity: 'epic',
    icon: '🎓',
    criteria: {
      type: 'mentorship',
      requirement: { mentees: 2, sessions: 10 }
    }
  },

  // Special Program Badges
  'graduate': {
    id: 'graduate',
    name: 'InTrades Graduate',
    description: 'Successfully complete the entire InTrades program',
    category: 'achievement',
    rarity: 'legendary',
    icon: '🎓',
    criteria: {
      type: 'program_completion',
      requirement: { percentage: 100, finalGrade: 80 }
    }
  },
  'valedictorian': {
    id: 'valedictorian',
    name: 'Valedictorian',
    description: 'Graduate with highest honors',
    category: 'achievement',
    rarity: 'legendary',
    icon: '👑',
    criteria: {
      type: 'program_completion',
      requirement: { percentage: 100, finalGrade: 95 }
    }
  }
};

const BadgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true,
    enum: Object.keys(badgeDefinitions)
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  category: {
    type: String,
    required: true,
    enum: badgeCategories
  },
  rarity: {
    type: String,
    required: true,
    enum: badgeRarities,
    default: 'common'
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: [
        'challenge_completion',
        'topic_completion',
        'challenge_score',
        'business_milestone',
        'challenge_type',
        'calculator_usage',
        'challenge_tag',
        'average_score',
        'completion_time',
        'perfect_scores',
        'streak',
        'improvement',
        'early_completion',
        'peer_reviews',
        'study_partnerships',
        'mentorship',
        'program_completion'
      ]
    },
    requirement: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true
});

// Indexes
BadgeSchema.index({ badgeId: 1 }, { unique: true });
BadgeSchema.index({ category: 1, rarity: 1 });
BadgeSchema.index({ isActive: 1, sortOrder: 1 });

// Static method to initialize badges from definitions
BadgeSchema.statics.initializeBadges = async function() {
  const Badge = this;

  for (const [badgeId, definition] of Object.entries(badgeDefinitions)) {
    try {
      await Badge.findOneAndUpdate(
        { badgeId },
        {
          badgeId,
          name: definition.name,
          description: definition.description,
          category: definition.category,
          rarity: definition.rarity,
          icon: definition.icon,
          criteria: definition.criteria
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error initializing badge ${badgeId}:`, error);
    }
  }

  console.log(`Initialized ${Object.keys(badgeDefinitions).length} badges`);
};

// Static method to get badges by category
BadgeSchema.statics.getBadgesByCategory = async function(category) {
  return this.find({ category, isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get badges by rarity
BadgeSchema.statics.getBadgesByRarity = async function(rarity) {
  return this.find({ rarity, isActive: true }).sort({ category: 1, name: 1 });
};

// Instance method to check if user qualifies for this badge
BadgeSchema.methods.checkEligibility = function(user, userStats = {}) {
  const { criteria } = this;

  switch (criteria.type) {
  case 'challenge_completion':
    return user.stats.challengesCompleted >= criteria.requirement.count;

  case 'topic_completion': {
    const topicCompletion = user.getTopicCompletion(criteria.requirement.topic);
    return topicCompletion >= criteria.requirement.percentage;
  }

  case 'challenge_score':
    return user.challengeProgress.completedChallenges.some(c =>
      c.topic === criteria.requirement.topic &&
        c.score >= criteria.requirement.minScore
    );

  case 'business_milestone':
    return user.businessProfile[criteria.requirement.milestone]?.completed === true;

  case 'perfect_scores': {
    const perfectScores = user.challengeProgress.completedChallenges
      .filter(c => c.score === 100).length;
    return perfectScores >= criteria.requirement.count;
  }

  case 'streak':
    return user.stats.currentStreak >= criteria.requirement.days;

  case 'average_score': {
    const avgScore = user.challengeProgress.completedChallenges
      .slice(-criteria.requirement.challengeCount)
      .reduce((sum, c) => sum + c.score, 0) / criteria.requirement.challengeCount;
    return avgScore >= criteria.requirement.minScore;
  }

  default:
    return false;
  }
};

const Badge = mongoose.model('Badge', BadgeSchema);

export default Badge;
