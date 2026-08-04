    import axios from 'axios';
    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
      import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
    import { Link } from 'react-router-dom';
    import "./Home.css";

    function Home() {
      const [posts, setPosts] = useState([]);
      const [likestate, setliked] = useState([]);
      const navigate = useNavigate();
      const fetchPosts = () => {
        axios.get("http://localhost:3000/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then((res) => {
          setPosts(res.data.getPosts || res.data || []);
          // Safely map liked post IDs if res.data.liked exists
          if (res.data.liked) {
            setliked(res.data.liked.map((like) => like.postId));
          } else {
            setliked([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
        });
      };

      useEffect(() => {
        if(!localStorage.getItem("accessToken") ) {
          navigate("/auth/login");
        }
      }, [navigate]);
      useEffect(() => {

        fetchPosts();
      }, []);



      const likeAPost = (e, postId) => {
        e.stopPropagation(); // Prevent the click from propagating to the post card
        
        axios.post(
          "http://localhost:3000/likes",
          { postId: postId },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then(() => {
          // Optimistically toggle state or refetch to update UI
          fetchPosts();
        })
        .catch((err) => {
          console.error(err);
          alert("Please log in to like a post.");
        });
      };

      return (
        <div className="home-container">
          <h1 className="home-title">Welcome to the Home Page</h1>
          <div className="App">
            <h1 className="section-heading">Posts</h1>
            <div className="posts-grid">
              {posts && posts.map((post) => {
                const isLiked = likestate.includes(post.id);
                return (
                  <div
                    key={post.id}
                    className="post-preview-card"
                    
                    onClick={() => { navigate(`/post/${post.id}`) }}
                  >
                    <h2 className="preview-title">{post.title}</h2>
                    <p className="preview-content">{post.content}</p>
                  <p className="preview-author">
                      <Link to={`/profile/${post.userId}`} className="profile-link" onClick={(e) => e.stopPropagation()}>
                          By <span className="profile-name">{post.authorname}</span>
                      </Link>
                    </p>
                    <div className="preview-actions">
                      <ThumbUpAltIcon 
                        className={isLiked ? "like-icon active" : "like-icon dimmed"}
                        style={{
                          color: isLiked ? "#00b4d8" : "#adb5bd",
                          opacity: isLiked ? 1 : 0.4,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out"
                        }}
                        onClick={(e) => likeAPost(e, post.id)} 
                      />
                      <p className="likes-count"> {post.likes?.length || 0} likes</p>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
        
      );
    }

    export default Home;