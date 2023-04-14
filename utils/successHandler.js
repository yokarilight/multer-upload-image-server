const successHandle = (res, data) => {
  res.send({
    status: true,
    code: 200,
    data
  });
}

module.exports = successHandle;
