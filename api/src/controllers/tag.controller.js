const slugify = require("slugify");
const { StatusCodes } = require("http-status-codes");

const TagService = require("../services/tag.service");
const wrapAsync = require("../utils/wrap-async");
const BlogService = require("../services/blog.service");

const TagController = {};

TagController.create = wrapAsync(async (req, res, next) => {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const tag = await TagService.create({ name, slug });

    res.status(StatusCodes.CREATED).json({
        message: "Tag created",
        data: tag,
    });
});

TagController.list = wrapAsync(async (req, res, next) => {
    const tags = await TagService.list();

    res.status(StatusCodes.OK).json({
        data: tags,
    });
});

TagController.read = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const tag = await TagService.findOne({ slug });

    const blogs = await BlogService.findByField({ tags: tag });

    res.status(StatusCodes.OK).json({
        tag: tag,
        blogs: blogs,
    });
});

TagController.remove = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    await TagService.remove({ slug });

    res.status(StatusCodes.OK).json({
        message: "Tag deleted successfully",
    });
});

module.exports = TagController;
