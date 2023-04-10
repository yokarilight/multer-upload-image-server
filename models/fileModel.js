const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  signTitle: {
    type: String,
    required: [ true, 'sign title is empty' ],
  },
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
  },
  isSigned: {
    type: Boolean,
    required: [ true, 'isSigned is empty' ],
  },
  date: {
    type: Number,
    required: [ true, 'date is empty' ],
  },
  modifiedDate: {
    type: Number,
    required: [ true, 'modified date is empty' ],
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;