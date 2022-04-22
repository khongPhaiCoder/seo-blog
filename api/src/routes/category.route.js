const router = require("express").Router();

const CategoryMiddleware = require("../middleware/category.middleware");
const requestValidation = require("../middleware/request-validation.middleware");
const CategoryController = require("../controllers/category.controller");
const AuthController = require("../controllers/auth.controller");

router.post(
    "/",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    CategoryMiddleware.bodyValidation,
    requestValidation,
    CategoryController.create
);

router.get("/categories", CategoryController.list);

router
    .route("/:slug")
    .get(CategoryController.read)
    .delete(
        AuthController.requireSignIn,
        AuthController.adminMiddleware,
        CategoryController.remove
    );

module.exports = router;
