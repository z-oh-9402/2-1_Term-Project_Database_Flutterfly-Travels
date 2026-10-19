import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import PropTypes from 'prop-types';
import WishlistBar from "./WishlistBar";
import { apiFetch } from '../api';
import { onWishlistChanged } from '../wishlist';
import "../Styles/trips.css"
import "../Styles/wishlist.css"

const CATEGORY_TITLES = {
    destination: 'Destinations',
    accommodation: 'Accommodations',
    restaurant: 'Restaurants',
};

const Wishlist = (props)=>{
    const {setShowWishlist} = props;
    // null until the first load finishes
    const [wishlist, setWishlist] = useState(null);

    useEffect(() => {
        let isActive = true;
        const fetchWishlist = async () => {
            const response = await apiFetch(`http://localhost:3000/wishlist/fetch`, {
                method: "GET"
            });

            if(isActive && response.ok)
            {
                setWishlist(await response.json());
            }
        }

        fetchWishlist();
        // Reload when an item is removed here or added/removed on a page behind the panel
        const stopListening = onWishlistChanged(fetchWishlist);

        return () => {
            isActive = false;
            stopListening();
        };
    }, []);

    const savedCategories = wishlist===null ? [] : wishlist.filter(list => list.items.length!==0);
    const savedCount = savedCategories.reduce((count, list) => count + list.items.length, 0);

    return(
        <div className='login-signup-popup'>
            <div className="close-container" style={{position: 'relative'}}>
                <ImCross className='close' onClick={() => setShowWishlist(false)} />

                <div className='login-signup-container trip-container'>
                    <div className='wishlist-panel'>
                        <div className='wishlist-header'>
                            <h2>Wishlist</h2>
                            {savedCount !== 0 && <span className='wishlist-total'>{savedCount} saved</span>}
                        </div>
                        {wishlist===null ?
                            <p className='wishlist-empty'>Loading...</p>
                        : savedCategories.length===0 ?
                            <p className="wishlist-empty">Your wishlist is empty. Tap the heart on any destination, accommodation or restaurant to save it here.</p>
                        :
                            savedCategories.map(list =>
                                <div key={list.category} className="wishlist-category">
                                    <h3>{CATEGORY_TITLES[list.category]} <span className='wishlist-category-count'>{list.items.length}</span></h3>
                                    {list.items.map(item =>
                                        <WishlistBar key={item.wishlist_id} item={item} itemType={list.category} setShowWishlist={setShowWishlist}/>
                                    )}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
)}

Wishlist.propTypes = {
    setShowWishlist: PropTypes.func.isRequired
}

export default Wishlist;
