const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");
const AuthMiddleware = require("../middleware/auth.middleware");
const requestValidation = require("../middleware/request-validation.middleware");

router.post(
    "/signup",
    AuthMiddleware.bodySignupValidation,
    requestValidation,
    AuthController.signup
);

router.post(
    "/signin",
    AuthMiddleware.bodySignInValidation,
    requestValidation,
    AuthController.signIn
);

router.get("/signout", AuthController.signOut);

router.put(
    "/forgot-password",
    AuthMiddleware.forgotPasswordValidator,
    requestValidation,
    AuthController.forgotPassword
);

router.put(
    "/reset-password",
    AuthMiddleware.resetPasswordValidator,
    requestValidation,
    AuthController.resetPassword
);

module.exports = router;
