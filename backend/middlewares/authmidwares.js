const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        return res.status(401).json({ error: "user is not logged in" });
    }

    try {
        const validToken = verify(accessToken, "importantsecret");
        if (validToken) {
            req.user = validToken;
            return next();
        }
        return res.status(401).json({ error: "invalid token" });
    } catch (err) {
        return res.status(401).json({ error: "invalid token" });
    }
};

module.exports = { validateToken };