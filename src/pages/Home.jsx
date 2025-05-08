import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getProperties, getRequests } from "../api/api";

import "../styles/global.css";

const Home = () => {

    useEffect(() => {
        fetchProperties();
        fetchRequests();
    }, []);

    const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("userDetails")));
    const [activeTab, setActiveTab] = useState('requests');
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    // Sample data - replace with your actual data
    const [properties, setProperties] = useState([])

    const [requests, setRequests] = useState([]);

    const fetchProperties = async () => {
        try {
            // Create query parameters
            const params = {};
            if (userDetails?.agent) {
                params.userId = userDetails.userId;
            }
            const res = await getProperties({ params: params });
            setProperties(res.data);
        } catch (err) {
            console.log("Error fetching properties", err);
        }
    };

    const fetchRequests = async () => {
        try {
            // Create query parameters
            const params = {};
            if (userDetails?.agent) {
                params.userId = userDetails.userId;
            }
            const res = await getRequests({ params: params });
            setRequests(res.data);
        } catch (err) {
            console.log("Error fetching properties", err);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
    
      const formatPhone = (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      };

    return (
        <>
            <div className="wallpaper">
                <marquee className="marque-txt" behavior="scroll" direction="left" scrollamount="5">"Your Dream Home Awaits, Find Your Perfect Place, Invest in Your Future"</marquee>
            </div>

            <div style={{ display: userDetails?.agent ? 'none' : 'block' }} >
                <div className="max-w-6xl mx-auto p-6">
                    <header className="text-center py-10">
                        <h1 className="text-4xl font-extrabold text-blue-600">Welcome to Sai Real Estates</h1>
                        <p className="text-lg text-gray-600 mt-2">Your Trusted Partner in Property Solutions</p>
                    </header>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Why Choose Sai Real Estates?</h2>
                        <p className="text-gray-700">At <strong>Sai Real Estates</strong>, we believe in integrity, transparency, and excellence. Our team of experienced professionals provides top-notch service with expert guidance and market insights.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Diverse Range of Properties</h2>
                        <p className="text-gray-700">From budget-friendly homes to luxury villas, we offer a wide selection of residential and commercial properties to suit every need.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Simplified Buying and Selling Process</h2>
                        <p className="text-gray-700">We handle everything from property valuation and legal documentation to negotiations, ensuring a seamless experience.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Investment Opportunities</h2>
                        <p className="text-gray-700">Invest wisely with our expert guidance on high-potential properties, ensuring long-term returns.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Personalized Customer Service</h2>
                        <p className="text-gray-700">We offer tailored solutions based on your unique preferences, whether you’re a first-time buyer or a seasoned investor.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Technology-Driven Approach</h2>
                        <p className="text-gray-700">We leverage virtual tours, online listings, and data analytics to simplify your real estate experience.</p>
                    </section>

                    <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Building Long-Term Relationships</h2>
                        <p className="text-gray-700">Our commitment to excellence ensures that clients trust us for their future real estate needs.</p>
                    </section>

                    <footer className="text-center py-10">
                        <h2 className="text-2xl font-bold text-blue-600">Contact Us Today</h2>
                        <p className="text-gray-700 mt-2">Let <strong>Sai Real Estates</strong> help you find your dream property.</p>
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">Get in Touch</button>
                    </footer>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: userDetails?.agent ? 'block' : 'none' }}>
      <div className="dashboard-header">
        <h1>Agent Dashboard</h1>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('properties');
              setSelectedItem(null);
            }}
          >
            My Properties
          </button>
          <button
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('requests');
              setSelectedItem(null);
            }}
          >
            Requests
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="list-container">
          <h2>{activeTab === 'properties' ? 'My Properties' : 'Property Requests'}</h2>
          <div className="list-items">
            {activeTab === 'properties' ? (
              properties.map((property) => (
                <div
                  key={property._id}
                  className={`list-item ${selectedItem?._id === property._id ? 'selected' : ''}`}
                  onClick={() => handleItemClick(property)}
                >
                  <div className="property-image">
                    <img src={property.images[0]} alt={property.title} />
                  </div>
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <p className="location">{property.location.split(',')[0]}</p>
                    <div className="property-meta">
                      <span>{property.type}</span>
                      <span>{property.rooms} {property.rooms > 1 ? 'Rooms' : 'Room'}</span>
                      <span>{property.size} sq.ft</span>
                    </div>
                    <p className="price">{formatPrice(property.price)}</p>
                  </div>
                </div>
              ))
            ) : (
              requests.map((request) => (
                <div
                  key={request._id}
                  className={`list-item ${selectedItem?._id === request._id ? 'selected' : ''}`}
                  onClick={() => handleItemClick(request)}
                >
                  <div className="property-image">
                    <img src={request.property.images[0]} alt={request.property.title} />
                  </div>
                  <div className="property-info">
                    <h3>{request.property.title}</h3>
                    <p className="requester">Request from: {request.name}</p>
                    <p className="request-date">{formatDate(request.createdAt)}</p>
                    {/* <span className="status-badge pending">Pending</span> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="detail-container">
          {selectedItem ? (
            <div className="detail-content">
              {activeTab === 'properties' ? (
                <>
                  <h2>{selectedItem.title}</h2>
                  <div className="property-gallery">
                    <img src={selectedItem.images[0]} alt={selectedItem.title} />
                  </div>
                  <div className="property-details">
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{selectedItem.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">{formatPrice(selectedItem.price)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedItem.type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">{selectedItem.size} sq.ft</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Rooms:</span>
                      <span className="detail-value">{selectedItem.rooms}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Coordinates:</span>
                      <span className="detail-value">{selectedItem.latitude}, {selectedItem.longitude}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Listed On:</span>
                      <span className="detail-value">{formatDate(selectedItem.createdAt)}</span>
                    </div>
                    <div className="detail-row full-width">
                      <span className="detail-label">Description:</span>
                      <p className="detail-value">{selectedItem.description}</p>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button className="primary-button">Edit Property</button>
                    <button className="secondary-button">View on Map</button>
                    <button className="danger-button">Delete Property</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="request-header">
                    <h2>Request for {selectedItem.property.title}</h2>
                    {/* <span className="status-badge pending">Pending</span> */}
                  </div>
                  
                  <div className="request-details">
                    <div className="detail-section">
                      <h3>Property Information</h3>
                      <div className="property-gallery">
                        <img src={selectedItem.property.images[0]} alt={selectedItem.property.title} />
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">{formatPrice(selectedItem.property.price)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{selectedItem.property.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{selectedItem.property.location}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Requester Information</h3>
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{selectedItem.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                          <a href={`mailto:${selectedItem.email}`}>{selectedItem.email}</a>
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">
                          <a href={`tel:${selectedItem.phone}`}>{formatPhone(selectedItem.phone)}</a>
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">
                          {selectedItem.address}, {selectedItem.city}, {selectedItem.state}, {selectedItem.country} - {selectedItem.zipCode}
                        </span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Request Details</h3>
                      <div className="detail-row">
                        <span className="detail-label">Request Date:</span>
                        <span className="detail-value">{formatDate(selectedItem.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="detail-actions">
                    <button className="primary-button">Approve Request</button>
                    <button className="danger-button">Reject Request</button>
                    <button className="secondary-button">Contact Requester</button>
                  </div> */}
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Select an item to view details</h3>
              <p>Click on any item from the list to see its full details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
        </>
    );
};

export default Home;
