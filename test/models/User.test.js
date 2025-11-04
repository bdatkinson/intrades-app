import { expect } from 'chai';
import mongoose from 'mongoose';
import User, { tradeSpecialties, progressTiers, userRoles } from '../../server/models/User.js';

describe('User Model', function() {
  before(async function() {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/intrades-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async function() {
    // Clean up and close connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async function() {
    // Clear the users collection before each test
    await User.deleteMany({});
  });

  describe('User Creation', function() {
    it('should create a valid user with required fields', async function() {
      const userData = {
        auth: {
          local: {
            email: 'test@example.com',
            username: 'testuser',
            hashedPassword: 'hashedpass123'
          }
        },
        profile: {
          name: 'Test User'
        },
        tradeSpecialty: 'electrician',
        currentEmployment: 'employee',
        cohort: {
          id: new mongoose.Types.ObjectId(),
          name: 'Test Cohort',
          startDate: new Date(),
          instructor: new mongoose.Types.ObjectId()
        }
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).to.exist;
      expect(savedUser.auth.local.email).to.equal('test@example.com');
      expect(savedUser.profile.name).to.equal('Test User');
      expect(savedUser.tradeSpecialty).to.equal('electrician');
      expect(savedUser.role).to.equal('student'); // default
      expect(savedUser.progressTier).to.equal('apprentice'); // default
      expect(savedUser.stats.exp).to.equal(0); // default
    });

    it('should not create user without required fields', async function() {
      const user = new User({});

      try {
        await user.save();
        expect.fail('Should have failed validation');
      } catch (error) {
        expect(error).to.be.instanceOf(mongoose.Error.ValidationError);
      }
    });

    it('should validate trade specialty enum', async function() {
      const userData = {
        auth: {
          local: {
            email: 'test2@example.com',
            username: 'testuser2',
            hashedPassword: 'hashedpass123'
          }
        },
        profile: {
          name: 'Test User 2'
        },
        tradeSpecialty: 'invalid-trade',
        currentEmployment: 'employee',
        cohort: {
          id: new mongoose.Types.ObjectId(),
          name: 'Test Cohort',
          startDate: new Date(),
          instructor: new mongoose.Types.ObjectId()
        }
      };

      const user = new User(userData);

      try {
        await user.save();
        expect.fail('Should have failed validation for invalid trade specialty');
      } catch (error) {
        expect(error).to.be.instanceOf(mongoose.Error.ValidationError);
        expect(error.errors.tradeSpecialty).to.exist;
      }
    });
  });

  describe('User Methods', function() {
    let user;

    beforeEach(async function() {
      const userData = {
        auth: {
          local: {
            email: 'method-test@example.com',
            username: 'methodtest',
            hashedPassword: 'hashedpass123'
          }
        },
        profile: {
          name: 'Method Test User'
        },
        tradeSpecialty: 'plumber',
        currentEmployment: 'employee',
        cohort: {
          id: new mongoose.Types.ObjectId(),
          name: 'Test Cohort',
          startDate: new Date(),
          instructor: new mongoose.Types.ObjectId()
        }
      };

      user = new User(userData);
      await user.save();
    });

    describe('addXP', function() {
      it('should add XP and update level', function() {
        const initialExp = user.stats.exp;
        const initialLevel = user.stats.level;

        user.addXP(150);

        expect(user.stats.exp).to.equal(initialExp + 150);
        expect(user.stats.level).to.equal(Math.floor(user.stats.exp / 100) + 1);
      });

      it('should promote tier when XP threshold is reached', function() {
        expect(user.progressTier).to.equal('apprentice');

        user.addXP(150); // Should promote to journeyman

        expect(user.progressTier).to.equal('journeyman');
      });
    });

    describe('awardBadge', function() {
      it('should award a new badge', function() {
        const initialBadgeCount = user.badges.length;

        const awarded = user.awardBadge('test-badge', 'foundation');

        expect(awarded).to.be.true;
        expect(user.badges.length).to.equal(initialBadgeCount + 1);
        expect(user.badges[user.badges.length - 1].badgeId).to.equal('test-badge');
      });

      it('should not award duplicate badges', function() {
        user.awardBadge('duplicate-badge', 'foundation');
        const badgeCount = user.badges.length;

        const awarded = user.awardBadge('duplicate-badge', 'foundation');

        expect(awarded).to.be.false;
        expect(user.badges.length).to.equal(badgeCount);
      });
    });

    describe('calculateTier', function() {
      it('should return correct tier for XP amount', function() {
        expect(user.calculateTier(50)).to.equal('apprentice');
        expect(user.calculateTier(150)).to.equal('journeyman');
        expect(user.calculateTier(400)).to.equal('master');
        expect(user.calculateTier(700)).to.equal('contractor');
        expect(user.calculateTier(1200)).to.equal('boss');
      });
    });
  });

  describe('Virtual Properties', function() {
    let user;

    beforeEach(async function() {
      const userData = {
        auth: {
          local: {
            email: 'virtual-test@example.com',
            username: 'virtualtest',
            hashedPassword: 'hashedpass123'
          }
        },
        profile: {
          name: 'Virtual Test User'
        },
        tradeSpecialty: 'hvac',
        currentEmployment: 'contractor',
        cohort: {
          id: new mongoose.Types.ObjectId(),
          name: 'Test Cohort',
          startDate: new Date(),
          instructor: new mongoose.Types.ObjectId(),
          currentWeek: 3
        },
        challengeProgress: {
          currentWeek: 3,
          completedChallenges: [
            { challengeId: new mongoose.Types.ObjectId(), completedDate: new Date(), score: 85, xpEarned: 25 },
            { challengeId: new mongoose.Types.ObjectId(), completedDate: new Date(), score: 92, xpEarned: 30 }
          ]
        },
        businessProfile: {
          llcStatus: { filed: true },
          banking: { accountOpened: true },
          insurance: { quotesObtained: false },
          website: { launched: false },
          operations: { firstJobCompleted: false }
        }
      };

      user = new User(userData);
      await user.save();
    });

    it('should calculate completion rate correctly', function() {
      const expectedRate = Math.round((2 / (3 * 5)) * 100); // 2 completed out of 15 possible (3 weeks * 5 challenges)
      expect(user.completionRate).to.equal(expectedRate);
    });

    it('should calculate business progress percentage', function() {
      const expectedPercentage = Math.round((2 / 5) * 100); // 2 completed out of 5 milestones
      expect(user.businessProgressPercentage).to.equal(expectedPercentage);
    });

    it('should return next tier requirement', function() {
      user.stats.exp = 50; // Apprentice level
      user.progressTier = 'apprentice';

      const nextTier = user.nextTierRequirement;

      expect(nextTier).to.not.be.null;
      expect(nextTier.tier).to.equal('journeyman');
      expect(nextTier.xpRequired).to.equal(100);
      expect(nextTier.xpRemaining).to.equal(50);
    });
  });

  describe('Static Methods', function() {
    beforeEach(async function() {
      // Create test users
      const users = [
        {
          auth: { local: { email: 'user1@example.com', username: 'user1', hashedPassword: 'hash1' } },
          profile: { name: 'User 1' },
          tradeSpecialty: 'electrician',
          currentEmployment: 'employee',
          stats: { exp: 250 },
          cohort: { id: new mongoose.Types.ObjectId(), name: 'Cohort A', startDate: new Date(), instructor: new mongoose.Types.ObjectId() }
        },
        {
          auth: { local: { email: 'user2@example.com', username: 'user2', hashedPassword: 'hash2' } },
          profile: { name: 'User 2' },
          tradeSpecialty: 'plumber',
          currentEmployment: 'contractor',
          stats: { exp: 500 },
          cohort: { id: new mongoose.Types.ObjectId(), name: 'Cohort B', startDate: new Date(), instructor: new mongoose.Types.ObjectId() }
        }
      ];

      await User.insertMany(users);
    });

    it('should find user by email', async function() {
      const user = await User.findByEmail('user1@example.com');

      expect(user).to.not.be.null;
      expect(user.profile.name).to.equal('User 1');
    });

    it('should find user by username', async function() {
      const user = await User.findByUsername('user2');

      expect(user).to.not.be.null;
      expect(user.profile.name).to.equal('User 2');
    });

    it('should get leaderboard sorted by XP', async function() {
      const leaderboard = await User.getLeaderboard();

      expect(leaderboard).to.have.length(2);
      expect(leaderboard[0].stats.exp).to.be.greaterThan(leaderboard[1].stats.exp);
      expect(leaderboard[0].profile.name).to.equal('User 2'); // Higher XP
    });
  });
});
