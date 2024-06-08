import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import ReviewsAndRatings from './ReviewsAndRatings';
import UserInfoContext from '../Context/UserInfoContext';
import { useContext, useEffect, useState } from 'react';

const AgentProfile = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {agent, setShowAgentProfile} = props;
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState([]);
    const [allReviews, setAllReviews] = useState([]);

    const fetchReviews = async () => {
        const response = await fetch(`http://localhost:3000/agent/review-rating/${agent.USER_ID}/${userInfo.USER_ID}`, {
            method: "GET"
        });

        const result = await response.json();
        console.log(result);
        setRating(result);

        const response2 = await fetch(`http://localhost:3000/agent/review-rating/${agent.USER_ID}`, {
            method: "GET"
        });

        const result2 = await response2.json();
        console.log(result2);
        setAllReviews(result2);
    }

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleGoToCurrentPage = () => {
        setShowAgentProfile(false);
    }

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:3000/agent/review-rating/${agent.USER_ID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                review: review,
                rating: rating,
                customerId: userInfo.USER_ID
            })
        });

        const result = await response.json();
        console.log(result);
        fetchReviews();
        setShowAgentProfile(false);
    }

    return (
        <div className='login-signup-popup'>
            <div className="close-container" style={{position: 'relative'}}>
                <ImCross className='close' onClick={handleGoToCurrentPage} />

                <div className='login-signup-container trip-container'>
                    <h2>Agent {agent.USERNAME}</h2>
                    <div className='category-data'>
                        <h3>Experience: {agent.EXPERIENCE} years</h3>
                        <h3>Fee: {agent.FEE}</h3>
                        <h3>Rating: {agent.RATING}</h3>
                    </div>

                    <ReviewsAndRatings personalRating={{rating, setRating}} personalReview={{review, setReview}} reviews={allReviews} handleSubmit={handleSubmit}/>
                </div>
            </div>
        </div>
    );
}

AgentProfile.propTypes = {
    agent: PropTypes.object,
    setShowAgentProfile: PropTypes.func
}

export default AgentProfile;