const successHandle = (res, data, statusCode = 200) => {
  res.send({
    status: true,
    code: statusCode,
    data
  });
}

module.exports = successHandle;
