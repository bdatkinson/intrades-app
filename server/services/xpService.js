import Badge from '../models/Badge.js';

// XP Configuration for InTrades 5-tier progression system
export const tierConfig = {
  apprentice: {
    name: 'Apprentice',
    minXP: 0,
    maxXP: 99,
    multiplier: 1.0,
    color: '#8B4513', // Brown
    icon: '👷'
  },
  journeyman: {
    name: 'Journeyman',
    minXP: 100,
    maxXP: 299,
    multiplier: 1.2,
    color: '#2E8B57', // Sea Green
    icon: '🔧'
  },
  master: {
    name: 'Master',
    minXP: 300,
    maxXP: 599,
    multiplier: 1.5,
    color: '#4169E1', // Royal Blue
    icon: '⚡'
  },
  contractor: {
    name: 'Contractor',
    minXP: 600,
    maxXP: 999,
    multiplier: 1.8,
    color: '#9400D3', // Violet
    icon: '💼'
  },
  boss: {
    name: 'Boss',
    minXP: 1000,
    maxXP: Infinity,
    multiplier: 2.0,
    color: '#FFD700', // Gold
    icon: '👑'
  }
};

// Base XP values for different activities
export const baseXpValues = {
  challenge: {
    quiz: {
      easy: 15,
      medium: 20,
      hard: 25
    },
    'real-world': {
      easy: 25,
      medium: 35,
      hard: 50
    },
    'mini-game': {
      easy: 10,
      medium: 15,
      hard: 20
    },
    'boss-battle': {
      easy: 50,
      medium: 75,
      hard: 100
    }
  },
  bonus: {
    perfectScore: 10,
    speedBonus: 5,
    streakDaily: 2,
    streakWeekly: 15,
    firstTime: 5,
    improvement: 10,
    peerReview: 3,
    mentoring: 5,
    businessMilestone: 50
  },
  penalty: {
    lateSubmission: -5,
    resubmission: -2
  }
};

// XP Service for managing experience points and progression
class XPService {
  /**
   * Calculate XP for challenge completion
   * @param {Object} challenge - Challenge object
   * @param {Object} submission - Submission object
   * @param {Object} user - User object
   * @returns {Object} XP calculation result
   */
  static calculateChallengeXP(challenge, submission, user) {
    const result = {
      baseXP: 0,
      bonusXP: 0,
      penaltyXP: 0,
      multiplierXP: 0,
      totalXP: 0,
      breakdown: []
    };

    // Base XP from challenge type and difficulty
    const baseXP = baseXpValues.challenge[challenge.type]?.[challenge.difficulty] ||
                   challenge.xpReward?.base || 20;
    result.baseXP = baseXP;
    result.breakdown.push(`Base: ${baseXP} XP (${challenge.type} - ${challenge.difficulty})`);

    // Score-based adjustment
    const scoreMultiplier = Math.max(0.3, submission.grading.score / 100);
    result.baseXP = Math.round(result.baseXP * scoreMultiplier);

    if (scoreMultiplier < 1) {
      result.breakdown.push(`Score adjustment: ×${scoreMultiplier.toFixed(2)} (${submission.grading.score}%)`);
    }

    // Bonus XP calculations
    const bonuses = this.calculateBonusXP(challenge, submission, user);
    result.bonusXP = bonuses.total;
    result.breakdown.push(...bonuses.breakdown);

    // Penalty XP calculations
    const penalties = this.calculatePenaltyXP(challenge, submission, user);
    result.penaltyXP = penalties.total;
    result.breakdown.push(...penalties.breakdown);

    // Tier multiplier
    const userTier = this.getUserTier(user.stats.exp);
    const tierMultiplier = tierConfig[userTier].multiplier;
    result.multiplierXP = Math.round((result.baseXP + result.bonusXP) * (tierMultiplier - 1));

    if (tierMultiplier > 1) {
      result.breakdown.push(`${userTier} tier bonus: ×${tierMultiplier} (+${result.multiplierXP} XP)`);
    }

    // Calculate total
    result.totalXP = result.baseXP + result.bonusXP + result.multiplierXP + result.penaltyXP;
    result.totalXP = Math.max(1, result.totalXP); // Minimum 1 XP

    return result;
  }

