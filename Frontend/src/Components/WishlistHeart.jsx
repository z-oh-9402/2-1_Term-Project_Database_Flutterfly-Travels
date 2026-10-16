import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import UserInfoContext from '../Context/UserInfoContext';
import { isInWishlist, setInWishlist, onWishlistChanged, wishlistItemId } from '../wishlist';
import "../Styles/card.css"

// Heart that adds/removes a destination, accommodation or restaurant from the logged-in customer's wishlist.
// Every heart for the same item stays in sync. Renders nothing for visitors, agents and admins.
const WishlistHeart = ({itemType, item, className}) => {
    const {userInfo} = useContext(UserInfoContext);
    const [inWishlist, setIsInWishlist] = useState(false);
    const isCustomer = userInfo!==null && userInfo.user_type==='customer';
    const itemId = wishlistItemId(itemType, item);

    useEffect(() => {
        if(!isCustomer || itemId===undefined)
        {
            return;
        }

        let isActive = true;
        isInWishlist(itemType, itemId).then(saved => isActive && setIsInWishlist(saved));

        // Another heart or the wishlist panel changed this item
        const stopListening = onWishlistChanged((change) => {
            if(change.itemType===itemType && change.itemId===itemId)
            {
                setIsInWishlist(change.inWishlist);
            }
        });

        return () => {
            isActive = false;
            stopListening();
        };
    }, [isCustomer, itemType, itemId]);

    const toggle = async (event) => {
        // Cards open the item's page when clicked; the heart shouldn't
        event.stopPropagation();

        const add = !inWishlist;
        setIsInWishlist(add);
        try
        {
            await setInWishlist(itemType, itemId, add);
        }
        catch(error)
        {
            setIsInWishlist(!add);
            alert(error.message);
        }
    }

    if(!isCustomer || itemId===undefined)
    {
        return null;
    }

    const Icon = inWishlist ? FaHeart : FaRegHeart;
    const label = inWishlist ? 'Remove from wishlist' : 'Add to wishlist';
    return <Icon className={className} onClick={toggle} role="button" aria-pressed={inWishlist} aria-label={label} title={label}/>;
}

WishlistHeart.propTypes = {
    itemType: PropTypes.oneOf(['destination', 'accommodation', 'restaurant']).isRequired,
    item: PropTypes.object.isRequired,
    className: PropTypes.string
}

export default WishlistHeart;
