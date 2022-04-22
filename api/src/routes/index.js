const apiRouter = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const categoryRouter = require("./category.route");
const tagRouter = require("./tag.route");
const blogRouter = require("./blog.route");

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/tag", tagRouter);
apiRouter.use("/blog", blogRouter);

module.exports = apiRouter;
