const replyModel = require("../models/reply.model");

const {
    generateReply
} = require("../services/ai.service");


const generateReplyController = async (req, res) => {

    try {

        const {
            originalEmail,
            tone,
            length,
            context
        } = req.body;


        if (!originalEmail) {

            return res.status(400).json({
                message:
                    "Original email is required."
            });

        }


        const selectedTone =
            tone || "Professional";

        const selectedLength =
            length || "Medium";


        const reply =
            await generateReply({

                originalEmail,

                tone: selectedTone,

                length: selectedLength,

                context

            });


        const savedReply =
            await replyModel.create({

                user:
                    req.user.userId,

                originalEmail,

                tone:
                    selectedTone,

                length:
                    selectedLength,

                context:
                    context || "",

                generatedReply:
                    reply

            });


        return res.status(201).json({

            message:
                "Reply generated successfully.",

            reply,

            replyId:
                savedReply._id

        });


    } catch (error) {

        console.error(
            "AI Reply Generation Error:",
            error
        );

        return res.status(500).json({
            message:
                error.message || "Failed to generate reply."
        });

    }

};


module.exports = {
    generateReplyController
};