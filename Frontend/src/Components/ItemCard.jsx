import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"
import { useNavigate } from 'react-router-dom';

const ItemCard = (props) => {
  const {item, index} = props
  const navigate = useNavigate();

  const showPopup = () => {
      document.getElementById(`${props.index}`).style.display = 'flex';
  }

  const hidePopup = () => {
      document.getElementById(`${props.index}`).style.display = 'none';
  }

  const navigatePage = () => {
      if(props.itemType === 'destination')
      {
          navigate(`/destinations/${item.NAME}`)
      }
      if(props.itemType === 'accommodation')
      {
        navigate(`/accommodations/${item.NAME}`)
      }
  }

  return (
    <div className="card" id={`card${index}`} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
      <img src={item.IMAGE} alt="Card Image"/>
      <h3 className='title'>{item.NAME}</h3>
      <p>{item.LOCATION_NAME}</p>
      <p>{item.DISTRICT_NAME}, {item.DIVISION_NAME}</p>
      <Rating rating={item.RATING}/>

      {props.itemType==='destination' && <div className="popup" id={index}>
          <p className="description"><span style={{fontWeight:"bold",color:"black"}}>Description: </span><br/>{item.DESCRIPTION}</p>
          <p></p>
      </div>}

      {props.itemType==='accommodation' && <div className="popup" id={index}>
          <p className="description"><span style={{fontWeight:"bold",color:"black"}}>Address: </span><br/>{item.ADDRESS}</p>
          <p></p>
      </div>}
    </div>
  )
};

ItemCard.propTypes = { 
    itemType: PropTypes.string,
    item: PropTypes.object,
    index: PropTypes.string
}

export default ItemCard;
