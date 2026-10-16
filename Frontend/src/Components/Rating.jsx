import PropTypes from 'prop-types'
import "../Styles/rating.css"

// Shows a rating as butterflies, e.g. 3.5 = three full, one half, one empty.
// With isChanging, it's an input: clicking the n-th butterfly calls setRating(n) (the parent keeps the value).
const Rating = ({rating, isChanging, setRating}) => {
    const value = Number.isFinite(rating) ? rating : 0;

    // An item's rating is the average of its customers' ratings; 0 means nobody has rated it yet
    if(!isChanging && value <= 0)
    {
        return <span className='item-rating no-rating'>Not rated yet</span>;
    }

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
            </span>
        </span>
    )
}

Rating.propTypes = {
    rating: PropTypes.number,
    isChanging: PropTypes.bool.isRequired,
    setRating: PropTypes.func
}

export default Rating;
