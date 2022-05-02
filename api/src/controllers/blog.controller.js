const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const { StatusCodes } = require("http-status-codes");

const wrapAsync = require("../utils/wrap-async");
const { smartTrim } = require("../utils/smart-trim");
const BlogService = require("../services/blog.service");
const CategoryService = require("../services/category.service");
const UserService = require("../services/user.service");
const TagService = require("../services/tag.service");
const CustomError = require("../errors");

const BlogController = {};

BlogController.create = wrapAsync(async (req, res, next) => {
    const { title, body, categories, tags } = req.body;

    let image;
    if (req.files && req.files.photo) {
        image = req.files.photo[0].filename;
    }

    const payload = {
        title,
        body,
        categories: categories && categories.split(","),
        tags: tags && tags.split(","),
        excerpt: smartTrim(body, 320, " ", "..."),
        slug: slugify(title).toLowerCase(),
        mtitle: `${title} | ${process.env.APP_NAME}`,
        mdesc: stripHtml(body.substring(0, 160)).result,
        postedBy: req.auth._id,
        photo: image,
    };

    const blog = await BlogService.create(payload);

    res.status(StatusCodes.CREATED).json(blog);
});

BlogController.list = wrapAsync(async (req, res, next) => {
    const blogs = await BlogService.list();

    res.status(StatusCodes.OK).json(blogs);
});

BlogController.listAllBlogsCategoriesTags = wrapAsync(
    async (req, res, next) => {
        const limit = req.body.limit ? +req.body.limit : 10;
        const skip = req.body.skip ? +req.body.skip : 0;

        const blogs = await BlogService.listAllBlogsCategoriesTags(limit, skip);
        const categories = await CategoryService.list();
        const tags = await TagService.list();

        res.status(StatusCodes.OK).json({
            blogs,
            categories,
            tags,
            size: blogs.length,
        });
    }
);

BlogController.read = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const blog = await BlogService.findOne({ slug });

    res.status(StatusCodes.OK).json(blog);
});

BlogController.remove = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    await BlogService.remove({ slug });

    res.status(StatusCodes.OK).json({
        message: "Blog deleted successfully",
    });
});

BlogController.update = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const blog = await BlogService.findOne({ slug });

    const { body, categories, tags } = req.body;

    let image;
    if (req.files && req.files.photo) {
        image = req.files.photo[0].filename;
    }

    const payload = {
        body: body || blog._doc.body,
        excerpt: body ? smartTrim(body, 320, " ", "...") : blog._doc.excerpt,
        desc: body ? stripHtml(body.substring(0, 160)).result : blog._doc.desc,
        categories: categories ? categories.split(",") : blog._doc.categories,
        tags: tags ? tags.split(",") : blog._doc.tags,
        photo: image || blog._doc.photo,
    };

    const result = await BlogService.update(blog._id, payload);

    res.status(StatusCodes.OK).json(result);
});

BlogController.listRelated = wrapAsync(async (req, res, next) => {
    const limit = req.body.limit ? +req.body.limit : 3;
    const { _id, categories } = req.body;

    const blogs = await BlogService.listRelated(_id, categories, limit);

    res.status(StatusCodes.OK).json(blogs);
});

BlogController.listSearch = wrapAsync(async (req, res, next) => {
    const { search } = req.query;

    let blogs;

    if (search) {
        blogs = await BlogService.search(search);
    }

    res.status(StatusCodes.OK).json(blogs);
});

BlogController.listByUser = wrapAsync(async (req, res, next) => {
    const user = await UserService.findByField({
        username: req.params.username,
    });

    const blogs = await BlogService.findByField({ postedBy: user._id });

    res.status(StatusCodes.OK).json(blogs);
});

BlogController.react = wrapAsync(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const blog = await BlogService.findOne({ slug });

    if (!blog) {
        throw new CustomError.NotFoundError(`${slug} not found!`);
    }

    let likes_count = +blog._doc.likes_count || 0;
    const user = req.auth._id;

    let action;

    if (blog._doc?.likes && blog._doc?.likes.includes(user)) {
        BlogService.pull(blog._id, { likes: user });
        action = "Dislike";
        likes_count--;
    } else {
        BlogService.push(blog._id, { likes: user });
        action = "Like";
        likes_count++;
    }

    likes_count = likes_count >= 0 ? likes_count : 0;

    await BlogService.update(blog._id, { likes_count });

    res.status(StatusCodes.OK).json({
        message: `${action} to blog ${slug}`,
        likes_count,
    });
});

module.exports = BlogController;
