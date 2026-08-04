import './App.css';
import Home from './pages/home';
import CreatePost from './pages/CreatePost';
import Post from './pages/post';
import Login from './pages/login';
import Register from './pages/register';
import ChangePassword from './pages/changepassword';
import ProfilePage from './pages/profilepage';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './helpers/authcontext';
import PageNotFound from './pages/pagenotfound';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Navbar({ authState, setAuthState }) {
  const navigate = useNavigate(); // ✅ this component renders INSIDE <Router>

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-link logo-link">🚀 MyBlog</Link>
        <div className="nav-links-wrapper">
          {
            authState.status && (

            <>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/createpost" className="nav-link create-btn">Create Post</Link>
          </>
            )
          }
          {
            !authState.status ? (
              <>
                <Link to="/auth/login" className="nav-link create-btn">Login</Link>
                <Link to="/auth" className="nav-link create-btn">Register</Link>
              </>
            ) : (
              <>
              
              <button className="nav-link create-btn" onClick={() => {
                localStorage.removeItem("accessToken"); 
                setAuthState({ username: "", id: 0, status: false });
                
                navigate("/auth/login"); // Redirect to login page after logout 
              }}>
                Logout
              </button>
            <span className="welcome-text" onClick={() => navigate(`/profile/${authState.id}`)}>
              Welcome, {authState.username}!
            </span>
            </>
            )
          }
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [authState, setAuthState] = useState({username: "",id:0,status: false});
useEffect(() => {
    axios.get("http://localhost:3000/auth/check", {
        headers: { accessToken: localStorage.getItem("accessToken") }
    }).then((res) => {
        setAuthState({ username: res.data.username, id: res.data.id, status: true });
    }).catch((err) => {
        setAuthState({ username: "", id: 0, status: false });
    });
}, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar authState={authState} setAuthState={setAuthState} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth" element={<Register />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;