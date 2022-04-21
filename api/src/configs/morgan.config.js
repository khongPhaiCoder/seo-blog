const path = require("path");

const rfs = require("rotating-file-stream");

const morganConfig = {};

morganConfig.accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "..", "..", "log"),
});

module.exports = morganConfig;
