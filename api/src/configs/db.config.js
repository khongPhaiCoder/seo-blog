const mongoose = require("mongoose");

const connectDatabase = () => {
    const mongoDBUrl = process.env.MONGO_URL;
    console.log("Connecting to MongoDB");

    mongoose
        .connect(mongoDBUrl)
        .then(() => {
            console.log("Successfully connect to MongoDB!");
        })
        .catch((err) => {
            console.log(
                `Could not connect to the database. Exiting now...\n${err}`
            );
            process.exit();
        });
};

module.exports = connectDatabase;
