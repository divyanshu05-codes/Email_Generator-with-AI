const express = require("express");

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    changePassword,
    deleteAccount,
    forgotPassword,
    resetPassword
} = require("../controllers/auth.controller");

const {
    authUser
} = require("../middleware/auth.middleware");

const router = express.Router();


// Register
router.post(
    "/register",
    registerUser
);


// Login
router.post(
    "/login",
    loginUser
);


// Logout
router.post(
    "/logout",
    logoutUser
);


// Forgot Password
router.post(
    "/forgot-password",
    forgotPassword
);


// Reset Password
router.post(
    "/reset-password/:token",
    resetPassword
);


// Current user
router.get(
    "/me",
    authUser,
    getCurrentUser
);


// Update profile
router.put(
    "/profile",
    authUser,
    updateProfile
);


// Change password
router.put(
    "/change-password",
    authUser,
    changePassword
);


// Delete account
router.delete(
    "/account",
    authUser,
    deleteAccount
);


module.exports = router;