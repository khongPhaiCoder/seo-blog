const router = require("express").Router();

const FormController = require("../controllers/form.controller");
const FormMiddleware = require("../middleware/form.middleware");
const requestValidation = require("../middleware/request-validation.middleware");

router.post(
    "/contact",
    FormMiddleware.contactFormValidator,
    requestValidation,
    FormController.contactForm
);
router.post(
    "/contact-blog-author",
    FormMiddleware.contactFormValidator,
    requestValidation,
    FormController.contactBlogAuthorForm
);

module.exports = router;
