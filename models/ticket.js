const mongoose = require('mongoose');
const TicketStatus = require("../models/TicketStatus");
const TicketPriority = require("../models/TicketPriority");
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
  response: {
    type: String,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"TicketStatus"
  },
  priority: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"TicketPriority"
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IssueCategory"
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  complain:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Complain"
  }

}, { timestamps: true });

// Set up the pre-save middleware for the Ticket model
ticketSchema.pre('save', async function (next) {
  try {
    // Check if the 'status' field is not set
    if (!this.status) {
      // Find the default ticket status by name
      const defaultStatus = await TicketStatus.findOne({ name: 'Open' });
      if (!defaultStatus) {
        // If the default ticket status does not exist, create it
        const newStatus = new TicketStatus({
          name: 'Open'
        });
        await newStatus.save();
        this.status = newStatus._id;
      } else {
        // If the default ticket status exists, set the 'status' field to its ID
        this.status = defaultStatus._id;
      }
    }

    // Check if the 'priority' field is not set
    if (!this.priority) {
      // Find the default ticket status by name
      const defaultPriority = await TicketPriority.findOne({ name: 'Low' });
      if (!defaultPriority) {
        // If the default ticket priority does not exist, create it
        const newPriority = new TicketPriority({
          name: 'Low'
        });
        await newPriority.save();
        this.priority = newPriority._id;
      } else {
        // If the default ticket status exists, set the 'status' field to its ID
        this.priority = defaultPriority._id;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;