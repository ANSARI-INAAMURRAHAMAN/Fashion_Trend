// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createTeam,
  getTeams,
  joinTeam,
  getAvailableUsers,
  getTeamById,          // Add this
  getTeamTasks         // Add this
} = require('../controllers/teamController');

router.post('/', protect, createTeam);
router.get('/', protect, getTeams);
router.post('/:teamId/join', protect, joinTeam);
router.get('/available-users', protect, getAvailableUsers);

// Add these new routes
router.get('/:teamId', protect, getTeamById);
router.get('/:teamId/tasks', protect, getTeamTasks);

module.exports = router;