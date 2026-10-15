import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import "../Styles/item-bar.css"
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { apiFetch } from '../api';

const WishlistBar = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {item, index, itemType} = props;
    const [addedToFav, setAddedToFav] = useState(false);

    useEffect(() => {
        const checkFavourite = async () => {
            if(userInfo!==null)
            {
                if(itemType==='destination')
                {
                    const response = await apiFetch(`http://localhost:3000/wishlist/destination?userId=${userInfo.user_id}&itemId=${item.destination_id}`,{
                        method: "GET",
                    });

                    const result = await response.json();
                    setAddedToFav(result);
                }
                else if(itemType==='accommodation')
                {
                    const response = await apiFetch(`http://localhost:3000/wishlist/accommodation?userId=${userInfo.user_id}&itemId=${item.accommodation_id}`,{
                        method: "GET",
                    });

                    const result = await response.json();
                    setAddedToFav(result);
                }
                else
                {
                    const response = await apiFetch(`http://localhost:3000/wishlist/restaurant?userId=${userInfo.user_id}&itemId=${item.restaurant_id}`,{
                        method: "GET",
                    });

                    const result = await response.json();
                    setAddedToFav(result);
                }
            }
        }

        checkFavourite();
    }, []);

    return (
        <div className="bar" id={`bar${index}`} style={{display:'flex', alignItems: 'center', height: '120px', boxSizing:'border-box'}}>
            {userInfo.user_type==='customer' && (addedToFav ? <FaHeart className='fav-icon'/> : <FaRegHeart className='fav-icon'/>)}
            <div style={{width: '100%', height: '100px', display:'flex', alignItems: 'center'}}>
                <div className='main-info-container wishlist-container'>
                    <img className='cover-img wishlist-img' src={item.image} alt="Card Image"/>
                    <div>
                        <h3 className='title'>{item.name}</h3>
                            <div className='item-rating-container'>
                            <label>Rating: <Rating rating={parseFloat(item.rating)} isChanging={false} setRating={null}/></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

WishlistBar.propTypes = { 
    itemType: PropTypes.string,
    item: PropTypes.object,
    index: PropTypes.string,
    setShowWishlist: PropTypes.func
}

export default WishlistBar;
