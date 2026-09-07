require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const pool = require('./config/db'); 

const db = require('./models');

const routes = require('./routers/THEPOSTSROUTE');
const comments = require('./routers/comments');
const users = require('./routers/users');
const likes = require('./routers/Likes');

const allowedOrigins = [
    process.env.FRONTEND_URL, // Vercel URL in production
    'http://localhost:3000',  // CRA frontend (local dev)
    'http://localhost:5173'   // Vite frontend (if used)
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'accessToken', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());       // ✅ FIRST — parse the body
app.use("/posts", routes);     // ✅ THEN — handle the routes
app.use("/comments", comments); 
app.use("/auth", users);
app.use("/likes", likes);

// Use process.env.PORT for Render (it assigns ports dynamically), fallback to 5000 for local dev
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});