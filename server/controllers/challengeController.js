import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get all challenges with optional filtering
export const getChallenges = async(req, res) => {
  try {
    const { week, topic, type, difficulty, active = true } = req.query;

    // Build filter object
    const filter = { isActive: active === 'true' };

    if (week) filter.week = parseInt(week);
    if (topic) filter.topic = topic;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter)
      .populate('createdBy', 'profile.name role')
      .sort({ week: 1, createdAt: 1 });

    res.json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenges',
      message: error.message
    });
  }
};

// Get challenges for a specific user (based on their progress and permissions)
export const getUserChallenges = async(req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get challenges for user's current week and earlier
    const challenges = await Challenge.find({
      week: { $lte: user.challengeProgress.currentWeek },
      isActive: true
    }).populate('createdBy', 'profile.name');

    // Check which challenges the user has completed
    const completedChallenges = user.challengeProgress.completedChallenges.map(c => c.challengeId.toString());

    const challengesWithStatus = challenges.map(challenge => {
      const isCompleted = completedChallenges.includes(challenge._id.toString());
      const access = user.canAccessChallenge(challenge);

      return {
        ...challenge.toObject(),
        isCompleted,
        canAccess: access.allowed,
        accessReason: access.reason || null
      };
    });

    res.json({
      success: true,
      data: challengesWithStatus,
      userProgress: {
        currentWeek: user.challengeProgress.currentWeek,
        completedCount: user.challengeProgress.completedChallenges.length,
        totalXP: user.stats.exp,
        tier: user.progressTier
      }
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user challenges',
      message: error.message
    });
  }
};

// Get single challenge by ID
export const getChallenge = async(req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Optional: check user access

    const challenge = await Challenge.findById(id)
      .populate('createdBy', 'profile.name role')
      .populate('prerequisites', 'title week');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    let userAccess = { allowed: true };
    let userSubmission = null;

    // Check user access if userId provided
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userAccess = user.canAccessChallenge(challenge);

        // Get user's submission for this challenge
        userSubmission = await Submission.findOne({
          challengeId: id,
          userId
        });
      }
    }

    res.json({
      success: true,
      data: {
        ...challenge.toObject(),
        canAccess: userAccess.allowed,
        accessReason: userAccess.reason || null,
        userSubmission: userSubmission ? {
          id: userSubmission._id,
          status: userSubmission.status,
          score: userSubmission.grading?.score,
          submittedAt: userSubmission.submittedAt,
          xpAwarded: userSubmission.rewards?.xpAwarded
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenge',
      message: error.message
    });
  }
};

// Create new challenge (instructor/admin only)
export const createChallenge = async(req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const challengeData = {
      ...req.body,
      createdBy: req.user.userId // Assuming user is attached by auth middleware
    };

    const challenge = new Challenge(challengeData);
    await challenge.save();

    await challenge.populate('createdBy', 'profile.name role');

    res.status(201).json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating challenge:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create challenge',
      message: error.message
    });
  }
};

// Update challenge (instructor/admin only)
export const updateChallenge = async(req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check if user can edit this challenge
    if (req.user.role !== 'admin' && challenge.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to edit this challenge'
      });
    }

    // Update challenge
    Object.assign(challenge, req.body);
    await challenge.save();

    await challenge.populate('createdBy', 'profile.name role');

    res.json({
      success: true,
      data: challenge,
      message: 'Challenge updated successfully'
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update challenge',
      message: error.message
    });
  }
};

// Delete challenge (admin only)
export const deleteChallenge = async(req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Soft delete - set isActive to false
    challenge.isActive = false;
    await challenge.save();

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete challenge',
      message: error.message
    });
  }
};

// Submit challenge response
export const submitChallenge = async(req, res) => {
  try {
    const { id: challengeId } = req.params;
    const { userId, content, timeSpent, completedFromMobile = false } = req.body;

    // Validate challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found or inactive'
      });
    }

    // Validate user exists and can access challenge
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const access = user.canAccessChallenge(challenge);
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        error: 'Cannot access this challenge',
        reason: access.reason
      });
    }

    // Check if user already has a submission
    let submission = await Submission.findOne({
      challengeId,
      userId
    });

    if (submission) {
      // Update existing submission
      submission.content = content;
      submission.metadata.timeSpent = timeSpent;
      submission.metadata.completedFromMobile = completedFromMobile;
      submission.submittedAt = new Date();
      submission.status = 'submitted';
      submission.metadata.attemptNumber += 1;
      submission.metadata.isResubmission = true;
    } else {
      // Create new submission
      submission = new Submission({
        challengeId,
        userId,
        content,
        metadata: {
          timeSpent,
          completedFromMobile,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    }

    // Auto-grade if it's a quiz
    if (challenge.type === 'quiz' && content.answers) {
      const score = challenge.calculateScore(submission);
      submission.grading.score = score;
      submission.grading.isAutoGraded = true;

      // Calculate XP based on score
      const xpEarned = Math.round((score / 100) * challenge.xpReward.base);
      submission.rewards.xpAwarded = xpEarned;

      // Award bonus XP for perfect score
      if (score === 100) {
        submission.rewards.bonusXP = challenge.xpReward.bonus;
        submission.rewards.bonusReason = 'Perfect score!';
      }

      submission.status = 'approved';
    }

    await submission.save();

    // Update user progress if approved
    if (submission.status === 'approved') {
      await updateUserProgress(user, challenge, submission);
    }

    // Populate submission for response
    await submission.populate([
      { path: 'challengeId', select: 'title week topic type xpReward' },
      { path: 'userId', select: 'profile.name progressTier' }
    ]);

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Challenge submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit challenge',
      message: error.message
    });
  }
};

