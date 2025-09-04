const successMsgs = {
  // common
  'POST_CREATE_SUCCESS': 'Create successfully',
  'PATCH_UPDATE_SUCCESS': 'Update successfully',
  'DELETE_SUCCESS': 'Delete successfully',

  // users
  'POST_CREATE_USER_SUCCESS': 'Create user successfully',
  'DELETE_USER_SUCCESS': 'Delete user successfully',

  // images
  'POST_CREATE_SINGLE_IMAGE_NAME_SUCCESS': 'Upload image successfully',
  'DELETE_IMAGES_SUCCESS': 'Delete image successfully',
};

const errMsgs = {
  // auth
  'MISSING_TOKEN': 'Missing token',
  'INVALID_OR_EXPIRED_TOKEN': 'Invalid or expired token',
  'INVALID_CREDENTIALS': 'Invalid credentials',
  'USER_NOT_ACTIVE': 'User not active',

  // users
  'POST_CREATE_USER_EMAIL_PASSWORD_REQUIRED': 'Email and password are required',
  'POST_CREATE_USER_EMAIL_TAKEN': 'Email is already taken',
  'DELETE_IMAGES_SUCCESS': 'User id is required',

  // images
  'POST_CREATE_SINGLE_IMAGE_FILE_REQUIRED': 'Image file is required',
  'DELETE_IMAGE_ID_IMAGE_NAME_REQUIRED': 'Request params id or imagename is required',
  'CANNOT_FIND_THIS_IMAGE': 'Cannot find this image',

  // files
  'FILE_ID_REQUIRED': 'File id is required',
  'FILENAME_SHOULD_ATTACH': 'Request body should attach fileName',
  // File XXX is already exist. Please...
  'DUPLICATE_FILE_NAME': 'is already existed. Please change your file name',
  'DUPLICATE_TITLE': 'This title is already existed. Please change another title',
  'ISSIGNED_SHOULD_BE_BOOLEAN': 'isSigned should be a boolean in request body',
  'CANNOT_CHANGE_SIGN_STATUS_TO_UNFINISHED': 'Cannot change signature status to unfinished',

  'GET_FILES_FROM_ERROR': 'The key from in request body should be 0 or a natural number',
  'GET_FILES_COUNT_ERROR': 'The key count in request body should be a natural number',
  'NO_FILE_FOUND': 'No file found',
  'CREATE_FILE_SIGN_TITLE_REQUIRED': 'Title is required',
  'CREATE_FILE_SIGN_REQ_FILES_REQUIRED': 'No files uploaded',
  'DELETE_FILES_FILENAME_REQUIRED': 'Request params id or filename is required',
};

module.exports = { successMsgs, errMsgs };
