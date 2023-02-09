const mongoose = require('mongoose');

const TicketPrioritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter priority name'],
    unique: true,
  }
}, { timestamps: true });

const TicketPriority = mongoose.model('TicketPriority', TicketPrioritySchema);

module.exports = TicketPriority;