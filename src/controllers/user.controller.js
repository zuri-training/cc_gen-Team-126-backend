const signUpUser = (req, res) => {
  res.json({ msg: 'The SignUp Endpoint is handled here...' });
};

const signInUser = (req, res) => {
  res.json({ msg: 'The Login Endpoint is handled here...' });
};

module.exports = { signInUser, signUpUser };
