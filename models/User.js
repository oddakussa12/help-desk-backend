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
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    default: "6474de2e841027567ca95e35"

  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportLevel",
    required: false
  },
  issueCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IssueCategory",
    required: false
  },
  profile_picture: {
    type: String,
  }
}, { timestamps: true });


// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // set default user role
  this.role == null ? this.role = '6474de2e841027567ca95e35' : null
  next();
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).populate('role', 'name');
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