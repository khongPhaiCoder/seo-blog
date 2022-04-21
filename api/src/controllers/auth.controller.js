const shortId = require("shortid");
const { StatusCodes } = require("http-status-codes");

const UserService = require("../services/user.service");
const wrapAsync = require("../utils/wrap-async");
const CustomError = require("../errors/index");
const { createJWT, requireSignIn } = require("../utils/jwt");

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

    const { _id, username, name } = user;

    res.status(StatusCodes.OK).json({
        token,
        user: { _id, username, name, email },
    });
});

AuthController.signOut = wrapAsync(async (req, res, next) => {
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({
        message: "Sign out success",
    });
});

AuthController.requireSignIn = requireSignIn;

module.exports = AuthController;