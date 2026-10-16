import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import "../Styles/item-bar.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa6";
import { setInWishlist, wishlistItemId } from '../wishlist';

const ITEM_PAGES = {
    destination: 'destinations',
    accommodation: 'accommodations',
    restaurant: 'restaurants',
};

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

    return (
        <div className={"bar wishlist-bar" + (isRemoving ? " removing" : "")} onClick={openItem}>
            <FaHeart className='fav-icon' onClick={removeFromWishlist} title="Remove from wishlist" role="button" aria-label={`Remove ${item.name} from wishlist`}/>
            <div className='main-info-container wishlist-container'>
                <img className='cover-img wishlist-img' src={item.image} alt={item.name}/>
                <div>
                    <h3 className='title'>{item.name}</h3>
                    <div className='item-rating-container'>
                        <label>Rating: <Rating rating={parseFloat(item.rating)} isChanging={false} setRating={null} count={Number(item.rating_count)}/></label>
                    </div>
                </div>
            </div>
        </div>
    )
};

WishlistBar.propTypes = {
    itemType: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    setShowWishlist: PropTypes.func.isRequired
}

export default WishlistBar;
