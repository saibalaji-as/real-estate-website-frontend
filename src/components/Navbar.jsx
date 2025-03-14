import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Real Estate</h1>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/properties">Properties</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    );
};

export default Navbar;
