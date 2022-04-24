const BlogModel = require("../models/blog.model");

const BlogService = {};

BlogService.create = async (payload) => {
    const blog = new BlogModel(payload);
    return await blog.save();
};

BlogService.list = async () => {
    return await BlogModel.find({})
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select(
            "_id title slug excerpt categories tags postedBy createdAt updatedAt"
        );
};

BlogService.listAllBlogsCategoriesTags = async (limit = 10, skip = 0) => {
    return await BlogModel.find({})
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username profile")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
            "_id title slug excerpt categories tags postedBy photo createdAt updatedAt"
        );
};

BlogService.findOne = async (payload) => {
    return await BlogModel.findOne(payload)
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select(
            "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt photo"
        );
};

BlogService.remove = async (payload) => {
    return await BlogModel.findOneAndRemove(payload);
};

BlogService.update = async (id, payload) => {
    return await BlogModel.findByIdAndUpdate(
        id,
        {
            $set: payload,
        },
        { new: true }
    );
};

BlogService.listRelated = async (_id, categories, limit = 3) => {
    return await BlogModel.find({
        _id: { $ne: _id },
        categories: { $in: categories },
    })
        .limit(limit)
        .populate("postedBy", "_id name username profile")
        .select("title slug excerpt postedBy photo createdAt updatedAt");
};

BlogService.search = async (keyword) => {
    return await BlogModel.find({
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { body: { $regex: keyword, $options: "i" } },
        ],
    }).select("-body");
};

BlogService.findByField = async (payload) => {
    return await BlogModel.find(payload)
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select(
            "_id title slug excerpt categories postedBy tags photo createdAt updatedAt"
        );
};

module.exports = BlogService;
