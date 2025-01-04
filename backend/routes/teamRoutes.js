// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createTeam, 
  getTeamById, 
  getTeams, 
  joinTeam, 
  getTeamTasks,
  getAvailableUsers,
  getAllTeams 
} = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware'); // Updated path

// Apply auth middleware to all routes
router.use(protect);

// Team routes
router.route('/')
  .post(createTeam)
  .get(getTeams);

router.get('/all', getAllTeams);
router.get('/available-users', getAvailableUsers);
router.get('/:teamId', getTeamById);
router.get('/:teamId/tasks', getTeamTasks);
router.post('/:teamId/join', joinTeam);

module.exports = router;