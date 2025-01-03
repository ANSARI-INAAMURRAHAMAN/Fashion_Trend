const Comment = require('../models/commentModel');
const Trend = require('../models/trendModel');

// Create a comment for either a task or trend
const createComment = async (req, res) => {
    try {
        const { content, trendId, taskId } = req.body;
        
        const comment = new Comment({
            content,
            trendId,
            taskId,
            user: req.user._id
        });

        await comment.save();
        
        // Populate user data before sending response
        await comment.populate('user', 'username');

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
};

// Get comments for a specific task
const getTaskComments = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .populate('user', 'username')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get comments for a specific trend
const getTrendComments = async (req, res) => {
    try {
        const comments = await Comment.find({ trendId: req.params.trendId })
            .populate('user', 'username')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createComment,
    getTaskComments,
    getTrendComments
};
