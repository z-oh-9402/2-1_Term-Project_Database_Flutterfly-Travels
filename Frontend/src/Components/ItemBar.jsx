import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserInfoContext from '../Context/UserInfoContext';

const ItemBar = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {item, index, itemType} = props;
    const navigate = useNavigate();

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

    const bookFlight = () => {
        
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
        <div className="bar" id={`bar${index}`} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
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
                        <p>Departure Time: {departureTime}</p>
                        <p>Arrival Time: {arrivalTime}</p>
                    </>}
                </div>
            </div>
                
            
            <div className='item-rating-container'>
                {itemType!=='flight' ?
                <label>Rating: <Rating  rating={item.RATING} state={0} setRating={null}/></label>
                :
                <label>{item.SEAT_CLASS} Class: ${item.ECONOMY_SEAT_PRICE}</label>}
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
    )
};

ItemBar.propTypes = { 
    itemType: PropTypes.string,
    item: PropTypes.object,
    index: PropTypes.string
}

export default ItemBar;
