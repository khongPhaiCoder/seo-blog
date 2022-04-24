const shortId = require("shortid");
const { StatusCodes } = require("http-status-codes");

const UserService = require("../services/user.service");
const wrapAsync = require("../utils/wrap-async");
const CustomError = require("../errors/index");
const { createJWT, requireSignIn } = require("../utils/jwt");
const BlogService = require("../services/blog.service");

const AuthController = {};

AuthController.signup = wrapAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const username = shortId.generate();
    const profile = `${process.env.CLIENT_URL}/profile/${username}`;

    const newUser = await UserService.newUser({
        name,
        email,
        password,
        profile,
        username,
    });

    res.status(StatusCodes.CREATED).json({
        message: "Signup success! Please sign in.",
    });
});

AuthController.signIn = wrapAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserService.findByEmail(email);

    if (!user) {
        throw new CustomError.UnauthenticatedError(
            "Email or password incorrect!"
        );
    }

    if (!user.authenticate(password)) {
        throw new CustomError.UnauthenticatedError(
            "Email or password incorrect!"
        );
    }

    const token = createJWT({
        _id: user._id,
    });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, username, name, role } = user;

    res.status(StatusCodes.OK).json({
        token,
        user: { _id, username, name, email, role },
    });
});

AuthController.signOut = wrapAsync(async (req, res, next) => {
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({
        message: "Sign out success",
    });
});

AuthController.requireSignIn = requireSignIn;

AuthController.authMiddleware = wrapAsync(async (req, res, next) => {
    const userId = req.auth._id;
    const user = await UserService.findById(userId);
    req.profile = user;
    next();
});

AuthController.adminMiddleware = wrapAsync(async (req, res, next) => {
    const userId = req.auth._id;
    const user = await UserService.findById(userId);

    if (user.role !== 1) {
        throw new CustomError.NotFoundError("Admin resource. Access denied!");
    }

    req.profile = user;
    next();
});

AuthController.canUpdateDeleteBlog = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const blog = await BlogService.findOne({ slug });

    if (!blog) {
        throw new CustomError.NotFoundError("Blog not found!");
    }

    const authorizedUser =
        blog.postedBy._id.toString() === req.profile._id.toString();

    if (!authorizedUser) {
        throw new CustomError.UnauthorizedError("You are not authorized!");
    }

    next();
});

module.exports = AuthController;
