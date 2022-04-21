const path = require("path");

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
require("dotenv").config();

const connectDatabase = require("./src/configs/db.config");
const morganConfig = require("./src/configs/morgan.config");
const multerConfig = require("./src/configs/multer.config");

// database
connectDatabase();

// app
const app = express();

// middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("combined", { stream: morganConfig.accessLogStream }));
app.use(multer(multerConfig.options).fields(multerConfig.fields));
app.use(
    "/images",
    (req, res, next) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Cross-Origin-Resource-Policy", "same-site");
        next();
    },
    express.static(path.join(__dirname, "public", "images"))
);

// cors
if (process.env.NODE_ENV === "development") {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// routes
app.use("/api", require("./src/routes/index"));
app.use(require("./src/routes/error-handler.route"));

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
