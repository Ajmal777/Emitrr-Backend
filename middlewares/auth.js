const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const { token } = req.headers;
    if (!token)
        return res.status(401).json({
            status: 401,
            message: 'Token Not found',
        });

    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (payload) {
        req.locals = payload;
        next();
    } else {
        return res.status(401).send({
            status: 401,
            message: "Invaid token / User not logged in",
        });
    }
};
