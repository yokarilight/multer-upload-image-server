const successHandle = (res, data) => {
	res.send({
		status: true,
		data
	});
}

module.exports = successHandle;
