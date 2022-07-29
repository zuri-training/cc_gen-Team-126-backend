const User = require('../models/user.model');
const { generateOTP, hashPassword } = require('../config/security');
const { sendEmail } = require('../config/middleware')
const { validationResult } = require('express-validator');


const signUpUser = ('/register/', async (req, res) => {
  // Validates input data at request time
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array() }); // Custom error response if data is invalid
  }

  const data = req.body;
  data.password = hashPassword(data.password);
  data.token = generateOTP();
  const user = new User(data);
  try {
    user
      .save()
      .then((result) => {
          return res
            .status(201)
            .json({
              message: 'Registration successful.',
              data: { 
                user_id: result._id,
                email: result.email,
                verified: result.emailVerified,
                created_at: result.createdAt
              }
            });
        });
  } catch (err) {
    res
      .status(400)
      .json({ message: "An Error occurred! Registration unsuccessful"});
    console.log(err);
  }
});


const signInUser = (req, res) => {
  res.json({ msg: 'The Login Endpoint is handled here...' });
};


module.exports = { signInUser, signUpUser };
