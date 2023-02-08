const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the title'],
  },
  description: {
    type: String,
    required: [true, 'Please enter the description'],
  },
  approved: {
    type: Boolean,
    default: false
  },
});

const FAQ = mongoose.model('FAQ', FAQSchema);

module.exports = FAQ;