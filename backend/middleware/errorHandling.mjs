const errorhandling = (err, req, res, next) => {
    console.log(errorhandling.stack);

    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err: {}
    })
}