  /**
   * Calculate bonus XP
   * @param {Object} challenge - Challenge object
   * @param {Object} submission - Submission object
   * @param {Object} user - User object
   * @returns {Object} Bonus XP calculation
   */
  static calculateBonusXP(challenge, submission, user) {
    const bonuses = {
      total: 0,
      breakdown: []
    };

    // Perfect score bonus
    if (submission.grading.score === 100) {
      const perfectBonus = baseXpValues.bonus.perfectScore;
      bonuses.total += perfectBonus;
      bonuses.breakdown.push(`Perfect score: +${perfectBonus} XP`);
    }

    // Speed bonus (completed in less than half estimated time)
    if (submission.metadata.timeSpent && challenge.estimatedTime) {
      const timeRatio = submission.metadata.timeSpent / (challenge.estimatedTime * 60); // Convert to seconds
      if (timeRatio < 0.5) {
        const speedBonus = baseXpValues.bonus.speedBonus;
        bonuses.total += speedBonus;
        bonuses.breakdown.push(`Speed bonus: +${speedBonus} XP`);
      }
    }

    // First time completion bonus
    if (!submission.metadata.isResubmission) {
      const firstTimeBonus = baseXpValues.bonus.firstTime;
      bonuses.total += firstTimeBonus;
      bonuses.breakdown.push(`First attempt: +${firstTimeBonus} XP`);
    }

    // Streak bonus
    if (user.stats.currentStreak >= 3) {
      const streakBonus = Math.min(user.stats.currentStreak, 14) * baseXpValues.bonus.streakDaily;
      bonuses.total += streakBonus;
      bonuses.breakdown.push(`${user.stats.currentStreak} day streak: +${streakBonus} XP`);
    }

    // Challenge-specific bonuses from challenge definition
    if (challenge.xpReward?.bonus && submission.grading.score >= (challenge.xpReward.bonusThreshold || 90)) {
      bonuses.total += challenge.xpReward.bonus;
      bonuses.breakdown.push(`Challenge bonus: +${challenge.xpReward.bonus} XP`);
    }

    return bonuses;
  }

  /**
   * Calculate penalty XP
   * @param {Object} challenge - Challenge object
   * @param {Object} submission - Submission object
   * @param {Object} user - User object
   * @returns {Object} Penalty XP calculation
   */
  static calculatePenaltyXP(challenge, submission, user) {
    const penalties = {
      total: 0,
      breakdown: []
    };

    // Late submission penalty
    if (submission.submittedAt > challenge.dueDate) {
      const latePenalty = baseXpValues.penalty.lateSubmission;
      penalties.total += latePenalty;
      penalties.breakdown.push(`Late submission: ${latePenalty} XP`);
    }

    // Resubmission penalty (only for subsequent attempts)
    if (submission.metadata.isResubmission && submission.metadata.attemptNumber > 2) {
      const resubPenalty = baseXpValues.penalty.resubmission * (submission.metadata.attemptNumber - 2);
      penalties.total += resubPenalty;
      penalties.breakdown.push(`Multiple resubmissions: ${resubPenalty} XP`);
    }

    return penalties;
  }

  /**
   * Get user's current tier based on XP
   * @param {number} xp - User's total XP
   * @returns {string} Tier name
   */
  static getUserTier(xp) {
    for (const [tierName, config] of Object.entries(tierConfig)) {
      if (xp >= config.minXP && xp <= config.maxXP) {
        return tierName;
      }
    }
    return 'apprentice'; // Fallback
  }

  /**
   * Get next tier information
   * @param {number} xp - User's current XP
   * @returns {Object|null} Next tier info or null if at max tier
   */
  static getNextTierInfo(xp) {
    const currentTier = this.getUserTier(xp);
    const tiers = Object.keys(tierConfig);
    const currentIndex = tiers.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex >= tiers.length - 1) {
      return null; // At max tier
    }

    const nextTierName = tiers[currentIndex + 1];
    const nextTierConfig = tierConfig[nextTierName];

