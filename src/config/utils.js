const verifyEmailTemplate = (otp) => {
    let template = `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
        <h2>Registration Successful</h2>
        <h4>Verify Your Email by entering the OTP below</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h4 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h4>
        <p style="margin-top:50px;">If you did not signup on Zuri's CC Gen Website, please kindly ignore this mail.</p>
        </div>
        `
    return template;
}


const passwordResetTemplate = (token) => {
    let template = `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h2>Password reset link</h2>
            <h4>Click on the link below or copy and paste it into your browser within 5 minutes to reset your password</h4>
            <h4 style="font-size: 18px; letter-spacing: 1px; text-align:center;">http://localhost:3000/api/auth/reset-password/${token}</h4>
            <p style="margin-top:50px;">If you did not request for a password reset, please kindly review your security settings.</p>
        </div>
        `
    return template;
}


module.exports = {
    verifyEmailTemplate,
    passwordResetTemplate,
}