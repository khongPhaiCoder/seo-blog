const jwt = require("jsonwebtoken");
const { expressjwt: expressJWT } = require("express-jwt");

const createJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};

const decodedJWTToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const requireSignIn = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

module.exports = {
    createJWT,
    decodedJWTToken,
    requireSignIn,
};