// Get challenge submissions (for instructors)
export const getChallengeSubmissions = async(req, res) => {
  try {
    const { id: challengeId } = req.params;
    const { status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Build query
    const query = { challengeId };
    if (status) query.status = status;

    // Get submissions
    const submissions = await Submission.find(query)
      .populate('userId', 'profile.name tradeSpecialty progressTier')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    // Get submission stats
    const stats = await Submission.getSubmissionStats(challengeId);

    res.json({
      success: true,
      data: {
        challenge: {
          id: challenge._id,
          title: challenge.title,
          week: challenge.week,
          topic: challenge.topic,
          type: challenge.type
        },
        submissions,
        stats,
        count: submissions.length
      }
    });
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
      message: error.message
    });
  }
};

// Grade a submission (instructor only)
export const gradeSubmission = async(req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback, rubricScores, xpAwarded, badgesEarned } = req.body;

    const submission = await Submission.findById(submissionId)
      .populate('challengeId')
      .populate('userId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Update grading
    submission.grading.score = score;
    submission.grading.feedback = feedback;
    submission.grading.rubricScores = rubricScores || [];
    submission.grading.gradedBy = req.user.userId;
    submission.grading.gradedAt = new Date();
    submission.status = score >= 70 ? 'approved' : 'needs-revision'; // Configurable passing score

    // Update rewards
    if (xpAwarded !== undefined) {
      submission.rewards.xpAwarded = xpAwarded;
    }

    if (badgesEarned && badgesEarned.length > 0) {
      submission.rewards.badgesEarned = badgesEarned;
    }

    await submission.save();

    // Update user progress if approved
    if (submission.status === 'approved') {
      await updateUserProgress(submission.userId, submission.challengeId, submission);
    }

    res.json({
      success: true,
      data: submission,
      message: 'Submission graded successfully'
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to grade submission',
      message: error.message
    });
  }
};

// Helper function to update user progress after successful challenge completion
const updateUserProgress = async(user, challenge, submission) => {
  try {
    // Add to completed challenges if not already there
    const existingCompletion = user.challengeProgress.completedChallenges.find(
      c => c.challengeId.toString() === challenge._id.toString()
    );

    if (!existingCompletion) {
      user.challengeProgress.completedChallenges.push({
        challengeId: challenge._id,
        completedDate: new Date(),
        score: submission.grading.score,
        xpEarned: submission.rewards.xpAwarded
      });

      // Update stats
      user.stats.challengesCompleted += 1;
    }

    // Add XP
    const totalXP = submission.rewards.xpAwarded + (submission.rewards.bonusXP || 0);
    user.addXP(totalXP, `Completed challenge: ${challenge.title}`);

    // Award badges
    if (submission.rewards.badgesEarned && submission.rewards.badgesEarned.length > 0) {
      submission.rewards.badgesEarned.forEach(badgeId => {
        user.awardBadge(badgeId, challenge.topic, challenge._id);
      });
    }

    // Update streak
    user.updateStreak();

    // Update activity timestamp
    user.lastActivity = new Date();

    await user.save();

    console.log(`User ${user.profile.name} completed challenge ${challenge.title} for ${totalXP} XP`);
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
};

// Get challenge analytics (admin/instructor)
export const getChallengeAnalytics = async(req, res) => {
  try {
    const { id: challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Get submission statistics
    const submissionStats = await Submission.getSubmissionStats(challengeId);

    // Get top performers
    const topPerformers = await Submission.getTopPerformers(challengeId, 5);

    // Get average completion time
    const completionTimes = await Submission.aggregate([
      { $match: { challengeId: challenge._id, 'metadata.timeSpent': { $exists: true } } },
      {
        $group: {
          _id: null,
          averageTime: { $avg: '$metadata.timeSpent' },
          minTime: { $min: '$metadata.timeSpent' },
          maxTime: { $max: '$metadata.timeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        challenge: {
          id: challenge._id,
          title: challenge.title,
          week: challenge.week,
          topic: challenge.topic,
          type: challenge.type,
          estimatedTime: challenge.estimatedTime
        },
        submissionStats,
        topPerformers,
        completionTimes: completionTimes[0] || {
          averageTime: null,
          minTime: null,
          maxTime: null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching challenge analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
};
