const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const complainSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  response: {
    type: String,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Ticket"
  }
}, { timestamps: true });

const Complain = mongoose.model('Complain', complainSchema);
module.exports = Complain;