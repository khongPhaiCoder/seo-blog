const { body } = require("express-validator");

const TagMiddleware = {};

TagMiddleware.bodyValidation = [
    body("name").not().isEmpty().withMessage("Name is required"),
];

module.exports = TagMiddleware;
