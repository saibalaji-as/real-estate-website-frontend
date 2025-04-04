import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getProperties, addProperty, editProperty, deleteProperty } from "../api/api";
import "leaflet/dist/leaflet.css";
import "../styles/global.css";

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({ title: "", location: "", price: "", latitude: "", longitude: "" });
    const [editingProperty, setEditingProperty] = useState(null);
    const [openMap, setOpenMap] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [mapMode, setMapMode] = useState("add"); // "add" or "edit"
    const [viewLocation, setViewLocation] = useState(null); // Stores the property to be viewed
    const [token, setToken] = useState(localStorage.getItem("token"));

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
            setNewProperty({ title: "", location: "", price: "", latitude: "", longitude: "" });
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

    // Custom Map Click Handler
    const MapClickHandler = () => {
        useMapEvents({
            click: async (e) => {
                const address = await getAddress(e.latlng.lat, e.latlng.lng); // Wait for address

                const newLocation = {
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    location: address, // Use the resolved address
                };

                if (mapMode === "add") {
                    setNewProperty({ ...newProperty, ...newLocation });
                } else if (mapMode === "edit") {
                    setEditingProperty({ ...editingProperty, ...newLocation });
                }

                setOpenMap(false);
            },
        });

        return null;
    };

    async function getAddress(lat, lon) {
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            let data = await response.json();
            return data.display_name; // Return the address
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Unknown Location"; // Default fallback
        }
    }


    return (
        <div className="container">
            <div className="properties-container">
                {/* Add / Edit Property Form */}
                <div style={{ display: token ? 'block' : 'none' }} className="add-property-form">
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
                            readOnly
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setMapMode(editingProperty ? "edit" : "add");
                                setOpenMap(true);
                            }}
                        >
                            📍 Select on Map
                        </button>
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
                <div className="listing-container">
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <div key={property._id} className="card">
                                <h2>{property.title}</h2>
                                <p>{property.location}</p>
                                <p>₹{property.price}</p>
                                <div style={{ display: 'flex', justifyContent: "flex-start" }}>
                                    <button style={{ display: token ? 'block' : 'none' }} onClick={() => setEditingProperty(property)}>Edit</button>
                                    <button style={{ display: token ? 'block' : 'none' }} onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: "flex-start" }}>
                                    <button onClick={() => setOpenForm(true)} style={{ display: token ? 'none' : 'block' }}>Book/Rent</button>
                                    {property.latitude && property.longitude && (
                                        <button style={{ backgroundColor: 'green' }} onClick={() => setViewLocation(property)}>📍 View Location</button>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <p>No properties available</p>
                    )}
                </div>
            </div>

            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
                <DialogTitle>Customer detail form</DialogTitle>
                <DialogContent>
                    <form class="form-container">
                        <div class="input-group">
                            <label>Name</label>
                            <input type="text" placeholder="John Doe"/>
                        </div>

                        <div class="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="john@example.com"/>
                        </div>

                        <div class="input-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="+91 9876543210"/>
                        </div>

                        <div class="input-group">
                            <label>Address</label>
                            <input type="text" placeholder="123 Main St"/>
                        </div>

                        <div class="location-fields">
                            <div class="city-state-fields">
                                <div class="input-group">
                                    <label>City</label>
                                    <input type="text" placeholder="Chennai"/>
                                </div>
                                <div class="input-group">
                                    <label>State</label>
                                    <input type="text" placeholder="TN"/>
                                </div>
                            </div>

                            <div class="country-zip-fields">
                                <div class="input-group">
                                    <label>Country</label>
                                    <input type="text" placeholder="India"/>
                                </div>
                                <div class="input-group">
                                    <label>ZIP Code</label>
                                    <input type="text" placeholder="10001"/>
                                </div>
                            </div>
                        </div>

                        <button class="submit-btn" type="submit" onClick={() => {
                            alert("Form submitted successfully!, Our executuve will contact you soon...");
                            setOpenForm(false)
                        }}>
                            Submit
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Map Dialog for Selecting Location */}
            <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md" fullWidth>
                <DialogTitle>Select Location on Map</DialogTitle>
                <DialogContent>
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapClickHandler />
                        {mapMode === "add" && newProperty.latitude && newProperty.longitude && (
                            <Marker position={[newProperty.latitude, newProperty.longitude]} />
                        )}
                        {mapMode === "edit" && editingProperty?.latitude && editingProperty?.longitude && (
                            <Marker position={[editingProperty.latitude, editingProperty.longitude]} />
                        )}
                    </MapContainer>
                </DialogContent>
            </Dialog>

            {/* Map Dialog for Viewing Location */}
            <Dialog open={!!viewLocation} onClose={() => setViewLocation(null)} maxWidth="md" fullWidth>
                <DialogTitle>Property Location</DialogTitle>
                <DialogContent>
                    {viewLocation && (
                        <MapContainer
                            center={[viewLocation.latitude, viewLocation.longitude]}
                            zoom={15}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[viewLocation.latitude, viewLocation.longitude]} />
                        </MapContainer>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Properties;
