const { Router } = require('express');
const { signInUser, signUpUser } = require('../controllers/user.controller');
const { validateEmail, validatePassword } = require('../config/middleware');

const router = Router();

router.post('/register', [validateEmail, validatePassword], signUpUser);

router.post('/login', signInUser);

module.exports = router;
