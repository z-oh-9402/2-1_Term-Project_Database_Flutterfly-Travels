import PropTypes from 'prop-types'
import Rating from './Rating';
import "../Styles/card.css"

const DestinationCard = (props) => {
  const showPopup = () => {
      document.getElementById(`${props.index}`).style.display = 'flex';
      document.getElementById(`card${props.index}`).style.zIndex = 1;
  }

  const hidePopup = () => {
      document.getElementById(`${props.index}`).style.display = 'none';
      document.getElementById(`card${props.index}`).style.zIndex = 0;
  }

  return (
    <div className="card" id={`card${props.index}`} onMouseOver={showPopup} onMouseOut={hidePopup}>
      <img src={props.destination.IMAGE} alt="Card Image"/>
      <h3 className='title'>{props.destination.NAME}</h3>
      <p>{props.destination.DISTRICT_NAME}, {props.destination.DIVISION_NAME.includes("Chattogram") ? "Chattogram" : props.destination.DIVISION_NAME}</p>
      <Rating rating={props.destination.RATING}/>

      <div className="popup" id={`${props.index}`}>
          <p className="description"><span style={{fontWeight:"bold",color:"black"}}>Description: </span><br/>{props.destination.DESCRIPTION}</p>
          <p></p>
      </div>
    </div>
  )
};

DestinationCard.propTypes = { 
    destination: PropTypes.object,
    index: PropTypes.string
}

export default DestinationCard;
