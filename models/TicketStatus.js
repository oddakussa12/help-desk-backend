const mongoose = require('mongoose');

const TicketStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter ticket status name'],
    unique: true,
  }
});

const TicketStatus = mongoose.model('TicketStatus', TicketStatusSchema);

module.exports = TicketStatus;