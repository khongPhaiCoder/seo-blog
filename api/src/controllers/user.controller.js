const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const UserService = require("../services/user.service");
const BlogService = require("../services/blog.service");
const wrapAsync = require("../utils/wrap-async");

const UserController = {};

UserController.read = wrapAsync(async (req, res, next) => {
    const profile = await UserService.read(req.profile._id);
    return res.status(StatusCodes.OK).json(profile);
});

UserController.publicProfile = wrapAsync(async (req, res, next) => {
    const username = req.params.username;

    const user = await UserService.findByField({ username });

    if (!user) {
        throw new CustomError.NotFoundError("User not found!");
    }

    const blogs = await BlogService.findByField({ postedBy: user._id });

    res.status(StatusCodes.OK).json({
        user,
        blogs,
    });
});

UserController.update = wrapAsync(async (req, res, next) => {
    const { about, role, password, username, name } = req.body;

    const updateInfo = { about, password, username, name };

    if (req.files && req.files.photo) {
        updateInfo.photo = req.files.photo[0].filename;
    }

    if (req?.profile?.role === 1) {
        updateInfo.role = role;
    }

    const user = await UserService.update(req.profile._id, updateInfo);

    res.status(StatusCodes.OK).json(user);
});

module.exports = UserController;
