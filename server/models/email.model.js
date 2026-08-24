const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        purpose: {
            type: String,
            required: true,
            trim: true
        },

        recipient: {
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

        generatedEmail: {
            type: String,
            required: true
        },
        isSaved: {
    type: Boolean,
    default: false
}

    },
    {
        timestamps: true
    }
);

const emailModel = mongoose.model("Email", emailSchema);

module.exports = emailModel;