import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Sai Real Estate</h1>
        <div className="space-x-6">
            <a href="/" className="font-mono text-white text-lg hover:text-gray-200 transition">Home</a>
            <a href="/properties" className="text-white text-lg hover:text-gray-200 transition">Properties</a>
            <a href="/login" className="text-white text-lg hover:text-gray-200 transition">Login</a>
            <a href="/register" className="text-white text-lg hover:text-gray-200 transition">Register</a>
        </div>
    </nav>
    );
};

export default Navbar;
