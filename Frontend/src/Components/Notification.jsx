import { useContext, useEffect, useState } from 'react';
import '../Styles/notification.css';
import PropTypes from 'prop-types';
import { IoMdNotificationsOutline } from "react-icons/io";
import UserInfoContext from '../Context/UserInfoContext';

// "just now", "5 min ago", "3 h ago", "yesterday", or the date for anything older
const timeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if(minutes < 1) return 'just now';
    if(minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if(hours < 24) return `${hours} h ago`;
    if(hours < 48) return 'yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const fullDate = (date) => date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

const Notification = (props) => {
    const {notifications, onSeen} = props;
    const {showDetailedNotification, setShowDetailedNotification} = useContext(UserInfoContext);
    // Notifications that were unread while the list was open stay highlighted until it is closed
    const [highlightedIds, setHighlightedIds] = useState([]);

    // While the list is open, a click anywhere outside it (or Escape) closes it.
    // Clicks on the bell are left to the bell's own toggle, so clicking it again also closes the list.
    useEffect(() => {
        if(!showDetailedNotification)
        {
            return;
        }

        const closeOnOutsideClick = (event) => {
            if(!event.target.closest('#detailed-notif, .notification-bell'))
            {
                setShowDetailedNotification(false);
            }
        }
        const closeOnEscape = (event) => {
            if(event.key === 'Escape')
            {
                setShowDetailedNotification(false);
            }
        }

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [showDetailedNotification, setShowDetailedNotification]);

    useEffect(() => {
        if(!showDetailedNotification)
        {
            setHighlightedIds([]);
            return;
        }

        const unreadIds = notifications
            .filter(notification => notification.notification_status === 'NOT SHOWED')
            .map(notification => notification.notification_id);

        if(unreadIds.length!==0)
        {
            setHighlightedIds(prevIds => [...prevIds, ...unreadIds]);
            onSeen();
        }
    }, [showDetailedNotification, notifications, onSeen]);

    if(!showDetailedNotification)
    {
        return null;
    }

    const newCount = notifications.filter(notification => highlightedIds.includes(notification.notification_id)).length;

    // Positioned against the navbar (see navbar.css), just under its right end
    return (
        <div id='detailed-notif' className='detailed-notification' role='dialog' aria-label='Notifications'>
            <div className='notification-header'>
                <h3>Notifications</h3>
                {newCount!==0 && <span className='notification-new-count'>{newCount} new</span>}
            </div>

            {notifications.length===0 ?
                <div className='no-notification'>
                    <IoMdNotificationsOutline className='no-notification-icon'/>
                    <p>No notifications yet</p>
                    <span>Updates about your trips and account will show up here.</span>
                </div>
                :
                <ul className='notification-list'>
                    {notifications.map((notification) => {
                        const createdAt = new Date(notification.created_at);
                        return (
                            <li key={notification.notification_id} className={"detailed-notification-item" + (highlightedIds.includes(notification.notification_id) ? " unread" : "")}>
                                <p>{notification.content}</p>
                                <time className="notification-time" dateTime={createdAt.toISOString()} title={fullDate(createdAt)}>{timeAgo(createdAt)}</time>
                            </li>
                        );
                    })}
                </ul>}
        </div>
    );
}

Notification.propTypes = {
    notifications: PropTypes.array.isRequired,
    onSeen: PropTypes.func.isRequired
}

export default Notification;
