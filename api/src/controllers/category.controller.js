const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");

const CategoryService = require("../services/category.service");
const wrapAsync = require("../utils/wrap-async");

const CategoryController = {};

CategoryController.create = wrapAsync(async (req, res, next) => {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const category = await CategoryService.create({ name, slug });

    res.status(StatusCodes.CREATED).json({
        message: "Category created",
        data: category,
    });
});

CategoryController.read = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const category = await CategoryService.findOne({ slug });

    res.status(StatusCodes.OK).json({
        category: category,
    });
});

CategoryController.list = wrapAsync(async (req, res, next) => {
    const categories = await CategoryService.list();

    res.status(StatusCodes.OK).json({
        categories,
    });
});

CategoryController.remove = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    await CategoryService.remove({ slug });

    res.status(StatusCodes.OK).json({
        message: "Category deleted successfully!",
    });
});

module.exports = CategoryController;
