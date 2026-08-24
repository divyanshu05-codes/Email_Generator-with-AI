const express = require("express");

const {
    getReplyHistory,
    getSingleReply,
    deleteReply
} = require("../controllers/replyHistory.controller");

const {
    authUser
} = require("../middleware/auth.middleware");


const router = express.Router();


router.get(
    "/",
    authUser,
    getReplyHistory
);


router.get(
    "/:id",
    authUser,
    getSingleReply
);


router.delete(
    "/:id",
    authUser,
    deleteReply
);


module.exports = router;