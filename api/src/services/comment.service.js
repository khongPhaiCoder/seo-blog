const CommentModel = require("../models/comment.model");

const CommentService = {};

CommentService.create = async (payload) => {
    const comment = new CommentModel(payload);
    return await comment.save();
};

CommentService.findOne = async (payload) => {
    return CommentModel.findOne(payload);
};

CommentService.find = async (payload) => {
    return CommentModel.find(payload).sort({ path: 1 });
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

CommentService.delete = async (id, payload) => {
    return await CommentModel.find(payload).remove().exec();
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
