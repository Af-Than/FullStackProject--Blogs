const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');
const { validateToken } = require('../middlewares/authmidwares');

router.get("/",validateToken,    async (req, res) => {
    try {
        const getPosts = await Posts.findAll({
            include: [{ model: Likes, as: 'likes' }]
        });

        const liked= await Likes.findAll({ where: { usernameid: req.user.id } });
        res.json({ getPosts, liked });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        const createdPost = await Posts.create(post);
        res.json(createdPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/byid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Posts.findByPk(id);
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;