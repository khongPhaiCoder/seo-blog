const CategoryModel = require("../models/category.model");

const CategoryService = {};

CategoryService.create = async (payload) => {
    const category = new CategoryModel(payload);
    return await category.save();
};

CategoryService.remove = async (payload) => {
    return await CategoryModel.findOneAndRemove(payload);
};

CategoryService.findOne = async (payload) => {
    return await CategoryModel.findOne(payload);
};

CategoryService.list = async () => {
    return await CategoryModel.find({});
};

module.exports = CategoryService;
