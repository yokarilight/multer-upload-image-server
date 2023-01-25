const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  fileLocation: {
    type: String,
    required: [ true, 'file location is empty' ],
  },
  fileName: {
    type: String,
    required: [ true, 'file name is empty' ],
  },
  fileKey: {
    type: String,
    required: [ true, 'file key is empty' ],
  },
  fileEtag: {
    type: String,
    required: [ true, 'file etag is empty' ],
  },
  fileBucket: {
    type: String,
    required: [ true, 'file bucket is empty' ],
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;