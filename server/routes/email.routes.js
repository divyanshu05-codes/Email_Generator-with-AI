const express = require("express");

const {
    generateEmailController,
    toggleSaveEmailController,
    getEmailStatsController
} = require("../controllers/email.controller");

const {
    authUser
} = require("../middleware/auth.middleware");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| Generate Email
|--------------------------------------------------------------------------
*/

router.post(
    "/generate",
    authUser,
    generateEmailController
);


/*
|--------------------------------------------------------------------------
| Save / Unsave Email
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/save",
    authUser,
    toggleSaveEmailController
);


/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/stats",
    authUser,
    getEmailStatsController
);


module.exports = router;