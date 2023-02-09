const mongoose = require('mongoose');

const IssueCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the name'],
  },
}, { timestamps: true });

const IssueCategory = mongoose.model('IssueCategory', IssueCategorySchema);

module.exports = IssueCategory;