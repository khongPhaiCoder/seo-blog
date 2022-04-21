const fs = require("fs");
const path = require("path");

const clearImage = (filename) => {
    const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        filename
    );
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = clearImage;
