import DestinationCard from './DestinationCard';
import PropTypes from 'prop-types'

const CategorizedDestination = ({destinationObj}) => {
  console.log(destinationObj)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {destinationObj.map((d, index) => (
            <Fragment/>
             key={index}>
                <h2>{d.category}</h2>
                {d.destinations.map((destination,index2)=>
                    <DestinationCard key={index2} destination={destination} />
                )}
        ))}
    </div>
  );
};

CategorizedDestination.propTypes = {
    destinationObj: PropTypes.array
}

export default CategorizedDestination;
