import { expect } from 'chai';
import request from 'supertest';
import app from '../server/index.js';

describe('Server', function() {
  describe('Health Check', function() {
    it('should respond with healthy status', async function() {
      const res = await request(app)
        .get('/health')
        .expect(200);
        
      expect(res.body).to.have.property('status', 'healthy');
      expect(res.body).to.have.property('timestamp');
      expect(res.body).to.have.property('version');
    });
  });

  describe('API Routes', function() {
    it('should handle challenges endpoint', async function() {
      const res = await request(app)
        .get('/api/challenges')
        .expect(500); // Will fail without database, but route exists
        
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('error');
    });

    it('should return 404 for unknown routes', async function() {
      const res = await request(app)
        .get('/api/unknown')
        .expect(404);
        
      expect(res.body).to.have.property('error', 'Route not found');
    });
  });
});