import "../Styles/button.css"
import "../Styles/login-signup.css"

import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import Rating from "./Rating";
import UserInfoContext from "../Context/UserInfoContext";
import { useContext, useState } from "react";

const max_review_length = 700;

const ReviewsAndRatings = (props) => {
    const { personalRating, personalReview, reviews, handleSubmit } = props;
    const { rating, setRating } = personalRating;
    const { review, setReview } = personalReview;
    const [seeAllReviews, setSeeAllReviews] = useState(false);
    const { userInfo } = useContext(UserInfoContext);

    const handleGoToCurrentPage = () => {
        setSeeAllReviews(false);
    }

    const handleReviewChange = (e) => {
        if (e.target.value.length <= max_review_length) {
            setReview(e.target.value);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', marginBottom: "20px", justifyContent: (userInfo !== null && userInfo.USER_TYPE === 'customer') ? "space-between" : 'center', width: "600px" }}>
                {userInfo !== null && userInfo.USER_TYPE === 'customer' &&
                    <div className="review-section" style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px", fontFamily: "Arial, sans-serif" }}>
                        <h2 style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>Leave your feedback</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <label style={{ marginBottom: "10px", fontFamily: "Arial, sans-serif" }}>Your Rating:</label>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: "20px" }}>
                                <Rating rating={rating} state={1} setRating={setRating} />
                            </div>

                            <textarea style={{ color: "white", marginBottom: "20px", width: "90%", minHeight: "100px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", resize: "vertical", fontFamily: "Arial, sans-serif", background: "linear-gradient(to right, #2C2A2A, #292424)" }} value={review} placeholder="Write your review here..." onChange={handleReviewChange} />
                            <p style={{ marginBottom: "10px", fontFamily: "Arial, sans-serif" }}>{review.length}/{max_review_length}</p>
                            <button className="btn-primary" style={{ borderRadius: "5px", fontFamily: "Arial, sans-serif" }} onClick={handleSubmit}>Submit Review</button>
                        </div>
                    </div>

                }
            </div>

            <div className="all-review" style={{ width: "300px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                    <h2 style={{ marginBottom: '0' }}>All Reviews ({reviews.length})</h2>
                    {reviews.length > 3 && (
                        <div className="see-all-link" style={{ cursor: 'pointer' }} onClick={() => setSeeAllReviews(true)}>see all</div>
                    )}
                </div>
                {reviews.map((item, index) => (
                    index < 3 && (
                        <div key={index} style={{
                            border: "2px solid", borderRadius: "5px", padding: "20px", marginBottom: "20px", backgroundColor: "transparent"
                        }}>
                            <p style={{fontWeight: "bold", fontSize: 18, color: 'lightgrey'}}>{item.USERNAME}</p>
                            <Rating rating={item.RATING} state={0} setRating={null} />
                            <p>{item.REVIEW}</p>
                            <p>{item.CREATED_AT}</p>
                        </div>
                    )
                ))}
            </div>

            {seeAllReviews &&
                <div className='login-signup-popup'>
                    <div className="close-container" style={{ position: 'relative', color: "black" }}>
                        <ImCross className='close' onClick={handleGoToCurrentPage} />
                        <div className='login-signup-container review-container'>
                            <div>
                                <h1>Reviews and Ratings</h1>
                                {reviews.map((item, index) => (
                                    <div key={index} style={{ border: "1px solid gray", borderRadius: "5px", padding: "20px", marginBottom: "20px", background: "linear-gradient(to right, rgba(100, 100, 100, 0.5), rgba(20, 20, 20, 0.5))" }}>
                                        <p style={{ fontSize: "18px", fontWeight: "bold" }}>{item.USERNAME}</p>
                                        <Rating rating={item.RATING} state={0} setRating={null} />
                                        <p>{item.REVIEW}</p>
                                        <p>{item.CREATED_AT}</p>
                                    </div>
                                ))}
                            </div>
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