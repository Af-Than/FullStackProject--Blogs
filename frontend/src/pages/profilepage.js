import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../helpers/authcontext';
import axios from 'axios';
import API_BASE_URL from '../helpers/api';
import './profilepage.css';

function ProfilePage() {    
    const { id } = useParams();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch User Info
        axios.get(`${API_BASE_URL}/auth/basicinfo/${id}`)
            .then((res) => {
                setUserInfo(res.data.username);
            })
            .catch((err) => {
                console.error("Failed to fetch user info:", err);
            });        

        // Fetch User Posts
        axios.get(`${API_BASE_URL}/posts/byuserid/${id}`)
            .then((res) => {
                setUserPosts(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch user posts:", err);
            })
            .finally(() => setLoading(false));        
    }, [id]);

    const isOwnProfile = authState?.username === userInfo;
    const initials = userInfo ? userInfo.charAt(0).toUpperCase() : '?';

    return (
        <div className="profile-page">
            {/* Hero Banner */}
            <div className="profile-hero">
                <div className="profile-hero-pattern"></div>
                <div className="profile-hero-content">
                    <div className="profile-avatar-ring">
                        <div className="profile-avatar">
                            {initials}
                        </div>
                    </div>
                    <div className="profile-identity">
                        <h1 className="profile-display-name">
                            {userInfo || "Loading..."}
                        </h1>
                        <span className="profile-handle">@{userInfo || "..."}</span>
                    </div>
                </div>
            </div>

            {/* Stats & Actions Bar */}
            <div className="profile-stats-bar">
                <div className="profile-stat">
                    <span className="stat-number">{userPosts.length}</span>
                    <span className="stat-label">{userPosts.length === 1 ? 'Post' : 'Posts'}</span>
                </div>
                {isOwnProfile && (
                    <div className="profile-actions-group">
                        <button 
                            className="profile-action-btn"
                            onClick={() => navigate(`/changepassword`)}
                        >
                            🔒 Change Password
                        </button>
                        <button 
                            className="profile-action-btn primary"
                            onClick={() => navigate('/createpost')}
                        >
                            ✍️ New Post
                        </button>
                    </div>
                )}
            </div>

            {/* Posts Section */}
            <div className="profile-posts-section">
                <div className="profile-section-header">
                    <h2 className="profile-section-title">Published Posts</h2>
                    <div className="profile-section-line"></div>
                </div>

                {loading ? (
                    <div className="profile-loading-grid">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="profile-skeleton-card">
                                <div className="skeleton-bar title"></div>
                                <div className="skeleton-bar"></div>
                                <div className="skeleton-bar short"></div>
                            </div>
                        ))}
                    </div>
                ) : userPosts.length === 0 ? (
                    <div className="profile-empty-state">
                        <div className="empty-illustration">
                            <span className="empty-icon">📄</span>
                            <div className="empty-circles">
                                <span className="circle c1"></span>
                                <span className="circle c2"></span>
                                <span className="circle c3"></span>
                            </div>
                        </div>
                        <h3 className="empty-title">No posts yet</h3>
                        <p className="empty-text">
                            {isOwnProfile 
                                ? "Your published posts will appear here. Start writing!" 
                                : "This user hasn't published any posts yet."}
                        </p>
                        {isOwnProfile && (
                            <button 
                                className="empty-cta"
                                onClick={() => navigate('/createpost')}
                            >
                                Create your first post →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="profile-posts-grid">
                        {userPosts.map((post, index) => (
                            <div 
                                key={post.id} 
                                className="profile-post-card"
                                onClick={() => navigate(`/post/${post.id}`)}
                                style={{ animationDelay: `${index * 0.06}s` }}
                            >
                                <div className="post-card-accent"></div>
                                <div className="post-card-inner">
                                    <h3 className="post-card-title">{post.title}</h3>
                                    <p className="post-card-excerpt">
                                        {(post.postText || post.content || "").length > 120 
                                            ? (post.postText || post.content).substring(0, 120) + "..." 
                                            : (post.postText || post.content)}
                                    </p>
                                    <div className="post-card-meta">
                                        <span className="post-card-author">
                                            <span className="author-dot"></span>
                                            {userInfo}
                                        </span>
                                        <span className="post-card-read">Read →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;