const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    token: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
