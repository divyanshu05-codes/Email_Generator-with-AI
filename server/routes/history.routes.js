const express = require("express");

const {
    getEmailHistory,
    getSingleEmail,
    deleteEmail
} = require("../controllers/history.controller");

const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
    "/",
    authUser,
    getEmailHistory
);

router.get(
    "/:id",
    authUser,
    getSingleEmail
);

router.delete(
    "/:id",
    authUser,
    deleteEmail
);

module.exports = router;