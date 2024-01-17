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
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  assigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Ticket",
    required: true
  },
  status:{
    type:String,
    default: 'Open'
  }
}, { timestamps: true });

const Complain = mongoose.model('Complain', complainSchema);
module.exports = Complain;