    return {
      tier: nextTierName,
      name: nextTierConfig.name,
      xpRequired: nextTierConfig.minXP,
      xpRemaining: nextTierConfig.minXP - xp,
      progress: Math.max(0, Math.min(100, ((xp - tierConfig[currentTier].minXP) /
                (nextTierConfig.minXP - tierConfig[currentTier].minXP)) * 100))
    };
  }

  /**
   * Award business milestone XP
   * @param {string} milestone - Milestone name
   * @param {Object} user - User object
   * @returns {Object} XP award result
   */
  static awardMilestoneXP(milestone, user) {
    const milestoneXP = baseXpValues.bonus.businessMilestone;
    const tierMultiplier = tierConfig[this.getUserTier(user.stats.exp)].multiplier;
    const totalXP = Math.round(milestoneXP * tierMultiplier);

    return {
      baseXP: milestoneXP,
      multiplierXP: Math.round(milestoneXP * (tierMultiplier - 1)),
      totalXP,
      breakdown: [
        `Business milestone (${milestone}): +${milestoneXP} XP`,
        ...(tierMultiplier > 1 ? [`Tier multiplier: ×${tierMultiplier}`] : [])
      ]
    };
  }

  /**
   * Check for eligible badges based on user progress
   * @param {Object} user - User object with populated progress
   * @returns {Array} Array of eligible badge IDs
   */
  static async checkBadgeEligibility(user) {
    const eligibleBadges = [];
    const allBadges = await Badge.find({ isActive: true });

    // Get current user badges to avoid duplicates
    const currentBadgeIds = user.badges.map(b => b.badgeId);

    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (currentBadgeIds.includes(badge.badgeId)) {
        continue;
      }

      // Check eligibility using badge's built-in method
      if (badge.checkEligibility(user)) {
        eligibleBadges.push(badge.badgeId);
      }
    }

    return eligibleBadges;
  }

  /**
   * Calculate level from XP (for display purposes)
   * @param {number} xp - Total XP
   * @returns {number} User level
   */
  static calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
  }

  /**
   * Get XP needed for next level
   * @param {number} xp - Current XP
   * @returns {number} XP needed for next level
   */
  static getXPToNextLevel(xp) {
    const currentLevel = this.calculateLevel(xp);
    const nextLevelXP = currentLevel * 100;
    return nextLevelXP - xp;
  }

  /**
   * Get comprehensive user progression stats
   * @param {Object} user - User object
   * @returns {Object} Progression statistics
   */
  static getUserProgressionStats(user) {
    const currentTier = this.getUserTier(user.stats.exp);
    const nextTier = this.getNextTierInfo(user.stats.exp);
    const level = this.calculateLevel(user.stats.exp);
    const xpToNextLevel = this.getXPToNextLevel(user.stats.exp);

    return {
      tier: {
        current: currentTier,
        name: tierConfig[currentTier].name,
        multiplier: tierConfig[currentTier].multiplier,
        color: tierConfig[currentTier].color,
        icon: tierConfig[currentTier].icon
      },
      nextTier,
      level,
      xpToNextLevel,
      totalXP: user.stats.exp,
      badgeCount: user.badges.length,
      challengesCompleted: user.stats.challengesCompleted,
      currentStreak: user.stats.currentStreak,
      averageScore: user.challengeProgress.completedChallenges.length > 0 ?
        Math.round(user.challengeProgress.completedChallenges
          .reduce((sum, c) => sum + c.score, 0) / user.challengeProgress.completedChallenges.length) : 0
    };
  }

  /**
   * Simulate XP gain for testing/preview purposes
   * @param {Object} challenge - Challenge object
   * @param {number} score - Predicted score
   * @param {Object} user - User object
   * @param {Object} options - Additional options (timeSpent, etc.)
   * @returns {Object} Simulated XP calculation
   */
  static simulateXPGain(challenge, score, user, options = {}) {
    const mockSubmission = {
      grading: { score },
      metadata: {
        timeSpent: options.timeSpent || challenge.estimatedTime * 60,
        isResubmission: options.isResubmission || false,
        attemptNumber: options.attemptNumber || 1
      },
      submittedAt: options.submittedAt || new Date()
    };

    return this.calculateChallengeXP(challenge, mockSubmission, user);
  }
}

export default XPService;
