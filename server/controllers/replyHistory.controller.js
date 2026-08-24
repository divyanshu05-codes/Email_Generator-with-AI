const replyModel = require("../models/reply.model");


/*
|--------------------------------------------------------------------------
| Get Reply History
|--------------------------------------------------------------------------
*/

const getReplyHistory = async (req, res) => {

    try {

        const replies = await replyModel
            .find({
                user: req.user.userId
            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            replies
        });

    } catch (error) {

        console.error(
            "Get Reply History Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch reply history."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Get Single Reply
|--------------------------------------------------------------------------
*/

const getSingleReply = async (req, res) => {

    try {

        const reply = await replyModel.findOne({

            _id: req.params.id,

            user: req.user.userId

        });


        if (!reply) {

            return res.status(404).json({
                message:
                    "Reply not found."
            });

        }


        return res.status(200).json({
            reply
        });

    } catch (error) {

        console.error(
            "Get Single Reply Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch reply."
        });

    }

};


/*
|--------------------------------------------------------------------------
| Delete Reply
|--------------------------------------------------------------------------
*/

const deleteReply = async (req, res) => {

    try {

        const reply =
            await replyModel.findOneAndDelete({

                _id: req.params.id,

                user: req.user.userId

            });


        if (!reply) {

            return res.status(404).json({
                message:
                    "Reply not found."
            });

        }


        return res.status(200).json({
            message:
                "Reply deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete Reply Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete reply."
        });

    }

};


module.exports = {

    getReplyHistory,

    getSingleReply,

    deleteReply

};