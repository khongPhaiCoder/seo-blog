const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const BlogService = require("../services/blog.service");

const CommentService = require("../services/comment.service");
const wrapAsync = require("../utils/wrap-async");

const CommentController = {};

CommentController.create = wrapAsync(async (req, res, next) => {
    const { body, parent, blog } = req.body;

    const payload = { body };
    payload.user = req.auth._id;
    if (parent) {
        payload.parent = parent;
    } else if (blog) {
        payload.blog = blog;
    } else {
        throw new CustomError.BadRequestError(
            "blog id or comment parent id is required"
        );
    }

    const comment = await CommentService.create(payload);

    if (parent) {
        await CommentService.addComment(parent, comment._id);
    } else if (blog) {
        await BlogService.addComment(blog, comment._id);
    }

    res.status(StatusCodes.CREATED).json({
        message: `Comment ${comment._id.toString()} created.`,
    });
});

CommentController.update = wrapAsync(async (req, res, next) => {
    const { commentId, body } = req.body;

    const comment = await CommentService.findOne({ _id: commentId });

    if (req.auth._id.toString() !== comment.user.toString()) {
        throw new CustomError.UnauthorizedError("Access denied");
    }

    const newComment = await CommentService.update(commentId, { body });

    res.status(StatusCodes.OK).json(newComment);
});

CommentController.delete = wrapAsync(async (req, res, next) => {
    const { commentId, blog, parent } = req.body;

    const comment = await CommentService.findOne({ _id: commentId });

    if (
        req.auth.role !== 1 &&
        req.auth._id.toString() !== comment.user.toString()
    ) {
        throw new CustomError.UnauthorizedError("Access denied");
    }

    if (parent) {
        await CommentService.removeComment(parent, commentId);
    } else if (blog) {
        await BlogService.removeComment(blog, commentId);
    } else {
        throw new CustomError.NotFoundError("Comment not found!");
    }

    await CommentService.delete(commentId);

    res.status(StatusCodes.OK).json({
        message: `Comment ${commentId} deleted`,
    });
});

module.exports = CommentController;
