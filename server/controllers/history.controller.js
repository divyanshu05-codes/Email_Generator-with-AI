const emailModel = require("../models/email.model");

const getEmailHistory = async (req, res) => {

    try {

        const emails = await emailModel
            .find({
                user: req.user.userId
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            emails
        });

    } catch (error) {

        console.error(
            "Get Email History Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch email history."
        });
    }
};

const getSingleEmail = async (req, res) => {

    try {

        const email = await emailModel.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!email) {
            return res.status(404).json({
                message: "Email not found."
            });
        }

        res.status(200).json({
            email
        });

    } catch (error) {

        console.error(
            "Get Single Email Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch email."
        });
    }
};

const deleteEmail = async (req, res) => {

    try {

        const email = await emailModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!email) {
            return res.status(404).json({
                message: "Email not found."
            });
        }

        res.status(200).json({
            message: "Email deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete Email Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete email."
        });
    }
};

module.exports = {
    getEmailHistory,
    getSingleEmail,
    deleteEmail
};