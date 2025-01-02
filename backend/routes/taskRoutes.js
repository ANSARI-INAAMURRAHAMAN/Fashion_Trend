const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
  createTask, 
  updateTask, 
  getTasksByTeam 
} = require('../controllers/taskController');

// Add OPTIONS handler for PATCH requests
router.options('/:taskId', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

// Ensure PATCH route is properly defined
router.route('/:taskId')
  .patch(protect, updateTask);

router.route('/')
  .post(protect, createTask);

router.route('/team/:teamId')
  .get(protect, getTasksByTeam);

module.exports = router;
