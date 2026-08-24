const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        originalEmail: {
            type: String,
            required: true,
            trim: true
        },

        tone: {
            type: String,
            default: "Professional"
        },

        length: {
            type: String,
            default: "Medium"
        },

        context: {
            type: String,
            default: ""
        },

        generatedReply: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const replyModel = mongoose.model(
    "Reply",
    replySchema
);

module.exports = replyModel;