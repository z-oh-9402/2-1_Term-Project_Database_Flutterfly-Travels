import PropTypes from 'prop-types'

const Rating = ({rating}) => {
    const fullStars = Math.floor(rating);
    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
        <img className='rating' src="fullstar.png" key={index}/>
    ));

  const hasHalfStar = (rating % 1 !== 0);

    return(
        <div className='rating-container'>
            <span>{rating}</span>
            {fullStarsArray}
            {hasHalfStar && <img className='rating' src="halfstar.png"/>}
        </div>
    )
}

Rating.propTypes = {
    rating: PropTypes.number
}

export default Rating;