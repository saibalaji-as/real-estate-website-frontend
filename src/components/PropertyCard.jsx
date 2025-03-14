import "../styles/global.css";

const PropertyCard = ({ property }) => {
    return (
        <div className="card">
            <h2>{property.title}</h2>
            <p>{property.location}</p>
            <p>₹{property.price}</p>
        </div>
    );
};

export default PropertyCard;
