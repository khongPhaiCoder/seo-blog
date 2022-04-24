const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");

router.get(
    "/profile",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    UserController.read
);

router.get("/:username", UserController.publicProfile);

router.put(
    "/update",
    AuthController.requireSignIn,
    AuthController.authMiddleware,
    UserController.update
);

module.exports = router;
