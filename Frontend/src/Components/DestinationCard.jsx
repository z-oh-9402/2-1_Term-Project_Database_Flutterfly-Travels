import PropTypes from 'prop-types'

const DestinationCard = (props) => {
  function showPopup() {
      document.getElementById(`${props.index}`).style.display = 'flex';
      document.getElementById(`card${props.index}`).style.zIndex = 1;
  }

  function hidePopup() {
      document.getElementById(`${props.index}`).style.display = 'none';
      document.getElementById(`card${props.index}`).style.zIndex = 0;
  }

  return (
    <div className="destination-card" id={`card${props.index}`} onMouseOver={showPopup} onMouseOut={hidePopup}>
      <img src={props.destination.IMAGE} alt="Card Image"/>
      <h3 className='title'>{props.destination.NAME}</h3>
      <p>{props.destination.DISTRICT}</p>

      <div className="popup" id={`${props.index}`}>
          <p className="description"><span style={{fontWeight:"bold",color:"black"}}>Description: </span><br/>{props.destination.DESCRIPTION}</p>
      </div>
    </div>
  )
};

DestinationCard.propTypes = { 
    destination: PropTypes.object,
    index: PropTypes.string
}

export default DestinationCard;
