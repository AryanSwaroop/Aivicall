const mongoose = require("mongoose");
require("dotenv").config();

class db {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017");
    }

    close() {
        mongoose.connection.close();
    }
}

module.exports = db;