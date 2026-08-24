const emailModel = require("../models/email.model");
const replyModel = require("../models/reply.model");

const {
    generateEmail
} = require("../services/ai.service");


/*
|--------------------------------------------------------------------------
| Generate Email
|--------------------------------------------------------------------------
*/

const generateEmailController = async (req, res) => {

    try {

        const {
            purpose,
            recipient,
            tone,
            length,
            context
        } = req.body;


        if (!purpose || !recipient) {

            return res.status(400).json({
                message:
                    "Purpose and recipient are required."
            });

        }


        const generatedEmail = await generateEmail({

            purpose,

            recipient,

            tone:
                tone || "Professional",

            length:
                length || "Medium",

            context

        });


        const savedEmail =
            await emailModel.create({

                user: req.user.userId,

                purpose,

                recipient,

                tone:
                    tone || "Professional",

                length:
                    length || "Medium",

                context:
                    context || "",

                generatedEmail,

                isSaved: false

            });


        return res.status(201).json({

            message:
                "Email generated successfully.",

            email: generatedEmail,

            emailId:
                savedEmail._id,

            isSaved:
                savedEmail.isSaved

        });

    } catch (error) {

        console.error(
            "AI Email Generation Error:",
            error
        );

        return res.status(500).json({
            message:
                error.message || "Failed to generate email."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Save / Unsave Email
|--------------------------------------------------------------------------
*/

const toggleSaveEmailController = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const email =
            await emailModel.findOne({

                _id: id,

                user: req.user.userId

            });


        if (!email) {

            return res.status(404).json({

                message:
                    "Email not found."

            });

        }


        email.isSaved =
            !email.isSaved;


        await email.save();


        return res.status(200).json({

            message:
                email.isSaved
                    ? "Email saved successfully."
                    : "Email removed from saved emails.",

            isSaved:
                email.isSaved

        });

    } catch (error) {

        console.error(
            "Save Email Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update saved email."

        });

    }

};


/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

const getEmailStatsController = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.userId;


        /* Generated emails */

        const aiEmails =
            await emailModel.countDocuments({

                user: userId

            });


        /* Generated replies */

        const aiReplies =
            await replyModel.countDocuments({

                user: userId

            });


        /* Saved emails */

        const savedEmails =
            await emailModel.countDocuments({

                user: userId,

                isSaved: true

            });


        return res.status(200).json({

            aiEmails,

            aiReplies,

            savedEmails

        });

    } catch (error) {

        console.error(
            "Email Stats Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to load email statistics."

        });

    }

};


module.exports = {

    generateEmailController,

    toggleSaveEmailController,

    getEmailStatsController

};