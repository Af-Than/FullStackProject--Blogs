import { useNavigate } from "react-router-dom";
import { useState,useContext} from "react";
import axios from "axios";
import { AuthContext } from "../helpers/authcontext";
import "./login.css";

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);

const login = () => {
    axios.post("http://localhost:3000/auth/login", { username, password }).then((res) => {
        if (res.data.error) {
            alert(res.data.error);
            return;
        }
        localStorage.setItem("accessToken", res.data.accessToken);
        setAuthState({ username: res.data.username, id: res.data.id, status: true });
        navigate("/");
    }).catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
    });
};

    return (
        <div className="create-post-container">
            <form className="post-form" onSubmit={(e) => { e.preventDefault(); login(); }}>
                <h1 className="login-title">Login</h1>

                <label className="form-label">Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="form-label">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="submit-btn">Login</button>
            </form>
        </div>
    );
}

export default Login;