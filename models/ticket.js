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
  status: {
    type: String,
    default: "Pending",
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;