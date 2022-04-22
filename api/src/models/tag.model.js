const mongoose = require("mongoose");

const CustomError = require("../errors/index");

const TagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
    },
    { timestamps: true }
);

TagSchema.post("save", (error, doc, next) => {
    if (
        error.name === "MongoServerError" &&
        error.code === 11000 &&
        error.keyPattern.slug === 1
    ) {
        next(new CustomError.BadRequestError("Category already exist!"));
    } else {
        console.log(error);
        next(error);
    }
});

module.exports = mongoose.model("Tag", TagSchema);
