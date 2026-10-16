import PropTypes from 'prop-types'
import "../Styles/rating.css"

// Shows a rating as butterflies, e.g. 3.5 = three full, one half, one empty; 0 (not rated yet) = five empty.
// count, when given, is how many customers rated the item and is shown in brackets.
// With isChanging, it's an input: clicking the n-th butterfly calls setRating(n) (the parent keeps the value).
const Rating = ({rating, isChanging, setRating, count}) => {
    const value = Number.isFinite(rating) ? rating : 0;

    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    const noStars = 5 - Math.ceil(value);

    const star = (src, starNumber) => (
        isChanging ?
            <img className='rating change-rating' src={src} key={starNumber} onClick={() => setRating(starNumber)}/>
        :
            <img className='rating' src={src} key={starNumber}/>
    );

    return(
        <span className='item-rating' style={{display: 'inline-block'}}>
            <span className='rating-container'>
                {!isChanging ? <span>{value}</span> : null}
                {Array.from({ length: fullStars }, (_, index) => star("/fullstar.png", index + 1))}
                {hasHalfStar && star("/halfstar.png", fullStars + 1)}
                {Array.from({ length: noStars }, (_, index) => star("/nostar.png", Math.ceil(value) + index + 1))}
                {!isChanging && Number.isFinite(count) &&
                    <span className='rating-count' title={`${count} ${count === 1 ? 'rating' : 'ratings'}`}>({count})</span>}
            </span>
        </span>
    )
}

Rating.propTypes = {
    rating: PropTypes.number,
    isChanging: PropTypes.bool.isRequired,
    setRating: PropTypes.func,
    count: PropTypes.number
}

export default Rating;
