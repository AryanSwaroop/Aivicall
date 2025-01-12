const mongoose = require("mongoose");
require("dotenv").config();

class db {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGO_URI);
    }

    close() {
        mongoose.connection.close();
    }
}

module.exports = db;