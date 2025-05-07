import { useState } from "react";
import { loginUser } from "../api/api";
import "../styles/global.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userDetails", JSON.stringify(res.data.user));
            if (res.data.user.agent) {
                navigate("/");
            } else {
                navigate("/properties");
            }
            window.location.reload();
        } catch (err) {
            if (err.status >= 400) {
                alert("UNAUTHORIZED! Please check your credentials.");
            } else if (err.status >= 500) {
                alert("Internal Server Error!, Try again later.");
            }
        }
    };

    return (
        <div className="container">
            <div className="login-form">
                <h2 className="login-txt">Login</h2>
                <form className="form-container" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
