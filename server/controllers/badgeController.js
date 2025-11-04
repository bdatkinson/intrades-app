import Badge from '../models/Badge.js';
import User from '../models/User.js';
import XPService from '../services/xpService.js';

// Get all badges with optional filtering
export const getBadges = async(req, res) => {
  try {
    const { category, rarity, active = true } = req.query;

    // Build filter object
    const filter = { isActive: active === 'true' };

    if (category) filter.category = category;
    if (rarity) filter.rarity = rarity;

    const badges = await Badge.find(filter)
      .sort({ category: 1, rarity: 1, sortOrder: 1, name: 1 });

    // Group badges by category for easier display
    const badgesByCategory = badges.reduce((acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    }, {});

    res.json({
      success: true,
      count: badges.length,
      data: {
        all: badges,
        byCategory: badgesByCategory
      }
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badges',
      message: error.message
    });
  }
};

// Get single badge by ID
export const getBadge = async(req, res) => {
  try {
    const { id } = req.params;

    const badge = await Badge.findOne({
      $or: [
        { _id: id },
        { badgeId: id }
      ],
      isActive: true
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        error: 'Badge not found'
      });
    }

    // Get badge statistics (how many users have earned it)
    const earnedCount = await User.countDocuments({
      'badges.badgeId': badge.badgeId
    });

    // Calculate rarity percentage
    const totalUsers = await User.countDocuments({ role: 'student' });
    const rarityPercentage = totalUsers > 0 ? Math.round((earnedCount / totalUsers) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...badge.toObject(),
        stats: {
          earnedCount,
          totalUsers,
          rarityPercentage
        }
      }
    });
  } catch (error) {
    console.error('Error fetching badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badge',
      message: error.message
    });
  }
};

// Get user's badges with progress information
export const getUserBadges = async(req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('badges.badgeId');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get all available badges
    const allBadges = await Badge.find({ isActive: true })
      .sort({ category: 1, rarity: 1, name: 1 });

    // Check eligibility for new badges
    const eligibleBadgeIds = await XPService.checkBadgeEligibility(user);

    // Organize badge information
    const earnedBadges = user.badges.map(userBadge => ({
      ...userBadge.toObject(),
      earnedAt: userBadge.earnedAt,
      source: userBadge.source
    }));

    const availableBadges = allBadges.map(badge => {
      const isEarned = user.badges.some(userBadge => userBadge.badgeId === badge.badgeId);
      const isEligible = eligibleBadgeIds.includes(badge.badgeId);

      return {
        ...badge.toObject(),
        isEarned,
        isEligible,
        canEarn: !isEarned && isEligible
      };
    });

    // Group by category
    const badgesByCategory = availableBadges.reduce((acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = {
          total: 0,
          earned: 0,
          badges: []
        };
      }

      acc[badge.category].total++;
      if (badge.isEarned) acc[badge.category].earned++;
      acc[badge.category].badges.push(badge);

      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        earned: earnedBadges,
        available: availableBadges,
        byCategory: badgesByCategory,
        stats: {
          totalEarned: earnedBadges.length,
          totalAvailable: allBadges.length,
          eligibleCount: eligibleBadgeIds.length,
          completionPercentage: Math.round((earnedBadges.length / allBadges.length) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user badges',
      message: error.message
    });
  }
};

// Award badge to user (admin/instructor only)
export const awardBadge = async(req, res) => {
  try {
    const { userId, badgeId } = req.params;
    const { source, note } = req.body;

    const user = await User.findById(userId);
    const badge = await Badge.findOne({ badgeId, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!badge) {
      return res.status(404).json({
        success: false,
        error: 'Badge not found'
      });
    }

    // Check if user already has this badge
    const existingBadge = user.badges.find(b => b.badgeId === badgeId);
    if (existingBadge) {
      return res.status(409).json({
        success: false,
        error: 'User already has this badge',
        earnedAt: existingBadge.earnedAt
      });
    }

    // Award the badge
    const awarded = user.awardBadge(badgeId, badge.category, source, note);

    if (awarded) {
      await user.save();

      res.json({
        success: true,
        message: `Badge "${badge.name}" awarded successfully`,
        data: {
          badge: badge.toObject(),
          earnedAt: new Date(),
          source: source || 'manual'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to award badge'
      });
    }
  } catch (error) {
    console.error('Error awarding badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to award badge',
      message: error.message
    });
  }
};

// Check and award eligible badges for user
export const checkEligibleBadges = async(req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get eligible badges
    const eligibleBadgeIds = await XPService.checkBadgeEligibility(user);

    if (eligibleBadgeIds.length === 0) {
      return res.json({
        success: true,
        message: 'No new badges to award',
        data: {
          awarded: [],
          count: 0
        }
      });
    }

    // Award eligible badges
    const awardedBadges = [];
    const badges = await Badge.find({ badgeId: { $in: eligibleBadgeIds }, isActive: true });

    for (const badge of badges) {
      const awarded = user.awardBadge(badge.badgeId, badge.category, 'auto-award');
      if (awarded) {
        awardedBadges.push({
          badgeId: badge.badgeId,
          name: badge.name,
          category: badge.category,
          rarity: badge.rarity,
          icon: badge.icon
        });
      }
    }

    if (awardedBadges.length > 0) {
      await user.save();
    }

    res.json({
      success: true,
      message: `${awardedBadges.length} badge(s) awarded`,
      data: {
        awarded: awardedBadges,
        count: awardedBadges.length
      }
    });
  } catch (error) {
    console.error('Error checking eligible badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check eligible badges',
      message: error.message
    });
  }
};

// Initialize badges from definitions (admin only)
export const initializeBadges = async(req, res) => {
  try {
    await Badge.initializeBadges();

    const badgeCount = await Badge.countDocuments({ isActive: true });

    res.json({
      success: true,
      message: 'Badges initialized successfully',
      data: {
        count: badgeCount
      }
    });
  } catch (error) {
    console.error('Error initializing badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize badges',
      message: error.message
    });
  }
};

// Get badge leaderboard (users with most badges)
export const getBadgeLeaderboard = async(req, res) => {
  try {
    const { limit = 10, category } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          role: 'student',
          'badges.0': { $exists: true } // Has at least one badge
        }
      }
    ];

    // Filter by badge category if specified
    if (category) {
      pipeline.push({
        $addFields: {
          categoryBadges: {
            $filter: {
              input: '$badges',
              cond: { $eq: ['$$this.category', category] }
            }
          }
        }
      });

      pipeline.push({
        $addFields: {
          badgeCount: { $size: '$categoryBadges' }
        }
      });
    } else {
      pipeline.push({
        $addFields: {
          badgeCount: { $size: '$badges' }
        }
      });
    }

    pipeline.push(
      { $match: { badgeCount: { $gt: 0 } } },
      { $sort: { badgeCount: -1, 'stats.exp': -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          'profile.name': 1,
          tradeSpecialty: 1,
          progressTier: 1,
          badgeCount: 1,
          'stats.exp': 1,
          badges: 1
        }
      }
    );

    const leaderboard = await User.aggregate(pipeline);

    res.json({
      success: true,
      data: {
        leaderboard,
        category: category || 'all',
        count: leaderboard.length
      }
    });
  } catch (error) {
    console.error('Error fetching badge leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badge leaderboard',
      message: error.message
    });
  }
};
