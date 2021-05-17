  
const mongoose = require("mongoose");

const URI =
  "mongodb+srv://carSystem:DBpass@cluster0.r5zoy.mongodb.net/carsytem?retryWrites=true&w=majority";

const connectDB = async () => {
  mongoose
    .connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
};

module.exports = connectDB;