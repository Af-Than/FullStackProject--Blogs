const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        return res.status(401).json({ error: "user is not logged in" });
    }

    try {
        // Read secret from .env, fallback to default if undefined
        const secret = process.env.JWT_SECRET || "importantsecret"; 
        
        const validToken = verify(accessToken, secret);
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