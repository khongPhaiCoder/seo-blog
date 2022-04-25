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
        parent: {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
        blog: {
            type: mongoose.Types.ObjectId,
            ref: "Blog",
        },
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
