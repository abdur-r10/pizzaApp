const errorHandler  = (err, req, res, next) => {
    //if status code exists use that if not then se status code 500
    const statusCode = res.statusCode ? res.statusCode : 500


    //if in production mode then we don't want to show the error stack
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })

    //no next is needed in this error handler middleware as we want to end when we have an error
    res.status(500).end()
}


module.exports = {
    errorHandler,
}

//* Handles the error from the request