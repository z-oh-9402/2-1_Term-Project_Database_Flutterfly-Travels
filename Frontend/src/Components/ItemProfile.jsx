import PropTypes from 'prop-types';
import { FaLocationDot, FaPhone, FaEnvelope, FaFacebook, FaGlobe, FaMapLocationDot, FaComments, FaCircleInfo } from "react-icons/fa6";
import WishlistHeart from './WishlistHeart';
import ImageSlider from './ImageSlider';
import "../Styles/item-profile.css";

// Shared layout pieces for the destination, accommodation and restaurant pages

// Name with the wishlist heart, "location · extra" underneath, and an optional button on the right
export const ItemHeader = ({ itemType, item, subtitle, action }) => (
    <div className="item-header">
        <div>
            <h1 className="item-title">{item.name}<WishlistHeart itemType={itemType} item={item} className='title-fav-icon'/></h1>
            <p className="item-subtitle">
                <FaLocationDot className="item-subtitle-icon"/>
                {item.location_name}, {item.district_name}
                {subtitle && <span className="item-subtitle-extra"> &middot; {subtitle}</span>}
            </p>
        </div>
        {action}
    </div>
);

// Two columns, so everything is visible from the top of the page:
// photos and details (children) on the left; map, feedback form and reviews on the right
export const ItemLayout = ({ images, map, reviewCount, reviews, children }) => (
    <div className="item-layout">
        <div className="item-column">
            <div className="item-gallery"><ImageSlider images={images}/></div>
            <section className="item-card">
                <h2 className="item-section-title"><FaCircleInfo/>Details</h2>
                {children}
            </section>
        </div>

        <div className="item-column">
            <section className="item-card">
                <h2 className="item-section-title"><FaMapLocationDot/>Location</h2>
                {map ?
                    <iframe className="item-map" src={map} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    : <p className="item-section-empty">No map available.</p>}
            </section>

            <section className="item-card">
                <h2 className="item-section-title"><FaComments/>Reviews &amp; Ratings ({reviewCount})</h2>
                {/* ReviewsAndRatings: the feedback form (customers only), then the reviews */}
                <div className="item-reviews">{reviews}</div>
            </section>
        </div>
    </div>
);

// "Label: value" line in the details panel
export const InfoRow = ({ label, children }) => (
    <div className="item-info-row">
        <span className="item-info-label">{label}: </span>
        <span className="item-info-value">{children}</span>
    </div>
);

// Longer text (description) under a label
export const InfoText = ({ label, children }) => (
    <div className="item-info-row">
        <span className="item-info-label">{label}</span>
        <p className="item-info-text">{children}</p>
    </div>
);

// Amenities as chips: ✓ when available, dimmed ✗ when not
export const FeatureChips = ({ features }) => (
    <div className="item-features">
        {features.map(({ label, icon, available }) => (
            <span key={label} className={"item-feature" + (available ? "" : " unavailable")}>
                {icon}{label} {available ? '✓' : '✗'}
            </span>
        ))}
    </div>
);

// Phone, email, Facebook and website, whichever the item has
export const ContactLinks = ({ item }) => {
    // Some values in the data carry stray line breaks (they came from Windows)
    const clean = (value) => (value || '').trim();
    const phone = clean(item.phone_number), email = clean(item.email), facebook = clean(item.facebook), website = clean(item.website);

    return (
        <div className="item-contact">
            {phone && <span className="item-contact-link"><FaPhone/>{phone}</span>}
            {email && <a className="item-contact-link" href={`mailto:${email}`}><FaEnvelope/>{email}</a>}
            {facebook && <a className="item-contact-link" href={facebook} target="_blank" rel="noreferrer"><FaFacebook/>visit our Facebook</a>}
            {website && <a className="item-contact-link" href={website} target="_blank" rel="noreferrer"><FaGlobe/>visit our Website</a>}
        </div>
    );
};

ItemHeader.propTypes = {
    itemType: PropTypes.oneOf(['destination', 'accommodation', 'restaurant']).isRequired,
    item: PropTypes.object.isRequired,
    subtitle: PropTypes.node,
    action: PropTypes.node,
};
ItemLayout.propTypes = {
    images: PropTypes.array.isRequired,
    map: PropTypes.string,
    reviewCount: PropTypes.number.isRequired,
    reviews: PropTypes.node.isRequired,
    children: PropTypes.node,
};
InfoRow.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };
InfoText.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };
FeatureChips.propTypes = {
    features: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, icon: PropTypes.node, available: PropTypes.bool })).isRequired,
};
ContactLinks.propTypes = { item: PropTypes.object.isRequired };
