import { useState } from "react";
import { addProperty } from "../api/api";
import "../styles/global.css";

const AddProperty = () => {
    const [property, setProperty] = useState({
        title: "",
        location: "",
        price: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProperty(property);
            alert("Property added successfully!");
            setProperty({ title: "", location: "", price: "" });
        } catch (err) {
            alert("Failed to add property!");
        }
    };

    return (
        <div className="container">
            <h2>Add Property</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={property.title}
                    onChange={(e) => setProperty({ ...property, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={property.location}
                    onChange={(e) => setProperty({ ...property, location: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={property.price}
                    onChange={(e) => setProperty({ ...property, price: e.target.value })}
                />
                <button type="submit">Add Property</button>
            </form>
        </div>
    );
};

export default AddProperty;
