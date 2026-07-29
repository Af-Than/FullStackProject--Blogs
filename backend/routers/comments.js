const express = require('express');
const router = express.Router();
const { Comments,Users } = require('../models');
const { validateToken } = require('../middlewares/authmidwares');

router.get("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comments.findAll({ 
            
            where: { postId: postId },
            include :{
                model:Users,
                as:'user',
                attributes:['username']
            }
        });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const { Commentbody, postId } = req.body;
        const comment = await Comments.create({ Commentbody, postId,usernameid: req.user.id });
        console.log(req.user); // should show { username: '...', id: ..., iat: ..., exp: ... }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    await Comments.destroy({where: {id: commentId, usernameid: req.user.id}})
    res.json({ message: "Comment deleted" });
});
module.exports = router;