import { useState } from "react";
import { loginUser } from "../api/api";
import "../styles/global.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email, password });
            alert("Login Successful!");
            localStorage.setItem("token", res.data.token);
        } catch (err) {
            alert("Login Failed!");
        }
    };

    return (
        <div className="container">
            <div className="login-form">
                <h2>Login</h2>
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
