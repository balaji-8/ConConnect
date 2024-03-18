const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // createdAt: { type: Date, default: Date.now },
  },
  { timestaps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
