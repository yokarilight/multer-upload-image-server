const { errMsgs } = require('../constants/msgs');
const File = require('../models/fileModel');
const { isNaturalNumber, isValidFrom } = require('./utils');

const checkFileId = (id) => {
  if (!id) {
    throw new Error(errMsgs.FILE_ID_REQUIRED);
  }
}

const checkSignDuplicateTitle = async (title) => {
  const existFile = await File.findOne({
    'signTitle': title
  });

  if (existFile) {
    throw new Error(errMsgs.DUPLICATE_TITLE);
  }
}

const checkFileDuplicateTitle = async (req) => {
  const existFile = await File.findOne({
    'fileName': req.files[0].originalname
  });

  if (existFile) {
    throw new Error(`${existFile.fileName} ${errMsgs.DUPLICATE_FILE_NAME}`);
  }
}

const fileApiValidate = {
  getFilesValidate: ({ from, count }) => {
    if (!isValidFrom(Number(from))) {
      throw new Error(errMsgs.GET_FILES_FROM_ERROR);
    }

    if (!isNaturalNumber(Number(count))) {
      throw new Error(errMsgs.GET_FILES_COUNT_ERROR);
    }
  },
  getSingleFileValidate: (id) => {
    checkFileId(id);
  },
  createSignFileValidate: async (req) => {
    if (!req.files.length) {
      throw new Error(errMsgs.CREATE_FILE_SIGN_REQ_FILES_REQUIRED);
    }

    await checkFileDuplicateTitle(req);
  },
  updateSignInfoValidate: async ({ id, title, isSigned }) => {
    checkFileId(id);

    if (isSigned === false) {
      throw new Error(errMsgs.CANNOT_CHANGE_SIGN_STATUS_TO_UNFINISHED);
    }

    if (isSigned && typeof isSigned !== 'boolean') {
      throw new Error(errMsgs.ISSIGNED_SHOULD_BE_BOOLEAN);
    }

    await checkSignDuplicateTitle(title);
  },
  updateFileInfoValidate: async (req, id) => {
    checkFileId(id);
    await checkFileDuplicateTitle(req);
  },
  deleteFilesValidate: ({ id, filename }) => {
    if (!id || !filename) {
      throw new Error(errMsgs.DELETE_FILES_FILENAME_REQUIRED);
    }

    checkFileId(id);
  }
}

module.exports =  fileApiValidate;
