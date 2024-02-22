import PropTypes from 'prop-types'
import { useState } from 'react';

const Rating = ({rating, state, setRating}) => {
    const [fullStars, setFullStars] = useState(Math.floor(rating));
    const [noStars, setNoStars] = useState(5 - Math.ceil(rating));

    const rateItem = (index) => {
        if(state === 1)
        {
            setRating(index);
            setFullStars(index);
            setNoStars(5-index);
        }
    }

    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
        <img className='rating' src="/fullstar.png" key={index} onClick={() => {rateItem(index+1)}}/>
    ));

    const noStarsArray = Array.from({ length: noStars }, (_, index) => (
        <img className='rating' src="/nostar.png" key={index} onClick={() => {rateItem(Math.ceil(rating)+index+1)}}/>
    ));

    return(
        <div style={{display: 'inline-block'}}>
            <div className='rating-container'>
                {state === 0 ? <span>{rating}</span> : null}
                {fullStarsArray}
                {rating%1!==0 && <img className='rating' src="/halfstar.png"/>}
                {noStarsArray}
            </div>
        </div>
    )
}

Rating.propTypes = {
    rating: PropTypes.number,
    state: PropTypes.number,
    setRating: PropTypes.func
}

export default Rating;