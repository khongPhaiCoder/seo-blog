const apiRouter = require("express").Router();

const authRouter = require("./auth.route");

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
