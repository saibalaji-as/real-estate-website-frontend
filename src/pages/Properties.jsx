import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getProperties, addProperty, editProperty, deleteProperty } from "../api/api";
import "leaflet/dist/leaflet.css";
import "../styles/global.css";

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({
        title: "",
        location: "",
        price: "",
        latitude: "",
        longitude: "",
        type: "",
        size: "",
        rooms: "",
        images: [],
        description: "",
    });
    const [editingProperty, setEditingProperty] = useState(null);
    const [openMap, setOpenMap] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [mapMode, setMapMode] = useState("add"); // "add" or "edit"
    const [viewLocation, setViewLocation] = useState(null); // Stores the property to be viewed
    const [agent, setAgent] = useState(JSON.parse(localStorage.getItem("userDetails"))?.agent);
    const [viewImage, setViewImage] = useState(null);

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
            setNewProperty({
                title: "",
                location: "",
                price: "",
                latitude: "",
                longitude: "",
                type: "",
                size: "",
                rooms: "",
                images: [],
                description: "",
            });
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
                <div style={{ display: agent ? 'block' : 'none' }} className="add-property-form">
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
                        <div className="location-input">
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
                        </div>
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
                        <input
                            type="text"
                            placeholder="Type (e.g. Apartment, Villa)"
                            value={editingProperty ? editingProperty.type : newProperty.type}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, type: e.target.value })
                                    : setNewProperty({ ...newProperty, type: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Size (e.g. 1200 sqft)"
                            value={editingProperty ? editingProperty.size : newProperty.size}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, size: e.target.value })
                                    : setNewProperty({ ...newProperty, size: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Number of Rooms"
                            value={editingProperty ? editingProperty.rooms : newProperty.rooms}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, rooms: e.target.value })
                                    : setNewProperty({ ...newProperty, rooms: e.target.value })
                            }
                        />
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {(editingProperty ? editingProperty.images : newProperty.images).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`preview-${idx}`}
                                    style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            ))}
                        </div>

                        {/* Image URL Input */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <input
                                type="text"
                                placeholder="Paste image URL here"
                                onChange={(e) => {
                                    if (editingProperty) {
                                        setEditingProperty({ ...editingProperty, image: e.target.value });
                                    } else {
                                        setNewProperty({ ...newProperty, image: e.target.value });
                                    }
                                }}
                            />
                            <button
                                style={{ marginTop: '0px' }}
                                type="button"
                                onClick={() => {
                                    const url = editingProperty ? editingProperty.image : newProperty.image;
                                    if (!url) return;
                                    if (editingProperty) {
                                        setEditingProperty({
                                            ...editingProperty,
                                            images: [...(editingProperty.images || []), url],
                                            image: "",
                                        });
                                    } else {
                                        setNewProperty({
                                            ...newProperty,
                                            images: [...(newProperty.images || []), url],
                                            image: "",
                                        });
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>

                        <textarea
                            className="text-area"
                            placeholder="Description"
                            value={editingProperty ? editingProperty.description : newProperty.description}
                            onChange={(e) =>
                                editingProperty
                                    ? setEditingProperty({ ...editingProperty, description: e.target.value })
                                    : setNewProperty({ ...newProperty, description: e.target.value })
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
                                {property.images && property.images.length > 0 && (
                                    <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '10px' }}>
                                        {property.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`img-${idx}`}
                                                onClick={() => setViewImage(img)}
                                                style={{
                                                    width: '150px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ccc'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <h2>{property.title}</h2>
                                <p><strong>Type:</strong> {property.type}</p>
                                <p><strong>Location:</strong> {property.location}</p>
                                <p><strong>Price:</strong> ₹{property.price}</p>
                                <p><strong>Size:</strong> {property.size}</p>
                                <p><strong>Rooms:</strong> {property.rooms}</p>
                                <p>{property.description}</p>
                                <div style={{ display: 'flex', justifyContent: "flex-start" }}>
                                    <button style={{ display: agent ? 'block' : 'none' }} onClick={() => setEditingProperty(property)}>Edit</button>
                                    <button style={{ display: agent ? 'block' : 'none' }} onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: "flex-start" }}>
                                    <button onClick={() => setOpenForm(true)} style={{ display: agent ? 'none' : 'block' }}>Book/Rent</button>
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

            {/* Image viewer */}
            <Dialog open={!!viewImage} onClose={() => setViewImage(null)} maxWidth="md">
                <DialogContent style={{ padding: 0, background: '#000' }}>
                    <img
                        src={viewImage}
                        alt="Full View"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog id="cust-details" open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <form class="form-container">
                        <div class="input-group">
                            <label>Name</label>
                            <input type="text" placeholder="John Doe" />
                        </div>

                        <div class="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="john@example.com" />
                        </div>

                        <div class="input-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="+91 9876543210" />
                        </div>

                        <div class="input-group">
                            <label>Address</label>
                            <input type="text" placeholder="123 Main St" />
                        </div>

                        <div class="location-fields">
                            <div class="city-state-fields">
                                <div class="input-group">
                                    <label>City</label>
                                    <input type="text" placeholder="Chennai" />
                                </div>
                                <div class="input-group">
                                    <label>State</label>
                                    <input type="text" placeholder="TN" />
                                </div>
                            </div>

                            <div class="country-zip-fields">
                                <div class="input-group">
                                    <label>Country</label>
                                    <input type="text" placeholder="India" />
                                </div>
                                <div class="input-group">
                                    <label>ZIP Code</label>
                                    <input type="text" placeholder="10001" />
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
