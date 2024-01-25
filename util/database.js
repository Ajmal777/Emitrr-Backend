const mongoose = require("mongoose");
const initializeDatabase = require("./initializeDatabase");
mongoose
    .connect(process.env.MONGODB_URI)
    .then((res) => console.log("DB connected"))
    .catch((err) => console.log(err));
