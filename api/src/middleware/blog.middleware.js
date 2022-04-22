const { body, check } = require("express-validator");
const mongoose = require("mongoose");
const CustomError = require("../errors/index");

const BlogMiddleware = {};

BlogMiddleware.bodyCreateValidation = [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("body")
        .not()
        .isEmpty()
        .withMessage("Body is required")
        .isLength({ min: 200 })
        .withMessage("Content is too short."),
    body("categories")
        .not()
        .isEmpty()
        .withMessage("At least one category is required"),
    body("tags").not().isEmpty().withMessage("At least one tag is required"),
];

BlogMiddleware.bodyRelatedValidation = [
    check("blog._id").isMongoId().withMessage("Please give valid blog id"),
    check("blog.categories")
        .isArray()
        .custom((value) => {
            value.forEach((item) => {
                if (!mongoose.Types.ObjectId.isValid(item)) {
                    throw new CustomError.BadRequestError(
                        "Invalid category id"
                    );
                }
            });

            return true;
        })
        .withMessage("Please give valid array of category id"),
];

module.exports = BlogMiddleware;
