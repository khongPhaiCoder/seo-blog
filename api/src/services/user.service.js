const UserModel = require("../models/user.model");

const UserService = {};

UserService.newUser = async (payload) => {
    const user = new UserModel(payload);
    return await user.save();
};

UserService.findByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
};

UserService.findById = async (id) => {
    return await UserModel.findById(id);
};

module.exports = UserService;
