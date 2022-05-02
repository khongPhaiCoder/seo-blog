const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors/index");
const BlogService = require("../services/blog.service");
const CommentService = require("../services/comment.service");
const wrapAsync = require("../utils/wrap-async");
const convertToTreeView = require("../utils/convert-to-tree-view");

const CommentController = {};

CommentController.create = wrapAsync(async (req, res, next) => {
    const { body, parent } = req.body;

    const payload = { body, user: req.auth._id };

    const parent_obj = await CommentService.findOne({ _id: parent });

    const path = parent_obj
        ? `${parent_obj._doc.path},${parent_obj._id}`
        : `${parent}`;

    const comment = await CommentService.create({ ...payload, path });

    res.status(StatusCodes.CREATED).json({
        message: `Comment ${comment._id.toString()} created.`,
    });
});

CommentController.getComments = wrapAsync(async (req, res, next) => {
    const { parent } = req.query;

    const regex = new RegExp(`${parent}`);

    const comments = await CommentService.find({ path: regex });

    const _comments = comments.map((item) => {
        return {
            ...item._doc,
            _id: item._id.toString(),
        };
    });

    const nestedComment = convertToTreeView(_comments, parent);

    res.status(StatusCodes.OK).json({
        nestedComment,
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
    const { commentId } = req.body;

    const comment = await CommentService.findOne({ _id: commentId });

    if (!comment) {
        throw new CustomError.NotFoundError("Comment not found");
    }

    if (
        req.auth.role !== 1 &&
        req.auth._id.toString() !== comment.user.toString()
    ) {
        throw new CustomError.UnauthorizedError("Access denied");
    }

    const regex = new RegExp(`^${comment._doc.path}`);

    await CommentService.delete(commentId, { path: regex });

    res.status(StatusCodes.OK).json({
        message: `Comment ${commentId} deleted`,
    });
});

module.exports = CommentController;
