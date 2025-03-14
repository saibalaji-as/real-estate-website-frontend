import { useState } from "react";
import { registerUser } from "../api/api";
import "../styles/global.css";

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(user);
            alert("Registration Successful!");
        } catch (err) {
            alert("Registration Failed!");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
