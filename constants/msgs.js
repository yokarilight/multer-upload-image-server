const successMsgs = {
  // images
  'POST_CREATE_SINGLE_IMAGE_NAME_SUCCESS': 'Upload image successfully',
  'DELETE_IMAGES_SUCCESS': 'Delete image successfully',

  // files
  'POST_UPLOAD_FILES_SUCCESS': 'Upload file successfully',
  'DELETE_FILES_SUCCESS': 'Delete file successfully',
};

const errMsgs = {
  // images
  'POST_CREATE_SINGLE_IMAGE_FILE_REQUIRED': 'Image file is required',
  'DELETE_IMAGE_ID_REQUIRED': 'Request params id is required',
  'DELETE_IMAGE_HASH_IMAGEURL_REQUIRED': 'Key "hash" or key "imageUrl" is missing in request body',
  'CANNOT_FIND_THIS_IMAGE': 'Cannot find this image',

  // files
  'POST_UPLOAD_FILES_REQ_FILES_REQUIRED': 'No files uploaded',
  'DELETE_FILES_FILENAME_REQUIRED': 'Request params id or request body filename is required',
};

module.exports = { successMsgs, errMsgs };
