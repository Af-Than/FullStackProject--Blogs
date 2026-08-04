    import { useParams, useNavigate } from 'react-router-dom';
    import { useEffect, useState, useCallback, useContext } from 'react';
    import axios from 'axios';
    import { AuthContext } from "../helpers/authcontext";
    import "./Post.css";

    function Post() {
        let { id } = useParams();
        let navigate = useNavigate();

        const [post, setPost] = useState(null);
        const [comments, setComments] = useState([]);
        const [newComment, setNewComment] = useState("");
        const [newTitle, setNewTitle] = useState("");
        const [newContent, setNewContent] = useState("");
        const [isEditingTitle, setIsEditingTitle] = useState(false);
        const [isEditingContent, setIsEditingContent] = useState(false);
        const { authState } = useContext(AuthContext);


        
        const saveUpdatedContent = () => {
            axios.put(
                `http://localhost:3000/posts/${post.id}`,
                { content:newContent },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((res) => {
                console.log("Post updated successfully:", res.data);
                setPost({ ...post, content: newContent });
                setIsEditingContent(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update post. Please try again.");
            });

        }
        const saveUpdatedTitle = () => {
            axios.put(
                `http://localhost:3000/posts/${post.id}`,
                { title: newTitle },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((res) => {
                console.log("Post updated successfully:", res.data);
                setPost({ ...post, title: newTitle});
                setIsEditingTitle(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update post. Please try again.");
            });

        }
        const fetchComments = useCallback(() => {
            axios.get(`http://localhost:3000/comments/${id}?t=${Date.now()}`).then((res) => {
                console.log("Comments fetched successfully:", res.data);
                setComments(res.data);
            });
        }, [id]);

        useEffect(() => {
            axios.get(`http://localhost:3000/posts/byid/${id}`).then((res) => {
                setPost(res.data);
            });
            fetchComments();
        }, [id, fetchComments]);

        const handleEditTitle = (postId) => {
            setIsEditingContent(false); // Ensure content editing is disabled
            setIsEditingTitle(true);
        }
        const handleEditContent = (postId) => {
            setIsEditingTitle(false); // Ensure title editing is disabled
            setIsEditingContent(true);
        }

        const handleDeleteComment = (commentId) => {
            axios
                .delete(`http://localhost:3000/comments/${commentId}`, {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
                .then(() => {
                    setComments(comments.filter((val) => val.id !== commentId));
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const handleDeletePosts = (postId) => {
            axios
                .delete(`http://localhost:3000/posts/${postId}`, {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
                .then(() => {
                    alert("Post deleted successfully.");
                    navigate("/"); // Redirect back home after deleting the post
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const handleCommentSubmit = (e) => {
            e.preventDefault();
            axios
                .post(
                    "http://localhost:3000/comments",
                    { Commentbody: newComment, postId: id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
                .then((res) => {
                    console.log("Comment posted successfully:", res.data);
                    setNewComment("");
                    fetchComments();
                })
                .catch((err) => {
                    console.error(err);
                    alert("Failed to post comment. Please log in.");
                });
        };

        return (
    <div className="post-container">
        {post && (
            <div className="post-card">
                {authState.username === post.authorname && (
                    <div className="post-owner-actions">
                        <button className="edit-btn" onClick={() => handleEditTitle(post.id)}>
                            Edit Title
                        </button>
                        <button className="edit-btn" onClick={() => handleEditContent(post.id)}>
                            Edit Content
                        </button>
                    </div>
                )}

                {isEditingContent && (
                    <div className="edit-section">
                        <textarea
                            className="edit-textarea"
                            defaultValue={post.content}
                            onChange={(e) => setNewContent(e.target.value)}
                        ></textarea>
                        <div className="edit-actions">
                            <button className="save-btn" onClick={saveUpdatedContent}>Save Content</button>
                            <button className="cancel-btn" onClick={() => setIsEditingContent(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {isEditingTitle && (
                    <div className="edit-section">
                        <input
                            className="edit-input"
                            type="text"
                            defaultValue={post.title}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <div className="edit-actions">
                            <button className="save-btn" onClick={saveUpdatedTitle}>Save Title</button>
                            <button className="cancel-btn" onClick={() => setIsEditingTitle(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <h1 className="post-title">{post.title}</h1>
                <p className="post-content">{post.content}</p>
                <p className="post-author">By {post.authorname}</p>

                {authState.username === post.authorname && (
                    <button className="delete-post-btn" onClick={() => handleDeletePosts(post.id)}>
                        Delete Post
                    </button>
                )}

                <div className="comments-section">
                    <h2 className="comments-heading">Comments</h2>

                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            className="comment-input"
                            placeholder="Write a comment..."
                            rows={3}
                            autoComplete="off"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="comment-submit-btn">
                            Post Comment
                        </button>
                    </form>

                    <div className="comment-list">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <p className="comment-author">By {comment.user?.username}</p>
                                <p className="comment-body">{comment.Commentbody}</p>
                                {authState.username === comment.user?.username && (
                                    <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment.id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
        );
    }

    export default Post;