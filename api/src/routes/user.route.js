const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");

router.get(
    "/profile",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    UserController.read
);

module.exports = router;
