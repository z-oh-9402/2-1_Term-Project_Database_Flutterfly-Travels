import PropTypes from 'prop-types'
import { useState } from 'react';
import "../Styles/rating.css"

const Rating = ({rating, isChanging, setRating}) => {
    const [fullStars, setFullStars] = useState(Math.floor(rating));
    const [noStars, setNoStars] = useState(5 - Math.ceil(rating));

    const rateItem = (rating) => {
        if(isChanging)
        {
            setRating(rating);
            setFullStars(rating);
            setNoStars(5-rating);
        }
    }

    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
        isChanging ?
            <img className='rating change-rating' src="/fullstar.png" key={index} onClick={() => {rateItem(index+1)}}/>
        :
            <img className='rating' src="/fullstar.png" key={index}/>
    ));

    const noStarsArray = Array.from({ length: noStars }, (_, index) => (
        isChanging ?
            <img className='rating change-rating' src="/nostar.png" key={index} onClick={() => {rateItem(Math.ceil(rating)+index+1)}}/>
        :
            <img className='rating' src="/nostar.png" key={index}/>
    ));

    return(
        <div className='item-rating' style={{display: 'inline-block'}}>
            <div className='rating-container'>
                {!isChanging ? <span>{rating}</span> : null}
                {fullStarsArray}
                {rating%1!==0 && <img className='rating' src="/halfstar.png"/>}
                {noStarsArray}
            </div>
        </div>
    )
}

Rating.propTypes = {
    rating: PropTypes.number,
    isChanging: PropTypes.bool.isRequired,
    setRating: PropTypes.func
}

export default Rating;