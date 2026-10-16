import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import ReviewsAndRatings from './ReviewsAndRatings';
import Rating from './Rating';
import UserInfoContext from '../Context/UserInfoContext';
import { useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api';

const AgentProfile = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {agent, setShowAgentProfile} = props;
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    // GET /agent/:agentId returns agent_id; GET /agent/fetch/:agentId returns user_id
    const agentId = agent.agent_id ?? agent.user_id;

    const fetchReviews = async () => {
        const response = await apiFetch(`http://localhost:3000/agent/review-rating/${agentId}/${userInfo.user_id}`, {
            method: "GET"
        });

        const result = await response.json();
        setRating(result);

        const response2 = await apiFetch(`http://localhost:3000/agent/review-rating/${agentId}`, {
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
        const response = await apiFetch(`http://localhost:3000/agent/review-rating/${agentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                review: review,
                rating: rating,
                customerId: userInfo.user_id
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
                    <h2>Agent {agent.username}</h2>
                    <div className='category-data'>
                        <h3>Experience: {agent.experience_years} years</h3>
                        <h3>Fee: {agent.fee}</h3>
                        <h3>Rating: <Rating rating={parseFloat(agent.rating)} isChanging={false} setRating={null} count={Number(agent.rating_count)}/></h3>
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