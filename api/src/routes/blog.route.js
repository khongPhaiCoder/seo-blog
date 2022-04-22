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

router.post(
    "/blogs/related",
    BlogMiddleware.bodyRelatedValidation,
    requestValidation,
    BlogController.listRelated
);

router.get("/blogs/search", BlogController.listSearch);

// auth user blog crud
router.post(
    "/user/blog",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    BlogController.create
);

router
    .route("/user/blog/:slug")
    .put(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        BlogController.update
    )
    .delete(
        AuthController.requireSignIn,
        AuthController.authMiddleware,
        BlogController.remove
    );

module.exports = router;
