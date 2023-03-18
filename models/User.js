const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number']
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  role:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Role",
    required:true

  },
  level:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"SupportLevel",
    required:false
  },
  profile_picture:{
    type:String,
  }
}, { timestamps: true });


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // set default user role
  this.role == null ? this.role = '63e4b00845c49269e5de2aa6' : null
  next();
});

// static method to login user
userSchema.statics.login = async function(phone_number, password) {
  const phone = phone_number;
  const user = await this.findOne({ phone }).populate('role','name');
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect phone');
};

const User = mongoose.model('user', userSchema);

module.exports = User;