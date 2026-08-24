const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/mail.service");


/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

const generateToken = (userId) => {

    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};


/*
|--------------------------------------------------------------------------
| Cookie Options
|--------------------------------------------------------------------------
*/

const cookieOptions = {

    httpOnly: true,

    secure:
        process.env.NODE_ENV === "production",

    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",

    maxAge:
        7 * 24 * 60 * 60 * 1000

};


/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "All fields are required."
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters."
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const existingUser =
            await userModel.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "User already exists."
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await userModel.create({

                name: name.trim(),

                email: normalizedEmail,

                password: hashedPassword

            });


        const token =
            generateToken(user._id);


        res.cookie(
            "token",
            token,
            cookieOptions
        );


        return res.status(201).json({

            message:
                "User registered successfully.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required."
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const user =
            await userModel.findOne({
                email: normalizedEmail
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });

        }


        const token =
            generateToken(user._id);


        res.cookie(
            "token",
            token,
            cookieOptions
        );


        return res.json({

            message:
                "Login successful.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

const logoutUser = async (req, res) => {

    res.clearCookie(
        "token",
        {
            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax"
        }
    );


    return res.json({
        message:
            "Logout successful."
    });

};


/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

const getCurrentUser = async (req, res) => {

    try {

        const user =
            await userModel
                .findById(req.user.userId)
                .select("-password");


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found."
            });

        }


        return res.json({
            user
        });

    } catch (error) {

        console.error(
            "Get User Error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            email
        } = req.body;


        if (!name || !email) {

            return res.status(400).json({
                message:
                    "Name and email are required."
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const existingUser =
            await userModel.findOne({

                email: normalizedEmail,

                _id: {
                    $ne: req.user.userId
                }

            });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "This email is already in use."
            });

        }


        const user =
            await userModel.findByIdAndUpdate(

                req.user.userId,

                {
                    name: name.trim(),

                    email: normalizedEmail

                },

                {
                    new: true,

                    runValidators: true
                }

            ).select("-password");


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found."
            });

        }


        return res.status(200).json({

            message:
                "Profile updated successfully.",

            user

        });

    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to update profile."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({
                message:
                    "Current and new passwords are required."
            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                message:
                    "New password must be at least 6 characters."
            });

        }


        const user =
            await userModel.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found."
            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message:
                    "Current password is incorrect."
            });

        }


        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );


        if (isSamePassword) {

            return res.status(400).json({
                message:
                    "New password must be different."
            });

        }


        user.password =
            await bcrypt.hash(
                newPassword,
                10
            );


        await user.save();


        return res.status(200).json({
            message:
                "Password changed successfully."
        });

    } catch (error) {

        console.error(
            "Change Password Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to change password."
        });

    }

};

const deleteAccount = async (req, res) => {

    try {

        const user =
            await userModel.findByIdAndDelete(
                req.user.userId
            );

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found."
            });

        }

        res.clearCookie(
            "token",
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production"
                        ? "none"
                        : "lax"
            }
        );

        return res.status(200).json({
            message:
                "Account deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete Account Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete account."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await userModel.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        const clientUrl =
            process.env.CLIENT_URL || "http://localhost:5173";

        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        try {
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                await sendPasswordResetEmail({
                    email: user.email,
                    name: user.name,
                    resetUrl
                });
            } else {
                console.log("==================================================");
                console.log("SMTP not configured. Password Reset Link (Dev):");
                console.log(resetUrl);
                console.log("==================================================");
            }
        } catch (mailError) {
            console.error("Mail Send Error:", mailError);
            console.log("Fallback Password Reset Link (Dev):", resetUrl);
        }

        return res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        return res.status(500).json({
            message: "Server error. Please try again later."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid or expired password reset link."
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message:
                "Password reset successfully. You can now log in."
        });

    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to reset password."
        });

    }

};


module.exports = {

    registerUser,

    loginUser,

    logoutUser,

    getCurrentUser,

    updateProfile,

    changePassword,

    deleteAccount,

    forgotPassword,

    resetPassword

};