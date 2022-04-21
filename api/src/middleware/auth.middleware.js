const { body } = require("express-validator");

const AuthMiddleware = {};

AuthMiddleware.bodySignupValidation = [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

AuthMiddleware.bodySignInValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

module.exports = AuthMiddleware;
