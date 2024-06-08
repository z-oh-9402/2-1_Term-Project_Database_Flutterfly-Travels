import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import "../Styles/item-bar.css"
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";

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
                    const response = await fetch(`http://localhost:3000/wishlist/destination?userId=${userInfo.USER_ID}&itemId=${item.DESTINATION_ID}`,{
                        method: "GET",
                    });

                    const result = await response.json();
                    setAddedToFav(result);
                }
                else if(itemType==='accommodation')
                {
                    const response = await fetch(`http://localhost:3000/wishlist/accommodation?userId=${userInfo.USER_ID}&itemId=${item.ACCOMMODATION_ID}`,{
                        method: "GET",
                    });

                    const result = await response.json();
                    setAddedToFav(result);
                }
                else
                {
                    const response = await fetch(`http://localhost:3000/wishlist/restaurant?userId=${userInfo.USER_ID}&itemId=${item.RESTAURANT_ID}`,{
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
            {userInfo.USER_TYPE==='customer' && (addedToFav ? <FaHeart className='fav-icon'/> : <FaRegHeart className='fav-icon'/>)}
            <div style={{width: '100%', height: '100px', display:'flex', alignItems: 'center'}}>
                <div className='main-info-container wishlist-container'>
                    <img className='cover-img wishlist-img' src={item.IMAGE} alt="Card Image"/>
                    <div>
                        <h3 className='title'>{item.NAME}</h3>
                            <div className='item-rating-container'>
                            <label>Rating: <Rating rating={item.RATING} state={0} setRating={null}/></label>
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
