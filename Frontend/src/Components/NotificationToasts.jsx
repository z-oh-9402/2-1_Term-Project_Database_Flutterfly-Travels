import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBell } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import '../Styles/notification.css';

const SHOW_FOR_MS = 2000;

// One pop-up: it closes itself after a few seconds, or when its cross is clicked; clicking it opens the notification panel
const Toast = ({ toast, onDismiss, onOpen }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), SHOW_FOR_MS);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div className='notification-toast' role='status' onClick={() => { onDismiss(toast.id); onOpen(); }}>
            <FaBell className='notification-toast-icon'/>
            <div className='notification-toast-text'>
                <span className='notification-toast-title'>New notification</span>
                <p>{toast.content}</p>
            </div>
            <button className='notification-toast-close' aria-label='Close' onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}>
                <RxCross2/>
            </button>
            <span className='notification-toast-timer' style={{animationDuration: `${SHOW_FOR_MS}ms`}}/>
        </div>
    );
}

Toast.propTypes = {
    toast: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
};

// New notifications pop up in the top-right corner for a moment before they wait in the notification panel
const NotificationToasts = ({ toasts, onDismiss, onOpen }) => (
    <div className='notification-toasts' aria-live='polite'>
        {toasts.map(toast => <Toast key={toast.id} toast={toast} onDismiss={onDismiss} onOpen={onOpen}/>)}
    </div>
);

NotificationToasts.propTypes = {
    toasts: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
};

export default NotificationToasts;
