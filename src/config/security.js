const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');

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
generateOTP = () => {
    const OTP = otpGenerator.generate(8, OTP_OPTIONS);
    return OTP;
  };

// Password hashing
hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}


module.exports = {
    generateOTP,
    hashPassword,
    SMTP_SETTINGS
}