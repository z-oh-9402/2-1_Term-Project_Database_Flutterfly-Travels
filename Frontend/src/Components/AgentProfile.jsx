import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { ImCross } from 'react-icons/im';
import { BsChatDots } from 'react-icons/bs';
import Rating from './Rating';
import UserInfoContext from '../Context/UserInfoContext';
import { canStartChat } from '../chat';
import { errorMessage, money } from './tripHelpers';
import { apiFetch, photoUrl } from '../api';
import '../Styles/my-trips.css';
import '../Styles/agent-profile.css';

const MAX_REVIEW_LENGTH = 700;

// Customers' reviews of an agent (GET /agent/review-rating/:agentId), newest first; also on the agent's own profile
export const ReviewList = ({ reviews }) => (
    <div className='agent-reviews'>
        {reviews.map((item) =>
            <div key={item.review_id} className='agent-review'>
                <div className='agent-review-top'>
                    <img className='my-trip-avatar' src={photoUrl(item.photo)} alt=''/>
                    <span className='agent-review-author'>{item.username}</span>
                    <Rating rating={parseFloat(item.rating)} isChanging={false}/>
                    <span className='agent-review-date'>{item.created_at}</span>
                </div>
                <p>{item.review}</p>
            </div>
        )}
    </div>
);

