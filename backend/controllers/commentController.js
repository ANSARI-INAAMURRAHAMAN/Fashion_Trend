// controllers/commentController.js
const Comment = require('../models/commentModel');

const addComment = async (req, res) => {
    try {
        const { content, taskId, trendId } = req.body;
        const comment = await Comment.create({
            content,
            taskId,
            trendId,
            author: req.user._id
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name');

        res.status(201).json({
            success: true,
            data: populatedComment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getTaskComments = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .populate('author', 'name')
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
    addComment,
    getTaskComments
};
