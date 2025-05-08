import { useState } from "react";
import { Menu, X } from "lucide-react"; // Lucide icons for hamburger and close
import logoutIcon from "../assets/logout.png";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [agent, setAgent] = useState(JSON.parse(localStorage.getItem("userDetails"))?.agent);
    const navigate = useNavigate();

    function handleLogout() {
        navigate("/");
        localStorage.removeItem("token");
        localStorage.removeItem("userDetails");
        window.location.reload();
    }

    return (
        <nav className="navigation bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 shadow-lg fixed w-full top-0 z-50 flex justify-between items-center">
            <h1 className="text-white text-3xl font-extrabold tracking-wide drop-shadow-lg">Sai Real Estate</h1>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
                <a href="/" className="text-white text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Home</a>
                <a href="/properties" className="text-white text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Properties</a>
                {!agent && (
                    <>
                        <a href="/login" className="text-white text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Login</a>
                        <a href="/register" className="text-white text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Register</a>
                    </>
                )}
                {agent && (
                    <img
                        onClick={handleLogout}
                        src={logoutIcon}
                        alt="Logout"
                        className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-300"
                        title="Logout"
                    />
                )}
            </div>

            {/* Hamburger Icon for Mobile */}
            <button
                className="md:hidden text-white focus:outline-none transition-transform duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 right-4 w-56 bg-white rounded-xl shadow-2xl py-4 px-6 flex flex-col space-y-4 z-50 md:hidden">
                    <a href="/" className="text-blue-600 text-lg hover:text-blue-800 transition font-medium">Home</a>
                    <a href="/properties" className="text-blue-600 text-lg hover:text-blue-800 transition font-medium">Properties</a>
                    {!agent && (
                        <>
                            <a href="/login" className="text-blue-600 text-lg hover:text-blue-800 transition font-medium">Login</a>
                            <a href="/register" className="text-blue-600 text-lg hover:text-blue-800 transition font-medium">Register</a>
                        </>
                    )}
                    {agent && (
                        <a onClick={handleLogout} className="text-blue-600 text-lg hover:text-blue-800 transition font-medium cursor-pointer">Logout</a>
                    )}
                </div>
            )}
        </nav>

    );
};

export default Navbar;
