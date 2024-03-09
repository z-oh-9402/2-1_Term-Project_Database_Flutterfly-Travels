import { useContext, useEffect} from 'react';
import '../Styles/notification.css';
import PropTypes from 'prop-types';
import '../Styles/login-signup.css';
import UserInfoContext from '../Context/UserInfoContext';

const Notification = (props) => {
    const {notifications} = props;
    const {showDetailedNotification, setShowDetailedNotification} = useContext(UserInfoContext);

    useEffect(() => {
        const handleScroll = () => {
            let element;
            const scrollThreshold = document.getElementById('main-nav').offsetHeight;
            if(notifications.length!==0)
            {
                if(showDetailedNotification)
                {
                    element = document.getElementById('detailed-notif')
                    element.style.top = `${scrollThreshold+5}px`;
                }
            }
        }

        handleScroll();
    }
    , [showDetailedNotification, notifications]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = document.getElementById('main-nav').offsetHeight;

            if(window.scrollY >= (scrollThreshold))
            {
                setShowDetailedNotification(false);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showDetailedNotification]);

    return (
        <>
            <div style={{position: 'relative'}}>
                {showDetailedNotification && notifications.length!==0 &&
                <div id='detailed-notif' className='detailed-notification'>
                    {notifications.map((notification, index) =>
                        <div key={index} className="detailed-notification-item">
                            <p>{notification.CONTENT}</p>
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