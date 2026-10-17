import PropTypes from 'prop-types'
import { useState } from 'react';
import "../Styles/card.css"
import ItemCard from './ItemCard';

const CategorizedDestination = ({destinationObj}) => {
    // categories the user has expanded past the first 4 cards
    const [expanded, setExpanded] = useState({});
    const toggle = (category) => setExpanded(prev => ({...prev, [category]: !prev[category]}));

    return (
      <>
        {destinationObj.map((d, index) => (
          d.destinations.length>0 &&
            <div key={index} className='destination-info-container'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', paddingRight: '40px'}}>
                  <h2>{d.category}</h2>
                  {d.destinations.length>4 &&
                    <div className="see-all-link" role="button" tabIndex={0}
                         onClick={() => toggle(d.category)}
                         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(d.category)}>
                      {expanded[d.category] ? 'show less' : 'show more'}
                    </div>}
                </div>
                <div className='card-container'>
                    {d.destinations.map((destination,index2)=>
                      (expanded[d.category] || index2<4) && <ItemCard key={index2} itemType='destination' item={destination} index={`${d.category}${index2}`}/>
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
