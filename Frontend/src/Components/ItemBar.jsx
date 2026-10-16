import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import "../Styles/item-bar.css"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import WishlistHeart from './WishlistHeart';

const ItemBar = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {item, index, itemType} = props;
    const navigate = useNavigate();

    const departureTime = itemType==='flight' ? 
        new Date(item.departure_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : null;

    const arrivalTime = itemType==='flight' ? 
        new Date(item.arrival_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : null;

    const showPopup = () => {
        if(itemType!=='flight' || userInfo===null || userInfo.user_type!=='admin')
        {
            document.getElementById(`${props.index}`).style.display = 'flex';
        }
    }

    const hidePopup = () => {
        if(itemType!=='flight' || userInfo===null || userInfo.user_type!=='admin')
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
            navigate(`/destinations/${item.name}`)
        }
        if(itemType === 'accommodation')
        {
            navigate(`/accommodations/${item.name}`)
        }
        if(itemType === 'restaurant')
        {
            navigate(`/restaurants/${item.name}`)
        }
    }

    return (
        <div className="bar" id={`bar${index}`}>
            {itemType!=='flight' && <WishlistHeart itemType={itemType} item={item} className='fav-icon'/>}
            <div style={{width: '100%', height: '100%', display:'flex', alignItems: 'center'}} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
                <div className='main-info-container'>
                    <img className='cover-img' src={item.image} alt="Card Image"/>
                    <div>
                        <h3 className='title'>{itemType!=='flight' ? item.name : item.airline_name}</h3>
                        {itemType!=='flight' ? 
                        <>
                            <p>{item.location_name}</p>
                            <p>{item.district_name}, {item.division_name}</p>
                        </>:
                        <>
                            <p>{item.departure_airport} =&gt; {item.arrival_airport}</p>
                            {item.flight_style==='Round Trip' && <p>{item.arrival_airport} =&gt; {item.departure_airport}</p>}
                            <p>Departure Time: {departureTime}</p>
                            <p>Arrival Time: {arrivalTime}</p>
                        </>}
                    </div>
                </div>
                    
                
                <div className='item-rating-container'>
                    {itemType!=='flight' ?
                    <label>Rating: <Rating rating={parseFloat(item.rating)} isChanging={false} setRating={null}/></label>
                    :
                    <label>{item.seat_class} Class: ৳ {item.seat_price}</label>}
                </div>

                {itemType==='destination' && <div className="popup" id={index}>
                    <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Description: </span><br/>{item.description}</p>
                    <p></p>
                </div>}

                {(itemType==='accommodation' || itemType==='restaurant') && <div className="popup" id={index}>
                    <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Address: </span><br/>{item.address}</p>
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
