const express = require("express");

const {
    generateReplyController
} = require("../controllers/reply.controller");

const {
    authUser
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/generate",
    authUser,
    generateReplyController
);

module.exports = router;