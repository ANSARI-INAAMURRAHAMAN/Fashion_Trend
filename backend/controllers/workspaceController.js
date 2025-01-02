// controllers/workspaceController.js
const Workspace = require('../models/workspaceModel');
const Comment = require('../models/commentModel');
const Task = require('../models/taskModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({ teamId: req.params.teamId })
    .populate('members', 'name email')
    .populate('sharedTrends');
  
  if (!workspace) {
    throw new ErrorResponse('Workspace not found', 404);
  }
  
  res.status(200).json({ success: true, data: workspace });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { content, trendId } = req.body;
  const comment = await Comment.create({
    content,
    trendId,
    userId: req.user.id
  });
  
  // Emit notification event
  req.io.to(`trend_${trendId}`).emit('newComment', { comment });
  
  res.status(201).json({ success: true, data: comment });
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, trendId, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    assignedTo,
    trendId,
    dueDate
  });
  
  // Emit notification event
  req.io.to(`user_${assignedTo}`).emit('newTask', { task });
  
  res.status(201).json({ success: true, data: task });
});