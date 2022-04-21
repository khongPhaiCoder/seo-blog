const BadRequestError = require("./bad-request.error");
const NotFoundError = require("./not-found.error");
const UnauthenticatedError = require("./unauthenticated.error");
const UnauthorizedError = require("./unauthorized.error");

const CustomError = {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError,
};

module.exports = CustomError;
