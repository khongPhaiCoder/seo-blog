const apiRouter = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const categoryRouter = require("./category.route");

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/category", categoryRouter);

module.exports = apiRouter;
