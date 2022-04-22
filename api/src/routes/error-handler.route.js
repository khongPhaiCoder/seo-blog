const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong, try again later.";
    const data = err.data;

    res.status(status).json({
        error: message,
        data: data,
    });
};

module.exports = errorHandler;
