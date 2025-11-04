import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import XPService, { tierConfig } from '../services/xpService.js';

// Get user's XP and progression information
export const getUserXP = async(req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get comprehensive progression stats
    const progressionStats = XPService.getUserProgressionStats(user);

    res.json({
      success: true,
      data: progressionStats
    });
  } catch (error) {
    console.error('Error fetching user XP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user XP',
      message: error.message
    });
  }
};

// Get XP leaderboard
export const getXPLeaderboard = async(req, res) => {
  try {
    const {
      limit = 10,
      cohort,
      tradeSpecialty,
      tier,
      timeframe = 'all' // all, weekly, monthly
    } = req.query;

    // Build match conditions
    const matchConditions = {
      role: 'student'
    };

    if (cohort) {
      matchConditions['cohort.id'] = cohort;
    }

    if (tradeSpecialty) {
      matchConditions.tradeSpecialty = tradeSpecialty;
    }

    if (tier) {
      matchConditions.progressTier = tier;
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchConditions }
    ];

    // Add timeframe filtering
    if (timeframe === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      pipeline.push({
        $addFields: {
          weeklyXP: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$stats.xpHistory',
                    cond: { $gte: ['$$this.date', weekAgo] }
                  }
                },
                as: 'entry',
                in: '$$entry.amount'
              }
            }
          }
        }
      });
      pipeline.push({ $sort: { weeklyXP: -1, 'stats.exp': -1 } });
    } else if (timeframe === 'monthly') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      pipeline.push({
        $addFields: {
          monthlyXP: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$stats.xpHistory',
                    cond: { $gte: ['$$this.date', monthAgo] }
                  }
                },
                as: 'entry',
                in: '$$entry.amount'
              }
            }
          }
        }
      });
      pipeline.push({ $sort: { monthlyXP: -1, 'stats.exp': -1 } });
    } else {
      // All-time leaderboard
      pipeline.push({ $sort: { 'stats.exp': -1, 'stats.challengesCompleted': -1 } });
    }

    pipeline.push(
      { $limit: parseInt(limit) },
      {
        $project: {
          'profile.name': 1,
          tradeSpecialty: 1,
          progressTier: 1,
          'cohort.name': 1,
          'stats.exp': 1,
          'stats.level': 1,
          'stats.challengesCompleted': 1,
          'stats.currentStreak': 1,
          weeklyXP: 1,
          monthlyXP: 1,
          badges: 1
        }
      }
    );

    const leaderboard = await User.aggregate(pipeline);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        filters: {
          timeframe,
          cohort: cohort || 'all',
          tradeSpecialty: tradeSpecialty || 'all',
          tier: tier || 'all'
        },
        count: rankedLeaderboard.length
      }
    });
  } catch (error) {
    console.error('Error fetching XP leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch XP leaderboard',
      message: error.message
    });
  }
};

// Simulate XP gain for a challenge
export const simulateXP = async(req, res) => {
  try {
    const { challengeId, userId } = req.params;
    const { score = 100, timeSpent, isResubmission = false } = req.body;

    const challenge = await Challenge.findById(challengeId);
    const user = await User.findById(userId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Simulate XP calculation
    const simulation = XPService.simulateXPGain(challenge, score, user, {
      timeSpent,
      isResubmission
    });

    // Calculate new tier after XP gain
    const newTotalXP = user.stats.exp + simulation.totalXP;
    const newTier = XPService.getUserTier(newTotalXP);
    const tierUp = newTier !== user.progressTier;

    res.json({
      success: true,
      data: {
        simulation,
        currentXP: user.stats.exp,
        newTotalXP,
        currentTier: user.progressTier,
        newTier,
        tierUp,
        challenge: {
          title: challenge.title,
          type: challenge.type,
          difficulty: challenge.difficulty
        }
      }
    });
  } catch (error) {
    console.error('Error simulating XP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simulate XP',
      message: error.message
    });
  }
};

