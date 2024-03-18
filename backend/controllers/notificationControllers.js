const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createNotification = asyncHandler(async (req, res) => {
  try {
    const { senderId } = req.body;
    const newNotification = new Notification({
      senderId,
      userId: req.user._id,
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getNotifications, createNotification, deleteNotification };
