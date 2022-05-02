const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        path: {
            type: String,
            default: null,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
