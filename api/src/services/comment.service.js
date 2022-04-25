const CommentModel = require("../models/comment.model");

const CommentService = {};

CommentService.create = async (payload) => {
    const comment = new CommentModel(payload);
    return await comment.save();
};

CommentService.findOne = async (payload) => {
    return CommentModel.findOne(payload);
};

CommentService.update = async (id, payload) => {
    return await CommentModel.findByIdAndUpdate(
        id,
        {
            $set: payload,
        },
        { new: true }
    );
};

CommentService.delete = async (id) => {
    return await CommentModel.findByIdAndDelete(id);
};

CommentService.addComment = async (id, childId) => {
    return await CommentModel.findByIdAndUpdate(id, {
        $push: { comments: childId },
    });
};

CommentService.removeComment = async (id, childId) => {
    return await CommentModel.findByIdAndUpdate(id, {
        $pull: { comments: childId },
    });
};

module.exports = CommentService;
