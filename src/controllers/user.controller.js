const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.TOKEN_SECRET
const User = require('../models/user.model');
const { sendEmail } = require('../config/middleware');
const { validationResult } = require('express-validator');
const { generateOTP, hashPassword, decodeJWT } = require('../config/security');
const { verifyEmailTemplate, passwordResetTemplate } = require('../config/utils');


const signUpUser = (req, res) => {
  // Validates input data at request time
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const data = req.body;
  data.password = hashPassword(data.password);
  data.otp = generateOTP();
  const user = new User(data);
  try {
      user.save().then((result) => {
        const params = { 
          email: result.email,
          template: verifyEmailTemplate(result.otp),
          subject: "Welcome to Zuri's CC Gen Website."
        };
        
        if (sendEmail(params)) {
            msg = "Registration successful.";
        } else {
            msg = "User registered but OTP not sent";
        }
        return res.status(201).json({
          message: msg,
          data: {
            user_id: result._id,
            email: result.email,
            verified: result.emailVerified,
            created_at: result.createdAt,
            otp: result.otp
          },
        });
      });
    } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send({
        message: "Server Error! Registration unsuccessful"
      });
    }
};


const signInUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });  // Custom error response if data is invalid
  }
  
  const {email, password} = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) 
      return res.status(400).json({
          message: 'Email or password is wrong'
      });
    
    if (!user.emailVerified)
      return res.status(401).json({
          message: 'User is not verified'
      });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) 
      return res.status(400).json({
          message: 'Email or password is wrong'
      });

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
    res
      .header('auth-token', token)
      .send({ 
        status: 'success', message: 'Login successful' 
      });
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).send({
      message: 'Server Error! Login unsuccessful'
    });
  }
};


const verifyUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'User not found'
        });
    }
    if (user.otp != otp) {
        return res.status(401).json({
            message: 'OTP invalid. Access Denied'
        });
    }
    user.emailVerified = true;
    user.save()
    return res.status(200).json({
        message: 'Email verification successful',
        user_verified: user.emailVerified
    })
  } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send({
        message: 'Server Error! Verification failed'
      });
  }
}


const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
  }
  const email = req.body.email;

  try {
      const user = await User.findOne({ email });
      if (!user){
          return res.status(400).json({
              message: 'User not found'
          });
      }
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "5m"});
      const params = { 
          email: email,
          template: passwordResetTemplate(token),
          subject: 'Password Recovery'
      };
      
      if (sendEmail(params)) {
          return res.status(200).json({
              message: `Password reset link sent to ${email}`,
              token
          });
      }
  } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send({
        message: 'Server Error! Link not sent'
      });
  }
}


const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
  }

  const token = req.params.token;
  const { password, confirmPassword } = req.body;
  if (password != confirmPassword){
      return res.status(400).json({
          message: `Passwords entered don't match`
      });
  }

  tokenData = decodeJWT(token);
  if (!tokenData[0]){
    return res.status(401).json({
      message: 'Token invalid or expired'
    });
  }
  try {
      const user = await User.findById({ _id: tokenData[1].id });
      if (!user){
          return res.status(400).json({
              message: 'User not found'
          });
      }
      user.password = hashPassword(password);
      user.save().then((result) => {
          if (result) {
              return res.status(200).json({
                  message: 'Password reset successful'
              });
          }
      })
  } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send({
        message: 'Server Error! Password reset failed'
      });
  }
}


module.exports = { 
  signInUser,
  signUpUser,
  verifyUser,
  forgotPassword,
  resetPassword,
};
