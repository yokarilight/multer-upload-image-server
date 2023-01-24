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
	'POST_CREATE_SINGLE_IMAGE_NAME_FILE_REQUIRED': 'Image file or image name is required',
  'DELETE_IMAGE_ID_HASH_REQUIRED': 'Request params id or request body hash is required',

	// files
	'POST_UPLOAD_FILES_REQ_FILES_REQUIRED': 'No files uploaded',
	'DELETE_FILES_FILENAME_REQUIRED': 'Request params id or request body filename is required',
};

module.exports = { successMsgs, errMsgs };
