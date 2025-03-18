import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty"; // Import AddProperty page

const App = () => {
    console.log("App component rendered");
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/add-property" element={<AddProperty />} />
            </Routes>
        </Router>
    );
};

export default App;
