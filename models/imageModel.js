const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: [ true, 'image url is empty' ],
  },
  imageName: {
    type: String,
    required: [ true, 'image name is empty' ],
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
