const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String,
});

module.exports = mongoose.model("User", userSchema);
