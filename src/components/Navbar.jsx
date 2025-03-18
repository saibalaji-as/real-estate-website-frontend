import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
    return (
        <nav class="bg-blue-600 p-4 shadow-md flex justify-between items-center">
        <h1 class="text-white text-2xl font-bold">Sai Real Estate</h1>
        <div class="space-x-6">
            <a href="/" class="font-mono text-white text-lg hover:text-gray-200 transition">Home</a>
            <a href="/properties" class="text-white text-lg hover:text-gray-200 transition">Properties</a>
            <a href="/login" class="text-white text-lg hover:text-gray-200 transition">Login</a>
            <a href="/register" class="text-white text-lg hover:text-gray-200 transition">Register</a>
        </div>
    </nav>
    );
};

export default Navbar;
