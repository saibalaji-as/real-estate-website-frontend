import { useState } from "react";
import { Menu, X } from "lucide-react"; // Lucide icons for hamburger and close

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navigation bg-blue-600 p-4 shadow-md flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Sai Real Estate</h1>

            {/* Desktop Links (Hidden on small screens) */}
            <div className="hidden md:flex space-x-6">
                <a href="/" className="text-white text-lg hover:text-gray-200 transition">Home</a>
                <a href="/properties" className="text-white text-lg hover:text-gray-200 transition">Properties</a>
                <a href="/login" className="text-white text-lg hover:text-gray-200 transition">Login</a>
                <a href="/register" className="text-white text-lg hover:text-gray-200 transition">Register</a>
            </div>

            {/* Hamburger Icon (Visible on small screens) */}
            <button 
                className="md:hidden text-white focus:outline-none" 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}  
            </button>

            {/* Mobile Menu (Shown when isOpen is true) */}
            {isOpen && (
                <div className="absolute top-16 right-4 bg-white shadow-lg p-4 flex flex-col space-y-4 rounded-lg md:hidden">
                    <a href="/" className="text-blue-600 text-lg hover:text-blue-800 transition">Home</a>
                    <a href="/properties" className="text-blue-600 text-lg hover:text-blue-800 transition">Properties</a>
                    <a href="/login" className="text-blue-600 text-lg hover:text-blue-800 transition">Login</a>
                    <a href="/register" className="text-blue-600 text-lg hover:text-blue-800 transition">Register</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
