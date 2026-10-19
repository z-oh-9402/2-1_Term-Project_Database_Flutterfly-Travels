import PropTypes from 'prop-types'
import Rating from './Rating';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaLocationDot } from "react-icons/fa6";
import { setInWishlist, wishlistItemId } from '../wishlist';

const ITEM_PAGES = {
    destination: 'destinations',
    accommodation: 'accommodations',
    restaurant: 'restaurants',
};

// A short line about the item under its name: the room price for an accommodation, the cuisine for a restaurant
const itemDetail = (itemType, item) => {
    if(itemType === 'accommodation')
    {
        return [item.accommodation_type, item.room_price && `৳ ${Number(item.room_price).toLocaleString('en-US')} a night`].filter(Boolean).join(' · ');
    }
    if(itemType === 'restaurant')
    {
        return [item.cuisine_type, item.price_range].filter(Boolean).join(' · ');
    }
    return null;
}

// One saved item in the wishlist panel: click it to open its page, click the heart to remove it
const WishlistBar = (props) => {
    const {item, itemType, setShowWishlist} = props;
    const navigate = useNavigate();
    const [isRemoving, setIsRemoving] = useState(false);

    const removeFromWishlist = async (event) => {
        // Don't also open the item's page
        event.stopPropagation();
        if(isRemoving)
        {
            return;
        }

        setIsRemoving(true);
        try
        {
            // The panel reloads itself when the wishlist changes
            await setInWishlist(itemType, wishlistItemId(itemType, item), false);
        }
        catch(error)
        {
            setIsRemoving(false);
            alert(error.message);
        }
    }

    const openItem = () => {
        setShowWishlist(false);
        navigate(`/${ITEM_PAGES[itemType]}/${item.name}`);
    }

    const place = [item.location_name, item.district_name].filter(Boolean).join(', ');
    const detail = itemDetail(itemType, item);

    return (
        <div className={"wishlist-item" + (isRemoving ? " removing" : "")} role="button" tabIndex={0}
             onClick={openItem} onKeyDown={(e) => { if(e.target === e.currentTarget && e.key === 'Enter') openItem(); }}>
            <img className='wishlist-item-img' src={item.image} alt=''/>
            <div className='wishlist-item-info'>
                <h4>{item.name}</h4>
                {place && <p className='wishlist-item-line'><FaLocationDot/> {place}</p>}
                {detail && <p className='wishlist-item-line wishlist-item-muted'>{detail}</p>}
                <Rating rating={parseFloat(item.rating)} isChanging={false} setRating={null} count={Number(item.rating_count)}/>
            </div>
            <button className='wishlist-item-remove' onClick={removeFromWishlist} title="Remove from wishlist" aria-label={`Remove ${item.name} from wishlist`}>
                <FaHeart/>
            </button>
        </div>
    )
};

WishlistBar.propTypes = {
    itemType: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    setShowWishlist: PropTypes.func.isRequired
}

export default WishlistBar;
