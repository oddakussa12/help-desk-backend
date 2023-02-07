const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  refresh_token: {
    type: String,
  }
});


const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;