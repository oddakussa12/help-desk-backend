const mongoose = require('mongoose');

const SupportLevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter level name'],
    unique: true,
  }
});

const SupportLevel = mongoose.model('SupportLevel', SupportLevelSchema);

module.exports = SupportLevel;