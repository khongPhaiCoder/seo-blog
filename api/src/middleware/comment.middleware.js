const { body } = require("express-validator");

const CommentMiddleware = {};

CommentMiddleware.createValidation = [
    body("body")
        .not()
        .isEmpty()
        .withMessage("Enter a comment..., body is required"),
    body("parent").optional().isMongoId(),
    body("blog").optional().isMongoId(),
];

CommentMiddleware.updateValidation = [
    body("body")
        .not()
        .isEmpty()
        .withMessage("Enter a comment..., body is required"),
    body("commentId").isMongoId().withMessage("Comment id is required"),
    body("user").isMongoId().withMessage("User Id is required"),
];

CommentMiddleware.deleteValidation = [
    body("commentId").isMongoId().withMessage("Comment id is required"),
    body("parent").optional().isMongoId(),
    body("blog").optional().isMongoId(),
];

module.exports = CommentMiddleware;