// An agent's profile inside My Trips (opened from a trip's agent): who they are, their fee and rating, a feedback
// form for customers they have worked with, and the reviews customers left them
const AgentProfile = ({ agentId, backLabel, onBack, onOpenChat }) => {
    const { userInfo } = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [agent, setAgent] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [myRating, setMyRating] = useState(0);
    const [savedRating, setSavedRating] = useState(0);
    const [myReview, setMyReview] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [note, setNote] = useState(null); // {text, isError} under the feedback form

    // the agent (with their current average) and the reviews; loaded again after this customer leaves feedback
    const load = useCallback(async () => {
        const [agentResponse, reviewsResponse] = await Promise.all([
            apiFetch(`http://localhost:3000/agent/fetch/${agentId}`, { method: 'GET' }),
            apiFetch(`http://localhost:3000/agent/review-rating/${agentId}`, { method: 'GET' }),
        ]);
        return {
            agent: agentResponse.ok ? await agentResponse.json() : null,
            reviews: reviewsResponse.ok ? await reviewsResponse.json() : [],
        };
    }, [agentId]);

    useEffect(() => {
        let ignore = false;
        load().then((result) => {
            if(!ignore)
            {
                setAgent(result.agent);
                setReviews(result.reviews);
            }
        });
        apiFetch(`http://localhost:3000/agent/review-rating/${agentId}/${userInfo.user_id}`, { method: 'GET' })
            .then(response => response.ok ? response.json() : 0)
            .then(rating => {
                if(!ignore)
                {
                    setMyRating(Number(rating));
                    setSavedRating(Number(rating));
                }
            });
        return () => { ignore = true; };
    }, [load, agentId, userInfo.user_id]);

    // customers can rate an agent once the agent has taken one of their trips (the server checks this too)
    const canReview = userInfo.user_type === 'customer' &&
        (userInfo.trips ?? []).some(trip => trip.agent_id === agentId && trip.trip_status !== 'REQUESTING');

    const person = agent && { user_id: agentId, user_type: 'agent', username: agent.username };

    const openChat = () => {
        onOpenChat?.();
        navigate(`/chats/${encodeURIComponent(agent.username)}`);
    }

    const submit = async () => {
        if(!myRating)
        {
            setNote({ text: 'Choose a rating first.', isError: true });
            return;
        }
        setIsSaving(true);
        setNote(null);
        const response = await apiFetch(`http://localhost:3000/agent/review-rating/${agentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: myRating, review: myReview.trim() })
        });
        if(response.ok)
        {
            const result = await load();
            setAgent(result.agent);
            setReviews(result.reviews);
            setSavedRating(myRating);
            setMyReview('');
            setNote({ text: myReview.trim() ? 'Thanks! Your rating and review are saved.' : 'Thanks! Your rating is saved.', isError: false });
        }
        else
        {
            setNote({ text: await errorMessage(response, 'Could not save your feedback'), isError: true });
        }
        setIsSaving(false);
    }

    const back = onBack && <button className='my-trips-back' onClick={onBack}><IoArrowBack/> {backLabel}</button>;

    if(!agent)
    {
        return <>{back}<div className='my-trips-empty'>Loading the agent&apos;s profile...</div></>;
    }

    const ratingCount = Number(agent.rating_count);
    const fullName = [agent.first_name, agent.last_name].filter(Boolean).join(' ');

    return (
        <div className='agent-profile'>
            {back}

            <div className='agent-profile-head'>
                <img className='agent-profile-photo' src={photoUrl(agent.photo)} alt=''/>
                <div className='agent-profile-name'>
                    <h2>{agent.username}</h2>
                    <span className='my-trip-stat-note'>{fullName ? `${fullName} · ` : ''}Travel agent</span>
                </div>
                {canStartChat(userInfo, person) &&
                    <button className='my-trips-btn agent-profile-message' onClick={openChat}><BsChatDots/> Send message</button>}
            </div>

            <div className='my-trip-stats agent-profile-stats'>
                <div className='my-trip-stat'>
                    <span className='my-trip-stat-label'>Experience</span>
                    <span className='my-trip-stat-value'>{agent.experience_years} {Number(agent.experience_years) === 1 ? 'year' : 'years'}</span>
                </div>
                <div className='my-trip-stat'>
                    <span className='my-trip-stat-label'>Fee</span>
                    <span className='my-trip-stat-value my-trip-cost'>{money(agent.fee)}</span>
                    <span className='my-trip-stat-note'>per trip</span>
                </div>
                <div className='my-trip-stat'>
                    <span className='my-trip-stat-label'>Rating</span>
                    {ratingCount === 0 ?
                        <span className='my-trip-stat-note'>No ratings yet</span> :
                        <>
                            <span className='my-trip-stat-value'><Rating rating={parseFloat(agent.rating)} isChanging={false}/></span>
                            <span className='my-trip-stat-note'>from {ratingCount} {ratingCount === 1 ? 'customer' : 'customers'}</span>
                        </>}
                </div>
            </div>

            {canReview &&
            <section className='agent-feedback'>
                <h3 className='my-trip-section-title'>{savedRating ? 'Your feedback' : `Rate ${agent.username}`}</h3>
                <div className='agent-feedback-stars'>
                    <Rating rating={myRating} isChanging={true} setRating={(rating) => { setMyRating(rating); setNote(null); }}/>
                    <span className='my-trip-stat-note'>
                        {savedRating && myRating === savedRating ? `You rated them ${savedRating} of 5` : myRating ? `${myRating} of 5` : ''}
                    </span>
                </div>
                <textarea className='agent-feedback-text' value={myReview} maxLength={MAX_REVIEW_LENGTH}
                          placeholder={`How was planning your trip with ${agent.username}? (optional)`}
                          onChange={(e) => { setMyReview(e.target.value); setNote(null); }}/>
                <div className='agent-feedback-footer'>
                    <span className={'agent-feedback-note' + (note?.isError ? ' error' : '')}>
                        {note ? note.text : `${myReview.length}/${MAX_REVIEW_LENGTH}`}
                    </span>
                    <button className='my-trips-btn my-trips-btn-primary' onClick={submit} disabled={isSaving || !myRating}>
                        {isSaving ? 'Saving...' : savedRating ? 'Update feedback' : 'Submit'}
                    </button>
                </div>
            </section>}

            <h3 className='my-trip-section-title'>Reviews{reviews.length !== 0 && ` (${reviews.length})`}</h3>
            {reviews.length === 0 ?
                <div className='my-trips-empty'>No reviews yet.{canReview && ' Be the first to write one.'}</div>
            :
            <ReviewList reviews={reviews}/>}
        </div>
    );
}

// The same profile in a popup of its own, over whatever is open (a picked agent, the chat page). Clicks inside it
// stay inside it, so they don't reach what the person was shown in (a trip card opens its trip on click).
export const AgentProfilePopup = ({ agentId, onClose, onOpenChat }) => createPortal(
    <div className='login-signup-popup' onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <div className="close-container" style={{position: 'relative'}}>
            <ImCross className='close' onClick={onClose}/>
            <div className='login-signup-container trip-container'>
                <AgentProfile agentId={agentId} onOpenChat={() => { onClose(); onOpenChat?.(); }}/>
            </div>
        </div>
    </div>,
    document.body
);

AgentProfile.propTypes = {
    agentId: PropTypes.number.isRequired,
    backLabel: PropTypes.node,
    onBack: PropTypes.func,
    onOpenChat: PropTypes.func,
}

ReviewList.propTypes = {
    reviews: PropTypes.array.isRequired,
}

AgentProfilePopup.propTypes = {
    agentId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpenChat: PropTypes.func,
}

export default AgentProfile;
