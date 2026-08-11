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
    process.env.FRONTEND_URL, // Set this in Render env variables (e.g., https://your-app.vercel.app)
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());       // ✅ FIRST — parse the body
app.use("/posts", routes);     // ✅ THEN — handle the routes
app.use("/comments", comments); 
app.use("/auth", users);
app.use("/likes", likes);

// Use process.env.PORT for Render (it assigns ports dynamically), fallback to 3000 for local dev
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});