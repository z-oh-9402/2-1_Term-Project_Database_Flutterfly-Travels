import "../Styles/button.css"
import "../Styles/login-signup.css"

import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im'; 
import Rating from "./Rating";
import UserInfoContext from "../Context/UserInfoContext";
import { useContext, useState } from "react";

const max_review_length = 700;

const ReviewsAndRatings = (props) => {
    const {personalRating, personalReview, reviews, handleSubmit} = props;
    const {rating, setRating} = personalRating;
    const {review, setReview} = personalReview;
    const [seeAllReviews, setSeeAllReviews] = useState(false);
    const {userInfo} = useContext(UserInfoContext);

    const handleGoToCurrentPage = () => {
        setSeeAllReviews(false);
    }

    const handleReviewChange = (e) => {
        if(e.target.value.length <= max_review_length)
        {
            setReview(e.target.value);
        }
    };

    return(
        <>
            <div style={{display: 'flex', justifyContent: (userInfo!==null && userInfo.USER_TYPE==='customer') ? "space-between" : 'center', width: "600px"}}>
                {userInfo!==null && userInfo.USER_TYPE==='customer' &&
                <div className="review-section" style={{maxWidth: "400px"}}>
                    <h2>Leave your feedback -</h2>
                    
                    <div style={{display: 'inline-block'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <label>Your Rating: </label>
                            <Rating rating={rating} state={1} setRating={setRating}/>
                        </div>

                        <textarea value={review} placeholder="Write your review here..." onChange={handleReviewChange}/>
                        <p>{review.length}/{max_review_length}</p><br/>
                        <button className="btn-primary" onClick={handleSubmit}>Submit Review</button>
                    </div>
                </div>}

                <div className="all-review" style={{width: "300px"}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h2>All Reviews ({reviews.length})</h2>
                        {reviews.length>3 && <div className="see-all-link" onClick={()=>setSeeAllReviews(true)}>see all</div>}
                    </div>
                    {reviews.map((item,index) => (
                        index<3 &&
                        <div key={index}>
                            <p>{item.USERNAME}</p>
                            <Rating rating={item.RATING} state={0} setRating={null}/>
                            <p>{item.REVIEW}</p>
                            <p>{item.CREATED_AT}</p>
                            <br/>
                        </div>
                    ))}
                </div>
            </div>
        
            {seeAllReviews &&
            <div className='login-signup-popup'>
                <div className="close-container" style={{position: 'relative'}}>
                    <ImCross className='close' onClick={handleGoToCurrentPage} />
                    <div className='login-signup-container review-container'>
                        {userInfo!==null && 
                        <div className="review-section" style={{maxWidth: "400px"}}>
                            <h2>Leave your feedback -</h2>

                            <div style={{display: 'inline-block'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <label>Your Rating: </label>
                                    <Rating rating={rating} state={1} setRating={setRating}/>
                                </div>

                                <textarea value={review} placeholder="Write your review here..." onChange={handleReviewChange}/>
                                <p>{review.length}/{max_review_length}</p><br/>
                                <button className="btn-primary" onClick={handleSubmit}>Submit Review</button>
                            </div>
                        </div>}

                        <h1>Reviews and Ratings</h1>
                        {reviews.map((item,index) => (
                            <div key={index}>
                                <p style={{fontSize:"18px", fontWeight: "bold"}}>{item.USERNAME}</p>
                                <Rating rating={item.RATING} state={0} setRating={null}/>
                                <p>{item.REVIEW}</p>
                                <p>{item.CREATED_AT}</p>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
        </>
    )
}

ReviewsAndRatings.propTypes = {
    personalRating: PropTypes.object,
    personalReview: PropTypes.object,
    reviews: PropTypes.array,
    handleSubmit: PropTypes.func
}

export default ReviewsAndRatings;