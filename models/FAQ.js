const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please enter the title'],
  },
  answer: {
    type: String,
    required: [true, 'Please enter the description'],
  },
  approved: {
    type: Boolean,
    default: false
  },
  category_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"IssueCategory",
    required:false
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', FAQSchema);

module.exports = FAQ;