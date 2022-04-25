const router = require("express").Router();

const CommentController = require("../controllers/comment.controller");
const CommentMiddleware = require("../middleware/comment.middleware");
const AuthController = require("../controllers/auth.controller");
const requestValidation = require("../middleware/request-validation.middleware");

router
    .route("/")
    .post(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        CommentMiddleware.createValidation,
        requestValidation,
        CommentController.create
    )
    .put(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        CommentMiddleware.updateValidation,
        requestValidation,
        CommentController.update
    )
    .delete(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        CommentMiddleware.deleteValidation,
        requestValidation,
        CommentController.delete
    );

module.exports = router;
