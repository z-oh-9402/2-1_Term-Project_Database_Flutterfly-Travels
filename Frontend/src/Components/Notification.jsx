import { useContext, useEffect, useState } from 'react';
import '../Styles/notification.css';
import PropTypes from 'prop-types';
import '../Styles/login-signup.css';
import UserInfoContext from '../Context/UserInfoContext';

const Notification = (props) => {
    const {notifications, onSeen} = props;
    const {showDetailedNotification, setShowDetailedNotification} = useContext(UserInfoContext);
    // Notifications that were unread while the list was open stay highlighted until it is closed
    const [highlightedIds, setHighlightedIds] = useState([]);

    useEffect(() => {
        if(showDetailedNotification)
        {
            const scrollThreshold = document.getElementById('main-nav').offsetHeight;
            document.getElementById('detailed-notif').style.top = `${scrollThreshold}px`;
        }
    }, [showDetailedNotification]);

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

    return (
        <>
            <div style={{position: 'relative'}}>
                {showDetailedNotification &&
                <div id='detailed-notif' className='detailed-notification'>
                    {notifications.length===0 ?
                        <p className="no-notification">No notifications yet</p>
                        :
                        notifications.map((notification) =>
                            <div key={notification.notification_id} className={"detailed-notification-item" + (highlightedIds.includes(notification.notification_id) ? " unread" : "")}>
                                <p>{notification.content}</p>
                                <span className="notification-time">
                                    {new Date(notification.created_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                    )}
                </div>}
            </div>
        </>
    );
}

Notification.propTypes = {
    notifications: PropTypes.array.isRequired,
    onSeen: PropTypes.func.isRequired
}

export default Notification;
