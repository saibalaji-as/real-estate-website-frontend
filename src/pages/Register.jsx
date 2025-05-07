import { useState } from "react";
import { registerUser } from "../api/api";
import "../styles/global.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "", agent: false });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(user);
            alert("Registration Successful!");
            navigate("/login");
        } catch (err) {
            if (err.status >= 500) {
                alert("Internal Server Error!, Try again later.");
            } else if (err.status === 400) {
                alert("Email already exists!");
            }
        }
    };

    return (
        <div className="container">
            <div className="login-form">
                <h2 className="login-txt">Register</h2>
                <form className="form-container" onSubmit={handleRegister}>
                    <input type="text" placeholder="Name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                    <div className="agent-input">
                    <input type="checkbox" value={user.agent} onChange={(e) => setUser({ ...user, agent: e.target.checked })}/>
                        <span>Agent</span>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
