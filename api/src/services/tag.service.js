const TagModel = require("../models/tag.model");

const TagService = {};

TagService.create = async (payload) => {
    const tag = new TagModel(payload);
    return await tag.save();
};

TagService.remove = async (payload) => {
    return await TagModel.findOneAndRemove(payload);
};

TagService.findOne = async (payload) => {
    return await TagModel.findOne(payload);
};

TagService.list = async () => {
    return await TagModel.find({});
};

module.exports = TagService;
