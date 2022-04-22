const { body } = require("express-validator");

const CategoryMiddleware = {};

CategoryMiddleware.bodyValidation = [
    body("name").not().isEmpty().withMessage("Name is required"),
];

module.exports = CategoryMiddleware;