// Award business milestone XP
export const awardMilestoneXP = async(req, res) => {
  try {
    const { userId } = req.params;
    const { milestone, note } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if milestone already completed
    if (user.businessProfile[milestone]?.completed) {
      return res.status(409).json({
        success: false,
        error: 'Milestone already completed'
      });
    }

    // Award milestone XP
    const xpAward = XPService.awardMilestoneXP(milestone, user);

    // Add XP to user
    user.addXP(xpAward.totalXP, `Business milestone: ${milestone}`);

    // Mark milestone as completed
    if (!user.businessProfile[milestone]) {
      user.businessProfile[milestone] = {};
    }
    user.businessProfile[milestone].completed = true;
    user.businessProfile[milestone].completedAt = new Date();
    if (note) {
      user.businessProfile[milestone].note = note;
    }

    await user.save();

    res.json({
      success: true,
      message: `Milestone XP awarded: ${xpAward.totalXP} XP`,
      data: {
        xpAward,
        milestone,
        user: {
          totalXP: user.stats.exp,
          tier: user.progressTier,
          level: user.stats.level
        }
      }
    });
  } catch (error) {
    console.error('Error awarding milestone XP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to award milestone XP',
      message: error.message
    });
  }
};

// Get tier information and requirements
export const getTierInfo = async(req, res) => {
  try {
    const { tier } = req.params;

    if (tier && !tierConfig[tier]) {
      return res.status(404).json({
        success: false,
        error: 'Tier not found'
      });
    }

    if (tier) {
      // Return specific tier info
      const tierInfo = tierConfig[tier];

      // Get users count at this tier
      const userCount = await User.countDocuments({
        progressTier: tier,
        role: 'student'
      });

      res.json({
        success: true,
        data: {
          ...tierInfo,
          tier,
          userCount
        }
      });
    } else {
      // Return all tiers
      const tiersWithCounts = [];

      for (const [tierName, tierData] of Object.entries(tierConfig)) {
        const userCount = await User.countDocuments({
          progressTier: tierName,
          role: 'student'
        });

        tiersWithCounts.push({
          ...tierData,
          tier: tierName,
          userCount
        });
      }

      res.json({
        success: true,
        data: {
          tiers: tiersWithCounts,
          count: tiersWithCounts.length
        }
      });
    }
  } catch (error) {
    console.error('Error fetching tier info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tier information',
      message: error.message
    });
  }
};

// Get XP history for user
export const getXPHistory = async(req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, startDate, endDate } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    let xpHistory = [...user.stats.xpHistory];

    // Filter by date range if provided
    if (startDate || endDate) {
      xpHistory = xpHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by date (most recent first) and limit
    xpHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    xpHistory = xpHistory.slice(0, parseInt(limit));

    // Calculate running totals
    let runningTotal = user.stats.exp;
    const historyWithTotals = xpHistory.map(entry => {
      const entryWithTotal = {
        ...entry.toObject ? entry.toObject() : entry,
        runningTotal
      };
      runningTotal -= entry.amount;
      return entryWithTotal;
    });

    res.json({
      success: true,
      data: {
        history: historyWithTotals,
        totalEntries: user.stats.xpHistory.length,
        currentXP: user.stats.exp,
        filters: {
          limit: parseInt(limit),
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching XP history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch XP history',
      message: error.message
    });
  }
};

// Get XP statistics for admin dashboard
export const getXPStats = async(req, res) => {
  try {
    const { cohort, tradeSpecialty } = req.query;

    // Build match conditions
    const matchConditions = { role: 'student' };

    if (cohort) {
      matchConditions['cohort.id'] = cohort;
    }

    if (tradeSpecialty) {
      matchConditions.tradeSpecialty = tradeSpecialty;
    }

    // Get comprehensive statistics
    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalXP: { $sum: '$stats.exp' },
          averageXP: { $avg: '$stats.exp' },
          maxXP: { $max: '$stats.exp' },
          minXP: { $min: '$stats.exp' },
          totalChallengesCompleted: { $sum: '$stats.challengesCompleted' },
          activeUsers: {
            $sum: {
              $cond: [
                { $gte: ['$lastActivity', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    const [stats] = await User.aggregate(pipeline);

    // Get tier distribution
    const tierDistribution = await User.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: '$progressTier',
          count: { $sum: 1 },
          averageXP: { $avg: '$stats.exp' }
        }
      },
      { $sort: { averageXP: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats || {
          totalUsers: 0,
          totalXP: 0,
          averageXP: 0,
          maxXP: 0,
          minXP: 0,
          totalChallengesCompleted: 0,
          activeUsers: 0
        },
        tierDistribution,
        filters: {
          cohort: cohort || 'all',
          tradeSpecialty: tradeSpecialty || 'all'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching XP statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch XP statistics',
      message: error.message
    });
  }
};
