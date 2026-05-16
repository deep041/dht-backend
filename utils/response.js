function sendResponse(res, statusCode, responseCode, success, message, data = null) {
    return res.status(statusCode).json({
        success,
        responseCode,
        message,
        data
    });
}

module.exports = sendResponse;
