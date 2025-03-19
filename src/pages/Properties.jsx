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
    const [mapMode, setMapMode] = useState("add"); // "add" or "edit"
    const [viewLocation, setViewLocation] = useState(null); // Stores the property to be viewed

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
            click(e) {
                const newLocation = {
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    location: `Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}`,
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

    return (
        <div className="container">
            <div>
                <h1>Properties</h1>

                {/* Add / Edit Property Form */}
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
                <div>
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <div key={property._id} className="card">
                                <h2>{property.title}</h2>
                                <p>{property.location}</p>
                                <p>₹{property.price}</p>
                                <button onClick={() => setEditingProperty(property)}>Edit</button>
                                <button onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                                {property.latitude && property.longitude && (
                                    <button onClick={() => setViewLocation(property)}>📍 View Location</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No properties available</p>
                    )}
                </div>
            </div>

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
