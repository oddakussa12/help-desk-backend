const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ticketSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;