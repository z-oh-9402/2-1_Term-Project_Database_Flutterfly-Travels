import PropTypes from 'prop-types'

const Rating = ({rating}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1 !== 0);
    const noStars = 5 - Math.ceil(rating);

    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
        <img className='rating' src="fullstar.png" key={index}/>
    ));

    const noStarsArray = Array.from({ length: noStars }, (_, index) => (
        <img className='rating' src="nostar.png" key={index}/>
    ));

    return(
        <div className='rating-container'>
            <span>{rating}</span>
            {fullStarsArray}
            {hasHalfStar && <img className='rating' src="halfstar.png"/>}
            {noStarsArray}
        </div>
    )
}

Rating.propTypes = {
    rating: PropTypes.number
}

export default Rating;