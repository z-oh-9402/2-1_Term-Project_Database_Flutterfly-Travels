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
    navigate(`/destinations/${item.NAME}`)
  }

  return (
    <div className="card" id={`card${index}`} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
      <img className='cover-img' src={item.IMAGE} alt="Card Image"/>
      <h3 className='title'>{item.NAME}</h3>
      <p>{item.LOCATION_NAME}</p>
      <p>{item.DISTRICT_NAME}, {item.DIVISION_NAME}</p>
      <Rating rating={item.RATING} state={0} setRating={null}/>

      <div className="popup" id={index}>
          <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Description: </span><br/>{item.DESCRIPTION}</p>
          <p></p>
      </div>
    </div>
  )
};

ItemCard.propTypes = { 
    itemType: PropTypes.string,
    item: PropTypes.object,
    index: PropTypes.string
}

export default ItemCard;
