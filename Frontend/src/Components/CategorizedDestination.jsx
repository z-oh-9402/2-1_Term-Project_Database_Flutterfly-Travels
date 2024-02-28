import PropTypes from 'prop-types'
import "../Styles/card.css"
import ItemCard from './ItemCard';

const CategorizedDestination = ({destinationObj}) => {
    return (
      <>
        {destinationObj.map((d, index) => (
          d.destinations.length>0 &&
            <div key={index} className='destination-info-container'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', paddingRight: '40px'}}>
                  <h2>{d.category}</h2>
                  {d.destinations.length>4 && <div style={{color: 'gray'}}>see all</div>}
                </div>
                <div className='card-container'>
                    {d.destinations.map((destination,index2)=>
                      index2<4 && <ItemCard key={index2} itemType='destination' item={destination} index={`${d.category}${index2}`}/>
                    )}
                </div>
            </div>
        ))}
      </>
    );
};

CategorizedDestination.propTypes = {
    destinationObj: PropTypes.array
}

export default CategorizedDestination;
