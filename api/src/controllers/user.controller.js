const { StatusCodes } = require("http-status-codes");

const UserController = {};

UserController.read = (req, res, next) => {
    req.profile.hashed_password = undefined;
    return res.status(StatusCodes.OK).json({
        profile: req.profile,
    });
};

module.exports = UserController;
