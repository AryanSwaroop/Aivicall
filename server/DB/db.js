const mongoose = require("mongoose");

class db {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb://localhost:27017/Aivicall");
    }

    close() {
        mongoose.connection.close();
    }
}

module.exports = db;