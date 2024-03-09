import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import "../Styles/item-bar.css"
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";

const ItemBar = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {item, index, itemType} = props;
    const [addedToFav, setAddedToFav] = useState(false);
    const navigate = useNavigate();

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

    const updateFavourite = async () => {
        setAddedToFav(!addedToFav);
        
        if(userInfo!==null)
        {
            if(itemType==='destination')
            {
                const response = await fetch(`http://localhost:3000/wishlist/destination`,{
                    method: addedToFav ? "DELETE" : "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userInfo.USER_ID,
                        itemId: item.DESTINATION_ID
                    })
                });

                await response.json();
            }
            else if(itemType==='accommodation')
            {
                const response = await fetch(`http://localhost:3000/wishlist/accommodation`,{
                    method: addedToFav ? "DELETE" : "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userInfo.USER_ID,
                        itemId: item.ACCOMMODATION_ID
                    })
                });

                await response.json();
            }
            else
            {
                const response = await fetch(`http://localhost:3000/wishlist/restaurant`,{
                    method: addedToFav ? "DELETE" : "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userInfo.USER_ID,
                        itemId: item.RESTAURANT_ID
                    })
                });

                await response.json();
            }
        }
    }

    const departureTime = itemType==='flight' ? 
        new Date(item.DEPARTURE_TIME).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : null;

    const arrivalTime = itemType==='flight' ? 
        new Date(item.ARRIVAL_TIME).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : null;

    const showPopup = () => {
        if(itemType!=='flight' || userInfo===null || userInfo.USER_TYPE!=='admin')
        {
            document.getElementById(`${props.index}`).style.display = 'flex';
        }
    }

    const hidePopup = () => {
        if(itemType!=='flight' || userInfo===null || userInfo.USER_TYPE!=='admin')
        {
            document.getElementById(`${props.index}`).style.display = 'none';
        }
    }

    const bookFlight = async () => {
        props.showBooking(item)
    }

    const navigatePage = () => {
        if(itemType === 'destination')
        {
            navigate(`/destinations/${item.NAME}`)
        }
        if(itemType === 'accommodation')
        {
            navigate(`/accommodations/${item.NAME}`)
        }
        if(itemType === 'restaurant')
        {
            navigate(`/restaurants/${item.NAME}`)
        }
    }

    return (
        <div className="bar" id={`bar${index}`}>
            {itemType!=='flight' && userInfo.USER_TYPE==='customer' && (addedToFav ? <FaHeart className='fav-icon' onClick={updateFavourite}/> : <FaRegHeart className='fav-icon' onClick={updateFavourite}/>)}
            <div style={{width: '100%', height: '100%', display:'flex', alignItems: 'center'}} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
                <div className='main-info-container'>
                    <img className='cover-img' src={item.IMAGE} alt="Card Image"/>
                    <div>
                        <h3 className='title'>{itemType!=='flight' ? item.NAME : item.AIRLINE_NAME}</h3>
                        {itemType!=='flight' ? 
                        <>
                            <p>{item.LOCATION_NAME}</p>
                            <p>{item.DISTRICT_NAME}, {item.DIVISION_NAME}</p>
                        </>:
                        <>
                            <p>{item.DEPARTURE_AIRPORT} =&gt; {item.ARRIVAL_AIRPORT}</p>
                            {item.FLIGHT_STYLE==='Round Trip' && <p>{item.ARRIVAL_AIRPORT} =&gt; {item.DEPARTURE_AIRPORT}</p>}
                            <p>Departure Time: {departureTime}</p>
                            <p>Arrival Time: {arrivalTime}</p>
                        </>}
                    </div>
                </div>
                    
                
                <div className='item-rating-container'>
                    {itemType!=='flight' ?
                    <label>Rating: <Rating rating={item.RATING} state={0} setRating={null}/></label>
                    :
                    <label>{item.SEAT_CLASS} Class: ৳ {item.SEAT_PRICE}</label>}
                </div>

                {itemType==='destination' && <div className="popup" id={index}>
                    <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Description: </span><br/>{item.DESCRIPTION}</p>
                    <p></p>
                </div>}

                {(itemType==='accommodation' || itemType==='restaurant') && <div className="popup" id={index}>
                    <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Address: </span><br/>{item.ADDRESS}</p>
                    <p></p>
                </div>}

                {itemType==='flight' && 
                <div className="popup flight-popup" id={index} onClick={bookFlight}>
                    <p>Book Your Flight Now!</p>
                </div>}
            </div>
        </div>
    )
};

ItemBar.propTypes = { 
    itemType: PropTypes.string,
    item: PropTypes.object,
    index: PropTypes.string,
    showBooking: PropTypes.func
}

export default ItemBar;
