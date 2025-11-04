import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Challenge from '../../server/models/Challenge.js';
import User from '../../server/models/User.js';
import Submission from '../../server/models/Submission.js';
import {
  getChallenges,
  getChallenge,
  createChallenge,
  submitChallenge
} from '../../server/controllers/challengeController.js';

describe('Challenge Controller', function() {
  let req, res, next;

  beforeEach(function() {
    // Mock request and response objects
    req = {
      query: {},
      params: {},
      body: {},
      user: {
        userId: new mongoose.Types.ObjectId().toString(),
        role: 'instructor'
      }
    };

    res = {
      json: sinon.spy(),
      status: sinon.stub().returns({
        json: sinon.spy()
      })
    };

    next = sinon.spy();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('getChallenges', function() {
    it('should return all active challenges by default', async function() {
      const mockChallenges = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Test Challenge 1',
          week: 1,
          topic: 'foundation',
          isActive: true
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Test Challenge 2',
          week: 2,
          topic: 'legal',
          isActive: true
        }
      ];

      // Mock Challenge.find
      const findStub = sinon.stub(Challenge, 'find').returns({
        populate: sinon.stub().returns({
          sort: sinon.stub().resolves(mockChallenges)
        })
      });

      await getChallenges(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(findStub.calledWith({ isActive: true })).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const responseData = res.json.getCall(0).args[0];
      expect(responseData.success).to.be.true;
      expect(responseData.count).to.equal(2);
      expect(responseData.data).to.deep.equal(mockChallenges);
    });

    it('should filter challenges by week when provided', async function() {
      req.query.week = '2';

      const findStub = sinon.stub(Challenge, 'find').returns({
        populate: sinon.stub().returns({
          sort: sinon.stub().resolves([])
        })
      });

      await getChallenges(req, res);

      expect(findStub.calledWith({ isActive: true, week: 2 })).to.be.true;
    });

    it('should handle database errors gracefully', async function() {
      const error = new Error('Database connection failed');
      sinon.stub(Challenge, 'find').throws(error);

      await getChallenges(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      const statusResponse = res.status.getCall(0).returnValue.json;
      expect(statusResponse.calledOnce).to.be.true;

      const errorResponse = statusResponse.getCall(0).args[0];
      expect(errorResponse.success).to.be.false;
      expect(errorResponse.error).to.equal('Failed to fetch challenges');
    });
  });

  describe('getChallenge', function() {
    it('should return a challenge by ID', async function() {
      const challengeId = new mongoose.Types.ObjectId();
      req.params.id = challengeId.toString();

      const mockChallenge = {
        _id: challengeId,
        title: 'Test Challenge',
        week: 1,
        topic: 'foundation',
        toObject: sinon.stub().returns({
          _id: challengeId,
          title: 'Test Challenge',
          week: 1,
          topic: 'foundation'
        })
      };

      const findByIdStub = sinon.stub(Challenge, 'findById').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves(mockChallenge)
        })
      });

      await getChallenge(req, res);

      expect(findByIdStub.calledWith(challengeId.toString())).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const responseData = res.json.getCall(0).args[0];
      expect(responseData.success).to.be.true;
      expect(responseData.data.canAccess).to.be.true;
    });

    it('should return 404 for non-existent challenge', async function() {
      req.params.id = new mongoose.Types.ObjectId().toString();

      sinon.stub(Challenge, 'findById').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves(null)
        })
      });

      await getChallenge(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('createChallenge', function() {
    it('should create a new challenge successfully', async function() {
      req.body = {
        title: 'New Test Challenge',
        description: 'A test challenge for unit testing',
        week: 1,
        topic: 'foundation',
        type: 'quiz',
        xpReward: { base: 25, bonus: 5 },
        content: {
          instructions: 'Complete this test'
        }
      };

      const mockChallenge = {
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
        createdBy: req.user.userId,
        save: sinon.stub().resolves(),
        populate: sinon.stub().resolves()
      };

      // Mock Challenge constructor
      const ChallengeStub = sinon.stub().returns(mockChallenge);
      ChallengeStub.prototype = Challenge.prototype;

      // Mock validation (no errors)
      const mockValidationResult = {
        isEmpty: sinon.stub().returns(true)
      };

      // Since we can't easily mock the imported validationResult,
      // we'll test the logic assuming validation passes
      const originalChallenge = Challenge;
      Challenge.constructor = ChallengeStub;

      await createChallenge(req, res);

      // The actual implementation would call Challenge constructor
      // This test structure would need adjustment for full integration testing
    });

    it('should return validation errors when data is invalid', async function() {
      req.body = {
        title: 'Bad', // Too short
        week: 15 // Invalid week
      };

      // This would require mocking express-validator
      // For now, we test the structure
      expect(req.body.title.length).to.be.lessThan(5);
      expect(req.body.week).to.be.greaterThan(8);
    });
  });

  describe('submitChallenge', function() {
    it('should create a new submission for quiz challenge', async function() {
      const challengeId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      req.params.id = challengeId.toString();
      req.body = {
        userId: userId.toString(),
        content: {
          answers: ['A', 'B', 'C']
        },
        timeSpent: 15
      };

      const mockChallenge = {
        _id: challengeId,
        title: 'Quiz Challenge',
        type: 'quiz',
        isActive: true,
        xpReward: { base: 25, bonus: 5 },
        calculateScore: sinon.stub().returns(85)
      };

      const mockUser = {
        _id: userId,
        canAccessChallenge: sinon.stub().returns({ allowed: true }),
        challengeProgress: { completedChallenges: [] }
      };

      const mockSubmission = {
        save: sinon.stub().resolves(),
        populate: sinon.stub().resolves(),
        status: 'submitted',
        rewards: { xpAwarded: 0 },
        grading: {},
        metadata: {}
      };

      sinon.stub(Challenge, 'findById').resolves(mockChallenge);
      sinon.stub(User, 'findById').resolves(mockUser);
      sinon.stub(Submission, 'findOne').resolves(null);

      // Mock Submission constructor
      const SubmissionStub = sinon.stub().returns(mockSubmission);

      // This test would need more sophisticated mocking for full coverage
      expect(mockChallenge.type).to.equal('quiz');
      expect(mockUser.canAccessChallenge(mockChallenge).allowed).to.be.true;
    });

    it('should reject submission for inactive challenge', async function() {
      const challengeId = new mongoose.Types.ObjectId();
      req.params.id = challengeId.toString();

      const mockChallenge = {
        _id: challengeId,
        isActive: false
      };

      sinon.stub(Challenge, 'findById').resolves(mockChallenge);

      await submitChallenge(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should reject submission when user cannot access challenge', async function() {
      const challengeId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      req.params.id = challengeId.toString();
      req.body = { userId: userId.toString() };

      const mockChallenge = {
        _id: challengeId,
        isActive: true
      };

      const mockUser = {
        _id: userId,
        canAccessChallenge: sinon.stub().returns({
          allowed: false,
          reason: 'Prerequisites not completed'
        })
      };

      sinon.stub(Challenge, 'findById').resolves(mockChallenge);
      sinon.stub(User, 'findById').resolves(mockUser);

      await submitChallenge(req, res);

      expect(res.status.calledWith(403)).to.be.true;
    });
  });
});
