const Team = require('../models/teamModel');
const asyncHandler = require('../utils/asyncHandler');

exports.updateTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const team = await Team.findOne({ 
      'initialTasks._id': taskId 
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const task = team.initialTasks.id(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task status
    task.status = status;
    await team.save();

    // Send response
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, teamId, dueDate } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  team.initialTasks.push({
    title,
    description,
    assignedTo,
    dueDate,
    status: 'pending',
    createdBy: req.user._id
  });

  await team.save();

  res.status(201).json({
    success: true,
    data: team.initialTasks[team.initialTasks.length - 1]
  });
});

exports.getTasksByTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate('initialTasks.assignedTo', 'username email');

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  res.json({
    success: true,
    data: team.initialTasks
  });
});
