import { useContext, useEffect} from 'react';
import '../Styles/notification.css';
import PropTypes from 'prop-types';
import '../Styles/login-signup.css';
import UserInfoContext from '../Context/UserInfoContext';

const Notification = (props) => {
    const {notifications} = props;
    const {showDetailedNotification} = useContext(UserInfoContext);

    useEffect(() => {
        const handleScroll = () => {
            let element;
            const scrollThreshold = document.getElementById('main-nav').offsetHeight;
            if(notifications.length!==0)
            {
                if(showDetailedNotification)
                {
                    element = document.getElementById('detailed-notif')
                    element.style.top = `${scrollThreshold}px`;
                }
            }
        }

        handleScroll();
    }
    , [showDetailedNotification, notifications]);

    return (
        <>
            <div style={{position: 'relative'}}>
                {showDetailedNotification && notifications.length!==0 &&
                <div id='detailed-notif' className='detailed-notification'>
                    {notifications.map((notification, index) =>
                        <div key={index} className="detailed-notification-item">
                            <p>{notification.content}</p>
                        </div>
                    )}
                </div>}
            </div>
        </>
    ); 
}

Notification.propTypes = {
    notifications: PropTypes.array,
    instantNotifications: PropTypes.array
}

export default Notification;