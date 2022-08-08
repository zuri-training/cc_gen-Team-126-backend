const { Router } = require('express');
const { check } = require('express-validator');
const { 
    validateEmail, validatePassword 
} = require('../config/middleware');
const { 
    signInUser,
    signUpUser,
    verifyUser,
    forgotPassword,
    resetPassword
} = require('../controllers/user.controller');


const router = Router();

router.post('/register', [
    validateEmail, validatePassword
    ], signUpUser);

router.post('/login', [
    check("email", "Field `email` is required").exists(),
    check("password", "Field `password` is required").exists()
    ], signInUser);

router.put("/verify-email", [
    check("email", "Field `email` is required").exists(),
    check("otp", "Field `otp` is required").exists()
    ], verifyUser);

router.post("/forgot-password", [
    check("email", "Please enter a valid email").isEmail(),
    ], forgotPassword);

router.put("/reset-password/:token", [
    validatePassword,
    check("confirmPassword", "Field `confirmPassword` is required").exists()
    ], resetPassword);


module.exports = router;
