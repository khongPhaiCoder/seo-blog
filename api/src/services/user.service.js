const UserModel = require("../models/user.model");

const UserService = {};

UserService.newUser = async (payload) => {
    const user = new UserModel(payload);
    return await user.save();
};

UserService.update = async (id, payload) => {
    return await UserModel.findByIdAndUpdate(
        id,
        {
            $set: payload,
        },
        { new: true }
    );
};

UserService.findByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
};

UserService.findById = async (id) => {
    return await UserModel.findById(id);
};

UserService.findByField = async (payload) => {
    return await UserModel.findOne(payload).select(
        "-hashed_password -resetPasswordLink -createdAt -updatedAt -__v"
    );
};

UserService.read = async (id) => {
    return await UserModel.findById(id).select("-hashed_password");
};

module.exports = UserService;
