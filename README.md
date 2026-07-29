# FullStack Blog Project

A full-stack blogging platform built with React on the frontend and Express + Sequelize on the backend. Users can register, log in, create posts, comment on posts, and like posts — with JWT-based authentication protecting user-specific actions.

## Features

- **User Authentication** — Register and log in with hashed passwords (bcrypt) and JWT-based sessions
- **Create Posts** — Logged-in users can create new blog posts with a title, content, and author name
- **View Posts** — Browse all posts on the home feed, or view a single post in detail
- **Comments** — Logged-in users can comment on posts; comments display the commenter's username, and users can delete their own comments
- **Likes** — Logged-in users can like/unlike posts, with a live like count shown per post
- **Persistent Login** — Auth state is verified on page load via a protected `/auth/check` route, so users stay logged in across refreshes

## Tech Stack

**Frontend**
- React
- React Router
- Axios
- Formik + Yup (form handling & validation)
- Material UI Icons

**Backend**
- Node.js + Express
- Sequelize ORM
- MySQL (or your configured SQL dialect)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)

## Project Structure

```
fullstack/
├── frontend/          # React application
│   └── src/
│       ├── pages/      # Home, Post, Login, Register, CreatePost
│       ├── helpers/     # AuthContext for global auth state
│       └── App.js
└── backend/           # Express API server
    ├── models/         # Sequelize models (Users, Posts, Comments, Likes)
    ├── routers/        # Route handlers (auth, posts, comments, likes)
    └── middlewares/     # JWT auth middleware
```

## Getting Started

### Prerequisites
- Node.js installed
- A running SQL database (configured in `backend/config/config.json` or your Sequelize config)

### Backend Setup
```bash
cd backend
npm install
npm start
```
The server runs on `http://localhost:3000`.

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app runs on `http://localhost:3001` (or your configured port).

## Environment Variables

Create a `.env` file in the `backend` folder with:
```
JWT_SECRET=your_secret_key_here
```

## API Overview

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| POST | `/auth` | Register a new user | No |
| POST | `/auth/login` | Log in | No |
| GET | `/auth/check` | Verify current token | Yes |
| GET | `/posts` | Get all posts | No |
| GET | `/posts/byid/:id` | Get a single post | No |
| POST | `/posts` | Create a post | Yes |
| GET | `/comments/:postId` | Get comments for a post | No |
| POST | `/comments` | Add a comment | Yes |
| DELETE | `/comments/:id` | Delete your own comment | Yes |
| POST | `/likes` | Like/unlike a post | Yes |

## Future Improvements
- Edit post/comment functionality
- Pagination for the post feed
- User profile pages
- Image uploads for posts
-Putting only one single user

## License
This project is for personal/educational purposes.
