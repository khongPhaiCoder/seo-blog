const mongoose = require("mongoose");

const { hashPassword, comparePassword } = require("../utils/bcrypt");
const CustomError = require("../errors/index");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
        },
        profile: {
            type: String,
            required: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        about: {
            type: String,
        },
        role: {
            type: Number,
            default: 0,
        },
        photo: {
            type: String,
            default: "default-photo.jpg",
        },
        resetPasswordLink: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;

        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.post("save", (error, doc, next) => {
    if (
        error.name === "MongoServerError" &&
        error.code === 11000 &&
        error.keyPattern.email === 1
    ) {
        next(new CustomError.BadRequestError("Email already exist!"));
    } else {
        next(error);
    }
});

UserSchema.methods = {
    authenticate: function (plainPassword) {
        return comparePassword(plainPassword, this.hashed_password);
    },
    encryptPassword: function (password) {
        if (!password) return "";
        return hashPassword(password);
    },
};

module.exports = mongoose.model("User", UserSchema);
