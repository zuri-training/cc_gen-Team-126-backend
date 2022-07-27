const { Router } = require('express');
const { signInUser, signUpUser } = require('../controllers/user.controller');

const router = Router();

router.post('/register', signUpUser);

router.post('/login', signInUser);

module.exports = router;
