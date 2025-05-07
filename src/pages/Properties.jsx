import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getProperties, addProperty, editProperty, deleteProperty, contact } from "../api/api";
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
    const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("userDetails")));
    const [viewImage, setViewImage] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [roomFilter, setRoomFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: "",
        city: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
        bedrooms: "",
      });

    /* Contact form */
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        property: {}
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            formData.property = selectedProperty;
            const response = await contact(formData);

            if (!response) {
                throw new Error('Failed to submit form');
            }

            alert("Form submitted successfully! Our executive will contact you soon...");
            setOpenForm(false);
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                property: {}
            });
        } catch (error) {
            console.log('Error submitting form:', error);
            alert("Failed to submit form. Please try again.");
        }
    };
    /* Contact form */
    

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [properties, searchTerm, priceRange, selectedTypes, roomFilter]);

    const fetchProperties = async () => {
        try {
            // Create query parameters
            const params = {};
            if (userDetails?.agent) {
                params.userId = userDetails.userId;
            }
            const res = await getProperties({params: params});
            setProperties(res.data);
        } catch (err) {
            console.error("Error fetching properties", err);
        }
    };

    // Filter properties based on search and filter criteria
    const filterProperties = () => {
        let filtered = [...properties];
        
        // Search term filter (title, location, description)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(property => 
                property.title.toLowerCase().includes(term) ||
                property.location.toLowerCase().includes(term) ||
                (property.description && property.description.toLowerCase().includes(term))
            );
        }
        
        // Price range filter
        filtered = filtered.filter(property => {
            const price = parseInt(property.price) || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });
        
        // Property type filter
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(property => 
                selectedTypes.includes(property.type)
            );
        }
        
        // Room filter
        if (roomFilter) {
            filtered = filtered.filter(property => 
                property.rooms.toString() === roomFilter
            );
        }
        
        setFilteredProperties(filtered);
    };

    // Toggle property type in filter
    const togglePropertyType = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    // Get unique property types for filter options
    const getUniquePropertyTypes = () => {
        const types = new Set();
        properties.forEach(property => {
            if (property.type) types.add(property.type);
        });
        return Array.from(types);
    };

    // Get unique room counts for filter options
    const getUniqueRoomCounts = () => {
        const counts = new Set();
        properties.forEach(property => {
            if (property.rooms) counts.add(property.rooms.toString());
        });
        return Array.from(counts).sort((a, b) => a - b);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setPriceRange([0, Math.max(...properties.map(p => parseInt(p.price) || 0))]);
        setSelectedTypes([]);
        setRoomFilter("");
    };

    // Add property
    const handleAddProperty = async (e) => {
        e.preventDefault();
        if (!newProperty.title || !newProperty.location || !newProperty.price) {
            alert("Please fill in all fields");
            return;
        }
        try {
            newProperty.userId = userDetails.userId;
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
                <div style={{ display: userDetails?.agent ? 'block' : 'none' }} className="add-property-form">
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

                {/* Search and Filter Section - Add this at the top */}
                <div className="search-filter-section">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by title, location or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="filter-toggle"
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filter-options">
                            <div className="filter-group">
                                <h4>Price Range (₹)</h4>
                                <div className="price-range-display">
                                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                                </div>
                                <div className="price-range-slider">
                                    <input
                                        type="range"
                                        min="0"
                                        max={Math.max(...properties.map(p => parseInt(p.price) || 0))}
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={Math.max(...properties.map(p => parseInt(p.price) || 0))}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    />
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4>Property Type</h4>
                                <div className="type-filters">
                                    {getUniquePropertyTypes().map(type => (
                                        <label key={type} className="filter-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => togglePropertyType(type)}
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4>Rooms</h4>
                                <div className="room-filters">
                                    <select
                                        value={roomFilter}
                                        onChange={(e) => setRoomFilter(e.target.value)}
                                    >
                                        <option value="">All Rooms</option>
                                        {getUniqueRoomCounts().map(count => (
                                            <option key={count} value={count}>{count}+ Rooms</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="reset-filters"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    <div className="results-count">
                        {filteredProperties.length} properties found
                    </div>
                </div>

                {/* Display Properties */}
                <div className="listing-container">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
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
                                    <button style={{ display: userDetails?.agent ? 'block' : 'none' }} onClick={() => setEditingProperty(property)}>Edit</button>
                                    <button style={{ display: userDetails?.agent ? 'block' : 'none' }} onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: "flex-start" }}>
                                    <button onClick={() => {setOpenForm(true); setSelectedProperty(property)}} style={{ display: userDetails?.agent ? 'none' : 'block' }}>Contact agent</button>
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

            <Dialog
                id="cust-details"
                open={openForm}
                onClose={() => setOpenForm(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <form className="form-container" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="123 Main St"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="location-fields">
                            <div className="city-state-fields">
                                <div className="input-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Chennai"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="TN"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="country-zip-fields">
                                <div className="input-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="India"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="10001"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="submit-btn" type="submit">
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
