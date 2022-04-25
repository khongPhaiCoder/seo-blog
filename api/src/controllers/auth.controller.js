const shortId = require("shortid");
const { StatusCodes } = require("http-status-codes");
const sgMail = require("@sendgrid/mail");
const { OAuth2Client } = require("google-auth-library");

const UserService = require("../services/user.service");
const wrapAsync = require("../utils/wrap-async");
const CustomError = require("../errors/index");
const { createJWT, requireSignIn, decodedJWTToken } = require("../utils/jwt");
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

AuthController.forgotPassword = wrapAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await UserService.findByEmail(email);

    if (!user) {
        throw new CustomError.NotFoundError(
            "User with that email does not exist!"
        );
    }

    const token = createJWT({ _id: user._id }, "10m");

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password reset link`,
        html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
        `,
    };

    await UserService.update(user._id, { resetPasswordLink: token });

    await sgMail.send(emailData);

    res.status(StatusCodes.OK).json({
        message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min`,
    });
});

AuthController.resetPassword = wrapAsync(async (req, res, next) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        if (!decodedJWTToken(resetPasswordLink)) {
            throw new CustomError.UnauthorizedError("Expired link. Try again");
        }

        const user = await UserService.findByField({ resetPasswordLink });

        if (!user) {
            throw new CustomError.BadRequestError(
                "Something went wrong. Try later"
            );
        }

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
        };

        await UserService.update(user._id, updatedFields);

        res.status(StatusCodes.OK).json({
            message: "Great! Now you can login with your new password",
        });
    }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
AuthController.googleLogin = wrapAsync(async (req, res, next) => {
    const idToken = req.body.tokenId;
    const response = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email_verified, name, email, jti } = response.payload;

    if (!email_verified) {
        throw new CustomError.BadRequestError(
            "Google login failed. Try again."
        );
    }

    const user = await UserService.findByEmail(email);

    if (user) {
        const token = createJWT({ _id: user._id });
        res.cookie("token", token, { expiresIn: "1d" });
        const { _id, email, name, role, username } = user;

        return res
            .status(StatusCodes.OK)
            .json({ token, user: { _id, email, name, role, username } });
    } else {
        const username = shortId.generate();
        const profile = `${process.env.CLIENT_URL}/profile/${username}`;
        const password = jti;

        const user = await UserService.newUser({
            name,
            email,
            profile,
            username,
            password,
        });
        const token = createJWT({ _id: user._id });
        res.cookie("token", token, { expiresIn: "1d" });
        const { _id, email, name, role } = user;
        return res.status(StatusCodes.OK).json({
            token,
            user: { _id, email, name, role, username },
        });
    }
});

module.exports = AuthController;
