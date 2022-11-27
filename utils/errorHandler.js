const errorHandle = (res, err, statusCode) => {
	let message = err?.message ?? 'invalid router';

	res.status(statusCode).send({
		status: true,
		message
	});
}

module.exports = errorHandle;
