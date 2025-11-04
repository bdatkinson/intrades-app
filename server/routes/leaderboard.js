import express from 'express';
const router = express.Router();

// Basic leaderboard routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Get leaderboard - to be implemented' });
});

router.get('/weekly', (req, res) => {
  res.json({ message: 'Get weekly leaderboard - to be implemented' });
});

router.get('/cohort/:id', (req, res) => {
  res.json({ message: `Get cohort ${req.params.id} leaderboard - to be implemented` });
});

export default router;
