import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BsChatDots } from 'react-icons/bs';
import UserInfoContext from '../Context/UserInfoContext';
import { canStartChat } from '../chat';
import '../Styles/chat.css';

// Wraps a person shown somewhere (a trip's agent or customer, a picked agent): hovering it offers "Send message",
// which opens the chat with them. Nothing is added for people the user can't message (see canStartChat).
// person needs user_id, user_type and username; onOpen runs first (e.g. to close the popup the person is shown in).
const MessageHover = ({ person, onOpen, children }) => {
    const { userInfo } = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    if(!canStartChat(userInfo, person))
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

    return (
        <span className='message-hover' onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}
              onFocus={() => setIsOpen(true)} onBlur={(e) => { if(!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false); }}>
            {children}
            {isOpen &&
            <span className='message-hover-pop'>
                <button type='button' onClick={openChat} onKeyDown={(e) => e.stopPropagation()}>
                    <BsChatDots/> Send message
                </button>
            </span>}
        </span>
    );
};

MessageHover.propTypes = {
    person: PropTypes.shape({
        user_id: PropTypes.number,
        user_type: PropTypes.string,
        username: PropTypes.string,
    }).isRequired,
    onOpen: PropTypes.func,
    children: PropTypes.node,
};

export default MessageHover;
