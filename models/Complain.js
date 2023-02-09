const mongoose = require('mongoose');

const ComplainSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the title'],
  },
  description: {
    type: String,
    required: [true, 'Please enter the description'],
  },
  ticket_id: {
    type: String,
    required: [true, 'Ticket ID is required'],
  },
  created_by: {
    type: String,
    required: [true, 'User Id is required'],
  },

}, { timestamps: true });

const Complain = mongoose.model('Complain', ComplainSchema);

module.exports = Complain;