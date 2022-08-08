const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const SECRET = process.env.TOKEN_SECRET

OTP_OPTIONS = { 
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    digits: true,
    specialChars: false,
};

SMTP_SETTINGS = {
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
};

// OTP generator
const generateOTP = () => {
    const OTP = otpGenerator.generate(6, OTP_OPTIONS);
    return OTP;
  };

// Password hashing
const hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}


const decodeJWT = (token) => {
    try {
        tokenData = jwt.verify(token, SECRET);
        return [true, tokenData]
    } catch (err) {
        console.log(err);
        return [false, null]
    };
}


module.exports = {
    decodeJWT,
    generateOTP,
    hashPassword,
    SMTP_SETTINGS
}