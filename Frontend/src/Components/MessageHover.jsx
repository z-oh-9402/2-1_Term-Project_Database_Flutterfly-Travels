import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BsChatDots } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import UserInfoContext from '../Context/UserInfoContext';
import { canStartChat } from '../chat';
import { AgentProfilePopup } from './AgentProfile';
import '../Styles/chat.css';

// Wraps a person shown somewhere (a trip's agent or customer, a picked agent, the chat's other person): hovering it
// offers "View profile" for agents (their name, marked with the class person-link-name, is highlighted like a link;
// only the button opens the profile) and "Send message", which opens the chat with them. Nothing is added for people
// with no profile the user can't message (see canStartChat).
// person needs user_id, user_type and username; onOpen runs before the chat opens (e.g. to close the popup the
// person is shown in); onViewProfile replaces the profile popup (My Trips shows the profile in place); showMessage
// false leaves out "Send message" (in the chat itself).
const MessageHover = ({ person, onOpen, onViewProfile, showMessage = true, children }) => {
    const { userInfo } = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const canMessage = showMessage && canStartChat(userInfo, person);
    const hasProfile = !!userInfo && person.user_type === 'agent' && person.user_id !== userInfo.user_id;

    if(!canMessage && !hasProfile)
    {
        return children;
    }

    const openChat = (e) => {
        // the person may sit inside something clickable (a trip card)
        e.stopPropagation();
        setIsOpen(false);
        onOpen?.();
        navigate(`/chats/${encodeURIComponent(person.username)}`);
    }

    const viewProfile = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        if(onViewProfile)
        {
            onViewProfile();
        }
        else
        {
            setShowProfile(true);
        }
    }

    return (
        <>
            <span className={'message-hover' + (hasProfile ? ' has-profile' : '') + (canMessage ? ' has-message' : '')}
                  {...((hasProfile || canMessage) && { tabIndex: 0 })}
                  onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}
                  onFocus={() => setIsOpen(true)} onBlur={(e) => { if(!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false); }}>
                {children}
                {isOpen &&
                <span className='message-hover-pop'>
                    {hasProfile &&
                        <button type='button' onClick={viewProfile} onKeyDown={(e) => e.stopPropagation()}>
                            <FaUser/> View profile
                        </button>}
                    {canMessage &&
                        <button type='button' onClick={openChat} onKeyDown={(e) => e.stopPropagation()}>
                            <BsChatDots/> Send message
                        </button>}
                </span>}
            </span>
            {showProfile && <AgentProfilePopup agentId={person.user_id} onClose={() => setShowProfile(false)} onOpenChat={onOpen}/>}
        </>
    );
};

MessageHover.propTypes = {
    person: PropTypes.shape({
        user_id: PropTypes.number,
        user_type: PropTypes.string,
        username: PropTypes.string,
    }).isRequired,
    onOpen: PropTypes.func,
    onViewProfile: PropTypes.func,
    showMessage: PropTypes.bool,
    children: PropTypes.node,
};

export default MessageHover;
