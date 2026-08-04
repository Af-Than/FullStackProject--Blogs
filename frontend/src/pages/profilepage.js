import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../helpers/authcontext';
import axios from 'axios';
import './profilepage.css';

function ProfilePage() {    
    const { id } = useParams();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState("");
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        // Fetch User Info
        axios.get(`http://localhost:3000/auth/basicinfo/${id}`)
            .then((res) => {
                setUserInfo(res.data.username);
            })
            .catch((err) => {
                console.error("Failed to fetch user info:", err);
            });        

        // Fetch User Posts
        axios.get(`http://localhost:3000/posts/byuserid/${id}`)
            .then((res) => {
                setUserPosts(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch user posts:", err);
            });        
    }, [id]);

    return (
        <div className="home-container">
            {/* Header Section */}
            <div className="home-header-group">
                <h1 className="home-title">Profile</h1>
                <p className="home-subtitle">
                    Viewing profile and published posts for <strong>@{userInfo || "loading..."}</strong>
                </p>
                
                {/* Change Password Button (shown if current logged-in user owns the profile) */}
                {authState?.username === userInfo && (
                    <div className="change-password-section">
                        <button 
                            className="change-password-btn"
                            onClick={() => navigate(`/changepassword`)}
                        >
                            Change Password
                        </button>
                    </div>
                )}
            </div>

            {/* Section Header */}
            <div className="section-header-wrapper">
                <h2 className="section-heading">User Posts</h2>
                <span className="filter-pill active">
                    {userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}
                </span>
            </div>

            {/* Posts Grid Layout */}
            <div className="posts-grid">
                {userPosts.length === 0 ? (
                    <div className="empty-posts-view">
                        <span className="empty-posts-icon">📝</span>
                        <h3 className="empty-posts-title">No posts found</h3>
                        <p className="empty-posts-text">This user has not authored any posts yet.</p>
                    </div>
                ) : (
                    userPosts.map((post) => (
                        <div 
                            key={post.id} 
                            className="post-preview-card"
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <h3 className="preview-title">{post.title}</h3>
                            <p className="preview-content">{post.postText || post.content}</p>
                            
                            <div className="preview-footer">
                                <p className="preview-author">{userInfo}</p>
                                {post.Likes && (
                                    <span className="likes-count">
                                        ❤️ {post.Likes.length} {post.Likes.length === 1 ? 'Like' : 'Likes'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProfilePage;