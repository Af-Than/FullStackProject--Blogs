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
        post.authorname=req.user.username; // Set the username from the authenticated user
        post.userId=req.user.id; // Set the userId from the authenticated user
        const createdPost = await Posts.create(post);
        res.json(createdPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }                      
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({where: {id: postId, authorname: req.user.username}})
    res.json({ message: "Post deleted" });
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
router.get("/byuserid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const list = await Posts.findAll({ where: { userId: id }});
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});
router.put("/:id", validateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.authorname !== req.user.username) {
            return res.status(403).json({ error: "You can only edit your own posts" });
        }

        const { title, content } = req.body;

        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;