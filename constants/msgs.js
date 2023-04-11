const successMsgs = {
  // images
  'POST_CREATE_SINGLE_IMAGE_NAME_SUCCESS': 'Upload image successfully',
  'DELETE_IMAGES_SUCCESS': 'Delete image successfully',

  // files
  'CREATE_FILE_SUCCESS': 'Create successfully',
  'PATCH_UPDATE_FILE_SUCCESS': 'Update file successfully',
  'DELETE_FILES_SUCCESS': 'Delete file successfully',
};

const errMsgs = {
  // images
  'POST_CREATE_SINGLE_IMAGE_FILE_REQUIRED': 'Image file is required',
  'DELETE_IMAGE_ID_REQUIRED': 'Request params id or hash or imageStr is required',
  'CANNOT_FIND_THIS_IMAGE': 'Cannot find this image',

  // files
  'FILE_ID_REQUIRED': 'File id is required',
  // File XXX is already exist. Please...
  'DUPLICATE_FILE_NAME': 'is already existed. Please change your file name',
  'DUPLICATE_TITLE': 'This title is already existed. Please change another title',
  'QUERY_STRING_ISSIGNED_ERROR': 'Query string isSigned should attach string, true or false',

  'GET_FILES_FROM_ERROR': 'The key from in request body should be 0 or a natural number',
  'GET_FILES_COUNT_ERROR': 'The key count in request body should be a natural number',
  'CREATE_FILE_SIGN_TITLE_REQUIRED': 'Title is required',
  'CREATE_FILE_SIGN_REQ_FILES_REQUIRED': 'No files uploaded',
  'DELETE_FILES_FILENAME_REQUIRED': 'Request params id or filename is required',
};

module.exports = { successMsgs, errMsgs };
