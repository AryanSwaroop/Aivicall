var mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String },
  contentType: { type: String },
  data: { type: Buffer }, // Binary data
});

module.exports = mongoose.model('File', fileSchema);




