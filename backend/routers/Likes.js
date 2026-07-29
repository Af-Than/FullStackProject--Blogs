    const express = require('express');
    const router = express.Router();
    const { Likes } = require('../models');
    const { validateToken } = require('../middlewares/authmidwares');

    router.post("/", validateToken, async (req, res) => {
        try {
            const { postId } = req.body;
            const userID = req.user.id;

            const found = await Likes.findOne({ where: { postId: postId, usernameid: userID } });
            if (!found) {
                const like = await Likes.create({ postId: postId, usernameid: userID });
                res.json({ message  : "Like added", like: like });
            } else {
                await Likes.destroy({ where: { postId: postId, usernameid: userID } });
                res.json({ message: "Like removed" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    module.exports = router;    