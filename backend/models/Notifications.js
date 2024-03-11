const mongoose = require('mongoose');
const { Schema } = mongoose;
const notificationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }, { timestamps: true });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  module.exports = Notification;

  