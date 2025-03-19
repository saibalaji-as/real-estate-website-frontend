import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { addProperty } from "../api/api";
import "leaflet/dist/leaflet.css";
import "../styles/global.css";

const AddProperty = () => {
    const [property, setProperty] = useState({
        title: "",
        location: "",
        price: "",
        latitude: "",
        longitude: "",
    });

    const [openMap, setOpenMap] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProperty(property);
            alert("Property added successfully!");
            setProperty({ title: "", location: "", price: "", latitude: "", longitude: "" });
        } catch (err) {
            alert("Failed to add property!");
        }
    };

    // Custom Map Click Handler to get Lat & Lng
    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setProperty({
                    ...property,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    location: `Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}`,
                });
            },
        });
        return null;
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
                    readOnly
                />
                <button type="button" onClick={() => setOpenMap(true)}>📍 Select on Map</button>
                <input
                    type="number"
                    placeholder="Price"
                    value={property.price}
                    onChange={(e) => setProperty({ ...property, price: e.target.value })}
                />
                <button type="submit">Add Property</button>
            </form>

            {/* Map Dialog */}
            <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md" fullWidth>
                <DialogTitle>Select Location on Map</DialogTitle>
                <DialogContent>
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapClickHandler />
                        {property.latitude && property.longitude && (
                            <Marker position={[property.latitude, property.longitude]} />
                        )}
                    </MapContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProperty;
