const router = require("express").Router();

const requestValidation = require("../middleware/request-validation.middleware");
const AuthController = require("../controllers/auth.controller");
const TagController = require("../controllers/tag.controller");
const TagMiddleware = require("../middleware/tag.middleware");

router.post(
    "/",
    AuthController.requireSignIn,
    AuthController.adminMiddleware,
    TagMiddleware.bodyValidation,
    requestValidation,
    TagController.create
);

router.get("/tags", TagController.list);

router
    .route("/:slug")
    .get(TagController.read)
    .delete(
        AuthController.requireSignIn,
        AuthController.adminMiddleware,
        TagController.remove
    );

module.exports = router;
