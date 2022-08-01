const User = require('../models/user.model');
const { generateOTP, hashPassword } = require('../config/security');
const { sendEmail } = require('../config/middleware');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUpUser = (req, res) => {
  // Validates input data at request time
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() }); // Custom error response if data is invalid
  }

  const data = req.body;
  data.password = hashPassword(data.password);
  // data.token = generateOTP();
  const user = new User(data);
  try {
    user.save().then((result) => {
      const token = jwt.sign({ _id: result._id }, process.env.TOKEN_SECRET);
      res.set('auth-token', token);
      return res.status(201).json({
        message: 'Registration successful.',
        data: {
          user_id: result._id,
          email: result.email,
          verified: result.emailVerified,
          created_at: result.createdAt,
          token,
        },
      });
    });
  } catch (err) {
    // const token = jwt.sign({ _id: data.user_id }, process.env.TOKEN_SECRET);

    res
      .status(400)
      .json({ message: 'An Error occurred! Registration unsuccessful' });
    console.log(err);
  }
};

const signInUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() }); // Custom error response if data is invalid
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send('Email or password is wrong');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Email or password is wrong');

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res
    .header('auth-token', token)
    .send({ status: 'success', msg: 'Login successful', token });
};

module.exports = { signInUser, signUpUser };
