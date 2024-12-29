const Notification = require('../models/notificationModel');

const notificationController = {
  async createNotification(req, res) {
    try {
      const { title, message, userId } = req.body;
      const notification = await Notification.create({
        title,
        message,
        user: userId,
        createdBy: req.user._id
      });
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserNotifications(req, res) {
    try {
      const notifications = await Notification.find({ user: req.user._id });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      notification.read = true;
      await notification.save();
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = notificationController;