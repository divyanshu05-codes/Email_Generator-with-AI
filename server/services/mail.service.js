const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


const sendPasswordResetEmail = async ({
    email,
    name,
    resetUrl
}) => {

    const mailOptions = {

        from:
            process.env.SMTP_FROM ||
            process.env.SMTP_USER,

        to: email,

        subject:
            "Reset your MailMind AI password",

        text: `
Hello ${name},

We received a request to reset your MailMind AI password.

Use the following link to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
MailMind AI
        `,

        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background: #f5f7fb;
    font-family: Arial, sans-serif;
">

    <div style="
        max-width: 560px;
        margin: 40px auto;
        background: white;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    ">

        <h1 style="
            margin-bottom: 10px;
            color: #111827;
        ">
            Reset your password
        </h1>

        <p style="
            color: #64748b;
            line-height: 1.7;
        ">
            Hi ${name},
        </p>

        <p style="
            color: #64748b;
            line-height: 1.7;
        ">
            We received a request to reset your
            MailMind AI password.
        </p>

        <a
            href="${resetUrl}"
            style="
                display: inline-block;
                margin: 20px 0;
                padding: 13px 24px;
                background: #4f46e5;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: bold;
            "
        >
            Reset Password
        </a>

        <p style="
            color: #64748b;
            line-height: 1.7;
        ">
            This link will expire in
            <strong>15 minutes</strong>.
        </p>

        <p style="
            color: #94a3b8;
            line-height: 1.7;
            font-size: 13px;
        ">
            If you didn't request this password reset,
            you can safely ignore this email.
        </p>

        <hr style="
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 30px 0;
        ">

        <p style="
            color: #94a3b8;
            font-size: 12px;
        ">
            MailMind AI
        </p>

    </div>

</body>
</html>
        `
    };

    await transporter.sendMail(
        mailOptions
    );
};


module.exports = {
    sendPasswordResetEmail
};