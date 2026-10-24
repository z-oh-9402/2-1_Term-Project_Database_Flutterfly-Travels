import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { ReviewList } from './AgentProfile';
import { onNotification } from '../notifications';
import { apiFetch, photoUrl } from '../api';

// The reviews customers left an agent, shown in place of the agent's profile card (from "Show reviews"), under their
// photo. A new rating or review arrives as a notification (the notification_add_for_agent_feedback trigger), so the
// list reloads with every notification.
const OwnAgentReviews = ({ agentId, photo, onBack }) => {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        let ignore = false;
        const load = () => apiFetch(`http://localhost:3000/agent/review-rating/${agentId}`, { method: 'GET' })
            .then(response => response.ok ? response.json() : [])
            .then(result => { if(!ignore) setReviews(result); });
        load();
        const stopListening = onNotification(load);
        return () => { ignore = true; stopListening(); };
    }, [agentId]);

    return (
        <div className="profile-card profile-reviews">
            <button type="button" className="profile-reviews-back" onClick={onBack}><IoArrowBack/> Back to profile</button>
            <div className="profile-pic larger-profile-pic profile-card-pic"><img src={photoUrl(photo)}/></div>

            <h4 className="profile-section-title profile-reviews-title">Reviews{reviews && reviews.length !== 0 && ` (${reviews.length})`}</h4>
            {reviews === null ?
                <p className="profile-reviews-empty">Loading...</p>
            : reviews.length === 0 ?
                <p className="profile-reviews-empty">No reviews yet. Customers can review you once you take one of their trips.</p>
            :
                <ReviewList reviews={reviews}/>}
        </div>
    );
}

OwnAgentReviews.propTypes = {
    agentId: PropTypes.number.isRequired,
    photo: PropTypes.string,
    onBack: PropTypes.func.isRequired,
}

export default OwnAgentReviews;
