const { check } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const { SMTP_SETTINGS } = require('./security');
const validateEmail = check('email');
const validatePassword = check('password');
const regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{6,}$/;
const transporter = nodemailer.createTransport(SMTP_SETTINGS);

// Validation chain for checking email
validateEmail
  .custom(async (email) => {
    if (!email) {
      throw new Error('Field `email` is required');
    }
  })
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Email is invalid')
  .custom(async (email) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Email already in use');
    }
  });

// Validation chain for checking password
validatePassword.trim().custom(async (password) => {
  if (!password) {
    throw new Error('Field `password` is required');
  } else if (!password.match(regex)) {
    throw new Error(
      'Password must contain min. of 8 characters,\
                and atleast1 Uppercase, 1 lowercase, 1 number,\
                1 special character and no spaces'
    );
  }
});

// Email template for verifying user
const sendEmail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME, // Sender's address
      to: params.email, // Receiver's address list
      subject: params.subject, // Subject line
      html: params.template
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  sendEmail,
};
