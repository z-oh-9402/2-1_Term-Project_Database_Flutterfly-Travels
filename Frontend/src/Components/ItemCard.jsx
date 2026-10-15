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
    navigate(`/destinations/${item.name}`)
  }

  return (
    <div className="card" id={`card${index}`} onMouseOver={showPopup} onMouseOut={hidePopup} onClick={navigatePage}>
      <img className='cover-img' src={item.image} alt="Card Image"/>
      <h3 className='title'>{item.name}</h3>
      <p>{item.location_name}</p>
      <p>{item.district_name}, {item.division_name}</p>
      <Rating rating={parseFloat(item.rating)} isChanging={false} setRating={null}/>

      <div className="popup" id={index}>
          <p className="description"><span style={{fontWeight:"bold",color:"white"}}>Description: </span><br/>{item.description}</p>
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
