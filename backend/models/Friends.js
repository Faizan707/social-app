const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;