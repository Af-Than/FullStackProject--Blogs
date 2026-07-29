const express = require('express');
const app = express();
const cors = require('cors');


const db = require('./models');
const routes = require('./routers/THEPOSTSROUTE');
const comments = require('./routers/comments');
const users=require('./routers/users');
const likes=require('./routers/Likes');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());      // ✅ FIRST — parse the body
app.use("/posts", routes);    // ✅ THEN — handle the routes
app.use("/comments", comments); // ✅ THEN — handle the routes
app.use("/auth",users);
app.use("/likes",likes);
db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});