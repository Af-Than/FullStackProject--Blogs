const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/authmidwares');
const transporter = require('../helpers/mailer');
const { Op } = require('sequelize')
router.post("/", async (req, res) => {
    const { username, password,email} = req.body;

    try {
        const existingUser = await Users.findOne({ where: { username: username } });
        if (existingUser) {
        return res.json({ error: "Username already exists. Please choose another." });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await Users.create({
            username: username,
            password: hash,
            email: email
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


router.get("/basicinfo/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id, {attributes: ['username', 'id']});
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Send OTP to logged-in user
router.post("/send-change-otp", validateToken, async (req, res) => {
    try {
        const user = await Users.findOne({ where: { username: req.user.username } });
        if (!user) return res.json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.update({ resetOtp: otp, resetOtpExpire: expireTime });

        await transporter.sendMail({
            from: '"React App Project" <itsmagmahere@gmail.com>',
            to: user.email,
            subject: 'React App Project - Password Change Verification Code',
            html: `
                <h3>Password Change Verification</h3>
                <p>Your verification code for <strong>React App Project</strong> is: <strong>${otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        });

        return res.json({ success: `OTP sent to ${user.email}` });
    } catch (err) {
        console.error("🔴 OTP MAILER ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
});

// 2. Verify OTP code
router.post("/verify-otp", validateToken, async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                username: req.user.username,
                resetOtp: otp,
                resetOtpExpire: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.json({ error: "Invalid or expired OTP code." });
        }

        return res.json({ success: "OTP verified!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 3. Update Password (after OTP is verified)
router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === newPassword) {
        return res.json({ error: "New password cannot be the same as your current password." });
    }

    try {
        const user = await Users.findOne({ where: { username: req.user.username } });

        const isCurrentPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isCurrentPasswordCorrect) {
            return res.json({ error: "Incorrect current password." });
        }

        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.json({ error: "New password cannot be the same as your current password." });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hash,
            resetOtp: null,
            resetOtpExpire: null
        });

        return res.json({ success: "Password updated successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
module.exports = router;