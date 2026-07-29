const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/authmidwares');

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await Users.create({
            username: username,
            password: hash
        });

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );

        res.json({ accessToken, username: user.username, id: user.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Users.findOne({ where: { username: username } });
        if (!user) return res.json({ error: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const accessToken = sign(
                { username: user.username, id: user.id },
                "importantsecret"
            );
            res.json({ accessToken, username: user.username, id: user.id });
        } else {
            res.json({ error: "Incorrect password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/check", validateToken, async (req, res) => {
    res.json({ success: "User is authenticated", user: req.user, username: req.user.username, id: req.user.id });
});

module.exports = router;