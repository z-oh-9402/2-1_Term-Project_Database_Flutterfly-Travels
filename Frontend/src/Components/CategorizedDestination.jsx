import { Fragment } from 'react';
import DestinationCard from './DestinationCard';
import PropTypes from 'prop-types'
import "../Styles/card.css"

const CategorizedDestination = ({destinationObj}) => {
  
  return (
    <>
      {destinationObj.map((d, index) => (
        d.destinations.length>0 && <Fragment key={index}>
            <div className='destination-info-container'>
                <h2>{d.category}</h2>
                <div className='card-container'>
                    {d.destinations.map((destination,index2)=>
                        <DestinationCard key={index2} itemType='destination' item={destination} index={`${d.category}${index2}`}/>
                    )}
                </div>
            </div>
        </Fragment>
      ))}
    </>
  );
};

CategorizedDestination.propTypes = {
    destinationObj: PropTypes.array
}

export default CategorizedDestination;
