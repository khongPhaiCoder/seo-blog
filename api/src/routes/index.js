const apiRouter = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

module.exports = apiRouter;
