const router = require("express").Router();

const BlogController = require("../controllers/blog.controller");
const AuthController = require("../controllers/auth.controller");
const BlogMiddleware = require("../middleware/blog.middleware");
const requestValidation = require("../middleware/request-validation.middleware");

router.post(
    "/",
    AuthController.requireSignIn,
    AuthController.adminMiddleware,
    BlogMiddleware.bodyCreateValidation,
    requestValidation,
    BlogController.create
);

router.get("/blogs", BlogController.list);

router.post(
    "/blogs-categories-tags",
    BlogController.listAllBlogsCategoriesTags
);

router
    .route("/:slug")
    .get(BlogController.read)
    .put(
        AuthController.requireSignIn,
        AuthController.adminMiddleware,
        BlogController.update
    )
    .delete(
        AuthController.requireSignIn,
        AuthController.adminMiddleware,
        BlogController.remove
    );

router.post("/blogs/related", BlogController.listRelated);

router.get("/blogs/search", BlogController.listSearch);

// auth user blog crud
router.post(
    "/user/blog",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    BlogController.create
);

router.get("/:username/blogs", BlogController.listByUser);

router
    .route("/user/blog/:slug")
    .post(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        BlogController.react
    )
    .put(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        AuthController.canUpdateDeleteBlog,
        BlogController.update
    )
    .delete(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        AuthController.canUpdateDeleteBlog,
        BlogController.remove
    );

module.exports = router;
