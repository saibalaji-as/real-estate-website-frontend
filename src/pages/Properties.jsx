import { useEffect, useState } from "react";
import { getProperties, addProperty, editProperty, deleteProperty } from "../api/api";
import "../styles/global.css";

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({ title: "", location: "", price: "" });
    const [editingProperty, setEditingProperty] = useState(null);

    // Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await getProperties();
            setProperties(res.data);
        } catch (err) {
            console.error("Error fetching properties", err);
        }
    };

    // Add property
    const handleAddProperty = async (e) => {
        e.preventDefault();
        if (!newProperty.title || !newProperty.location || !newProperty.price) {
            alert("Please fill in all fields");
            return;
        }
        try {
            await addProperty(newProperty);
            alert("Property added successfully!");
            setNewProperty({ title: "", location: "", price: "" });
            fetchProperties();
        } catch (err) {
            alert("Failed to add property!");
            console.error("Error adding property", err);
        }
    };

    // Edit property
    const handleEditProperty = async (e) => {
        e.preventDefault();
        if (!editingProperty.title || !editingProperty.location || !editingProperty.price) {
            alert("Please fill in all fields");
            return;
        }
        try {
            await editProperty(editingProperty._id, editingProperty);
            alert("Property updated successfully!");
            setEditingProperty(null);
            fetchProperties();
        } catch (err) {
            alert("Failed to update property!");
            console.error("Error updating property", err);
        }
    };

    // Delete property
    const handleDeleteProperty = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;
        try {
            await deleteProperty(id);
            alert("Property deleted successfully!");
            fetchProperties();
        } catch (err) {
            alert("Failed to delete property!");
            console.error("Error deleting property", err);
        }
    };

    return (
        <div className="container">
            <div>
                <h1>Properties</h1>

                {/* Add Property Form */}
                <div className="add-property-form">
                    <h2>{editingProperty ? "Edit Property" : "Add New Property"}</h2>
                    <form onSubmit={editingProperty ? handleEditProperty : handleAddProperty}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editingProperty ? editingProperty.title : newProperty.title}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, title: e.target.value })
                                    : setNewProperty({ ...newProperty, title: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={editingProperty ? editingProperty.location : newProperty.location}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, location: e.target.value })
                                    : setNewProperty({ ...newProperty, location: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={editingProperty ? editingProperty.price : newProperty.price}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, price: e.target.value })
                                    : setNewProperty({ ...newProperty, price: e.target.value })
                            }
                        />
                        <button type="submit">{editingProperty ? "Update Property" : "Add Property"}</button>
                        {editingProperty && (
                            <button type="button" onClick={() => setEditingProperty(null)}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* Display Properties */}
                <div>
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <div key={property._id} className="card">
                                <h2>{property.title}</h2>
                                <p>{property.location}</p>
                                <p>₹{property.price}</p>
                                <button onClick={() => setEditingProperty(property)}>Edit</button>
                                <button onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No properties available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Properties;
